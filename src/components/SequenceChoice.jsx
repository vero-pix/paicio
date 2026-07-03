import { useRef, useState } from 'react'
import { sfx } from '../lib/sound.js'
import { accentFor } from '../theme/accents.js'
import ActionIcon from './icons/ActionIcon.jsx'
import { MechanicShell, TopBar, ACTION_PALETTE, GOOD_ACCENT } from './mechanics/candyKit.jsx'
import Coins from './mechanics/Coins.jsx'
import CoachMarks from './CoachMarks.jsx'
import { useTutorial } from '../hooks/useTutorial.js'

// ─────────────────────────────────────────────────────────────────────────
// SequenceChoice — Fase 3 exclusiva del Episodio 5 (Plan Real).
// El jugador reordena 4 acciones hasta la secuencia correcta. No hay medidores
// ni cifra hero: es un puzzle de orden. Rediseño LatAm en tarjetas candy claras.
// Misma lógica (orden inicial mezclado, score por posiciones correctas).
// ─────────────────────────────────────────────────────────────────────────

function scoreSequence(chosen, correct) {
  return chosen.filter((id, i) => id === correct[i]).length
}

export default function SequenceChoice({ episode, onComplete }) {
  const { sequence, outcomes } = episode
  const acc = accentFor(episode.id)

  const [ordered, setOrdered] = useState(() => {
    const shuffled = [...sequence.actions]
    shuffled.push(shuffled.shift()) // arranca deliberadamente desordenado
    return shuffled
  })
  const [confirming, setConfirming] = useState(false)
  const [rainKey, setRainKey] = useState(0)

  // Onboarding: un solo coach que resalta la lista ordenable (una vez).
  const listRef = useRef(null)
  const tut = useTutorial(episode.id, {
    refByTarget: { list: listRef },
    over: false,
    pendingEvent: null,
    firstTurnActive: false,
  })

  function move(idx, dir) {
    const next = [...ordered]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    sfx('click')
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setOrdered(next)
  }

  function getOutcome() {
    const correct = scoreSequence(
      ordered.map((a) => a.id),
      sequence.correctOrder,
    )
    if (correct === 4) return outcomes.perfect
    if (correct >= 2) return outcomes.partial
    return outcomes.wrong
  }

  function handleConfirm() {
    const outcome = getOutcome()
    // Jugo de recompensa proporcional al acierto: lluvia + fanfarria si es el
    // final feliz, avance simple si no.
    if (outcome.id === 'perfect') {
      sfx('fanfare')
      setRainKey((k) => k + 1)
    } else {
      sfx('advance')
    }
    onComplete(outcome.id)
  }

  return (
    <MechanicShell tint={`linear-gradient(180deg,${acc.soft},#FBE6C2)`}>
      <TopBar
        title="La Secuencia"
        crisis="El Plan Real"
        accent={acc}
        pill={`${ordered.length} pasos`}
      />

      {/* Cómo funciona */}
      <div className="shadow-card mt-4 rounded-[16px] bg-surface p-3.5">
        <p className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-wide text-ink-mute">
          ¿Cómo funciona?
        </p>
        <p className="mt-1 font-nunito text-[0.84rem] leading-snug text-ink-soft">
          Ordena las 4 acciones con las flechas ↑ ↓. Solo existe{' '}
          <span className="font-extrabold text-ink-warm">una secuencia correcta</span>: si
          aciertas el orden exacto, es el único final feliz del juego.
        </p>
      </div>

      {/* Lista ordenable */}
      <div ref={listRef} className="mt-4 space-y-2.5">
        {ordered.map((action, idx) => {
          const pal = ACTION_PALETTE[idx % ACTION_PALETTE.length]
          return (
            <div
              key={action.id}
              style={{ animationDelay: `${idx * 0.07}s` }}
              className="animate-fade-up shadow-card flex items-center gap-3 rounded-[16px] bg-surface p-3"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] font-round text-[1.05rem] font-bold text-white"
                style={{ background: pal.face, boxShadow: `0 3px 0 ${pal.edge}` }}
              >
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-round text-[0.9rem] font-bold leading-tight text-ink-warm">
                  <span style={{ color: pal.face }} className="flex shrink-0">
                    <ActionIcon id={action.id} className="h-4 w-4" />
                  </span>
                  {action.name}
                </p>
                <p className="mt-0.5 font-nunito text-[0.74rem] leading-snug text-ink-soft">
                  {action.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  aria-label="Mover arriba"
                  className="candy candy-soft flex h-7 w-7 items-center justify-center text-[0.9rem]"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === ordered.length - 1}
                  aria-label="Mover abajo"
                  className="candy candy-soft flex h-7 w-7 items-center justify-center text-[0.9rem]"
                >
                  ↓
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="candy mt-6 w-full px-5 py-3.5 text-[1rem]"
        style={{ '--face': GOOD_ACCENT.face, '--edge': GOOD_ACCENT.edge }}
      >
        Ejecutar esta secuencia →
      </button>

      {confirming && (
        <ConfirmSequence
          ordered={ordered}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirm}
        />
      )}

      <Coins runKey={rainKey} mode="rain" count={30} />

      {tut.showMainCoach && (
        <CoachMarks
          steps={tut.mainSteps}
          accent={acc}
          onDone={tut.onMainDone}
          onSkip={tut.onSkip}
        />
      )}
    </MechanicShell>
  )
}

// Modal de confirmación con el resumen del orden elegido.
function ConfirmSequence({ ordered, onCancel, onConfirm }) {
  return (
    <div className="on-cream animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-[#2A1C0C]/60 px-4 pb-4 backdrop-blur-sm sm:items-center">
      <div className="shadow-panel w-full max-w-md rounded-[24px] bg-panel p-5">
        <h3 className="font-round text-[1.2rem] font-bold text-ink-warm">Confirmar secuencia</h3>
        <p className="mt-1 font-nunito text-[0.85rem] text-ink-soft">Esta es tu secuencia final:</p>

        <ol className="mt-3 space-y-1.5">
          {ordered.map((action, idx) => (
            <li key={action.id} className="flex items-center gap-2 font-nunito text-[0.8rem] font-bold text-ink-warm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream font-round text-[0.62rem] font-bold text-ink-soft">
                {idx + 1}
              </span>
              <ActionIcon id={action.id} className="h-3.5 w-3.5 shrink-0 text-ink-mute" />
              {action.name}
            </li>
          ))}
        </ol>

        <p className="mt-4 font-nunito text-[0.8rem] italic text-ink-mute">
          El orden lo es todo. ¿Seguro?
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="candy candy-soft px-5 py-3 text-[0.92rem]"
          >
            Revisar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="candy flex-1 px-5 py-3 text-[0.95rem]"
            style={{ '--face': GOOD_ACCENT.face, '--edge': GOOD_ACCENT.edge }}
          >
            Ejecutar →
          </button>
        </div>
      </div>
    </div>
  )
}
