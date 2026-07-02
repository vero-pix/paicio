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
  initExpectations,
  playRound,
  isOver,
  outcomeTier,
  accionDisponible,
} from '../../utils/expectations.js'

// ─────────────────────────────────────────────────────────────────────────
// Expectations — mecánica del Episodio 4 (expectativas e inercia). Rediseño
// LatAm: misma lógica (initExpectations/playRound/isOver/outcomeTier), solo look.
// Dos medidores: Expectativas (más bajo = mejor) y Credibilidad (más alto = mejor).
// ─────────────────────────────────────────────────────────────────────────

export default function Expectations({ episode, onComplete, onConceptSeen }) {
  const cfg = episode.expectations
  const acc = accentFor(episode.id)
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [state, setState] = useState(() => initExpectations(cfg))
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
    const bad = (s) => s.expectativas >= 70 || s.credibilidad <= 30
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
  const rebote = report?.reboteAplicado > 0 && !over

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#FBE6C2)`}
    >
      <TopBar
        title="La Inercia"
        crisis="Inercia inflacionaria"
        accent={acc}
        pill={over ? 'Fin' : `Mes ${state.ronda} / ${cfg.rondas}`}
      />

      <div className="mt-2 flex items-center gap-2">
        <EduChip
          conceptId="expectativasAdaptativas"
          label="¿Por qué la inflación se autocumple?"
          onSeen={onConceptSeen}
        />
        {rebote && (
          <span
            className="rounded-full px-2.5 py-1 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide"
            style={{ background: '#FBDAD3', color: '#D24C39' }}
          >
            El congelamiento se derritió
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2.5">
        <LifeBar variant="flame" label="Expectativas de inflación" value={state.expectativas} />
        <LifeBar variant="crowd" label="Tu credibilidad" value={state.credibilidad} />
      </div>

      {report && advisor && report.reaccion && (
        <AdvisorBubble
          portrait={portraits[advisor.id]}
          name={advisor.name}
          nameColor={acc.edge}
          text={report.reaccion}
        />
      )}

      {!over && (
        <div className="mt-4">
          <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
            ¿Qué haces este mes?
          </p>
          <div className="mt-2 space-y-2">
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
                  meta={a.usos != null ? (disp ? `${restantes} uso` : 'usado') : undefined}
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
            state.credibilidad <= 0
              ? 'Tu credibilidad se agotó. Nadie cree una palabra más. El plan murió como los cinco anteriores.'
              : 'Se acabaron los meses de gracia. Veamos si rompiste la inercia.'
          }
          onComplete={() => onComplete(tier)}
        />
      )}
    </MechanicShell>
  )
}
