import { episodes } from '../data/episodes/index.js'

// Pantalla inicial: selector de episodios. El 1 es jugable; 2-5 están bloqueados
// ("Próximamente") y funcionan como gancho de serie.
export default function EpisodeSelect({ onSelect }) {
  return (
    <div className="grain vignette relative mx-auto min-h-[80vh] max-w-md px-5 py-10">
      <div className="relative z-10">
        <header className="text-center">
          <h1 className="font-display text-4xl font-black tracking-tight text-paper">
            PAICIO
          </h1>
          <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-paper-dim">
            El Ministro Encarcelado
          </p>
          <p className="mx-auto mt-4 max-w-xs font-body text-[0.86rem] italic leading-snug text-paper/80">
            Cinco crisis económicas reales. Un país ficticio. ¿Sobrevives a todas?
          </p>
        </header>

        <div className="mt-8 space-y-3">
          {episodes.map((ep, i) => (
            <button
              key={ep.id}
              type="button"
              disabled={ep.bloqueado}
              onClick={() => !ep.bloqueado && onSelect(ep)}
              title={ep.bloqueado ? 'Próximamente' : undefined}
              className={`animate-fade-up block w-full rounded-md border p-4 text-left transition-all ${
                ep.bloqueado
                  ? 'cursor-not-allowed border-edge bg-cell/30 opacity-60'
                  : 'cursor-pointer border-crisis/60 bg-crisis/10 hover:border-crisis hover:bg-crisis/20 active:scale-[0.99]'
              }`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper-dim">
                    Episodio {ep.numero} · {ep.año} · {ep.paisReferencia}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold leading-tight text-paper">
                    {ep.titulo}
                  </h2>
                  <p className="mt-1 font-body text-[0.8rem] leading-snug text-paper/80">
                    {ep.resumen}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-sm border px-2 py-1 font-mono text-[0.58rem] uppercase tracking-wide ${
                    ep.bloqueado
                      ? 'border-edge text-paper-dim'
                      : 'border-crisis text-crisis'
                  }`}
                >
                  {ep.bloqueado ? '🔒 Próx.' : 'Jugar →'}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[0.56rem] uppercase tracking-[0.2em] text-paper-dim/50">
          Teoría de juegos · Historia económica · Toma de decisiones
        </p>
      </div>
    </div>
  )
}
