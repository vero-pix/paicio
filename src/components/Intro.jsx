import { useState } from 'react'
import Coin from './Coin.jsx'

const STEPS = [
  {
    icon: '🏛️',
    title: 'Eres Ministro/a de Economía',
    desc: 'Cada decisión tuya cambia el destino de Paicio. Crisis reales, consecuencias reales.',
    color: '#F5B331',
    bg: '#FBE7C6',
  },
  {
    icon: '🌎',
    title: 'Crisis que marcaron América Latina',
    desc: 'Hiperinflación, corridas bancarias, deuda externa. Aprende la economía jugándola.',
    color: '#4FA3E3',
    bg: '#DCEBFA',
  },
  {
    icon: '🎮',
    title: 'Decides, ves resultados, mejoras',
    desc: 'Cada partida es distinta. Reintenta, bate tu récord, comparte tu resultado.',
    color: '#35B98A',
    bg: '#D6F0E5',
  },
]

export default function Intro({ onEnter }) {
  const [step, setStep] = useState(0)
  const s = STEPS[step]

  return (
    <div
      className="on-cream animate-fade-in fixed inset-0 z-[70] overflow-y-auto"
      style={{ background: 'linear-gradient(180deg,#FFF3D8,#FCE7C0)' }}
    >
      <div
        className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 1.25rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
        }}
      >
        {/* Marca */}
        <div className="flex flex-col items-center text-center">
          <Coin size={72} bob />
          <h1 className="mt-2 font-round text-[2rem] font-bold leading-none tracking-tight text-ink-warm">
            PAICIO
          </h1>
          <p className="mt-0.5 font-nunito text-[0.8rem] font-bold text-ink-mute">
            economía que se juega, no se estudia
          </p>
        </div>

        {/* Tester badge sutil */}
        <div className="mt-3 flex justify-center">
          <span className="rounded-full px-3 py-1 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
            style={{ background: '#FBDAD3', color: '#D24C39' }}
          >
            🛠️ Versión en desarrollo
          </span>
        </div>

        {/* Empuja el contenido abajo */}
        <div className="flex-1" />

        {/* Visual central del paso */}
        <div className="flex flex-col items-center text-center" key={step}>
          <div
            className="flex h-28 w-28 items-center justify-center rounded-[28px] text-[3.2rem] transition-all duration-500"
            style={{ background: s.bg }}
          >
            <span className="animate-pop">{s.icon}</span>
          </div>
          <h2 className="mt-5 text-balance font-round text-[1.5rem] font-bold leading-tight text-ink-warm">
            {s.title}
          </h2>
          <p className="mx-auto mt-2 max-w-[18rem] font-nunito text-[0.88rem] leading-snug text-ink-soft">
            {s.desc}
          </p>
        </div>

        {/* Pager */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Paso ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 28 : 8,
                height: 8,
                background: i === step ? 'var(--color-gold)' : '#E4CE9E',
              }}
            />
          ))}
        </div>

        {/* Empuja el CTA al fondo */}
        <div className="min-h-4 flex-1" />

        {/* CTA */}
        {step === STEPS.length - 1 ? (
          <button
            type="button"
            onClick={onEnter}
            className="candy mt-4 w-full px-5 py-4 text-[1.05rem]"
            style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
          >
            Entrar a Paicio →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="candy mt-4 w-full px-5 py-4 text-[1.05rem]"
            style={{ '--face': s.color, '--edge': s.color }}
          >
            Siguiente →
          </button>
        )}

        {/* Skip */}
        <button
          type="button"
          onClick={onEnter}
          className="mt-3 w-full text-center font-nunito text-[0.78rem] font-extrabold text-ink-mute underline underline-offset-2"
        >
          Saltar
        </button>
      </div>
    </div>
  )
}
