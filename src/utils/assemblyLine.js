// ─────────────────────────────────────────────────────────────────────────
// Lógica de la mecánica "Línea de Montaje" (Episodio 9 — Henry Ford).
//
// Es una SIMULACIÓN DE MEJORA CONTINUA. El jugador maneja la producción
// del Ford Model T en Highland Park (1913). Cada ronda elige una
// innovación que reduce el tiempo de ensamblaje a costa de inversión.
//
// La lección: la producción en masa no es un invento — es un sistema de
// innovaciones acumulativas (línea, estandarización, integración vertical,
// incentivos al trabajador).
// ─────────────────────────────────────────────────────────────────────────

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initAssemblyLine(cfg) {
  return {
    tiempo: cfg.tiempoInicial,  // minutos por auto
    costo: cfg.costoInicial,    // costo unitario
    innovacion: 0,              // nivel de innovación acumulada
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

export function playRound(state, cfg, accion) {
  const prevUses = state.usos[accion.id] ?? 0
  const usos = { ...state.usos, [accion.id]: prevUses + 1 }

  let tiempo = clamp(state.tiempo + (accion.tiempo ?? 0))
  let costo = clamp(state.costo + (accion.costo ?? 0))
  let innovacion = clamp(state.innovacion + (accion.innovacion ?? 0))

  const report = {
    accionName: accion.name,
    advisor: accion.advisor,
    reaccion: accion.reaccion,
  }

  return {
    state: {
      ...state, tiempo, costo, innovacion, ronda: state.ronda + 1, usos,
      log: [...state.log, report],
    },
    report,
  }
}

export function applyEvent(state, evento, efecto = {}) {
  const tiempo = clamp(state.tiempo + (efecto.tiempo ?? 0))
  const costo = clamp(state.costo + (efecto.costo ?? 0))
  const innovacion = clamp(state.innovacion + (efecto.innovacion ?? 0))
  return {
    ...state, tiempo, costo, innovacion,
    log: [...state.log, { evento: evento.titulo, efecto }],
  }
}

export function previewAction(state, cfg, accion) {
  return {
    tiempo: accion.tiempo ?? 0,
    costo: accion.costo ?? 0,
    innovacion: accion.innovacion ?? 0,
  }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas
}

export function outcomeTier(state, cfg) {
  // Perfect: alcanzó o superó la meta de Ford (93 min o menos)
  if (state.tiempo <= 93) return 'perfect'
  // Partial: mejoró significativamente pero no llegó a la meta
  if (state.tiempo <= 300) return 'partial'
  // Wrong: apenas mejoró
  return 'wrong'
}
