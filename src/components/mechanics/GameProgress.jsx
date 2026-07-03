import { useCountUp } from '../../lib/animations.js'

// ─────────────────────────────────────────────────────────────────────────
// GameProgress — barra de progreso de la partida (game feel). Convierte los 8
// meses en un viaje visible: un segmento por mes que se rellena mes a mes,
// marca de "clímax" al acercarse el final y guiño cuando la Reforma está a tiro.
// Incluye el chip de META (recordatorio) y el puntaje corrido.
//
// Solo presentación: recibe mes/meses/score/reformaReady y pinta. Estilo candy,
// color del acento del episodio.
// ─────────────────────────────────────────────────────────────────────────

const CRISIS = { face: '#E8604F', edge: '#C43D2C' }

export default function GameProgress({ mes, meses, score, accent, reformaReady, goalLabel }) {
  const shown = Math.round(useCountUp(score, 600))
  const climax = mes >= meses - 1 // recta final (últimos 2 meses)

  return (
    <div className="mt-2.5 rounded-[16px] bg-panel/70 px-3 py-2">
      {/* Meta + puntaje corrido */}
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-[0.9rem]">🎯</span>
        <span className="min-w-0 flex-1 truncate font-nunito text-[0.72rem] font-bold text-ink-soft">
          <span className="font-extrabold uppercase tracking-wide text-ink-mute">Meta · </span>
          {goalLabel}
        </span>
        <span
          key={score}
          className="animate-pop-big flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-round text-[0.74rem] font-bold tabular-nums"
          style={{ background: '#F7E0B0', color: '#9A6B12' }}
        >
          <span aria-hidden>🪙</span>
          {shown.toLocaleString('es-CL')}
        </span>
      </div>

      {/* Segmentos por mes + etiqueta Mes X/8 */}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: meses }).map((_, i) => {
            const filled = i < mes
            const current = i === mes - 1
            const hot = i >= meses - 2 // zona de clímax
            const bg = filled
              ? hot
                ? `linear-gradient(90deg,${CRISIS.face},${CRISIS.edge})`
                : `linear-gradient(90deg,${accent.face},${accent.edge})`
              : '#E6D6B8'
            return (
              <span
                key={i}
                className={`h-2 flex-1 rounded-full ${current ? 'animate-slow-pulse' : ''}`}
                style={{
                  background: bg,
                  boxShadow: current ? `0 0 6px ${hot ? CRISIS.face : accent.face}` : 'none',
                  transition: 'background 0.4s ease',
                }}
              />
            )
          })}
        </div>
        <span className="shrink-0 font-nunito text-[0.66rem] font-extrabold tabular-nums text-ink-mute">
          Mes {mes}/{meses}
        </span>
      </div>

      {/* Guiños contextuales: recta final y Reforma a tiro */}
      {(climax || reformaReady) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {climax && (
            <span
              className="rounded-full px-2 py-0.5 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
              style={{ background: '#FBDAD3', color: CRISIS.edge }}
            >
              🔥 Recta final
            </span>
          )}
          {reformaReady && (
            <span
              className="animate-slow-pulse rounded-full px-2 py-0.5 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
              style={{ background: '#D6F0E5', color: '#1F9A6E' }}
            >
              ⚓ Reforma a tiro
            </span>
          )}
        </div>
      )}
    </div>
  )
}
