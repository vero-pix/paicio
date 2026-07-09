// ─────────────────────────────────────────────────────────────────────────
// Líneas de contenido de PAICIO.
//
// Cada línea es una "categoría" de episodios que comparten un tema y una
// mecánica general. Las líneas se desbloquean según estrellas totales.
// ─────────────────────────────────────────────────────────────────────────

export const LINES = [
  {
    id: 'crisis',
    name: 'Crisis Latinoamericanas',
    subtitle: 'Macroeconomía en acción',
    desc: 'Sé Ministro de Economía y enfrenta las crisis que marcaron a América Latina: hiperinflación, corridas bancarias, devaluaciones y más.',
    icon: '🌎',
    gradient: ['#EAF6EC', '#FBEFD2', '#FCE3C4'],
    unlocked: true,
    requires: null,
  },
  {
    id: 'origins',
    name: 'Orígenes',
    subtitle: 'Cómo nació la economía moderna',
    desc: 'Viaja a 1776 y descubre la fábrica de alfileres de Adam Smith. Después ven a Detroit con Ford, y viaja por la historia del pensamiento económico.',
    icon: '📜',
    gradient: ['#F0E6FF', '#E0D4F5', '#D0C2EB'],
    unlocked: true,
    requires: null,
  },
  {
    id: 'chile',
    name: 'Chile',
    subtitle: 'El país como laboratorio',
    desc: 'Chile es un experimento económico viviente. Desde el cobre hasta las AFP, desde Allende hasta los Chicago Boys. Cada episodio es una pieza de la identidad chilena.',
    icon: '🇨🇱',
    gradient: ['#EAF6EC', '#D4EDDA', '#FBEFD2'],
    unlocked: true,
    requires: null,
  },
  {
    id: 'norte',
    name: 'El Norte',
    subtitle: 'Los modelos que funcionan',
    desc: 'Australia en pensiones, Suiza en salud, Singapur en vivienda, Noruega en desigualdad. Este no es un viaje turístico: es un manual de construcción. Cada episodio te da las herramientas para construir un país que funcione. Idealmente, el tuyo.',
    icon: '🧭',
    gradient: ['#E3F2FD', '#F0E6FF', '#E8F5E9'],
    unlocked: true,
    requires: null,
  },
]

export const lineFor = (id) => LINES.find((l) => l.id === id)
