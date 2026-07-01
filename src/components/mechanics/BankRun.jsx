import { useMemo, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import EducationalTooltip from '../EducationalTooltip.jsx'
import { sfx } from '../../lib/sound.js'
import {
  initBankRun,
  playDay,
  isOver,
  outcomeTier,
  accionDisponible,
} from '../../utils/bankRun.js'

// ─────────────────────────────────────────────────────────────────────────
// BankRun — mecánica del Episodio 2 (corrida bancaria / juego de coordinación).
// Contrato común: (episode, allies, onComplete, onConceptSeen).
// Maneja dos medidores (reservas, confianza) durante varios días; cada día el
// jugador elige una acción y un asesor reacciona. Al terminar, llama
// onComplete(tier) con 'perfect' | 'partial' | 'wrong'.
// ─────────────────────────────────────────────────────────────────────────

// Medidor horizontal con color por nivel.
function Meter({ label, value, hint }) {
  const tone = value >= 55 ? 'bg-positive' : value >= 28 ? 'bg-paper-dim' : 'bg-crisis'
  const num = value >= 55 ? 'text-positive' : value >= 28 ? 'text-paper' : 'text-crisis'
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

export default function BankRun({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.bankRun
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initBankRun(cfg))
  const [report, setReport] = useState(null) // reacción del último día
  const over = isOver(state, cfg)

  function elegir(accion) {
    if (over || !accionDisponible(state, accion)) return
    sfx('click')
    const { state: next, report: rep } = playDay(state, cfg, accion)
    setState(next)
    setReport(rep)
    const bad = (s) => s.reservas <= 30 || s.confianza <= 30
    if (bad(next) && !bad(state)) sfx('alert')
    else if (!bad(next) && !isOver(next, cfg)) sfx('advance')
  }

  const tier = over ? outcomeTier(state, cfg) : null
  const advisor = report ? prisonersById[report.advisor] : null

  return (
    <div className="grain relative mx-auto max-w-md px-5 py-6">
      <div className="relative z-10">
        <h2 className="font-display text-2xl font-black text-paper">La Corrida</h2>
        <p className="mt-2 font-body text-[0.88rem] leading-snug text-paper-dim">
          {cfg.intro}
        </p>
        <div className="mt-2">
          <EducationalTooltip
            conceptId="corridaBancaria"
            label="¿Qué es una corrida bancaria?"
            onSeen={onConceptSeen}
          />
        </div>

        {/* Tablero: medidores + día */}
        <div className="mt-5 rounded-md border border-edge bg-cell-2/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
              {over ? 'Fin de la crisis' : `Día ${state.dia} de ${cfg.dias}`}
            </span>
            {state.corralito && (
              <span className="rounded-sm border border-crisis/60 px-2 py-0.5 font-mono text-[0.54rem] uppercase tracking-wide text-crisis">
                🔒 Corralito activo
              </span>
            )}
          </div>
          <div className="space-y-3">
            <Meter
              label="Reservas del sistema"
              value={state.reservas}
              hint="Si llegan a 0, los bancos quiebran."
            />
            <Meter
              label="Confianza del público"
              value={state.confianza}
              hint="Más confianza = menos gente corre a sacar su plata."
            />
          </div>
        </div>

        {/* Reacción del asesor tras la última acción */}
        {report && advisor && (
          <div className="animate-fade-up mt-4 flex gap-3 rounded-md border border-edge bg-cell/70 p-3">
            <img
              src={portraits[advisor.id]}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full border border-edge object-cover"
            />
            <div className="min-w-0">
              <p className="font-mono text-[0.58rem] uppercase tracking-wide text-paper-dim">
                {advisor.name} · retiro del día: −{report.retiro}
              </p>
              <p className="mt-1 font-body text-[0.84rem] italic leading-snug text-paper/90">
                {advisor.reaccion}
              </p>
            </div>
          </div>
        )}

        {/* Acciones (mientras dure la crisis) */}
        {!over && (
          <div className="mt-5 space-y-2.5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
              Elige una medida para hoy
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
                      {a.usos != null
                        ? disp
                          ? `${a.usos - (state.usos[a.id] ?? 0)} uso`
                          : 'usado'
                        : a.decae
                          ? 'se desgasta'
                          : ''}
                    </span>
                  </div>
                  <p className="mt-1 font-body text-[0.78rem] leading-snug text-paper-dim">
                    {a.desc}
                  </p>
                </button>
              )
            })}
          </div>
        )}

        {/* Fin de la crisis: pasar al desenlace */}
        {over && (
          <div className="animate-fade-up mt-5">
            <p className="font-body text-[0.9rem] leading-snug text-paper/90">
              {state.colapso
                ? 'Las reservas se agotaron. No hay vuelta atrás.'
                : 'Pasaron los días. Es hora de ver en qué quedó Paicio.'}
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
