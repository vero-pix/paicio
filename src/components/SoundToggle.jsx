import { useState } from 'react'
import { isMuted, toggleMuted } from '../lib/sound.js'

// Botón de mute/unmute persistente (esquina superior derecha).
// El estado se guarda en localStorage vía el motor de sonido.
export default function SoundToggle() {
  const [muted, setMuted] = useState(() => isMuted())

  return (
    <button
      type="button"
      onClick={() => setMuted(toggleMuted())}
      aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      title={muted ? 'Activar sonido' : 'Silenciar'}
      className="fixed right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-cell/80 text-paper-dim shadow-md shadow-black/40 backdrop-blur-sm transition-all hover:border-paper-dim hover:text-paper"
    >
      <span aria-hidden className="text-sm">
        {muted ? '🔇' : '🔊'}
      </span>
    </button>
  )
}
