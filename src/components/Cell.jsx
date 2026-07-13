import { accentFor } from '../theme/accents.js'
import { briefingFor } from '../theme/briefings.js'

const BRIEFING_KEY = 'paicio.briefings.v1'
function markSeen(episodeId) {
  try {
    const raw = localStorage.getItem(BRIEFING_KEY)
    const seen = raw ? JSON.parse(raw) : []
    if (Array.isArray(seen) && !seen.includes(episodeId)) {
      seen.push(episodeId)
      localStorage.setItem(BRIEFING_KEY, JSON.stringify(seen))
    }
  } catch { /* no crítico */ }
}

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
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg,#FFEFD2,#FBE2BE)' }}
      />

      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 pb-8 pt-1">
        {/* Chip + título */}
        <div className="flex justify-end">
          <span
            className="candy whitespace-nowrap px-3.5 py-2 text-[0.8rem]"
            style={{ '--face': acc.face, '--edge': acc.edge }}
          >
            {pais} · {episode.año}
          </span>
        </div>

        <span
          className="mt-4 inline-block w-fit rounded-full px-2.5 py-1 font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide"
          style={{ background: acc.soft, color: acc.edge }}
        >
          {episode.crisisHistorica} · Nivel {episode.numero}
        </span>

        <h1 className="mt-2 text-balance font-round text-[2.1rem] font-bold leading-[1.05] text-ink-warm">
          {episode.titulo}
        </h1>
        <p className="mt-1 font-nunito text-[0.92rem] leading-snug text-ink-soft">
          {episode.resumen}
        </p>

        {/* Dato clave + misión combinados */}
        <div className="shadow-card-dark relative mt-5 overflow-hidden rounded-[24px] p-4"
          style={{ background: 'linear-gradient(160deg,#3B2A17,#26190B)' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,179,49,.25), transparent 70%)' }}
          />
          <div className="relative">
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F3E2C2] text-[1.6rem]">
                {acc.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#E8C67F]">
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
                className="shrink-0 self-start rounded-full px-2 py-1 font-nunito text-[0.68rem] font-extrabold uppercase"
                style={{ background: 'rgba(232,96,79,.2)', color: '#F5A88F' }}
              >
                ▲ y subiendo
              </span>
            </div>

            <div className="mt-3 flex items-start gap-3 rounded-[14px] bg-white/10 p-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: '#DCEBFA', color: '#2F82C4' }}
              >
                <TargetIcon />
              </span>
              <div className="min-w-0">
                <p className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-[#C9A24B]">
                  Tu misión
                </p>
                <p className="mt-0.5 font-round text-[0.85rem] font-semibold leading-snug text-[#FFE9A8]">
                  {brief.mission}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Antagonista compacto */}
        <div className="mt-3 flex items-center gap-2">
          <span className="coin flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full p-[2px]">
            <img
              src={brief.antagonist.portrait}
              alt=""
              className="h-full w-full rounded-full border-2 border-white object-cover"
            />
          </span>
          <p className="font-nunito text-[0.72rem] italic leading-snug text-ink-mute">
            <span className="font-extrabold text-ink-soft" style={{ color: acc.edge }}>
              {brief.antagonist.name}
            </span>
            : {brief.antagonist.quote}
          </p>
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <button
          type="button"
          onClick={() => { markSeen(episode.id); onStart() }}
          className="candy mt-4 w-full px-5 py-3.5 text-[1rem]"
          style={{ '--face': acc.face, '--edge': acc.edge }}
        >
          Asumir el cargo →
        </button>
      </div>
    </div>
  )
}
