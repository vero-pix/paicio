import { portraits } from '../assets/portraits.js'

// Card de un prisionero disponible para negociar.
// Muestra estado (disponible / aliado / hostil) y su función de utilidad.
const STATUS = {
  available: { label: 'Disponible', cls: 'border-edge text-paper-dim' },
  ally: { label: '✓ Aliado', cls: 'border-positive text-positive' },
  hostile: { label: '✕ Hostil', cls: 'border-crisis text-crisis' },
}

export default function Prisoner({ prisoner, status, trust, onNegotiate }) {
  const s = STATUS[status] || STATUS.available
  // Solo los aliados quedan cerrados. A un hostil se le puede volver a negociar:
  // es un dilema iterado, y reconstruir la confianza es parte del juego.
  const locked = status === 'ally'

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onNegotiate(prisoner.id)}
      className={`animate-fade-up block w-full rounded-md border bg-cell/80 p-4 text-left transition-all ${
        locked
          ? 'cursor-default opacity-80'
          : 'cursor-pointer hover:border-paper hover:bg-cell active:scale-[0.99]'
      } ${status === 'ally' ? 'border-positive/50' : status === 'hostile' ? 'border-crisis/50' : 'border-edge'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="block h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 bg-ink/60"
            style={{ borderColor: prisoner.accent, boxShadow: `0 0 0 1px ${prisoner.accent}33` }}
            aria-hidden
          >
            <img
              src={portraits[prisoner.id]}
              alt=""
              className="h-full w-full object-cover"
            />
          </span>
          <div>
            <h3 className="font-display text-base font-semibold leading-tight text-paper">
              {prisoner.name}
            </h3>
            <p className="font-mono text-[0.62rem] uppercase tracking-wide text-paper-dim">
              {prisoner.role}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide ${s.cls}`}
        >
          {s.label}
        </span>
      </div>

      <p className="mt-3 font-body text-[0.82rem] leading-snug text-paper/90">
        {prisoner.blurb}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-edge/60 pt-2">
        <p className="font-body text-[0.78rem] italic text-paper-dim">
          {prisoner.utility}
        </p>
        {typeof trust === 'number' && (
          <span className="shrink-0 font-mono text-[0.6rem] text-paper-dim">
            confianza {trust}
          </span>
        )}
      </div>

      {!locked && (
        <span className="mt-3 block text-right font-display text-sm font-semibold text-crisis">
          {status === 'hostile' ? 'Reintentar →' : 'Negociar →'}
        </span>
      )}
    </button>
  )
}
