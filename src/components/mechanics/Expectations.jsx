import { useMemo, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import EducationalTooltip from '../EducationalTooltip.jsx'
import {
  initExpectations,
  playRound,
  isOver,
  outcomeTier,
  accionDisponible,
} from '../../utils/expectations.js'

// ─────────────────────────────────────────────────────────────────────────
// Expectations — mecánica del Episodio 4 (expectativas e inercia). Contrato
// común: (episode, allies, onComplete, onConceptSeen). Dos medidores:
// Expectativas (más bajo = mejor) y Credibilidad (más alto = mejor). Bajar las
// expectativas solo funciona con credibilidad; los congelamientos rebotan.
// ─────────────────────────────────────────────────────────────────────────

// Medidor. `goodWhenLow` invierte la escala de color (para Expectativas).
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

export default function Expectations({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.expectations
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initExpectations(cfg))
  const [report, setReport] = useState(null)
  const over = isOver(state, cfg)

  function elegir(accion) {
    if (over || !accionDisponible(state, accion)) return
    const { state: next, report: rep } = playRound(state, cfg, accion)
    setState(next)
    setReport(rep)
  }

  const tier = over ? outcomeTier(state, cfg) : null
  const advisor = report ? prisonersById[report.advisor] : null

  return (
    <div className="grain relative mx-auto max-w-md px-5 py-6">
      <div className="relative z-10">
        <h2 className="font-display text-2xl font-black text-paper">La Inercia</h2>
        <p className="mt-2 font-body text-[0.88rem] leading-snug text-paper-dim">{cfg.intro}</p>
        <div className="mt-2">
          <EducationalTooltip
            conceptId="expectativasAdaptativas"
            label="¿Por qué la inflación se autocumple?"
            onSeen={onConceptSeen}
          />
        </div>

        {/* Tablero */}
        <div className="mt-5 rounded-md border border-edge bg-cell-2/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
              {over ? 'Fin del intento' : `Mes ${state.ronda} de ${cfg.rondas}`}
            </span>
            {report?.reboteAplicado > 0 && !over && (
              <span className="rounded-sm border border-crisis/60 px-2 py-0.5 font-mono text-[0.54rem] uppercase tracking-wide text-crisis">
                ⚠️ El congelamiento se derritió
              </span>
            )}
          </div>
          <div className="space-y-3">
            <Meter
              label="Expectativas de inflación"
              value={state.expectativas}
              goodWhenLow
              hint="Lo que la gente espera que pase. Si lo bajas, la inflación cede sola."
            />
            <Meter
              label="Tu credibilidad"
              value={state.credibilidad}
              hint="Empieza por el piso: cinco planes fracasaron antes que el tuyo."
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
              ¿Qué haces este mes?
            </p>
            {cfg.acciones.map((a) => {
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
          </div>
        )}

        {/* Fin */}
        {over && (
          <div className="animate-fade-up mt-5">
            <p className="font-body text-[0.9rem] leading-snug text-paper/90">
              {state.credibilidad <= 0
                ? 'Tu credibilidad se agotó. Nadie cree una palabra más. El plan murió como los cinco anteriores.'
                : 'Se acabaron los meses de gracia. Veamos si rompiste la inercia.'}
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
