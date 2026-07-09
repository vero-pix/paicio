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
import { useRef, useState } from 'react'
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

// Tono neto de un efecto sobre los medidores: 'good' si en conjunto mejora el
// estado, 'bad' si lo empeora, 'neutral' si es inocuo. Sirve para teñir la carta
// al arrastrarla (swipe) según a qué medidor pega la opción.
function netTone(efecto = {}, meters = DEFAULT_METERS) {
  let net = 0
  for (const m of meters) {
    const n = efecto[m.key]
    if (!n) continue
    net += m.goodWhen === 'low' ? -n : n
  }
  return net > 0 ? 'good' : net < 0 ? 'bad' : 'neutral'
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

export default function EventCard({ evento, mes, mesLabel = 'Mes', accent, onResolve, spotlightRef, meters, swipe = false }) {
  const esDecision = Array.isArray(evento.opciones) && evento.opciones.length > 0
  const tint = accent.soft ?? '#FBE7C6' // tono tenue de marca para chip/disco

  // Estado de arrastre (swipe tipo Reigns). Los hooks van SIEMPRE arriba —
  // reglas de hooks; la tarjeta pasiva simplemente no los usa.
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef({ startX: 0, id: null, delta: 0, armed: false, active: false })
  const committed = useRef(false)

  // Resolución guardada (una sola vez, la comparten tap y swipe).
  const resolve = (op) => {
    if (committed.current) return
    committed.current = true
    onResolve(op.efecto ?? {}, op)
  }

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
            {evento.texto && (
              <p className="mt-0.5 font-nunito text-[0.78rem] leading-snug text-ink-soft">
                {evento.texto}
              </p>
            )}
            <div className="mt-1.5">
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
  // Con `swipe` y exactamente 2 opciones, la carta se arrastra: derecha =
  // opción A (opciones[0]), izquierda = opción B (opciones[1]). El tap en los
  // botones sigue funcionando (fallback accesible).
  const swipeable = swipe && evento.opciones.length === 2
  const THRESH = 90 // px para confirmar
  const opDerecha = evento.opciones[0]
  const opIzquierda = evento.opciones[1]

  const commitSwipe = (op, dir) => {
    if (committed.current) return
    setDragging(false)
    setDx(dir * 700) // la carta vuela fuera
    setTimeout(() => resolve(op), 200)
  }

  const onPointerDown = (e) => {
    if (!swipeable || committed.current) return
    drag.current = { startX: e.clientX, id: e.pointerId, delta: 0, armed: true, active: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.armed) return
    const delta = e.clientX - d.startX
    d.delta = delta
    if (!d.active && Math.abs(delta) > 10) {
      d.active = true
      setDragging(true)
      try { e.currentTarget.setPointerCapture(d.id) } catch { /* no-op */ }
    }
    if (d.active) setDx(delta)
  }
  const onPointerUp = () => {
    const d = drag.current
    if (!d.active) { d.armed = false; return } // fue tap: dejar pasar el click al botón
    const delta = d.delta
    d.armed = false
    d.active = false
    if (delta > THRESH) commitSwipe(opDerecha, 1)
    else if (delta < -THRESH) commitSwipe(opIzquierda, -1)
    else { setDragging(false); setDx(0) } // no llegó al umbral: vuelve al centro
  }

  const progress = Math.max(-1, Math.min(1, dx / THRESH))
  const hintOp = progress >= 0 ? opDerecha : opIzquierda
  const hintTone = TONE[netTone(hintOp.efecto, meters)] ?? TONE.neutral
  const hintOpacity = Math.min(Math.abs(progress), 1)

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(28,18,8,0.55)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={spotlightRef}
        onPointerDown={swipeable ? onPointerDown : undefined}
        onPointerMove={swipeable ? onPointerMove : undefined}
        onPointerUp={swipeable ? onPointerUp : undefined}
        onPointerCancel={swipeable ? onPointerUp : undefined}
        className="animate-drop-in shadow-panel relative w-full max-w-sm select-none overflow-hidden rounded-[24px] bg-panel p-5 text-center"
        style={
          swipeable
            ? {
                transform: `translateX(${dx}px) rotate(${progress * 6}deg)`,
                transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(.2,.8,.3,1)',
                touchAction: 'none',
                cursor: dragging ? 'grabbing' : 'grab',
              }
            : undefined
        }
      >
        {/* Tinte direccional al arrastrar (verde = mejora, rojo = empeora) */}
        {swipeable && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[24px]"
            style={{ background: hintTone.bg, opacity: hintOpacity * 0.55, transition: dragging ? 'none' : 'opacity 0.2s' }}
          />
        )}

        <div className="relative">
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

          {/* Etiqueta de la opción hacia la que arrastras */}
          {swipeable && hintOpacity > 0.05 && (
            <div
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-round text-[0.82rem] font-bold"
              style={{ background: hintTone.bg, color: hintTone.color, opacity: hintOpacity }}
            >
              {progress >= 0 ? '→' : '←'} {hintOp.label}
            </div>
          )}

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
                    onClick={() => resolve(op)}
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

          {/* Pista de gesto */}
          {swipeable && (
            <p className="mt-3 font-nunito text-[0.66rem] font-bold text-ink-mute/70">
              Desliza la carta · → {opDerecha.label} · ← {opIzquierda.label}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
