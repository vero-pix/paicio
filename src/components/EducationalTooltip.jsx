import { useState } from 'react'
import { concepts } from '../data/concepts.js'

// Popup de concepto económico. Aparece en contexto, nunca interrumpe:
// es un chip con borde punteado que el jugador puede abrir si quiere profundizar.
export default function EducationalTooltip({ conceptId, label, onSeen }) {
  const [open, setOpen] = useState(false)
  const concept = concepts[conceptId]
  if (!concept) return null

  function toggle() {
    const next = !open
    setOpen(next)
    if (next && onSeen) onSeen(conceptId)
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="cursor-pointer rounded-full border border-dashed border-ink-mute/60 bg-surface/70 px-2.5 py-1 font-nunito text-[0.66rem] font-bold text-ink-soft transition-colors hover:border-ink-mute"
      >
        {label || concept.title} ⓘ
      </button>

      {open && (
        <span
          role="dialog"
          className="animate-fade-up shadow-panel absolute bottom-full left-0 z-30 mb-2 block w-64 max-w-[80vw] rounded-[16px] bg-panel p-3 text-left"
        >
          <span className="block font-round text-[0.86rem] font-bold text-ink-warm">
            {concept.title}
          </span>
          <span className="mt-1 block font-nunito text-[0.78rem] italic text-ink-mute">
            {concept.short}
          </span>
          <span className="mt-1.5 block font-nunito text-[0.82rem] leading-snug text-ink-soft">
            {concept.body}
          </span>
        </span>
      )}
    </span>
  )
}
