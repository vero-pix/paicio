import { useEffect, useRef, useState } from 'react'
import { isMuted, toggleMuted, getVolume, setVolume, sfx } from '../lib/sound.js'

// Control de sonido persistente (esquina superior derecha):
// - Tap en el ícono: abre/cierra el panel.
// - Panel: botón de mute + slider de volumen global.
export default function SoundToggle() {
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(() => isMuted())
  const [vol, setVol] = useState(() => Math.round(getVolume() * 100))
  const ref = useRef(null)

  // Cerrar al tocar fuera del panel.
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const icon = muted || vol === 0 ? '🔇' : '🔊'

  return (
    <div ref={ref} className="fixed right-3 top-3 z-50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Sonido"
        title="Sonido"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-cell/80 text-paper-dim shadow-md shadow-black/40 backdrop-blur-sm transition-all hover:border-paper-dim hover:text-paper"
      >
        <span aria-hidden className="text-sm">
          {icon}
        </span>
      </button>

      {open && (
        <div className="animate-fade-up absolute right-0 top-11 w-52 rounded-md border border-edge bg-cell p-3 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-paper-dim">
              Sonido
            </span>
            <button
              type="button"
              onClick={() => setMuted(toggleMuted())}
              className="font-mono text-[0.58rem] uppercase tracking-wide text-paper-dim transition-colors hover:text-paper"
            >
              {muted ? '🔇 activar' : '🔊 silenciar'}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={vol}
            aria-label="Volumen"
            onChange={(e) => {
              const v = Number(e.target.value)
              setVol(v)
              setVolume(v / 100)
              if (muted && v > 0) setMuted(toggleMuted())
            }}
            onPointerUp={() => sfx('click')}
            className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink accent-crisis"
            style={{ accentColor: 'var(--color-crisis)' }}
          />
          <p className="mt-1 text-right font-mono text-[0.54rem] text-paper-dim/70">{vol}%</p>
        </div>
      )}
    </div>
  )
}
