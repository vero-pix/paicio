import { useCountUp } from '../../lib/animations.js'

// ─────────────────────────────────────────────────────────────────────────
// BankRunHero — "héroe" visual del Episodio 2 (corrida bancaria).
//
// A diferencia del Ep1 (número protagonista), aquí el centro es una ESCENA: la
// fila de ahorristas que crece cuando cae la confianza, la reja del corralito
// que baja al imponerlo, y el "dólar libre" que se dispara mientras el peso se
// tambalea. El titular del Heraldo se reescribe según el estado de la crisis.
// ─────────────────────────────────────────────────────────────────────────

const fmtDolar = (n) =>
  n.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

// Posición de cada ahorrista en la fila, desde la puerta del banco hacia afuera.
const QUEUE_X = [140, 121, 102, 83, 64, 45, 26]

function heraldo({ collapsed, calmed, corralito, confianza }) {
  if (collapsed)
    return {
      headline: 'LOS BANCOS QUIEBRAN: LAS RESERVAS LLEGARON A CERO',
      sub: 'La ventanilla no devuelve un peso más. El sistema se seca.',
      pos: false,
    }
  if (calmed && !corralito)
    return {
      headline: 'VUELVE LA CALMA: LA GENTE DEJA DE CORRER A LOS BANCOS',
      sub: 'La fila se disuelve. El peso deja de caer.',
      pos: true,
    }
  if (corralito)
    return {
      headline: 'EL CORRALITO ATRAPA LOS AHORROS: BRONCA Y CACEROLAS',
      sub: 'La reja bajó. El dinero existe, pero nadie lo puede tocar.',
      pos: false,
    }
  if (confianza <= 30)
    return {
      headline: 'PÁNICO EN LOS BANCOS: LA FILA DA LA VUELTA A LA MANZANA',
      sub: 'Cuanto más corren, menos queda; cuanto menos queda, más corren.',
      pos: false,
    }
  return {
    headline: 'CRECE LA FILA: EL PESO SE TAMBALEA FRENTE AL DÓLAR',
    sub: 'Los ahorristas hacen cola desde el amanecer.',
    pos: false,
  }
}

export default function BankRunHero({
  confianza,
  corralito = false,
  collapsed = false,
  calmed = false,
}) {
  // Dólar libre (flavor): 1 peso cuando hay calma total, hasta ~4 en pánico.
  const dolar = 1 + ((100 - confianza) / 100) * 3
  const dolarDisplay = useCountUp(dolar, 700)
  const { headline, sub, pos } = heraldo({ collapsed, calmed, corralito, confianza })

  // Cuánta gente en la fila (0–7), crece al caer la confianza.
  const people = Math.max(0, Math.min(7, Math.round((100 - confianza) / 13)))

  return (
    <div className="animate-fade-in overflow-hidden rounded-md border border-edge bg-cell-2/70">
      {/* Masthead */}
      <div className="border-b border-edge/70 bg-cell/60 px-3 py-1.5 text-center">
        <p className="font-display text-[0.62rem] font-black tracking-[0.28em] text-paper">
          EL HERALDO DE PAICIO
        </p>
      </div>

      {/* Titular dinámico + ticker del dólar */}
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
            Dólar libre
          </span>
          <span
            className={`font-mono text-[1.6rem] font-medium leading-none tabular-nums transition-colors ${
              pos ? 'text-positive' : 'text-ticker'
            }`}
            style={{ textShadow: pos ? 'none' : '0 0 14px rgba(231,76,60,.3)' }}
          >
            {fmtDolar(dolarDisplay)}
          </span>
          <span className="font-mono text-[0.6rem] tracking-[0.1em] text-paper-dim">
            Pesos
          </span>
        </div>
      </div>

      {/* Escena: fila de ahorristas + banco con reja */}
      <div className="mt-2 px-3">
        <svg viewBox="0 0 240 96" className="w-full" aria-hidden>
          {/* suelo */}
          <path d="M0 86 H240" stroke="var(--color-edge)" strokeWidth="1.4" />

          {/* fila de ahorristas (siluetas) */}
          {QUEUE_X.map((x, i) => (
            <g
              key={x}
              style={{
                opacity: i < people ? 0.92 : 0,
                transition: 'opacity 0.6s ease-out',
                animation: i < people ? `queue-sway 2.4s ease-in-out ${i * 0.2}s infinite` : 'none',
              }}
              fill="var(--color-paper-dim)"
            >
              <circle cx={x} cy={68} r="3.4" />
              <path d={`M${x - 4} 86 L${x - 3.2} 74 a3.2 3.2 0 0 1 6.4 0 L${x + 4} 86 Z`} />
            </g>
          ))}

          {/* fachada del banco */}
          <g stroke="var(--color-paper)" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
            <path d="M150 40 L191 21 L232 40" />
            <path d="M150 40 H232" />
            <path d="M158 40 V78 M176 40 V78 M206 40 V78 M224 40 V78" />
            <path d="M150 78 H232" />
          </g>
          {/* vano de la puerta */}
          <rect x="183" y="52" width="16" height="26" fill="#120c05" />

          {/* reja del corralito: baja al imponerlo */}
          <g
            style={{
              transform: corralito ? 'translateY(0)' : 'translateY(-26px)',
              opacity: corralito ? 1 : 0,
              transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.4s',
            }}
          >
            <rect x="183" y="52" width="16" height="26" fill="#2a1d0d" stroke="var(--color-crisis)" strokeWidth="1" />
            <path d="M183 58 H199 M183 64 H199 M183 70 H199 M183 76 H199" stroke="var(--color-crisis)" strokeWidth="0.8" />
            <circle cx="191" cy="65" r="2" fill="none" stroke="var(--color-crisis)" strokeWidth="1" />
          </g>
        </svg>
      </div>

      <p className="px-4 pb-3 text-center font-body text-[0.72rem] italic leading-snug text-paper-dim">
        {sub}
      </p>
    </div>
  )
}
