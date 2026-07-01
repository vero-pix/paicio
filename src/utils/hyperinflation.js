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

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initHyperinflation(cfg) {
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
    log: [],
  }
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
    const report = { accionName: accion.name, advisor: accion.advisor, reaccion: accion.reaccion }
    return {
      state: { ...state, inflacion, apoyo, reformo, reformaExitosa, usos, log: [...state.log, report] },
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

  const report = {
    accionName: accion.name,
    advisor: accion.advisor,
    reaccion: accion.reaccion,
    precio: precioPan(inflacion),
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
