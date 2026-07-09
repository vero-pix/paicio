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
} from './candyKit.jsx'
import Coins from './Coins.jsx'
import GameProgress from './GameProgress.jsx'
import { useGameLayer } from '../../hooks/useGameLayer.js'
import { initPressYourLuck, alivioDe, imprimir, cortar, isOver, outcomeTier } from '../../utils/pressYourLuck.js'

// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (archetipo #4) — "La Imprenta" push-your-luck para Ep1.
// Se enruta por `episode.mechanicVariant` sin reemplazar hyperinflation.
// ─────────────────────────────────────────────────────────────────────────

const METERS = [
  { key: 'pozo', label: 'Alivio consolidable', goodWhen: 'high' },
  { key: 'riesgo', label: 'Riesgo de reventón', goodWhen: 'low', danger: 70 },
]

export default function PrintPress({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(() => episode.pressYourLuck, [episode])
  const acc = accentFor(episode.id)
  const [state, setState] = useState(() => initPressYourLuck(cfg, dailySeed))
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)
  const tier = over ? outcomeTier(state, cfg) : null
  const gl = useGameLayer({ eventos: [], totalTurns: cfg.rondas, meters: METERS, trigger, seed: dailySeed })

  // Onboarding (coach-marks) — describe el verbo nuevo (imprimir vs cortar).
  const goalRef = useRef(null)
  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const tut = useTutorial(episode.id, {
    refByTarget: { goal: goalRef, meters: metersRef, actions: actionsRef },
    over,
    pendingEvent: null,
    firstTurnActive: state.ronda === 1,
  })

  function imprimirAccion() {
    if (over) return
    sfx('click')
    const next = imprimir(state, cfg)
    setState(next)
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
    if (next.reventado) { sfx('alert'); trigger('shake') }
  }

  function cortarAccion() {
    if (over) return
    sfx('click')
    const next = cortar(state)
    setState(next)
    gl.onTurn(state, next, { over: true, win: outcomeTier(next, cfg) === 'perfect' })
  }

  const alivio = alivioDe(state, cfg)

  function barra(val, color) {
    return (
      <div className="h-3 w-full overflow-hidden rounded-full bg-ink-mute/15">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(val, 100)}%`, background: color }}
        />
      </div>
    )
  }

  const endText =
    tier === 'perfect'
      ? 'Cortaste a tiempo y estabilizaste: consolidaste el alivio sin que la imprenta se descontrolara.'
      : state.reventado
        ? 'La imprenta no se detuvo. Los precios se dispararon hasta que el peso se volvió papel: colapso hiperinflacionario.'
        : tier === 'partial'
          ? 'Estabilizaste, pero tibio: salvaste algo de alivio, aunque quedaste lejos de lo posible.'
          : 'Cortaste demasiado pronto y con muy poco: el alivio no alcanzó para nada.'

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#FCE3C4)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      {/* Vignette de tensión: se enrojece a medida que sube el riesgo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          boxShadow: `inset 0 0 120px 20px rgba(200,40,20,${(state.riesgo / 100) * 0.55})`,
          transition: 'box-shadow 0.5s',
        }}
      />

      <div className="relative z-10">
        <TopBar
          title="La Imprenta"
          crisis="Bolivia · 1985"
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
              goalLabel={tut.tut?.goalChip ?? 'Consolida el máximo alivio… sin que reviente'}
            />
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <EduChip
            conceptId="senoreaje"
            label="¿Por qué imprimir tienta tanto?"
            onSeen={onConceptSeen}
          />
        </div>

        {/* Medidores */}
        <div ref={metersRef} className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between font-nunito text-[0.72rem] font-bold text-ink-mute">
              <span>💰 Alivio consolidable</span>
              <span className="font-round text-[0.85rem] tabular-nums text-ink-warm">{state.pozo}</span>
            </div>
            <div className="mt-1">{barra(state.pozo, 'linear-gradient(90deg,#F5B331,#D6871A)')}</div>
          </div>
          <div>
            <div className="flex items-center justify-between font-nunito text-[0.72rem] font-bold text-ink-mute">
              <span>🔥 Riesgo de reventón</span>
              <span
                className="font-round text-[0.85rem] tabular-nums"
                style={{ color: state.riesgo >= 70 ? '#C43D2C' : state.riesgo >= 45 ? '#D6871A' : '#1F9A6E' }}
              >
                {state.riesgo}%
              </span>
            </div>
            <div className="mt-1">{barra(state.riesgo, 'linear-gradient(90deg,#E8604F,#C43D2C)')}</div>
          </div>
        </div>

        <ComboBadge combo={gl.combo} />

        {over ? (
          <EndPanel
            text={endText}
            onComplete={() => onComplete(tier, { score: gl.score, momentumMax: gl.momentumMax })}
          />
        ) : (
          <div ref={actionsRef} className="mt-5 space-y-2.5">
            <button
              type="button"
              onClick={imprimirAccion}
              className="candy w-full p-3.5 text-left"
              style={{ '--face': '#E8604F', '--edge': '#C43D2C' }}
            >
              <span className="flex items-center gap-2 font-round text-[1rem] font-bold">🖨️ Imprimir dinero</span>
              <span className="mt-0.5 block font-nunito text-[0.74rem] leading-snug text-white/85">
                Alivio inmediato, pero enciende la espiral.
              </span>
              <div className="mt-1.5 flex gap-2">
                <span className="rounded-full bg-white/25 px-2 py-0.5 font-nunito text-[0.6rem] font-extrabold">
                  +{alivio} alivio
                </span>
                <span className="rounded-full bg-black/20 px-2 py-0.5 font-nunito text-[0.6rem] font-extrabold">
                  {state.riesgo}% de reventar
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={cortarAccion}
              className="candy w-full p-3.5 text-left"
              style={{ '--face': '#35B98A', '--edge': '#1F9A6E' }}
            >
              <span className="flex items-center gap-2 font-round text-[1rem] font-bold">⚓ Cortar y estabilizar</span>
              <span className="mt-0.5 block font-nunito text-[0.74rem] leading-snug text-white/85">
                Apagas la imprenta y consolidas lo ganado. Termina la partida.
              </span>
              <div className="mt-1.5">
                <span className="rounded-full bg-white/25 px-2 py-0.5 font-nunito text-[0.6rem] font-extrabold">
                  Consolidas {state.pozo}
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {tut.showMainCoach && (
        <CoachMarks steps={tut.mainSteps} accent={acc} onDone={tut.onMainDone} onSkip={tut.onSkip} />
      )}
    </MechanicShell>
  )
}
