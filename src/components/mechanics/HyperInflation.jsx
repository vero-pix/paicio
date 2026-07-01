import { useMemo, useRef, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import EducationalTooltip from '../EducationalTooltip.jsx'
import { sfx } from '../../lib/sound.js'
import { useScreenFx, useCountUp } from '../../lib/animations.js'
import ActionIcon from '../icons/ActionIcon.jsx'
import { accentFor } from '../../theme/accents.js'
import {
  initHyperinflation,
  playMonth,
  isOver,
  outcomeTier,
  accionDisponible,
  precioPan,
} from '../../utils/hyperinflation.js'

// ─────────────────────────────────────────────────────────────────────────
// HyperInflation — mecánica del Episodio 1 (hiperinflación de Weimar).
// Contrato común: (episode, allies, onComplete, onConceptSeen).
//
// REDISEÑO LatAm (capa de presentación): medidores "barra de vida", cifra
// protagonista en card oscura, asesor en marco-moneda y grid 2×2 de acciones
// táctiles. La lógica (initHyperinflation / playMonth / isOver / outcomeTier)
// es la misma de antes: acá solo cambia el look.
// ─────────────────────────────────────────────────────────────────────────

const fmt = (n) => Math.round(n).toLocaleString('es-CL')

// Acento táctil por acción (face + labio 3D).
const ACTION_ACCENT = {
  imprimir: { face: '#F5A524', edge: '#D6871A' },
  ajuste: { face: '#F06A54', edge: '#D24C39' },
  renegociar: { face: '#4FA3E3', edge: '#2F82C4' },
  reforma: { face: '#35B98A', edge: '#1F9A6E' },
}

// Hint corto para la celda de la acción (el desc largo vive en los datos).
function actionHint(a, restantes) {
  switch (a.id) {
    case 'imprimir':
      return 'Paga hoy · +inflación'
    case 'ajuste':
      return '−inflación · −apoyo'
    case 'renegociar':
      return `Alivio · ${restantes} ${restantes === 1 ? 'uso' : 'usos'}`
    case 'reforma':
      return 'La salida real'
    default:
      return a.desc
  }
}

// Íconos de medidor (heredan color con currentColor).
const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 .6 2 2 2 0-2-1-4 0-6z" />
  </svg>
)
const CrowdIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <circle cx="6" cy="8" r="1.6" />
    <circle cx="12" cy="7" r="1.6" />
    <circle cx="18" cy="8" r="1.6" />
    <path d="M3 17c0-2 1.5-3 3-3s3 1 3 3" />
    <path d="M9 16c0-2 1.5-3 3-3s3 1 3 3" />
    <path d="M15 17c0-2 1.5-3 3-3s3 1 3 3" />
  </svg>
)

// Barra de vida temática (icono + label + valor + track con relleno degradado).
function LifeBar({ icon, iconColor, label, value, fill, valueColor, tint }) {
  const pct = Math.max(0, Math.min(100, value))
  const display = Math.round(useCountUp(value, 700))
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
        style={{ background: tint, color: iconColor }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <span className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-mute">
            {label}
          </span>
          <span
            className="font-round text-[0.82rem] font-bold tabular-nums"
            style={{ color: valueColor }}
          >
            {display}%
          </span>
        </div>
        <div
          className="mt-1 h-2.5 overflow-hidden rounded-full"
          style={{ background: '#F3E2C2', boxShadow: 'inset 0 1px 2px rgba(140,90,30,.25)' }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: fill, transition: 'width 0.6s ease-out' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function HyperInflation({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.hyperinflation
  const acc = accentFor(episode.id)
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initHyperinflation(cfg))
  const [report, setReport] = useState(null)
  const [picked, setPicked] = useState(null)
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)

  // Precio del pan (dato del juego) y su salto respecto al mes anterior. El ref
  // se fija dentro de elegir() (una vez por decisión), así el delta no se borra
  // con los re-renders del count-up de los medidores.
  const precio = precioPan(state.inflacion)
  const prevMonthPrice = useRef(null)
  const deltaPct = prevMonthPrice.current
    ? Math.round((precio / prevMonthPrice.current - 1) * 100)
    : 0

  function elegir(accion) {
    if (over || !accionDisponible(state, accion)) return
    sfx('click')
    prevMonthPrice.current = precioPan(state.inflacion) // precio del mes que se deja
    setPicked(accion.id)
    setTimeout(() => setPicked(null), 260)
    const { state: next, report: rep } = playMonth(state, cfg, accion)
    setState(next)
    setReport(rep)
    const bad = (s) => s.inflacion >= 70 || s.apoyo <= 30
    if (bad(next) && !bad(state)) {
      sfx('alert')
      trigger('shake')
    } else if (!bad(next) && !isOver(next, cfg)) {
      sfx('advance')
      trigger('flash')
    }
  }

  const tier = over ? outcomeTier(state, cfg) : null
  const advisor = report ? prisonersById[report.advisor] : null

  return (
    <div className={`on-cream relative ${fx === 'shake' ? 'animate-shake' : ''}`}>
      {/* Fondo luminoso de pantalla (cubre el viewport de esta mecánica). */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg,#FFF3DA,#FBE6C2)' }}
      />
      {fx === 'flash' && (
        <div
          className="animate-flash-green pointer-events-none fixed inset-0 z-40"
          style={{ background: 'var(--color-good)' }}
          aria-hidden
        />
      )}

      <div className="mx-auto max-w-md px-5 pb-10 pt-1">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-round text-[1.3rem] font-bold leading-none text-ink-warm">
              {episode.titulo}
            </h2>
            <p
              className="mt-1 font-nunito text-[0.66rem] font-extrabold uppercase tracking-wide"
              style={{ color: acc.edge }}
            >
              {episode.crisisHistorica}
            </p>
          </div>
          <span
            className="candy shrink-0 px-3.5 py-2 text-[0.8rem]"
            style={{ '--face': acc.face, '--edge': acc.edge }}
          >
            {over ? 'Fin' : `Mes ${state.mes} / ${cfg.meses}`}
          </span>
        </div>

        {/* Medidores */}
        <div className="mt-5 space-y-3">
          <LifeBar
            icon={<FlameIcon />}
            iconColor="#E8604F"
            tint="#FBDAD3"
            label="Inflación"
            value={state.inflacion}
            fill="linear-gradient(90deg,#F5A524,#E8604F)"
            valueColor="#E8604F"
          />
          <LifeBar
            icon={<CrowdIcon />}
            iconColor="#2FB37E"
            tint="#D6F0E5"
            label="Apoyo popular"
            value={state.apoyo}
            fill="linear-gradient(90deg,#7FD3A6,#2FB37E)"
            valueColor="#2FB37E"
          />
        </div>

        {/* Cifra protagonista — el precio del pan */}
        <div
          className="shadow-card-dark relative mt-5 overflow-hidden rounded-[24px] p-4"
          style={{ background: 'linear-gradient(160deg,#3B2A17,#26190B)' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,179,49,.25), transparent 70%)' }}
          />
          <div className="relative flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[#F3E2C2] text-[1.9rem]">
              🍞
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-[#E8C67F]">
                Precio del pan · hoy
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  key={Math.round(precio)}
                  className="animate-pop font-round text-[2.6rem] font-bold leading-none tabular-nums text-[#FFE9A8]"
                >
                  {fmt(precio)}
                </span>
                <span className="font-round text-[0.9rem] font-semibold text-[#C9A24B]">
                  {cfg.moneda ?? 'Mk'}
                </span>
              </div>
            </div>
            {deltaPct > 0 && (
              <span
                className="candy shrink-0 self-start px-2.5 py-1.5 text-center text-[0.62rem] font-extrabold leading-tight"
                style={{ '--face': '#E8604F', '--edge': '#C43D2C' }}
              >
                ▲ {deltaPct}%
                <span className="block text-[0.5rem] font-bold opacity-90">en 1 mes</span>
              </span>
            )}
          </div>
          <div className="relative mt-2">
            <EducationalTooltip
              conceptId="senoreaje"
              label="¿Por qué imprimir es una trampa?"
              onSeen={onConceptSeen}
            />
          </div>
        </div>

        {/* Asesor */}
        {report && advisor && (
          <div className="animate-fade-up mt-4 flex items-start gap-3">
            <span className="coin shrink-0 rounded-full p-[3px]">
              <img
                src={portraits[advisor.id]}
                alt=""
                className="h-12 w-12 rounded-full border-2 border-white object-cover"
              />
            </span>
            <div
              className="shadow-card min-w-0 flex-1 rounded-[18px] rounded-tl-[5px] bg-surface p-3"
            >
              <p
                className="font-round text-[0.78rem] font-bold"
                style={{ color: acc.edge }}
              >
                {advisor.name}
              </p>
              <p className="mt-0.5 font-nunito text-[0.82rem] leading-snug text-ink-soft">
                {report.reaccion}
              </p>
            </div>
          </div>
        )}

        {/* Acciones */}
        {!over && (
          <div className="mt-5">
            <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
              ¿Qué haces este mes?
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              {cfg.acciones.map((a) => {
                const disp = accionDisponible(state, a)
                const restantes = a.usos != null ? a.usos - (state.usos[a.id] ?? 0) : null
                const ac = ACTION_ACCENT[a.id] ?? { face: acc.face, edge: acc.edge }
                return (
                  <button
                    key={a.id}
                    type="button"
                    disabled={!disp}
                    onClick={() => elegir(a)}
                    className={`candy p-3 text-left ${picked === a.id ? 'translate-y-1' : ''}`}
                    style={{ '--face': ac.face, '--edge': ac.edge }}
                  >
                    <span className="flex items-center gap-2">
                      <ActionIcon id={a.id} className="h-5 w-5 shrink-0 text-white" />
                      <span className="font-round text-[0.92rem] font-bold leading-tight">
                        {a.name}
                      </span>
                    </span>
                    <span className="mt-1 block font-nunito text-[0.66rem] font-extrabold leading-tight text-white/85">
                      {actionHint(a, restantes)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Fin */}
        {over && (
          <div className="animate-fade-up mt-5">
            <p className="font-nunito text-[0.92rem] leading-snug text-ink-soft">
              {state.derrocado
                ? 'El pueblo, harto de que el pan no alcance, te sacó del Ministerio.'
                : state.colapso
                  ? 'El peso dejó de servir: la gente ya no lo acepta ni regalado.'
                  : state.reformo
                    ? 'Aplicaste el plan de estabilización. Veamos si el pueblo le creyó.'
                    : 'Pasaron los meses. Es hora de ver qué quedó de Paicio.'}
            </p>
            <button
              type="button"
              onClick={() => onComplete(tier)}
              className="candy mt-4 w-full px-5 py-3.5 text-[1rem]"
              style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
            >
              Ver el desenlace →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
