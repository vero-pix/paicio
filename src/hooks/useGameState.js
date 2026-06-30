import { useCallback, useEffect, useState } from 'react'

// v2: estado multi-episodio (incluye episodeId y fase de selector).
const STORAGE_KEY = 'paicio.state.v2'

// Construye el estado de relación inicial de los prisioneros de un episodio.
function buildPrisoners(episode) {
  return Object.fromEntries(
    episode.prisoners.map((p) => [
      p.id,
      { trust: p.initialTrust ?? 50, status: 'available', history: [] },
    ]),
  )
}

// Estado inicial: arranca en el selector de episodios.
function initialState() {
  return {
    phase: 'select', // select | cell | negotiation | policy | outcome
    episodeId: null,
    startedAt: null,
    prisoners: {},
    allies: [],
    chosenPolicy: null,
    seenConcepts: [],
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.phase) return null
    return parsed
  } catch {
    return null
  }
}

export function useGameState() {
  const [state, setState] = useState(() => load() || initialState())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* localStorage no disponible: el juego sigue en memoria */
    }
  }, [state])

  const setPhase = useCallback((phase) => {
    setState((s) => ({ ...s, phase }))
  }, [])

  // Selecciona un episodio y entra a su celda con los prisioneros frescos.
  const startEpisode = useCallback((episode) => {
    setState({
      phase: 'cell',
      episodeId: episode.id,
      startedAt: null,
      prisoners: buildPrisoners(episode),
      allies: [],
      chosenPolicy: null,
      seenConcepts: [],
    })
  }, [])

  // Pasa de la celda a las negociaciones; arranca el reloj del ticker.
  const startGame = useCallback(() => {
    setState((s) => ({
      ...s,
      phase: 'negotiation',
      startedAt: s.startedAt ?? Date.now(),
    }))
  }, [])

  const applyNegotiation = useCallback((prisonerId, result, playerMove) => {
    setState((s) => {
      const prev = s.prisoners[prisonerId]
      const trust = Math.max(0, Math.min(100, prev.trust + result.trustDelta))
      const status = result.allied
        ? 'ally'
        : result.hostile
          ? 'hostile'
          : 'available'
      const history = [...prev.history, playerMove]
      const prisoners = { ...s.prisoners, [prisonerId]: { trust, status, history } }
      const allies = Object.entries(prisoners)
        .filter(([, p]) => p.status === 'ally')
        .map(([id]) => id)
      return { ...s, prisoners, allies }
    })
  }, [])

  const markConceptSeen = useCallback((conceptId) => {
    setState((s) =>
      s.seenConcepts.includes(conceptId)
        ? s
        : { ...s, seenConcepts: [...s.seenConcepts, conceptId] },
    )
  }, [])

  const choosePolicy = useCallback((policyId, betrayingAllyIds) => {
    setState((s) => {
      const prisoners = { ...s.prisoners }
      for (const id of betrayingAllyIds) {
        prisoners[id] = { ...prisoners[id], status: 'hostile' }
      }
      const allies = Object.entries(prisoners)
        .filter(([, p]) => p.status === 'ally')
        .map(([id]) => id)
      return { ...s, prisoners, allies, chosenPolicy: policyId, phase: 'outcome' }
    })
  }, [])

  // Reinicia el episodio actual desde la celda.
  const restartEpisode = useCallback((episode) => {
    startEpisode(episode)
  }, [startEpisode])

  // Vuelve al selector de episodios.
  const backToSelect = useCallback(() => {
    setState(initialState())
  }, [])

  return {
    state,
    setPhase,
    startEpisode,
    startGame,
    applyNegotiation,
    markConceptSeen,
    choosePolicy,
    restartEpisode,
    backToSelect,
  }
}
