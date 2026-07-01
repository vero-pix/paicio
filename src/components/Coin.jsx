// ─────────────────────────────────────────────────────────────────────────
// Coin — la moneda-$ de marca (rediseño LatAm).
//
// Sello dorado reutilizable: gradiente + relieve (clase .coin), anillo interior
// y el signo $ en Fredoka. Se usa como logo en la bienvenida/onboarding y como
// mini-sello en pills. `bob` la hace flotar suavemente.
// ─────────────────────────────────────────────────────────────────────────

export default function Coin({ size = 112, bob = false, className = '' }) {
  return (
    <div
      className={`coin relative flex shrink-0 items-center justify-center rounded-full ${
        bob ? 'animate-bob' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="pointer-events-none absolute rounded-full"
        style={{ inset: Math.round(size * 0.07), border: '1.5px solid rgba(255,255,255,.4)' }}
      />
      <span
        className="font-round font-bold leading-none"
        style={{
          fontSize: Math.round(size * 0.42),
          color: '#8A4E12',
          textShadow: '0 1px 0 rgba(255,255,255,.55)',
        }}
      >
        $
      </span>
    </div>
  )
}
