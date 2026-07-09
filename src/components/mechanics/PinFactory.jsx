import { useState, useMemo } from 'react'
import { sfx } from '../../lib/sound.js'
import { accentFor } from '../../theme/accents.js'
import { MechanicShell, TopBar, EndPanel } from './candyKit.jsx'
import { initPinFactory, STEPS, playStep, isOver, outcomeTier } from '../../utils/pinFactory.js'

// ─────────────────────────────────────────────────────────────────────────
// PinFactory — demostración interactiva de la división del trabajo.
//
// Adam Smith guía al jugador a través de 7 pasos. Cada paso presenta una
// pregunta sobre cómo organizar la fábrica. El output (alfileres/día) es
// el score. No hay fracaso catastrófico — es educativo.
// ─────────────────────────────────────────────────────────────────────────

function SmithQuote({ text, accent }) {
  return (
    <div className="animate-fade-up mt-3 flex items-start gap-3">
      <span className="coin shrink-0 rounded-full p-[3px]">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-[1.2rem] font-bold"
          style={{ background: accent.soft, color: accent.edge }}
        >
          AS
        </span>
      </span>
      <div
        className="min-w-0 flex-1 rounded-[16px] rounded-tl-[5px] bg-surface p-3 shadow-card"
        style={{ borderLeft: `3px solid ${accent.face}` }}
      >
        <p className="font-round text-[0.78rem] font-bold" style={{ color: accent.edge }}>
          Adam Smith
        </p>
        <p className="mt-0.5 font-nunito text-[0.88rem] leading-snug italic text-ink-soft">
          {text}
        </p>
      </div>
    </div>
  )
}

function OutputCounter({ output }) {
  return (
    <div className="mt-3 flex items-center justify-center gap-3 rounded-[16px] bg-surface/80 p-3 shadow-card">
      <span className="text-[1.4rem]">📌</span>
      <span className="text-center">
        <span className="font-round text-[1.8rem] font-bold tabular-nums text-ink-warm">
          {output.toLocaleString()}
        </span>
        <span className="ml-1.5 font-nunito text-[0.75rem] font-bold text-ink-mute">
          alfileres/día
        </span>
      </span>
    </div>
  )
}

export default function PinFactory({ episode, onComplete }) {
  const cfg = useMemo(() => episode.pinFactory, [episode])
  const acc = accentFor(episode.id)

  const [state, setState] = useState(() => initPinFactory(cfg))
  // `pending` guarda la elección + el estado resultante para MOSTRAR la
  // consecuencia (reacción de Smith + producción nueva) y esperar un "Continuar"
  // explícito. Sin auto-avance: eliges → lees → Continuar (patrón del resto).
  const [pending, setPending] = useState(null)
  const over = isOver(state, cfg)

  const pasoActual = STEPS[state.paso - 1]
  const tier = over ? outcomeTier(state, cfg) : null

  function elegir(choice) {
    if (pending || over) return
    sfx('click')
    setPending({ choice, next: playStep(state, cfg, choice) })
  }

  function continuar() {
    if (!pending) return
    sfx('click')
    const next = pending.next
    setPending(null)
    setState(next)
  }

  return (
    <MechanicShell tint="linear-gradient(180deg,#F0E6FF,#E0D4F5)">
      <TopBar
        title="La Fábrica de Alfileres"
        crisis="Adam Smith · 1776"
        accent={acc}
        pill={over ? 'Fin' : `Paso ${state.paso}/${STEPS.length}`}
      />

      <OutputCounter output={pending ? pending.next.output : state.output} />

      {over ? (
        <EndPanel
          text={
            state.maxOutput >= 48000
              ? '¡Smith queda maravillado! Tu fábrica produce 48.000 alfileres al día — 240 veces más que al principio. La división del trabajo en su máxima expresión.'
              : state.maxOutput >= 20000
                ? 'Smith asiente, satisfecho. Tu fábrica produce mucho más que al principio, pero no alcanzaste el potencial máximo. "La próxima vez", dice, "intentad la división total del trabajo".'
                : 'Smith se va cortés pero decepcionado. Sin división del trabajo, la fábrica produce lo mismo que cualquier taller común.'
          }
          onComplete={() => onComplete(tier, { score: state.maxOutput })}
        />
      ) : (
        <>
          {/* La pregunta de Smith */}
          <SmithQuote text={pasoActual.smithQuote} accent={acc} />

          {/* Descripción de la situación */}
          <div className="animate-fade-up mt-4 rounded-[16px] bg-panel/60 p-3.5">
            <p className="font-nunito text-[0.88rem] leading-snug text-ink-soft">
              {pasoActual.setup}
            </p>
          </div>

          {/* Opciones (ocultas mientras lees el resultado) */}
          {!pending && (
            <div className="mt-4 space-y-2.5">
              {pasoActual.choices.map((choice, i) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => elegir(choice)}
                  className="candy w-full p-3.5 text-left"
                  style={{
                    '--face': i === 0 ? acc.soft : acc.face,
                    '--edge': i === 0 ? acc.soft : acc.edge,
                    color: i === 0 ? acc.edge : '#fff',
                  }}
                >
                  <span className="font-round text-[0.95rem] font-bold leading-tight">
                    {choice.label}
                  </span>
                  <span className="mt-1 block font-nunito text-[0.78rem] leading-snug text-inherit opacity-85">
                    {choice.text}
                  </span>
                  {choice.outputFinal && (
                    <span className="mt-1.5 inline-block rounded-full bg-white/20 px-2 py-0.5 font-nunito text-[0.6rem] font-extrabold text-white">
                      {choice.outputFinal.toLocaleString()} 📌/día
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Resultado de la elección — se lee y se avanza con "Continuar" */}
          {pending && (
            <div className="animate-fade-up mt-4">
              <div className="rounded-[16px] bg-surface p-3.5 shadow-card">
                <p className="font-nunito text-[0.78rem] font-bold" style={{ color: acc.edge }}>
                  ✦ Elegiste: {pending.choice.label}
                </p>
                <p className="mt-1.5 font-nunito text-[0.85rem] italic leading-snug text-ink-soft">
                  {pending.choice.smithReaction}
                </p>
                <div className="mt-2.5 flex items-baseline gap-2 border-t border-ink-mute/15 pt-2.5">
                  <span className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-mute">
                    Producción
                  </span>
                  <span className="font-round text-[1.3rem] font-bold tabular-nums" style={{ color: acc.edge }}>
                    {pending.next.output.toLocaleString()}
                  </span>
                  <span className="font-nunito text-[0.65rem] font-bold text-ink-mute">
                    alfileres/día
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={continuar}
                className="candy mt-3 w-full px-5 py-3.5 text-[1rem]"
                style={{ '--face': acc.face, '--edge': acc.edge }}
              >
                {isOver(pending.next, cfg) ? 'Ver resultado →' : 'Continuar →'}
              </button>
            </div>
          )}
        </>
      )}
    </MechanicShell>
  )
}
