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
  initMarketEquilibrium,
  cantidades,
  estado,
  applyRound,
  isOver,
  outcomeTier,
} from '../../utils/marketEquilibrium.js'

// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro, ep15) — "El Precio Justo" / aguja de equilibrio.
// Mueves el precio (aguja o −/+) y ves en vivo el cruce de oferta y demanda:
// sobra, falta o se vacía justo. Se enruta por episode.mechanic 'marketEquilibrium'.
// ─────────────────────────────────────────────────────────────────────────

const METERS = [{ key: 'precision', label: 'Puntería', goodWhen: 'high', danger: 30 }]

const TONO = {
  equilibrio: { face: '#35B98A', edge: '#1F9A6E', label: '✅ ¡Mercado vaciado!' },
  escasez: { face: '#E8604F', edge: '#C43D2C', label: '🏃 Se agota — falta producto' },
  excedente: { face: '#F5A524', edge: '#D6871A', label: '🧺 Sobra — góndola llena' },
}

export default function MarketEquilibrium({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(() => episode.marketEquilibrium, [episode])
  const acc = accentFor(episode.id)

  const [state, setState] = useState(() => initMarketEquilibrium(cfg, dailySeed))
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

  const { qd, qs } = cantidades(cfg, state.demanda, precio)
  const est = estado(cfg, state.demanda, precio)
  const tono = TONO[est.tipo]
  const barMax = cfg.barMax ?? 20
  const pct = ((precio - cfg.precioMin) / (cfg.precioMax - cfg.precioMin)) * 100

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
    if (est.tipo === 'equilibrio') { sfx('coin') } else { trigger('shake') }
  }

  const moneda = cfg.unidad ?? '$'
  const endText =
    tier === 'perfect'
      ? `Vaciaste el mercado casi siempre. Entendiste lo esencial: el precio no es capricho — lo fija dónde se cruzan lo que hay y lo que la gente quiere.`
      : tier === 'partial'
        ? 'Le achuntaste a varias, pero otras quedaron con cola o con sobra. El equilibrio se mueve cada vez que cambia la demanda: hay que perseguirlo.'
        : 'Casi siempre quedó cola o góndola llena. Cuando el precio no calza con la demanda, o falta producto o sobra: buscar ese punto justo es la pega.'

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#FBE7C6)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="El Precio Justo"
        crisis="La feria · oferta y demanda"
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
            goalLabel={tut.tut?.goalChip ?? 'Vacía el mercado: ni cola ni góndola llena'}
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="equilibrioMercado"
          label="¿Qué es el equilibrio?"
          onSeen={onConceptSeen}
        />
        <span className="font-nunito text-[0.66rem] font-bold text-ink-mute">
          Vaciados: {state.vaciadas}/{cfg.rondas}
        </span>
      </div>

      {/* Escena del mercado: cuánto hay (oferta) vs cuánto quieren (demanda) */}
      <div ref={metersRef} className="mt-4 space-y-2.5">
        <QtyBar label="🥬 Hay en el puesto" value={qs} max={barMax} color="#35B98A" />
        <QtyBar label="🛒 Quieren comprar" value={qd} max={barMax} color="#4FA3E3" />
      </div>

      {/* Veredicto en vivo */}
      <div
        className="mt-3 flex items-center justify-center rounded-[14px] px-3 py-2 font-round text-[0.95rem] font-bold text-white shadow-card"
        style={{ background: tono.face }}
      >
        {tono.label}
      </div>

      <ComboBadge combo={gl.combo} />

      {state.ultimoEvento && !over && (
        <div className="animate-fade-up mt-3 rounded-[14px] border border-dashed border-ink-mute/50 bg-surface/80 p-2.5">
          <p className="font-round text-[0.82rem] font-bold text-ink-warm">
            {state.ultimoEvento.titulo}
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
          <div className="flex items-baseline justify-between">
            <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
              Tu precio
            </p>
            <p className="font-round text-[1.6rem] font-bold tabular-nums text-ink-warm">
              ${precio.toLocaleString('es-CL')}
              <span className="ml-1 font-nunito text-[0.7rem] font-bold text-ink-mute">{moneda}</span>
            </p>
          </div>

          {/* Aguja de precio: arrastra el riel o usa −/+ */}
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
              style={{ background: '#F3E2C2', touchAction: 'none' }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg,${acc.soft},${acc.face})` }}
              />
              <span
                className="absolute top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-card"
                style={{ left: `${pct}%` }}
              >
                <span className="text-[0.8rem]" style={{ color: acc.edge }}>⚖️</span>
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

function QtyBar({ label, value, max, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-36 shrink-0 font-nunito text-[0.68rem] font-extrabold text-ink-soft">
        {label}
      </span>
      <div
        className="h-3 flex-1 overflow-hidden rounded-full"
        style={{ background: '#F3E2C2', boxShadow: 'inset 0 1px 2px rgba(140,90,30,.25)' }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color, transition: 'width 0.25s ease-out' }}
        />
      </div>
      <span className="w-12 shrink-0 text-right font-round text-[0.8rem] font-bold tabular-nums text-ink-warm">
        {value.toFixed(1)}
      </span>
    </div>
  )
}
