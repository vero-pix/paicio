const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initVolatilityDance(cfg) {
  return {
    ronda: 1,
    cobre: 0,
    codelco: 1.0,
    historial: [],
  }
}

// velocidad base (ms por semiciclo) por ronda
const SPEEDS = [3500, 3000, 2500, 2000, 1600, 1200, 900, 700]

export function getSpeed(ronda) {
  return SPEEDS[ronda - 1] ?? 2000
}

// zona dorada según estrategia: [min, max]
function goldenZone(strategy) {
  if (strategy === 'venderAhora') return [34, 66]
  if (strategy === 'esperar') return [44, 56]
  return [38, 62]
}

// multiplicador de ganancia por estrategia
function earnMult(strategy) {
  if (strategy === 'esperar') return 1.6
  return 1.0
}

export function evalClick(pos, strategy) {
  const zone = goldenZone(strategy)
  const center = (zone[0] + zone[1]) / 2
  const dist = Math.abs(pos - center)
  const halfWidth = (zone[1] - zone[0]) / 2

  // perfect si está en el 40% central de la zona
  if (dist <= halfWidth * 0.3) return 'perfect'
  // good si está dentro de la zona
  if (dist <= halfWidth) return 'good'
  // ok si está cerca
  if (dist <= halfWidth * 2) return 'ok'
  return 'miss'
}

export function scoreFor(tier, strategy, codelco) {
  const base = { perfect: 120, good: 80, ok: 40, miss: 5 }[tier] ?? 0
  const mult = earnMult(strategy)
  return Math.round(base * mult * codelco)
}

export function playRound(state, strategy, tier) {
  const ganancia = scoreFor(tier, strategy, state.codelco)
  const costoInversion = strategy === 'invertir' ? ganancia * 0.5 : 0

  return {
    ...state,
    ronda: state.ronda + 1,
    cobre: clamp(state.cobre + ganancia - costoInversion),
    codelco: strategy === 'invertir' ? clamp(state.codelco + 0.15, 1, 3) : state.codelco,
    historial: [...state.historial, { ronda: state.ronda, strategy: strategy, tier: tier, ganancia: Math.round(ganancia - costoInversion) }],
  }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas
}

export function outcomeTier(state) {
  if (state.cobre >= 700) return 'perfect'
  if (state.cobre >= 400) return 'partial'
  return 'wrong'
}
