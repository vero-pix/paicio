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
  initBankRun,
  playDay,
  isOver,
  outcomeTier,
  accionDisponible,
  applyEvent,
  previewAction,
} from '../../utils/bankRun.js'

// ─────────────────────────────────────────────────────────────────────────
// BankRun — mecánica del Episodio 2 (corrida bancaria). Rediseño LatAm + capa
// de juego compartida (Ep2/3/4): cartas de evento, telegrafiado, momentum/combo,
// puntaje corrido, jugo de recompensa y onboarding. La lógica (initBankRun/
// playDay/isOver/outcomeTier) no cambia: la orquestación vive en useGameLayer.
// ─────────────────────────────────────────────────────────────────────────

// Descriptor de medidores del episodio: alimenta momentum, puntaje, peligro,
// pills de las cartas y telegrafiado. Ambos "high": más = mejor.
const METERS = [
  { key: 'reservas', label: 'Reservas', goodWhen: 'high', danger: 30 },
  { key: 'confianza', label: 'Confianza', goodWhen: 'high', danger: 30 },
]

// Etiqueta corta de un delta telegrafiado ("Reservas −6"). null si no cambia.
function deltaLabel(label, n) {
  if (!n) return null
  return `${label} ${n > 0 ? '+' : '−'}${Math.abs(Math.round(n))}`
}

export default function BankRun({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(
    () => ({ ...episode.bankRun, eventos: episode.eventos ?? [] }),
    [episode],
  )
  const acc = accentFor(episode.id)
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initBankRun(cfg))
  const [report, setReport] = useState(null)
  const [picked, setPicked] = useState(null)
  const [eventNote, setEventNote] = useState(null)
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)

  const gl = useGameLayer({ eventos: cfg.eventos, totalTurns: cfg.dias, meters: METERS, trigger, seed: dailySeed })
  const pendingEvent = over ? null : gl.eventoDelTurno(state.dia)

  // ── Onboarding ──────────────────────────────────────────────────────────
  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const eventRef = useRef(null)
  const refByTarget = { meters: metersRef, actions: actionsRef }
  const tut = useTutorial(episode.id, {
    refByTarget,
    over,
    pendingEvent,
    firstTurnActive: state.dia === 1,
  })

  function elegir(accion) {
    if (over || pendingEvent || !accionDisponible(state, accion)) return
    sfx('click')
    setEventNote(null)
    setPicked(accion.id)
    setTimeout(() => setPicked(null), 260)
    const { state: next, report: rep } = playDay(state, cfg, accion)
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
        title="La Corrida"
        crisis="Corrida bancaria"
        accent={acc}
        pill={over ? 'Fin' : `Día ${state.dia} / ${cfg.dias}`}
      />

      {!over && (
        <GameProgress
          mes={state.dia}
          meses={cfg.dias}
          score={gl.score}
          accent={acc}
          goalLabel={tut.tut?.goalChip ?? 'Corta el pánico antes del final'}
        />
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="corridaBancaria"
          label="¿Qué es una corrida bancaria?"
          onSeen={onConceptSeen}
        />
        {state.corralito && (
          <span
            className="rounded-full px-2.5 py-1 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
            style={{ background: '#FBDAD3', color: '#D24C39' }}
          >
            Corralito activo
          </span>
        )}
      </div>

      <div ref={metersRef} className="mt-4 space-y-2.5">
        <LifeBar variant="vault" label="Reservas del sistema" value={state.reservas} />
        <LifeBar variant="crowd" label="Confianza del público" value={state.confianza} />
      </div>

      <ComboBadge combo={gl.combo} />

      {report && advisor && report.reaccion && (
        <AdvisorBubble
          portrait={portraits[advisor.id]}
          name={advisor.name}
          nameColor={acc.edge}
          subtitle={`retiro del día: −${report.retiro}`}
          text={report.reaccion}
        />
      )}

      {!over && pendingEvent && (
        <EventCard
          evento={pendingEvent}
          mes={state.dia}
          mesLabel="Día"
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
            Elige una medida para hoy
          </p>
          <div ref={actionsRef} className="mt-2 space-y-2">
            {cfg.acciones.map((a, i) => {
              const disp = accionDisponible(state, a)
              const restantes = a.usos != null ? a.usos - (state.usos[a.id] ?? 0) : null
              const pal = ACTION_PALETTE[i % ACTION_PALETTE.length]
              const prev = previewAction(state, cfg, a)
              const pills = [
                deltaLabel('Reservas', prev.reservas),
                deltaLabel('Confianza', prev.confianza),
              ].filter(Boolean)
              return (
                <CandyAction
                  key={a.id}
                  id={a.id}
                  face={pal.face}
                  edge={pal.edge}
                  name={a.name}
                  hint={a.desc}
                  meta={
                    a.usos != null
                      ? disp
                        ? `${restantes} uso`
                        : 'usado'
                      : a.decae
                        ? 'se desgasta'
                        : undefined
                  }
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
            state.colapso
              ? 'Las reservas se agotaron. No hay vuelta atrás.'
              : 'Pasaron los días. Es hora de ver en qué quedó Paicio.'
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
