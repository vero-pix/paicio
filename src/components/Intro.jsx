import { useState } from 'react'
import Coin from './Coin.jsx'
import { LINES } from '../data/lines.js'

// ─────────────────────────────────────────────────────────────────────────
// Intro — onboarding ÚNICO de PAICIO (antes había dos portones: este y
// WelcomeOverlay, que se contradecían y hablaban de "cinco crisis"). Ahora es
// uno solo y veraz: explica qué es Paicio a través de sus 4 líneas (Crisis,
// Orígenes, Chile, El Norte), no solo crisis LatAm. Tres pasos (pager); se
// muestra una vez por navegador y se reabre desde el mapa con "¿Qué es?".
// ─────────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'No se estudia. Se juega.',
    text: 'Tomas el mando de un país y decides. Cada nivel es una mecánica distinta — y la mecánica es la lección.',
    body: 'loop',
  },
  {
    title: 'Cuatro líneas, una economía',
    text: 'No son solo crisis: es la economía completa, desde su historia hasta los países que la resolvieron.',
    body: 'lines',
  },
  {
    title: 'Decides y vives las consecuencias',
    text: 'Deslizas, arrastras o tocas en el momento justo. Miras los medidores, ves el desenlace y entiendes por qué salió así.',
    body: 'tester',
  },
]

// Chips del loop del juego.
const LOOP = [
  { label: 'Decides', face: '#F5A524', soft: '#FBE7C6', icon: <path d="M6 6h12v12H6z" /> },
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
    icon: <path d="M12 5l2.4 4.9 5.4.8-3.9 3.8.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.9-3.8 5.4-.8z" />,
  },
]

function LoopChips() {
  return (
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
  )
}

function LinesList() {
  return (
    <div className="mt-6 space-y-2">
      {LINES.map((l) => (
        <div
          key={l.id}
          className="shadow-card flex items-center gap-3 rounded-[14px] bg-surface px-3.5 py-2.5 text-left"
        >
          <span className="shrink-0 text-[1.3rem] leading-none" aria-hidden>
            {l.icon}
          </span>
          <p className="min-w-0 font-nunito text-[0.8rem] leading-snug text-ink-soft">
            <span className="font-extrabold text-ink-warm">{l.name}</span> · {l.subtitle}
          </p>
        </div>
      ))}
    </div>
  )
}

function TesterNote() {
  return (
    <div className="mt-6 rounded-[16px] px-4 py-3 text-left" style={{ background: '#FBDAD3' }}>
      <p className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-[#D24C39]">
        Eres tester
      </p>
      <p className="mt-1 font-nunito text-[0.82rem] leading-snug text-ink-soft">
        ¿Dudas de cómo se juega? Toca el <span className="font-extrabold">?</span> arriba en
        cualquier momento. ¿Algo se rompe o se puede mejorar? El botón{' '}
        <span className="font-extrabold">💬</span> me llega directo.
      </p>
    </div>
  )
}

export default function Intro({ onEnter }) {
  const [step, setStep] = useState(0)
  const last = step === STEPS.length - 1
  const current = STEPS[step]

  return (
    <div
      className="on-cream relative mx-auto min-h-[100dvh] max-w-md overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#FFF3D8,#FCE7C0)' }}
    >
      <div className="flex min-h-[100dvh] flex-col px-6 pb-8 pt-6">
        {/* Marca */}
        <div className="mt-2 flex flex-col items-center text-center">
          <Coin size={92} bob />
          <h1 className="mt-3 font-round text-[2.6rem] font-bold leading-none tracking-tight text-ink-warm">
            PAICIO
          </h1>
          <p className="mt-1 font-nunito text-[0.84rem] font-bold text-ink-mute">
            economía que se juega, no se estudia
          </p>
        </div>

        {/* Paso actual */}
        <div className="mt-7 text-center">
          <h2 className="mx-auto max-w-[18rem] text-balance font-round text-[1.35rem] font-bold leading-tight text-ink-warm">
            {current.title}
          </h2>
          <p className="mx-auto mt-2 max-w-[20rem] font-nunito text-[0.92rem] leading-snug text-ink-soft">
            {current.text}
          </p>
        </div>

        {/* Cuerpo del paso */}
        {current.body === 'loop' && <LoopChips />}
        {current.body === 'lines' && <LinesList />}
        {current.body === 'tester' && <TesterNote />}

        {/* Empuja el pager + CTA al fondo */}
        <div className="min-h-6 flex-1" />

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
