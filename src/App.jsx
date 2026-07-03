import { useEffect, useState } from 'react'
import { useGameState } from './hooks/useGameState.js'
import { playMusic, stopMusic, isDecisionMusic } from './lib/sound.js'
import { useInflation } from './hooks/useInflation.js'
import { episodesById } from './data/episodes/index.js'

import Intro from './components/Intro.jsx'
import WelcomeOverlay from './components/WelcomeOverlay.jsx'
import EpisodeSelect from './components/EpisodeSelect.jsx'
import InflationTicker from './components/InflationTicker.jsx'
import Cell from './components/Cell.jsx'
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
    // Toda mecánica corre en la fase 'negotiation'. La pista tensa de la decisión
    // solo suena si el jugador la activó (off por defecto: molestaba); si no,
    // queda la música ambiente del episodio.
    const inMechanic = state.phase === 'negotiation'
    if (inMechanic && isDecisionMusic()) {
      playMusic('decision', { fallbackToAmbient: false })
    } else {
      playMusic(state.episodeId)
    }
    return undefined
  }, [state.phase, state.episodeId])
  useEffect(() => () => stopMusic(), [])

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

  // El ticker corre durante la mecánica; se congela en celda y desenlace.
  const tickerActive = state.phase === 'negotiation'
  const ticker = episode?.ticker
  const { price, hyperinflation } = useInflation({
    startPrice: ticker?.precioInicial ?? 4800,
    ratePerTick: ticker?.tasaInflacion ?? 1.018,
    threshold: ticker?.umbralCritico ?? 10000,
    active: tickerActive,
  })

  const allies = state.allies

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

  // El ticker global de inflación solo aplica a la secuencia (Ep5), que no trae
  // HUD propio. Las demás mecánicas (corrida, paridad, expectativas,
  // hiperinflación) renderizan su propio HUD interno.
  const showTicker = state.phase !== 'cell' && episode.mechanic === 'sequence'

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

      {/* FASE 2 — La mecánica central del episodio, autocontenida.
          Termina llamando choosePolicy(outcomeId, meta) → desenlace. */}
      {state.phase === 'negotiation' && (
        <MechanicHost
          episode={episode}
          allies={allies}
          dailySeed={state.daily?.seed}
          onComplete={(outcomeId, meta) => choosePolicy(outcomeId, [], meta)}
          onConceptSeen={markConceptSeen}
        />
      )}

      {/* FASE 3 — Desenlace */}
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
