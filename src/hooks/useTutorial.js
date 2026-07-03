import { useState } from 'react'
import { tutorialFor } from '../theme/tutorials.js'

// ─────────────────────────────────────────────────────────────────────────
// useTutorial — onboarding compartido (coach-marks + chip de meta + primer
// turno guiado) para las mecánicas por turnos. Los textos viven en
// theme/tutorials.js; acá va el estado "ya visto" (localStorage, por episodio)
// y las banderas de qué mostrar en cada momento.
//
// El componente crea los refs de sus elementos reales y pasa `refByTarget`
// (target de tutorials.js → ref). Ep1 tiene su propio wiring inline y no usa
// este hook (para no tocar Bolivia, ya validado).
// ─────────────────────────────────────────────────────────────────────────

const keyFor = (id) => `paicio.tutorial.${id}.v1`

function load(id) {
  try {
    const r = JSON.parse(localStorage.getItem(keyFor(id)))
    if (r && typeof r === 'object') return { main: false, event: false, ...r }
  } catch {
    /* localStorage no disponible */
  }
  return { main: false, event: false }
}

export function useTutorial(episodeId, { refByTarget, over, pendingEvent, firstTurnActive }) {
  const tut = tutorialFor(episodeId)
  const [seen, setSeen] = useState(() => load(episodeId))

  function persist(next) {
    setSeen(next)
    try {
      localStorage.setItem(keyFor(episodeId), JSON.stringify(next))
    } catch {
      /* localStorage no disponible */
    }
  }

  // Paso del evento (prioritario si hay carta) vs pasos base. Nunca coinciden:
  // la carta oculta las acciones.
  const showEventCoach = !!tut?.event && !seen.event && !!pendingEvent
  const showMainCoach = !!tut && !seen.main && !over && !pendingEvent
  const mainSteps = tut
    ? tut.steps.map((s) => ({ ref: refByTarget[s.target], caption: s.caption }))
    : []

  const hintAction = tut?.firstTurnHint?.action
  const showFirstHint =
    !!tut?.firstTurnHint && firstTurnActive && !over && !pendingEvent && !showMainCoach && !showEventCoach

  return {
    tut,
    showEventCoach,
    showMainCoach,
    mainSteps,
    hintAction,
    hintLabel: tut?.firstTurnHint?.label,
    showFirstHint,
    onMainDone: () => persist({ ...seen, main: true }),
    onEventDone: () => persist({ ...seen, event: true }),
    onSkip: () => persist({ main: true, event: true }),
  }
}
