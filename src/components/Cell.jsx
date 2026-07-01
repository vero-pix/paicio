import { accentFor } from '../theme/accents.js'
import { briefingFor } from '../theme/briefings.js'

// ─────────────────────────────────────────────────────────────────────────
// Cell — "Intro de episodio" (rediseño LatAm).
//
// Reemplaza la celda del periódico oscuro por un briefing luminoso de una sola
// pantalla: chip de crisis, título + setup, card oscura del dato clave, la
// misión del nivel, la provocación del antagonista y el CTA para asumir.
//
// Reutiliza los datos del episodio (titulo, resumen, crisisHistorica, ticker).
// La misión y el antagonista viven en la capa de presentación (briefings.js)
// para no tocar src/data/episodes/*.
// ─────────────────────────────────────────────────────────────────────────

// Ícono de objetivo (diana) para el callout "Tu misión".
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.4" />
  </svg>
)

export default function Cell({ episode, onStart }) {
  const acc = accentFor(episode.id)
  const brief = briefingFor(episode.id)
  const t = episode.ticker
  const pais = episode.paisReferencia.split(',')[0]
  const precio = Number(t?.precioInicial ?? 0).toLocaleString('es-CL')
  const unidad = t?.currency ?? ''
  const unidadSep = unidad === '%' ? '' : ' '

  return (
    <div className="on-cream relative">
      {/* Fondo luminoso con tinte del acento del episodio. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg,#FFEFD2,#FBE2BE)' }}
      />

      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-8 pt-1">
        {/* Top bar: pill de país */}
        <div className="flex justify-end">
          <span
            className="candy whitespace-nowrap px-3.5 py-2 text-[0.8rem]"
            style={{ '--face': acc.face, '--edge': acc.edge }}
          >
            {pais} · {episode.año}
          </span>
        </div>

        {/* Chip de crisis */}
        <span
          className="mt-4 inline-block w-fit rounded-full px-2.5 py-1 font-nunito text-[0.62rem] font-extrabold uppercase tracking-wide"
          style={{ background: acc.soft, color: acc.edge }}
        >
          {episode.crisisHistorica} · Nivel {episode.numero}
        </span>

        {/* Título + setup */}
        <h1 className="mt-2 text-balance font-round text-[2.1rem] font-bold leading-[1.05] text-ink-warm">
          {episode.titulo}
        </h1>
        <p className="mt-2 font-nunito text-[0.92rem] leading-snug text-ink-soft">
          {episode.resumen}
        </p>

        {/* Dato clave — misma card oscura que el hero */}
        <div
          className="shadow-card-dark relative mt-5 overflow-hidden rounded-[24px] p-4"
          style={{ background: 'linear-gradient(160deg,#3B2A17,#26190B)' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,179,49,.25), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F3E2C2] text-[1.6rem]">
              {acc.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-[#E8C67F]">
                {t?.itemBase} · hoy
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-round text-[1.9rem] font-bold leading-none tabular-nums text-[#FFE9A8]">
                  {precio}
                </span>
                <span className="font-round text-[0.85rem] font-semibold text-[#C9A24B]">
                  {unidadSep}{unidad}
                </span>
              </div>
            </div>
            <span
              className="shrink-0 self-start rounded-full px-2 py-1 font-nunito text-[0.56rem] font-extrabold uppercase"
              style={{ background: 'rgba(232,96,79,.2)', color: '#F5A88F' }}
            >
              ▲ y subiendo
            </span>
          </div>
        </div>

        {/* Tu misión */}
        <div className="shadow-card mt-3 flex items-start gap-3 rounded-[18px] bg-surface p-3.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: '#DCEBFA', color: '#2F82C4' }}
          >
            <TargetIcon />
          </span>
          <div className="min-w-0">
            <p className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-wide text-argentina">
              Tu misión
            </p>
            <p className="mt-0.5 font-round text-[0.86rem] font-semibold leading-snug text-ink-warm">
              {brief.mission}
            </p>
          </div>
        </div>

        {/* Empuja al antagonista + CTA hacia abajo */}
        <div className="flex-1" />

        {/* Antagonista */}
        <div className="mt-6 flex items-start gap-3">
          <span className="coin shrink-0 rounded-full p-[3px]">
            <img
              src={brief.antagonist.portrait}
              alt=""
              className="h-12 w-12 rounded-full border-2 border-white object-cover"
            />
          </span>
          <div className="shadow-card min-w-0 flex-1 rounded-[18px] rounded-tl-[5px] bg-surface p-3">
            <p className="font-round text-[0.78rem] font-bold" style={{ color: acc.edge }}>
              {brief.antagonist.name}
            </p>
            <p className="mt-0.5 font-nunito text-[0.82rem] italic leading-snug text-ink-soft">
              {brief.antagonist.quote}
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onStart}
          className="candy mt-4 w-full px-5 py-3.5 text-[1rem]"
          style={{ '--face': acc.face, '--edge': acc.edge }}
        >
          Asumir el cargo →
        </button>
      </div>
    </div>
  )
}
