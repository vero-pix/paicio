import { useMemo, useRef, useState } from 'react'
import { sfx } from '../lib/sound.js'
import { mulberry32, randomSeed } from '../utils/rng.js'
import {
  buildEventSchedule,
  eventoPendiente,
  evalTurn,
  turnReward,
  eventReward,
  inDanger,
} from '../utils/gameLayer.js'

// ─────────────────────────────────────────────────────────────────────────
// useGameLayer — capa de juego compartida para las mecánicas por turnos
// (Ep2/3/4). Es un "scorekeeper + caja de jugo": agenda las cartas de evento,
// lleva el momentum/combo y el puntaje corrido, y dispara el jugo (monedas,
// flashes, sonidos). NO toca el estado de la mecánica: el componente aplica sus
// propios efectos (playTurn / applyEvent) y avisa acá para que se puntúe y
// celebre.
//
//   meters:  [{ key, goodWhen, danger }]  descriptor del episodio
//   trigger: el trigger de useScreenFx del componente (flash/shake)
// ─────────────────────────────────────────────────────────────────────────
export function useGameLayer({ eventos, totalTurns, meters, trigger }) {
  const [seed] = useState(randomSeed)
  const schedule = useMemo(
    () => buildEventSchedule(eventos, totalTurns, mulberry32(seed)),
    [eventos, totalTurns, seed],
  )
  const [vistos, setVistos] = useState([])
  const momentum = useRef(0) // racha en curso (interna; no fuerza re-render)
  const [momentumMax, setMomentumMax] = useState(0)
  const [combo, setCombo] = useState(0) // badge visible (0 = oculto)
  const [score, setScore] = useState(0)
  const [burstKey, setBurstKey] = useState(0) // estallido de monedas
  const [rainKey, setRainKey] = useState(0) // lluvia de monedas (celebración)
  const [gold, setGold] = useState(false) // destello dorado

  const eventoDelTurno = (turno) => eventoPendiente(eventos, schedule, turno, vistos)

  const celebrate = () => {
    sfx('fanfare')
    setRainKey((k) => k + 1)
    setGold(true)
    setTimeout(() => setGold(false), 800)
  }
  const coins = () => {
    sfx('coin')
    setBurstKey((k) => k + 1)
    trigger?.('flash')
  }
  const punish = () => {
    sfx('alert')
    trigger?.('shake')
  }

  // Cierra un turno normal: actualiza momentum + puntaje y dispara el jugo.
  // `win` fuerza la celebración grande (p. ej. desenlace perfecto).
  function onTurn(prev, next, { over = false, win = false } = {}) {
    const { buenMes, danger } = evalTurn(prev, next, meters)
    const m = buenMes ? momentum.current + 1 : 0
    momentum.current = m
    setMomentumMax((mm) => Math.max(mm, m))
    setScore((s) => s + turnReward(prev, next, meters, m))

    if (win) celebrate()
    else if (danger && !inDanger(prev, meters)) punish()
    else if (buenMes && !over) coins()

    if (m >= 2) {
      setCombo(m)
      setTimeout(() => setCombo(0), 1200)
    } else {
      setCombo(0)
    }
    return m
  }

  // Resuelve una carta: puntúa la mejora directa y da feedback. No avanza turno.
  function onEventResolved(prev, next, eventId) {
    setVistos((v) => [...v, eventId])
    const r = eventReward(prev, next, meters)
    if (r > 0) {
      setScore((s) => s + r)
      coins()
    } else if (inDanger(next, meters) && !inDanger(prev, meters)) {
      punish()
    }
  }

  return {
    score,
    combo,
    momentumMax,
    burstKey,
    rainKey,
    gold,
    eventoDelTurno,
    onTurn,
    onEventResolved,
  }
}
