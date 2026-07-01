import { useMemo, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import EducationalTooltip from '../EducationalTooltip.jsx'
import { sfx } from '../../lib/sound.js'
import { useScreenFx } from '../../lib/animations.js'
import Meter from './Meter.jsx'
import {
  initSpecAttack,
  playRound,
  isOver,
  outcomeTier,
  accionDisponible,
} from '../../utils/speculativeAttack.js'

// ─────────────────────────────────────────────────────────────────────────
// SpeculativeAttack — mecánica del Episodio 3 (defender la paridad / guerra de
// desgaste). Contrato común: (episode, allies, onComplete, onConceptSeen).
// Dos medidores (reservas, empleo). El ataque crece cada ronda; defender cuesta
// reservas o empleo. Devaluar termina la crisis. Al final llama onComplete(tier).
// ─────────────────────────────────────────────────────────────────────────

export default function SpeculativeAttack({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.speculativeAttack
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initSpecAttack(cfg))
  const [report, setReport] = useState(null)
  const [picked, setPicked] = useState(null)
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)

  function elegir(accion) {
    if (over || !accionDisponible(state, accion)) return
    sfx('click')
    setPicked(accion.id)
    setTimeout(() => setPicked(null), 260)
    const { state: next, report: rep } = playRound(state, cfg, accion)
    setState(next)
    setReport(rep)
    const bad = (s) => s.reservas <= 30 || s.empleo <= 30
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
  const defensivas = cfg.acciones.filter((a) => a.id !== 'devaluar')
  const devaluar = cfg.acciones.find((a) => a.id === 'devaluar')

  return (
    <div className={`grain relative mx-auto max-w-md px-5 py-6 ${fx === 'shake' ? 'animate-shake' : ''}`}>
      {fx === 'flash' && (
        <div className="animate-flash-green pointer-events-none fixed inset-0 z-40 bg-positive" aria-hidden />
      )}
      <div className="relative z-10">
        <h2 className="font-display text-2xl font-black text-paper">La Defensa</h2>
        <p className="mt-2 font-body text-[0.88rem] leading-snug text-paper-dim">{cfg.intro}</p>
        <div className="mt-2">
          <EducationalTooltip
            conceptId="ataqueEspeculativo"
            label="¿Qué es un ataque especulativo?"
            onSeen={onConceptSeen}
          />
        </div>

        {/* Tablero */}
        <div className="mt-5 rounded-md border border-edge bg-cell-2/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
              {over ? 'Fin de la batalla cambiaria' : `Ronda ${state.dia} de ${cfg.dias}`}
            </span>
            {!over && (
              <span className="rounded-sm border border-paper-dim/50 px-2 py-0.5 font-mono text-[0.54rem] uppercase tracking-wide text-paper-dim">
                ⚔️ Paridad bajo ataque
              </span>
            )}
          </div>
          <div className="space-y-3">
            <Meter
              label="Reservas internacionales"
              value={state.reservas}
              hint="La munición para defender la paridad. Si llegan a 0, devaluación caótica."
            />
            <Meter
              label="Empleo"
              value={state.empleo}
              hint="Subir las tasas defiende la moneda pero destruye empleo."
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
                {report.drenaje > 0 ? ` · reservas perdidas: −${report.drenaje}` : ''}
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
              ¿Cómo respondes hoy?
            </p>
            {defensivas.map((a, i) => {
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

            {/* Devaluar — la salida decisiva */}
            {devaluar && (
              <button
                type="button"
                onClick={() => elegir(devaluar)}
                className="block w-full rounded-md border border-crisis bg-crisis/15 p-3 text-left transition-all hover:bg-crisis/25 active:scale-[0.99]"
              >
                <p className="font-display text-[0.95rem] font-semibold text-paper">
                  {devaluar.icon} {devaluar.name}{' '}
                  <span className="font-mono text-[0.54rem] uppercase tracking-wide text-crisis">
                    · termina la crisis
                  </span>
                </p>
                <p className="mt-1 font-body text-[0.78rem] leading-snug text-paper-dim">
                  {devaluar.desc}
                </p>
              </button>
            )}
          </div>
        )}

        {/* Fin */}
        {over && (
          <div className="animate-fade-up mt-5">
            <p className="font-body text-[0.9rem] leading-snug text-paper/90">
              {state.colapso
                ? 'Las reservas se agotaron defendiendo lo indefendible. La devaluación llegó igual, pero caótica.'
                : state.devaluado
                  ? 'Soltaste la paridad. Veamos si fue a tiempo.'
                  : 'Aguantaste hasta el final. La paridad sigue en pie… por ahora.'}
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
