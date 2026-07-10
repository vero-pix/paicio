// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro) — "El Dilema" / verbo DECIDIR CON CONTRAPARTE.
//
// Dos gasolineras, tú y la de enfrente. Cada semana decides: mantener el precio
// alto (colaborar) o bajarlo para robar clientes (competir). Pero la otra REACCIONA
// a lo que hiciste la vez pasada (tit-for-tat: parte colaborando y copia tu última
// jugada). Es el dilema del prisionero, iterado.
//
// Pagos (tu ganancia, la de ellos):
//   ambos precio alto  (C,C) → 3 / 3   (colusión: a los dos les va bien)
//   tú bajas, ellos no (D,C) → 5 / 0   (les robas los clientes… por una semana)
//   tú no, ellos bajan (C,D) → 0 / 5   (te los roban a ti)
//   ambos bajan        (D,D) → 1 / 1   (guerra de precios: los dos pierden)
//
// La lección (mecánica = lección): colaborar conviene a ambos, pero es difícil,
// porque siempre tienta traicionar… y si el otro reacciona, terminan en guerra de
// precios. La repetición y la reputación hacen posible la cooperación.
//
// Determinista (la contraparte reacciona a tu jugada), sembrable por consistencia.
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed } from './rng.js'

// Jugada de la contraparte (tit-for-tat): la primera vez colabora; después copia
// TU jugada de la ronda anterior.
export function jugadaRival(state) {
  return state.ronda === 1 ? 'C' : state.ultimoTuyo
}

export function pago(cfg, mi, su) {
  return cfg.pagos[mi + su] // 'CC' | 'CD' | 'DC' | 'DD'
}

export function initPriceWar(cfg, seed = randomSeed()) {
  mulberry32(seed) // reservado (consistencia / Reto Diario)
  return {
    ronda: 1,
    tuTotal: 0,
    ellosTotal: 0,
    ultimoTuyo: null,
    ultimoEllos: null,
    seed,
    historial: [],
  }
}

// Aplica tu jugada: calcula la reacción del rival y los pagos, y avanza.
export function applyRound(state, cfg, mi) {
  const su = jugadaRival(state)
  const p = pago(cfg, mi, su)
  return {
    ...state,
    tuTotal: state.tuTotal + p.tu,
    ellosTotal: state.ellosTotal + p.ellos,
    ultimoTuyo: mi,
    ultimoEllos: su,
    ronda: state.ronda + 1,
    historial: [
      ...state.historial,
      { ronda: state.ronda, tu: mi, ellos: su, pagoTu: p.tu, pagoEllos: p.ellos },
    ],
  }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas
}

export function outcomeTier(state, cfg) {
  const o = cfg.objetivo
  if (state.tuTotal >= o.perfect) return 'perfect'
  if (state.tuTotal >= o.partial) return 'partial'
  return 'wrong'
}
