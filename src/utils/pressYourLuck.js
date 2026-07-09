// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (archetipo #4 — "Presiona tu suerte" / push-your-luck).
// Reencuadra la hiperinflación de Ep1 como un juego de riesgo escalante SIN
// reemplazar la mecánica `hyperinflation` (se enruta por flag; ver MechanicHost).
//
// La lección (mecánica = lección): imprimir alivia HOY, pero cada vez sube la
// probabilidad de reventar en un colapso hiperinflacionario. Puedes seguir
// imprimiendo por más alivio… o cortar y estabilizar (Rentenmark) antes de que
// reviente. La seducción de la máquina de imprimir, hecha tensión.
//
// Todo el azar se resuelve en el init (rolls sembrados) → mismo `seed`, misma
// partida (base lista para el Reto diario).
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed } from './rng.js'

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initPressYourLuck(cfg, seed = randomSeed()) {
  const rng = mulberry32(seed)
  // Un "dado" [0,100) por ronda: imprimir revienta si el dado cae bajo el riesgo.
  const rolls = Array.from({ length: cfg.rondas }, () => rng() * 100)
  return {
    ronda: 1,
    pozo: 0, // alivio acumulado consolidable (más alto = mejor)
    riesgo: cfg.riesgoBase, // prob. de reventón (más bajo = mejor)
    reventado: false,
    corto: false, // el jugador cortó y estabilizó
    seed,
    rolls,
    momentum: 0,
    momentumMax: 0,
  }
}

// Alivio que rinde imprimir esta ronda: marginalmente menor cada vez (la imprenta
// pierde efecto mientras el riesgo sube — el mal negocio de la hiperinflación).
export function alivioDe(state, cfg) {
  return Math.max(6, Math.round(cfg.alivioBase - (state.ronda - 1) * cfg.alivioDecaimiento))
}

// Imprimir: si el dado de la ronda cae bajo el riesgo, revienta (colapso). Si no,
// suma alivio al pozo y sube el riesgo para la próxima.
export function imprimir(state, cfg) {
  const roll = state.rolls[state.ronda - 1] ?? 100
  if (roll < state.riesgo) {
    return { ...state, reventado: true, ronda: state.ronda + 1 }
  }
  return {
    ...state,
    pozo: clamp(state.pozo + alivioDe(state, cfg)),
    riesgo: clamp(state.riesgo + cfg.riesgoRampa),
    ronda: state.ronda + 1,
  }
}

// Cortar y estabilizar: consolida el pozo antes de que reviente.
export function cortar(state) {
  return { ...state, corto: true }
}

export function isOver(state, cfg) {
  return state.reventado || state.corto || state.ronda > cfg.rondas
}

export function outcomeTier(state, cfg) {
  if (state.reventado) return 'wrong' // la imprenta no se detuvo: colapso
  if (state.pozo >= cfg.objetivoPozo) return 'perfect'
  if (state.pozo >= cfg.objetivoPozo * 0.5) return 'partial'
  return 'wrong'
}
