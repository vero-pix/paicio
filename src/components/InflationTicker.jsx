import { formatMarcos } from '../hooks/useInflation.js'
import EducationalTooltip from './EducationalTooltip.jsx'

// Ticker global de inflación. Siempre visible durante el juego, parpadea en rojo.
// Muestra el precio del pan subiendo y marca el umbral de hiperinflación.
export default function InflationTicker({
  price,
  hyperinflation,
  itemBase = 'Pan de Paicio',
  currency = 'Marcos',
  onConceptSeen,
}) {
  return (
    <div className="sticky top-0 z-20 border-b border-edge bg-ink/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 animate-blink rounded-full bg-ticker"
            aria-hidden
          />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper-dim">
            {itemBase}
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="animate-slow-pulse font-mono text-base font-semibold tabular-nums text-ticker">
            {formatMarcos(price)}
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-wider text-ticker/80">
            {currency}
          </span>
        </div>
      </div>

      {hyperinflation && (
        <div className="border-t border-crisis/40 bg-crisis/10 px-3 py-1 text-center">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-crisis">
            ⚠ Hiperinflación —{' '}
            <EducationalTooltip
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
