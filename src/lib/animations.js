import { useEffect, useRef, useState } from 'react'

// Utilidades de animación en JS puro (sin librerías). Respetan
// prefers-reduced-motion saltando la animación.

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

// Cuenta un número desde el valor anterior hasta el nuevo (ease-out cúbico).
export function useCountUp(target, duration = 800) {
  const [val, setVal] = useState(target)
  const fromRef = useRef(target)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return undefined
    if (prefersReduced()) {
      setVal(target)
      fromRef.current = target
      return undefined
    }
    let raf = 0
    let start = 0
    const tick = (now) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(from + (target - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return val
}

// Revela un texto letra a letra. Devuelve el texto parcial, si terminó, y skip().
export function useTypewriter(text, speed = 30) {
  const [n, setN] = useState(prefersReduced() ? text.length : 0)

  useEffect(() => {
    if (prefersReduced()) {
      setN(text.length)
      return undefined
    }
    setN(0)
    let i = 0
    let id = 0
    const step = () => {
      i += 1
      setN(i)
      if (i < text.length) id = setTimeout(step, speed)
    }
    id = setTimeout(step, speed)
    return () => clearTimeout(id)
  }, [text, speed])

  return {
    shown: text.slice(0, n),
    done: n >= text.length,
    skip: () => setN(text.length),
  }
}

// Feedback de pantalla: 'shake' (negativo) o 'flash' (positivo), una sola vez.
export function useScreenFx() {
  const [fx, setFx] = useState('')
  const trigger = (kind) => {
    if (prefersReduced()) return
    setFx('')
    requestAnimationFrame(() => setFx(kind))
    const dur = kind === 'shake' ? 340 : 520
    setTimeout(() => setFx(''), dur)
  }
  return { fx, trigger }
}
