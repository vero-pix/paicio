const STORAGE_KEY = 'paicio.achievements'
const ACHIEVEMENTS = [
  { id: 'primerPaso', title: 'Primer Paso', desc: 'Completa tu primer episodio', icon: '🌱', check: (progression) => Object.keys(progression).length >= 1 },
  { id: 'reformista', title: 'Reformista', desc: 'Salva Paicio con resultado perfecto (3 estrellas)', icon: '⭐', check: (progression) => Object.values(progression).some((e) => e.outcome === 'perfect') },
  { id: 'persistente', title: 'Persistente', desc: 'Completa un episodio al reintentar', icon: '🔄', check: (progression, meta) => meta?.retried === true },
  { id: 'explorador', title: 'Explorador', desc: 'Juega episodios de 2 líneas distintas', icon: '🗺️', check: (progression) => new Set(Object.keys(progression).map((id) => id.replace(/\d+$/, ''))).size >= 2 },
  { id: 'experto', title: 'Experta', desc: 'Consigue 3 estrellas en cualquier episodio', icon: '🏆', check: (progression) => Object.values(progression).some((e) => e.stars >= 3) },
]

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch { return [] }
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch {}
}

export function checkAchievements(progression, meta = {}) {
  const unlocked = load()
  const newOnes = []
  for (const a of ACHIEVEMENTS) {
    if (unlocked.some((u) => u.id === a.id)) continue
    if (a.check(progression, meta)) {
      const entry = { id: a.id, title: a.title, desc: a.desc, icon: a.icon, unlockedAt: Date.now() }
      unlocked.push(entry)
      newOnes.push(entry)
    }
  }
  if (newOnes.length) save(unlocked)
  return newOnes
}

export function getAllAchievements() {
  const unlocked = load()
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: unlocked.some((u) => u.id === a.id),
    unlockedAt: unlocked.find((u) => u.id === a.id)?.unlockedAt ?? null,
  }))
}
