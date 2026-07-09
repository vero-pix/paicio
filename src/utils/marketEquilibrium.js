// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro, ep15) — "El Precio Justo" / verbo AGUJA DE EQUILIBRIO.
//
// Mueves el PRECIO y ves en vivo el cruce de oferta y demanda: precio muy alto →
// EXCEDENTE (sobra, góndola llena); muy bajo → ESCASEZ (falta, cola). La meta es
// VACIAR el mercado (Qd ≈ Qs) ronda a ronda, mientras shocks desplazan la demanda
// (una moda, un sustituto, más ingreso) y hay que reajustar.
//
// Modelo lineal: Qd = a − b·p, Qs = c + d·p (p = precio/escala). El equilibrio
// P* = (a − c)/(b + d) NO se le muestra al jugador: lo infiere del sobrante o la
// falta. Esa es la lección — el precio lo fija dónde se cruzan oferta y demanda.
//
// Sembrable (mulberry32) para el Reto Diario, como los demás motores.
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed } from './rng.js'

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// Cantidades ofrecida (Qs) y demandada (Qd) a un precio dado.
export function cantidades(cfg, demanda, precio) {
  const p = precio / cfg.escala
  const qd = Math.max(0, demanda - cfg.demandaPendiente * p)
  const qs = Math.max(0, cfg.ofertaIntercepto + cfg.ofertaPendiente * p)
  return { qd, qs }
}

// Precio de equilibrio para la demanda actual (uso interno / verificación; no se
// revela en la UI).
export function equilibrio(cfg, demanda) {
  const p = (demanda - cfg.ofertaIntercepto) / (cfg.demandaPendiente + cfg.ofertaPendiente)
  return Math.round((p * cfg.escala) / cfg.precioPaso) * cfg.precioPaso
}

// Estado del mercado a un precio: 'excedente' | 'escasez' | 'equilibrio'.
// gap = Qd − Qs → >0 falta (escasez), <0 sobra (excedente).
export function estado(cfg, demanda, precio) {
  const { qd, qs } = cantidades(cfg, demanda, precio)
  const gap = qd - qs
  if (Math.abs(gap) <= cfg.tolerancia) return { tipo: 'equilibrio', gap, qd, qs }
  if (gap > 0) return { tipo: 'escasez', gap, qd, qs }
  return { tipo: 'excedente', gap, qd, qs }
}

// Puntería 0–100: qué tan cerca del equilibrio quedó el precio (para el jugo).
export function precision(cfg, demanda, precio) {
  const { qd, qs } = cantidades(cfg, demanda, precio)
  const gap = Math.abs(qd - qs)
  return Math.round(100 * clamp(1 - gap / (demanda || 1), 0, 1))
}

export function initMarketEquilibrium(cfg, seed = randomSeed()) {
  mulberry32(seed) // reservado para variación futura (Reto Diario)
  return {
    ronda: 1,
    precio: cfg.precioInicial,
    demanda: cfg.demandaBase,
    vaciadas: 0,
    precision: 0,
    ultimoEvento: null,
    seed,
    historial: [],
  }
}

// Fija el precio de la ronda: evalúa el resultado, avanza y —al entrar a la
// siguiente ronda— aplica el shock que desplaza la demanda.
export function applyRound(state, cfg, precio) {
  const est = estado(cfg, state.demanda, precio)
  const vaciada = est.tipo === 'equilibrio'
  let next = {
    ...state,
    precio,
    precision: precision(cfg, state.demanda, precio),
    vaciadas: state.vaciadas + (vaciada ? 1 : 0),
    ronda: state.ronda + 1,
    ultimoEvento: null,
    historial: [
      ...state.historial,
      { ronda: state.ronda, precio, vaciada, gap: Math.round(est.gap * 10) / 10 },
    ],
  }
  const ev = (cfg.eventos ?? []).find((e) => e.ronda === next.ronda)
  if (ev) {
    next = {
      ...next,
      demanda: Math.max(cfg.demandaMin ?? 6, state.demanda + ev.delta),
      ultimoEvento: ev,
    }
  }
  return next
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas
}

export function outcomeTier(state, cfg) {
  const o = cfg.objetivo
  if (state.vaciadas >= o.perfect) return 'perfect'
  if (state.vaciadas >= o.partial) return 'partial'
  return 'wrong'
}
