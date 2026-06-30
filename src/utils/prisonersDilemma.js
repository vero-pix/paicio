// Lógica de la matriz de pago y la resolución del Dilema del Prisionero.
//
// Convención de payoff (perspectiva [prisionero, jugador]):
//   CC = ambos cooperan
//   CT = prisionero coopera, jugador traiciona
//   TC = prisionero traiciona, jugador coopera
//   TT = ambos traicionan

// Genera una matriz con variación por turno para crear variedad,
// manteniendo la estructura del dilema (T > R > P > S).
export function buildMatrix(prisoner, turn = 0) {
  const base = prisoner.basePayoff
  // Pequeña variación determinista por turno (sin romper el orden del dilema).
  const wobble = (turn % 3) // 0,1,2
  return {
    CC: [base.CC[0] + wobble, base.CC[1] + wobble],
    CT: [base.CT[0], base.CT[1] + wobble],
    TC: [base.TC[0] + wobble, base.TC[1]],
    TT: [base.TT[0], base.TT[1]],
  }
}

// Decide la jugada del prisionero según su función de utilidad:
// confianza actual, historial de cooperación y un sesgo propio, con algo de aleatoriedad.
// Devuelve 'cooperate' | 'betray'.
export function prisonerDecision(prisoner, { trust = 50, history = [], rng = Math.random } = {}) {
  const cooperatedBefore = history.filter((h) => h === 'cooperate').length
  const lastMove = history[history.length - 1]
  // Inclinación a cooperar en escala 0..1
  let p = 0.55
  p += (trust - 50) / 100 // confianza alta empuja a cooperar
  p += cooperatedBefore * 0.16 // dilema iterado: cooperación previa genera reciprocidad
  p += prisoner.cooperBias * 0.1 // sesgo propio del personaje
  if (lastMove === 'cooperate') p += 0.12 // si lo trataste bien la última vez, te devuelve la mano
  p = Math.max(0.12, Math.min(0.94, p))
  return rng() < p ? 'cooperate' : 'betray'
}

// Resuelve el resultado de una ronda dado lo que hace cada parte.
// playerMove / prisonerMove: 'cooperate' | 'betray'
export function resolveRound(matrix, playerMove, prisonerMove) {
  let key
  if (prisonerMove === 'cooperate' && playerMove === 'cooperate') key = 'CC'
  else if (prisonerMove === 'cooperate' && playerMove === 'betray') key = 'CT'
  else if (prisonerMove === 'betray' && playerMove === 'cooperate') key = 'TC'
  else key = 'TT'

  const [prisonerPayoff, playerPayoff] = matrix[key]

  // ¿Es el resultado el equilibrio de Nash del dilema? En el dilema clásico,
  // (Traicionar, Traicionar) es el único equilibrio de Nash.
  const isNash = key === 'TT'

  // ¿La negociación tiene éxito (suma un aliado)?
  // Éxito si el prisionero coopera. Si el jugador traiciona a un prisionero que coopera,
  // gana payoff pero NO consigue un aliado leal: lo vuelve hostil.
  const allied = prisonerMove === 'cooperate' && playerMove === 'cooperate'
  const exploited = prisonerMove === 'cooperate' && playerMove === 'betray'
  const hostile = prisonerMove === 'betray' || exploited

  // Cambio de confianza del prisionero hacia el jugador.
  let trustDelta
  if (allied) trustDelta = +18
  else if (exploited) trustDelta = -28 // lo traicionaste cuando cooperó
  else if (playerMove === 'cooperate') trustDelta = -6 // tú cooperaste, él traicionó
  else trustDelta = -12 // ambos traicionaron

  return {
    key,
    prisonerPayoff,
    playerPayoff,
    isNash,
    allied,
    exploited,
    hostile,
    trustDelta,
  }
}

// Texto educativo de 2 líneas según el equilibrio alcanzado.
export function equilibriumLesson(result) {
  if (result.key === 'TT') {
    return 'Alcanzaron (Traicionar, Traicionar): el equilibrio de Nash. Ambos terminan peor que si hubieran cooperado — igual que dos países en una guerra comercial.'
  }
  if (result.key === 'CC') {
    return 'Lograron (Cooperar, Cooperar): mejor para ambos, pero NO es el equilibrio de Nash. Solo se sostiene si hay confianza o el juego se repite.'
  }
  if (result.key === 'CT') {
    return 'Tú traicionaste a quien cooperó: ganaste el pago máximo (5), pero a costa de un aliado. La traición paga una vez; la reputación se cobra después.'
  }
  return 'El prisionero te traicionó mientras cooperabas: te llevaste el peor pago (0). En el dilema, confiar a ciegas es caro.'
}
