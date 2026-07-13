import { useState, useCallback } from 'react'

const STORAGE_KEY = 'paicio.progression'

function loadProgression() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

// Reputación acumulada: cada episodio registra un veredicto (perfect/partial/wrong)
// que se pondera para calcular la confianza del sistema en el ministro.
// Se usa en episodios siguientes para modificar condiciones iniciales.
function computeReputation(data) {
  const pesos = { perfect: 10, partial: 3, wrong: -5 }
  let total = 50 // parte neutral
  let count = 0
  for (const entry of Object.values(data)) {
    if (entry.outcome && pesos[entry.outcome] !== undefined) {
      total += pesos[entry.outcome]
      count++
    }
  }
  return Math.max(0, Math.min(100, total))
}

export function useProgression() {
  const [data, setData] = useState(loadProgression)

  const save = useCallback((episodeId, outcome, score) => {
    const prev = data[episodeId] || { stars: 0, bestScore: 0, completed: false }
    const stars = outcome === 'perfect' ? 3 : outcome === 'partial' ? 2 : 1
    const newEntry = {
      stars: Math.max(prev.stars, stars),
      bestScore: Math.max(prev.bestScore, score || 0),
      completed: true,
      outcome, // guarda el veredicto para reputación
    }
    const next = { ...data, [episodeId]: newEntry }
    setData(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* quota exceeded, ignore */ }
    return next
  }, [data])

  const totalStars = Object.values(data).reduce((sum, d) => sum + (d.stars || 0), 0)

  const starsForEpisode = useCallback((episodeId) => {
    return data[episodeId]?.stars ?? 0
  }, [data])

  const reputation = computeReputation(data)

  return { progression: data, save, totalStars, starsForEpisode, reputation }
}
