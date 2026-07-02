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
}

export const tutorialFor = (id) => EPISODE_TUTORIALS[id] ?? null
