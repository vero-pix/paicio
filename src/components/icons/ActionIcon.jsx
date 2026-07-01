// ─────────────────────────────────────────────────────────────────────────
// ActionIcon — iconografía line-art para las acciones de las mecánicas.
//
// Reemplaza los emojis por trazo grabado, coherente con los retratos vintage.
// El color se hereda vía `currentColor` (usar text-* en className).
// Data-driven: se mapea por id de acción; si no hay icono, no renderiza nada.
// ─────────────────────────────────────────────────────────────────────────

const PATHS = {
  // Imprenta: prensa con hoja saliendo.
  imprimir: (
    <>
      <rect x="5" y="9" width="14" height="8" rx="1" />
      <path d="M7 9V4h10v5" />
      <path d="M7 17v3h10v-3" />
      <circle cx="16" cy="12.4" r="0.6" />
    </>
  ),
  // Tijeras: ajuste / recorte fiscal.
  ajuste: (
    <>
      <circle cx="6.5" cy="8" r="2.1" />
      <circle cx="6.5" cy="16" r="2.1" />
      <path d="M8.4 9.4 19 17" />
      <path d="M8.4 14.6 19 7" />
    </>
  ),
  // Puente / enlace: renegociar la deuda.
  renegociar: (
    <>
      <path d="M3 10l4 3-2 3" />
      <path d="M21 10l-4 3 2 3" />
      <path d="M7 13h10" />
    </>
  ),
  // Ancla: reforma monetaria (el Rentenmark).
  reforma: (
    <>
      <path d="M12 5v14" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <circle cx="12" cy="4" r="1.6" />
      <path d="M8 21h8" />
    </>
  ),
}

export default function ActionIcon({ id, className = '' }) {
  const inner = PATHS[id]
  if (!inner) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {inner}
    </svg>
  )
}
