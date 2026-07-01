import { useMemo, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import EducationalTooltip from '../EducationalTooltip.jsx'
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
// Dos medidores (inflación invertida + apoyo). Imprimir dinero paga las cuentas
// pero acelera la espiral; la salida es la reforma monetaria a tiempo.
// ─────────────────────────────────────────────────────────────────────────

// Medidor. `goodWhenLow` invierte la escala de color (para Inflación).
function Meter({ label, value, hint, goodWhenLow = false }) {
  const good = goodWhenLow ? value <= 35 : value >= 55
  const mid = goodWhenLow ? value <= 60 : value >= 28
  const tone = good ? 'bg-positive' : mid ? 'bg-paper-dim' : 'bg-crisis'
  const num = good ? 'text-positive' : mid ? 'text-paper' : 'text-crisis'
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[0.62rem] uppercase tracking-wide text-paper-dim">
          {label}
        </span>
        <span className={`font-mono text-sm tabular-nums ${num}`}>{Math.round(value)}</span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-ink">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </div>
      {hint && <p className="mt-1 font-mono text-[0.54rem] text-paper-dim/70">{hint}</p>}
    </div>
  )
}

const fmtPrecio = (n) => n.toLocaleString('es-CL')

export default function HyperInflation({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.hyperinflation
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initHyperinflation(cfg))
  const [report, setReport] = useState(null)
  const over = isOver(state, cfg)

  function elegir(accion) {
    if (over || !accionDisponible(state, accion)) return
    const { state: next, report: rep } = playMonth(state, cfg, accion)
    setState(next)
    setReport(rep)
  }

  const tier = over ? outcomeTier(state, cfg) : null
  const advisor = report ? prisonersById[report.advisor] : null
  const normales = cfg.acciones.filter((a) => a.id !== 'reforma')
  const reforma = cfg.acciones.find((a) => a.id === 'reforma')

  return (
    <div className="grain relative mx-auto max-w-md px-5 py-6">
      <div className="relative z-10">
        <h2 className="font-display text-2xl font-black text-paper">La Imprenta</h2>
        <p className="mt-2 font-body text-[0.88rem] leading-snug text-paper-dim">{cfg.intro}</p>
        <div className="mt-2">
          <EducationalTooltip
            conceptId="senoreaje"
            label="¿Por qué imprimir dinero es una trampa?"
            onSeen={onConceptSeen}
          />
        </div>

        {/* Tablero */}
        <div className="mt-5 rounded-md border border-edge bg-cell-2/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
              {over ? 'Fin de la crisis' : `Mes ${state.mes} de ${cfg.meses}`}
            </span>
            <span className="font-mono text-[0.6rem] text-ticker">
              🍞 {fmtPrecio(precioPan(state.inflacion))} Marcos
            </span>
          </div>
          <div className="space-y-3">
            <Meter
              label="Inflación"
              value={state.inflacion}
              goodWhenLow
              hint="Imprimir la sube, y cada vez más rápido. Si llega al máximo, el Marco es papel."
            />
            <Meter
              label="Apoyo del pueblo"
              value={state.apoyo}
              hint="Baja con la inflación y con la austeridad. Si llega a 0, te derrocan."
            />
          </div>
        </div>

        {/* Reacción del asesor */}
        {report && advisor && (
          <div className="animate-fade-up mt-4 flex gap-3 rounded-md border border-edge bg-cell/70 p-3">
            <img
              src={portraits[advisor.id]}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full border border-edge object-cover"
            />
            <div className="min-w-0">
              <p className="font-mono text-[0.58rem] uppercase tracking-wide text-paper-dim">
                {advisor.name}
              </p>
              <p className="mt-1 font-body text-[0.84rem] italic leading-snug text-paper/90">
                {advisor.reaccion}
              </p>
            </div>
          </div>
        )}

        {/* Acciones */}
        {!over && (
          <div className="mt-5 space-y-2.5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
              ¿Cómo pagas las cuentas del Estado este mes?
            </p>
            {normales.map((a) => {
              const disp = accionDisponible(state, a)
              return (
                <button
                  key={a.id}
                  type="button"
                  disabled={!disp}
                  onClick={() => elegir(a)}
                  className={`block w-full rounded-md border p-3 text-left transition-all ${
                    disp
                      ? 'border-edge bg-cell/80 hover:border-paper-dim active:scale-[0.99]'
                      : 'cursor-not-allowed border-edge/50 bg-cell/30 opacity-45'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-[0.95rem] font-semibold text-paper">
                      {a.icon} {a.name}
                    </p>
                    <span className="shrink-0 font-mono text-[0.54rem] uppercase tracking-wide text-paper-dim">
                      {a.usos != null ? (disp ? `${a.usos - (state.usos[a.id] ?? 0)} uso` : 'usado') : ''}
                    </span>
                  </div>
                  <p className="mt-1 font-body text-[0.78rem] leading-snug text-paper-dim">{a.desc}</p>
                </button>
              )
            })}

            {/* Reforma — la salida decisiva */}
            {reforma && (
              <button
                type="button"
                onClick={() => elegir(reforma)}
                className="block w-full rounded-md border border-crisis bg-crisis/15 p-3 text-left transition-all hover:bg-crisis/25 active:scale-[0.99]"
              >
                <p className="font-display text-[0.95rem] font-semibold text-paper">
                  {reforma.icon} {reforma.name}{' '}
                  <span className="font-mono text-[0.54rem] uppercase tracking-wide text-crisis">
                    · termina la crisis
                  </span>
                </p>
                <p className="mt-1 font-body text-[0.78rem] leading-snug text-paper-dim">
                  {reforma.desc}
                </p>
              </button>
            )}
          </div>
        )}

        {/* Fin */}
        {over && (
          <div className="animate-fade-up mt-5">
            <p className="font-body text-[0.9rem] leading-snug text-paper/90">
              {state.derrocado
                ? 'El pueblo, harto de que el pan no alcance, te sacó del Ministerio.'
                : state.colapso
                  ? 'El Marco dejó de servir: la gente ya no lo acepta ni para empapelar.'
                  : state.reformo
                    ? 'Lanzaste la moneda nueva. Veamos si el pueblo le creyó.'
                    : 'Pasaron los meses. Es hora de ver qué quedó de Paicio.'}
            </p>
            <button
              type="button"
              onClick={() => onComplete(tier)}
              className="mt-4 w-full rounded-sm border border-crisis bg-crisis/15 px-5 py-3 font-display text-base font-semibold tracking-wide text-paper transition-all hover:bg-crisis/25 active:scale-[0.99]"
            >
              Ver el desenlace →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
