import { useMemo, useRef, useState, useEffect } from 'react'
import { sfx } from '../../lib/sound.js'
import { useScreenFx, useCountUp } from '../../lib/animations.js'
import { accentFor } from '../../theme/accents.js'
import CoachMarks from '../CoachMarks.jsx'
import { useTutorial } from '../../hooks/useTutorial.js'
import { MechanicShell, TopBar, EndPanel, EduChip, ComboBadge, GoldFlash } from './candyKit.jsx'
import Coins from './Coins.jsx'
import { useGameLayer } from '../../hooks/useGameLayer.js'
import {
  initPressYourLuck,
  alivioDe,
  presionTras,
  tandaDe,
  imprimir,
  cortar,
  isOver,
  outcomeTier,
} from '../../utils/pressYourLuck.js'

// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (archetipo #4) — "La Imprenta" push-your-luck para Ep1.
// Rediseño de FEEL: el RIESGO es el protagonista (manómetro que se recalienta),
// la decisión es graduada (cuánto imprimir) y hay eventos que mueven la presión
// a mitad de run. Pago fuerte en ambos finales. Se enruta por mechanic sin
// reemplazar hyperinflation. La lección se mantiene: imprimir alivia hoy, revienta
// mañana.
// ─────────────────────────────────────────────────────────────────────────

const METERS = [
  { key: 'pozo', label: 'Alivio consolidable', goodWhen: 'high' },
  { key: 'riesgo', label: 'Presión de reventón', goodWhen: 'low', danger: 70 },
]

// Color de la presión: verde → ámbar → rojo.
function presionColor(v) {
  if (v >= 70) return '#C43D2C'
  if (v >= 45) return '#E8853A'
  if (v >= 25) return '#E0A320'
  return '#2FB37E'
}

// Punto en el arco semicircular (0..100 → izquierda..derecha).
function polar(cx, cy, r, pct) {
  const theta = Math.PI - (pct / 100) * Math.PI // π (izq) → 0 (der)
  return { x: cx + r * Math.cos(theta), y: cy - r * Math.sin(theta) }
}

// Manómetro: LA ESTRELLA de la pantalla. Aguja que sube hacia el rojo; tiembla y
// se enrojece con la presión.
function PressureGauge({ value, danger }) {
  const shown = Math.round(useCountUp(value, 550))
  const cx = 130
  const cy = 122
  const r = 96
  const color = presionColor(value)
  const hot = value >= danger
  const near = value >= 55
  const needle = polar(cx, cy, r - 6, value)
  const trackA = polar(cx, cy, r, 0)
  const trackB = polar(cx, cy, r, 100)
  const valueEnd = polar(cx, cy, r, value)

  return (
    <div
      className={`relative mx-auto ${hot ? 'animate-press-tremble' : ''}`}
      style={{ width: 260, height: 162 }}
    >
      {/* Halo de calor detrás del manómetro. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${color}${near ? '55' : '22'} 0%, transparent 68%)`,
          filter: 'blur(6px)',
          transition: 'background 0.5s',
          animation: near ? 'slow-pulse 1.1s ease-in-out infinite' : 'none',
        }}
      />
      <svg viewBox="0 0 260 150" className="relative w-full" role="img" aria-label={`Presión ${shown}%`}>
        <defs>
          <linearGradient id="pg-scale" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2FB37E" />
            <stop offset="45%" stopColor="#E0A320" />
            <stop offset="72%" stopColor="#E8853A" />
            <stop offset="100%" stopColor="#C43D2C" />
          </linearGradient>
        </defs>
        {/* Riel base. */}
        <path
          d={`M ${trackA.x} ${trackA.y} A ${r} ${r} 0 0 1 ${trackB.x} ${trackB.y}`}
          fill="none"
          stroke="#EFDCB6"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Escala coloreada verde→rojo. */}
        <path
          d={`M ${trackA.x} ${trackA.y} A ${r} ${r} 0 0 1 ${trackB.x} ${trackB.y}`}
          fill="none"
          stroke="url(#pg-scale)"
          strokeWidth="15"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Marca de "zona roja". */}
        {(() => {
          const z = polar(cx, cy, r, danger)
          const zi = polar(cx, cy, r - 12, danger)
          return <line x1={z.x} y1={z.y} x2={zi.x} y2={zi.y} stroke="#8A2418" strokeWidth="2" />
        })()}
        {/* Arco recorrido hasta la aguja (resalta el nivel actual). */}
        <path
          d={`M ${trackA.x} ${trackA.y} A ${r} ${r} 0 0 1 ${valueEnd.x} ${valueEnd.y}`}
          fill="none"
          stroke={color}
          strokeWidth="15"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.4s' }}
        />
        {/* Aguja. */}
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          style={{ transition: 'all 0.5s cubic-bezier(0.34,1.3,0.5,1)', filter: hot ? `drop-shadow(0 0 6px ${color})` : 'none' }}
        />
        <circle cx={cx} cy={cy} r="8" fill={color} />
        <circle cx={cx} cy={cy} r="3.5" fill="#fff" opacity="0.85" />
      </svg>
      {/* Lectura central. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center">
        <div
          className="font-round text-[1.75rem] font-black leading-none tabular-nums"
          style={{ color, transition: 'color 0.4s' }}
        >
          {shown}%
        </div>
        <div className="mt-1 font-nunito text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-ink-mute">
          Presión de reventón {hot ? '· ¡al rojo!' : ''}
        </div>
      </div>
    </div>
  )
}

// Colapso: billetes que caen y se apagan a gris. Solo al reventar.
function BillCollapse({ on }) {
  const [bills, setBills] = useState([])
  useEffect(() => {
    if (!on) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const batch = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 20 + Math.random() * 20,
      rot: `${Math.random() * 480 - 240}deg`,
      dur: 1.6 + Math.random() * 1.2,
      delay: Math.random() * 0.7,
      emoji: Math.random() < 0.5 ? '💵' : '💸',
    }))
    setBills(batch)
    const t = setTimeout(() => setBills([]), 3200)
    return () => clearTimeout(t)
  }, [on])
  if (bills.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {bills.map((b) => (
        <span
          key={b.id}
          className="absolute block"
          style={{
            left: b.left,
            top: 0,
            fontSize: b.size,
            '--rot': b.rot,
            animation: `bill-fall ${b.dur}s ease-in ${b.delay}s forwards`,
          }}
        >
          {b.emoji}
        </span>
      ))}
    </div>
  )
}

export default function PrintPress({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(() => episode.pressYourLuck, [episode])
  const acc = accentFor(episode.id)
  const [state, setState] = useState(() => initPressYourLuck(cfg, dailySeed))
  const { fx, trigger } = useScreenFx()
  const [collapse, setCollapse] = useState(0) // dispara BillCollapse + flash rojo
  const over = isOver(state, cfg)
  const tier = over ? outcomeTier(state, cfg) : null
  const gl = useGameLayer({ eventos: [], totalTurns: cfg.rondas, meters: METERS, trigger, seed: dailySeed })

  // Onboarding (coach-marks) — describe el verbo nuevo (imprimir cuánto vs cortar).
  const goalRef = useRef(null)
  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const tut = useTutorial(episode.id, {
    refByTarget: { goal: goalRef, meters: metersRef, actions: actionsRef },
    over,
    pendingEvent: null,
    firstTurnActive: state.ronda === 1,
  })

  function imprimirAccion(tandaId) {
    if (over) return
    const presion = presionTras(state, tandaDe(cfg, tandaId))
    sfx('press', { heat: presion / 100 })
    const next = imprimir(state, cfg, tandaId)
    setState(next)
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
    if (next.reventado) {
      sfx('blowout')
      trigger('shake')
      setCollapse((k) => k + 1)
    }
  }

  function cortarAccion() {
    if (over) return
    const next = cortar(state)
    const win = outcomeTier(next, cfg) === 'perfect'
    sfx('advance') // feedback del corte; la fanfarria del "perfect" la pone celebrate()
    setState(next)
    gl.onTurn(state, next, { over: true, win })
  }

  const ev = state.eventoActivo
  const pozoShown = Math.round(useCountUp(state.pozo, 500))
  const printsHechos = state.ronda - 1
  // El pan como FLAVOR: sube absurdamente mientras imprimes (no es la estrella).
  const panPrecio = Math.round(4800 * Math.pow(2.3, printsHechos))
  const panFmt =
    panPrecio >= 1e6
      ? `${(panPrecio / 1e6).toFixed(1)} millones`
      : panPrecio.toLocaleString('es-CL')

  const endText =
    state.reventado
      ? 'La imprenta no se detuvo. Los precios se dispararon hasta que el peso se volvió papel: colapso hiperinflacionario.'
      : tier === 'perfect'
        ? 'Cortaste a tiempo y estabilizaste: consolidaste un alivio fuerte sin que la imprenta se descontrolara.'
        : tier === 'partial'
          ? 'Estabilizaste, pero tibio: salvaste algo de alivio, aunque quedaste lejos de lo posible.'
          : 'Frenaste con muy poco en la caja: el alivio consolidado no alcanzó para nada.'

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#FCE3C4)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />
      <BillCollapse on={collapse} />
      {collapse > 0 && (
        <div
          key={collapse}
          aria-hidden
          className="animate-flash-red pointer-events-none fixed inset-0 z-40"
          style={{ background: 'radial-gradient(circle at 50% 45%, #E8604F, #8A2418 75%)' }}
        />
      )}

      {/* Vignette de tensión: se enrojece a medida que sube la presión */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          boxShadow: `inset 0 0 130px 24px rgba(200,40,20,${(state.riesgo / 100) * 0.6})`,
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

        {/* Banner de evento (incertidumbre viva): la presión se movió en vivo. */}
        {!over && ev && (
          <div
            className="animate-drop-in mt-3 flex items-center gap-2.5 rounded-[14px] px-3 py-2"
            style={{
              background: ev.tipo === 'rescate' ? '#DCF1E7' : '#FBDCD3',
              boxShadow: `inset 0 0 0 1.5px ${ev.tipo === 'rescate' ? '#2FB37E55' : '#C43D2C55'}`,
            }}
          >
            <span className="text-[1.4rem]" aria-hidden>{ev.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-round text-[0.82rem] font-bold text-ink-warm">{ev.titulo}</p>
              <p className="font-nunito text-[0.72rem] leading-snug text-ink-soft">{ev.texto}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-1 font-nunito text-[0.66rem] font-extrabold text-white"
              style={{ background: ev.tipo === 'rescate' ? '#1F9A6E' : '#C43D2C' }}
            >
              Presión {ev.calor > 0 ? `+${ev.calor}` : ev.calor}
            </span>
          </div>
        )}

        {/* EL MANÓMETRO — protagonista. */}
        <div ref={metersRef} className="mt-3">
          <PressureGauge value={state.riesgo} danger={70} />
        </div>

        {/* Meta (secundaria, una línea). */}
        <p
          ref={goalRef}
          className="mt-1 text-center font-nunito text-[0.72rem] font-bold text-ink-mute"
        >
          {tut.tut?.goalChip ?? 'Guarda el máximo alivio… y corta antes de que reviente'}
        </p>

        {/* Alivio guardado + pan (flavor), compactos en una fila. */}
        <div className="mt-3 flex items-center justify-between rounded-[14px] bg-panel/70 px-3.5 py-2">
          <div className="flex items-baseline gap-1.5">
            <span aria-hidden>💰</span>
            <span className="font-round text-[1.15rem] font-black tabular-nums text-ink-warm">
              {pozoShown}
            </span>
            <span className="font-nunito text-[0.64rem] font-extrabold uppercase tracking-wide text-ink-mute">
              alivio guardado
            </span>
          </div>
          <span className="font-nunito text-[0.66rem] font-bold text-ink-mute/80">
            🍞 pan: {panFmt}
          </span>
        </div>

        <ComboBadge combo={gl.combo} />

        {over ? (
          <EndPanel
            text={endText}
            onComplete={() => onComplete(tier, { score: gl.score, momentumMax: gl.momentumMax })}
          />
        ) : (
          <div ref={actionsRef} className="mt-4">
            <p className="mb-2 font-nunito text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-ink-mute">
              ¿Cuánto imprimes esta ronda?
            </p>
            {/* Tandas graduadas: más alivio = más salto de presión. */}
            <div className="grid grid-cols-3 gap-2">
              {cfg.tandas.map((t, i) => {
                const tras = presionTras(state, t)
                const face = ['#F0B429', '#F06A54', '#E8604F'][i]
                const edge = ['#D6871A', '#D24C39', '#C43D2C'][i]
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => imprimirAccion(t.id)}
                    className="candy flex flex-col items-center px-1.5 py-2.5 text-center"
                    style={{ '--face': face, '--edge': edge }}
                  >
                    <span className="text-[1.2rem]" aria-hidden>🖨️</span>
                    <span className="mt-0.5 font-round text-[0.74rem] font-bold leading-tight">{t.label}</span>
                    <span className="mt-1 rounded-full bg-white/25 px-1.5 py-0.5 font-nunito text-[0.6rem] font-extrabold">
                      +{alivioDe(t, state, cfg)}
                    </span>
                    <span className="mt-0.5 font-nunito text-[0.58rem] font-extrabold text-white/90">
                      reventar {tras}%
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Cortar y estabilizar: la salida segura (verde). */}
            <button
              type="button"
              onClick={cortarAccion}
              className="candy mt-2.5 w-full p-3 text-left"
              style={{ '--face': '#35B98A', '--edge': '#1F9A6E' }}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-round text-[1rem] font-bold">
                  ⚓ Cortar y estabilizar
                </span>
                <span className="rounded-full bg-white/25 px-2 py-0.5 font-nunito text-[0.64rem] font-extrabold">
                  Consolidas {state.pozo}
                </span>
              </span>
              <span className="mt-0.5 block font-nunito text-[0.72rem] leading-snug text-white/85">
                Apagas la imprenta y te quedas con lo guardado. Termina la partida.
              </span>
            </button>
          </div>
        )}

        {/* Concepto (secundario, al pie). */}
        <div className="mt-4 flex items-center justify-between">
          <EduChip conceptId="senoreaje" label="¿Por qué imprimir tienta tanto?" onSeen={onConceptSeen} />
          <span className="font-mono text-[0.6rem] uppercase tracking-wide text-ink-mute/70 tabular-nums">
            🪙 {gl.score.toLocaleString('es-CL')}
          </span>
        </div>
      </div>

      {tut.showMainCoach && (
        <CoachMarks steps={tut.mainSteps} accent={acc} onDone={tut.onMainDone} onSkip={tut.onSkip} />
      )}
    </MechanicShell>
  )
}
