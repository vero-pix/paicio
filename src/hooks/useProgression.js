import { useState, useCallback } from 'react'

const STORAGE_KEY = 'paicio.progression'

function loadProgression() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
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
    }
    const next = { ...data, [episodeId]: newEntry }
    setData(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* quota exceeded, ignore */ }
  }, [data])

  const totalStars = Object.values(data).reduce((sum, d) => sum + (d.stars || 0), 0)

  const starsForEpisode = useCallback((episodeId) => {
    return data[episodeId]?.stars ?? 0
  }, [data])

  return { progression: data, save, totalStars, starsForEpisode }
}
