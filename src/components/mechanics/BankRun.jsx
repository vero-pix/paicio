import { useMemo, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import EducationalTooltip from '../EducationalTooltip.jsx'
import { sfx } from '../../lib/sound.js'
import { useScreenFx } from '../../lib/animations.js'
import Meter from './Meter.jsx'
import BankRunHero from './BankRunHero.jsx'
import ActionIcon from '../icons/ActionIcon.jsx'
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

export default function BankRun({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.bankRun
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initBankRun(cfg))
  const [report, setReport] = useState(null) // reacción del último día
  const [picked, setPicked] = useState(null)
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)

  function elegir(accion) {
    if (over || !accionDisponible(state, accion)) return
    sfx('click')
    setPicked(accion.id)
    setTimeout(() => setPicked(null), 260)
    const { state: next, report: rep } = playDay(state, cfg, accion)
    setState(next)
    setReport(rep)
    const bad = (s) => s.reservas <= 30 || s.confianza <= 30
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

  // Escalada ambiental: peor confianza o reservas bajas → el aire se enrarece.
  const decay = Math.max(
    0,
    Math.min(1, Math.max((55 - state.confianza) / 55, (45 - state.reservas) / 45)),
  )
  const calmed = state.confianza >= cfg.umbralCalma

  return (
    <div className={`grain relative mx-auto max-w-md px-5 py-6 ${fx === 'shake' ? 'animate-shake' : ''}`}>
      {/* Escalada ambiental — halo rojizo que crece con el pánico */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, transparent ${(54 - 14 * decay).toFixed(0)}%, rgba(72,10,6,${(0.6 * decay).toFixed(3)}) 100%)`,
          transition: 'background 0.9s ease-out',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: Number((0.55 * decay).toFixed(3)),
          mixBlendMode: 'overlay',
          transition: 'opacity 0.9s ease-out',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {fx === 'flash' && (
        <div className="animate-flash-green pointer-events-none fixed inset-0 z-40 bg-positive" aria-hidden />
      )}
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

        {/* Héroe: la escena de la corrida */}
        <div className="mt-4">
          <BankRunHero
            confianza={state.confianza}
            corralito={state.corralito}
            collapsed={state.colapso}
            calmed={calmed}
          />
        </div>

        {/* Tablero: medidores + día */}
        <div className="mt-4 rounded-md border border-edge bg-cell-2/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
              {over ? 'Fin de la crisis' : `Día ${state.dia} de ${cfg.dias}`}
            </span>
            {state.corralito && (
              <span className="flex items-center gap-1 rounded-sm border border-crisis/60 px-2 py-0.5 font-mono text-[0.54rem] uppercase tracking-wide text-crisis">
                <ActionIcon id="corralito" className="h-3 w-3 shrink-0" />
                Corralito activo
              </span>
            )}
          </div>
          <div className="space-y-3">
            <Meter
              label="Reservas del sistema"
              value={state.reservas}
              variant="vault"
              hint="Si llegan a 0, los bancos quiebran."
            />
            <Meter
              label="Confianza del público"
              value={state.confianza}
              variant="crowd"
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
            {cfg.acciones.map((a, i) => {
              const disp = accionDisponible(state, a)
              return (
                <button
                  key={a.id}
                  type="button"
                  disabled={!disp}
                  onClick={() => elegir(a)}
                  style={{ animationDelay: `${i * 0.09}s` }}
                  className={`animate-fade-up block w-full rounded-md border p-3 text-left transition-all ${
                    picked === a.id
                      ? 'border-paper bg-cell'
                      : disp
                        ? 'border-edge bg-cell/80 hover:border-paper-dim active:scale-[0.99]'
                        : 'cursor-not-allowed border-edge/50 bg-cell/30 opacity-45'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2 font-display text-[0.95rem] font-semibold text-paper">
                      <ActionIcon id={a.id} className="h-[18px] w-[18px] shrink-0 text-[#c9a24b]" />
                      {a.name}
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
