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
  initMonetaryRule,
  ACTIONS,
  playRound,
  isOver,
  outcomeTier,
  accionDisponible,
  applyEvent,
  previewAction,
} from '../../utils/monetaryRule.js'

const METERS = [
  { key: 'inflacion', label: 'Inflación', goodWhen: 'low', danger: 10 },
  { key: 'desempleo', label: 'Desempleo', goodWhen: 'low', danger: 10 },
  { key: 'expectativa', label: 'Expectativa infl.', goodWhen: 'low', danger: 8 },
  { key: 'credibilidad', label: 'Credibilidad', goodWhen: 'high', danger: 30 },
]

function deltaLabel(label, n) {
  if (!n) return null
  const prefix = n > 0 ? '+' : '−'
  return `${label} ${prefix}${Math.abs(Math.round(n))}`
}

function telegraphPills(state, cfg, accion) {
  const prev = previewAction(state, cfg, accion)
  return [
    deltaLabel('Inflación', prev.inflacion),
    deltaLabel('Desempleo', prev.desempleo),
    deltaLabel('Expectativa', prev.expectativa),
    deltaLabel('Credibilidad', prev.credibilidad),
  ].filter(Boolean)
}

export default function MonetaryRule({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(
    () => ({ ...episode.monetaryRule, eventos: episode.eventos ?? [] }),
    [episode],
  )
  const acc = accentFor(episode.id)
  const [state, setState] = useState(() => initMonetaryRule(cfg))
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
      tint={`linear-gradient(180deg,${acc.soft},#F5D5B0)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="La Regla Monetaria"
        crisis="Milton Friedman · 1976"
        accent={acc}
        pill={over ? 'Fin' : `Ronda ${state.ronda} / ${cfg.rondas}`}
      />

      {!over && (
        <GameProgress
          mes={state.ronda}
          meses={cfg.rondas}
          score={gl.score}
          accent={acc}
          goalLabel={tut.tut?.goalChip ?? 'Domá la inflación sin que el desempleo se dispare'}
        />
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="reglaMonetaria"
          label="¿Qué es la regla k%?"
          onSeen={onConceptSeen}
        />
      </div>

      <div ref={metersRef} className="mt-4 space-y-2.5">
        <LifeBar variant="flame" label="Inflación" value={100 - state.inflacion} />
        <LifeBar variant="flame" label="Desempleo" value={100 - state.desempleo} />
        <LifeBar variant="flame" label="Expectativa infl." value={100 - state.expectativa} />
        <LifeBar variant="vault" label="Credibilidad" value={state.credibilidad} />
      </div>

      <div className="mt-2 flex items-center justify-center gap-2 font-nunito text-[0.6rem] font-bold text-ink-mute">
        <span>Tasa natural de desempleo: {state.tasaNatural}%</span>
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
            Elige una acción monetaria
          </p>
          <div ref={actionsRef} className="mt-2 space-y-2">
            {ACTIONS.map((a, i) => {
              const disp = accionDisponible(state, a)
              const pal = ACTION_PALETTE[i % ACTION_PALETTE.length]
              return (
                <CandyAction
                  key={a.id}
                  id={a.id}
                  face={pal.face}
                  edge={pal.edge}
                  name={a.label}
                  hint={a.desc}
                  pills={telegraphPills(state, cfg, a)}
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
              ? 'Friedman sonríe: "Descubriste lo que a los gobiernos les cuesta aceptar: el mejor timón es una regla, no una mano discrecional."'
              : tier === 'partial'
                ? 'Friedman te mira con severidad: "Zigzagueaste. Cada freno y acelerón te costó confianza. La economía no tolera caprichos."'
                : 'Friedman cierra su discurso: "Creíste que podías comprar empleo con inflación. El mercado aprendió tu truco. Bienvenido a los años setenta."'
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
