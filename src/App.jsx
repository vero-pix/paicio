import { useCallback, useEffect, useState } from 'react'
import { useGameState } from './hooks/useGameState.js'
import { useProgression } from './hooks/useProgression.js'
import { checkAchievements } from './hooks/useAchievements.js'
import { playMusic, stopMusic, isDecisionMusic } from './lib/sound.js'
import { useInflation } from './hooks/useInflation.js'
import { episodes, episodesById, playableEpisodes } from './data/episodes/index.js'

import Intro from './components/Intro.jsx'
import EpisodeSelect from './components/EpisodeSelect.jsx'
import LineSelect from './components/LineSelect.jsx'
import InflationTicker from './components/InflationTicker.jsx'
import Cell from './components/Cell.jsx'
import Outcome from './components/Outcome.jsx'
import MechanicHost from './components/mechanics/MechanicHost.jsx'
import VersionBadge from './components/VersionBadge.jsx'
import HelpButton from './components/HelpButton.jsx'
import AchievementToast from './components/AchievementToast.jsx'
import { dailySeed } from './utils/daily.js'
import { track } from './lib/track.js'

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

  const { save, totalStars, reputation } = useProgression()
  const [activeLine, setActiveLine] = useState(null)
  const [newAchievements, setNewAchievements] = useState([])

  // Va a la portada (LineSelect).
  const goToHome = useCallback(() => {
    setActiveLine(null)
    backToSelect()
  }, [backToSelect])

  // Analítica de producto: registra el inicio de una partida (anónimo).
  const trackStart = useCallback((ep) => {
    if (ep?.id) track('inicia_partida', { episodio: ep.id })
  }, [])

  // Inicia un episodio (desde el mapa o "siguiente episodio"): mide + arranca.
  const handleStartEpisode = useCallback(
    (ep) => {
      trackStart(ep)
      startEpisode(ep)
    },
    [trackStart, startEpisode],
  )

  // Inicia el Reto Diario.
  const handleStartDaily = (ep, iso) => {
    trackStart(ep)
    startDaily(ep, iso, dailySeed(iso))
  }

  // Episodio activo.
  const episode = state.episodeId ? episodesById[state.episodeId] : null

  // Guarda progreso al completar un episodio.
  function handleComplete(outcomeId, meta) {
    if (state.episodeId) {
      const nextP = save(state.episodeId, outcomeId, meta?.score)
      const fueRetry = !!state.chosenPolicy
      const fresh = checkAchievements(nextP, { retried: fueRetry })
      if (fresh.length) setNewAchievements(fresh)
      // Analítica: partida completada (resultado + estrellas, anónimo).
      const estrellas = outcomeId === 'perfect' ? 3 : outcomeId === 'partial' ? 2 : 1
      track('completa_partida', { episodio: state.episodeId, resultado: outcomeId, estrellas })
    }
    choosePolicy(outcomeId, [], meta)
  }

  // Música por fase.
  useEffect(() => {
    if (state.phase === 'select' || !state.episodeId) {
      playMusic('menu')
      return undefined
    }
    const inMechanic = state.phase === 'negotiation'
    if (inMechanic && isDecisionMusic()) {
      playMusic('decision', { fallbackToAmbient: false })
    } else {
      playMusic(state.episodeId)
    }
    return undefined
  }, [state.phase, state.episodeId])
  useEffect(() => () => stopMusic(), [])

  // Onboarding ÚNICO: se muestra una vez por navegador. Llave nueva (v2) porque
  // el contenido cambió de raíz (antes eran dos portones contradictorios).
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem('paicio.onboarding.v2') !== '1'
    } catch {
      return true
    }
  })
  function dismissIntro() {
    try {
      localStorage.setItem('paicio.onboarding.v2', '1')
    } catch { /* no crítico */ }
    setShowIntro(false)
  }

  // Ticker.
  const tickerActive = state.phase === 'negotiation'
  const ticker = episode?.ticker
  const { price, hyperinflation } = useInflation({
    startPrice: ticker?.precioInicial ?? 4800,
    ratePerTick: ticker?.tasaInflacion ?? 1.018,
    threshold: ticker?.umbralCritico ?? 10000,
    active: tickerActive,
  })

  const allies = state.allies

  // ── FASE 0 — Selección de línea o episodio ──────────────────────────
  if (state.phase === 'select' || !episode) {
    return (
      <div className="min-h-full">
        {!activeLine ? (
          <LineSelect
            onSelect={setActiveLine}
            totalStars={totalStars}
          />
        ) : (
          <EpisodeSelect
            line={activeLine}
            episodes={episodes
              .filter((e) => e.line === activeLine)
              .sort((a, b) => a.numero - b.numero)}
            onSelect={handleStartEpisode}
            onShowIntro={() => setShowIntro(true)}
            onStartDaily={handleStartDaily}
            onBack={() => setActiveLine(null)}
          />
        )}
        {!showIntro && <HelpButton onShowWelcome={() => setShowIntro(true)} />}
        <VersionBadge />
        {/* Bienvenida de tester: overlay que cubre el mapa en la 1ª visita y se
            reabre desde Ayuda (?). */}
        {showIntro && <Intro onEnter={dismissIntro} />}
      </div>
    )
  }

  // Ticker global (solo Ep5).
  const showTicker = state.phase !== 'cell' && episode.mechanic === 'sequence'

  return (
    <div className="min-h-full">
      {/* Barra de navegación (respeta el notch/safe-area de iPhone) */}
      <div
        className="mx-auto flex max-w-md items-center gap-2 pb-1"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
          paddingLeft: 'calc(env(safe-area-inset-left) + 0.75rem)',
          paddingRight: 'calc(env(safe-area-inset-right) + 0.75rem)',
        }}
      >
        <button
          type="button"
          onClick={backToSelect}
          className="shadow-card flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-nunito text-[0.66rem] font-extrabold uppercase tracking-wide text-ink-soft transition-colors hover:text-ink-warm"
        >
          ← Mapa
        </button>
        <button
          type="button"
          onClick={goToHome}
          className="shadow-card flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-nunito text-[0.66rem] font-extrabold uppercase tracking-wide text-ink-soft transition-colors hover:text-ink-warm"
        >
          ⌂ Inicio
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

      {/* FASE 2 — Mecánica */}
      {state.phase === 'negotiation' && (
        <MechanicHost
          episode={episode}
          allies={allies}
          dailySeed={state.daily?.seed}
          onComplete={(outcomeId, meta) => handleComplete(outcomeId, meta)}
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
          reputation={reputation}
          onConceptSeen={markConceptSeen}
          onRestart={() => {
            trackStart(episode)
            restartEpisode(episode)
          }}
          onRetry={() => {
            trackStart(episode)
            retryEpisode(episode)
          }}
          onExit={backToSelect}
          onNextEpisode={handleStartEpisode}
        />
      )}

      <footer className="mx-auto max-w-md px-5 pb-8 pt-4 text-center">
        <p className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-ink-mute/60">
          PAICIO · Episodio {episode.numero} · {episode.titulo}
        </p>
      </footer>

      {newAchievements.length > 0 && (
        <AchievementToast
          achievements={newAchievements}
          onDone={() => setNewAchievements([])}
        />
      )}
      <HelpButton episode={episode} onShowWelcome={() => setShowIntro(true)} />
      <VersionBadge />
      {/* Bienvenida reabierta desde Ayuda (?) durante la partida: overlay que no
          desmonta el juego → no se pierde el progreso. */}
      {showIntro && <Intro onEnter={dismissIntro} />}
    </div>
  )
}
