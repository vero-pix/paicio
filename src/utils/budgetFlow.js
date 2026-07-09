// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (archetipo #1 — "Repartir el presupuesto" / sliders).
// Reencuadra la Demanda Agregada de Ep11 (Keynes) como un gesto de REPARTIR:
// arrastras las fronteras de una barra para dividir un presupuesto de estímulo
// fijo entre palancas. NO reemplaza `aggregateDemand` (se enruta por
// `mechanicVariant`; ver MechanicHost).
//
// La lección (mecánica = lección): el MULTIPLICADOR. La misma plata rinde más o
// menos según dónde la pongas. Obra pública y transferencias circulan (alto
// multiplicador); la baja de impuestos se ahorra en parte y se fuga del flujo
// circular (paradoja del ahorro). El reparto óptimo carga las palancas que
// circulan; repartir todo a la que se fuga no reactiva.
//
// El azar se resuelve/siembra en el init (base lista para el Reto Diario); hoy
// no hay azar interno, pero el `seed` viaja igual para futura variación.
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed } from './rng.js'

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))
const round1 = (v) => Math.round(v * 10) / 10
const suma = (reparto) => Object.values(reparto).reduce((a, b) => a + (b || 0), 0)

export function initBudgetFlow(cfg, seed = randomSeed()) {
  // rng reservado para variación futura (eventos/dificultad por día).
  mulberry32(seed)
  return {
    ronda: 1,
    desempleo: cfg.desempleoInicial,
    inflacion: cfg.inflacionInicial,
    pib: cfg.pibInicial,
    deuda: cfg.deudaInicial,
    reparto: { ...cfg.repartoInicial },
    ultimoEvento: null,
    seed,
    historial: [],
  }
}

// Deltas de la ronda: promedio de los efectos de cada palanca, ponderado por la
// fracción del presupuesto que le asignaste. Suma-fija → es un promedio ponderado.
export function previewAllocation(cfg, reparto) {
  const total = cfg.presupuesto || suma(reparto) || 1
  const d = { desempleo: 0, inflacion: 0, pib: 0, deuda: 0 }
  for (const p of cfg.palancas) {
    const w = (reparto[p.id] ?? 0) / total
    d.desempleo += w * (p.efecto.desempleo ?? 0)
    d.inflacion += w * (p.efecto.inflacion ?? 0)
    d.pib += w * (p.efecto.pib ?? 0)
    d.deuda += w * (p.efecto.deuda ?? 0)
  }
  return {
    desempleo: round1(d.desempleo),
    inflacion: round1(d.inflacion),
    pib: round1(d.pib),
    deuda: round1(d.deuda),
  }
}

// Multiplicador efectivo: cuántos "pesos activos" genera cada $1 repartido según
// dónde lo pusiste. El número protagonista que hace visible la lección.
export function multiplicadorEfectivo(cfg, reparto) {
  const total = cfg.presupuesto || suma(reparto) || 1
  let m = 0
  for (const p of cfg.palancas) m += ((reparto[p.id] ?? 0) / total) * (p.multiplicador ?? 1)
  return round1(m)
}

// Aplica el reparto de la ronda y, si hay un evento agendado para esa ronda, su
// shock narrativo (automático: el verbo es repartir, no resolver cartas).
export function applyRound(state, cfg, reparto) {
  const d = previewAllocation(cfg, reparto)
  let next = {
    ...state,
    desempleo: clamp(state.desempleo + d.desempleo),
    inflacion: clamp(state.inflacion + d.inflacion),
    pib: clamp(state.pib + d.pib),
    deuda: clamp(state.deuda + d.deuda),
    reparto: { ...reparto },
    ronda: state.ronda + 1,
    ultimoEvento: null,
    historial: [...state.historial, { ronda: state.ronda, reparto: { ...reparto } }],
  }
  const ev = (cfg.eventos ?? []).find((e) => e.ronda === state.ronda)
  if (ev) {
    const ef = ev.efecto ?? {}
    next = {
      ...next,
      desempleo: clamp(next.desempleo + (ef.desempleo ?? 0)),
      inflacion: clamp(next.inflacion + (ef.inflacion ?? 0)),
      pib: clamp(next.pib + (ef.pib ?? 0)),
      deuda: clamp(next.deuda + (ef.deuda ?? 0)),
      ultimoEvento: ev,
    }
  }
  return next
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas || state.desempleo >= 45 || state.inflacion >= 30
}

export function outcomeTier(state, cfg) {
  const o = cfg.objetivo
  if (state.inflacion >= o.inflacionMax) return 'wrong' // recalentaste la economía
  if (state.desempleo <= o.desempleoPerfect) return 'perfect'
  if (state.desempleo <= o.desempleoPartial) return 'partial'
  return 'wrong' // no reactivaste: la espiral siguió
}
