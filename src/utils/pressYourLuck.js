// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (archetipo #4 — "Presiona tu suerte" / push-your-luck).
// Reencuadra la hiperinflación de Ep1 como un juego de riesgo escalante SIN
// reemplazar la mecánica `hyperinflation` (se enruta por flag; ver MechanicHost).
//
// La lección (mecánica = lección): imprimir alivia HOY, pero cada tanda calienta
// la imprenta y sube la probabilidad de reventar en un colapso hiperinflacionario.
// El jugador decide CUÁNTO imprimir cada ronda (tanda corta / media / todo) y
// cuándo cortar y estabilizar (Rentenmark / Decreto 21060) antes de que reviente.
//
// Profundidad (por qué ya no hay "una sola jugada óptima"):
//  1. Decisión graduada: más alivio ahora = más salto de presión ahora y después.
//  2. Incertidumbre viva: 2 eventos sembrados caen a mitad de run y mueven la
//     presión (un rescate la enfría; un shock la dispara). No se puede "resolver"
//     en abstracto: hay que leer el manómetro cada ronda y reaccionar.
//
// Todo el azar se resuelve en el init (rolls + agenda de eventos, sembrados) →
// mismo `seed`, misma partida (base lista para el Reto diario).
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed, shuffle } from './rng.js'

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

// Elige `n` rondas distintas y REPARTIDAS del listado disponible (una por
// segmento), para que el primer evento caiga temprano y el segundo más tarde.
function pickRounds(list, n, rng) {
  if (n <= 0 || list.length === 0) return []
  const out = []
  const seg = Math.floor(list.length / n) || 1
  for (let i = 0; i < n; i++) {
    const start = Math.min(i * seg, list.length - 1)
    const end = i === n - 1 ? list.length : Math.min(start + seg, list.length)
    const idx = start + Math.floor(rng() * Math.max(1, end - start))
    out.push(list[Math.min(idx, list.length - 1)])
  }
  return out
}

export function initPressYourLuck(cfg, seed = randomSeed()) {
  const rng = mulberry32(seed)
  // Un "dado" [0,100) por ronda: imprimir revienta si el dado cae bajo la presión.
  const rolls = Array.from({ length: cfg.rondas }, () => rng() * 100)
  // Protección de entrada: la 1ª tanda NUNCA revienta. En la puerta de entrada del
  // juego, el jugador siempre alcanza a ver el manómetro subir y toma una segunda
  // decisión real antes de arriesgar el colapso (patrón estándar de press-your-luck).
  if (rolls.length) rolls[0] = 100

  // Agenda: 2 eventos a mitad de run (rondas 2..rondas-1), sembrados. Cada uno
  // enfría (rescate) o calienta (shock) la presión al empezar esa ronda.
  const pool = shuffle([...(cfg.eventosImprenta ?? [])], rng)
  const nEv = Math.min(2, pool.length)
  const disponibles = []
  for (let r = 2; r <= cfg.rondas - 1; r++) disponibles.push(r)
  const rondas = pickRounds(disponibles, nEv, rng)
  const agenda = {}
  rondas.forEach((r, i) => { agenda[r] = pool[i] })

  return {
    ronda: 1,
    pozo: 0, // alivio acumulado consolidable (más alto = mejor)
    riesgo: cfg.riesgoBase, // presión / prob. de reventón (más bajo = mejor)
    reventado: false,
    corto: false, // el jugador cortó y estabilizó
    seed,
    rolls,
    agenda,
    eventoActivo: null, // evento que cayó al entrar a la ronda actual (para el banner)
    ultimaTanda: null, // id de la última tanda impresa (feedback)
  }
}

// La tanda pedida (o la más chica por defecto).
export function tandaDe(cfg, id) {
  return cfg.tandas.find((t) => t.id === id) ?? cfg.tandas[0]
}

// Alivio que rinde esta tanda esta ronda: rinde algo menos con las rondas (la
// imprenta pierde efecto mientras la presión sube — el mal negocio de imprimir).
export function alivioDe(tanda, state, cfg) {
  return Math.max(4, Math.round(tanda.alivio - (state.ronda - 1) * cfg.alivioDecaimiento))
}

// Presión resultante si imprimes esta tanda ahora (= prob. de reventar esta tanda).
export function presionTras(state, tanda) {
  return clamp(state.riesgo + tanda.calor)
}

// Aplica el evento (si lo hay) al entrar a una ronda y avanza el contador.
function avanzar(state) {
  const next = state.ronda + 1
  const ev = state.agenda[next] ?? null
  const riesgo = ev ? clamp(state.riesgo + ev.calor) : state.riesgo
  return { ...state, ronda: next, riesgo, eventoActivo: ev }
}

// Imprimir una tanda: calienta la imprenta y tira el dado contra la presión
// resultante. Si revienta, colapso. Si no, guarda el alivio y avanza (aplicando
// el evento de la nueva ronda, si toca).
export function imprimir(state, cfg, tandaId) {
  const tanda = tandaDe(cfg, tandaId)
  const roll = state.rolls[state.ronda - 1] ?? 100
  const presion = presionTras(state, tanda)
  if (roll < presion) {
    return {
      ...state,
      reventado: true,
      riesgo: presion,
      ultimaTanda: tandaId,
      eventoActivo: null,
      ronda: state.ronda + 1,
    }
  }
  const pozo = clamp(state.pozo + alivioDe(tanda, state, cfg))
  return avanzar({ ...state, pozo, riesgo: presion, ultimaTanda: tandaId })
}

// Cortar y estabilizar: consolida el pozo antes de que reviente.
export function cortar(state) {
  return { ...state, corto: true, eventoActivo: null }
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
