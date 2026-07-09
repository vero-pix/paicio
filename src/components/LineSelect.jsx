import { LINES, visibleLines, prototypesRevealed } from '../data/lines.js'
import { episodes } from '../data/episodes/index.js'
import { accentFor } from '../theme/accents.js'
import Coin from './Coin.jsx'

export default function LineSelect({ onSelect, totalStars }) {
  const lines = visibleLines(prototypesRevealed())
  const unlockedLines = lines.filter(
    (l) => l.unlocked || totalStars >= (l.requires?.stars ?? 0),
  ).length

  return (
    <div
      className="on-cream relative mx-auto min-h-[100dvh] max-w-md overflow-hidden px-5 pb-8"
      style={{
        background:
          'linear-gradient(180deg, #EAF6EC 0%, #FBEFD2 45%, #FCE3C4 100%)',
      }}
    >
      {/* Formas decorativas */}
      <div
        className="pointer-events-none absolute -left-16 -top-12 h-48 w-48 rounded-full opacity-15 blur-3xl"
        style={{ background: '#F5B331' }}
      />
      <div
        className="pointer-events-none absolute -right-10 top-32 h-36 w-36 rounded-full opacity-10 blur-3xl"
        style={{ background: '#4FA3E3' }}
      />
      <div
        className="pointer-events-none absolute bottom-20 left-8 h-28 w-28 rounded-full opacity-10 blur-3xl"
        style={{ background: '#A579E0' }}
      />

      {/* Hero */}
      <div className="relative pt-16 text-center">
        <Coin size={96} bob className="mx-auto" />
        <h1 className="mt-5 font-round text-[2.8rem] font-bold leading-none tracking-tight text-ink-warm">
          PAICIO
        </h1>
        <p className="mt-1 font-nunito text-[0.86rem] font-bold text-ink-mute">
          economía que se juega, no se estudia
        </p>
        <div className="mt-4 flex items-center justify-center gap-1.5">
          <span className="text-[1.2rem]" aria-hidden>
            ⭐
          </span>
          <span className="font-round text-[1.2rem] font-bold tabular-nums text-ink-warm">
            {totalStars}
          </span>
          <span className="font-nunito text-[0.75rem] font-bold text-ink-mute">
            estrellas · {unlockedLines}/{lines.length} líneas
          </span>
        </div>
      </div>

      {/* Divisor decorativo */}
      <div className="relative mx-auto mb-5 mt-8 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #E4CE9E)' }} />
        <span className="font-round text-[0.7rem] font-bold tracking-widest text-ink-mute/60">
          ELIGE TU LÍNEA
        </span>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #E4CE9E, transparent)' }} />
      </div>

      {/* Tarjetas de líneas */}
      <div className="relative space-y-4">
        {lines.map((line, i) => {
          const locked = line.requires && totalStars < line.requires.stars
          const starsNeeded = line.requires ? line.requires.stars - totalStars : 0
          const lineEpisodes = episodes.filter((e) => e.line === line.id)
          const completed = lineEpisodes.filter((e) => !e.bloqueado).length

          return (
            <button
              key={line.id}
              type="button"
              disabled={locked}
              onClick={() => !locked && onSelect(line.id)}
              className="candy relative w-full overflow-hidden p-5 text-left transition-transform active:scale-[0.98]"
              style={{
                animation: `fade-up 0.5s ease-out ${i * 0.15}s both`,
                '--face': locked ? '#E0D4C8' : '#FFFFFF',
                '--edge': locked ? '#C4B8AC' : '#E0D4C8',
              }}
            >
              {/* Barra de color superior */}
              <div
                className="absolute left-0 top-0 h-1.5 w-full"
                style={{
                  background: locked
                    ? '#C4B8AC'
                    : `linear-gradient(90deg, ${line.gradient[0]}, ${line.gradient[1]})`,
                }}
              />

              {locked && (
                <span
                  className="absolute right-4 top-4 text-[1.4rem]"
                  aria-hidden
                >
                  🔒
                </span>
              )}

              <div className="mt-1 flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] text-[1.8rem]"
                  style={{
                    background: locked
                      ? '#F0E8DC'
                      : `linear-gradient(135deg, ${line.gradient[0]}, ${line.gradient[1]})`,
                  }}
                >
                  {line.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-round text-[1.15rem] font-bold text-ink-warm">
                    {line.name}
                  </h2>
                  <p className="font-nunito text-[0.82rem] font-semibold text-ink-soft">
                    {line.subtitle}
                  </p>
                </div>
              </div>

              <p className="mt-2 font-nunito text-[0.76rem] leading-snug text-ink-mute line-clamp-2">
                {line.desc}
              </p>

              {/* Footer de la tarjeta */}
              <div className="mt-3 flex items-center justify-between">
                {locked ? (
                  <span className="font-nunito text-[0.7rem] font-extrabold text-crisis-hot">
                    🔒 Desbloquea con {starsNeeded} ⭐ más
                  </span>
                ) : (
                  <span className="font-nunito text-[0.7rem] font-bold text-ink-mute">
                    {completed}/{lineEpisodes.length} episodios
                  </span>
                )}
                {!locked && (
                  <span className="font-round text-[0.75rem] font-bold text-ink-soft">
                    Explorar →
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
