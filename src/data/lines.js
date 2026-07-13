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
    orden: 'Por dificultad',
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
    orden: 'Cronológico (1776→1976)',
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
    enConstruccion: true,
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
    enConstruccion: true,
  },
  {
    // Línea Microeconomía — REVELADA en prod (2026-07-11): 5 episodios, cada uno
    // con su verbo propio. El helper `visibleLines`/`prototype` sigue disponible
    // por si se quiere volver a ocultar una línea en el futuro.
    id: 'micro',
    name: 'Microeconomía',
    subtitle: 'Cómo funcionan los mercados',
    desc: 'Antes de gobernar un país, entiende la pieza mínima: un precio, un vendedor, una decisión. Por qué suben los arriendos, por qué el único almacén cobra más, por qué lo que conviene a cada uno arruina a todos.',
    icon: '⚖️',
    // Paleta teal/menta del lote Mercado (hueco de color libre entre el azul de
    // El Norte y el verde-dorado de Crisis): "limpio / conceptos de mercado".
    gradient: ['#EAF6F3', '#B7E3D9', '#7DC7BC'],
    unlocked: true,
    requires: null,
    orden: 'De lo simple a lo estratégico',
  },
]

// Líneas visibles en el mapa/onboarding: oculta los prototipos salvo que se
// revelen con ?proto=1 (para que Vero pruebe en el teléfono sin exponerlos en prod).
export const visibleLines = (revealPrototypes = false) =>
  LINES.filter((l) => !l.prototype || revealPrototypes)

export const prototypesRevealed = () => {
  try {
    return new URLSearchParams(window.location.search).has('proto')
  } catch {
    return false
  }
}

export const lineFor = (id) => LINES.find((l) => l.id === id)
