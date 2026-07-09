import { useMemo, useRef, useState } from 'react'
import { sfx } from '../../lib/sound.js'
import { useScreenFx } from '../../lib/animations.js'
import { accentFor } from '../../theme/accents.js'
import {
  MechanicShell,
  TopBar,
  LifeBar,
  CandyAction,
  EndPanel,
  EduChip,
  ComboBadge,
  GoldFlash,
  ACTION_PALETTE,
} from './candyKit.jsx'
import EventCard from './EventCard.jsx'
import Coins from './Coins.jsx'
import GameProgress from './GameProgress.jsx'
import CoachMarks from '../CoachMarks.jsx'
import { useGameLayer } from '../../hooks/useGameLayer.js'
import { useTutorial } from '../../hooks/useTutorial.js'
import {
  initSurplusValue,
  ACTIONS,
  playRound,
  isOver,
  outcomeTier,
  accionDisponible,
  applyEvent,
  previewAction,
} from '../../utils/surplusValue.js'

const METERS = [
  { key: 'capital', label: 'Capital', goodWhen: 'high', danger: 30 },
  { key: 'moral', label: 'Moral obrera', goodWhen: 'high', danger: 30 },
]

function deltaLabel(label, n) {
  if (!n) return null
  return `${label} ${n > 0 ? '+' : '−'}${Math.abs(Math.round(n))}`
}

export default function SurplusValue({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(
    () => ({ ...episode.surplusValue, eventos: episode.eventos ?? [] }),
    [episode],
  )
  const acc = accentFor(episode.id)
  const [state, setState] = useState(() => initSurplusValue(cfg))
  const [picked, setPicked] = useState(null)
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)

  const gl = useGameLayer({ eventos: [], totalTurns: cfg.rondas, meters: METERS, trigger, seed: dailySeed })
  const eventoActual = useMemo(() => {
    if (over) return null
    return episode.eventos?.find((e) => e.ronda === state.ronda) ?? null
  }, [state.ronda, episode.eventos, over])
  const [eventoResuelto, setEventoResuelto] = useState(null)
  const pendingEvent = eventoActual && eventoResuelto !== state.ronda ? eventoActual : null

  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const eventRef = useRef(null)
  const refByTarget = { meters: metersRef, actions: actionsRef }
  const tut = useTutorial(episode.id, {
    refByTarget, over, pendingEvent, firstTurnActive: state.ronda === 1,
  })

  function elegir(accion) {
    if (over || pendingEvent || !accionDisponible(state, accion)) return
    sfx('click')
    setPicked(accion.id)
    setTimeout(() => setPicked(null), 260)
    const next = playRound(state, accion.id)
    setState(next)
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
  }

  function resolverEvento(efecto) {
    sfx('click')
    const next = applyEvent(state, pendingEvent, efecto)
    setState(next)
    setEventoResuelto(state.ronda)
    gl.onEventResolved(state, next, pendingEvent.id)
  }

  const tier = over ? outcomeTier(state, cfg) : null

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#E0D4F5)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="La Plusvalía"
        crisis="Karl Marx · 1867"
        accent={acc}
        pill={over ? 'Fin' : `Ronda ${state.ronda} / ${cfg.rondas}`}
      />

      {!over && (
        <GameProgress
          mes={state.ronda}
          meses={cfg.rondas}
          score={gl.score}
          accent={acc}
          goalLabel={tut.tut?.goalChip ?? 'Acumula capital sin quebrar la moral'}
        />
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="plusvalia"
          label="¿Qué es la plusvalía?"
          onSeen={onConceptSeen}
        />
      </div>

      <div ref={metersRef} className="mt-4 space-y-2.5">
        <LifeBar variant="vault" label="Capital acumulado" value={state.capital} />
        <LifeBar variant="crowd" label="Moral obrera" value={state.moral} />
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 rounded-[16px] bg-surface/80 p-3 shadow-card">
        <span className="text-[1.2rem]">🏭</span>
        <span className="text-center">
          <span className="font-round text-[1.4rem] font-bold tabular-nums text-ink-warm">
            {state.produccion}
          </span>
          <span className="ml-1 font-nunito text-[0.7rem] font-bold text-ink-mute">
            lbs/día
          </span>
        </span>
      </div>

      <ComboBadge combo={gl.combo} />

      {!over && pendingEvent && (
        <EventCard
          evento={pendingEvent}
          mes={state.ronda}
          mesLabel="Ronda"
          accent={acc}
          onResolve={resolverEvento}
          spotlightRef={eventRef}
          meters={METERS}
        />
      )}

      {!over && !pendingEvent && (
        <div className="mt-4">
          <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
            Elegí una acción
          </p>
          <div ref={actionsRef} className="mt-2 space-y-2">
            {ACTIONS.map((a, i) => {
              const disp = accionDisponible(state, a)
              const pal = ACTION_PALETTE[i % ACTION_PALETTE.length]
              const prev = previewAction(state, cfg, a)
              const pills = [
                deltaLabel('Capital', prev.capital),
                deltaLabel('Moral', prev.moral),
              ].filter(Boolean)
              return (
                <CandyAction
                  key={a.id}
                  id={a.id}
                  face={pal.face}
                  edge={pal.edge}
                  name={a.label}
                  hint={a.desc}
                  pills={pills}
                  highlight={tut.showFirstHint && a.id === tut.hintAction && disp}
                  hintLabel={tut.hintLabel}
                  disabled={!disp}
                  picked={picked === a.id}
                  onClick={() => elegir(a)}
                />
              )
            })}
          </div>
        </div>
      )}

      {over && (
        <EndPanel
          text={
            tier === 'perfect'
              ? 'Marx asiente: "Has demostrado exactamente cómo funciona la plusvalía. El capital se acumula a costa del trabajo no pagado."'
              : tier === 'partial'
                ? '"Te detuviste a medio camino. La plusvalía funciona aunque no la maximices."'
                : 'Marx cierra su cuaderno. "No lograste sostener la contradicción. O explotaste demasiado o no lo suficiente."'
          }
          onComplete={() => onComplete(tier, { score: gl.score, momentumMax: gl.momentumMax })}
        />
      )}

      {tut.showEventCoach && (
        <CoachMarks
          steps={[{ ref: eventRef, caption: tut.tut.event.caption }]}
          accent={acc}
          onDone={tut.onEventDone}
          onSkip={tut.onSkip}
        />
      )}
      {tut.showMainCoach && (
        <CoachMarks steps={tut.mainSteps} accent={acc} onDone={tut.onMainDone} onSkip={tut.onSkip} />
      )}
    </MechanicShell>
  )
}
