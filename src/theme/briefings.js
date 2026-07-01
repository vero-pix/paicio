// ─────────────────────────────────────────────────────────────────────────
// Briefings de episodio — CAPA DE PRESENTACIÓN.
//
// El rediseño reemplaza la "celda" del periódico por un briefing luminoso que
// necesita dos textos que NO viven (uniformes) en los datos del juego: la
// misión del nivel y la provocación del antagonista al recibir el cargo.
//
// Se centralizan acá para no tocar src/data/episodes/* (regla del rediseño y
// para que el swap de datos futuro no arrastre este copy). El resto del
// briefing —título, setup, dato clave— se lee de los datos reales del episodio.
// Tono: chileno neutro, tuteo (nunca voseo).
// ─────────────────────────────────────────────────────────────────────────

import { portraits } from '../assets/portraits.js'

export const EPISODE_BRIEFINGS = {
  ep1: {
    mission:
      'Frena la hiperinflación antes de que el peso se vuelva papel… o de que el pueblo te derroque.',
    antagonist: {
      portrait: portraits.presidente,
      name: 'El Presidente',
      quote: '"El país es tuyo, ministro. Yo ya hice mi parte… que tengas suerte."',
    },
  },
  ep2: {
    mission:
      'Detén la corrida bancaria y decide qué hacer con los ahorros, sin que reviente el sistema ni la calle.',
    antagonist: {
      portrait: portraits.gobernador,
      name: 'El Gobernador',
      quote: '"Los bancos ya cerraron. La fila en la puerta ahora es problema tuyo."',
    },
  },
  ep3: {
    mission:
      'Defiende la paridad mientras puedas… y suéltala a tiempo, antes de que se lleve todo por delante.',
    antagonist: {
      portrait: portraits.tecnocrata,
      name: 'El Tecnócrata',
      quote: '"El modelo era perfecto. Si ahora se cae, será por cómo lo manejes tú."',
    },
  },
  ep4: {
    mission:
      'Rompe la inercia inflacionaria: gánale a las expectativas sin quebrar al país en el intento.',
    antagonist: {
      portrait: portraits.congreso,
      name: 'El Congreso',
      quote: '"Cinco planes fracasaron. Tráenos el sexto… y ya veremos si te creemos."',
    },
  },
  ep5: {
    mission:
      'Termina con la inflación crónica. El truco no es congelar precios: es la secuencia correcta.',
    antagonist: {
      portrait: portraits.presidenteReal,
      name: 'El Presidente',
      quote: '"Es tu última bala, ministro. Si fallas, nadie volverá a intentarlo."',
    },
  },
}

const FALLBACK = EPISODE_BRIEFINGS.ep1

export const briefingFor = (id) => EPISODE_BRIEFINGS[id] ?? FALLBACK
