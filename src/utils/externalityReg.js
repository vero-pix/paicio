// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro) — "La Cuenta de Todos" / verbo REGULAR.
//
// Un río (o caladero) compartido. Sin reglas, a cada pescador le conviene sacar
// todo lo que pueda… y entre todos lo vacían: la tragedia de los comunes. Tú, el
// Estado, pones un LÍMITE (cuota/impuesto). Poco límite → mucha actividad hoy
// pero el río colapsa; mucho límite → río sano pero economía muerta.
//
// La lección (mecánica = lección): las EXTERNALIDADES. Lo que conviene a cada uno
// (pescar al máximo) arruina a todos (el río se agota). El rol del Estado es
// internalizar ese costo con una regla, dejando vivos el río Y la economía.
//
// El río es un STOCK que evoluciona entre temporadas (se regenera si lo cuidas,
// colapsa si lo exprimes). Sembrable para el Reto Diario.
// ─────────────────────────────────────────────────────────────────────────

import { mulberry32, randomSeed } from './rng.js'

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

// Actividad económica de la temporada según el límite y la salud del río. Un río
// agotado también limita la actividad (no hay peces).
export function actividad(cfg, rio, limite) {
  const salud = clamp(rio / 100 + 0.2, 0, 1)
  return cfg.actividadMax * (1 - limite / 100) * salud
}

// Regeneración del río (logística: crece más cuando está a medio llenar).
export function regeneracion(cfg, rio) {
  return cfg.regenBase * (rio / 100) * (1 - rio / 100) * 4
}

// Presión sobre el stock por la actividad (pesca/contaminación).
export function presion(cfg, act) {
  return act * cfg.factorPresion
}

export function initExternalityReg(cfg, seed = randomSeed()) {
  mulberry32(seed) // reservado (Reto Diario)
  return {
    ronda: 1,
    rio: cfg.rioInicial,
    limite: cfg.limiteInicial,
    actividadAcum: 0,
    ultimaActividad: 0,
    ultimoEvento: null,
    seed,
    historial: [],
  }
}

// Aplica el límite de la temporada: calcula actividad, evoluciona el río y —al
// entrar a la siguiente— aplica el shock (sequía, fábrica…).
export function applyRound(state, cfg, limite) {
  const act = actividad(cfg, state.rio, limite)
  const rioNext = clamp(state.rio + regeneracion(cfg, state.rio) - presion(cfg, act))

  let next = {
    ...state,
    limite,
    rio: rioNext,
    ultimaActividad: act,
    actividadAcum: state.actividadAcum + act,
    ronda: state.ronda + 1,
    ultimoEvento: null,
    historial: [
      ...state.historial,
      { ronda: state.ronda, limite, actividad: Math.round(act), rio: Math.round(rioNext) },
    ],
  }

  const ev = (cfg.eventos ?? []).find((e) => e.ronda === next.ronda)
  if (ev) {
    next = { ...next, rio: clamp(next.rio + (ev.rio ?? 0)), ultimoEvento: ev }
  }
  return next
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas
}

export function outcomeTier(state, cfg) {
  const o = cfg.objetivo
  if (state.rio < o.rioColapso) return 'wrong' // el río colapsó: perdiste el recurso
  if (state.actividadAcum >= o.actividadPerfect && state.rio >= o.rioSano) return 'perfect'
  if (state.actividadAcum >= o.actividadPartial) return 'partial'
  return 'wrong'
}
