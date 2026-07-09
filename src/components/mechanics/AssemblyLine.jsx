import { useMemo, useRef, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import { sfx } from '../../lib/sound.js'
import { useScreenFx } from '../../lib/animations.js'
import { accentFor } from '../../theme/accents.js'
import {
  MechanicShell,
  TopBar,
  LifeBar,
  AdvisorBubble,
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
  initAssemblyLine,
  playRound,
  isOver,
  outcomeTier,
  accionDisponible,
  applyEvent,
  previewAction,
} from '../../utils/assemblyLine.js'

const METERS = [
  { key: 'tiempo', label: 'Minutos por auto', goodWhen: 'low', danger: 360 },
  { key: 'costo', label: 'Costo por auto', goodWhen: 'low', danger: 80 },
]

function deltaLabel(label, n) {
  if (!n) return null
  const prefix = n > 0 ? '+' : '−'
  return `${label} ${prefix}${Math.abs(Math.round(n))}`
}

function telegraphPills(state, cfg, accion) {
  const prev = previewAction(state, cfg, accion)
  return [
    deltaLabel('Tiempo', prev.tiempo),
    deltaLabel('Costo', prev.costo),
    prev.innovacion ? `+${prev.innovacion} 💡` : null,
  ].filter(Boolean)
}

export default function AssemblyLine({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(
    () => ({ ...episode.assemblyLine, eventos: episode.eventos ?? [] }),
    [episode],
  )
  const acc = accentFor(episode.id)
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initAssemblyLine(cfg))
  const [report, setReport] = useState(null)
  const [picked, setPicked] = useState(null)
  const [eventNote, setEventNote] = useState(null)
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)

  const gl = useGameLayer({ eventos: cfg.eventos, totalTurns: cfg.rondas, meters: METERS, trigger, seed: dailySeed })
  const pendingEvent = over ? null : gl.eventoDelTurno(state.ronda)

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
    setEventNote(null)
    setPicked(accion.id)
    setTimeout(() => setPicked(null), 260)
    const { state: next, report: rep } = playRound(state, cfg, accion)
    setState(next)
    setReport(rep)
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
  }

  function resolverEvento(efecto, opcion) {
    sfx('newspaper')
    const next = applyEvent(state, pendingEvent, efecto)
    setState(next)
    setEventNote(opcion?.replica ?? null)
    gl.onEventResolved(state, next, pendingEvent.id)
  }

  const tier = over ? outcomeTier(state, cfg) : null
  const advisor = report ? prisonersById[report.advisor] : null

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#DCEBFA)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="La Línea"
        crisis="Producción en masa"
        accent={acc}
        pill={over ? 'Fin' : `Ronda ${state.ronda} / ${cfg.rondas}`}
      />

      {!over && (
        <GameProgress
          mes={state.ronda}
          meses={cfg.rondas}
          score={gl.score}
          accent={acc}
          goalLabel={tut.tut?.goalChip ?? 'Llega a 93 minutos por auto'}
        />
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="economiasEscala"
          label="¿Qué son economías de escala?"
          onSeen={onConceptSeen}
        />
        {!over && (
          <span
            className="rounded-full px-2.5 py-1 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
            style={{ background: acc.soft, color: acc.edge }}
          >
            {state.tiempo > 300 ? 'Producción artesanal' : state.tiempo > 150 ? 'Semi-industrial' : 'Producción en masa'}
          </span>
        )}
      </div>

      <div ref={metersRef} className="mt-4 space-y-2.5">
        <LifeBar variant="vault" label="Tiempo por auto (minutos)" value={Math.max(0, Math.round(100 - (state.tiempo / 720) * 100))} />
        {!cfg._hideCosto && (
          <LifeBar variant="crowd" label="Costo unitario" value={Math.max(0, Math.round(100 - (state.costo / 100) * 100))} />
        )}
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <span className="font-round text-[1.4rem] font-bold tabular-nums" style={{ color: state.tiempo <= 93 ? '#35B98A' : acc.edge }}>
          {state.tiempo}
        </span>
        <span className="font-nunito text-[0.7rem] font-bold text-ink-mute">min / auto</span>
        {state.tiempo <= 93 && (
          <span className="rounded-full bg-good/20 px-2 py-0.5 font-nunito text-[0.6rem] font-extrabold text-good">
            ¡META!
          </span>
        )}
      </div>

      <ComboBadge combo={gl.combo} />

      {report && advisor && report.reaccion && (
        <AdvisorBubble
          portrait={portraits[advisor.id]}
          name={advisor.name}
          nameColor={acc.edge}
          text={report.reaccion}
        />
      )}

      {!over && pendingEvent && (
        <EventCard
          evento={pendingEvent}
          mes={state.ronda}
          mesLabel="Ronda"
          accent={acc}
          onResolve={resolverEvento}
          spotlightRef={eventRef}
          meters={METERS}
          swipe={episode.swipeEvents !== false}
        />
      )}

      {!over && eventNote && (
        <p className="animate-fade-up mt-3 rounded-[14px] bg-panel/80 px-3 py-2 font-nunito text-[0.8rem] italic leading-snug text-ink-soft">
          {eventNote}
        </p>
      )}

      {!over && !pendingEvent && (
        <div className="mt-4">
          <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
            ¿Qué innovación aplicas?
          </p>
          <div ref={actionsRef} className="mt-2 space-y-2">
            {cfg.acciones.map((a, i) => {
              const disp = accionDisponible(state, a)
              const restantes = a.usos != null ? a.usos - (state.usos[a.id] ?? 0) : null
              const pal = ACTION_PALETTE[i % ACTION_PALETTE.length]
              return (
                <CandyAction
                  key={a.id}
                  id={a.id}
                  face={pal.face}
                  edge={pal.edge}
                  name={a.name}
                  hint={a.desc}
                  meta={a.usos != null ? (disp ? `${restantes} uso` : 'usado') : undefined}
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
            state.tiempo <= 93
              ? '¡93 minutos! La línea de montaje más rápida del mundo. Ford sonríe.'
              : `Terminaste con ${state.tiempo} minutos por auto. Ford esperaba más, pero mejoraste la fábrica.`
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
