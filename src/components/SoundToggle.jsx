import { useEffect, useRef, useState } from 'react'
import {
  isMuted,
  toggleMuted,
  getVolume,
  setVolume,
  isMusicMuted,
  toggleMusicMuted,
  isDecisionMusic,
  toggleDecisionMusic,
  sfx,
} from '../lib/sound.js'

// Control de sonido persistente (esquina superior derecha). Rediseño LatAm:
// panel claro. Separa música y efectos:
//  - Silenciar todo (mute maestro).
//  - Música on/off (independiente de los SFX).
//  - Tensión en decisiones on/off (la pista tensa; off por defecto).
//  - Volumen global.
export default function SoundToggle() {
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(() => isMuted())
  const [musicMuted, setMusicMutedState] = useState(() => isMusicMuted())
  const [decision, setDecision] = useState(() => isDecisionMusic())
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

  // Interruptor compacto reutilizable (texto verde=on / gris=off).
  const Switch = ({ on, onClick, labelOn = 'sí', labelOff = 'no' }) => (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-2 py-0.5 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide transition-colors"
      style={
        on
          ? { background: '#D6F0E5', color: '#1F9A6E' }
          : { background: '#EDE3CE', color: '#8A7A5A' }
      }
    >
      {on ? labelOn : labelOff}
    </button>
  )

  return (
    <div
      ref={ref}
      className="fixed z-50"
      style={{
        top: 'calc(env(safe-area-inset-top) + 0.75rem)',
        right: 'calc(env(safe-area-inset-right) + 0.75rem)',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Sonido"
        title="Sonido"
        className="shadow-card flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink-soft transition-all hover:text-ink-warm"
      >
        <span aria-hidden className="text-sm">
          {icon}
        </span>
      </button>

      {open && (
        <div className="animate-fade-up shadow-panel absolute right-0 top-11 w-60 rounded-[16px] bg-panel p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-ink-mute">
              Sonido
            </span>
            <button
              type="button"
              onClick={() => setMuted(toggleMuted())}
              className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-wide text-ink-soft transition-colors hover:text-ink-warm"
            >
              {muted ? '🔇 activar' : '🔊 silenciar'}
            </button>
          </div>

          {/* Música (independiente de los efectos) */}
          <div className="mt-3 flex items-center justify-between">
            <span className="font-nunito text-[0.74rem] font-bold text-ink-soft">🎵 Música</span>
            <Switch
              on={!musicMuted}
              onClick={() => {
                toggleMusicMuted()
                setMusicMutedState(isMusicMuted())
                sfx('click')
              }}
              labelOn="activa"
              labelOff="muda"
            />
          </div>

          {/* Música de la partida (pantalla de decisión), on por defecto */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="min-w-0 font-nunito text-[0.74rem] font-bold text-ink-soft">
              🎵 Música en la partida
            </span>
            <Switch
              on={decision}
              onClick={() => {
                toggleDecisionMusic()
                setDecision(isDecisionMusic())
                sfx('click')
              }}
            />
          </div>

          {/* Volumen global */}
          <div className="mt-3 border-t border-cream pt-3">
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
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-cream"
              style={{ accentColor: '#E8604F' }}
            />
            <p className="mt-1 text-right font-nunito text-[0.58rem] font-extrabold text-ink-mute/80">
              Volumen {vol}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
