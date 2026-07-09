const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initPensionReform(cfg) {
  return {
    ronda: 1,
    tasaReemplazo: cfg.tasaInicial,
    cobertura: cfg.coberturaInicial,
    costoFiscal: cfg.costoFiscalInicial,
    confianza: cfg.confianzaInicial,
    fondo: cfg.fondoInicial,
    reformsAplicadas: [],
    historial: [],
  }
}

const REFORMS = {
  subirCotizacion: {
    label: 'Subir cotización al 15%',
    desc: 'Aumentás el aporte obligatorio de 10% a 15% escalonado. La gente ahorra más, pero duele en el bolsillo.',
    efecto: { tasaReemplazo: 15, cobertura: 0, costoFiscal: -1, confianza: -5, fondo: 20 },
  },
  bajarComisiones: {
    label: 'Regular comisiones al 0.5%',
    desc: 'Topás las comisiones de administración. Los fondos se quejan, pero la plata se queda en las cuentas de la gente.',
    efecto: { tasaReemplazo: 12, cobertura: 0, costoFiscal: 0, confianza: 10, fondo: 15 },
  },
  diversificar: {
    label: 'Inversión global sin trabas',
    desc: 'Permitís que los fondos inviertan globalmente sin restricciones. Mejor rentabilidad, menos riesgo local.',
    efecto: { tasaReemplazo: 10, cobertura: 0, costoFiscal: 0, confianza: 5, fondo: 18 },
  },
  pilarSolidario: {
    label: 'Crear pilar solidario',
    desc: 'El Estado garantiza una pensión mínima para los que no acumulan. Sube cobertura, cuesta plata fiscal.',
    efecto: { tasaReemplazo: 5, cobertura: 15, costoFiscal: 2, confianza: 12, fondo: -5 },
  },
  autoMatriculacion: {
    label: 'Auto-matriculación obligatoria',
    desc: 'Todos los trabajadores entran al sistema automáticamente. Pueden salirse, pero la inercia los mantiene.',
    efecto: { tasaReemplazo: 3, cobertura: 20, costoFiscal: 0, confianza: 3, fondo: 8 },
  },
  fondoPorDefecto: {
    label: 'Fondo por defecto por edad',
    desc: 'Los jóvenes van a fondos más riesgosos (mayor rentabilidad), los mayores a conservadores. Mejor resultado promedio.',
    efecto: { tasaReemplazo: 8, cobertura: 0, costoFiscal: 0, confianza: 7, fondo: 12 },
  },
}

export const REFORM_LIST = Object.entries(REFORMS).map(([id, r]) => ({ id, aplicada: false, ...r }))

export function applyReform(state, reformId) {
  const r = REFORMS[reformId]
  if (!r || state.reformsAplicadas.includes(reformId)) return state

  return {
    ...state,
    ronda: state.ronda + 1,
    tasaReemplazo: clamp(Math.round(state.tasaReemplazo + r.efecto.tasaReemplazo)),
    cobertura: clamp(Math.round(state.cobertura + r.efecto.cobertura)),
    costoFiscal: clamp(Math.round(state.costoFiscal + r.efecto.costoFiscal)),
    confianza: clamp(Math.round(state.confianza + r.efecto.confianza)),
    fondo: clamp(Math.round(state.fondo + r.efecto.fondo)),
    reformsAplicadas: [...state.reformsAplicadas, reformId],
    historial: [...state.historial, { ronda: state.ronda, reform: reformId }],
  }
}

export function skipRound(state) {
  return {
    ...state,
    ronda: state.ronda + 1,
    confianza: clamp(state.confianza - 3),
    historial: [...state.historial, { ronda: state.ronda, reform: 'saltar' }],
  }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas || state.confianza <= 0
}

export function outcomeTier(state) {
  if (state.confianza <= 0) return 'wrong'
  if (state.tasaReemplazo >= 70 && state.cobertura >= 85 && state.costoFiscal <= 5) return 'perfect'
  if (state.tasaReemplazo >= 45) return 'partial'
  return 'wrong'
}
