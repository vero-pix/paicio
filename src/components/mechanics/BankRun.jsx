import { useMemo, useState } from 'react'
import { portraits } from '../../assets/portraits.js'
import { sfx } from '../../lib/sound.js'
import { useScreenFx } from '../../lib/animations.js'
import { accentFor } from '../../theme/accents.js'
import {
  MechanicShell,
  TopBar,
  LifeBar,
  AdvisorBubble,
  CandyAction,
  EndPanel,
  EduChip,
  ACTION_PALETTE,
} from './candyKit.jsx'
import {
  initBankRun,
  playDay,
  isOver,
  outcomeTier,
  accionDisponible,
} from '../../utils/bankRun.js'

// ─────────────────────────────────────────────────────────────────────────
// BankRun — mecánica del Episodio 2 (corrida bancaria). Rediseño LatAm: mismo
// contrato y misma lógica (initBankRun/playDay/isOver/outcomeTier), solo cambia
// la presentación al estilo claro (medidores + botones candy).
// ─────────────────────────────────────────────────────────────────────────

export default function BankRun({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.bankRun
  const acc = accentFor(episode.id)
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initBankRun(cfg))
  const [report, setReport] = useState(null)
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

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#FBE6C2)`}
    >
      <TopBar
        title="La Corrida"
        crisis="Corrida bancaria"
        accent={acc}
        pill={over ? 'Fin' : `Día ${state.dia} / ${cfg.dias}`}
      />

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="corridaBancaria"
          label="¿Qué es una corrida bancaria?"
          onSeen={onConceptSeen}
        />
        {state.corralito && (
          <span
            className="rounded-full px-2.5 py-1 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
            style={{ background: '#FBDAD3', color: '#D24C39' }}
          >
            Corralito activo
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <LifeBar variant="vault" label="Reservas del sistema" value={state.reservas} />
        <LifeBar variant="crowd" label="Confianza del público" value={state.confianza} />
      </div>

      {report && advisor && (
        <AdvisorBubble
          portrait={portraits[advisor.id]}
          name={advisor.name}
          nameColor={acc.edge}
          subtitle={`retiro del día: −${report.retiro}`}
          text={advisor.reaccion}
        />
      )}

      {!over && (
        <div className="mt-5">
          <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
            Elige una medida para hoy
          </p>
          <div className="mt-2.5 space-y-2.5">
            {cfg.acciones.map((a, i) => {
              const disp = accionDisponible(state, a)
              const restantes = a.usos != null ? a.usos - (state.usos[a.id] ?? 0) : null
              const pal = ACTION_PALETTE[i % ACTION_PALETTE.length]
              return (
                <CandyAction
                  key={a.id}
                  id={a.id}
                  face={pal.face}
                  edge={pal.edge}
                  name={a.name}
                  hint={a.desc}
                  meta={
                    a.usos != null
                      ? disp
                        ? `${restantes} uso`
                        : 'usado'
                      : a.decae
                        ? 'se desgasta'
                        : undefined
                  }
                  disabled={!disp}
                  picked={picked === a.id}
                  onClick={() => elegir(a)}
                />
              )
            })}
          </div>
        </div>
      )}

      {over && (
        <EndPanel
          text={
            state.colapso
              ? 'Las reservas se agotaron. No hay vuelta atrás.'
              : 'Pasaron los días. Es hora de ver en qué quedó Paicio.'
          }
          onComplete={() => onComplete(tier)}
        />
      )}
    </MechanicShell>
  )
}
