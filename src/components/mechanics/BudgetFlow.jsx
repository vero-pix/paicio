import { useMemo, useRef, useState } from 'react'
import { sfx } from '../../lib/sound.js'
import { useScreenFx, useCountUp } from '../../lib/animations.js'
import { accentFor } from '../../theme/accents.js'
import CoachMarks from '../CoachMarks.jsx'
import { useTutorial } from '../../hooks/useTutorial.js'
import {
  MechanicShell,
  TopBar,
  LifeBar,
  EndPanel,
  EduChip,
  ComboBadge,
  GoldFlash,
  GOLD_ACCENT,
} from './candyKit.jsx'
import Coins from './Coins.jsx'
import GameProgress from './GameProgress.jsx'
import { useGameLayer } from '../../hooks/useGameLayer.js'
import {
  initBudgetFlow,
  previewAllocation,
  multiplicadorEfectivo,
  applyRound,
  isOver,
  outcomeTier,
} from '../../utils/budgetFlow.js'

// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (archetipo #1) — "Repartir el presupuesto" (sliders) para Ep11.
// Verbo NUEVO: arrastras las fronteras de una barra para dividir un presupuesto
// fijo entre palancas; el multiplicador se ve en vivo. Se enruta por
// `episode.mechanicVariant: 'budgetFlow'` sin reemplazar aggregateDemand.
// ─────────────────────────────────────────────────────────────────────────

const METERS = [
  { key: 'desempleo', label: 'Desempleo', goodWhen: 'low', danger: 18 },
  { key: 'inflacion', label: 'Inflación', goodWhen: 'low', danger: 10 },
  { key: 'pib', label: 'PIB', goodWhen: 'high', danger: 60 },
  { key: 'deuda', label: 'Deuda pública', goodWhen: 'low', danger: 70 },
]

// Color por palanca (mismo orden que cfg.palancas).
const SEG_COLORS = [
  { face: '#4FA3E3', edge: '#2F82C4' }, // obra pública
  { face: '#35B98A', edge: '#1F9A6E' }, // transferencias
  { face: '#F5A524', edge: '#D6871A' }, // baja de impuestos
]

const MIN_SEG = 6 // % mínimo por palanca (para que siempre se puedan agarrar)

function deltaLabel(label, n) {
  if (!n) return `${label} ±0`
  return `${label} ${n > 0 ? '+' : '−'}${Math.abs(n)}`
}

export default function BudgetFlow({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(() => episode.budgetFlow, [episode])
  const acc = accentFor(episode.id)
  const palancas = cfg.palancas

  const [state, setState] = useState(() => initBudgetFlow(cfg, dailySeed))
  // Fronteras de la barra (2 divisores → 3 segmentos), en % [0,100].
  const [div, setDiv] = useState(() => {
    const r = cfg.repartoInicial
    return [r[palancas[0].id], r[palancas[0].id] + r[palancas[1].id]]
  })
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)
  const tier = over ? outcomeTier(state, cfg) : null
  const gl = useGameLayer({ eventos: [], totalTurns: cfg.rondas, meters: METERS, trigger, seed: dailySeed })

  const barRef = useRef(null)
  const dragging = useRef(null) // índice del divisor activo (0 | 1 | null)

  const goalRef = useRef(null)
  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const tut = useTutorial(episode.id, {
    refByTarget: { goal: goalRef, meters: metersRef, actions: actionsRef },
    over,
    pendingEvent: null,
    firstTurnActive: state.ronda === 1,
  })

  // reparto entero derivado de los divisores (suma exacta = presupuesto 100).
  const reparto = useMemo(
    () => ({
      [palancas[0].id]: Math.round(div[0]),
      [palancas[1].id]: Math.round(div[1] - div[0]),
      [palancas[2].id]: Math.round(100 - div[1]),
    }),
    [div, palancas],
  )

  const preview = useMemo(() => previewAllocation(cfg, reparto), [cfg, reparto])
  const mult = multiplicadorEfectivo(cfg, reparto)
  const multView = useCountUp(mult * 100, 350) / 100

  function posFromEvent(e) {
    const bar = barRef.current
    if (!bar) return null
    const rect = bar.getBoundingClientRect()
    return Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
  }

  function moveDivider(i, raw) {
    setDiv((prev) => {
      const nd = [...prev]
      if (i === 0) nd[0] = Math.max(MIN_SEG, Math.min(prev[1] - MIN_SEG, raw))
      else nd[1] = Math.max(prev[0] + MIN_SEG, Math.min(100 - MIN_SEG, raw))
      return nd
    })
  }

  function onPointerDown(i, e) {
    if (over) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragging.current = i
    sfx('click')
  }
  function onPointerMove(e) {
    if (dragging.current == null) return
    const pos = posFromEvent(e)
    if (pos != null) moveDivider(dragging.current, pos)
  }
  function onPointerUp(e) {
    if (dragging.current == null) return
    dragging.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  function ejecutar() {
    if (over) return
    sfx('click')
    const next = applyRound(state, cfg, reparto)
    setState(next)
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
    if (next.ultimoEvento) sfx('coin')
  }

  const endText =
    tier === 'perfect'
      ? 'Keynes sonríe: "Exacto. Pusiste la plata donde circula. Cada peso movió más de un peso: eso es el multiplicador. Así se sale de una depresión."'
      : tier === 'partial'
        ? 'Keynes asiente a medias: "Reactivaste algo, pero dejaste plata donde se estanca. El multiplicador se te escapó. La recuperación pide convicción."'
        : state.inflacion >= cfg.objetivo.inflacionMax
          ? 'Keynes frunce el ceño: "Inyectaste demasiado y muy concentrado. La economía se recalentó: la inflación se disparó antes que el empleo."'
          : 'Keynes suspira: "Repartiste donde la plata se ahorra y se fuga del circuito. La paradoja del ahorro ganó: nadie gastó, nadie se empleó."'

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#C5D8EE)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="La Demanda Agregada"
        crisis="John M. Keynes · 1936"
        accent={acc}
        pill={over ? 'Fin' : `Ronda ${Math.min(state.ronda, cfg.rondas)} / ${cfg.rondas}`}
      />

      {!over && (
        <div ref={goalRef}>
          <GameProgress
            mes={state.ronda}
            meses={cfg.rondas}
            score={gl.score}
            accent={acc}
            goalLabel={tut.tut?.goalChip ?? 'Reparte el estímulo donde la plata circula'}
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="demandaAgregada"
          label="¿Qué es el multiplicador?"
          onSeen={onConceptSeen}
        />
      </div>

      <div ref={metersRef} className="mt-4 space-y-2.5">
        <LifeBar variant="flame" label="Desempleo" value={100 - state.desempleo} />
        <LifeBar variant="flame" label="Inflación" value={100 - state.inflacion} />
        <LifeBar variant="vault" label="PIB" value={state.pib} />
        <LifeBar variant="crowd" label="Deuda pública" value={100 - state.deuda} />
      </div>

      <ComboBadge combo={gl.combo} />

      {state.ultimoEvento && !over && (
        <div className="animate-fade-up mt-3 rounded-[14px] border border-dashed border-ink-mute/50 bg-surface/80 p-2.5">
          <p className="font-round text-[0.82rem] font-bold text-ink-warm">
            📰 {state.ultimoEvento.titulo}
          </p>
          <p className="mt-0.5 font-nunito text-[0.76rem] leading-snug text-ink-soft">
            {state.ultimoEvento.desc}
          </p>
        </div>
      )}

      {over ? (
        <EndPanel
          text={endText}
          onComplete={() => onComplete(tier, { score: gl.score, momentumMax: gl.momentumMax })}
        />
      ) : (
        <div ref={actionsRef} className="mt-4">
          <div className="flex items-center justify-between">
            <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
              Reparte ${cfg.presupuesto} de estímulo
            </p>
            <p className="font-nunito text-[0.66rem] font-bold text-ink-mute">
              cada $100 →{' '}
              <span
                className="font-round text-[0.95rem] font-bold tabular-nums"
                style={{ color: mult >= 1.2 ? '#1F9A6E' : mult >= 0.9 ? '#D6871A' : '#C43D2C' }}
              >
                ${Math.round(multView * 100)}
              </span>{' '}
              activos
            </p>
          </div>

          {/* Barra segmentada con divisores arrastrables */}
          <div
            ref={barRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative mt-2 h-14 w-full select-none overflow-hidden rounded-[16px] shadow-card"
            style={{ touchAction: 'none' }}
          >
            {palancas.map((p, i) => {
              const left = i === 0 ? 0 : div[i - 1]
              const right = i === palancas.length - 1 ? 100 : div[i]
              const w = right - left
              const c = SEG_COLORS[i % SEG_COLORS.length]
              return (
                <div
                  key={p.id}
                  className="absolute inset-y-0 flex flex-col items-center justify-center text-white transition-none"
                  style={{ left: `${left}%`, width: `${w}%`, background: c.face }}
                >
                  <span className="text-[1.05rem] leading-none">{p.icon}</span>
                  {w > 12 && (
                    <span className="mt-0.5 font-round text-[0.8rem] font-bold tabular-nums">
                      {reparto[p.id]}%
                    </span>
                  )}
                </div>
              )
            })}
            {/* Handles (divisores) */}
            {div.map((d, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ajustar reparto ${i + 1}`}
                onPointerDown={(e) => onPointerDown(i, e)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="absolute top-1/2 z-10 flex h-11 w-6 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-white/95 shadow-card"
                style={{ left: `${d}%`, touchAction: 'none' }}
              >
                <span className="text-[0.7rem] font-bold text-ink-mute">⇔</span>
              </button>
            ))}
          </div>

          {/* Leyenda de palancas + efecto telegrafiado */}
          <div className="mt-3 space-y-1.5">
            {palancas.map((p, i) => {
              const c = SEG_COLORS[i % SEG_COLORS.length]
              return (
                <div key={p.id} className="flex items-start gap-2">
                  <span
                    className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                    style={{ background: c.face }}
                    aria-hidden
                  />
                  <p className="font-nunito text-[0.72rem] leading-snug text-ink-soft">
                    <span className="font-bold text-ink-warm">{p.label}</span> · {p.desc}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Preview de deltas de la ronda */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              deltaLabel('Desempleo', preview.desempleo),
              deltaLabel('Inflación', preview.inflacion),
              deltaLabel('PIB', preview.pib),
              deltaLabel('Deuda', preview.deuda),
            ].map((t, i) => (
              <span
                key={i}
                className="rounded-full bg-ink-mute/12 px-2 py-0.5 font-nunito text-[0.62rem] font-extrabold text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={ejecutar}
            className="candy mt-4 w-full px-5 py-3.5 text-[1rem]"
            style={{ '--face': GOLD_ACCENT.face, '--edge': GOLD_ACCENT.edge }}
          >
            Ejecutar la ronda →
          </button>
        </div>
      )}

      {tut.showMainCoach && (
        <CoachMarks steps={tut.mainSteps} accent={acc} onDone={tut.onMainDone} onSkip={tut.onSkip} />
      )}
    </MechanicShell>
  )
}
