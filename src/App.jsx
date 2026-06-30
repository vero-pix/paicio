import { useMemo, useState } from 'react'
import { useGameState } from './hooks/useGameState.js'
import { useInflation } from './hooks/useInflation.js'
import { episodesById } from './data/episodes/index.js'
import { portraits } from './assets/portraits.js'

import EpisodeSelect from './components/EpisodeSelect.jsx'
import InflationTicker from './components/InflationTicker.jsx'
import Cell from './components/Cell.jsx'
import Prisoner from './components/Prisoner.jsx'
import NegotiationMatrix from './components/NegotiationMatrix.jsx'
import PolicyChoice from './components/PolicyChoice.jsx'
import SequenceChoice from './components/SequenceChoice.jsx'
import Outcome from './components/Outcome.jsx'

export default function App() {
  const {
    state,
    startEpisode,
    startGame,
    setPhase,
    applyNegotiation,
    markConceptSeen,
    choosePolicy,
    restartEpisode,
    backToSelect,
  } = useGameState()

  // Episodio activo (null en la pantalla de selección).
  const episode = state.episodeId ? episodesById[state.episodeId] : null
  const prisoners = episode?.prisoners ?? []
  const prisonersById = useMemo(
    () => Object.fromEntries(prisoners.map((p) => [p.id, p])),
    [prisoners],
  )

  // Id del prisionero con el que se está negociando (modal abierto).
  const [negotiating, setNegotiating] = useState(null)

  // El ticker corre durante negociación y propuesta; se congela en celda y desenlace.
  const tickerActive = state.phase === 'negotiation' || state.phase === 'policy'
  const ticker = episode?.ticker
  const { price, hyperinflation } = useInflation({
    startPrice: ticker?.precioInicial ?? 4800,
    ratePerTick: ticker?.tasaInflacion ?? 1.018,
    threshold: ticker?.umbralCritico ?? 10000,
    active: tickerActive,
  })

  const allies = state.allies
  const canPropose = allies.length >= 2

  function handleResolve(prisonerId, result, playerMove) {
    applyNegotiation(prisonerId, result, playerMove)
    setNegotiating(null)
  }

  // FASE 0 — Selector de episodios
  if (state.phase === 'select' || !episode) {
    return (
      <div className="min-h-full">
        <EpisodeSelect onSelect={startEpisode} />
      </div>
    )
  }

  const showTicker = state.phase !== 'cell'

  return (
    <div className="min-h-full">
      {showTicker && (
        <InflationTicker
          price={price}
          hyperinflation={hyperinflation}
          itemBase={ticker.itemBase}
          currency={ticker.currency}
          onConceptSeen={markConceptSeen}
        />
      )}

      {/* FASE 1 — Celda */}
      {state.phase === 'cell' && <Cell episode={episode} onStart={startGame} />}

      {/* FASE 2 — Negociaciones */}
      {state.phase === 'negotiation' && (
        <div className="grain relative mx-auto max-w-md px-5 py-6">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-2xl font-black text-paper">
                Las Negociaciones
              </h2>
              <button
                type="button"
                onClick={backToSelect}
                className="font-mono text-[0.6rem] uppercase tracking-wide text-paper-dim hover:text-paper"
              >
                ← Episodios
              </button>
            </div>
            <p className="mt-2 font-body text-[0.88rem] leading-snug text-paper-dim">
              {episode.negotiationIntro}
            </p>

            {/* Marcador de coalición */}
            <div className="mt-4 rounded-sm border border-edge bg-cell/60 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.66rem] uppercase tracking-wide text-paper-dim">
                  Coalición
                </span>
                <span className="font-mono text-sm text-paper">
                  {allies.length} / {prisoners.length}{' '}
                  <span className={canPropose ? 'text-positive' : 'text-crisis'}>
                    {canPropose ? '· lista para proponer' : '· faltan aliados'}
                  </span>
                </span>
              </div>
              {/* Tira visual de avatares por estado */}
              <div className="mt-2.5 flex items-center gap-2">
                {prisoners.map((p) => {
                  const st = state.prisoners[p.id].status
                  const ring =
                    st === 'ally' ? p.accent : st === 'hostile' ? '#C0392B' : '#5A4A2C'
                  return (
                    <span
                      key={p.id}
                      title={`${p.name} — ${st === 'ally' ? 'aliado' : st === 'hostile' ? 'hostil' : 'disponible'}`}
                      className="relative block h-9 w-9 overflow-hidden rounded-full border-2 transition-all"
                      style={{
                        borderColor: ring,
                        opacity: st === 'hostile' ? 0.45 : 1,
                        filter: st === 'available' ? 'grayscale(0.4)' : 'none',
                      }}
                      aria-hidden
                    >
                      <img
                        src={portraits[p.id]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      {st === 'ally' && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-positive text-[0.5rem] text-ink">
                          ✓
                        </span>
                      )}
                      {st === 'hostile' && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-crisis text-[0.5rem] text-paper">
                          ✕
                        </span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Prisioneros */}
            <div className="mt-5 space-y-3">
              {prisoners.map((p) => (
                <Prisoner
                  key={p.id}
                  prisoner={p}
                  status={state.prisoners[p.id].status}
                  trust={state.prisoners[p.id].trust}
                  onNegotiate={setNegotiating}
                />
              ))}
            </div>

            {/* Avanzar a la propuesta */}
            <button
              type="button"
              disabled={!canPropose}
              onClick={() => setPhase('policy')}
              className={`mt-6 w-full rounded-sm border px-5 py-3 font-display text-base font-semibold tracking-wide transition-all active:scale-[0.99] ${
                canPropose
                  ? 'border-crisis bg-crisis/15 text-paper hover:bg-crisis/25'
                  : 'cursor-not-allowed border-edge bg-cell/40 text-paper-dim/60'
              }`}
            >
              {canPropose ? 'Enviar propuesta al presidente →' : episode.needAlliesWarning}
            </button>
          </div>

          {/* Modal de negociación */}
          {negotiating && (
            <NegotiationMatrix
              prisoner={prisonersById[negotiating]}
              trust={state.prisoners[negotiating].trust}
              history={state.prisoners[negotiating].history}
              turn={state.prisoners[negotiating].history.length}
              onResolve={(result, playerMove) =>
                handleResolve(negotiating, result, playerMove)
              }
              onConceptSeen={markConceptSeen}
              onClose={() => setNegotiating(null)}
            />
          )}
        </div>
      )}

      {/* FASE 3 — Propuesta o Secuencia (Ep5) */}
      {state.phase === 'policy' && (
        episode.sequenceMode ? (
          <SequenceChoice
            episode={episode}
            allies={allies}
            onChoose={choosePolicy}
            onConceptSeen={markConceptSeen}
          />
        ) : (
          <PolicyChoice
            episode={episode}
            allies={allies}
            onChoose={choosePolicy}
            onConceptSeen={markConceptSeen}
          />
        )
      )}

      {/* FASE 4 — Desenlace */}
      {state.phase === 'outcome' && (
        <Outcome
          episode={episode}
          policyId={state.chosenPolicy}
          allies={allies}
          onConceptSeen={markConceptSeen}
          onRestart={() => restartEpisode(episode)}
          onNextEpisode={(ep) => startEpisode(ep)}
        />
      )}

      <footer className="mx-auto max-w-md px-5 pb-8 pt-4 text-center">
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-paper-dim/50">
          PAICIO · Episodio {episode.numero} · {episode.titulo}
        </p>
      </footer>
    </div>
  )
}
