import { useEffect, useMemo, useRef, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import EducationalTooltip from '../EducationalTooltip.jsx'
import CausalChain from '../CausalChain.jsx'
import { sfx } from '../../lib/sound.js'
import { useScreenFx, useCountUp } from '../../lib/animations.js'
import ActionIcon from '../icons/ActionIcon.jsx'
import { accentFor } from '../../theme/accents.js'
import {
  initHyperinflation,
  playMonth,
  isOver,
  outcomeTier,
  accionDisponible,
  precioPan,
  eventoDelMes,
  applyEvent,
  previewAction,
} from '../../utils/hyperinflation.js'
import EventCard from './EventCard.jsx'
import CoachMarks from '../CoachMarks.jsx'
import Coins from './Coins.jsx'
import GameProgress from './GameProgress.jsx'
import { tutorialFor } from '../../theme/tutorials.js'

// Puntaje corrido de la partida (game feel): acumula el "mérito" de cada mes.
// Solo UI — no toca la lógica de la mecánica. Premia frenar la inflación, subir
// el apoyo y encadenar combos; nunca resta (siempre sube).
function turnReward(prev, next) {
  let p = 35 // base por jugar el mes
  if (next.inflacion < prev.inflacion) p += (prev.inflacion - next.inflacion) * 8
  if (next.apoyo > prev.apoyo) p += (next.apoyo - prev.apoyo) * 5
  p += (next.momentum ?? 0) * 25
  return Math.round(p)
}

// Tutorial visto (una sola vez). { main, event } se marcan por separado para
// que el paso contextual del evento no dependa de haber visto los pasos base.
const TUT_KEY = 'paicio.tutorial.v1'
function loadTutorial() {
  try {
    const r = JSON.parse(localStorage.getItem(TUT_KEY))
    if (r && typeof r === 'object') return { main: false, event: false, ...r }
  } catch {
    /* localStorage no disponible */
  }
  return { main: false, event: false }
}

// ─────────────────────────────────────────────────────────────────────────
// HyperInflation — mecánica del Episodio 1 (hiperinflación de Weimar).
// Contrato común: (episode, allies, onComplete, onConceptSeen).
//
// REDISEÑO LatAm (capa de presentación): medidores "barra de vida", cifra
// protagonista en card oscura, asesor en marco-moneda y grid 2×2 de acciones
// táctiles. La lógica (initHyperinflation / playMonth / isOver / outcomeTier)
// es la misma de antes: acá solo cambia el look.
// ─────────────────────────────────────────────────────────────────────────

const fmt = (n) => Math.round(n).toLocaleString('es-CL')

// Etiqueta corta de un delta telegrafiado ("Inflación +9"). null si no cambia.
function deltaLabel(label, n) {
  if (!n) return null
  return `${label} ${n > 0 ? '+' : '−'}${Math.abs(Math.round(n))}`
}

// Acento táctil por acción (face + labio 3D).
const ACTION_ACCENT = {
  imprimir: { face: '#F5A524', edge: '#D6871A' },
  ajuste: { face: '#F06A54', edge: '#D24C39' },
  renegociar: { face: '#4FA3E3', edge: '#2F82C4' },
  reforma: { face: '#35B98A', edge: '#1F9A6E' },
}

// Hint corto para la celda de la acción (el desc largo vive en los datos).
function actionHint(a, restantes) {
  switch (a.id) {
    case 'imprimir':
      return 'Paga hoy · +inflación'
    case 'ajuste':
      return '−inflación · −apoyo'
    case 'renegociar':
      return `Alivio · ${restantes} ${restantes === 1 ? 'uso' : 'usos'}`
    case 'reforma':
      return 'La salida real'
    default:
      return a.desc
  }
}

// Íconos de medidor (heredan color con currentColor).
const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 .6 2 2 2 0-2-1-4 0-6z" />
  </svg>
)
const CrowdIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <circle cx="6" cy="8" r="1.6" />
    <circle cx="12" cy="7" r="1.6" />
    <circle cx="18" cy="8" r="1.6" />
    <path d="M3 17c0-2 1.5-3 3-3s3 1 3 3" />
    <path d="M9 16c0-2 1.5-3 3-3s3 1 3 3" />
    <path d="M15 17c0-2 1.5-3 3-3s3 1 3 3" />
  </svg>
)

// Barra de vida temática (icono + label + valor + track con relleno degradado).
function LifeBar({ icon, iconColor, label, value, fill, valueColor, tint }) {
  const pct = Math.max(0, Math.min(100, value))
  const display = Math.round(useCountUp(value, 700))
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px]"
        style={{ background: tint, color: iconColor }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <span className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-mute">
            {label}
          </span>
          <span
            key={Math.round(value)}
            className="animate-pop-big font-round text-[0.82rem] font-bold tabular-nums"
            style={{ color: valueColor }}
          >
            {display}%
          </span>
        </div>
        <div
          className="mt-1 h-2.5 overflow-hidden rounded-full"
          style={{ background: '#F3E2C2', boxShadow: 'inset 0 1px 2px rgba(140,90,30,.25)' }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: fill, transition: 'width 0.6s ease-out' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function HyperInflation({ episode, dailySeed, onComplete, onConceptSeen }) {
  // El mazo de eventos vive en episode.eventos (dato del episodio); lo sumamos a
  // la config de la mecánica para que la capa de game loop lo lea desde cfg.
  const cfg = useMemo(
    () => ({ ...episode.hyperinflation, eventos: episode.eventos ?? [] }),
    [episode],
  )
  const acc = accentFor(episode.id)
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  // dailySeed (Reto Diario) hace la partida determinista; sin él, azar normal.
  const [state, setState] = useState(() => initHyperinflation(cfg, dailySeed ?? undefined))
  const [report, setReport] = useState(null)
  const [picked, setPicked] = useState(null)
  const [combo, setCombo] = useState(0) // momentum a mostrar como badge (0 = oculto)
  const [eventNote, setEventNote] = useState(null) // réplica de la última carta resuelta
  const [score, setScore] = useState(0) // puntaje corrido (game feel)
  const [burstKey, setBurstKey] = useState(0) // dispara estallido de monedas
  const [rainKey, setRainKey] = useState(0) // dispara lluvia de monedas (celebración)
  const [gold, setGold] = useState(false) // destello dorado de la celebración
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)
  const [showChain, setShowChain] = useState(false)

  useEffect(() => {
    if (over) setShowChain(true)
  }, [over])

  // La Reforma "está a tiro" cuando aún es creíble (frenaría en seco).
  const reformaReady = !over && !state.reformo && state.inflacion < cfg.umbralReforma

  // Carta de evento pendiente para este mes (deriva del estado; se “consume” al
  // resolverla porque queda en eventosVistos). Bloquea las acciones hasta cerrarla.
  const pendingEvent = over ? null : eventoDelMes(state, cfg)

  // ── Onboarding (coach-marks) ────────────────────────────────────────────
  const tut = tutorialFor(episode.id)
  const [seenTut, setSeenTut] = useState(loadTutorial)
  // Refs a los elementos REALES que resalta el tutorial.
  const goalRef = useRef(null)
  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const reformaRef = useRef(null)
  const eventRef = useRef(null)
  const refByTarget = { goal: goalRef, meters: metersRef, actions: actionsRef, reforma: reformaRef }

  function persistTut(next) {
    setSeenTut(next)
    try {
      localStorage.setItem(TUT_KEY, JSON.stringify(next))
    } catch {
      /* localStorage no disponible */
    }
  }
  const skipAllTut = () => persistTut({ main: true, event: true })

  // Pasos base (1-4): al entrar a la pantalla de decisión con acciones visibles.
  // Paso evento (5): la 1ª vez que aparece una carta. Nunca coinciden (la carta
  // oculta las acciones), así que se muestran en secuencia.
  const showEventCoach = !!tut && !seenTut.event && !!pendingEvent
  const showMainCoach = !!tut && !seenTut.main && !over && !pendingEvent
  const mainSteps = tut ? tut.steps.map((s) => ({ ref: refByTarget[s.target], caption: s.caption })) : []

  // Primer turno guiado: pulso en la acción sugerida durante el mes 1, hasta la
  // primera decisión. No convive con el coach (para no saturar).
  const hintAction = tut?.firstTurnHint?.action
  const showFirstHint =
    !!tut?.firstTurnHint && state.mes === 1 && !over && !pendingEvent && !showMainCoach && !showEventCoach

  // Precio del pan (dato del juego) y su salto respecto al mes anterior. El ref
  // se fija dentro de elegir() (una vez por decisión), así el delta no se borra
  // con los re-renders del count-up de los medidores.
  const precio = precioPan(state.inflacion)
  const prevMonthPrice = useRef(null)
  const deltaPct = prevMonthPrice.current
    ? Math.round((precio / prevMonthPrice.current - 1) * 100)
    : 0

  const bad = (s) => s.inflacion >= 70 || s.apoyo <= 30

  function elegir(accion) {
    if (over || pendingEvent || !accionDisponible(state, accion)) return
    sfx('click')
    setEventNote(null)
    prevMonthPrice.current = precioPan(state.inflacion) // precio del mes que se deja
    setPicked(accion.id)
    setTimeout(() => setPicked(null), 260)
    const { state: next, report: rep } = playMonth(state, cfg, accion)
    setState(next)
    setReport(rep)

    // Puntaje corrido (siempre suma). La reforma exitosa lleva un plus.
    const reformaWin = accion.id === 'reforma' && next.reformaExitosa
    setScore((s) => s + turnReward(state, next) + (reformaWin ? 200 : 0))

    const gameOver = isOver(next, cfg)
    const good = !bad(next) && (rep.buenMes || next.inflacion < state.inflacion || next.apoyo > state.apoyo)

    if (reformaWin) {
      // Celebración grande: lluvia de monedas + destello dorado + fanfarria.
      sfx('fanfare')
      setRainKey((k) => k + 1)
      setGold(true)
      setTimeout(() => setGold(false), 800)
    } else if (bad(next) && !bad(state)) {
      // Mal movimiento: se mantiene el castigo, pero suave.
      sfx('alert')
      trigger('shake')
    } else if (good && !gameOver) {
      // Buen movimiento: monedas + sting positivo (se siente MÁS que el malo).
      sfx('coin')
      setBurstKey((k) => k + 1)
      trigger('flash')
    }

    // Combo: a partir de 2 meses buenos encadenados, badge + brillo creciente.
    if (rep.momentum >= 2) {
      setCombo(rep.momentum)
      setTimeout(() => setCombo(0), 1200)
    } else {
      setCombo(0)
    }
  }

  // Resuelve una carta de evento (pasiva o rama de decisión): aplica su efecto
  // por el mismo clamp y da feedback. No avanza el mes (eso lo hace la acción).
  function resolverEvento(efecto, opcion) {
    sfx('newspaper')
    const next = applyEvent(state, pendingEvent, efecto)
    setState(next)
    setEventNote(opcion?.replica ?? null)

    // Evento bueno (baja inflación o sube apoyo): monedas + puntaje. Malo: shake suave.
    const evReward = Math.max(0, (state.inflacion - next.inflacion) * 8 + (next.apoyo - state.apoyo) * 5)
    if (evReward > 0) {
      setScore((s) => s + evReward)
      sfx('coin')
      setBurstKey((k) => k + 1)
      trigger('flash')
    } else if (bad(next) && !bad(state)) {
      sfx('alert')
      trigger('shake')
    }
  }

  // Auto-descarta el toast del asesor tras 3s.
  useEffect(() => {
    if (!report) return
    const t = setTimeout(() => setReport(null), 3000)
    return () => clearTimeout(t)
  }, [report])

  const tier = over ? outcomeTier(state, cfg) : null
  const advisor = report ? prisonersById[report.advisor] : null

  return (
    <div className={`on-cream relative ${fx === 'shake' ? 'animate-shake' : ''}`}>
      {/* Fondo luminoso de pantalla (cubre el viewport de esta mecánica). */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg,#FFF3DA,#FBE6C2)' }}
      />
      {fx === 'flash' && (
        <div
          className="animate-flash-green pointer-events-none fixed inset-0 z-40"
          style={{ background: 'var(--color-good)' }}
          aria-hidden
        />
      )}
      {gold && (
        <div
          className="animate-flash-gold pointer-events-none fixed inset-0 z-40"
          style={{ background: 'radial-gradient(circle at 50% 45%, #FFE9A8, #F5B331 70%)' }}
          aria-hidden
        />
      )}
      <Coins runKey={burstKey} mode="burst" count={16} />
      <Coins runKey={rainKey} mode="rain" count={30} />

      <div className="mx-auto max-w-md px-5 pb-6 pt-1">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-round text-[1.6rem] font-bold leading-none text-ink-warm">
              {episode.titulo}
            </h2>
            <p
              className="mt-1 font-nunito text-[0.66rem] font-extrabold uppercase tracking-wide"
              style={{ color: acc.edge }}
            >
              {episode.crisisHistorica}
            </p>
          </div>
          <span
            className="candy shrink-0 px-3.5 py-2 text-[0.8rem]"
            style={{ '--face': acc.face, '--edge': acc.edge }}
          >
            {over ? 'Fin' : `Mes ${state.mes} / ${cfg.meses}`}
          </span>
        </div>

        {/* Progreso: solo score + timeline compacto */}
        {!over && (
          <GameProgress
            mes={state.mes}
            meses={cfg.meses}
            score={score}
            accent={acc}
          />
        )}

        {/* Medidores */}
        <div ref={metersRef} className="mt-4 space-y-2.5">
          <LifeBar
            icon={<FlameIcon />}
            iconColor="#E8604F"
            tint="#FBDAD3"
            label="Inflación"
            value={state.inflacion}
            fill="linear-gradient(90deg,#F5A524,#E8604F)"
            valueColor="#E8604F"
          />
          <LifeBar
            icon={<CrowdIcon />}
            iconColor="#2FB37E"
            tint="#D6F0E5"
            label="Apoyo popular"
            value={state.apoyo}
            fill="linear-gradient(90deg,#7FD3A6,#2FB37E)"
            valueColor="#2FB37E"
          />
        </div>

        {/* Combo: racha de meses buenos (premio visual creciente) */}
        {combo >= 2 && (
          <div className="mt-2.5 flex justify-center" aria-live="polite">
            <span
              className="candy animate-pop px-3 py-1.5 text-[0.78rem]"
              style={{
                '--face': '#F5B331',
                '--edge': '#E0912A',
                filter: `drop-shadow(0 0 ${combo * 3}px rgba(245,179,49,${0.35 + combo * 0.12}))`,
              }}
            >
              🔥 ¡Racha ×{combo}!
            </span>
          </div>
        )}

        {/* Cifra protagonista — el precio del pan */}
        <div
          ref={goalRef}
          className="shadow-card-dark relative mt-4 overflow-hidden rounded-[22px] p-3.5"
          style={{ background: 'linear-gradient(160deg,#3B2A17,#26190B)' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,179,49,.25), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F3E2C2] text-[1.2rem]">
              🍞
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-[#E8C67F]">
                Precio del pan
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  key={Math.round(precio)}
                  className="animate-pop font-round text-[1.5rem] font-bold leading-none tabular-nums text-[#FFE9A8]"
                >
                  {fmt(precio)}
                </span>
                <span className="font-round text-[0.9rem] font-semibold text-[#C9A24B]">
                  {cfg.moneda ?? 'Mk'}
                </span>
              </div>
            </div>
            {deltaPct > 0 && (
              <span
                className="candy shrink-0 self-start px-2.5 py-1.5 text-center text-[0.62rem] font-extrabold leading-tight"
                style={{ '--face': '#E8604F', '--edge': '#C43D2C' }}
              >
                ▲ {deltaPct}%
                <span className="block text-[0.5rem] font-bold opacity-90">en 1 mes</span>
              </span>
            )}
          </div>
          <div className="relative mt-1.5">
            <EducationalTooltip
              conceptId="senoreaje"
              label="¿Por qué imprimir es una trampa?"
              onSeen={onConceptSeen}
            />
          </div>
        </div>

        {/* Réplica del asesor (toast breve sobre las acciones) */}
        {report && advisor && (
          <div className="animate-fade-up fixed bottom-24 left-1/2 z-30 -translate-x-1/2">
            <div className="shadow-card flex max-w-[18rem] items-start gap-2 rounded-[16px] rounded-tl-[5px] bg-surface p-2.5">
              <span className="coin flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full p-[2px]">
                <img
                  src={portraits[advisor.id]}
                  alt=""
                  className="h-full w-full rounded-full border-2 border-white object-cover"
                />
              </span>
              <div className="min-w-0">
                <p className="font-round text-[0.7rem] font-bold" style={{ color: acc.edge }}>
                  {advisor.name}
                </p>
                <p className="mt-0.5 font-nunito text-[0.75rem] leading-snug text-ink-soft">
                  {report.reaccion}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Carta de evento del mes (gate antes de las acciones) */}
        {!over && pendingEvent && (
          <EventCard
            evento={pendingEvent}
            mes={state.mes}
            accent={acc}
            onResolve={resolverEvento}
            spotlightRef={eventRef}
            swipe={episode.swipeEvents !== false}
          />
        )}

        {/* Réplica breve tras resolver una carta de decisión */}
        {!over && eventNote && (
          <p className="animate-fade-up mt-3 rounded-[14px] bg-panel/80 px-3 py-2 font-nunito text-[0.8rem] italic leading-snug text-ink-soft">
            {eventNote}
          </p>
        )}

        {/* Acciones */}
        {!over && !pendingEvent && (
          <div className="mt-4">
            <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
              ¿Qué haces este mes?
            </p>
            <div ref={actionsRef} className="mt-2 grid grid-cols-2 gap-2">
              {cfg.acciones.map((a) => {
                const disp = accionDisponible(state, a)
                const restantes = a.usos != null ? a.usos - (state.usos[a.id] ?? 0) : null
                const ac = ACTION_ACCENT[a.id] ?? { face: acc.face, edge: acc.edge }
                const prev = previewAction(state, cfg, a) // telegrafiado
                const infl = deltaLabel('Inflación', prev.inflacion)
                const apy = deltaLabel('Apoyo', prev.apoyo)
                const isHint = showFirstHint && a.id === hintAction && disp
                return (
                  <button
                    key={a.id}
                    ref={a.id === 'reforma' ? reformaRef : undefined}
                    type="button"
                    disabled={!disp}
                    onClick={() => elegir(a)}
                    className={`candy relative p-2.5 text-left ${picked === a.id ? 'translate-y-1' : ''}`}
                    style={{ '--face': ac.face, '--edge': ac.edge }}
                  >
                    {isHint && (
                      <>
                        <span
                          aria-hidden
                          className="animate-ring pointer-events-none absolute -inset-0.5 rounded-[16px]"
                          style={{ boxShadow: `0 0 0 3px ${ac.face}` }}
                        />
                        <span
                          className="animate-bob pointer-events-none absolute -top-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 font-nunito text-[0.6rem] font-extrabold text-white shadow-card"
                          style={{ background: ac.edge }}
                        >
                          👆 {tut.firstTurnHint.label}
                        </span>
                      </>
                    )}
                    <span className="flex items-center gap-2">
                      <ActionIcon id={a.id} className="h-5 w-5 shrink-0 text-white" />
                      <span className="font-round text-[0.92rem] font-bold leading-tight">
                        {a.name}
                      </span>
                    </span>
                    <span className="mt-1 block font-nunito text-[0.66rem] font-extrabold leading-tight text-white/85">
                      {actionHint(a, restantes)}
                    </span>
                    {restantes != null && restantes <= 2 && (
                      <span className="mt-1 inline-block rounded-full bg-black/20 px-1.5 py-0.5 font-nunito text-[0.58rem] font-extrabold text-white/90">
                        {restantes} {restantes === 1 ? 'uso' : 'usos'} restantes
                      </span>
                    )}
                    {(infl || apy) && (
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {infl && (
                          <span className="rounded-full bg-white/20 px-1.5 py-0.5 font-nunito text-[0.68rem] font-extrabold text-white">
                            {infl}
                          </span>
                        )}
                        {apy && (
                          <span className="rounded-full bg-white/20 px-1.5 py-0.5 font-nunito text-[0.68rem] font-extrabold text-white">
                            {apy}
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Fin */}
        {over && (
          <div className="animate-fade-up mt-5">
            <p className="font-nunito text-[0.92rem] leading-snug text-ink-soft">
              {state.derrocado
                ? 'El pueblo, harto de que el pan no alcance, te sacó del Ministerio.'
                : state.colapso
                  ? 'El peso dejó de servir: la gente ya no lo acepta ni regalado.'
                  : state.reformo
                    ? 'Aplicaste el plan de estabilización. Veamos si el pueblo le creyó.'
                    : 'Pasaron los meses. Es hora de ver qué quedó de Paicio.'}
            </p>

            {showChain && (
              <CausalChain onDone={() => setShowChain(false)} />
            )}

            {!showChain && (
              <button
                type="button"
                onClick={() => onComplete(tier, { score, momentumMax: state.momentumMax })}
                className="candy mt-4 w-full px-5 py-3.5 text-[1rem]"
                style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
              >
                Ver el desenlace →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Coach-marks de onboarding (una sola vez). El del evento tiene prioridad
          si hay carta en pantalla; si no, los pasos base. */}
      {showEventCoach && (
        <CoachMarks
          steps={[{ ref: eventRef, caption: tut.event.caption }]}
          accent={acc}
          onDone={() => persistTut({ ...seenTut, event: true })}
          onSkip={skipAllTut}
        />
      )}
      {showMainCoach && (
        <CoachMarks
          steps={mainSteps}
          accent={acc}
          onDone={() => persistTut({ ...seenTut, main: true })}
          onSkip={skipAllTut}
        />
      )}
    </div>
  )
}
