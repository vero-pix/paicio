// ─────────────────────────────────────────────────────────────────────────
// Lógica de la mecánica "Corrida bancaria" (Episodio 2).
//
// Es un JUEGO DE COORDINACIÓN: el banco es solvente si nadie corre, e
// insolvente si todos corren. La confianza alta reduce los retiros (círculo
// virtuoso); la confianza baja los acelera (círculo vicioso). El jugador tiene
// que cortar la profecía autocumplida antes de que las reservas lleguen a 0.
//
// La UI (BankRun.jsx) llama a `playDay` una vez por día y lee `outcomeTier`
// al terminar. Toda la regla vive acá; el componente solo dibuja.
// ─────────────────────────────────────────────────────────────────────────

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

// Estado inicial a partir de la config del episodio (`episode.bankRun`).
export function initBankRun(cfg) {
  return {
    reservas: cfg.reservasIniciales,
    confianza: cfg.confianzaInicial,
    dia: 1,
    corralito: false, // ¿se impuso el límite de retiros?
    usos: {}, // conteo de usos por acción
    colapso: false,
    log: [],
  }
}

// ¿Queda disponible esta acción? (respeta el límite de usos)
export function accionDisponible(state, accion) {
  if (accion.usos == null) return true
  return (state.usos[accion.id] ?? 0) < accion.usos
}

// Juega un día: aplica la acción elegida y luego resuelve la ola de retiros.
// Devuelve { state, report } — report alimenta la reacción del asesor.
export function playDay(state, cfg, accion) {
  const prevUses = state.usos[accion.id] ?? 0

  // Efecto de la acción sobre confianza (las acciones que "decaen" pierden
  // potencia cada vez que se repiten: la gente deja de creer el mismo discurso).
  const factorDecaimiento = accion.decae ? 1 / 2 ** prevUses : 1
  const deltaConfianza = (accion.confianza ?? 0) * factorDecaimiento

  let confianza = clamp(state.confianza + deltaConfianza)
  let reservas = clamp(state.reservas + (accion.reservas ?? 0))
  const corralito = state.corralito || accion.id === 'corralito'
  const freeze = corralito ? cfg.freezeFactor ?? 0.3 : 1

  // Ola de retiros del día: a menor confianza, mayor fuga de reservas.
  // El corralito multiplica el retiro por `freeze` (frena la sangría).
  const retiro = Math.round(cfg.presionBase * (1 - confianza / 100) * freeze)
  reservas = clamp(reservas - retiro)

  // Acoplamiento de los dos medidores (el corazón del juego de coordinación):
  // reservas altas sostienen la confianza; reservas bajas la hunden.
  confianza = clamp(confianza + (reservas - 50) / 12)
  // El corralito, mientras está activo, erosiona la confianza día a día.
  if (corralito) confianza = clamp(confianza - 4)

  const colapso = reservas <= 0
  const report = {
    accionName: accion.name,
    advisor: accion.advisor,
    reaccion: accion.reaccion,
    retiro,
    deltaConfianza: Math.round(deltaConfianza),
  }

  return {
    state: {
      ...state,
      reservas,
      confianza,
      corralito,
      colapso,
      dia: state.dia + 1,
      usos: { ...state.usos, [accion.id]: prevUses + 1 },
      log: [...state.log, report],
    },
    report,
  }
}

// ¿Terminó la crisis? (colapso o se acabaron los días)
export function isOver(state, cfg) {
  return state.colapso || state.dia > cfg.dias
}

// Traduce el estado final en un nivel de desenlace (clave de episode.outcomes).
export function outcomeTier(state, cfg) {
  if (state.colapso || state.reservas <= 0) return 'wrong'
  const usoCorralito = (state.usos.corralito ?? 0) > 0
  if (state.confianza >= cfg.umbralCalma && !usoCorralito) return 'perfect'
  return 'partial'
}
