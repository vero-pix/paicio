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

  // ── Episodio 2 (corrida bancaria) ──────────────────────────────────
  // Escudo: garantizar los depósitos.
  garantia: (
    <>
      <path d="M12 3l7 2.5v5.5c0 4-2.9 7-7 8-4.1-1-7-4-7-8V5.5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  // Reja / candado: imponer el corralito.
  corralito: (
    <>
      <rect x="6" y="11" width="12" height="9" rx="1" />
      <path d="M9 11V8a3 3 0 0 1 6 0v3" />
      <path d="M12 14v3" />
    </>
  ),
  // Globo: abrir la línea del FMI.
  fmi: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.5 2.2 2.5 13.8 0 16" />
      <path d="M12 4c-2.5 2.2-2.5 13.8 0 16" />
    </>
  ),
  // Megáfono: hablarle al país.
  calmar: (
    <>
      <path d="M4 10v4h3l9 4V6l-9 4z" />
      <path d="M19 9a4 4 0 0 1 0 6" />
    </>
  ),

  // ── Episodio 3 (defender la paridad) ───────────────────────────────
  // Gráfico al alza: subir las tasas.
  tasas: (
    <>
      <path d="M4 4v16h16" />
      <path d="M7 15l3-3 3 2 5-7" />
      <path d="M17 7h2.5v2.5" />
    </>
  ),
  // Billete: vender reservas para intervenir.
  intervenir: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="1" />
      <circle cx="12" cy="12" r="2.3" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  // Balanza: soltar la paridad (devaluar / reencontrar valor).
  devaluar: (
    <>
      <path d="M12 4v16" />
      <path d="M6 8h12" />
      <path d="M6 8l-2.5 5h5z" />
      <path d="M18 8l-2.5 5h5z" />
      <path d="M8.5 20h7" />
    </>
  ),

  // ── Episodio 4 (expectativas e inercia) ────────────────────────────
  // Tijeras: ajuste fiscal de verdad.
  ajusteFiscal: (
    <>
      <circle cx="6.5" cy="8" r="2.1" />
      <circle cx="6.5" cy="16" r="2.1" />
      <path d="M8.4 9.4 19 17" />
      <path d="M8.4 14.6 19 7" />
    </>
  ),
  // Copo de nieve: congelar precios.
  congelar: (
    <>
      <path d="M12 3v18" />
      <path d="M4.5 7.5 19.5 16.5" />
      <path d="M19.5 7.5 4.5 16.5" />
      <path d="M12 7l2.2-2M12 7l-2.2-2M12 17l2.2 2M12 17l-2.2 2" />
    </>
  ),
  // Escuadra: unidad de cuenta estable (URV).
  urv: (
    <>
      <path d="M5 5h13L5 18z" />
      <path d="M9 15v-2M12 12v-2M15 9V7" />
    </>
  ),
  // Eslabones que se separan: desindexar los contratos.
  desindexar: (
    <>
      <path d="M10 13a3 3 0 0 1 0-4l1.5-1.5" />
      <path d="M14 11a3 3 0 0 1 0 4l-1.5 1.5" />
      <path d="M6 6l-2-2M20 20l-2-2" />
    </>
  ),

  // ── Episodio 5 (Plan Real / secuencia) ─────────────────────────────
  // Flechas cíclicas: migrar precios y salarios.
  migrar: (
    <>
      <path d="M5 9a7 7 0 0 1 12-2.5" />
      <path d="M17 4v3.2h-3.2" />
      <path d="M19 15a7 7 0 0 1-12 2.5" />
      <path d="M7 20v-3.2h3.2" />
    </>
  ),
  // Ancla: anclar al dólar.
  anclar: (
    <>
      <path d="M12 5v14" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <circle cx="12" cy="4" r="1.6" />
      <path d="M8 21h8" />
    </>
  ),
  // Moneda: convertir la URV en el Real.
  convertir: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5v9" />
      <path d="M14.5 9.8c-.4-1-1.3-1.4-2.5-1.4-1.5 0-2.5.7-2.5 1.8s1 1.5 2.5 1.7 2.5.7 2.5 1.9-1 1.7-2.5 1.7c-1.2 0-2.1-.5-2.5-1.4" />
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
