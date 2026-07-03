// ─────────────────────────────────────────────────────────────────────────
// Capa de juego COMPARTIDA para las mecánicas por turnos (Ep2 corrida, Ep3
// paridad, Ep4 inercia). Generaliza lo que en Bolivia (Ep1) vivía horneado en
// hyperinflation.js: agenda de cartas de evento, momentum/combo y puntaje.
//
// Es AGNÓSTICA a los medidores: cada episodio pasa su descriptor
//   meters: [{ key, label, goodWhen: 'high' | 'low', danger }]
// y estas funciones puntúan/evalúan leyendo esos `key` del estado. Así el mismo
// código sirve para reservas/confianza, reservas/empleo o expectativas/cred.
//
// El efecto concreto sobre el estado (clamp + banderas de fin) lo aplica cada
// util con su propio `applyEvent`, porque las condiciones de colapso difieren.
// ─────────────────────────────────────────────────────────────────────────

import { shuffle } from './rng.js'

export const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

// Probabilidad de que caiga una carta al inicio de un turno (mismo valor que Ep1).
const EVENT_CHANCE = 0.5

// Precomputa qué carta (si alguna) cae en cada turno. Todo el azar se resuelve
// acá: el resto son lookups puros. Roba SIN reemplazo (~50% por turno hasta
// agotar el mazo). Con la misma `seed` sale el mismo calendario (base del futuro
// Reto diario).
export function buildEventSchedule(eventos, totalTurns, rng, chance = EVENT_CHANCE) {
  const mazo = shuffle((eventos ?? []).map((e) => e.id), rng)
  const porTurno = {}
  let next = 0
  for (let t = 1; t <= totalTurns; t++) {
    if (next >= mazo.length) break // mazo agotado
    if (rng() < chance) {
      porTurno[t] = mazo[next]
      next += 1
    }
  }
  return porTurno
}

// Carta pendiente para el turno actual (o null). No la marca vista: eso ocurre
// al resolverla.
export function eventoPendiente(eventos, schedule, turno, vistos) {
  const id = schedule[turno]
  if (!id || vistos.includes(id)) return null
  return (eventos ?? []).find((e) => e.id === id) ?? null
}

// Salud agregada del estado (0..100·nMeters). Un medidor "goodWhen: low" (p. ej.
// expectativas o inflación) aporta 100−valor; uno "high" aporta el valor.
export function health(state, meters) {
  return meters.reduce((s, m) => {
    const v = state[m.key] ?? 0
    return s + (m.goodWhen === 'low' ? 100 - v : v)
  }, 0)
}

// ¿Algún medidor cruzó su umbral de peligro?
export function inDanger(state, meters) {
  return meters.some((m) => {
    if (m.danger == null) return false
    const v = state[m.key] ?? 0
    return m.goodWhen === 'low' ? v >= m.danger : v <= m.danger
  })
}

// Un turno es "bueno" si mejoró la salud agregada y no quedó en peligro. Premia
// la disciplina; encadenar turnos buenos sube el momentum (lo lleva el hook).
export function evalTurn(prev, next, meters) {
  const mejora = health(next, meters) - health(prev, meters)
  const danger = inDanger(next, meters)
  return { mejora, danger, buenMes: mejora > 0 && !danger }
}

// Puntaje corrido de un turno (game feel): siempre suma. Base por jugar +
// recompensa por cada medidor que mejoró (en su dirección buena) + bonus de
// momentum. Solo UI; no toca la lógica de la mecánica.
export function turnReward(prev, next, meters, momentum = 0) {
  let p = 35
  for (const m of meters) {
    const pv = prev[m.key] ?? 0
    const nv = next[m.key] ?? 0
    const mejora = m.goodWhen === 'low' ? pv - nv : nv - pv
    if (mejora > 0) p += mejora * 6
  }
  p += momentum * 25
  return Math.round(p)
}

// Recompensa de resolver una carta: solo la mejora directa de medidores (sin
// base ni momentum). 0 si el shock fue neutro o dañino.
export function eventReward(prev, next, meters) {
  let r = 0
  for (const m of meters) {
    const pv = prev[m.key] ?? 0
    const nv = next[m.key] ?? 0
    const mejora = m.goodWhen === 'low' ? pv - nv : nv - pv
    if (mejora > 0) r += mejora * 6
  }
  return Math.round(r)
}

// ── Mejor intento (para el "fracaso barato": reintentar y comparar) ─────────
// Mejor puntaje histórico de un episodio en este dispositivo. Es solo game feel
// (comparación "tu mejor intento"); no afecta la lógica ni el desenlace.
const bestKey = (episodeId) => `paicio.best.${episodeId}`

export function readBest(episodeId) {
  try {
    return Number(localStorage.getItem(bestKey(episodeId))) || 0
  } catch {
    return 0
  }
}

// Registra un puntaje y devuelve el mejor histórico (tras considerar el nuevo).
export function recordBest(episodeId, score) {
  const prev = readBest(episodeId)
  const best = Math.max(prev, score ?? 0)
  try {
    if (best > prev) localStorage.setItem(bestKey(episodeId), String(best))
  } catch {
    /* localStorage no disponible */
  }
  return best
}
