import { episodes } from '../data/episodes/index.js'
import { accentFor } from '../theme/accents.js'
import VersionBadge from './VersionBadge.jsx'
import EpisodeMotif from './EpisodeMotif.jsx'

// ─────────────────────────────────────────────────────────────────────────
// EpisodeSelect — "Mapa de crisis" (rediseño LatAm).
//
// Selector tipo mapa de niveles: un camino de huellas conecta los cinco
// episodios de abajo (ep1) hacia arriba (ep5). Cada nodo es una moneda-acento
// táctil con su viñeta grabada (EpisodeMotif). Reutiliza los datos existentes
// (título, país, año, crisis, bloqueado); el color-acento vive en theme/accents.
// ─────────────────────────────────────────────────────────────────────────

// Posiciones del zig-zag (bottom→top) en % del lienzo del mapa. Índice = ep.
const NODES = [
  { left: 22, top: 85 }, // ep1
  { left: 72, top: 67 }, // ep2
  { left: 30, top: 47 }, // ep3
  { left: 74, top: 27 }, // ep4
  { left: 47, top: 9 }, // ep5
]

// Camino punteado detrás de los nodos (viewBox 360×620 ≈ left*3.6 / top*6.2).
const PATH =
  'M79 527 Q200 475 259 415 Q150 355 108 291 Q205 225 266 167 Q225 105 169 56'

export default function EpisodeSelect({ onSelect, onShowIntro }) {
  const firstPlayable = episodes.find((e) => !e.bloqueado)

  return (
    <div
      className="on-cream relative mx-auto min-h-[100dvh] max-w-md overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #EAF6EC 0%, #FBEFD2 55%, #FCE3C4 100%)',
      }}
    >
      {/* Status bar simulada */}
      <div className="flex items-center justify-between px-6 pt-4">
        <span className="font-round text-[0.8rem] font-semibold text-ink-soft">9:41</span>
        <span className="flex gap-1 text-ink-mute" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-2">
        <h1 className="font-round text-[1.55rem] font-bold tracking-tight text-ink-warm">
          Mapa de crisis
        </h1>
        <span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 shadow-card">
          <span className="coin flex h-4 w-4 items-center justify-center rounded-full text-[0.5rem] font-bold text-[#8A4E12]">
            $
          </span>
          <span className="font-round text-[0.8rem] font-bold tabular-nums text-ink-warm">
            {episodes.length} crisis
          </span>
        </span>
      </header>

      {/* Lienzo del mapa */}
      <div className="relative mx-auto mt-2 h-[560px] w-full">
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
          background:
            'linear-gradient(180deg, rgba(252,227,196,0) 0%, #FCE3C4 55%)',
        }}
      >
        {onShowIntro && (
          <button
            type="button"
            onClick={onShowIntro}
            className="candy candy-soft px-4 py-3.5 text-[0.9rem]"
          >
            ¿Qué es?
          </button>
        )}
        <button
          type="button"
          onClick={() => firstPlayable && onSelect(firstPlayable)}
          className="candy flex-1 px-5 py-3.5 text-[0.98rem]"
          style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
        >
          Jugar {firstPlayable?.paisReferencia.split(',')[0]} →
        </button>
      </div>

      <VersionBadge />
    </div>
  )
}
