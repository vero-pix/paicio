import { useEffect, useState } from 'react'

const STEPS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 12h8M12 8v8" />
        <path d="M5 18h14" strokeDasharray="2 2" />
      </svg>
    ),
    title: '1. El gobierno imprime billetes',
    desc: 'Para pagar sus deudas, prende la imprenta.',
    color: '#E8604F',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
        <rect x="6" y="10" width="12" height="10" rx="1" />
        <path d="M6 14h12" />
        <path d="M9 10V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
      </svg>
    ),
    title: '2. Más dinero en circulación',
    desc: 'Hay más billetes, pero los mismos productos.',
    color: '#F5A524',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
        <path d="M8 3.5a9 9 0 0 0 0 17" />
      </svg>
    ),
    title: '3. Cada billete vale menos',
    desc: 'El dinero pierde valor. Sube la inflación.',
    color: '#F5A524',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
        <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" />
        <path d="M4 19v-5h5" />
        <path d="M12 8v4l2 1" />
        <path d="M4 12a6 6 0 0 1 6-6" strokeDasharray="2 2" />
      </svg>
    ),
    title: '4. Los precios se disparan',
    desc: 'Cada semana todo cuesta más. El ahorro se esfuma.',
    color: '#E8604F',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
        <circle cx="12" cy="8" r="2.5" />
        <path d="M5 22c0-3.9 3.1-7 7-7s7 3.1 7 7" />
        <path d="M3 6c.6-1 1.7-2 3-2" />
        <path d="M21 6c-.6-1-1.7-2-3-2" />
        <path d="M5 14c-.6.5-1 1.3-1 2" />
        <path d="M19 14c.6.5 1 1.3 1 2" />
      </svg>
    ),
    title: '5. El pan ya no alcanza',
    desc: 'El salario no alcanza ni para lo básico.',
    color: '#E8604F',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
        <circle cx="6" cy="8" r="1.6" />
        <circle cx="12" cy="7" r="1.6" />
        <circle cx="18" cy="8" r="1.6" />
        <path d="M3 17c0-2 1.5-3 3-3s3 1 3 3" />
        <path d="M9 16c0-2 1.5-3 3-3s3 1 3 3" />
        <path d="M15 17c0-2 1.5-3 3-3s3 1 3 3" />
        <path d="M4 20h16" strokeWidth="2" />
      </svg>
    ),
    title: '6. El pueblo protesta',
    desc: 'Harto de la crisis, la gente sale a la calle.',
    color: '#C43D2C',
  },
]

export default function CausalChain({ onDone }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= STEPS.length) {
      const t = setTimeout(onDone, 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1000)
    return () => clearTimeout(t)
  }, [step, onDone])

  return (
    <div className="animate-fade-in mt-5 space-y-3">
      <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-mute">
        ⛓️ Cadena causal
      </p>
      {STEPS.slice(0, Math.min(step + 1, STEPS.length)).map((s, i) => (
        <div
          key={i}
          className={`animate-fade-up flex items-start gap-3 rounded-[14px] bg-panel/80 p-3 shadow-card transition-all ${
            i === Math.min(step, STEPS.length - 1) ? 'ring-2 ring-gold/40' : ''
          }`}
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
            style={{ background: `${s.color}22`, color: s.color }}
          >
            {s.icon}
          </span>
          <div>
            <p className="font-round text-[0.88rem] font-bold text-ink-warm">{s.title}</p>
            <p className="mt-0.5 font-nunito text-[0.78rem] leading-snug text-ink-soft">{s.desc}</p>
          </div>
        </div>
      ))}
      {step < STEPS.length && (
        <div className="flex justify-center">
          <span className="animate-blink inline-block h-2 w-2 rounded-full bg-gold" />
        </div>
      )}
    </div>
  )
}
