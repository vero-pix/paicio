import { formatMarcos } from '../hooks/useInflation.js'
import { EduChip } from './mechanics/candyKit.jsx'

// Ticker de inflación (rediseño LatAm). Barra superior clara con el precio
// subiendo en rojo; marca el umbral de hiperinflación. Hoy solo lo usa la
// secuencia del Plan Real (Ep5).
export default function InflationTicker({
  price,
  hyperinflation,
  itemBase = 'Pan de Paicio',
  currency = 'Marcos',
  onConceptSeen,
}) {
  return (
    <div className="on-cream sticky top-0 z-20 border-b border-[#EBD9B0] bg-panel/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 animate-blink rounded-full"
            style={{ background: '#E8604F' }}
            aria-hidden
          />
          <span className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-ink-mute">
            {itemBase}
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span
            className="font-round text-[1.05rem] font-bold tabular-nums"
            style={{ color: '#E8604F' }}
          >
            {formatMarcos(price)}
          </span>
          <span
            className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
            style={{ color: '#E8604F' }}
          >
            {currency}
          </span>
        </div>
      </div>

      {hyperinflation && (
        <div className="px-4 py-1 text-center" style={{ background: '#FBDAD3' }}>
          <span
            className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.1em]"
            style={{ color: '#D24C39' }}
          >
            ⚠ Hiperinflación —{' '}
            <EduChip
              conceptId="hiperinflacion"
              label="¿qué es esto?"
              onSeen={onConceptSeen}
            />
          </span>
        </div>
      )}
    </div>
  )
}
