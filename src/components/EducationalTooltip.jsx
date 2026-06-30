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
        className="cursor-pointer rounded-sm border border-dashed border-paper-dim/70 bg-paper/5 px-1.5 py-0.5 font-mono text-[0.72rem] tracking-wide text-paper-dim transition-colors hover:border-paper hover:text-paper"
      >
        {label || concept.title} ⓘ
      </button>

      {open && (
        <span
          role="dialog"
          className="animate-fade-up absolute bottom-full left-0 z-30 mb-2 block w-64 max-w-[80vw] rounded-md border border-edge bg-cell p-3 text-left shadow-2xl shadow-black/60"
        >
          <span className="block font-display text-sm font-semibold text-paper">
            {concept.title}
          </span>
          <span className="mt-1 block font-body text-[0.8rem] italic text-paper-dim">
            {concept.short}
          </span>
          <span className="mt-2 block font-body text-[0.82rem] leading-snug text-paper">
            {concept.body}
          </span>
        </span>
      )}
    </span>
  )
}
