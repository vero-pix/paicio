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
  ep6: (
    <>
      {/* águila (símbolo nacional) */}
      <path d="M24 9l2 3h4l-3 2 1 4-4-2-4 2 1-4-3-2h4z" />
      {/* serpiente en el pico */}
      <path d="M28 13c2 1 3 5 2 7s-3 2-4 0" />
      {/* nopal */}
      <path d="M8 28l3-8 2 2 2-4 2 3 2-2 1 4 1 2 1 4" />
      <path d="M8 28H5v5h18v-5h-3" />
      <ellipse cx="14" cy="36" rx="7" ry="2" />
    </>
  ),
  ep7: (
    <>
      {/* rayo (shock) */}
      <path d="M26 7 14 24h7l-3 12 8-14h-5z" />
      {/* sol andino / moneda Inti */}
      <circle cx="24" cy="28" r="9" />
      <path d="M17 20c3-4 8-4 11-1" />
      <path d="M28 35c-3 4-8 4-11 1" />
      <path d="M14 25c-1 3 0 7 2 9" />
      <path d="M33 27c1 4 0 7-2 9" />
    </>
  ),
  ep12: (
    <>
      {/* ábaco o regla (Friedman) */}
      <rect x="6" y="30" width="36" height="4" rx="1" />
      <rect x="6" y="24" width="36" height="4" rx="1" />
      <rect x="6" y="18" width="36" height="4" rx="1" />
      <rect x="6" y="12" width="36" height="4" rx="1" />
      <rect x="4" y="10" width="2" height="28" rx="1" />
    </>
  ),
  ep13: (
    <>
      {/* barra de precio + onda sinusoidal (cobre) */}
      <rect x="4" y="28" width="40" height="6" rx="2" />
      <path d="M4 22 Q12 8 20 22 Q28 36 36 22 Q40 14 44 22" />
      <circle cx="20" cy="22" r="2" />
    </>
  ),
  ep14: (
    <>
      {/* gráfico de crecimiento exponencial (interés compuesto) */}
      <path d="M4 40 Q8 38 14 34 Q22 28 28 18 Q34 8 44 4" strokeWidth="1.5" />
      <circle cx="44" cy="4" r="2" fill="currentColor" />
      {/* monedas apiladas */}
      <rect x="8" y="36" width="4" height="4" rx="0.5" />
      <rect x="8" y="32" width="4" height="4" rx="0.5" />
      <rect x="8" y="28" width="4" height="4" rx="0.5" />
      {/* línea base */}
      <path d="M4 42h40" strokeWidth="0.6" />
    </>
  ),
  ep8: (
    <>
      {/* pluma (Smith escribiendo) */}
      <path d="M8 36c6-8 14-16 18-20 2-2 5-1 6 1s1 5-1 7c-4 4-12 12-20 18l-5-2z" />
      <path d="M28 14l4 4" />
      {/* libro */}
      <path d="M16 21a16 16 0 0 1 8-5 16 16 0 0 1 8 5v12a16 16 0 0 0-8-4 16 16 0 0 0-8 4z" />
      {/* líneas de texto */}
      <path d="M10 17h6M10 21h6M10 25h6" />
    </>
  ),
  ep9: (
    <>
      {/* auto (Model T) */}
      <rect x="10" y="28" width="28" height="10" rx="2" />
      <circle cx="15" cy="39" r="3.5" />
      <circle cx="33" cy="39" r="3.5" />
      <path d="M8 28L14 16h20l6 12" />
      {/* línea de montaje debajo */}
      <path d="M6 45h36" strokeWidth="2" />
      <path d="M10 44.5l3 2M20 44.5l3 2M30 44.5l3 2" />
    </>
  ),
  ep10: (
    <>
      {/* martillo (Marx) */}
      <rect x="18" y="14" width="12" height="4" rx="1" />
      <rect x="22" y="10" width="4" height="16" />
      {/* yunque debajo */}
      <path d="M10 34h28l-6 6H16z" />
    </>
  ),
  ep11: (
    <>
      {/* gráfico de demanda creciente (Keynes) */}
      <path d="M8 38L18 28l8 4 14-18" />
      <circle cx="18" cy="28" r="2" />
      <circle cx="26" cy="32" r="2" />
      <circle cx="40" cy="14" r="2" />
      {/* eje X */}
      <path d="M6 40h38" strokeWidth="0.8" />
      {/* etiqueta "Y" */}
      <path d="M26 40v-4" />
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
