// ─────────────────────────────────────────────────────────────────────────
// RNG sembrable (mulberry32) + barajado Fisher–Yates.
//
// Hoy se usa con semilla aleatoria (partida distinta cada vez). La gracia de
// que sea SEMBRABLE es el Paso 3 "Reto diario": sembrar por fecha
// (seedFromDate('2026-07-02')) da la MISMA secuencia de eventos para todos ese
// día, sin tocar nada más. Es determinista y sin dependencias.
// ─────────────────────────────────────────────────────────────────────────

// Generador determinista: devuelve una función () => float en [0,1).
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Semilla aleatoria (para partidas normales). Aislada para poder stubbearla.
export function randomSeed() {
  return Math.floor(Math.random() * 0xffffffff)
}

// Semilla estable a partir de una fecha 'YYYY-MM-DD' (para el Reto diario).
export function seedFromDate(iso) {
  let h = 2166136261
  for (let i = 0; i < iso.length; i++) {
    h ^= iso.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Baraja una copia del array con Fisher–Yates usando el rng dado (in-place-safe).
export function shuffle(array, rng) {
  const a = array.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
