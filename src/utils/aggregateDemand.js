const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initAggregateDemand(cfg) {
  return {
    ronda: 1,
    desempleo: cfg.desempleoInicial,
    inflacion: cfg.inflacionInicial,
    pib: cfg.pibInicial,
    deuda: cfg.deudaInicial,
    historial: [],
  }
}

const ACCIONES = {
  gastoPublico: {
    label: 'Aumentar gasto público',
    desc: 'Inviertes en infraestructura: carreteras, puentes, escuelas. El empleo sube pero la deuda crece.',
    efecto: { desempleo: -6, inflacion: 2, pib: 8, deuda: 12 },
  },
  tasaInteres: {
    label: 'Bajar tasa de interés',
    desc: 'Crédito más barato. Las empresas invierten y la gente compra casas. Riesgo de inflación.',
    efecto: { desempleo: -4, inflacion: 3, pib: 6, deuda: 4 },
  },
  recorteImpuestos: {
    label: 'Recortar impuestos',
    desc: 'La gente tiene más dinero para gastar. El consumo sube pero el fisco pierde ingresos.',
    efecto: { desempleo: -5, inflacion: 2, pib: 7, deuda: 8 },
  },
  confianza: {
    label: 'Medidas de confianza',
    desc: 'Garantías a inversores y estabilidad jurídica. La inversión privada crece lentamente pero sin riesgo.',
    efecto: { desempleo: -2, inflacion: 1, pib: 4, deuda: 1 },
  },
}

export const ACTIONS = Object.entries(ACCIONES).map(([id, a]) => ({ id, ...a }))

export function accionDisponible() {
  return true
}

export function previewAction(state, _cfg, accion) {
  const e = ACCIONES[accion.id]?.efecto ?? {}
  return { desempleo: e.desempleo ?? 0, inflacion: e.inflacion ?? 0, pib: e.pib ?? 0, deuda: e.deuda ?? 0 }
}

export function applyEvent(state, _evento, efecto = {}) {
  return {
    ...state,
    desempleo: clamp(state.desempleo + (efecto.desempleo ?? 0)),
    inflacion: clamp(state.inflacion + (efecto.inflacion ?? 0)),
    pib: clamp(state.pib + (efecto.pib ?? 0)),
    deuda: clamp(state.deuda + (efecto.deuda ?? 0)),
  }
}

export function playRound(state, actionId) {
  const acc = ACCIONES[actionId]
  if (!acc) return state

  return {
    ...state,
    ronda: state.ronda + 1,
    desempleo: clamp(state.desempleo + acc.efecto.desempleo),
    inflacion: clamp(state.inflacion + acc.efecto.inflacion),
    pib: clamp(state.pib + acc.efecto.pib),
    deuda: clamp(state.deuda + acc.efecto.deuda),
    historial: [...state.historial, { ronda: state.ronda, action: actionId }],
  }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas || state.desempleo >= 40 || state.inflacion >= 30
}

export function outcomeTier(state) {
  if (state.desempleo >= 40 || state.inflacion >= 30) return 'wrong'
  if (state.desempleo <= 8 && state.inflacion <= 6) return 'perfect'
  if (state.desempleo <= 15) return 'partial'
  return 'wrong'
}
