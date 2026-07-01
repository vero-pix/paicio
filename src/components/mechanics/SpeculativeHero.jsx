import { useCountUp } from '../../lib/animations.js'

// ─────────────────────────────────────────────────────────────────────────
// SpeculativeHero — "héroe" visual del Episodio 3 (defender la paridad).
//
// El centro es el TIPO DE CAMBIO: clavado en la paridad "1,00" mientras
// aguantas, con el ataque especulativo golpeando cada vez más fuerte (flechas
// que crecen con la ronda). Al soltar la paridad, el número salta a su valor de
// mercado y el ataque se detiene. Titular del Heraldo dinámico.
// ─────────────────────────────────────────────────────────────────────────

const fmt = (n) =>
  n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function heraldo({ collapsed, devaluado, ordered, dia }) {
  if (collapsed)
    return {
      headline: 'RESERVAS EN CERO: LA PARIDAD CAE EN MEDIO DEL PÁNICO',
      sub: 'Quemaste hasta la última bala defendiendo lo indefendible.',
      pos: false,
    }
  if (devaluado && ordered)
    return {
      headline: 'DEVALUACIÓN ORDENADA: PAICIO SUELTA LA PARIDAD A TIEMPO',
      sub: 'Cediste con reservas en mano. El golpe fue firme, pero controlado.',
      pos: true,
    }
  if (devaluado)
    return {
      headline: 'CAE LA PARIDAD: EL AJUSTE LLEGA TARDE Y CON DAÑO',
      sub: 'Soltaste la moneda, pero ya habías gastado de más.',
      pos: false,
    }
  if (dia >= 4)
    return {
      headline: 'EL ATAQUE ARRECIA: EL MERCADO HUELE LA DEVALUACIÓN',
      sub: 'Cuanto más aguantas la paridad, más fiero es el embate.',
      pos: false,
    }
  return {
    headline: 'LA PARIDAD BAJO ASEDIO: LOS ESPECULADORES APUESTAN EN CONTRA',
    sub: 'Un peso, un dólar. El mercado no lo cree.',
    pos: false,
  }
}

export default function SpeculativeHero({
  reservas,
  dia = 1,
  dias = 6,
  devaluado = false,
  collapsed = false,
  ordered = false,
}) {
  // Tipo de cambio: clavado en 1,00 mientras defiendes; al devaluar salta a su
  // valor de mercado (más caro cuanto más tarde soltaste).
  const mercado = 1 + Math.min(0.85, (dia - 1) * 0.14)
  const tipo = devaluado ? mercado : 1
  const display = useCountUp(tipo, 700)
  const { headline, sub, pos } = heraldo({ collapsed, devaluado, ordered, dia })

  // Intensidad del ataque: crece con la ronda (0 si ya devaluó).
  const arrows = devaluado ? 0 : Math.max(1, Math.min(6, dia + 1))
  const ammo = Math.max(0, Math.min(100, reservas)) // reservas como "munición"

  return (
    <div className="animate-fade-in overflow-hidden rounded-md border border-edge bg-cell-2/70">
      <div className="border-b border-edge/70 bg-cell/60 px-3 py-1.5 text-center">
        <p className="font-display text-[0.62rem] font-black tracking-[0.28em] text-paper">
          EL HERALDO DE PAICIO
        </p>
      </div>

      <div className="px-4 pt-3 text-center">
        <p
          className={`font-display text-[0.86rem] font-black uppercase leading-tight transition-colors ${
            pos ? 'text-positive' : 'text-paper'
          }`}
        >
          {headline}
        </p>
        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-paper-dim">
            {devaluado ? 'Tipo de cambio' : 'Paridad'}
          </span>
          <span
            className={`font-mono text-[1.7rem] font-medium leading-none tabular-nums transition-colors ${
              pos ? 'text-positive' : devaluado ? 'text-ticker' : 'text-paper'
            }`}
          >
            {fmt(display)}
          </span>
          <span className="font-mono text-[0.6rem] tracking-[0.1em] text-paper-dim">
            $ / moneda
          </span>
        </div>
      </div>

      {/* Escena: muralla de la paridad bajo ataque + munición (reservas) */}
      <div className="mt-2 px-3">
        <svg viewBox="0 0 240 84" className="w-full" aria-hidden>
          <path d="M0 74 H240" stroke="var(--color-edge)" strokeWidth="1.4" />

          {/* muralla de la paridad (se inclina al devaluar) */}
          <g
            style={{
              transformOrigin: '150px 74px',
              transform: devaluado ? 'rotate(9deg) translateY(6px)' : 'rotate(0)',
              transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
            }}
            stroke="var(--color-paper)"
            strokeWidth="1.6"
            fill="none"
            strokeLinejoin="round"
          >
            <rect x="138" y="30" width="24" height="44" />
            <path d="M138 40h24M138 52h24M138 63h24M150 30v44" />
          </g>

          {/* flechas del ataque especulativo (desde la derecha) */}
          {Array.from({ length: arrows }).map((_, i) => {
            const y = 34 + i * 6.5
            return (
              <g
                key={i}
                stroke="var(--color-crisis)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                style={{ animation: `attack-jab ${1 + (i % 3) * 0.25}s ease-in-out ${i * 0.12}s infinite` }}
              >
                <path d={`M232 ${y} H172`} />
                <path d={`M178 ${y - 3} l-4 3 4 3`} />
              </g>
            )
          })}

          {/* munición: reservas restantes (barra dorada a la izquierda) */}
          <rect x="12" y="66" width="96" height="6" rx="3" fill="#120c05" />
          <rect
            x="12"
            y="66"
            height="6"
            rx="3"
            fill="#c9a24b"
            width={(0.96 * ammo).toFixed(1)}
            style={{ transition: 'width 0.6s ease-out' }}
          />
        </svg>
      </div>

      <p className="px-4 pb-3 text-center font-body text-[0.72rem] italic leading-snug text-paper-dim">
        {sub}
      </p>
    </div>
  )
}
