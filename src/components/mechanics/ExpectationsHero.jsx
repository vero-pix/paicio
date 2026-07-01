import { useCountUp } from '../../lib/animations.js'

// ─────────────────────────────────────────────────────────────────────────
// ExpectationsHero — "héroe" visual del Episodio 4 (expectativas e inercia).
//
// El centro es la INFLACIÓN ESPERADA: una espiral que gira más rápido cuanto
// más alta es la expectativa (la inercia se autoalimenta), y se frena al bajar.
// El titular del Heraldo refleja si rompes la inercia o sumas otro plan fallido.
// ─────────────────────────────────────────────────────────────────────────

function heraldo({ collapsed, won, rebote, expectativas }) {
  if (collapsed)
    return {
      headline: 'OTRO PLAN FRACASA: NADIE CREE UNA PALABRA MÁS',
      sub: 'Tu credibilidad se agotó, como la de los cinco planes anteriores.',
      pos: false,
    }
  if (won)
    return {
      headline: 'SE ROMPE LA INERCIA: LA INFLACIÓN CEDE POR FIN',
      sub: 'La gente empezó a creer. Las expectativas bajaron y la inflación las siguió.',
      pos: true,
    }
  if (rebote)
    return {
      headline: 'EL CONGELAMIENTO SE DERRITE: LOS PRECIOS REBOTAN PEOR',
      sub: 'Sin credibilidad, tapar los precios solo posterga —y agrava— la subida.',
      pos: false,
    }
  if (expectativas >= 65)
    return {
      headline: 'LA INERCIA MANDA: TODOS INDEXAN Y LA INFLACIÓN SE REPITE',
      sub: 'Se espera inflación, se pone en los precios, y entonces ocurre.',
      pos: false,
    }
  return {
    headline: 'LA CARRERA DE PRECIOS Y SALARIOS NO SE DETIENE',
    sub: 'Cada quien se cubre subiendo antes que el otro.',
    pos: false,
  }
}

export default function ExpectationsHero({
  expectativas,
  rebote = false,
  collapsed = false,
  won = false,
}) {
  const display = Math.round(useCountUp(expectativas, 700))
  const { headline, sub, pos } = heraldo({ collapsed, won, rebote, expectativas })

  // La espiral gira más rápido con expectativas altas (inercia); lenta si bajan.
  const spin = (14 - (expectativas / 100) * 11).toFixed(2) // seg por vuelta

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

        {/* Espiral de la inercia + cifra de expectativas */}
        <div className="relative mt-2 flex items-center justify-center">
          <svg viewBox="0 0 90 90" className="h-[92px] w-[92px]" aria-hidden>
            <g
              style={{
                transformOrigin: '45px 45px',
                animation: won ? 'none' : `inertia-spin ${spin}s linear infinite`,
              }}
              stroke={pos ? 'var(--color-positive)' : 'var(--color-ticker)'}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            >
              <path d="M45 45 C45 34 61 34 61 45 C61 61 37 61 37 45 C37 24 69 24 69 45 C69 74 24 74 24 45 C24 15 78 15 78 45" />
              <path d="M78 45 l-4 -5 M78 45 l-5 4" />
            </g>
            <text
              x="45"
              y="49"
              textAnchor="middle"
              className="font-mono"
              style={{
                fill: pos ? 'var(--color-positive)' : 'var(--color-ticker)',
                fontSize: '17px',
                fontWeight: 500,
              }}
            >
              {display}
            </text>
          </svg>
        </div>
        <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-paper-dim">
          Inflación esperada
        </p>
        <p className="mt-1 mb-3 font-body text-[0.72rem] italic leading-snug text-paper-dim">
          {sub}
        </p>
      </div>
    </div>
  )
}
