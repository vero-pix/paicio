// ─────────────────────────────────────────────────────────────────────────
// Lógica de la mecánica "Terapia de Shock" (Episodio 7 — Perú 1990).
//
// Es un JUEGO DE VELOCIDAD vs. COSTO SOCIAL. La hiperinflación devora al
// país (~7.650% anual en 1990). El jugador aplica una estabilización de
// shock: cada ronda elige la intensidad del ajuste. Más agresivo = mata la
// inflación más rápido pero quema apoyo social. Menos agresivo = preserva
// el apoyo pero la inflación se cronifica. La destreza está en encontrar
// el punto donde la inflación se rompe sin que la sociedad reviente.
//
// Niveles de desenlace:
//   perfect → inflación derrotada (umbralInflacion) con apoyo social viable
//   partial → inflación baja pero el costo social fue enorme
//   wrong   → apoyo colapsa (gobierno cae) o inflación se descontrola
// ─────────────────────────────────────────────────────────────────────────

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initShockTherapy(cfg) {
  return {
    inflacion: cfg.inflacionInicial,
    apoyo: cfg.apoyoInicial,
    ronda: 1,
    colapso: false,
    usos: {},
    log: [],
  }
}

export function accionDisponible(state, accion) {
  if (accion.usos == null) return true
  return (state.usos[accion.id] ?? 0) < accion.usos
}

// Inflación de deriva: mientras más alta, más se autoalimenta.
function derivaInflacion(state, cfg) {
  // Si la inflación ya rompió el umbral, empieza a caer sola (expectativas rotas).
  if (state.inflacion < (cfg.umbralBreak ?? 35)) {
    return -(cfg.derivaPositiva ?? 2)
  }
  // Si sigue alta, la inercia la mantiene subiendo.
  return cfg.derivaInflacion ?? 3
}

// Desgaste social base: cada ronda de crisis desgasta el apoyo.
function desgasteSocial(state, cfg) {
  return cfg.desgasteApoyo ?? -3
}

// Juega una ronda. Aplica la acción + deriva + desgaste.
export function playRound(state, cfg, accion) {
  const prevUses = state.usos[accion.id] ?? 0
  const usos = { ...state.usos, [accion.id]: prevUses + 1 }

  let inflacion = clamp(state.inflacion + (accion.inflacion ?? 0))
  let apoyo = clamp(state.apoyo + (accion.apoyo ?? 0))

  // Deriva de inflación (se autoalimenta si está alta, cae si se rompió).
  inflacion = clamp(inflacion + derivaInflacion(state, cfg))

  // Desgaste social de fondo (la crisis cansa).
  apoyo = clamp(apoyo + desgasteSocial(state, cfg))

  const colapso = apoyo <= 0 || inflacion >= 100
  const report = {
    accionName: accion.name,
    advisor: accion.advisor,
    reaccion: accion.reaccion,
  }

  return {
    state: {
      ...state, inflacion, apoyo, ronda: state.ronda + 1, colapso, usos,
      log: [...state.log, report],
    },
    report,
  }
}

// ── Capa de juego (cartas de evento + telegrafiado) ────────────────────────

export function applyEvent(state, evento, efecto = {}) {
  const inflacion = clamp(state.inflacion + (efecto.inflacion ?? 0))
  const apoyo = clamp(state.apoyo + (efecto.apoyo ?? 0))
  return {
    ...state,
    inflacion,
    apoyo,
    colapso: state.colapso || apoyo <= 0 || inflacion >= 100,
    log: [...state.log, { evento: evento.titulo, efecto }],
  }
}

export function previewAction(state, cfg, accion) {
  if (accion.id === 'dolarizar') return {}
  return {
    inflacion: accion.inflacion ?? 0,
    apoyo: accion.apoyo ?? 0,
  }
}

export function isOver(state, cfg) {
  return state.colapso || state.ronda > cfg.rondas
}

export function outcomeTier(state, cfg) {
  if (state.colapso) return 'wrong'
  // Victoria: inflación derrotada y apoyo social aguanta.
  if (state.inflacion <= cfg.umbralInflacion && state.apoyo >= cfg.umbralApoyo) {
    return 'perfect'
  }
  // Colapso social o inflacionario.
  if (state.apoyo < cfg.umbralApoyoColapso || state.inflacion >= 80) {
    return 'wrong'
  }
  // Sobrevivió pero con daño.
  return 'partial'
}
