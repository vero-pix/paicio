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
  ep6: { face: '#DA7B3E', edge: '#B85E24', soft: '#F5E0CC', icon: '🌵' },
  ep7: { face: '#E0434B', edge: '#BA2F36', soft: '#F5D6D8', icon: '⚡' },
  ep8: { face: '#8B5CF6', edge: '#6D3ED8', soft: '#EDE4FF', icon: '📜' },
  ep9: { face: '#4A6FA5', edge: '#30548A', soft: '#DAE5F5', icon: '🏭' },
  ep10: { face: '#C0392B', edge: '#96281B', soft: '#F5D0C9', icon: '⚒️' },
  ep11: { face: '#2C7CB0', edge: '#1A5B8A', soft: '#C9E4F5', icon: '📈' },
  ep12: { face: '#D4A54A', edge: '#B8892F', soft: '#F5E8C9', icon: '🏛️' },
  ep13: { face: '#D4875A', edge: '#B86A3F', soft: '#F3DDC9', icon: '🪙' },
  ep14: { face: '#35B98A', edge: '#1F9A6E', soft: '#D4F0E6', icon: '🏦' },
  ep15: { face: '#E0554C', edge: '#BE3A32', soft: '#FBDED6', icon: '🍅' }, // Micro — feria/tomate
  ep17: { face: '#2E9E8F', edge: '#25806F', soft: '#D4EEE8', icon: '💊' }, // Micro — farmacia/monopolio
}

const FALLBACK = { face: '#F5A524', edge: '#D6871A', soft: '#FBE7C6', icon: '•' }

export const accentFor = (id) => EPISODE_ACCENTS[id] ?? FALLBACK
