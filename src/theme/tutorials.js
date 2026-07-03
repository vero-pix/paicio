// ─────────────────────────────────────────────────────────────────────────
// Tutoriales de episodio — CAPA DE PRESENTACIÓN (onboarding).
//
// Textos del coach-mark por episodio, centralizados acá (como briefings.js) para
// no tocar src/data/episodes/*. Cada crisis puede tener su propio coach: cambia
// los captions/objetivo sin tocar la mecánica.
//
// - goalChip: recordatorio de meta siempre visible en la pantalla de decisión.
// - firstTurnHint: acción sugerida en el mes 1 (pulso "empieza por aquí").
// - steps[].target: clave del elemento REAL a resaltar (la mecánica mapea la
//   clave → ref). caption: máx 2 líneas.
// - event: paso contextual, la 1ª vez que aparece una carta de evento.
//
// Tono: chileno neutro, tuteo (nunca voseo).
// ─────────────────────────────────────────────────────────────────────────

export const EPISODE_TUTORIALS = {
  ep1: {
    goalChip: 'Frena la inflación antes del mes 8',
    firstTurnHint: { action: 'ajuste', label: 'Empieza por aquí' },
    steps: [
      {
        target: 'goal',
        caption: 'Eres el ministro. Tu meta: frenar la hiperinflación en 8 meses.',
      },
      {
        target: 'meters',
        caption: 'Vigila esto. Si la Inflación llega al tope o el Apoyo llega a 0, caes.',
      },
      {
        target: 'actions',
        caption: 'Cada mes eliges UNA acción. Tócala para ver su efecto antes de confirmar.',
      },
      {
        target: 'reforma',
        caption: 'La Reforma frena la crisis… pero solo si la lanzas a tiempo. Ese es el reto.',
      },
    ],
    event: {
      caption: '¡Imprevisto! Los eventos caen al azar. Reacciona y sigue tu plan.',
    },
  },

  ep2: {
    goalChip: 'Corta el pánico antes del día 5',
    firstTurnHint: { action: 'garantia', label: 'Empieza por aquí' },
    steps: [
      {
        target: 'meters',
        caption: 'Dos frentes: Reservas y Confianza. Si cualquiera llega a cero, los bancos caen.',
      },
      {
        target: 'actions',
        caption: 'Cada día eliges UNA medida. Tócala para ver su efecto antes de confirmar.',
      },
    ],
    event: {
      caption: '¡Imprevisto! Rumores y shocks caen al azar. Reacciona y sigue tu plan.',
    },
  },

  ep3: {
    goalChip: 'Suelta la paridad a tiempo',
    firstTurnHint: { action: 'intervenir', label: 'Defiende primero' },
    steps: [
      {
        target: 'meters',
        caption: 'Defender quema Reservas o Empleo. Si cualquiera se agota, la caída es caótica.',
      },
      {
        target: 'actions',
        caption: 'Cada ronda eliges cómo responder. La salida real es devaluar… a tiempo.',
      },
    ],
    event: {
      caption: '¡Shock del mercado! Los ataques caen al azar. Aguanta y calcula.',
    },
  },

  ep4: {
    goalChip: 'Baja las expectativas con credibilidad',
    firstTurnHint: { action: 'ajusteFiscal', label: 'Construye credibilidad' },
    steps: [
      {
        target: 'meters',
        caption: 'Baja las Expectativas para ganar; la Credibilidad es tu munición. Sin ella, nada dura.',
      },
      {
        target: 'actions',
        caption: 'Cada mes eliges una jugada. Congelar alivia hoy… y rebota mañana.',
      },
    ],
    event: {
      caption: '¡Ruido en la calle! Rumores y remarcajes caen al azar. No pierdas la calma.',
    },
  },

  ep5: {
    steps: [
      {
        target: 'list',
        caption: 'Ordena los 4 pasos con las flechas ↑ ↓. Solo un orden gana: el timing lo es todo.',
      },
    ],
  },
}

export const tutorialFor = (id) => EPISODE_TUTORIALS[id] ?? null
