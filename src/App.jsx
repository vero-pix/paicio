import { useEffect, useMemo, useState } from 'react'
import { useGameState } from './hooks/useGameState.js'
import { playMusic, stopMusic, isDecisionMusic } from './lib/sound.js'
import { useInflation } from './hooks/useInflation.js'
import { episodesById } from './data/episodes/index.js'
import { portraits } from './assets/portraits.js'

import Intro from './components/Intro.jsx'
import WelcomeOverlay from './components/WelcomeOverlay.jsx'
import EpisodeSelect from './components/EpisodeSelect.jsx'
import InflationTicker from './components/InflationTicker.jsx'
import Cell from './components/Cell.jsx'
import Prisoner from './components/Prisoner.jsx'
import NegotiationMatrix from './components/NegotiationMatrix.jsx'
import PolicyChoice from './components/PolicyChoice.jsx'
import Outcome from './components/Outcome.jsx'
import MechanicHost from './components/mechanics/MechanicHost.jsx'
import VersionBadge from './components/VersionBadge.jsx'
import { dailySeed } from './utils/daily.js'

export default function App() {
  const {
    state,
    startEpisode,
    startDaily,
    startGame,
    setPhase,
    applyNegotiation,
    markConceptSeen,
    choosePolicy,
    restartEpisode,
    retryEpisode,
    backToSelect,
  } = useGameState()

  // Inicia el Reto Diario: episodio y semilla del día (desde DailyPanel).
  const handleStartDaily = (ep, iso) => startDaily(ep, iso, dailySeed(iso))

  // Episodio activo (null en la pantalla de selección).
  const episode = state.episodeId ? episodesById[state.episodeId] : null
  const prisoners = episode?.prisoners ?? []
  const prisonersById = useMemo(
    () => Object.fromEntries(prisoners.map((p) => [p.id, p])),
    [prisoners],
  )

  // Música por fase (crossfade entre pistas; nunca toca el estado del juego).
  //  · menú/selector → 'menu'
  //  · pantalla de decisión (mecánica, fase que renderiza MechanicHost) →
  //    'decision' (más tensa). Si decision.mp3 no existe, se mantiene la del
  //    episodio (fallback, no rompe).
  //  · resto (briefing/celda, desenlace) → música del episodio.
  useEffect(() => {
    if (state.phase === 'select' || !state.episodeId) {
      playMusic('menu')
      return undefined
    }
    const ep = episodesById[state.episodeId]
    const mech = ep?.mechanic ?? 'prisonersDilemma'
    const inMechanic = state.phase === 'negotiation' && mech !== 'prisonersDilemma'
    // La pista tensa de la decisión solo suena si el jugador la activó (off por
    // defecto: molestaba). Si no, queda la música ambiente del episodio.
    if (inMechanic && isDecisionMusic()) {
      playMusic('decision', { fallbackToAmbient: false })
    } else {
      playMusic(state.episodeId)
    }
    return undefined
  }, [state.phase, state.episodeId])
  useEffect(() => () => stopMusic(), [])

  // Id del prisionero con el que se está negociando (modal abierto).
  const [negotiating, setNegotiating] = useState(null)

  // Introducción: se muestra una vez por navegador. Se puede volver a ver
  // desde el selector con el enlace "¿Qué es PAICIO?".
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem('paicio.introSeen') !== '1'
    } catch {
      return true
    }
  })
  function dismissIntro() {
    try {
      localStorage.setItem('paicio.introSeen', '1')
    } catch {
      /* localStorage no disponible: la intro no se vuelve a ocultar, no es crítico */
    }
    setShowIntro(false)
  }

  // Capa de bienvenida para testers: se muestra una vez por navegador. Al
  // entrar, marca también la intro como vista para no encimar dos portones.
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return localStorage.getItem('paicio.welcome.v1') !== '1'
    } catch {
      return true
    }
  })
  function dismissWelcome() {
    try {
      localStorage.setItem('paicio.welcome.v1', '1')
      localStorage.setItem('paicio.introSeen', '1')
    } catch {
      /* localStorage no disponible: no es crítico */
    }
    setShowWelcome(false)
    setShowIntro(false)
  }

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

  // FASE 0 — Selector de episodios (precedido por la intro la primera vez)
  if (state.phase === 'select' || !episode) {
    return (
      <div className="min-h-full">
        {showWelcome && <WelcomeOverlay onEnter={dismissWelcome} />}
        {showIntro ? (
          <Intro onEnter={dismissIntro} />
        ) : (
          <EpisodeSelect
            onSelect={startEpisode}
            onShowIntro={() => setShowIntro(true)}
            onStartDaily={handleStartDaily}
          />
        )}
        <VersionBadge />
      </div>
    )
  }

  // Mecánica central del episodio. El dilema del prisionero (default) usa el
  // flujo negociación → política; las demás mecánicas son autocontenidas.
  const mechanic = episode.mechanic ?? 'prisonersDilemma'
  const isPD = mechanic === 'prisonersDilemma'

  // El ticker global de inflación solo aplica a las mecánicas que no traen su
  // propio HUD (dilema y secuencia). Las mecánicas con medidores propios
  // (corrida bancaria, paridad, expectativas) renderizan su HUD interno.
  const showTicker =
    state.phase !== 'cell' && (mechanic === 'prisonersDilemma' || mechanic === 'sequence')

  return (
    <div className="min-h-full">
      {showWelcome && <WelcomeOverlay onEnter={dismissWelcome} />}
      {/* Barra de navegación: volver al menú de episodios desde cualquier fase. */}
      <div className="mx-auto flex max-w-md items-center px-3 pt-3 pb-1">
        <button
          type="button"
          onClick={backToSelect}
          className="shadow-card flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-nunito text-[0.66rem] font-extrabold uppercase tracking-wide text-ink-soft transition-colors hover:text-ink-warm"
        >
          ⌂ Episodios
        </button>
      </div>

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

      {/* FASE 2 (mecánicas no-PD) — la mecánica central, autocontenida.
          Termina llamando choosePolicy(outcomeId, []) → desenlace. */}
      {state.phase === 'negotiation' && !isPD && (
        <MechanicHost
          episode={episode}
          allies={allies}
          dailySeed={state.daily?.seed}
          onComplete={(outcomeId, meta) => choosePolicy(outcomeId, [], meta)}
          onConceptSeen={markConceptSeen}
        />
      )}

      {/* FASE 2 (dilema del prisionero) — Negociaciones */}
      {state.phase === 'negotiation' && isPD && (
        <div className="grain relative mx-auto max-w-md px-5 py-6">
          <div className="relative z-10">
            <h2 className="font-display text-2xl font-black text-paper">
              Las Negociaciones
            </h2>
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

      {/* FASE 3 — Propuesta de política (solo dilema del prisionero).
          Las mecánicas no-PD resuelven el desenlace dentro de MechanicHost. */}
      {state.phase === 'policy' && (
        <PolicyChoice
          episode={episode}
          allies={allies}
          onChoose={choosePolicy}
          onConceptSeen={markConceptSeen}
        />
      )}

      {/* FASE 4 — Desenlace */}
      {state.phase === 'outcome' && (
        <Outcome
          episode={episode}
          policyId={state.chosenPolicy}
          mechanicResult={state.chosenMeta}
          allies={allies}
          daily={state.daily}
          onConceptSeen={markConceptSeen}
          onRestart={() => restartEpisode(episode)}
          onRetry={() => retryEpisode(episode)}
          onExit={backToSelect}
          onNextEpisode={(ep) => startEpisode(ep)}
        />
      )}

      <footer className="mx-auto max-w-md px-5 pb-8 pt-4 text-center">
        <p className="font-nunito text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-ink-mute/60">
          PAICIO · Episodio {episode.numero} · {episode.titulo}
        </p>
      </footer>

      <VersionBadge />
    </div>
  )
}
