import { useLayoutEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────
// CoachMarks — overlay de onboarding reutilizable y data-driven.
//
// Recibe una lista de pasos { ref, caption } y los recorre de a uno: atenúa la
// pantalla y deja un "spotlight" (hueco) sobre el elemento REAL apuntado por
// ref, con un caption corto + "Siguiente". "Saltar" siempre visible.
//
// El atenuado se hace con un box-shadow gigante sobre el recorte del elemento
// (técnica clásica de spotlight): todo se oscurece menos el hueco. El overlay
// captura los clics (solo Siguiente/Saltar funcionan). El reduced-motion se
// respeta global (index.css neutraliza las animaciones).
// ─────────────────────────────────────────────────────────────────────────

const PAD = 8 // margen del spotlight alrededor del elemento
const CAP_W = 300 // ancho del caption

export default function CoachMarks({ steps, accent, onDone, onSkip }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)
  const step = steps[i]
  const last = i >= steps.length - 1

  useLayoutEffect(() => {
    let raf = 0
    function measure() {
      const el = step?.ref?.current
      if (!el) {
        setRect(null)
        return
      }
      const r = el.getBoundingClientRect()
      setRect((prev) =>
        prev && prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height
          ? prev
          : { top: r.top, left: r.left, width: r.width, height: r.height },
      )
    }
    // El elemento puede estar animando su entrada (drop-in) o el count-up puede
    // reflowear: re-mide cada frame ~700ms hasta que se asiente, y luego ante
    // resize/scroll.
    const start = performance.now()
    const loop = (t) => {
      measure()
      if (t - start < 700) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [step, i])

  if (!step) return null

  const vw = typeof window !== 'undefined' ? window.innerWidth : 375
  const vh = typeof window !== 'undefined' ? window.innerHeight : 667

  // Posición del caption: bajo el spotlight si hay espacio, si no, arriba. Si no
  // hay rect (elemento aún no montado), centra el caption.
  let capTop, capLeft, spot
  if (rect) {
    spot = {
      top: rect.top - PAD,
      left: rect.left - PAD,
      width: rect.width + PAD * 2,
      height: rect.height + PAD * 2,
    }
    const below = spot.top + spot.height + 150 < vh
    capTop = below ? spot.top + spot.height + 12 : Math.max(12, spot.top - 150)
    const center = rect.left + rect.width / 2
    capLeft = Math.min(Math.max(12, center - CAP_W / 2), vw - CAP_W - 12)
  } else {
    capTop = vh / 2 - 60
    capLeft = Math.min(Math.max(12, vw / 2 - CAP_W / 2), vw - CAP_W - 12)
  }

  const next = () => (last ? onDone?.() : setI((n) => n + 1))

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Tutorial">
      {/* Spotlight: recorte iluminado + atenuado del resto vía box-shadow. Si no
          hay rect, un velo plano. */}
      {spot ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-[18px]"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            boxShadow: '0 0 0 9999px rgba(24,15,5,0.66), inset 0 0 0 2px rgba(255,255,255,0.9)',
            transition: 'all 0.25s ease',
          }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(24,15,5,0.66)' }} />
      )}

      {/* Caption + controles */}
      <div
        className="animate-fade-up shadow-panel absolute rounded-[18px] bg-panel p-3.5"
        style={{ top: capTop, left: capLeft, width: CAP_W, maxWidth: 'calc(100vw - 24px)' }}
      >
        <p className="font-nunito text-[0.9rem] font-semibold leading-snug text-ink-warm">
          {step.caption}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSkip?.()}
            className="font-nunito text-[0.76rem] font-extrabold uppercase tracking-wide text-ink-mute underline-offset-2 hover:underline"
          >
            Saltar
          </button>
          <div className="flex items-center gap-2.5">
            <span className="font-nunito text-[0.72rem] font-extrabold tabular-nums text-ink-mute">
              {i + 1}/{steps.length}
            </span>
            <button
              type="button"
              onClick={next}
              className="candy px-4 py-2 text-[0.86rem]"
              style={{ '--face': accent?.face ?? 'var(--color-gold)', '--edge': accent?.edge ?? 'var(--color-gold-edge)' }}
            >
              {last ? '¡Listo!' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
