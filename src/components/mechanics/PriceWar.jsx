import { useMemo, useRef, useState } from 'react'
import { sfx } from '../../lib/sound.js'
import { useScreenFx } from '../../lib/animations.js'
import { accentFor } from '../../theme/accents.js'
import CoachMarks from '../CoachMarks.jsx'
import { useTutorial } from '../../hooks/useTutorial.js'
import {
  MechanicShell,
  TopBar,
  EndPanel,
  EduChip,
  ComboBadge,
  GoldFlash,
} from './candyKit.jsx'
import Coins from './Coins.jsx'
import GameProgress from './GameProgress.jsx'
import { useGameLayer } from '../../hooks/useGameLayer.js'
import { initPriceWar, jugadaRival, pago, applyRound, isOver, outcomeTier } from '../../utils/priceWar.js'

// ─────────────────────────────────────────────────────────────────────────
// PROTOTIPO (línea Micro) — "El Dilema" / decidir con contraparte.
// Eliges coludir (precio alto) o competir (bajar); la otra gasolinera reacciona.
// Eliges → lees la reacción y los pagos → continúas. Enruta por mechanic 'priceWar'.
// ─────────────────────────────────────────────────────────────────────────

const METERS = [{ key: 'tuTotal', label: 'Tu ganancia', goodWhen: 'high' }]

const VEREDICTO = {
  CC: { txt: '🤝 Colusión: a los dos les fue bien.', color: '#1F9A6E' },
  DC: { txt: '😈 Le robaste los clientes… por ahora.', color: '#D6871A' },
  CD: { txt: '😳 Te robaron los clientes.', color: '#C43D2C' },
  DD: { txt: '💥 Guerra de precios: los dos perdieron.', color: '#C43D2C' },
}
const label = (m) => (m === 'C' ? 'Mantuvo el precio alto' : 'Bajó el precio')
const chip = (m) => (m === 'C' ? '🤝' : '🔻')

export default function PriceWar({ episode, dailySeed, onComplete, onConceptSeen }) {
  const cfg = useMemo(() => episode.priceWar, [episode])
  const acc = accentFor(episode.id)

  const [state, setState] = useState(() => initPriceWar(cfg, dailySeed))
  const [pending, setPending] = useState(null) // { mi, su, p, next } — resultado a leer
  const { fx, trigger } = useScreenFx()
  const over = isOver(state, cfg)
  const tier = over ? outcomeTier(state, cfg) : null
  const gl = useGameLayer({ eventos: [], totalTurns: cfg.rondas, meters: METERS, trigger, seed: dailySeed })

  const goalRef = useRef(null)
  const metersRef = useRef(null)
  const actionsRef = useRef(null)
  const tut = useTutorial(episode.id, {
    refByTarget: { goal: goalRef, meters: metersRef, actions: actionsRef },
    over,
    pendingEvent: null,
    firstTurnActive: state.ronda === 1,
  })

  function elegir(mi) {
    if (pending || over) return
    sfx('click')
    const su = jugadaRival(state)
    const p = pago(cfg, mi, su)
    setPending({ mi, su, p, next: applyRound(state, cfg, mi) })
  }

  function continuar() {
    if (!pending) return
    sfx('click')
    const next = pending.next
    const gameOver = isOver(next, cfg)
    const win = gameOver && outcomeTier(next, cfg) === 'perfect'
    gl.onTurn(state, next, { over: gameOver, win })
    if (pending.mi === 'D' && pending.su === 'D') trigger('shake')
    else if (pending.mi === 'C' && pending.su === 'C') sfx('coin')
    setPending(null)
    setState(next)
  }

  const endText =
    tier === 'perfect'
      ? 'Sostuviste la colaboración pese a la tentación de traicionar: a los dos les fue bien y evitaste la guerra de precios. Eso es lo difícil del dilema — cooperar conviene, pero solo si logras confiar (y que confíen en ti) jugada tras jugada.'
      : tier === 'partial'
        ? 'Mezclaste colaboración y traición. Cada vez que bajaste el precio ganaste algo… pero la otra gasolinera reaccionó, y la guerra de precios te costó caro después. La reputación importa cuando el juego se repite.'
        : 'Terminaste en guerra de precios casi todo el tiempo. En una sola jugada traicionar tienta; pero cuando el juego se repite y el otro reacciona, la traición mutua deja a los dos peor que si hubieran colaborado.'

  return (
    <MechanicShell
      shake={fx === 'shake'}
      flash={fx === 'flash'}
      tint={`linear-gradient(180deg,${acc.soft},#EAF6F3)`}
    >
      <GoldFlash on={gl.gold} />
      <Coins runKey={gl.burstKey} mode="burst" count={16} />
      <Coins runKey={gl.rainKey} mode="rain" count={30} />

      <TopBar
        title="El Dilema"
        crisis="Dos gasolineras · teoría de juegos"
        accent={acc}
        pill={over ? 'Fin' : `Semana ${Math.min(state.ronda, cfg.rondas)} / ${cfg.rondas}`}
      />

      {!over && (
        <div ref={goalRef}>
          <GameProgress
            mes={state.ronda}
            meses={cfg.rondas}
            score={gl.score}
            accent={acc}
            goalLabel={tut.tut?.goalChip ?? 'Gana lo más posible… sin caer en la guerra de precios'}
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <EduChip conceptId="dilemaIterado" label="¿Qué es el dilema del prisionero?" onSeen={onConceptSeen} />
      </div>

      {/* Marcador: tú vs la otra gasolinera */}
      <div ref={metersRef} className="mt-4 grid grid-cols-2 gap-2.5">
        <div className="shadow-card rounded-[16px] bg-surface p-3 text-center">
          <p className="font-round text-[1.5rem] font-bold tabular-nums" style={{ color: acc.edge }}>
            {state.tuTotal}
          </p>
          <p className="mt-0.5 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide text-ink-mute">
            💰 Tu ganancia
          </p>
        </div>
        <div className="shadow-card rounded-[16px] bg-surface p-3 text-center">
          <p className="font-round text-[1.5rem] font-bold tabular-nums text-ink-mute">{state.ellosTotal}</p>
          <p className="mt-0.5 font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide text-ink-mute">
            ⛽ La otra gasolinera
          </p>
        </div>
      </div>

      {/* Historial de jugadas */}
      {state.historial.length > 0 && (
        <div className="mt-3 flex items-center justify-center gap-2 font-nunito text-[0.7rem] text-ink-mute">
          <span className="font-extrabold">Tú</span>
          {state.historial.map((h, i) => (
            <span key={i}>{chip(h.tu)}</span>
          ))}
          <span className="mx-1">·</span>
          <span className="font-extrabold">Ellos</span>
          {state.historial.map((h, i) => (
            <span key={i}>{chip(h.ellos)}</span>
          ))}
        </div>
      )}

      <ComboBadge combo={gl.combo} />

      {over ? (
        <EndPanel
          text={endText}
          onComplete={() => onComplete(tier, { score: gl.score, momentumMax: gl.momentumMax })}
        />
      ) : pending ? (
        <div className="animate-fade-up mt-4">
          <div className="rounded-[16px] bg-surface p-3.5 shadow-card">
            <p className="font-nunito text-[0.72rem] font-bold" style={{ color: acc.edge }}>
              ✦ Esta semana
            </p>
            <p className="mt-1 font-nunito text-[0.86rem] leading-snug text-ink-soft">
              Tú: <span className="font-extrabold text-ink-warm">{label(pending.mi)}</span>. La otra gasolinera:{' '}
              <span className="font-extrabold text-ink-warm">{label(pending.su)}</span>.
            </p>
            <p className="mt-2 font-round text-[0.95rem] font-bold" style={{ color: VEREDICTO[pending.mi + pending.su].color }}>
              {VEREDICTO[pending.mi + pending.su].txt}
            </p>
            <div className="mt-2 flex gap-2 border-t border-ink-mute/15 pt-2 font-nunito text-[0.8rem] font-bold text-ink-soft">
              <span>Tú <span className="text-ink-warm">+{pending.p.tu}</span></span>
              <span className="text-ink-mute">·</span>
              <span>Ellos +{pending.p.ellos}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={continuar}
            className="candy mt-3 w-full px-5 py-3.5 text-[1rem]"
            style={{ '--face': acc.face, '--edge': acc.edge }}
          >
            {isOver(pending.next, cfg) ? 'Ver resultado →' : 'Siguiente semana →'}
          </button>
        </div>
      ) : (
        <div ref={actionsRef} className="mt-4 space-y-2.5">
          <p className="font-nunito text-[0.72rem] font-extrabold uppercase tracking-wide text-ink-mute">
            ¿Qué haces esta semana?
          </p>
          <button
            type="button"
            onClick={() => elegir('C')}
            className="candy w-full p-3.5 text-left"
            style={{ '--face': '#35B98A', '--edge': '#1F9A6E' }}
          >
            <span className="flex items-center gap-2 font-round text-[1rem] font-bold text-white">
              🤝 Mantener el precio alto
            </span>
            <span className="mt-0.5 block font-nunito text-[0.74rem] leading-snug text-white/85">
              Colaboras (colusión tácita). Si la otra también, a los dos les va bien.
            </span>
          </button>
          <button
            type="button"
            onClick={() => elegir('D')}
            className="candy w-full p-3.5 text-left"
            style={{ '--face': '#E8604F', '--edge': '#C43D2C' }}
          >
            <span className="flex items-center gap-2 font-round text-[1rem] font-bold text-white">
              🔻 Bajar el precio
            </span>
            <span className="mt-0.5 block font-nunito text-[0.74rem] leading-snug text-white/85">
              Le robas clientes hoy… pero la otra reacciona. Cuidado con la guerra de precios.
            </span>
          </button>
        </div>
      )}

      {tut.showMainCoach && (
        <CoachMarks steps={tut.mainSteps} accent={acc} onDone={tut.onMainDone} onSkip={tut.onSkip} />
      )}
    </MechanicShell>
  )
}
