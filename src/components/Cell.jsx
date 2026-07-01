import { useEffect, useState } from 'react'
import { sfx } from '../lib/sound.js'

// Fase 1: la celda. Periódico en el suelo con el titular de la crisis,
// narración en primera persona, y el botón para comenzar a negociar.
//
// Variante `startsAtTop` (Episodio 3):
//   El jugador empieza en la cima — el periódico muestra el éxito pasado,
//   no la crisis. La narración revela el colapso que viene.
export default function Cell({ episode, onStart }) {
  const [evaluating, setEvaluating] = useState(false)
  const { newspaper, startsAtTop } = episode

  // Impacto de "periódico" al cargar la pantalla del Heraldo.
  useEffect(() => {
    sfx('newspaper')
  }, [])

  // Ep3: el titular muestra éxito pero la narración revela el colapso.
  // El botón inicial dice "Revisar los números" en vez de "Evaluar situación".
  const evalLabel = startsAtTop ? 'Revisar los números →' : 'Evaluar situación'
  const startLabel = startsAtTop ? 'Empezar a negociar →' : 'Empezar a negociar →'

  return (
    <div className="grain vignette relative mx-auto min-h-[70vh] max-w-md px-5 py-8">
      <div className="relative z-10">
        {/* Periódico en el suelo */}
        <div
          className={`animate-fade-up rounded-sm border border-edge bg-paper px-4 py-4 text-ink shadow-2xl shadow-black/60 ${
            startsAtTop ? 'rotate-[1deg]' : 'rotate-[-1.5deg]'
          }`}
        >
          <div className="flex items-center justify-between border-b-2 border-ink pb-1">
            <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em]">
              {newspaper.name}
            </span>
            <span className="font-mono text-[0.6rem]">{newspaper.number}</span>
          </div>
          <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-ink/70">
            {newspaper.dateline}
          </p>
          {/* Ep3: titular de éxito en verde positivo; resto en rojo crisis */}
          <h1
            className={`mt-2 font-display text-xl font-black leading-tight ${
              startsAtTop && !evaluating ? 'text-positive' : 'text-crisis'
            }`}
          >
            {newspaper.headline}
          </h1>
          <p className="mt-2 border-t border-ink/30 pt-2 font-body text-[0.8rem] italic leading-snug text-ink/80">
            {newspaper.subhead}
          </p>
        </div>

        {/* Narración */}
        <div className="mt-7">
          {!evaluating ? (
            <div className="animate-fade-in space-y-1">
              {episode.opening.map((line, i) =>
                line === '' ? (
                  <div key={i} className="h-3" />
                ) : (
                  <p
                    key={i}
                    className="animate-fade-up font-body text-[0.95rem] leading-relaxed text-paper"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    {line}
                  </p>
                ),
              )}
            </div>
          ) : (
            <div className="animate-fade-in space-y-3">
              {episode.cellNarration.map((line, i) => (
                <p
                  key={i}
                  className="animate-fade-up font-body text-[0.92rem] leading-relaxed text-paper"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Acción */}
        <div className="mt-8">
          {!evaluating ? (
            <button
              type="button"
              onClick={() => setEvaluating(true)}
              className="w-full rounded-sm border border-paper-dim bg-cell px-5 py-3 font-display text-base font-semibold tracking-wide text-paper transition-all hover:border-paper hover:bg-cell-2 active:scale-[0.99]"
            >
              {evalLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="w-full rounded-sm border border-crisis bg-crisis/15 px-5 py-3 font-display text-base font-semibold tracking-wide text-paper transition-all hover:bg-crisis/25 active:scale-[0.99]"
            >
              {startLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
