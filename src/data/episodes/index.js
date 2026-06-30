// Registro de episodios de PAICIO.
// Episodios 1, 2, 3, 4 y 5 jugables — todos construidos.
import episode1 from './episode1.js'
import episode2 from './episode2.js'
import episode3 from './episode3.js'
import episode4 from './episode4.js'
import episode5 from './episode5.js'

// Orden pedagógico del arco narrativo latinoamericano.
export const episodes = [episode1, episode2, episode3, episode4, episode5]
export const episodesById = Object.fromEntries(episodes.map((e) => [e.id, e]))
export const playableEpisodes = episodes.filter((e) => !e.bloqueado)
