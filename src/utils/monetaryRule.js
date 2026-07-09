const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initMonetaryRule(cfg) {
  return {
    ronda: 1,
    inflacion: cfg.inflacionInicial,
    desempleo: cfg.desempleoInicial,
    tasaNatural: cfg.tasaNatural,
    expectativa: cfg.expectativa,
    credibilidad: cfg.credibilidadInicial,
    historial: [],
  }
}

const ACCIONES = {
  expandir: {
    label: 'Expandir oferta',
    desc: 'Imprimes más dinero. El desempleo cae hoy, pero las expectativas de inflación suben. El costo se paga después.',
    efecto: { inflacion: 2, desempleo: -2, expectativa: 3, credibilidad: -10 },
  },
  reglaK: {
    label: 'Regla k%',
    desc: 'Mantienes la regla fija de Friedman. La inflación baja gradualmente, la credibilidad sube y el empleo tiende a su tasa natural.',
    efecto: { inflacion: -1.5, desempleo: -0.5, expectativa: -2, credibilidad: 12 },
  },
  contraer: {
    label: 'Contraer oferta',
    desc: 'Reduces el dinero. La inflación cae rápido, pero el desempleo sube — el costo de desinflación.',
    efecto: { inflacion: -4, desempleo: 3, expectativa: -1, credibilidad: 8 },
  },
}

export const ACTIONS = Object.entries(ACCIONES).map(([id, a]) => ({ id, ...a }))

export function accionDisponible() {
  return true
}

export function previewAction(state, _cfg, accion) {
  const e = ACCIONES[accion.id]?.efecto ?? {}
  return { inflacion: e.inflacion ?? 0, desempleo: e.desempleo ?? 0, expectativa: e.expectativa ?? 0, credibilidad: e.credibilidad ?? 0 }
}

export function applyEvent(state, _evento, efecto = {}) {
  return {
    ...state,
    inflacion: clamp(Math.round((state.inflacion + (efecto.inflacion ?? 0)) * 10) / 10),
    desempleo: clamp(Math.round((state.desempleo + (efecto.desempleo ?? 0)) * 10) / 10),
    expectativa: clamp(Math.round((state.expectativa + (efecto.expectativa ?? 0)) * 10) / 10),
    credibilidad: clamp(Math.round(state.credibilidad + (efecto.credibilidad ?? 0))),
  }
}

export function playRound(state, actionId) {
  const acc = ACCIONES[actionId]
  if (!acc) return state

  const e = acc.efecto

  // Para reglaK: el desempleo tiende hacia la tasa natural
  let ajusteDesempleo = e.desempleo
  if (actionId === 'reglaK') {
    if (state.desempleo > state.tasaNatural) ajusteDesempleo = -1
    else if (state.desempleo < state.tasaNatural) ajusteDesempleo = 1
    else ajusteDesempleo = 0
  }

  return {
    ...state,
    ronda: state.ronda + 1,
    inflacion: clamp(Math.round((state.inflacion + e.inflacion) * 10) / 10),
    desempleo: clamp(Math.round((state.desempleo + ajusteDesempleo) * 10) / 10),
    expectativa: clamp(Math.round((state.expectativa + e.expectativa) * 10) / 10),
    credibilidad: clamp(Math.round(state.credibilidad + e.credibilidad)),
    historial: [...state.historial, { ronda: state.ronda, action: actionId }],
  }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas || state.inflacion >= 25 || state.desempleo >= 20
}

export function outcomeTier(state) {
  if (state.inflacion >= 25 || state.desempleo >= 20) return 'wrong'
  if (state.inflacion <= 5 && state.desempleo <= 8 && state.credibilidad >= 60) return 'perfect'
  if (state.inflacion <= 10) return 'partial'
  return 'wrong'
}
