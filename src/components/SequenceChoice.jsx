import { useState } from 'react'
import { portraits } from '../assets/portraits.js'

// ─────────────────────────────────────────────────────────────────────────
// SequenceChoice — Fase 3 exclusiva del Episodio 5.
// El jugador arrastra/reordena 4 acciones en la secuencia correcta.
// No hay "elección entre opciones" — hay un orden correcto que descubrir.
//
// Props:
//   episode      — objeto del episodio (contiene episode.sequence)
//   allies       — ids de aliados actuales
//   onChoose     — callback(sequenceResultId, []) al confirmar
//   onConceptSeen — callback para marcar conceptos vistos
// ─────────────────────────────────────────────────────────────────────────

// Evalúa cuántos pasos están en la posición correcta.
function scoreSequence(chosen, correct) {
  return chosen.filter((id, i) => id === correct[i]).length
}

export default function SequenceChoice({ episode, allies, onChoose, onConceptSeen }) {
  const { sequence, sequenceOutcomes, prisoners } = episode
  const prisonersById = Object.fromEntries(prisoners.map((p) => [p.id, p]))

  // Estado del orden actual: empieza mezclado (no en el orden correcto).
  const [ordered, setOrdered] = useState(() => {
    // Orden inicial deliberadamente incorrecto para que el jugador tenga que pensar.
    const shuffled = [...sequence.actions]
    // Rotación simple: mueve el primer elemento al final.
    shuffled.push(shuffled.shift())
    return shuffled
  })

  // Índice arrastrado actualmente (drag-and-drop simplificado con botones).
  const [dragging, setDragging] = useState(null)
  const [confirming, setConfirming] = useState(false)

  // Mueve una acción una posición arriba o abajo.
  function move(idx, dir) {
    const next = [...ordered]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setOrdered(next)
  }

  // Determina el resultado según cuántos pasos están en orden correcto.
  function getOutcome() {
    const correct = scoreSequence(
      ordered.map((a) => a.id),
      sequence.correctOrder,
    )
    if (correct === 4) return sequenceOutcomes.perfect
    if (correct >= 2) return sequenceOutcomes.partial
    return sequenceOutcomes.wrong
  }

  function handleConfirm() {
    const outcome = getOutcome()
    onChoose(outcome.id, [])
  }

  return (
    <div className="grain relative mx-auto max-w-md px-5 py-6">
      <div className="relative z-10">
        <h2 className="font-display text-2xl font-black text-paper">La Secuencia</h2>
        <p className="mt-2 font-body text-[0.88rem] leading-snug text-paper-dim">
          {sequence.intro}
        </p>

        {/* Coalición actual */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {allies.map((id) => {
            const p = prisonersById[id]
            if (!p) return null
            return (
              <span
                key={id}
                className="flex items-center gap-1.5 rounded-sm border border-positive/50 bg-positive/10 py-1 pl-1 pr-2 font-mono text-[0.62rem] text-positive"
              >
                <img src={portraits[id]} alt="" className="h-4 w-4 rounded-full object-cover" />
                {p.name}
              </span>
            )
          })}
        </div>

        {/* Explicación del objetivo */}
        <div className="mt-5 rounded-md border border-paper-dim/40 bg-cell/60 px-4 py-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
            ¿Cómo funciona?
          </p>
          <p className="mt-1.5 font-body text-[0.82rem] leading-snug text-paper/90">
            Ordena las 4 acciones usando las flechas ↑ ↓. Solo existe{' '}
            <span className="text-paper font-semibold">una secuencia correcta</span>. 
            Si aciertas el orden exacto, es el único final feliz del juego.
          </p>
        </div>

        {/* Lista ordenable */}
        <div className="mt-5 space-y-2">
          {ordered.map((action, idx) => (
            <div
              key={action.id}
              className={`flex items-center gap-3 rounded-md border px-4 py-3 transition-all ${
                dragging === idx
                  ? 'border-crisis/70 bg-crisis/15'
                  : 'border-edge bg-cell/80 hover:border-paper-dim'
              }`}
            >
              {/* Número de posición */}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-paper-dim font-display text-sm font-black text-paper">
                {idx + 1}
              </span>

              {/* Icono y texto */}
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold leading-tight text-paper">
                  {action.icon} {action.name}
                </p>
                <p className="mt-0.5 font-body text-[0.74rem] leading-snug text-paper-dim">
                  {action.description}
                </p>
              </div>

              {/* Controles de movimiento */}
              <div className="flex shrink-0 flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  aria-label="Mover arriba"
                  className="flex h-6 w-6 items-center justify-center rounded-sm border border-edge font-mono text-[0.7rem] text-paper-dim transition-colors hover:border-paper hover:text-paper disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === ordered.length - 1}
                  aria-label="Mover abajo"
                  className="flex h-6 w-6 items-center justify-center rounded-sm border border-edge font-mono text-[0.7rem] text-paper-dim transition-colors hover:border-paper hover:text-paper disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de confirmación */}
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-6 w-full rounded-sm border border-crisis bg-crisis/15 px-5 py-3 font-display text-base font-semibold tracking-wide text-paper transition-all hover:bg-crisis/25 active:scale-[0.99]"
        >
          Ejecutar esta secuencia →
        </button>
      </div>

      {/* Modal de confirmación */}
      {confirming && (
        <ConfirmSequence
          ordered={ordered}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

// Modal de confirmación con resumen de la secuencia elegida.
function ConfirmSequence({ ordered, onCancel, onConfirm }) {
  return (
    <div className="animate-fade-in fixed inset-0 z-40 flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-xl border-t border-edge bg-cell p-5 sm:rounded-xl sm:border">
        <h3 className="font-display text-lg font-semibold text-paper">
          Confirmar secuencia
        </h3>
        <p className="mt-2 font-body text-[0.85rem] text-paper/80">
          Esta es tu secuencia final:
        </p>

        {/* Resumen compacto */}
        <ol className="mt-3 space-y-1.5">
          {ordered.map((action, idx) => (
            <li key={action.id} className="flex items-center gap-2 font-mono text-[0.72rem] text-paper">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-paper-dim text-[0.6rem] font-bold text-paper-dim">
                {idx + 1}
              </span>
              {action.icon} {action.name}
            </li>
          ))}
        </ol>

        <p className="mt-4 font-body text-[0.78rem] italic text-paper-dim">
          El orden lo es todo. ¿Seguro?
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-sm border border-edge bg-cell-2 px-4 py-2.5 font-display font-semibold text-paper-dim transition-all hover:text-paper"
          >
            Revisar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-sm border border-crisis bg-crisis/20 px-4 py-2.5 font-display font-semibold text-paper transition-all hover:bg-crisis/30 active:scale-[0.99]"
          >
            Ejecutar →
          </button>
        </div>
      </div>
    </div>
  )
}
