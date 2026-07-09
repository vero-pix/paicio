const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initSurplusValue(cfg) {
  return {
    ronda: 1,
    capital: cfg.capitalInicial,
    moral: cfg.moralInicial,
    produccion: cfg.produccionBase,
    historial: [],
  }
}

// efectos de cada acción
const ACCIONES = {
  jornada: {
    label: 'Extender jornada',
    desc: 'Los obreros trabajan 14 horas. Producen más pero el ánimo cae.',
    efecto: { capital: 18, moral: -12, produccion: 20 },
  },
  salario: {
    label: 'Reducir salarios',
    desc: 'Pagas menos por hora. La ganancia sube pero crece el resentimiento.',
    efecto: { capital: 22, moral: -15, produccion: -5 },
  },
  maquinaria: {
    label: 'Invertir en máquinas',
    desc: 'Compras telares mecánicos. La producción se dispara aunque los obreros desconfían.',
    efecto: { capital: -8, moral: -3, produccion: 30 },
  },
  concesion: {
    label: 'Ceder demandas',
    desc: 'Mejoras salarios y condiciones. El ánimo sube pero la ganancia se reduce.',
    efecto: { capital: -10, moral: 18, produccion: 5 },
  },
}

export const ACTIONS = Object.entries(ACCIONES).map(([id, a]) => ({ id, ...a }))

export function accionDisponible() {
  return true
}

export function previewAction(state, _cfg, accion) {
  const e = ACCIONES[accion.id]?.efecto ?? {}
  return { capital: e.capital ?? 0, moral: e.moral ?? 0, produccion: e.produccion ?? 0 }
}

export function applyEvent(state, _evento, efecto = {}) {
  return {
    ...state,
    capital: clamp(state.capital + (efecto.capital ?? 0)),
    moral: clamp(state.moral + (efecto.moral ?? 0)),
    produccion: clamp(state.produccion + (efecto.produccion ?? 0)),
  }
}

export function playRound(state, actionId) {
  const acc = ACCIONES[actionId]
  if (!acc) return state

  return {
    ...state,
    ronda: state.ronda + 1,
    capital: clamp(state.capital + acc.efecto.capital),
    moral: clamp(state.moral + acc.efecto.moral),
    produccion: clamp(state.produccion + acc.efecto.produccion),
    historial: [...state.historial, { ronda: state.ronda, action: actionId }],
  }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas || state.capital <= 0 || state.moral <= 0
}

export function outcomeTier(state) {
  if (state.capital <= 0 || state.moral <= 0) return 'wrong'
  if (state.capital >= 80 && state.moral >= 40) return 'perfect'
  if (state.capital >= 40) return 'partial'
  return 'wrong'
}
