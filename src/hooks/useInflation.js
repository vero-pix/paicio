import { useEffect, useRef, useState } from 'react'

// El ticker de inflación: el precio del pan sube de forma compuesta con el tiempo.
// Nunca se detiene mientras el juego está activo — es la presión de tiempo del juego.
//
// startPrice: precio inicial del pan en Marcos
// ratePerTick: factor de crecimiento por tick (1.018 ≈ +1.8% por segundo)
// active: si false, el ticker queda congelado (p. ej. en el desenlace)

export function useInflation({
  startPrice = 4800,
  tickMs = 1000,
  ratePerTick = 1.018,
  threshold = 10000,
  active = true,
} = {}) {
  const [price, setPrice] = useState(startPrice)
  const [elapsed, setElapsed] = useState(0) // segundos transcurridos
  const ref = useRef(null)

  // Reinicia el precio al cambiar de episodio (nuevo precio inicial).
  useEffect(() => {
    setPrice(startPrice)
    setElapsed(0)
  }, [startPrice])

  useEffect(() => {
    if (!active) return
    ref.current = setInterval(() => {
      setPrice((p) => Math.round(p * ratePerTick))
      setElapsed((e) => e + tickMs / 1000)
    }, tickMs)
    return () => clearInterval(ref.current)
  }, [active, tickMs, ratePerTick])

  // ¿Cruzamos el umbral de hiperinflación "visible" del episodio?
  const hyperinflation = price >= threshold

  return { price, elapsed, hyperinflation }
}

// Formatea un número grande con separador de miles estilo periódico.
export function formatMarcos(n) {
  return new Intl.NumberFormat('es-CL').format(Math.round(n))
}
