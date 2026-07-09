// Registro de episodios de PAICIO.
// Episodios 1, 2, 3, 4 y 5 jugables — todos construidos.
import episode1 from './episode1.js'
import episode2 from './episode2.js'
import episode3 from './episode3.js'
import episode4 from './episode4.js'
import episode5 from './episode5.js'
import episode6 from './episode6.js'
import episode7 from './episode7.js'
import episode8 from './episode8.js'
import episode9 from './episode9.js'
import episode10 from './episode10.js'
import episode11 from './episode11.js'
import episode12 from './episode12.js'
import episode13 from './episode13.js'
import episode14 from './episode14.js'

export const episodes = [episode1, episode2, episode3, episode4, episode5, episode6, episode7, episode8, episode9, episode10, episode11, episode12, episode13, episode14]
export const episodesById = Object.fromEntries(episodes.map((e) => [e.id, e]))
export const playableEpisodes = episodes.filter((e) => !e.bloqueado)
