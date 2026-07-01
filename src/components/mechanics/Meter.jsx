import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../../lib/animations.js'

// Medidor compartido por las mecánicas.
// - El número cuenta desde el valor anterior al nuevo (~800ms).
// - La barra anima su ancho (600ms ease-out).
// - Si el valor se mueve en la dirección "mala" más de 20 puntos, pulsa rojo.
// `goodWhenLow` invierte la escala de color (para Inflación / Expectativas).
// `variant` tematiza la barra ('flame' = calor de la inflación · 'crowd' =
// multitud que se voltea). Sin variante, mantiene el estilo genérico previo.

// Iconos line-art opcionales según variante (heredan color con currentColor).
function VariantIcon({ variant }) {
  if (variant === 'flame')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0" aria-hidden>
        <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 .6 2 2 2 0-2-1-4 0-6z" />
      </svg>
    )
  if (variant === 'crowd')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0" aria-hidden>
        <circle cx="6" cy="8" r="1.6" />
        <circle cx="12" cy="7" r="1.6" />
        <circle cx="18" cy="8" r="1.6" />
        <path d="M3 17c0-2 1.5-3 3-3s3 1 3 3" />
        <path d="M9 16c0-2 1.5-3 3-3s3 1 3 3" />
        <path d="M15 17c0-2 1.5-3 3-3s3 1 3 3" />
      </svg>
    )
  if (variant === 'vault')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0" aria-hidden>
        <ellipse cx="12" cy="6" rx="7" ry="2.6" />
        <path d="M5 6v5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" />
        <path d="M5 11v5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-5" />
      </svg>
    )
  return null
}

const FILLS = {
  flame: 'linear-gradient(90deg, #e8a13a, var(--color-crisis))',
  crowd:
    'linear-gradient(90deg, var(--color-crisis), #c9a24b 55%, var(--color-positive))',
  vault: 'linear-gradient(90deg, #6e4b12, #c9a24b 55%, #e8d5a3)',
}

const ICON_COLOR = {
  flame: 'text-ticker',
  crowd: 'text-paper-dim',
  vault: 'text-[#c9a24b]',
}

export default function Meter({ label, value, hint, goodWhenLow = false, variant }) {
  const good = goodWhenLow ? value <= 35 : value >= 55
  const mid = goodWhenLow ? value <= 60 : value >= 28
  const tone = good ? 'bg-positive' : mid ? 'bg-paper-dim' : 'bg-crisis'
  const num = good ? 'text-positive' : mid ? 'text-paper' : 'text-crisis'
  const display = Math.round(useCountUp(value, 800))
  const pct = Math.max(0, Math.min(100, value))

  const prev = useRef(value)
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    const badDelta = goodWhenLow ? value - prev.current : prev.current - value
    prev.current = value
    if (badDelta > 20) {
      setPulse(false)
      requestAnimationFrame(() => setPulse(true))
      const t = setTimeout(() => setPulse(false), 750)
      return () => clearTimeout(t)
    }
    return undefined
  }, [value, goodWhenLow])

  // Estilo de la barra: temática si hay variante, genérica si no.
  const fillStyle = { width: `${pct}%`, transition: 'width 0.6s ease-out' }
  const fillClass = variant ? 'h-full rounded-full' : `h-full rounded-full ${tone}`
  if (variant) {
    fillStyle.background = FILLS[variant]
    // La llama "brilla" más a medida que sube la inflación.
    if (variant === 'flame' && pct > 55) {
      fillStyle.boxShadow = `0 0 ${Math.round((pct - 55) / 4)}px rgba(231,76,60,0.6)`
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-wide text-paper-dim">
          {variant && (
            <span className={ICON_COLOR[variant] || 'text-paper-dim'}>
              <VariantIcon variant={variant} />
            </span>
          )}
          {label}
        </span>
        <span className={`font-mono text-sm tabular-nums ${num}`}>{display}</span>
      </div>
      <div
        className={`mt-1 h-2.5 overflow-hidden rounded-full bg-ink ${pulse ? 'animate-pulse-red' : ''}`}
      >
        <div className={fillClass} style={fillStyle} />
      </div>
      {hint && <p className="mt-1 font-mono text-[0.54rem] text-paper-dim/70">{hint}</p>}
    </div>
  )
}
