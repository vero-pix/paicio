// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro) — "El Único Vendedor" / verbo SLIDER DE PRECIO.
//
// Eres la ÚNICA farmacia del pueblo. Mueves el precio de un remedio sobre su
// curva de demanda: caro → vendes poco pero con margen; barato → vendes mucho
// con poco margen. La GANANCIA = (precio − costo) × unidades es una joroba: hay
// un punto que la maximiza (el precio de monopolio, por encima del costo).
//
// La lección (mecánica = lección): el monopolista cobra por encima del costo
// porque puede. Cuando LLEGA LA COMPETENCIA (otra farmacia), la demanda se
// vuelve más elástica: el precio óptimo baja y la ganancia se achica — el
// mercado empuja el precio hacia el costo.
//
// Modelo lineal: Q = a − b·p (p = precio/escala). Ganancia = (p − c)·Q.
// Óptimo de monopolio: p* = (a/b + c)/2. Sembrable para el Reto Diario.
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed } from './rng.js'

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// Unidades vendidas a un precio dado (con la demanda `a`,`b` de la ronda).
export function unidades(cfg, demanda, elasticidad, precio) {
  const p = precio / cfg.escala
  return Math.max(0, demanda - elasticidad * p)
}

// Ganancia (en "puntos"): (precio − costo) × unidades. Puede ser negativa si
// vendes bajo el costo.
export function ganancia(cfg, demanda, elasticidad, precio) {
  const p = precio / cfg.escala
  const q = unidades(cfg, demanda, elasticidad, precio)
  return (p - cfg.costo) * q
}

// Precio de monopolio que maximiza la ganancia, redondeado al paso.
export function precioOptimo(cfg, demanda, elasticidad) {
  const p = (demanda / elasticidad + cfg.costo) / 2
  return clamp(
    Math.round((p * cfg.escala) / cfg.precioPaso) * cfg.precioPaso,
    cfg.precioMin,
    cfg.precioMax,
  )
}

export function gananciaMax(cfg, demanda, elasticidad) {
  return ganancia(cfg, demanda, elasticidad, precioOptimo(cfg, demanda, elasticidad))
}

export function initMonopolyPrice(cfg, seed = randomSeed()) {
  mulberry32(seed) // reservado (Reto Diario)
  return {
    ronda: 1,
    precio: cfg.precioInicial,
    demanda: cfg.demandaBase,
    elasticidad: cfg.elasticidadBase,
    aciertos: 0, // rondas con ganancia cerca del óptimo
    punteria: 0, // % del óptimo logrado en la última ronda
    ultimoEvento: null,
    seed,
    historial: [],
  }
}

// Fija el precio: puntúa qué tan cerca del óptimo quedó la ganancia y, al entrar
// a la siguiente ronda, aplica el shock (desplaza demanda/elasticidad).
export function applyRound(state, cfg, precio) {
  const g = ganancia(cfg, state.demanda, state.elasticidad, precio)
  const max = gananciaMax(cfg, state.demanda, state.elasticidad) || 1
  const pct = clamp(g / max, 0, 1)
  const acerto = pct >= (cfg.umbralAcierto ?? 0.85)

  let next = {
    ...state,
    precio,
    punteria: Math.round(pct * 100),
    aciertos: state.aciertos + (acerto ? 1 : 0),
    ronda: state.ronda + 1,
    ultimoEvento: null,
    historial: [
      ...state.historial,
      { ronda: state.ronda, precio, ganancia: Math.round(g), pct: Math.round(pct * 100) },
    ],
  }

  const ev = (cfg.eventos ?? []).find((e) => e.ronda === next.ronda)
  if (ev) {
    next = {
      ...next,
      demanda: Math.max(cfg.demandaMin ?? 6, state.demanda + (ev.demanda ?? 0)),
      elasticidad: Math.max(0.4, state.elasticidad * (ev.elasticidadMult ?? 1) + (ev.elasticidad ?? 0)),
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
  if (state.aciertos >= o.perfect) return 'perfect'
  if (state.aciertos >= o.partial) return 'partial'
  return 'wrong'
}
