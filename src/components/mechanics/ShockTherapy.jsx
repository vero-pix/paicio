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
  initShockTherapy,
  playRound,
  isOver,
  outcomeTier,
  accionDisponible,
  applyEvent,
  previewAction,
} from '../../utils/shockTherapy.js'

// ─────────────────────────────────────────────────────────────────────────
// ShockTherapy — mecánica del Episodio 7 (Fujishock). Usa el kit compartido
// candyKit + useGameLayer. Misma arquitectura que Ep2/3/4.
//
// Dos medidores: Inflación (goodWhen: low) y Apoyo social (goodWhen: high).
// ─────────────────────────────────────────────────────────────────────────

const METERS = [
  { key: 'inflacion', label: 'Inflación', goodWhen: 'low', danger: 60 },
  { key: 'apoyo', label: 'Apoyo social', goodWhen: 'high', danger: 25 },
]

function deltaLabel(label, n) {
  if (!n) return null
  return `${label} ${n > 0 ? '+' : '−'}${Math.abs(Math.round(n))}`
}

function telegraphPills(state, cfg, accion) {
  const prev = previewAction(state, cfg, accion)
  const pills = [deltaLabel('Inflación', prev.inflacion), deltaLabel('Apoyo', prev.apoyo)].filter(Boolean)
  if (accion.id === 'dolarizar') {
    pills.push('Sin deriva')
  }
  return pills
}

export default function ShockTherapy({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(
    () => ({ ...episode.shockTherapy, eventos: episode.eventos ?? [] }),
    [episode],
  )
  const acc = accentFor(episode.id)
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initShockTherapy(cfg))
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
    refByTarget,
    over,
    pendingEvent,
    firstTurnActive: state.ronda === 1,
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
      tint={`linear-gradient(180deg,${acc.soft},#FBE6C2)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="El Shock"
        crisis="Terapia de shock"
        accent={acc}
        pill={over ? 'Fin' : `Ronda ${state.ronda} / ${cfg.rondas}`}
      />

      {!over && (
        <GameProgress
          mes={state.ronda}
          meses={cfg.rondas}
          score={gl.score}
          accent={acc}
          goalLabel={tut.tut?.goalChip ?? 'Mata la inflación sin que reviente el país'}
        />
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="terapiaShock"
          label="¿Qué es terapia de shock?"
          onSeen={onConceptSeen}
        />
        {!over && (
          <span
            className="rounded-full px-2.5 py-1 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
            style={{ background: acc.soft, color: acc.edge }}
          >
            Hiperinflación
          </span>
        )}
      </div>

      <div ref={metersRef} className="mt-4 space-y-2.5">
        <LifeBar variant="flame" label="Inflación anual" value={state.inflacion} />
        <LifeBar variant="crowd" label="Apoyo social" value={state.apoyo} />
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
            ¿Qué tan fuerte aprietas?
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
            state.colapso
              ? 'El apoyo social se agotó antes que la inflación — o la inflación se descontroló. El shock no sobrevivió al impacto.'
              : 'Las 6 rondas pasaron. Veamos si el shock funcionó.'
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
