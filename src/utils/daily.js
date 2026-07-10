// ─────────────────────────────────────────────────────────────────────────
// Reto Diario (tipo Wordle). Una crisis por día, la MISMA para todos, con la
// misma secuencia de eventos (semilla derivada de la fecha). Un intento por día
// por dispositivo. Toda la infraestructura de azar ya es sembrable
// (utils/rng.js + useGameLayer); acá va la capa "diaria": qué episodio toca hoy,
// su semilla, y el estado "ya jugaste hoy" en localStorage.
// ─────────────────────────────────────────────────────────────────────────

import { episodes } from '../data/episodes/index.js'
import { seedFromDate } from './rng.js'

// Fecha local en 'YYYY-MM-DD' (el día del reto es por hora local del jugador).
export function todayISO(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Semilla estable del día (misma para todos ese día).
export function dailySeed(iso) {
  return seedFromDate(iso)
}

// Episodio del día: rotación determinista por fecha sobre los jugables.
export function dailyEpisode(iso) {
  const jugables = episodes.filter((e) => !e.bloqueado)
  return jugables[seedFromDate(iso) % jugables.length]
}

const keyFor = (iso) => `paicio.daily.${iso}`

// Resultado guardado del reto de una fecha (o null si no se jugó).
export function readDaily(iso) {
  try {
    const r = JSON.parse(localStorage.getItem(keyFor(iso)))
    return r && typeof r === 'object' ? r : null
  } catch {
    return null
  }
}

export function writeDaily(iso, result) {
  try {
    localStorage.setItem(keyFor(iso), JSON.stringify(result))
  } catch {
    /* localStorage no disponible: el reto sigue en memoria de la sesión */
  }
}

// ms hasta la próxima medianoche local (para el countdown al próximo reto).
export function msToTomorrow(d = new Date()) {
  const t = new Date(d)
  t.setHours(24, 0, 0, 0)
  return t - d
}

export function countdownLabel(ms) {
  const clamped = Math.max(0, ms)
  const h = Math.floor(clamped / 3600000)
  const m = Math.floor((clamped % 3600000) / 60000)
  const s = Math.floor((clamped % 60000) / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// Fecha corta legible ("3 jul") para las tarjetas.
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
export function fechaCorta(iso) {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[(m ?? 1) - 1] ?? ''}`
}

// Barra de estrellas tipo Wordle (verde = lograda, gris = no).
export function starBar(stars) {
  const s = Math.max(0, Math.min(3, stars ?? 0))
  return '🟩'.repeat(s) + '⬜'.repeat(3 - s)
}

// Texto compartible del reto del día. SIN SPOILERS: no revela qué crisis fue ni
// el desenlace; solo la fecha, las estrellas y el puntaje.
export function dailyShareText(iso, result = {}) {
  const stars = result.stars ?? 0
  const score = result.score ?? 0
  return [
    `PAICIO 🗓️ Reto Diario · ${fechaCorta(iso)}`,
    `${starBar(stars)}  ·  ${score} pts`,
    '¿Lo harías mejor?',
    'https://paicio.economics.cl',
  ].join('\n')
}
