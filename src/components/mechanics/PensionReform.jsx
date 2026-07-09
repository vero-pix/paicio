import { useMemo, useState } from 'react'
import { sfx } from '../../lib/sound.js'
import { accentFor } from '../../theme/accents.js'
import { MechanicShell, TopBar, LifeBar, EndPanel } from './candyKit.jsx'
import EventCard from './EventCard.jsx'
import { initPensionReform, REFORM_LIST, applyReform, applyEvent, skipRound, isOver, outcomeTier } from '../../utils/pensionReform.js'

const METERS = [
  { key: 'tasaReemplazo', label: 'Tasa de reemplazo', goodWhen: 'high', danger: 35, color: '#35B98A' },
  { key: 'cobertura', label: 'Cobertura', goodWhen: 'high', danger: 50, color: '#4FA3E3' },
  { key: 'confianza', label: 'Confianza pública', goodWhen: 'high', danger: 25, color: '#F5A524' },
  { key: 'fondo', label: 'Fondo (% PIB)', goodWhen: 'high', danger: 40, color: '#A579E0' },
  { key: 'costoFiscal', label: 'Costo fiscal (% PIB)', goodWhen: 'low', danger: 5, color: '#E8604F' },
]

export default function PensionReform({ episode, onComplete }) {
  const cfg = useMemo(() => episode.pensionReform, [episode])
  const acc = accentFor(episode.id)
  const [state, setState] = useState(() => initPensionReform(cfg))
  const [animating, setAnimating] = useState(false)
  const [evento, setEvento] = useState(null)
  const over = isOver(state, cfg)
  const tier = over ? outcomeTier(state) : null

  const disponibles = REFORM_LIST.filter((r) => !state.reformsAplicadas.includes(r.id))

  // Al avanzar de ronda, la carta de evento (si la hay) queda pendiente hasta
  // que el jugador la resuelve con "Seguir" (no se auto-descarta).
  function eventoDeRonda(next) {
    if (next.ronda > cfg.rondas) return
    const ev = episode.eventos?.find((e) => e.ronda === next.ronda)
    if (ev) setEvento(ev)
  }

  function elegir(reformId) {
    if (animating || over || evento) return
    sfx('click')
    const next = applyReform(state, reformId)
    setState(next)
    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
      eventoDeRonda(next)
    }, 400)
  }

  function pasar() {
    if (animating || over || evento) return
    const next = skipRound(state)
    setState(next)
    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
      eventoDeRonda(next)
    }, 400)
  }

  // Aplica el efecto de la carta y la cierra.
  function resolverEvento(efecto) {
    sfx('click')
    setState((s) => applyEvent(s, efecto))
    setEvento(null)
  }

  function metaBar(val) {
    return (
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-mute/15">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(val, 100)}%` }} />
      </div>
    )
  }

  return (
    <MechanicShell tint="linear-gradient(180deg,#E3F2FD,#E8F5E9)">
      <TopBar
        title="La Cuenta que Crece"
        crisis="Pensiones · Modelos globales"
        accent={acc}
        pill={over ? 'Fin' : `Reforma ${state.reformsAplicadas.length + 1}`}
      />

      {/* Medidores compactos */}
      <div className="mt-3 space-y-1.5">
        {METERS.map((m) => (
          <div key={m.key} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-nunito text-[0.65rem] font-bold text-ink-mute w-32 shrink-0">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ background: m.color || acc.face }} />
              {m.label}
            </div>
            <div className="flex-1">{metaBar(state[m.key])}</div>
            <span className="font-round text-[0.75rem] font-bold tabular-nums text-ink-warm w-10 text-right">
              {state[m.key]}
            </span>
          </div>
        ))}
      </div>

      {/* Referencia modelo ideal */}
      <div className="mt-3 rounded-[12px] bg-surface/70 p-2.5 shadow-card">
        <p className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-wide text-ink-mute/70">
          Referencia: Australia (Super Guarantee)
        </p>
        <div className="mt-1 flex items-center gap-4 font-nunito text-[0.65rem] text-ink-soft">
          <span>🎯 Tasa reemplazo: 70%+</span>
          <span>💰 Fondo: &gt;150% PIB</span>
          <span>📋 Cobertura: &gt;95%</span>
        </div>
      </div>

      {evento && (
        <EventCard
          evento={evento}
          mes={state.ronda}
          mesLabel="Ronda"
          accent={acc}
          onResolve={resolverEvento}
          meters={METERS}
        />
      )}

      {over ? (
        <EndPanel
          text={
            tier === 'perfect'
              ? 'Sistema de primer mundo. El diseño importa, y vos lo demostraste.'
              : tier === 'partial'
                ? 'Mejoraste el sistema, pero sin llegar al potencial. Falta una reforma clave.'
                : 'El sistema no aguantó. Las reformas fueron insuficientes o mal aplicadas.'
          }
          onComplete={() => onComplete(tier, { score: state.tasaReemplazo })}
        />
      ) : evento ? null : (
        <>
          <p className="mt-4 font-nunito text-[0.7rem] font-extrabold uppercase tracking-wide text-ink-mute">
            Elegí una reforma para aplicar:
          </p>
          <div className="mt-2 space-y-2">
            {disponibles.map((r, i) => {
              const pals = [
                { face: '#35B98A', edge: '#1F9A6E' },
                { face: '#4FA3E3', edge: '#2F82C4' },
                { face: '#A579E0', edge: '#8657C4' },
                { face: '#F5A524', edge: '#D6871A' },
                { face: '#E8604F', edge: '#C73F2E' },
                { face: '#2C7CB0', edge: '#1A5B8A' },
              ]
              const pal = pals[i % pals.length]
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => elegir(r.id)}
                  className="candy w-full p-3 text-left"
                  style={{ '--face': pal.face, '--edge': pal.edge }}
                >
                  <span className="font-round text-[0.9rem] font-bold">{r.label}</span>
                  <span className="mt-0.5 block font-nunito text-[0.7rem] leading-snug text-white/85">
                    {r.desc}
                  </span>
                  <div className="mt-1.5 flex gap-3 font-nunito text-[0.55rem] font-bold text-white/70">
                    <span>📈 +{r.efecto.tasaReemplazo}% reemplazo</span>
                    {r.efecto.cobertura > 0 && <span>👥 +{r.efecto.cobertura}% cobertura</span>}
                    {r.efecto.confianza !== 0 && (
                      <span className={r.efecto.confianza > 0 ? '' : 'text-crisis-hot'}>
                        💬 {r.efecto.confianza > 0 ? '+' : ''}{r.efecto.confianza}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={pasar}
            className="mt-2 w-full rounded-[12px] border-2 border-dashed border-ink-mute/25 py-2.5 text-center font-nunito text-[0.7rem] font-bold text-ink-mute transition-colors hover:border-ink-mute/50 hover:text-ink-soft"
          >
            Saltar esta ronda (pierde confianza)
          </button>
        </>
      )}
    </MechanicShell>
  )
}
