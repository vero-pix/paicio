// ─────────────────────────────────────────────────────────────────────────
// EpisodeMotif — viñeta grabada (line-art) por episodio para el selector.
//
// Da a cada crisis una firma visual reconocible en la pantalla de inicio, en
// lugar de tarjetas de solo texto. Trazo simple, hereda color con currentColor.
//   ep1 Weimar   → billete ardiendo
//   ep2 Argentina→ banco con reja bajando (corralito)
//   ep3 Chile    → cordillera + estrella (el milagro que no fue)
//   ep4 Brasil   → espiral (inflación crónica)
//   ep5 Plan Real→ transición de moneda (URV)
// ─────────────────────────────────────────────────────────────────────────

const MOTIFS = {
  ep1: (
    <>
      {/* llamas */}
      <path d="M16 25c2-3 1-6-1-8 3 1 5 4 3 8" />
      <path d="M24 24c2.5-3.5 1-7-1.5-9.5 4 1 6.5 5 4 9.5" />
      <path d="M32 25c2-3 1-6-1-8 3 1 5 4 3 8" />
      {/* billete */}
      <rect x="7" y="26" width="34" height="14" rx="1.2" />
      <ellipse cx="24" cy="33" rx="6" ry="3.4" />
    </>
  ),
  ep2: (
    <>
      {/* frontón + columnas */}
      <path d="M8 17 24 8l16 9" />
      <path d="M9 17h30" />
      <path d="M13 17v9M20 17v9M28 17v9M35 17v9" />
      {/* reja bajando */}
      <path d="M8 30h32" />
      <path d="M11 30v9M18 30v6M25 30v9M32 30v6" />
      <path d="M8 39h32" />
    </>
  ),
  ep3: (
    <>
      {/* estrella (nodo a Chile) */}
      <path d="M24 7l1.6 3.4 3.7.5-2.7 2.6.7 3.7L24 15.9l-3.3 1.8.7-3.7-2.7-2.6 3.7-.5z" />
      {/* cordillera */}
      <path d="M6 38 15 24l5 7 6-9 6 8 4-4 4 12" />
      <path d="M6 38h36" />
    </>
  ),
  ep4: (
    <>
      {/* espiral que escala */}
      <path d="M24 24c0-2.4 2-4 4.2-4 3 0 5.2 2.5 5.2 5.6 0 4-3.4 6.9-7.6 6.9-5.2 0-9.2-4.2-9.2-9.5 0-6.4 5.2-11 11.6-11 3.4 0 6.5 1.2 8.6 3.2" />
      {/* punta hacia arriba (aceleración) */}
      <path d="M40 15l1 4-4 .6" />
    </>
  ),
  ep5: (
    <>
      {/* dos monedas: vieja → nueva */}
      <circle cx="16" cy="29" r="7.5" />
      <circle cx="33" cy="29" r="7.5" />
      <path d="M16 25.5v7M33 26.5l-2.4 4h4.8z" />
      {/* flecha de transición (URV) */}
      <path d="M12 14h22" />
      <path d="M30 11l4 3-4 3" />
    </>
  ),
}

export default function EpisodeMotif({ id, className = '' }) {
  const inner = MOTIFS[id]
  if (!inner) return null
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {inner}
    </svg>
  )
}
