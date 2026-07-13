import { useRef, useState } from 'react'
import { sfx } from '../lib/sound.js'
import { accentFor } from '../theme/accents.js'
import ActionIcon from './icons/ActionIcon.jsx'
import { MechanicShell, TopBar, ACTION_PALETTE, GOOD_ACCENT } from './mechanics/candyKit.jsx'
import Coins from './mechanics/Coins.jsx'
import CoachMarks from './CoachMarks.jsx'
import { useTutorial } from '../hooks/useTutorial.js'

// Por qué cada paso va en esa posición (explicación causal).
const WHY_ORDER = {
  urv: {
    pos: 0,
    label: '1°',
    razon: 'La URV crea una referencia de valor estable. Sin ella, cualquier moneda nueva se derrite.',
  },
  migrar: {
    pos: 1,
    label: '2°',
    razon: 'La migración voluntaria desindexa la economía sin decretos. La gente adopta la URV porque le sirve.',
  },
  anclar: {
    pos: 2,
    label: '3°',
    razon: 'El ancla cambiaria da credibilidad. La gente confía en que el nuevo valor no se evaporará mañana.',
  },
  convertir: {
    pos: 3,
    label: '4°',
    razon: 'La conversión es el broche: cuando todo ya está en URV, crear el Real es casi una formalidad.',
  },
}

function scoreSequence(chosen, correct) {
  return chosen.filter((id, i) => id === correct[i]).length
}

export default function SequenceChoice({ episode, onComplete }) {
  const { sequence, outcomes } = episode
  const acc = accentFor(episode.id)

  const [ordered, setOrdered] = useState(() => {
    const shuffled = [...sequence.actions]
    shuffled.push(shuffled.shift())
    return shuffled
  })
  const [confirming, setConfirming] = useState(false)
  const [rainKey, setRainKey] = useState(0)
  // Estado de feedback tras confirmar.
  const [feedback, setFeedback] = useState(null)

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
    // Feedback educativo: mostrar qué posiciones están bien/mal.
    const correct = sequence.correctOrder
    const results = ordered.map((a, i) => ({
      ...a,
      correct: a.id === correct[i],
      correctPos: correct.indexOf(a.id) + 1,
      razon: WHY_ORDER[a.id]?.razon ?? '',
    }))
    setFeedback(results)

    if (outcome.id === 'perfect') {
      sfx('fanfare')
      setRainKey((k) => k + 1)
    } else {
      sfx('advance')
    }
  }

  function cerrarFeedback() {
    setFeedback(null)
    const outcome = getOutcome()
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

      <div className="shadow-card mt-4 rounded-[16px] bg-surface p-3.5">
        <p className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-mute">
          ¿Cómo funciona?
        </p>
        <p className="mt-1 font-nunito text-[0.84rem] leading-snug text-ink-soft">
          Ordena las 4 acciones con las flechas ↑ ↓. La{' '}
          <span className="font-extrabold text-ink-warm">secuencia correcta</span> replica el
          Plan Real de Brasil 1994. Cada paso tiene una razón económica.
        </p>
      </div>

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

      {confirming && !feedback && (
        <ConfirmSequence
          ordered={ordered}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Feedback educativo: qué posiciones fueron correctas y por qué */}
      {feedback && (
        <div className="on-cream animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-[#2A1C0C]/60 px-4 pb-4 backdrop-blur-sm sm:items-center">
          <div className="shadow-panel w-full max-w-md rounded-[24px] bg-panel p-5">
            <h3 className="font-round text-[1.2rem] font-bold text-ink-warm">Tu secuencia</h3>
            <p className="mt-1 font-nunito text-[0.85rem] text-ink-soft">
              Así quedó tu orden. Cada paso tiene su razón económica.
            </p>

            <div className="mt-4 space-y-3">
              {feedback.map((item, i) => (
                <div key={item.id} className="rounded-[14px] bg-surface p-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold text-white ${
                        item.correct ? 'bg-good' : 'bg-crisis-hot'
                      }`}
                    >
                      {item.correct ? '✓' : '✗'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-round text-[0.85rem] font-bold text-ink-warm">
                        {i + 1}. {item.name}
                        {!item.correct && (
                          <span className="ml-1.5 font-nunito text-[0.68rem] font-extrabold text-crisis-hot">
                            (iba en {item.correctPos}°)
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 font-nunito text-[0.75rem] italic leading-snug text-ink-soft">
                        {item.razon}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 font-nunito text-[0.8rem] italic text-ink-mute">
              {getOutcome().id === 'perfect'
                ? 'Cada pieza en su lugar. El Plan Real funciona.'
                : 'La secuencia incorrecta rompe la lógica — igual que pasó con los 5 planes que fallaron en Brasil.'}
            </p>

            <button
              type="button"
              onClick={cerrarFeedback}
              className="candy mt-5 w-full px-5 py-3 text-[0.95rem]"
              style={{ '--face': GOOD_ACCENT.face, '--edge': GOOD_ACCENT.edge }}
            >
              {getOutcome().id === 'perfect' ? '¡Victoria! Ver resultado →' : 'Ver desenlace →'}
            </button>
          </div>
        </div>
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
          ¿Seguro? Después de ejecutar sabrás cuántos acertaste.
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
            Ver resultado →
          </button>
        </div>
      </div>
    </div>
  )
}
