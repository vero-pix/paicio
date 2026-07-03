import { useEffect, useState } from 'react'
import { accentFor } from '../theme/accents.js'
import {
  todayISO,
  dailyEpisode,
  readDaily,
  msToTomorrow,
  countdownLabel,
  fechaCorta,
  starBar,
  dailyShareText,
} from '../utils/daily.js'

// ─────────────────────────────────────────────────────────────────────────
// DailyPanel — modal del Reto Diario (tipo Wordle). Se abre desde el mapa.
//  · Si NO jugaste hoy: presenta la crisis del día y un botón para jugarla.
//  · Si YA jugaste: muestra tu resultado, el countdown al próximo reto y el
//    botón de compartir. Un intento por día por dispositivo.
// El estado "ya jugaste" vive en localStorage (utils/daily.js).
// ─────────────────────────────────────────────────────────────────────────

export default function DailyPanel({ onPlay, onClose }) {
  const iso = todayISO()
  const ep = dailyEpisode(iso)
  const acc = accentFor(ep.id)
  const [result, setResult] = useState(() => readDaily(iso))
  const [left, setLeft] = useState(() => msToTomorrow())
  const [shared, setShared] = useState(false)

  // Countdown al próximo reto (solo corre si ya jugaste).
  useEffect(() => {
    if (!result) return undefined
    const t = setInterval(() => setLeft(msToTomorrow()), 1000)
    return () => clearInterval(t)
  }, [result])

  function compartir() {
    const texto = dailyShareText(iso, result)
    if (navigator.share) {
      navigator.share({ text: texto }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(texto).then(
        () => {
          setShared(true)
          setTimeout(() => setShared(false), 1800)
        },
        () => {},
      )
    }
  }

  return (
    <div
      className="on-cream animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-[#2A1C0C]/60 px-4 pb-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="shadow-panel w-full max-w-sm rounded-[24px] bg-panel p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-ink-mute">
              Reto Diario · {fechaCorta(iso)}
            </p>
            <h3 className="mt-0.5 font-round text-[1.35rem] font-bold text-ink-warm">
              🗓️ La crisis de hoy
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-mute hover:bg-cream hover:text-ink-warm"
          >
            ✕
          </button>
        </div>

        {!result ? (
          <>
            <p className="mt-3 font-nunito text-[0.86rem] leading-snug text-ink-soft">
              La misma crisis y los mismos imprevistos para todos, hoy. Tienes{' '}
              <span className="font-extrabold text-ink-warm">un solo intento</span>. ¿Lo harías
              mejor que el resto?
            </p>
            <div
              className="mt-4 flex items-center gap-3 rounded-[18px] p-3.5"
              style={{ background: acc.soft }}
            >
              <span className="text-[1.8rem]" aria-hidden>
                {acc.icon}
              </span>
              <div className="min-w-0">
                <p className="font-round text-[0.98rem] font-bold leading-tight text-ink-warm">
                  {ep.paisReferencia.split(',')[0]} {ep.año}
                </p>
                <p
                  className="font-nunito text-[0.74rem] font-bold leading-tight"
                  style={{ color: acc.edge }}
                >
                  {ep.crisisHistorica}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onPlay(ep, iso)}
              className="candy mt-5 w-full px-5 py-3.5 text-[1rem]"
              style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
            >
              Jugar el reto de hoy →
            </button>
          </>
        ) : (
          <>
            <div className="mt-4 rounded-[18px] bg-surface p-4 text-center shadow-card">
              <p className="text-[1.5rem] tracking-[0.2em]" aria-hidden>
                {starBar(result.stars)}
              </p>
              <p className="mt-2 font-round text-[1.6rem] font-bold tabular-nums text-ink-warm">
                {(result.score ?? 0).toLocaleString('es-CL')}
                <span className="ml-1 font-nunito text-[0.8rem] font-extrabold text-ink-mute">
                  pts
                </span>
              </p>
              <p className="mt-1 font-nunito text-[0.78rem] font-bold text-ink-soft">
                Ya jugaste el reto de hoy 🎉
              </p>
            </div>

            <button
              type="button"
              onClick={compartir}
              className="candy mt-4 w-full px-5 py-3 text-[0.94rem]"
              style={{ '--face': acc.face, '--edge': acc.edge }}
            >
              {shared ? '¡Copiado! ✓' : 'Compartir resultado ⤴'}
            </button>

            <p className="mt-4 text-center font-nunito text-[0.72rem] font-bold text-ink-mute">
              Próximo reto en{' '}
              <span className="font-round tabular-nums text-ink-warm">{countdownLabel(left)}</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
