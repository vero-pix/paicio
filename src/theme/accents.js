// ─────────────────────────────────────────────────────────────────────────
// Acentos de marca por episodio — CAPA DE PRESENTACIÓN.
//
// El rediseño LatAm pinta cada crisis con un color-acento (face) y su labio
// inferior 3D (edge), más un tono tenue (soft) para chips y tracks. Esto NO
// vive en los datos del episodio (src/data/episodes/*) a propósito: es puro
// look, y así el swap de datos futuro (p. ej. Weimar→Bolivia) no lo arrastra.
//
// Orden narrativo: ep1 hiperinflación (ámbar) · ep2 corralito (azul) ·
// ep3 paridad (coral) · ep4 inercia (violeta) · ep5 Plan Real (verde).
// ─────────────────────────────────────────────────────────────────────────

export const EPISODE_ACCENTS = {
  ep1: { face: '#F5A524', edge: '#D6871A', soft: '#FBE7C6', icon: '🔥' },
  ep2: { face: '#4FA3E3', edge: '#2F82C4', soft: '#DCEBFA', icon: '🏦' },
  ep3: { face: '#F06A54', edge: '#D24C39', soft: '#FBDAD3', icon: '⚖️' },
  ep4: { face: '#A579E0', edge: '#8657C4', soft: '#ECE0FA', icon: '🌀' },
  ep5: { face: '#35B98A', edge: '#1F9A6E', soft: '#D6F0E5', icon: '⚓' },
}

const FALLBACK = { face: '#F5A524', edge: '#D6871A', soft: '#FBE7C6', icon: '•' }

export const accentFor = (id) => EPISODE_ACCENTS[id] ?? FALLBACK
