import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../../lib/animations.js'

// Medidor compartido por las mecánicas.
// - El número cuenta desde el valor anterior al nuevo (~800ms).
// - La barra anima su ancho (600ms ease-out).
// - Si el valor se mueve en la dirección "mala" más de 20 puntos, pulsa rojo.
// `goodWhenLow` invierte la escala de color (para Inflación / Expectativas).
export default function Meter({ label, value, hint, goodWhenLow = false }) {
  const good = goodWhenLow ? value <= 35 : value >= 55
  const mid = goodWhenLow ? value <= 60 : value >= 28
  const tone = good ? 'bg-positive' : mid ? 'bg-paper-dim' : 'bg-crisis'
  const num = good ? 'text-positive' : mid ? 'text-paper' : 'text-crisis'
  const display = Math.round(useCountUp(value, 800))

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

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[0.62rem] uppercase tracking-wide text-paper-dim">
          {label}
        </span>
        <span className={`font-mono text-sm tabular-nums ${num}`}>{display}</span>
      </div>
      <div
        className={`mt-1 h-2.5 overflow-hidden rounded-full bg-ink ${pulse ? 'animate-pulse-red' : ''}`}
      >
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, transition: 'width 0.6s ease-out' }}
        />
      </div>
      {hint && <p className="mt-1 font-mono text-[0.54rem] text-paper-dim/70">{hint}</p>}
    </div>
  )
}
