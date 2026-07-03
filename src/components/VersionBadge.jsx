import { useState } from 'react'
import { APP_VERSION, NOVEDADES } from '../data/version.js'

// ─────────────────────────────────────────────────────────────────────────
// VersionBadge — sello discreto con la versión actual + panel de novedades.
//
// Se monta UNA vez a nivel de App como disparador `position: fixed` en la
// esquina inferior izquierda: así es visible en TODAS las pantallas (mapa,
// celda, mecánica, desenlace), no solo al fondo del mapa. z-40 (bajo el modal
// de novedades, z-50, y bajo los coach-marks, z-60). Respeta safe-area para no
// tapar controles en móvil. El botón "actualizar" (hard refresh) vive ahora
// dentro del panel de novedades.
// ─────────────────────────────────────────────────────────────────────────
export default function VersionBadge() {
  const [open, setOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Recarga trayendo la última versión, saltando el caché del navegador.
  const hardRefresh = async () => {
    setRefreshing(true)
    try {
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      }
    } catch {
      /* sin Cache API: seguimos con el cache-bust igual */
    }
    const url = new URL(window.location.href)
    url.searchParams.set('v', String(Date.now()))
    window.location.replace(url.toString())
  }

  return (
    <>
      {/* Disparador fijo, discreto, en la esquina inferior izquierda. Chip
          oscuro translúcido para leerse tanto sobre el crema (mapa/mecánica)
          como sobre las pantallas oscuras (celda/negociación). */}
      <div
        className="fixed bottom-0 left-0 z-40"
        style={{
          paddingLeft: 'calc(env(safe-area-inset-left) + 8px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Versión y novedades"
          className="rounded-full bg-ink/55 px-2.5 py-1 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-paper/85 backdrop-blur-sm transition-colors hover:bg-ink/75"
        >
          ✦ v{APP_VERSION}
        </button>
      </div>

      {open && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center">
          <div className="grain max-h-[82%] w-full max-w-md overflow-y-auto rounded-t-2xl border-t border-edge bg-cell p-6 pb-7 shadow-2xl sm:rounded-2xl sm:border">
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-black leading-tight text-paper">
                    Novedades
                  </h3>
                  <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-paper-dim">
                    Versión actual · v{APP_VERSION}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-paper-dim hover:bg-ink/40 hover:text-paper"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-5">
                {NOVEDADES.map((n) => (
                  <div key={n.version} className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="rounded-full border border-crisis/50 bg-crisis/10 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-crisis">
                        v{n.version}
                      </span>
                      <span className="font-mono text-[0.58rem] text-paper-dim/70">{n.fecha}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {n.cambios.map((c, i) => (
                        <li key={i} className="flex gap-2 font-body text-[0.86rem] leading-snug text-paper/90">
                          <span className="text-crisis">·</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Actualizar (hard refresh, salta el caché). */}
              <button
                type="button"
                onClick={hardRefresh}
                aria-label="Actualizar a la última versión"
                className="mt-6 w-full rounded-full border border-edge bg-ink/30 px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper-dim transition-colors hover:bg-ink/50 hover:text-paper"
              >
                {refreshing ? '↻ actualizando…' : '↻ actualizar a la última versión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
