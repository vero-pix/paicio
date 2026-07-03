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
import { eventIcons } from '../../assets/eventos/index.js'

const TONE = {
  good: { bg: '#D6F0E5', color: '#1F9A6E' },
  bad: { bg: '#FBDAD3', color: '#C43D2C' },
  neutral: { bg: '#EDE3CE', color: '#8A7A5A' },
}

// Medidores por defecto (Bolivia): mantiene el comportamiento original si el
// llamador no pasa `meters`. `goodWhen` define el color: subir un medidor "low"
// (inflación, expectativas) es malo; subir uno "high" (apoyo, reservas) es bueno.
const DEFAULT_METERS = [
  { key: 'inflacion', label: 'Inflación', goodWhen: 'low' },
  { key: 'apoyo', label: 'Apoyo', goodWhen: 'high' },
]

// Pills de un efecto: usa las custom del dato, o las deriva de los medidores del
// episodio leyendo cada `key` del efecto.
function pillsFor(efecto = {}, custom, meters = DEFAULT_METERS) {
  if (custom) return custom
  const out = []
  for (const m of meters) {
    const n = efecto[m.key]
    if (!n) continue
    const sube = n > 0
    const bueno = m.goodWhen === 'low' ? !sube : sube
    out.push({ label: `${m.label} ${sube ? '+' : '−'}${Math.abs(n)}`, tono: bueno ? 'good' : 'bad' })
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

// Ícono del evento recortado en círculo. El disco de acento viene horneado en
// la imagen (webp), así que solo aplicamos el marco blanco + sombra de la guía.
// Si falta el ícono, cae a un disco de acento con el emoji.
function EventIcon({ evento, tint, px }) {
  // iconKey explícito, o el id del evento como convención (los íconos de
  // Ep2–Ep4 se nombraron según el id). Si no hay ícono, cae al emoji.
  const key = evento.iconKey ?? evento.id
  const img = key ? eventIcons[key] : null
  if (img) {
    return (
      <span
        className="relative inline-block shrink-0"
        style={{ width: px, height: px, borderRadius: '50%', boxShadow: '0 10px 22px -10px rgba(60,40,10,.5)' }}
      >
        <img
          src={img}
          alt=""
          width={px}
          height={px}
          loading="lazy"
          className="block h-full w-full rounded-full object-cover"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: 'inset 0 0 0 5px #fff' }}
        />
      </span>
    )
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: px, height: px, background: tint, fontSize: px * 0.38 }}
    >
      {evento.icon}
    </span>
  )
}

export default function EventCard({ evento, mes, mesLabel = 'Mes', accent, onResolve, spotlightRef, meters }) {
  const esDecision = Array.isArray(evento.opciones) && evento.opciones.length > 0
  const tint = accent.soft ?? '#FBE7C6' // tono tenue de marca para chip/disco

  // ── PASIVA: tarjeta compacta inline ─────────────────────────────────────
  if (!esDecision) {
    return (
      <div ref={spotlightRef} className="animate-drop-in shadow-card mt-4 rounded-[20px] bg-panel p-3.5">
        <div className="flex items-center gap-3">
          <EventIcon evento={evento} tint={tint} px={52} />
          <div className="min-w-0 flex-1">
            <p className="font-round text-[0.98rem] font-bold leading-tight text-ink-warm">
              {evento.titulo}
            </p>
            <div className="mt-1">
              <Pills items={pillsFor(evento.efecto, undefined, meters)} />
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
      <div ref={spotlightRef} className="animate-drop-in shadow-panel w-full max-w-sm rounded-[24px] bg-panel p-5 text-center">
        <span
          className="inline-block rounded-full px-3 py-1 font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.12em]"
          style={{ background: tint, color: accent.edge }}
        >
          Shock · {mesLabel} {mes}
        </span>
        <div className="mt-3 flex justify-center">
          <EventIcon evento={evento} tint={tint} px={120} />
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
                  <Pills items={pillsFor(op.efecto, op.pills, meters)} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
