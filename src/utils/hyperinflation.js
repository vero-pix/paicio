// ─────────────────────────────────────────────────────────────────────────
// Lógica de la mecánica "La Imprenta" (Episodio 1 — hiperinflación de Weimar).
//
// La hiperinflación se ALIMENTA SOLA: imprimes dinero para pagar las cuentas
// del Estado (señoreaje), los precios suben, y necesitas imprimir aún más para
// pagar lo mismo. Cada impresión cuesta más inflación que la anterior (espiral).
//
// El jugador está apretado: imprimir dispara la inflación (que erosiona el
// apoyo del pueblo), pero el ajuste fiscal también cuesta apoyo. La única
// salida real es cortar la imprenta y lanzar una moneda creíble (el Rentenmark)
// ANTES de que la inflación sea imparable.
//
// Niveles: perfect → reforma exitosa a tiempo; wrong → inflación al máximo,
// pueblo derroca, o reforma demasiado tarde; partial → a medias.
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed, shuffle } from './rng.js'

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

// Probabilidad de que caiga una carta de evento al inicio de un mes.
const EVENT_CHANCE = 0.5

// Precomputa qué carta de evento (si alguna) cae en cada mes. Todo el azar se
// resuelve acá, en el init: el resto de la partida son lookups puros. Roba SIN
// reemplazo (baraja el mazo y va sacando en orden); ~50% por mes hasta agotarlo.
// Con la misma `seed` sale el mismo calendario → base lista para el Reto diario.
function buildEventSchedule(cfg, rng) {
  const mazo = shuffle((cfg.eventos ?? []).map((e) => e.id), rng)
  const porMes = {}
  let next = 0
  for (let mes = 1; mes <= cfg.meses; mes++) {
    if (next >= mazo.length) break // mazo agotado: no más eventos
    if (rng() < EVENT_CHANCE) {
      porMes[mes] = mazo[next]
      next += 1
    }
  }
  return porMes
}

export function initHyperinflation(cfg, seed = randomSeed()) {
  const rng = mulberry32(seed)
  return {
    inflacion: cfg.inflacionInicial, // más bajo = mejor
    apoyo: cfg.apoyoInicial, // más alto = mejor
    mes: 1,
    vecesImpreso: 0,
    alivioDeuda: 0, // renegociaciones acumuladas: amortiguan la deriva
    reformo: false,
    reformaExitosa: false,
    derrocado: false,
    colapso: false,
    usos: {},
    // ── Capa de game loop ──────────────────────────────────────────────────
    seed,
    eventosPorMes: buildEventSchedule(cfg, rng), // { [mes]: eventId }
    eventosVistos: [], // ids ya aplicados esta partida
    momentum: 0, // racha de meses "buenos" en curso
    momentumMax: 0, // mejor racha alcanzada (para el desenlace)
    log: [],
  }
}

// Carta de evento pendiente para el mes actual (o null). No la marca como vista:
// eso ocurre al aplicarla con applyEvent.
export function eventoDelMes(state, cfg) {
  const id = state.eventosPorMes[state.mes]
  if (!id || state.eventosVistos.includes(id)) return null
  return (cfg.eventos ?? []).find((e) => e.id === id) ?? null
}

// Aplica el efecto de una carta (pasiva o rama de decisión) por el MISMO clamp
// de la mecánica. Recalcula colapso/derrocado por si el shock cierra la partida.
export function applyEvent(state, evento, efecto = {}) {
  const inflacion = clamp(state.inflacion + (efecto.inflacion ?? 0))
  const apoyo = clamp(state.apoyo + (efecto.apoyo ?? 0))
  return {
    ...state,
    inflacion,
    apoyo,
    colapso: state.colapso || inflacion >= 100,
    derrocado: state.derrocado || apoyo <= 0,
    eventosVistos: [...state.eventosVistos, evento.id],
    log: [...state.log, { evento: evento.titulo, efecto }],
  }
}

// Efecto DIRECTO estimado de una acción, para telegrafiarlo antes de elegir
// ("inflación +9"). No incluye la deriva emergente de fin de mes: muestra el
// golpe inmediato de la acción para que se aprenda experimentando.
export function previewAction(state, cfg, accion) {
  if (accion.id === 'imprimir') {
    const golpe = cfg.golpeImprimir + cfg.escaladaImprimir * state.vecesImpreso
    return { inflacion: Math.round(clamp(state.inflacion + golpe) - state.inflacion), apoyo: 0 }
  }
  if (accion.id === 'reforma') {
    // Condicional: si la inflación aún es manejable, la desploma; si no, apenas.
    if (state.inflacion < cfg.umbralReforma) {
      return { inflacion: 12 - state.inflacion, apoyo: clamp(state.apoyo + 20) - state.apoyo }
    }
    return { inflacion: clamp(state.inflacion - 12) - state.inflacion, apoyo: clamp(state.apoyo - 6) - state.apoyo }
  }
  return { inflacion: accion.inflacion ?? 0, apoyo: accion.apoyo ?? 0 }
}

export function accionDisponible(state, accion) {
  if (accion.usos == null) return true
  return (state.usos[accion.id] ?? 0) < accion.usos
}

// Precio del pan (flavor): crece de forma explosiva con la inflación, para que
// se sienta la hiperinflación aunque el medidor esté acotado a 100.
export function precioPan(inflacion) {
  return Math.round(4 * Math.pow(1.14, inflacion))
}

export function playMonth(state, cfg, accion) {
  const prevUses = state.usos[accion.id] ?? 0
  const usos = { ...state.usos, [accion.id]: prevUses + 1 }
  let { inflacion, apoyo, vecesImpreso, alivioDeuda } = state
  let reformo = state.reformo
  let reformaExitosa = state.reformaExitosa

  if (accion.id === 'reforma') {
    // El Rentenmark: si la inflación aún es manejable, la desploma; si esperaste
    // demasiado, nadie cree en la moneda nueva y la reforma apenas hace mella.
    reformo = true
    if (inflacion < cfg.umbralReforma) {
      reformaExitosa = true
      inflacion = 12
      apoyo = clamp(apoyo + 20)
    } else {
      reformaExitosa = false
      inflacion = clamp(inflacion - 12)
      apoyo = clamp(apoyo - 6)
    }
    const momentum = reformaExitosa ? state.momentum + 1 : 0
    const momentumMax = Math.max(state.momentumMax, momentum)
    const report = { accionName: accion.name, advisor: accion.advisor, reaccion: accion.reaccion, buenMes: reformaExitosa, momentum }
    return {
      state: { ...state, inflacion, apoyo, reformo, reformaExitosa, momentum, momentumMax, usos, log: [...state.log, report] },
      report,
    }
  }

  // Acciones normales de mes.
  if (accion.id === 'imprimir') {
    // La espiral: cada impresión sube la inflación más que la anterior.
    const golpe = cfg.golpeImprimir + cfg.escaladaImprimir * vecesImpreso
    inflacion = clamp(inflacion + golpe)
    vecesImpreso += 1
  } else if (accion.id === 'ajuste') {
    inflacion = clamp(inflacion + (accion.inflacion ?? 0))
    apoyo = clamp(apoyo + (accion.apoyo ?? 0))
  } else if (accion.id === 'renegociar') {
    inflacion = clamp(inflacion + (accion.inflacion ?? 0))
    apoyo = clamp(apoyo + (accion.apoyo ?? 0))
    alivioDeuda += 1
  }

  // Deriva de fin de mes: la inflación alta se acelera sola (la gente gasta el
  // dinero al instante). La renegociación de la deuda amortigua esta deriva.
  const aceleracion = Math.max(0, (inflacion - 40) / 8) - alivioDeuda * 1.5
  inflacion = clamp(inflacion + Math.max(0, aceleracion))

  // El apoyo cae con la inflación (la gente no puede comprar el pan).
  const dolor = inflacion >= 65 ? 8 : inflacion >= 45 ? 5 : inflacion >= 30 ? 2 : 0
  apoyo = clamp(apoyo - dolor)

  const colapso = inflacion >= 100
  const derrocado = apoyo <= 0

  // Combo: un mes es "bueno" si FRENASTE la inflación (bajó respecto al mes
  // anterior). Premia la disciplina; imprimir la corta. La tensión la pone el
  // apoyo, que igual se desgasta. Encadenar meses buenos sube el momentum.
  const buenMes = !colapso && !derrocado && inflacion < state.inflacion
  const momentum = buenMes ? state.momentum + 1 : 0
  const momentumMax = Math.max(state.momentumMax, momentum)

  const report = {
    accionName: accion.name,
    advisor: accion.advisor,
    reaccion: accion.reaccion,
    precio: precioPan(inflacion),
    buenMes,
    momentum,
  }

  return {
    state: {
      ...state,
      inflacion,
      apoyo,
      vecesImpreso,
      alivioDeuda,
      colapso,
      derrocado,
      momentum,
      momentumMax,
      mes: state.mes + 1,
      usos,
      log: [...state.log, report],
    },
    report,
  }
}

export function isOver(state, cfg) {
  return state.reformo || state.colapso || state.derrocado || state.mes > cfg.meses
}

export function outcomeTier(state, cfg) {
  if (state.derrocado || state.apoyo <= 0) return 'wrong'
  if (state.colapso || state.inflacion >= 100) return 'wrong'
  if (state.reformo) {
    return state.reformaExitosa && state.apoyo > 20 ? 'perfect' : 'partial'
  }
  // Llegó al final de los meses sin reformar.
  return state.inflacion <= 40 ? 'partial' : 'wrong'
}
