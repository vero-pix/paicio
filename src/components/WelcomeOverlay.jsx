import { APP_VERSION } from '../data/version.js'
import Coin from './Coin.jsx'

// ─────────────────────────────────────────────────────────────────────────
// WelcomeOverlay — capa de bienvenida para testers (rediseño LatAm).
//
// Aparece una vez (por navegador) sobre todo lo demás: saluda con la marca,
// resume qué es PAICIO y pide feedback apuntando al botón 💬. Al entrar, App
// marca también la intro como vista para no encimar dos portones.
// ─────────────────────────────────────────────────────────────────────────

export default function WelcomeOverlay({ onEnter }) {
  return (
    <div className="on-cream animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#2A1C0C]/60 px-5 backdrop-blur-sm">
      <div className="shadow-panel w-full max-w-sm rounded-[26px] bg-panel p-6 text-center">
        <Coin size={72} bob className="mx-auto" />
        <h1 className="mt-4 font-round text-[2rem] font-bold leading-none tracking-tight text-ink-warm">
          PAICIO
        </h1>
        <p className="mt-1 font-nunito text-[0.82rem] font-bold text-ink-mute">
          economía que se juega, no se estudia
        </p>

        <p className="mt-4 font-nunito text-[0.88rem] leading-relaxed text-ink-soft">
          Eres el Ministro de Economía de un país ficticio. Cada nivel recrea una
          crisis real de América Latina y la aprendes jugándola:{' '}
          <span className="font-extrabold text-ink-warm">la mecánica es la lección.</span>
        </p>

        {/* Llamado al feedback */}
        <div
          className="mt-5 rounded-[16px] px-4 py-3 text-left"
          style={{ background: '#FBDAD3' }}
        >
          <p className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-[#D24C39]">
            Eres tester
          </p>
          <p className="mt-1 font-nunito text-[0.82rem] leading-snug text-ink-soft">
            Si algo se rompe, confunde o se puede mejorar, toca el botón{' '}
            <span className="font-extrabold">💬</span> en cualquier momento y me
            llega directo. Todo suma.
          </p>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="candy mt-6 w-full px-5 py-3.5 text-[1rem]"
          style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
        >
          Entrar a Paicio →
        </button>

        <p className="mt-3 font-nunito text-[0.56rem] font-extrabold uppercase tracking-[0.15em] text-ink-mute/70">
          v{APP_VERSION} · nuevo rediseño visual
        </p>
      </div>
    </div>
  )
}
