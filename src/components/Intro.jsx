import { useState } from 'react'
import Coin from './Coin.jsx'

// ─────────────────────────────────────────────────────────────────────────
// Intro — bienvenida / onboarding (rediseño LatAm).
//
// Presenta la promesa del juego en tres pasos (pager), con la moneda-$ de marca
// flotando arriba y los tres momentos del loop (Decides · Medidores · Desenlace)
// como chips. Se muestra una vez por navegador y se puede reabrir desde el mapa.
// ─────────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'Eres el nuevo Ministro de Economía',
    text: 'Cada nivel es una crisis real de América Latina. La juegas… y así la entiendes.',
  },
  {
    title: 'Cinco crisis que sí pasaron',
    text: 'Hiperinflación, corralito, burbujas, inflación que no para. Un país ficticio; crisis reales.',
  },
  {
    title: 'Tú decides, y vives las consecuencias',
    text: 'Tomas las decisiones que tomaron ministros de verdad — y entiendes por qué salió como salió.',
  },
]

// Chips del loop del juego.
const LOOP = [
  {
    label: 'Decides',
    face: '#F5A524',
    soft: '#FBE7C6',
    icon: (
      <path d="M6 6h12v12H6z" />
    ),
  },
  {
    label: 'Medidores',
    face: '#4FA3E3',
    soft: '#DCEBFA',
    icon: (
      <>
        <path d="M6 15v3" />
        <path d="M12 10v8" />
        <path d="M18 6v12" />
      </>
    ),
  },
  {
    label: 'Desenlace',
    face: '#F06A54',
    soft: '#FBDAD3',
    icon: (
      <path d="M12 5l2.4 4.9 5.4.8-3.9 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.9-3.8 5.4-.8z" />
    ),
  },
]

export default function Intro({ onEnter }) {
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1

  return (
    <div
      className="on-cream relative mx-auto min-h-screen max-w-md overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#FFF3D8,#FCE7C0)' }}
    >
      <div className="flex min-h-screen flex-col px-6 pb-8 pt-6">
        {/* Status bar simulada */}
        <div className="flex items-center justify-between">
          <span className="font-round text-[0.8rem] font-semibold text-ink-soft">9:41</span>
          <span className="flex gap-1 text-ink-mute" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          </span>
        </div>

        {/* Marca */}
        <div className="mt-6 flex flex-col items-center text-center">
          <Coin size={104} bob />
          <h1 className="mt-4 font-round text-[3rem] font-bold leading-none tracking-tight text-ink-warm">
            PAICIO
          </h1>
          <p className="mt-1 font-nunito text-[0.86rem] font-bold text-ink-mute">
            economía que se juega, no se estudia
          </p>
        </div>

        {/* Paso actual */}
        <div className="mt-8 text-center">
          <h2 className="mx-auto max-w-[17rem] text-balance font-round text-[1.35rem] font-bold leading-tight text-ink-warm">
            {STEPS[step].title}
          </h2>
          <p className="mx-auto mt-2 max-w-[19rem] font-nunito text-[0.92rem] leading-snug text-ink-soft">
            {STEPS[step].text}
          </p>
        </div>

        {/* Chips del loop */}
        <div className="mt-7 grid grid-cols-3 gap-3">
          {LOOP.map((c) => (
            <div
              key={c.label}
              className="shadow-card flex flex-col items-center gap-2 rounded-[16px] bg-surface px-2 py-3"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                style={{ background: c.soft, color: c.face }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  {c.icon}
                </svg>
              </span>
              <span className="font-nunito text-[0.66rem] font-extrabold uppercase tracking-wide text-ink-soft">
                {c.label}
              </span>
            </div>
          ))}
        </div>

        {/* Empuja el pager + CTA al fondo */}
        <div className="flex-1" />

        {/* Pager */}
        <div className="mb-5 flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Paso ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === step ? 22 : 7,
                height: 7,
                background: i === step ? 'var(--color-gold)' : '#E4CE9E',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => (last ? onEnter() : setStep((s) => s + 1))}
          className="candy w-full px-5 py-3.5 text-[1rem]"
          style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
        >
          {last ? 'Empezar a jugar' : 'Siguiente'}
        </button>
        <button
          type="button"
          onClick={onEnter}
          className="mt-3 font-nunito text-[0.8rem] font-extrabold text-ink-mute transition-colors hover:text-ink-soft"
        >
          Ya tengo progreso →
        </button>
      </div>
    </div>
  )
}
