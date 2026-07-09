import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import { sfx } from '../../lib/sound.js'
import { useScreenFx } from '../../lib/animations.js'
import { accentFor } from '../../theme/accents.js'
import { MechanicShell, TopBar, EndPanel } from './candyKit.jsx'
import EventCard from './EventCard.jsx'
import CoachMarks from '../CoachMarks.jsx'
import { useTutorial } from '../../hooks/useTutorial.js'
import {
  initVolatilityDance,
  getSpeed,
  evalClick,
  scoreFor,
  playRound,
  isOver,
  outcomeTier,
} from '../../utils/volatilityDance.js'

const ESTRATEGIAS = [
  {
    id: 'venderAhora',
    label: 'Vender ahora',
    icon: '💰',
    desc: 'Barra lenta y zona amplia. Fácil de timed, ganancia segura pero sin brillo.',
  },
  {
    id: 'esperar',
    label: 'Esperar el peak',
    icon: '🎯',
    desc: 'Barra rápida y zona chica. Difícil, pero si le atinas, la ganancia es 1.6x.',
  },
  {
    id: 'invertir',
    label: 'Invertir en Codelco',
    icon: '🔧',
    desc: 'Esta ronda ganas la mitad, pero Codelco mejora y las futuras rondas rinden más.',
  },
]

function CobreCounter({ cobre, codelco }) {
  return (
    <div className="mt-2 flex items-center justify-center gap-4">
      <div className="text-center">
        <span className="font-round text-[1.6rem] font-bold tabular-nums text-ink-warm">
          {cobre}
        </span>
        <span className="ml-1 font-nunito text-[0.65rem] font-bold text-ink-mute">
          US$ cobre
        </span>
      </div>
      <div
        className="h-8 w-px"
        style={{ background: 'linear-gradient(180deg, transparent, #E4CE9E, transparent)' }}
      />
      <div className="text-center">
        <span className="font-round text-[1rem] font-bold tabular-nums text-ink-warm">
          ×{codelco.toFixed(2)}
        </span>
        <span className="ml-1 font-nunito text-[0.65rem] font-bold text-ink-mute">
          Codelco
        </span>
      </div>
    </div>
  )
}

function BarraPrecio({ speed, onTimed, onMissed, live }) {
  const barRef = useRef(null)
  const posRef = useRef(50)
  const rafRef = useRef(null)
  const startRef = useRef(performance.now())
  const aliveRef = useRef(true)

  useEffect(() => {
    aliveRef.current = true
    startRef.current = performance.now()

    function tick() {
      if (!aliveRef.current) return
      const elapsed = performance.now() - startRef.current
      // oscilación sinusoidal suave: 0 → 100 → 0
      const p = Math.sin((elapsed / speed) * Math.PI) // -1 a 1
      const pos = (p + 1) * 50 // 0 a 100
      posRef.current = pos
      if (barRef.current) barRef.current.style.transform = `translateX(${pos - 50}%)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      aliveRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed])

  const handleClick = useCallback(() => {
    if (!live) return
    const pos = posRef.current
    onTimed(pos)
  }, [live, onTimed])

  return (
    <div
      ref={barRef}
      className="relative mx-auto h-16 w-64 cursor-pointer select-none pt-2"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label="Haz clic para vender cuando el precio esté en la zona dorada"
    >
      {/* riel de fondo */}
      <div className="absolute left-0 top-1/2 h-3 w-full -translate-y-1/2 rounded-full bg-ink-mute/20" />

      {/* zona dorada */}
      <div className="absolute left-[30%] top-1/2 h-5 w-[40%] -translate-y-1/2 rounded-full opacity-30"
        style={{ background: 'linear-gradient(90deg, transparent, #F5B331, transparent)' }}
      />
      <div className="absolute left-[46%] top-1/2 h-6 w-[8%] -translate-y-1/2 rounded-full opacity-50"
        style={{ background: '#F5B331' }}
      />

      {/* indicador (triángulo) */}
      <div
        className="absolute top-0 h-5 w-1 -translate-x-1/2 rounded-full"
        style={{ background: 'var(--color-gold)', boxShadow: '0 0 8px rgba(245,179,49,0.6)' }}
      />
    </div>
  )
}

function Timeline({ speed, zone }) {
  const labels = ['Bajo', 'Peak', 'Bajo']
  return (
    <div className="mt-1 flex items-center justify-center gap-12 font-nunito text-[0.55rem] font-extrabold text-ink-mute/60 uppercase tracking-wider">
      {labels.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  )
}

function Resultado({ tier }) {
  const labels = { perfect: '✨ ¡Perfecto!', good: '👍 Bien ahí', ok: '👌 Pasable', miss: '💨 Te fuiste' }
  return (
    <div className="animate-pop-big mt-3 text-center font-round text-[1rem] font-bold text-ink-warm">
      {labels[tier] ?? ''}
    </div>
  )
}

export default function VolatilityDance({ episode, onComplete }) {
  const cfg = useMemo(() => episode.volatilityDance, [episode])
  const acc = accentFor(episode.id)
  const [state, setState] = useState(() => initVolatilityDance(cfg))
  const [fase, setFase] = useState('menu') // menu | bailando | resultado
  const [estrategia, setEstrategia] = useState(null)
  const [tier, setTier] = useState(null)
  const [timed, setTimed] = useState(null)
  const [evento, setEvento] = useState(null)
  const over = isOver(state, cfg)
  const tierFinal = over ? outcomeTier(state) : null
  const vel = getSpeed(state.ronda)

  const tut = useTutorial({ episodeId: episode.id })

  function elegirEstrategia(id) {
    sfx('click')
    setEstrategia(id)
    setFase('bailando')
    setTimed(null)
    setTier(null)
  }

  function handleTimed(pos) {
    sfx('coin')
    const t = evalClick(pos, estrategia)
    setTier(t)
    setTimed(pos)
    setFase('resultado')
  }

  function avanzar() {
    if (!tier || !estrategia) return
    const next = playRound(state, estrategia, tier)
    setState(next)
    setEstrategia(null)
    setTier(null)
    setTimed(null)

    const ev = episode.eventos?.find((e) => e.ronda === next.ronda)
    if (ev) {
      setEvento(ev)
      setTimeout(() => setEvento(null), 3000)
    }

    if (isOver(next, cfg)) return
    setFase('menu')
  }

  if (tierFinal) {
    return (
      <MechanicShell tint="linear-gradient(180deg,#FCE3C4,#F5D5B0)">
        <TopBar title="La Cueca del Cobre" crisis="Chile · El baile del cobre" accent={acc} pill="Fin" />
        <div className="mt-4 text-center">
          <span className="text-[3rem]">🪙</span>
          <CobreCounter cobre={state.cobre} codelco={state.codelco} />
        </div>
        <EndPanel
          text={
            tierFinal === 'perfect'
              ? '¡Maestro cuequero! Le agarraste el ritmo al cobre. Vendiste en los peaks, no entraste en pánico en las bajas, e invertiste cuando había que hacerlo.'
              : tierFinal === 'partial'
                ? 'Tuviste momentos buenos pero te faltó ritmo para el aguante. El cobre te bailó un poco.'
                : 'El cobre te ganó. Vendiste cuando no había que vender y te quedaste cuando no había que quedarte. La próxima será.'
          }
          onComplete={() => onComplete(tierFinal, { score: state.cobre })}
        />
      </MechanicShell>
    )
  }

  return (
    <MechanicShell tint="linear-gradient(180deg,#FCE3C4,#F5D5B0)">
      <TopBar
        title="La Cueca del Cobre"
        crisis="Chile · Cobre"
        accent={acc}
        pill={`Ronda ${state.ronda}/${cfg.rondas}`}
        onConceptSeen={() => {}}
      />

      <CobreCounter cobre={state.cobre} codelco={state.codelco} />

      {evento && (
        <EventCard event={evento} accent={acc} onDismiss={() => setEvento(null)} />
      )}

      {/* FASE: Menú de estrategia */}
      {fase === 'menu' && (
        <div className="mt-4 space-y-2.5">
          <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
            ¿Cómo vendes esta ronda?
          </p>
          {ESTRATEGIAS.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => elegirEstrategia(e.id)}
              className="candy w-full p-3.5 text-left"
              style={{
                '--face': e.id === 'esperar' ? '#F5A524' : e.id === 'invertir' ? '#A579E0' : '#4FA3E3',
                '--edge': e.id === 'esperar' ? '#D6871A' : e.id === 'invertir' ? '#8657C4' : '#2F82C4',
              }}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-[1.4rem]">{e.icon}</span>
                <span className="font-round text-[0.95rem] font-bold">{e.label}</span>
              </span>
              <span className="mt-1 block font-nunito text-[0.76rem] leading-snug text-white/85">
                {e.desc}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* FASE: Bailando */}
      {fase === 'bailando' && (
        <div className="mt-5">
          <p className="mb-2 text-center font-nunito text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-mute/80">
            ¡Haz clic cuando el precio esté en la zona dorada!
          </p>
          <BarraPrecio speed={vel} live onTimed={handleTimed} />
          <Timeline speed={vel} />
        </div>
      )}

      {/* FASE: Resultado */}
      {fase === 'resultado' && (
        <div className="mt-5">
          <div className="opacity-30 pointer-events-none">
            <BarraPrecio speed={vel} live={false} />
          </div>
          <Resultado tier={tier} />
          <div className="mt-3 flex items-center justify-center gap-4 text-center">
            <div>
              <span className="font-round text-[1.2rem] font-bold text-ink-warm">
                +{scoreFor(tier, estrategia, state.codelco)}
              </span>
              <span className="ml-1 font-nunito text-[0.6rem] font-bold text-ink-mute">US$</span>
            </div>
            <span className="font-nunito text-[0.55rem] text-ink-mute/60">
              ×{estrategia === 'esperar' ? '1.6 ' : '1.0 '}
              · Codelco ×{state.codelco.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            onClick={avanzar}
            className="candy mt-4 w-full px-5 py-3.5 text-[1rem]"
            style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
          >
            Siguiente ronda →
          </button>
        </div>
      )}
    </MechanicShell>
  )
}
