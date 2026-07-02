// ─────────────────────────────────────────────────────────────────────────
// EventCard — carta de evento ("shock" tipo Reigns) del game loop de Ep1.
//
// Se auto-selecciona por los datos del evento:
//  - DECISIÓN (`evento.opciones`): modal centrado sobre overlay oscuro, dos
//    botones candy apilados con pills de efecto bajo cada uno.
//  - PASIVA (`evento.efecto`): tarjeta compacta inline (no modal completo),
//    con delta coloreado + botón "Seguir".
//
// Solo presentación: el efecto lo aplica el padre con applyEvent (mismo clamp).
// Estilo candy compartido (.candy). Entra con pop suave; el reduced-motion se
// respeta global (index.css).
// ─────────────────────────────────────────────────────────────────────────

const TONE = {
  good: { bg: '#D6F0E5', color: '#1F9A6E' },
  bad: { bg: '#FBDAD3', color: '#C43D2C' },
  neutral: { bg: '#EDE3CE', color: '#8A7A5A' },
}

// Pills de un efecto: usa las custom del dato o las deriva de { inflacion, apoyo }.
function pillsFor(efecto = {}, custom) {
  if (custom) return custom
  const out = []
  if (efecto.inflacion) {
    const n = efecto.inflacion
    out.push({ label: `Inflación ${n > 0 ? '+' : '−'}${Math.abs(n)}`, tono: n > 0 ? 'bad' : 'good' })
  }
  if (efecto.apoyo) {
    const n = efecto.apoyo
    out.push({ label: `Apoyo ${n > 0 ? '+' : '−'}${Math.abs(n)}`, tono: n > 0 ? 'good' : 'bad' })
  }
  if (out.length === 0) out.push({ label: 'sin cambios', tono: 'neutral' })
  return out
}

function Pills({ items }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((p, i) => {
        const t = TONE[p.tono] ?? TONE.neutral
        return (
          <span
            key={i}
            className="rounded-full px-2 py-0.5 font-nunito text-[0.62rem] font-extrabold"
            style={{ background: t.bg, color: t.color }}
          >
            {p.label}
          </span>
        )
      })}
    </div>
  )
}

// Disco de color con el ícono del evento.
function IconDisc({ icon, tint, size = 'h-14 w-14 text-[1.7rem]' }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full`}
      style={{ background: tint }}
    >
      {icon}
    </span>
  )
}

export default function EventCard({ evento, mes, accent, onResolve }) {
  const esDecision = Array.isArray(evento.opciones) && evento.opciones.length > 0
  const tint = accent.soft ?? '#FBE7C6' // tono tenue de marca para chip/disco

  // ── PASIVA: tarjeta compacta inline ─────────────────────────────────────
  if (!esDecision) {
    return (
      <div className="animate-drop-in shadow-card mt-4 rounded-[20px] bg-panel p-3.5">
        <div className="flex items-center gap-3">
          <IconDisc icon={evento.icon} tint={tint} size="h-11 w-11 text-[1.3rem]" />
          <div className="min-w-0 flex-1">
            <p className="font-round text-[0.98rem] font-bold leading-tight text-ink-warm">
              {evento.titulo}
            </p>
            <div className="mt-1">
              <Pills items={pillsFor(evento.efecto)} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onResolve(evento.efecto ?? {})}
            className="candy shrink-0 px-4 py-2.5 text-[0.86rem]"
            style={{ '--face': accent.face, '--edge': accent.edge }}
          >
            Seguir
          </button>
        </div>
      </div>
    )
  }

  // ── DECISIÓN: modal centrado sobre overlay ──────────────────────────────
  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(28,18,8,0.55)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-drop-in shadow-panel w-full max-w-sm rounded-[24px] bg-panel p-5 text-center">
        <span
          className="inline-block rounded-full px-3 py-1 font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.12em]"
          style={{ background: tint, color: accent.edge }}
        >
          Shock · Mes {mes}
        </span>
        <div className="mt-3 flex justify-center">
          <IconDisc icon={evento.icon} tint={tint} />
        </div>
        <h3 className="mt-3 font-round text-[1.4rem] font-bold leading-tight text-ink-warm">
          {evento.titulo}
        </h3>
        <p className="mx-auto mt-1.5 max-w-[17rem] font-nunito text-[0.86rem] leading-snug text-ink-soft">
          {evento.texto}
        </p>

        <div className="mt-4 space-y-2.5">
          {evento.opciones.map((op, i) => {
            const primaria = i === 0
            const style = primaria
              ? { '--face': accent.face, '--edge': accent.edge }
              : undefined
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => onResolve(op.efecto ?? {}, op)}
                  className={`candy w-full px-4 py-3 text-left text-[0.98rem] ${primaria ? '' : 'candy-soft'}`}
                  style={style}
                >
                  {op.label}
                </button>
                <div className="mt-1.5 pl-1">
                  <Pills items={pillsFor(op.efecto, op.pills)} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
