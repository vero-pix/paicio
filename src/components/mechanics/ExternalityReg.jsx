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
  initExternalityReg,
  actividad,
  regeneracion,
  presion,
  applyRound,
  isOver,
  outcomeTier,
} from '../../utils/externalityReg.js'

// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro) — "La Cuenta de Todos" / regular un río compartido.
// Pones el límite a la pesca cada temporada: poco límite mata el río, mucho mata
// la economía. Se enruta por episode.mechanic 'externalityReg'.
// ─────────────────────────────────────────────────────────────────────────

const METERS = [{ key: 'rio', label: 'Río', goodWhen: 'high', danger: 30 }]

export default function ExternalityReg({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(() => episode.externalityReg, [episode])
  const acc = accentFor(episode.id)

  const [state, setState] = useState(() => initExternalityReg(cfg, dailySeed))
  const [limite, setLimite] = useState(cfg.limiteInicial)
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

  const act = actividad(cfg, state.rio, limite)
  const delta = regeneracion(cfg, state.rio) - presion(cfg, act) // cómo cambiaría el río
  const rioColor = state.rio >= 55 ? '#2E9E8F' : state.rio >= 30 ? '#D6871A' : '#C43D2C'

  function limiteFromX(clientX) {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return limite
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round((frac * 100) / 5) * 5
  }
  function onPointerDown(e) {
    if (over) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragging.current = true
    setLimite(limiteFromX(e.clientX))
  }
  function onPointerMove(e) {
    if (!dragging.current) return
    setLimite(limiteFromX(e.clientX))
  }
  function onPointerUp(e) {
    if (!dragging.current) return
    dragging.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }
  function nudge(d) {
    if (over) return
    sfx('click')
    setLimite((l) => Math.max(0, Math.min(100, l + d)))
  }

  function cerrar() {
    if (over) return
    sfx('click')
    const next = applyRound(state, cfg, limite)
    setState(next)
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
    if (next.rio < 30) trigger('shake')
    else sfx('coin')
  }

  const endText =
    tier === 'perfect'
      ? 'Mantuviste el río vivo Y una economía sana. Ese es el rol de la regla: internalizar el costo que cada pescador le pasa a los demás. Sin límite, lo que convenía a cada uno habría vaciado el río de todos.'
      : tier === 'partial'
        ? 'El río aguantó, pero no le sacaste todo el provecho posible — o regulaste de más (poca actividad) o de menos (el río quedó al límite). El punto es el equilibrio: cuidar el recurso sin ahogar la economía.'
        : state.rio < cfg.objetivo.rioColapso
          ? 'El río colapsó. Sin un límite que frene la sobrepesca, a cada uno le convino sacar más… hasta que no quedó nada para nadie. Esa es la tragedia de los comunes.'
          : 'No lograste sostener la actividad. Regular es un equilibrio: demasiado límite mata la economía; muy poco, mata el recurso. Hay un punto medio que sostiene ambos.'

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#E3F1EC)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="La Cuenta de Todos"
        crisis="El río del pueblo · externalidades"
        accent={acc}
        pill={over ? 'Fin' : `Temporada ${Math.min(state.ronda, cfg.rondas)} / ${cfg.rondas}`}
      />

      {!over && (
        <div ref={goalRef}>
          <GameProgress
            mes={state.ronda}
            meses={cfg.rondas}
            score={gl.score}
            accent={acc}
            goalLabel={tut.tut?.goalChip ?? 'Mantén el río vivo sin matar la economía'}
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip conceptId="externalidades" label="¿Qué es una externalidad?" onSeen={onConceptSeen} />
      </div>

      {/* Río: el stock protagonista */}
      <div ref={metersRef} className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
            🐟 Salud del río
          </span>
          <span className="font-round text-[1.1rem] font-bold tabular-nums" style={{ color: rioColor }}>
            {Math.round(state.rio)}%
          </span>
        </div>
        <div className="mt-1 h-4 w-full overflow-hidden rounded-full" style={{ background: '#F3D9D3' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${state.rio}%`, background: `linear-gradient(90deg,#7DC7BC,${rioColor})` }}
          />
        </div>
      </div>

      {/* Actividad de la temporada */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="shadow-card rounded-[16px] bg-surface p-2.5 text-center">
          <p className="font-round text-[1.3rem] font-bold tabular-nums text-ink-warm">{act.toFixed(1)}</p>
          <p className="mt-0.5 font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-mute">
            🎣 Actividad ahora
          </p>
        </div>
        <div className="shadow-card rounded-[16px] bg-surface p-2.5 text-center">
          <p className="font-round text-[1.3rem] font-bold tabular-nums text-ink-warm">
            {state.actividadAcum.toFixed(0)}
          </p>
          <p className="mt-0.5 font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-mute">
            📦 Total acumulado
          </p>
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
              Límite a la pesca
            </p>
            <p className="font-round text-[1.5rem] font-bold tabular-nums text-ink-warm">{limite}%</p>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => nudge(-5)}
              aria-label="Menos límite"
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
              style={{ background: '#DDEEE9', touchAction: 'none' }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${limite}%`, background: `linear-gradient(90deg,${acc.soft},${acc.face})` }}
              />
              <span
                className="absolute top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-card"
                style={{ left: `${limite}%` }}
              >
                <span className="text-[0.8rem]" style={{ color: acc.edge }}>🎣</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => nudge(5)}
              aria-label="Más límite"
              className="candy candy-soft flex h-10 w-10 shrink-0 items-center justify-center text-[1.2rem]"
            >
              +
            </button>
          </div>

          <p className="mt-2 text-center font-nunito text-[0.74rem] font-bold" style={{ color: delta >= 0 ? '#1F9A6E' : '#C43D2C' }}>
            {delta >= 0.3
              ? '🟢 Con este límite el río se recupera'
              : delta <= -0.3
                ? '🔴 Con este límite el río se agota'
                : '🟡 El río queda parejo'}
          </p>

          <button
            type="button"
            onClick={cerrar}
            className="candy mt-3 w-full px-5 py-3.5 text-[1rem]"
            style={{ '--face': GOLD_ACCENT.face, '--edge': GOLD_ACCENT.edge }}
          >
            Cerrar la temporada →
          </button>
        </div>
      )}

      {tut.showMainCoach && (
        <CoachMarks steps={tut.mainSteps} accent={acc} onDone={tut.onMainDone} onSkip={tut.onSkip} />
      )}
    </MechanicShell>
  )
}
