import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────
// Coins — partículas de monedas (game feel). Dos modos:
//  - 'burst': estallido hacia afuera desde el centro (buen movimiento).
//  - 'rain' : lluvia desde arriba (celebración de la reforma exitosa).
//
// Se dispara cambiando `runKey` (un contador). Usa la moneda de marca (.coin).
// Respeta prefers-reduced-motion: si está activo, no renderiza nada.
// ─────────────────────────────────────────────────────────────────────────

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

export default function Coins({ runKey, mode = 'burst', count = 14 }) {
  const [coins, setCoins] = useState([])

  useEffect(() => {
    if (!runKey || prefersReduced()) {
      setCoins([])
      return undefined
    }
    const batch = Array.from({ length: count }, (_, i) => {
      const size = 12 + Math.random() * 12
      if (mode === 'rain') {
        return {
          id: `${runKey}-${i}`,
          left: `${Math.random() * 100}%`,
          top: '-14vh',
          size,
          rot: `${Math.random() * 720 - 360}deg`,
          dur: 1.1 + Math.random() * 0.8,
          delay: Math.random() * 0.6,
          anim: 'coin-fall',
        }
      }
      const ang = Math.random() * Math.PI * 2
      const dist = 90 + Math.random() * 150
      return {
        id: `${runKey}-${i}`,
        left: '50%',
        top: '40%',
        size,
        dx: `${Math.cos(ang) * dist}px`,
        dy: `${Math.sin(ang) * dist - 70}px`, // sesgo hacia arriba
        rot: `${Math.random() * 540 - 270}deg`,
        dur: 0.8 + Math.random() * 0.5,
        delay: Math.random() * 0.08,
        anim: 'coin-fly',
      }
    })
    setCoins(batch)
    const t = setTimeout(() => setCoins([]), 2000)
    return () => clearTimeout(t)
  }, [runKey, mode, count])

  if (coins.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {coins.map((c) => (
        <span
          key={c.id}
          className="coin absolute block rounded-full"
          style={{
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size,
            '--dx': c.dx,
            '--dy': c.dy,
            '--rot': c.rot,
            animation: `${c.anim} ${c.dur}s ${c.anim === 'coin-fly' ? 'ease-out' : 'ease-in'} ${c.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
