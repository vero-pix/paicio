// ─────────────────────────────────────────────────────────────────────────
// Lógica de la mecánica "Expectativas e inercia" (Episodio 4).
//
// La inflación crónica se autocumple: todos ESPERAN inflación, así que la
// indexan en precios y salarios, y entonces la inflación ocurre. Para matarla
// hay que bajar las EXPECTATIVAS, y eso solo se logra con CREDIBILIDAD.
//
// El congelamiento de precios da alivio inmediato (las expectativas caen), pero
// si no hay credibilidad, REBOTAN peor a la ronda siguiente y la credibilidad
// se hunde: es la trampa de los planes fallidos en serie.
//
// Niveles: perfect → rompió la inercia con credibilidad; wrong → otro plan
// fallido (credibilidad agotada o expectativas disparadas); partial → a medias.
// ─────────────────────────────────────────────────────────────────────────

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initExpectations(cfg) {
  return {
    expectativas: cfg.expectativasIniciales, // más bajo = mejor
    credibilidad: cfg.credibilidadInicial, // más alto = mejor
    ronda: 1,
    rebote: 0, // rebote pendiente de un congelamiento anterior
    usos: {},
    log: [],
  }
}

export function accionDisponible(state, accion) {
  if (accion.usos == null) return true
  return (state.usos[accion.id] ?? 0) < accion.usos
}

export function playRound(state, cfg, accion) {
  const prevUses = state.usos[accion.id] ?? 0
  const credibilidad = clamp(state.credibilidad + (accion.cred ?? 0))

  let expectativas = state.expectativas
  if (accion.id === 'urv') {
    // La unidad de cuenta estable escala con la credibilidad previa:
    // funciona poco si nadie te cree, y muy bien si construiste confianza.
    expectativas -= Math.round(state.credibilidad / 5 + 8)
  } else {
    expectativas += accion.exp ?? 0 // exp negativo = baja expectativas
  }

  // Rebote de un congelamiento de la ronda anterior (el congelamiento se derrite).
  const reboteAplicado = state.rebote
  expectativas += reboteAplicado

  // Inercia: con baja credibilidad la gente sigue indexando y las expectativas
  // suben solas; con alta credibilidad, empiezan a creer y bajan.
  const deriva = (50 - credibilidad) / 8
  expectativas = clamp(expectativas + deriva)

  const nuevoRebote = accion.congela ? cfg.reboteCongelar : 0
  const report = {
    accionName: accion.name,
    advisor: accion.advisor,
    reaccion: accion.reaccion,
    reboteAplicado: Math.round(reboteAplicado),
  }

  return {
    state: {
      ...state,
      credibilidad,
      expectativas,
      rebote: nuevoRebote,
      ronda: state.ronda + 1,
      usos: { ...state.usos, [accion.id]: prevUses + 1 },
      log: [...state.log, report],
    },
    report,
  }
}

// ── Capa de juego (cartas de evento + telegrafiado) ────────────────────────

// Aplica el efecto de una carta sobre expectativas/credibilidad (mismo clamp).
// El fin por credibilidad agotada lo detecta isOver, no hace falta bandera.
export function applyEvent(state, evento, efecto = {}) {
  const expectativas = clamp(state.expectativas + (efecto.expectativas ?? 0))
  const credibilidad = clamp(state.credibilidad + (efecto.credibilidad ?? 0))
  return {
    ...state,
    expectativas,
    credibilidad,
    log: [...state.log, { evento: evento.titulo, efecto }],
  }
}

// Efecto DIRECTO estimado de una acción para telegrafiarlo. No incluye la
// deriva de inercia ni el rebote de fin de ronda. La URV baja expectativas en
// función de la credibilidad ya construida (por eso rinde más si te creen).
export function previewAction(state, cfg, accion) {
  const credibilidad = accion.cred ?? 0
  const expectativas =
    accion.id === 'urv' ? -Math.round(state.credibilidad / 5 + 8) : accion.exp ?? 0
  return { expectativas, credibilidad }
}

export function isOver(state, cfg) {
  return state.ronda > cfg.rondas || state.credibilidad <= 0
}

export function outcomeTier(state, cfg) {
  if (state.credibilidad <= cfg.umbralColapso || state.expectativas >= 85) return 'wrong'
  if (state.expectativas <= cfg.umbralExito && state.credibilidad >= cfg.credExito) {
    return 'perfect'
  }
  return 'partial'
}
