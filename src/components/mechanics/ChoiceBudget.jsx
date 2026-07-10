import { useMemo, useRef, useState } from 'react'
import { sfx } from '../../lib/sound.js'
import { useScreenFx } from '../../lib/animations.js'
import { accentFor } from '../../theme/accents.js'
import CoachMarks from '../CoachMarks.jsx'
import { useTutorial } from '../../hooks/useTutorial.js'
import {
  MechanicShell,
  TopBar,
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
  initChoiceBudget,
  itemsDeRonda,
  costoDe,
  felicidadDe,
  applyRound,
  isOver,
  outcomeTier,
} from '../../utils/choiceBudget.js'

// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro) — "La Elección" / asignar presupuesto.
// Tocas los deseos para llevarlos con plata limitada; no puedes tenerlo todo.
// Se enruta por episode.mechanic 'choiceBudget'.
// ─────────────────────────────────────────────────────────────────────────

const METERS = [{ key: 'punteria', label: 'Puntería', goodWhen: 'high', danger: 40 }]
const pesos = (n) => `$${Math.round(n).toLocaleString('es-CL')}`

export default function ChoiceBudget({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(() => episode.choiceBudget, [episode])
  const acc = accentFor(episode.id)

  const [state, setState] = useState(() => initChoiceBudget(cfg, dailySeed))
  const [seleccion, setSeleccion] = useState([])
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)
  const tier = over ? outcomeTier(state, cfg) : null
  const gl = useGameLayer({ eventos: [], totalTurns: cfg.rondas, meters: METERS, trigger, seed: dailySeed })

  const goalRef = useRef(null)
  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const tut = useTutorial(episode.id, {
    refByTarget: { goal: goalRef, meters: metersRef, actions: actionsRef },
    over,
    pendingEvent: null,
    firstTurnActive: state.ronda === 1,
  })

  const rd = over ? null : itemsDeRonda(cfg, state.ronda)
  const presupuesto = rd?.presupuesto ?? 0
  const costo = rd ? costoDe(rd.items, seleccion) : 0
  const felicidad = rd ? felicidadDe(rd.items, seleccion) : 0
  const queda = presupuesto - costo

  function toggle(item) {
    if (over) return
    const puesto = seleccion.includes(item.id)
    if (!puesto && item.precio > queda) {
      sfx('alert')
      trigger('shake')
      return
    }
    sfx('click')
    setSeleccion((s) => (puesto ? s.filter((id) => id !== item.id) : [...s, item.id]))
  }

  function confirmar() {
    if (over) return
    sfx('click')
    const next = applyRound(state, cfg, seleccion)
    setSeleccion([])
    setState(next)
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
    if (next.punteria >= 85) sfx('coin')
  }

  const endText =
    tier === 'perfect'
      ? 'Elegiste casi siempre lo que más felicidad te daba con la plata que tenías. Entendiste el costo de oportunidad: como no puedes tenerlo todo, lo caro de cada elección es lo mejor que dejas fuera.'
      : tier === 'partial'
        ? 'Elegiste bien varias veces, pero en otras dejaste felicidad sobre la mesa: gastaste en algo que rendía menos que otra combinación posible. Priorizar dentro del presupuesto es el juego.'
        : 'Casi siempre quedaste lejos de la mejor combinación: o no gastaste lo que podías, o elegiste deseos que rendían poco por su precio. Con plata limitada, cada elección cuesta lo que dejas fuera.'

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#EAF6F3)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="La Elección"
        crisis="Tu bolsillo · costo de oportunidad"
        accent={acc}
        pill={over ? 'Fin' : `Mes ${Math.min(state.ronda, cfg.rondas)} / ${cfg.rondas}`}
      />

      {!over && (
        <div ref={goalRef}>
          <GameProgress
            mes={state.ronda}
            meses={cfg.rondas}
            score={gl.score}
            accent={acc}
            goalLabel={tut.tut?.goalChip ?? 'Elige lo que más felicidad te deje con tu plata'}
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip conceptId="costoOportunidad" label="¿Qué es el costo de oportunidad?" onSeen={onConceptSeen} />
      </div>

      {/* Resumen de la ronda pasada (costo de oportunidad) */}
      {state.ultimoResumen && !over && (
        <div className="animate-fade-up mt-3 rounded-[14px] border border-dashed border-ink-mute/50 bg-surface/80 p-2.5">
          <p className="font-nunito text-[0.78rem] leading-snug text-ink-soft">
            Ronda pasada lograste{' '}
            <span className="font-extrabold text-ink-warm">{state.ultimoResumen.fel}</span> de{' '}
            {state.ultimoResumen.optimo} felicidad posible.
            {state.ultimoResumen.sacrificio && (
              <>
                {' '}Sacrificaste:{' '}
                <span className="font-extrabold text-ink-warm">{state.ultimoResumen.sacrificio}</span>.
              </>
            )}
          </p>
        </div>
      )}

      {over ? (
        <EndPanel
          text={endText}
          onComplete={() => onComplete(tier, { score: gl.score, momentumMax: gl.momentumMax })}
        />
      ) : (
        <>
          {/* Presupuesto + felicidad */}
          <div ref={metersRef} className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="shadow-card rounded-[16px] bg-surface p-3 text-center">
              <p
                className="font-round text-[1.4rem] font-bold tabular-nums"
                style={{ color: queda < 0 ? '#C43D2C' : '#2E9E8F' }}
              >
                {pesos(queda)}
              </p>
              <p className="mt-0.5 font-nunito text-[0.58rem] font-extrabold uppercase tracking-wide text-ink-mute">
                💵 Te queda de {pesos(presupuesto)}
              </p>
            </div>
            <div className="shadow-card rounded-[16px] bg-surface p-3 text-center">
              <p className="font-round text-[1.4rem] font-bold tabular-nums text-ink-warm">{felicidad}</p>
              <p className="mt-0.5 font-nunito text-[0.58rem] font-extrabold uppercase tracking-wide text-ink-mute">
                😊 Felicidad
              </p>
            </div>
          </div>

          <ComboBadge combo={gl.combo} />

          {/* Deseos: tocar para llevar / soltar */}
          <div ref={actionsRef} className="mt-4 space-y-2">
            <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
              Toca lo que quieras llevar
            </p>
            {rd.items.map((item) => {
              const puesto = seleccion.includes(item.id)
              const inalcanzable = !puesto && item.precio > queda
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item)}
                  disabled={inalcanzable}
                  className={`flex w-full items-center gap-3 rounded-[16px] border-2 p-3 text-left transition-all ${
                    puesto ? 'shadow-card' : 'border-transparent bg-surface/70'
                  } ${inalcanzable ? 'opacity-40' : ''}`}
                  style={puesto ? { borderColor: acc.face, background: acc.soft } : { borderColor: 'transparent' }}
                >
                  <span className="text-[1.4rem]" aria-hidden>{item.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-round text-[0.92rem] font-bold text-ink-warm">{item.label}</span>
                    <span className="font-nunito text-[0.7rem] font-bold text-ink-mute">
                      {pesos(item.precio)} · 😊 {item.felicidad}
                    </span>
                  </span>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.8rem] font-bold text-white"
                    style={{ background: puesto ? acc.face : '#CBD9D4' }}
                    aria-hidden
                  >
                    {puesto ? '✓' : '+'}
                  </span>
                </button>
              )
            })}

            <button
              type="button"
              onClick={confirmar}
              className="candy mt-2 w-full px-5 py-3.5 text-[1rem]"
              style={{ '--face': GOLD_ACCENT.face, '--edge': GOLD_ACCENT.edge }}
            >
              Confirmar elección →
            </button>
          </div>
        </>
      )}

      {tut.showMainCoach && (
        <CoachMarks steps={tut.mainSteps} accent={acc} onDone={tut.onMainDone} onSkip={tut.onSkip} />
      )}
    </MechanicShell>
  )
}
