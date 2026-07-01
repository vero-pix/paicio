import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../../lib/animations.js'
import { precioPan } from '../../utils/hyperinflation.js'

// ─────────────────────────────────────────────────────────────────────────
// BreadCounter — "héroe" visual de la mecánica de hiperinflación.
//
// Convierte el precio del pan (dato del juego, `precioPan`) en el centro
// dramático de la pantalla: cifra grande que cuenta hacia arriba, titular del
// Heraldo que se reescribe según la crisis, y una pila de billetes ardiendo
// cuyas brasas escalan con la inflación. Al imprimir, el precio pega un salto
// (prop `surgeKey` que se incrementa desde la mecánica).
// ─────────────────────────────────────────────────────────────────────────

const fmt = (n) => Math.round(n).toLocaleString('es-CL')

// Titular dinámico del Heraldo según el estado de la crisis.
function heraldo(inflacion, reformed, collapsed) {
  if (reformed)
    return {
      headline: 'EL RENTENMARK NACE: PAICIO FRENA LA HIPERINFLACIÓN',
      sub: 'La gente confió en la nueva moneda. Los precios se congelaron.',
    }
  if (collapsed)
    return {
      headline: 'LA GRAN QUEMA: EL MARCO SE VUELVE PAPEL SIN VALOR',
      sub: 'La gente empapela paredes con billetes. El ahorro se evaporó.',
    }
  if (inflacion >= 70)
    return {
      headline: 'LA ESPIRAL SE DESBOCA: EL PAN CAMBIA DE PRECIO A MEDIODÍA',
      sub: 'Nadie quiere guardar Marcos. Todos gastan al instante.',
    }
  if (inflacion >= 45)
    return {
      headline: 'EL PAN NO PARA: LA IMPRENTA ALIMENTA LA INFLACIÓN',
      sub: 'Cada cuenta del Estado pagada empuja los precios más arriba.',
    }
  return {
    headline: 'EL PAN SE DISPARA: LA MONEDA DE PAICIO SE TAMBALEA',
    sub: 'Costaba una fracción la semana pasada.',
  }
}

export default function BreadCounter({
  inflacion,
  surgeKey = 0,
  reformed = false,
  collapsed = false,
}) {
  const precio = precioPan(inflacion)
  const display = useCountUp(precio, 700)
  const { headline, sub } = heraldo(inflacion, reformed, collapsed)

  // Pop del precio cada vez que se imprime (surgeKey cambia).
  const [surge, setSurge] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setSurge(false)
    const raf = requestAnimationFrame(() => setSurge(true))
    const t = setTimeout(() => setSurge(false), 470)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [surgeKey])

  // Brasas proporcionales a la inflación (ninguna si la reforma tuvo éxito).
  const embers = reformed ? 0 : Math.min(9, Math.max(0, Math.round(inflacion / 11)))
  const priceColor = reformed ? 'text-positive' : 'text-ticker'
  const shadow = reformed
    ? '0 0 16px rgba(39,174,96,.30)'
    : '0 0 18px rgba(231,76,60,.32)'

  return (
    <div className="animate-fade-in overflow-hidden rounded-md border border-edge bg-cell-2/70">
      {/* Masthead */}
      <div className="border-b border-edge/70 bg-cell/60 px-3 py-1.5 text-center">
        <p className="font-display text-[0.62rem] font-black tracking-[0.28em] text-paper">
          EL HERALDO DE PAICIO
        </p>
      </div>

      {/* Titular dinámico + precio héroe */}
      <div className="px-4 pt-3 text-center">
        <p
          className={`font-display text-[0.86rem] font-black uppercase leading-tight transition-colors ${
            reformed ? 'text-positive' : 'text-paper'
          }`}
        >
          {headline}
        </p>

        <div className="mt-3 flex items-baseline justify-center gap-2">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-paper-dim">
            Pan de Paicio
          </span>
          <span
            className={`font-mono text-[2.4rem] font-medium leading-none tabular-nums transition-colors ${priceColor} ${
              surge ? 'animate-price-surge' : ''
            }`}
            style={{ textShadow: shadow }}
          >
            {fmt(display)}
          </span>
          <span className="font-mono text-[0.66rem] tracking-[0.1em] text-paper-dim">
            Marcos
          </span>
        </div>
        <p className="mt-1 font-body text-[0.72rem] italic leading-snug text-paper-dim">
          {sub}
        </p>
      </div>

      {/* Billetes ardiendo */}
      <div className="relative mt-2 h-[58px]" aria-hidden>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1">
          {[-4, 2, -1].map((rot, i) => (
            <span
              key={i}
              className="inline-block h-[20px] w-[42px] rounded-[2px]"
              style={{
                transform: `rotate(${rot}deg)`,
                background: 'linear-gradient(135deg,#3a2c14,#57431f)',
                border: '1px solid rgba(201,162,75,0.7)',
                opacity: reformed ? 0.5 : 0.92,
              }}
            />
          ))}
        </div>
        {Array.from({ length: embers }).map((_, i) => (
          <span
            key={i}
            className="absolute bottom-[18px] h-[5px] w-[5px] rounded-full bg-crisis"
            style={{
              left: `${44 + ((i * 37) % 22)}%`,
              filter: 'blur(0.5px)',
              '--ember-dx': `${((i * 7) % 20) - 10}px`,
              animation: `ember-rise 1.6s ease-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
