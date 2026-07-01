import { APP_VERSION } from '../data/version.js'

// ─────────────────────────────────────────────────────────────────────────
// WelcomeOverlay — capa de bienvenida para testers.
//
// Aparece una vez (por navegador) sobre todo lo demás: saluda, dice en dos
// líneas qué es PAICIO y cómo se juega, y pide feedback apuntando al botón 💬.
// Al entrar, App marca también la intro como vista para no encimar dos portones.
// El estilo reusa la paleta/tipografía del juego.
// ─────────────────────────────────────────────────────────────────────────

export default function WelcomeOverlay({ onEnter }) {
  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink/85 px-5 backdrop-blur-sm">
      <div className="grain vignette relative w-full max-w-sm overflow-hidden rounded-lg border border-edge bg-cell-2 p-6 text-center shadow-2xl">
        <div className="relative z-10">
          <p className="font-mono text-[0.56rem] uppercase tracking-[0.22em] text-paper-dim">
            Beta para testers
          </p>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-paper">
            PAICIO
          </h1>
          <p className="mt-1 font-body text-[0.82rem] italic leading-snug text-paper/80">
            El Ministro Encarcelado
          </p>

          <p className="mt-5 font-body text-[0.86rem] leading-relaxed text-paper/90">
            Eres el Ministro de Economía de Paicio, un país ficticio. Cada
            episodio recrea una crisis económica real —Weimar, Argentina, Chile,
            Brasil— y la aprendes jugándola:{' '}
            <span className="font-semibold text-paper">la mecánica es la lección.</span>
          </p>
          <p className="mt-2 font-body text-[0.86rem] leading-relaxed text-paper-dim">
            No hay respuestas fáciles. Decides, vives las consecuencias y las
            comparas con lo que pasó de verdad.
          </p>

          {/* Llamado al feedback */}
          <div className="mt-5 rounded-md border border-crisis/50 bg-crisis/10 px-4 py-3 text-left">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-crisis">
              Eres tester
            </p>
            <p className="mt-1.5 font-body text-[0.82rem] leading-snug text-paper/90">
              Si algo se rompe, confunde o se puede mejorar, toca el botón{' '}
              <span className="font-semibold text-paper">💬</span> en cualquier
              momento y me llega directo. Todo suma.
            </p>
          </div>

          <button
            type="button"
            onClick={onEnter}
            className="mt-6 w-full rounded-sm border border-crisis bg-crisis/20 px-5 py-3 font-display text-base font-semibold tracking-wide text-paper transition-all hover:bg-crisis/30 active:scale-[0.99]"
          >
            Entrar a Paicio →
          </button>

          <p className="mt-3 font-mono text-[0.54rem] uppercase tracking-[0.18em] text-paper-dim/60">
            v{APP_VERSION} · nuevo rediseño visual
          </p>
        </div>
      </div>
    </div>
  )
}
