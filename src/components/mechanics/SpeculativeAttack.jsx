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
  CRISIS_ACCENT,
} from './candyKit.jsx'
import {
  initSpecAttack,
  playRound,
  isOver,
  outcomeTier,
  accionDisponible,
} from '../../utils/speculativeAttack.js'

// ─────────────────────────────────────────────────────────────────────────
// SpeculativeAttack — mecánica del Episodio 3 (defender la paridad). Rediseño
// LatAm: misma lógica (initSpecAttack/playRound/isOver/outcomeTier), solo cambia
// la presentación. Dos medidores + acciones defensivas + la salida (devaluar).
// ─────────────────────────────────────────────────────────────────────────

export default function SpeculativeAttack({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.speculativeAttack
  const acc = accentFor(episode.id)
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
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#FBE6C2)`}
    >
      <TopBar
        title="La Defensa"
        crisis="Defender la paridad"
        accent={acc}
        pill={over ? 'Fin' : `Ronda ${state.dia} / ${cfg.dias}`}
      />

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="ataqueEspeculativo"
          label="¿Qué es un ataque especulativo?"
          onSeen={onConceptSeen}
        />
        {!over && (
          <span
            className="rounded-full px-2.5 py-1 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
            style={{ background: acc.soft, color: acc.edge }}
          >
            Paridad bajo ataque
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <LifeBar variant="vault" label="Reservas internacionales" value={state.reservas} />
        <LifeBar variant="crowd" label="Empleo" value={state.empleo} />
      </div>

      {report && advisor && (
        <AdvisorBubble
          portrait={portraits[advisor.id]}
          name={advisor.name}
          nameColor={acc.edge}
          subtitle={report.drenaje > 0 ? `reservas perdidas: −${report.drenaje}` : undefined}
          text={advisor.reaccion}
        />
      )}

      {!over && (
        <div className="mt-5">
          <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
            ¿Cómo respondes hoy?
          </p>
          <div className="mt-2.5 space-y-2.5">
            {defensivas.map((a, i) => {
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
                  meta={a.usos != null ? (disp ? `${restantes} uso` : 'usado') : undefined}
                  disabled={!disp}
                  picked={picked === a.id}
                  onClick={() => elegir(a)}
                />
              )
            })}
            {devaluar && (
              <CandyAction
                id={devaluar.id}
                face={CRISIS_ACCENT.face}
                edge={CRISIS_ACCENT.edge}
                name={devaluar.name}
                hint={devaluar.desc}
                meta="termina la crisis"
                picked={picked === devaluar.id}
                onClick={() => elegir(devaluar)}
              />
            )}
          </div>
        </div>
      )}

      {over && (
        <EndPanel
          text={
            state.colapso
              ? 'Las reservas se agotaron defendiendo lo indefendible. La devaluación llegó igual, pero caótica.'
              : state.devaluado
                ? 'Soltaste la paridad. Veamos si fue a tiempo.'
                : 'Aguantaste hasta el final. La paridad sigue en pie… por ahora.'
          }
          onComplete={() => onComplete(tier)}
        />
      )}
    </MechanicShell>
  )
}
