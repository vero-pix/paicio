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
  initMonopolyPrice,
  unidades,
  ganancia,
  gananciaMax,
  applyRound,
  isOver,
  outcomeTier,
} from '../../utils/monopolyPrice.js'

// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro) — "El Único Vendedor" / slider de precio.
// Mueves el precio y ves la ganancia formar una joroba: hay un punto que la
// maximiza. La competencia baja ese punto. Se enruta por mechanic 'monopolyPrice'.
// ─────────────────────────────────────────────────────────────────────────

const METERS = [{ key: 'punteria', label: 'Puntería', goodWhen: 'high', danger: 40 }]

export default function MonopolyPrice({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(() => episode.monopolyPrice, [episode])
  const acc = accentFor(episode.id)

  const [state, setState] = useState(() => initMonopolyPrice(cfg, dailySeed))
  const [precio, setPrecio] = useState(cfg.precioInicial)
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)
  const tier = over ? outcomeTier(state, cfg) : null
  const gl = useGameLayer({ eventos: [], totalTurns: cfg.rondas, meters: METERS, trigger, seed: dailySeed })

  const trackRef = useRef(null)
  const dragging = useRef(false)

  const goalRef = useRef(null)
  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const tut = useTutorial(episode.id, {
    refByTarget: { goal: goalRef, meters: metersRef, actions: actionsRef },
    over,
    pendingEvent: null,
    firstTurnActive: state.ronda === 1,
  })

  const q = unidades(cfg, state.demanda, state.elasticidad, precio)
  const g = ganancia(cfg, state.demanda, state.elasticidad, precio)
  const gMax = gananciaMax(cfg, state.demanda, state.elasticidad) || 1
  const gPct = Math.max(0, Math.min(100, (g / gMax) * 100))
  const pricePct = ((precio - cfg.precioMin) / (cfg.precioMax - cfg.precioMin)) * 100
  const bajoCosto = precio / cfg.escala < cfg.costo

  function precioFromX(clientX) {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return precio
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const raw = cfg.precioMin + frac * (cfg.precioMax - cfg.precioMin)
    return Math.max(cfg.precioMin, Math.min(cfg.precioMax, Math.round(raw / cfg.precioPaso) * cfg.precioPaso))
  }
  function onPointerDown(e) {
    if (over) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragging.current = true
    setPrecio(precioFromX(e.clientX))
  }
  function onPointerMove(e) {
    if (!dragging.current) return
    setPrecio(precioFromX(e.clientX))
  }
  function onPointerUp(e) {
    if (!dragging.current) return
    dragging.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }
  function nudge(delta) {
    if (over) return
    sfx('click')
    setPrecio((p) => Math.max(cfg.precioMin, Math.min(cfg.precioMax, p + delta)))
  }

  function fijar() {
    if (over) return
    sfx('click')
    const next = applyRound(state, cfg, precio)
    setState(next)
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
    if (next.punteria >= (cfg.umbralAcierto ?? 0.85) * 100) sfx('coin')
    else trigger('shake')
  }

  const moneda = cfg.unidad ?? '$'
  const endText =
    tier === 'perfect'
      ? 'Le achuntaste a la joroba casi siempre. Como único vendedor podías cobrar por encima del costo — y cuando llegó la competencia, el precio justo bajó solo. Eso es el poder de mercado y su límite.'
      : tier === 'partial'
        ? 'Encontraste el punto en varias, pero en otras cobraste de más (te quedaste con stock) o de menos (regalaste margen). La ganancia es una joroba: ni muy caro ni muy barato.'
        : 'Casi siempre quedaste lejos del punto: muy caro espanta a la gente, muy barato regala el margen. El monopolista busca la cima de la joroba — y la competencia la empuja hacia abajo.'

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
        title="El Único Vendedor"
        crisis="La farmacia del pueblo · monopolio"
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
            goalLabel={tut.tut?.goalChip ?? 'Encuentra el precio que más ganancia deja'}
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip conceptId="poderMercado" label="¿Qué es el poder de mercado?" onSeen={onConceptSeen} />
        <span className="font-nunito text-[0.66rem] font-bold text-ink-mute">
          Aciertos: {state.aciertos}/{cfg.rondas}
        </span>
      </div>

      {/* Escena: unidades vendidas + ganancia */}
      <div ref={metersRef} className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="shadow-card rounded-[16px] bg-surface p-3 text-center">
          <p className="font-round text-[1.5rem] font-bold tabular-nums text-ink-warm">{q.toFixed(1)}</p>
          <p className="mt-0.5 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide text-ink-mute">
            🧑‍🤝‍🧑 Unidades vendidas
          </p>
        </div>
        <div className="shadow-card rounded-[16px] bg-surface p-3 text-center">
          <p
            className="font-round text-[1.5rem] font-bold tabular-nums"
            style={{ color: g <= 0 ? '#C43D2C' : gPct >= 85 ? '#1F9A6E' : '#D6871A' }}
          >
            {Math.round(g * cfg.escalaGanancia).toLocaleString('es-CL')}
          </p>
          <p className="mt-0.5 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide text-ink-mute">
            💰 Ganancia
          </p>
        </div>
      </div>

      {/* Barra de ganancia (joroba): qué tan cerca del máximo estás */}
      <div className="mt-3">
        <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: '#DDEEE9' }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${gPct}%`, background: 'linear-gradient(90deg,#6FCEBD,#2E9E8F)' }}
          />
        </div>
      </div>

      <ComboBadge combo={gl.combo} />

      {state.ultimoEvento && !over && (
        <div className="animate-fade-up mt-3 rounded-[14px] border border-dashed border-ink-mute/50 bg-surface/80 p-2.5">
          <p className="font-round text-[0.82rem] font-bold text-ink-warm">{state.ultimoEvento.titulo}</p>
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
          <div className="flex items-baseline justify-between">
            <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
              Precio · costo {Math.round(cfg.costo * cfg.escala).toLocaleString('es-CL')}{moneda}/u
            </p>
            <p className="font-round text-[1.6rem] font-bold tabular-nums text-ink-warm">
              {Math.round(precio).toLocaleString('es-CL')}
              <span className="ml-1 font-nunito text-[0.7rem] font-bold text-ink-mute">{moneda}</span>
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => nudge(-cfg.precioPaso)}
              aria-label="Bajar precio"
              className="candy candy-soft flex h-10 w-10 shrink-0 items-center justify-center text-[1.2rem]"
            >
              −
            </button>
            <div
              ref={trackRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative h-10 flex-1 cursor-ew-resize rounded-full shadow-card"
              style={{ background: bajoCosto ? '#F3D9D3' : '#DDEEE9', touchAction: 'none' }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${pricePct}%`, background: `linear-gradient(90deg,${acc.soft},${acc.face})` }}
              />
              <span
                className="absolute top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-card"
                style={{ left: `${pricePct}%` }}
              >
                <span className="text-[0.8rem]" style={{ color: acc.edge }}>💊</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => nudge(cfg.precioPaso)}
              aria-label="Subir precio"
              className="candy candy-soft flex h-10 w-10 shrink-0 items-center justify-center text-[1.2rem]"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={fijar}
            className="candy mt-4 w-full px-5 py-3.5 text-[1rem]"
            style={{ '--face': GOLD_ACCENT.face, '--edge': GOLD_ACCENT.edge }}
          >
            Fijar precio →
          </button>
        </div>
      )}

      {tut.showMainCoach && (
        <CoachMarks steps={tut.mainSteps} accent={acc} onDone={tut.onMainDone} onSkip={tut.onSkip} />
      )}
    </MechanicShell>
  )
}
