import { useState } from 'react'
import { accentFor } from '../theme/accents.js'
import { lineFor } from '../data/lines.js'
import EpisodeMotif from './EpisodeMotif.jsx'
import DailyPanel from './DailyPanel.jsx'

// ─────────────────────────────────────────────────────────────────────────
// EpisodeSelect — "Mapa de crisis" por línea.
//
// Recibe `episodes` filtrados por línea y `onBack` para volver al selector
// de líneas. Las posiciones y el SVG se adaptan automáticamente a la
// cantidad de episodios. Máximo 7 episodios (si crece, se escala).
// ─────────────────────────────────────────────────────────────────────────

// Posiciones del zig-zag (bottom→top) para N episodios.
// LÍMITE: soporta hasta 7 nodos (Crisis está justo en 7). Con más de 7 en una
// línea, este `Math.min(count, 7)` deja sin posición a los extras y en el render
// caen al centro (fallback {50,50}), encimándose. Si alguna línea va a crecer
// por encima de 7, hay que reemplazar esta tabla por un layout generativo
// (zig-zag paramétrico + path derivado), no agregar otro bloque a mano.
function positionsFor(count) {
  const total = Math.min(count, 7)
  // `patterns` es triangular: primero el bloque de 1 nodo, luego el de 2, el de
  // 3… Para `total` nodos hay que saltar los bloques anteriores (1+2+…+(total-1))
  // y tomar los `total` siguientes. offset = total·(total-1)/2.
  const offset = (total * (total - 1)) / 2
  const patterns = [
    { left: 47, top: 88 }, // 1 nodo
    { left: 25, top: 78 }, { left: 72, top: 35 }, // 2 nodos
    { left: 25, top: 82 }, { left: 72, top: 48 }, { left: 47, top: 14 }, // 3
    { left: 25, top: 84 }, { left: 72, top: 60 }, { left: 25, top: 36 }, { left: 72, top: 12 }, // 4
    { left: 25, top: 85 }, { left: 72, top: 67 }, { left: 30, top: 47 }, { left: 74, top: 27 }, { left: 47, top: 9 }, // 5 (original)
    { left: 50, top: 88 }, { left: 25, top: 74 }, { left: 72, top: 60 }, { left: 30, top: 46 }, { left: 73, top: 32 }, { left: 47, top: 18 }, // 6
    { left: 50, top: 90 }, { left: 25, top: 77 }, { left: 72, top: 64 }, { left: 30, top: 51 }, { left: 73, top: 38 }, { left: 47, top: 25 }, { left: 72, top: 12 }, // 7
  ]
  return patterns.slice(offset, offset + total)
}

// Path SVG para N episodios.
function pathFor(count) {
  const paths = {
    1: 'M169 546',
    2: 'M90 484 Q200 400 259 217',
    3: 'M90 508 Q180 460 259 298 Q150 250 169 87',
    4: 'M90 521 Q180 480 259 372 Q130 320 90 223 Q200 170 259 74',
    5: 'M79 527 Q200 475 259 415 Q150 355 108 291 Q205 225 266 167 Q225 105 169 56',
    6: 'M180 546 Q130 520 79 459 Q200 410 259 372 Q150 315 108 285 Q225 245 266 198 Q225 145 169 112',
    7: 'M180 558 Q130 535 79 477 Q200 430 259 397 Q150 340 108 316 Q205 265 266 236 Q225 180 169 155 Q200 115 259 74',
  }
  return paths[count] ?? paths[5]
}

export default function EpisodeSelect({ line, episodes, onSelect, onShowIntro, onStartDaily, onBack }) {
  const [showDaily, setShowDaily] = useState(false)
  const NODES = positionsFor(episodes.length)
  const PATH = pathFor(episodes.length)
  const firstPlayable = episodes.find((e) => !e.bloqueado) ?? null
  const lineInfo = line ? lineFor(line) : null

  return (
    <div
      className="on-cream relative mx-auto min-h-[100dvh] max-w-md overflow-hidden"
      style={{
        background: lineInfo
          ? `linear-gradient(180deg, ${lineInfo.gradient[0]} 0%, ${lineInfo.gradient[1]} 55%, ${lineInfo.gradient[2]} 100%)`
          : 'linear-gradient(180deg, #EAF6EC 0%, #FBEFD2 55%, #FCE3C4 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="candy candy-soft px-3 py-2 text-[0.8rem]"
            >
              ←
            </button>
          )}
          <span className="font-round text-[0.8rem] font-semibold text-ink-soft">9:41</span>
        </div>
        <span className="flex gap-1 text-ink-mute" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      </div>

      {/* Header info */}
      <header className="flex items-center justify-between px-6 pt-2">
        <div>
          <h1 className="font-round text-[1.55rem] font-bold tracking-tight text-ink-warm">
            {lineInfo?.name ?? 'Mapa de crisis'}
          </h1>
          {lineInfo && (
            <p className="font-nunito text-[0.72rem] font-bold text-ink-mute">
              {lineInfo.icon} {lineInfo.subtitle}
            </p>
          )}
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-card">
          <span className="coin flex h-4 w-4 items-center justify-center rounded-full text-[0.5rem] font-bold text-[#8A4E12]">
            $
          </span>
          <span className="font-round text-[0.8rem] font-bold tabular-nums text-ink-warm">
            {episodes.length} episodios
          </span>
        </span>
      </header>

      {/* Lienzo del mapa */}
      <div className="relative mx-auto mt-2 h-[640px] w-full">
        <svg
          viewBox="0 0 360 620"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <path
            d={PATH}
            fill="none"
            stroke="#E8CE9A"
            strokeWidth="12"
            strokeDasharray="2 20"
            strokeLinecap="round"
          />
        </svg>

        {episodes.map((ep, i) => {
          const pos = NODES[i] ?? { left: 50, top: 50 }
          const a = accentFor(ep.id)
          const locked = ep.bloqueado
          const suggested = ep.id === firstPlayable?.id
          const labelRight = pos.left < 50
          const size = suggested ? 84 : 68

          return (
            <div
              key={ep.id}
              className="absolute flex items-center gap-2.5"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: 'translate(-50%, -50%)',
                flexDirection: labelRight ? 'row' : 'row-reverse',
              }}
            >
              {/* Nodo */}
              <div className="relative shrink-0" style={{ width: size, height: size }}>
                {suggested && !locked && (
                  <span
                    className="animate-ring pointer-events-none absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 0 4px ${a.face}` }}
                    aria-hidden
                  />
                )}
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => !locked && onSelect(ep)}
                  title={locked ? 'Próximamente' : ep.titulo}
                  className="candy relative flex h-full w-full flex-col items-center justify-center border-white text-white"
                  style={{
                    '--face': locked ? '#EBDCC0' : a.face,
                    '--edge': locked ? '#CDBB98' : a.edge,
                    borderWidth: suggested ? 5 : 4,
                    borderRadius: '9999px',
                  }}
                >
                  {locked ? (
                    <span className="text-[1.4rem]" aria-hidden>
                      🔒
                    </span>
                  ) : suggested ? (
                    <>
                      <span className="font-round text-[1.7rem] font-bold leading-none">
                        {ep.numero}
                      </span>
                      <span className="mt-0.5 rounded-full bg-white/25 px-1.5 text-[0.5rem] font-extrabold uppercase tracking-wide">
                        Jugar
                      </span>
                    </>
                  ) : (
                    <EpisodeMotif id={ep.id} className="h-8 w-8 text-white" />
                  )}
                </button>
              </div>

              {/* Etiqueta */}
              <div
                className={`min-w-0 max-w-[120px] ${labelRight ? 'text-left' : 'text-right'}`}
              >
                <p
                  className={`font-round text-[0.82rem] font-bold leading-tight ${
                    locked ? 'text-ink-mute' : 'text-ink-warm'
                  }`}
                >
                  {ep.paisReferencia.split(',')[0]} {ep.año}
                </p>
                <p
                  className="font-nunito text-[0.7rem] font-bold leading-tight"
                  style={{ color: locked ? '#B79A63' : a.edge }}
                >
                  {ep.crisisHistorica.length > 26
                    ? ep.titulo
                    : ep.crisisHistorica}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Barra inferior */}
      <div
        className="sticky bottom-0 mt-2 flex items-center gap-3 px-6 pb-6 pt-4"
        style={{
          background: 'linear-gradient(180deg, rgba(252,227,196,0) 0%, #FCE3C4 55%)',
        }}
      >
        {onShowIntro && (
          <button
            type="button"
            onClick={onShowIntro}
            aria-label="¿Qué es PAICIO?"
            className="candy candy-soft px-4 py-3.5 text-[0.9rem]"
          >
            ¿Qué es?
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowDaily(true)}
          aria-label="Reto Diario"
          title="Reto Diario"
          className="candy candy-soft px-4 py-3.5 text-[0.9rem]"
        >
          🗓️ Reto
        </button>
        <button
          type="button"
          onClick={() => firstPlayable && onSelect(firstPlayable)}
          className="candy flex-1 px-5 py-3.5 text-[0.98rem]"
          style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
        >
          Jugar {firstPlayable?.paisReferencia.split(',')[0]} →
        </button>
      </div>

      {showDaily && (
        <DailyPanel
          onPlay={(ep, iso) => onStartDaily?.(ep, iso)}
          onClose={() => setShowDaily(false)}
        />
      )}
    </div>
  )
}
