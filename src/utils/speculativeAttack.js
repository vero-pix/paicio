// ─────────────────────────────────────────────────────────────────────────
// Lógica de la mecánica "Defender la paridad" (Episodio 3).
//
// Es una GUERRA DE DESGASTE contra un ataque especulativo. La paridad fija
// está sobrevaluada y el mercado apuesta en contra. Cada ronda el ataque crece
// (mientras más aguantas, más fiero). Defender cuesta reservas (intervenir) o
// empleo (subir tasas). No se puede aguantar para siempre: la destreza está en
// devaluar a tiempo, de forma ordenada, antes de quemar todo.
//
// Niveles de desenlace:
//   perfect → devaluación ordenada (a tiempo, con reservas y empleo sanos)
//   partial → devaluó muy pronto (pánico) o muy tarde (con daño), o nunca soltó
//   wrong   → reservas a 0 (devaluación caótica) o empleo destruido
// ─────────────────────────────────────────────────────────────────────────

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initSpecAttack(cfg) {
  return {
    reservas: cfg.reservasIniciales,
    empleo: cfg.empleoInicial,
    dia: 1,
    devaluado: false,
    colapso: false,
    usos: {},
    log: [],
  }
}

export function accionDisponible(state, accion) {
  if (accion.usos == null) return true
  return (state.usos[accion.id] ?? 0) < accion.usos
}

// Presión especulativa de la ronda (crece con los días: guerra de desgaste).
function ataqueDelDia(state, cfg) {
  return cfg.ataqueBase + (state.dia - 1) * cfg.ataqueRamp
}

// Juega una ronda. Si la acción es 'devaluar', termina sin resolver ataque.
export function playRound(state, cfg, accion) {
  const prevUses = state.usos[accion.id] ?? 0
  const usos = { ...state.usos, [accion.id]: prevUses + 1 }

  if (accion.id === 'devaluar') {
    // Soltar la paridad detiene el ataque de inmediato. Se evalúa con los
    // medidores actuales (sin drenaje adicional).
    return {
      state: { ...state, devaluado: true, usos, log: [...state.log, { accion: accion.name }] },
      report: { accionName: accion.name, advisor: accion.advisor, reaccion: accion.reaccion, drenaje: 0 },
    }
  }

  // Defensa: la acción modula el ataque y/o cuesta reservas o empleo.
  let empleo = clamp(state.empleo + (accion.empleo ?? 0))
  let reservas = clamp(state.reservas + (accion.reservas ?? 0))

  const ataque = Math.round(ataqueDelDia(state, cfg) * (accion.ataqueMult ?? 1))
  const costoExtra = accion.reservasCosto ?? 0 // intervención directa en el mercado
  reservas = clamp(reservas - ataque - costoExtra)

  // Recesión de fondo: el empleo cae un poco cada ronda que dura la crisis.
  empleo = clamp(empleo - (cfg.recesionRonda ?? 2))

  const colapso = reservas <= 0
  const report = {
    accionName: accion.name,
    advisor: accion.advisor,
    reaccion: accion.reaccion,
    drenaje: ataque + costoExtra,
  }

  return {
    state: {
      ...state,
      reservas,
      empleo,
      colapso,
      dia: state.dia + 1,
      usos,
      log: [...state.log, report],
    },
    report,
  }
}

// ── Capa de juego (cartas de evento + telegrafiado) ────────────────────────

// Aplica el efecto de una carta sobre reservas/empleo (mismo clamp) y recalcula
// el colapso por si el shock agota las reservas.
export function applyEvent(state, evento, efecto = {}) {
  const reservas = clamp(state.reservas + (efecto.reservas ?? 0))
  const empleo = clamp(state.empleo + (efecto.empleo ?? 0))
  return {
    ...state,
    reservas,
    empleo,
    colapso: state.colapso || reservas <= 0,
    log: [...state.log, { evento: evento.titulo, efecto }],
  }
}

// Efecto DIRECTO estimado de una acción para telegrafiarlo. No incluye el
// drenaje especulativo emergente (que crece con los días): muestra el costo
// inmediato de la defensa. 'devaluar' no se telegrafía (cierra la crisis).
export function previewAction(state, cfg, accion) {
  if (accion.id === 'devaluar') return {}
  return {
    reservas: (accion.reservas ?? 0) - (accion.reservasCosto ?? 0),
    empleo: accion.empleo ?? 0,
  }
}

export function isOver(state, cfg) {
  return state.devaluado || state.colapso || state.dia > cfg.dias
}

export function outcomeTier(state, cfg) {
  // Colapso por reservas agotadas o economía destruida.
  if (state.colapso || state.reservas <= 0) return 'wrong'
  if (state.empleo < 22) return 'wrong'
  // Devaluación ordenada: soltó la paridad a tiempo, con margen y sin destruir
  // el empleo. Requiere haber resistido al menos una ronda (no rendirse al toque).
  if (
    state.devaluado &&
    state.reservas >= 20 &&
    state.empleo >= 45 &&
    state.dia >= cfg.minRondaOrdenada
  ) {
    return 'perfect'
  }
  return 'partial'
}
