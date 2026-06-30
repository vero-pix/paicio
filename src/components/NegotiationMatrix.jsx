import { useMemo, useState } from 'react'
import {
  buildMatrix,
  prisonerDecision,
  resolveRound,
  equilibriumLesson,
} from '../utils/prisonersDilemma.js'
import EducationalTooltip from './EducationalTooltip.jsx'
import { portraits } from '../assets/portraits.js'

// Matriz 2x2 del Dilema del Prisionero. El jugador elige COOPERAR o TRAICIONAR;
// el prisionero responde según su función de utilidad. Se muestra el resultado,
// el equilibrio alcanzado y una lección de 2 líneas.
export default function NegotiationMatrix({
  prisoner,
  trust,
  history,
  turn,
  onResolve,
  onConceptSeen,
  onClose,
}) {
  const matrix = useMemo(() => buildMatrix(prisoner, turn), [prisoner, turn])
  const [result, setResult] = useState(null)
  const [moves, setMoves] = useState(null)

  function play(playerMove) {
    const prisonerMove = prisonerDecision(prisoner, { trust, history })
    const r = resolveRound(matrix, playerMove, prisonerMove)
    setMoves({ playerMove, prisonerMove })
    setResult(r)
  }

  // Resalta la celda correspondiente al resultado.
  function cellCls(key) {
    const active = result && result.key === key
    return `border border-edge px-2 py-3 text-center transition-colors ${
      active ? 'bg-crisis/25 ring-1 ring-crisis' : 'bg-cell-2/60'
    }`
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-40 flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center">
      <div className="grain relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-xl border-t border-edge bg-cell p-5 shadow-2xl shadow-black/70 sm:rounded-xl sm:border">
        <div className="relative z-10">
          {/* Cabecera */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="block h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 bg-ink/60"
                style={{ borderColor: prisoner.accent, boxShadow: `0 0 0 1px ${prisoner.accent}33` }}
                aria-hidden
              >
                <img
                  src={portraits[prisoner.id]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold leading-tight text-paper">
                  {prisoner.name}
                </h3>
                <p className="font-body text-[0.78rem] italic text-paper-dim">
                  {prisoner.utility}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="font-mono text-paper-dim hover:text-paper"
            >
              ✕
            </button>
          </div>

          {/* Matriz */}
          <div className="mt-5">
            <p className="mb-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
              Matriz de pago (Prisionero, Tú)
            </p>
            <div className="grid grid-cols-[auto_1fr_1fr] gap-1 font-mono text-sm">
              <div />
              <div className="px-1 py-1 text-center text-[0.62rem] uppercase leading-tight text-paper-dim">
                Tú cooperas
              </div>
              <div className="px-1 py-1 text-center text-[0.62rem] uppercase leading-tight text-paper-dim">
                Tú traicionas
              </div>

              <div className="flex items-center px-1 text-right text-[0.62rem] uppercase leading-tight text-paper-dim">
                {prisoner.gender === 'f' ? 'Ella' : 'Él'} coopera
              </div>
              <div className={cellCls('CC')}>
                <Payoff v={matrix.CC} />
              </div>
              <div className={cellCls('CT')}>
                <Payoff v={matrix.CT} />
              </div>

              <div className="flex items-center px-1 text-right text-[0.62rem] uppercase leading-tight text-paper-dim">
                {prisoner.gender === 'f' ? 'Ella' : 'Él'} traiciona
              </div>
              <div className={cellCls('TC')}>
                <Payoff v={matrix.TC} />
              </div>
              <div className={cellCls('TT')}>
                <Payoff v={matrix.TT} />
              </div>
            </div>

            {/* Leyenda: qué significan los números */}
            <p className="mt-3 text-center font-body text-[0.74rem] leading-snug text-paper-dim">
              Cada par son los puntos que gana{' '}
              <span className="text-paper">(el prisionero, tú)</span>. Más alto es
              mejor: <span className="text-paper">5</span> = te sales con la tuya ·{' '}
              <span className="text-paper">3</span> = ganan los dos ·{' '}
              <span className="text-paper">1</span> = pierden los dos ·{' '}
              <span className="text-paper">0</span> = te dejan afuera.
            </p>

            {/* Nota sobre el Equilibrio de Nash */}
            <div className="mt-3 rounded-sm border border-crisis/40 bg-crisis/10 px-3 py-2.5">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-crisis/80">
                ⚠ Equilibrio de Nash
              </p>
              <p className="mt-1 font-body text-[0.74rem] leading-snug text-paper/80">
                La celda{' '}
                <span className="rounded-sm bg-crisis/25 px-1 font-mono font-bold text-paper">
                  (1,1)
                </span>{' '}
                —cuando los dos traicionan— es el <em>equilibrio de Nash</em>: ninguno
                gana cambiando solo su jugada. Ambos terminan peor que cooperando (3,3),
                pero ninguno se atreve a confiar primero.
              </p>
            </div>
          </div>

          {/* Acciones o resultado */}
          {!result ? (
            <div className="mt-6">
              <p className="mb-3 text-center font-body text-[0.85rem] text-paper/90">
                ¿Cómo te presentas ante {prisoner.name.split(' ')[1] || prisoner.name}?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => play('cooperate')}
                  className="rounded-sm border border-positive/70 bg-positive/10 px-3 py-3 font-display font-semibold text-paper transition-all hover:bg-positive/20 active:scale-[0.98]"
                >
                  Cooperar
                </button>
                <button
                  type="button"
                  onClick={() => play('betray')}
                  className="rounded-sm border border-crisis/70 bg-crisis/10 px-3 py-3 font-display font-semibold text-paper transition-all hover:bg-crisis/20 active:scale-[0.98]"
                >
                  Traicionar
                </button>
              </div>
            </div>
          ) : (
            <Result
              prisoner={prisoner}
              result={result}
              moves={moves}
              onConceptSeen={onConceptSeen}
              onContinue={() => onResolve(result, moves.playerMove)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Payoff({ v }) {
  return (
    <span className="tabular-nums text-paper">
      ({v[0]}, {v[1]})
    </span>
  )
}

function Result({ prisoner, result, moves, onConceptSeen, onContinue }) {
  const voice = result.allied ? prisoner.voice.cooperate : prisoner.voice.betrayed
  return (
    <div className="animate-fade-up mt-6 border-t border-edge pt-4">
      <p className="font-mono text-[0.62rem] uppercase tracking-wide text-paper-dim">
        {moves.prisonerMove === 'cooperate'
          ? `${prisoner.gender === 'f' ? 'Ella' : 'Él'} cooperó`
          : `${prisoner.gender === 'f' ? 'Ella' : 'Él'} traicionó`} ·{' '}
        {moves.playerMove === 'cooperate' ? 'tú cooperaste' : 'tú traicionaste'}
      </p>

      <p className="mt-2 font-body text-[0.92rem] italic leading-snug text-paper">
        {voice}
      </p>

      {/* Resultado de coalición */}
      <div
        className={`mt-3 rounded-sm border px-3 py-2 font-body text-[0.85rem] ${
          result.allied
            ? 'border-positive/50 bg-positive/10 text-paper'
            : 'border-crisis/50 bg-crisis/10 text-paper'
        }`}
      >
        {result.allied
          ? `${prisoner.name} se suma a tu coalición. +1 aliado.`
          : result.exploited
            ? `Lo traicionaste cuando cooperaba. Ganaste el pago, pero ${prisoner.name} se vuelve hostil.`
            : `La negociación fracasa. ${prisoner.name} se vuelve hostil. ${prisoner.hostileNote}`}
      </div>

      {/* Lección de equilibrio */}
      <div className="mt-3 flex items-start gap-2">
        <span className="mt-0.5 shrink-0 font-mono text-[0.62rem] uppercase text-crisis">
          {result.isNash ? 'Nash' : 'No-Nash'}
        </span>
        <p className="font-body text-[0.82rem] leading-snug text-paper-dim">
          {equilibriumLesson(result)}
        </p>
      </div>

      {/* Concepto del personaje */}
      <div className="mt-3">
        <EducationalTooltip conceptId={prisoner.concept} onSeen={onConceptSeen} />
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-5 w-full rounded-sm border border-paper-dim bg-cell-2 px-4 py-2.5 font-display font-semibold text-paper transition-all hover:border-paper active:scale-[0.99]"
      >
        Volver a la celda
      </button>
    </div>
  )
}
