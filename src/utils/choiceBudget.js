// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro) — "La Elección" / verbo ASIGNAR (costo de oportunidad).
//
// Tienes plata limitada (tu mesada/sueldo) y varios deseos que compiten, cada uno
// con su PRECIO y su FELICIDAD. Eliges cuáles llevar sin pasarte del presupuesto.
// No puedes tenerlo todo: cada peso que gastas aquí es un peso que no gastas allá.
//
// La lección (mecánica = lección): el COSTO DE OPORTUNIDAD. Elegir algo significa
// renunciar a lo mejor que dejaste fuera. La restricción presupuestaria te obliga
// a priorizar; la mejor jugada maximiza la felicidad total dentro del límite.
//
// Sembrable para el Reto Diario. El óptimo (mejor combinación) se calcula por
// fuerza bruta (pocos ítems por ronda → 2^n trivial).
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed } from './rng.js'

export function itemsDeRonda(cfg, ronda) {
  return cfg.rondasData[ronda - 1] ?? cfg.rondasData[cfg.rondasData.length - 1]
}

export function costoDe(items, ids) {
  return items.filter((it) => ids.includes(it.id)).reduce((s, it) => s + it.precio, 0)
}
export function felicidadDe(items, ids) {
  return items.filter((it) => ids.includes(it.id)).reduce((s, it) => s + it.felicidad, 0)
}

// Mejor combinación posible dentro del presupuesto (para puntuar y para mostrar
// el costo de oportunidad).
export function optimo(items, presupuesto) {
  let best = { fel: 0, ids: [] }
  const n = items.length
  for (let mask = 0; mask < 1 << n; mask++) {
    let costo = 0
    let fel = 0
    const ids = []
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        costo += items[i].precio
        fel += items[i].felicidad
        ids.push(items[i].id)
      }
    }
    if (costo <= presupuesto && fel > best.fel) best = { fel, ids }
  }
  return best
}

export function initChoiceBudget(cfg, seed = randomSeed()) {
  mulberry32(seed) // reservado (Reto Diario)
  return {
    ronda: 1,
    logrado: 0, // felicidad acumulada lograda
    optimoAcum: 0, // felicidad acumulada del óptimo
    punteria: 0, // % del óptimo en la última ronda
    ultimoResumen: null,
    seed,
    historial: [],
  }
}

// Confirma la elección de la ronda: puntúa vs el óptimo, guarda qué sacrificaste
// (el deseo de más felicidad que dejaste fuera) y avanza.
export function applyRound(state, cfg, seleccion) {
  const rd = itemsDeRonda(cfg, state.ronda)
  const fel = felicidadDe(rd.items, seleccion)
  const opt = optimo(rd.items, rd.presupuesto)
  const pct = opt.fel > 0 ? fel / opt.fel : 1
  const fuera = rd.items
    .filter((it) => !seleccion.includes(it.id))
    .sort((a, b) => b.felicidad - a.felicidad)[0]

  return {
    ...state,
    logrado: state.logrado + fel,
    optimoAcum: state.optimoAcum + opt.fel,
    punteria: Math.round(pct * 100),
    ultimoResumen: {
      fel,
      optimo: opt.fel,
      sacrificio: fuera ? fuera.label : null,
    },
    ronda: state.ronda + 1,
    historial: [...state.historial, { ronda: state.ronda, fel, optimo: opt.fel }],
  }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas
}

export function outcomeTier(state, cfg) {
  const pct = state.optimoAcum > 0 ? state.logrado / state.optimoAcum : 0
  if (pct >= cfg.objetivo.perfect) return 'perfect'
  if (pct >= cfg.objetivo.partial) return 'partial'
  return 'wrong'
}
