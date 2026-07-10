import Coin from './Coin.jsx'

// ─────────────────────────────────────────────────────────────────────────
// Intro — bienvenida de TESTER (pantalla única, cálida, una mano).
//
// Overlay fijo (z-70) que cubre lo que haya detrás: en la primera visita tapa el
// mapa; reabierta desde Ayuda (?) tapa la pantalla en curso sin perder progreso.
// Respeta el safe-area (notch de iPhone) arriba y abajo. Explica qué es Paicio,
// el rol de tester, la nube 💬 (feedback con respuesta) y el sello ✦ (actualizar).
// ─────────────────────────────────────────────────────────────────────────

function Explainer({ chip, chipBg, title, children }) {
  return (
    <div className="shadow-card animate-fade-up mt-3 flex items-start gap-3 rounded-[16px] bg-surface p-3.5">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[1.25rem]"
        style={{ background: chipBg }}
        aria-hidden
      >
        {chip}
      </span>
      <div className="min-w-0">
        <p className="font-round text-[0.9rem] font-bold text-ink-warm">{title}</p>
        <p className="mt-0.5 font-nunito text-[0.82rem] leading-snug text-ink-soft">{children}</p>
      </div>
    </div>
  )
}

export default function Intro({ onEnter }) {
  return (
    <div
      className="on-cream animate-fade-in fixed inset-0 z-[70] overflow-y-auto"
      style={{ background: 'linear-gradient(180deg,#FFF3D8,#FCE7C0)' }}
    >
      <div
        className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-6"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 1.25rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
        }}
      >
        {/* Marca */}
        <div className="flex flex-col items-center text-center">
          <Coin size={82} bob />
          <h1 className="mt-3 font-round text-[2.4rem] font-bold leading-none tracking-tight text-ink-warm">
            PAICIO
          </h1>
          <p className="mt-1 font-nunito text-[0.84rem] font-bold text-ink-mute">
            economía que se juega, no se estudia
          </p>
        </div>

        {/* Qué es, en una línea */}
        <p className="mt-5 text-center font-nunito text-[0.95rem] leading-snug text-ink-soft">
          Eres <span className="font-extrabold text-ink-warm">Ministro/a de Economía</span>:
          resuelves crisis reales, teoría y modelos de país…{' '}
          <span className="font-extrabold text-ink-warm">jugándolos</span>. La mecánica es la
          lección.
        </p>

        {/* Eres tester */}
        <div className="animate-fade-up mt-5 rounded-[18px] px-4 py-3.5" style={{ background: '#FBDAD3' }}>
          <p className="font-nunito text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-[#D24C39]">
            🛠️ Eres tester
          </p>
          <p className="mt-1 font-nunito text-[0.86rem] leading-snug text-ink-soft">
            El juego está <span className="font-extrabold text-ink-warm">en construcción</span> y
            tu opinión lo moldea. Lo que pruebes hoy cambia lo que viene.
          </p>
        </div>

        {/* La nube 💬 */}
        <Explainer chip="💬" chipBg="#DCEBFA" title="La nube: tu voz">
          Tócala (abajo a la derecha) en cualquier momento para dejar un comentario — qué se
          rompe, confunde o mejorarías.{' '}
          <span className="font-extrabold text-ink-warm">Te respondo ahí mismo.</span>
        </Explainer>

        {/* El sello ✦ */}
        <Explainer chip="✦" chipBg="#FBE7C6" title="Siempre la última versión">
          Aprieta <span className="font-extrabold">Actualizar</span> en el sello{' '}
          <span className="font-extrabold">✦ v…</span> (abajo a la izquierda) y trae lo último; en{' '}
          <span className="font-extrabold">Novedades</span> ves qué cambió. Actualizo casi a diario.
        </Explainer>

        {/* Empuja el CTA al fondo */}
        <div className="min-h-6 flex-1" />

        {/* CTA */}
        <button
          type="button"
          onClick={onEnter}
          className="candy mt-6 w-full px-5 py-4 text-[1.05rem]"
          style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
        >
          Entrar a Paicio →
        </button>
      </div>
    </div>
  )
}
