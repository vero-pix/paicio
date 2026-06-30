import { useEffect, useMemo, useState } from 'react'
import { portraits } from '../assets/portraits.js'
import { episodes } from '../data/episodes/index.js'

const DIMENSIONS = [
  { key: 'estabilidad', label: 'Estabilidad monetaria' },
  { key: 'empleo', label: 'Empleo' },
  { key: 'confianza', label: 'Confianza internacional' },
  { key: 'crecimiento', label: 'Crecimiento' },
]

// Calcula los scores finales ajustando la base de la política según la coalición:
// cada aliado leal suma, cada traición resta credibilidad.
function computeScores(policy, allies) {
  const support = allies.filter((id) => policy.supportedBy.includes(id)).length
  const out = {}
  for (const d of DIMENSIONS) {
    let v = policy.scores[d.key]
    v += support * 5 // respaldo de aliados afines da credibilidad
    v += (allies.length - 2) * 2 // bonus/penalización por tamaño de coalición
    out[d.key] = Math.max(0, Math.min(100, Math.round(v)))
  }
  return out
}

// Veredicto final: traduce el promedio de las 4 métricas en la suerte del ministro.
// Es el corazón de la pantalla — está diseñado para la captura de pantalla.
function verdict(globalScore) {
  if (globalScore >= 72)
    return {
      title: 'PAICIO SALVADO',
      stamp: 'MINISTRO ABSUELTO',
      fate: 'Sales de la Prisión Central reivindicado. La historia te dará la razón.',
      color: 'var(--color-positive)',
    }
  if (globalScore >= 55)
    return {
      title: 'PAICIO RESISTE',
      stamp: 'EN LIBERTAD',
      fate: 'El país sobrevive, magullado. Te sueltan, pero nadie te aplaude.',
      color: '#C9A24B',
    }
  if (globalScore >= 42)
    return {
      title: 'PAICIO EN VILO',
      stamp: 'BAJO VIGILANCIA',
      fate: 'El presidente te deja salir, pero el país sigue al borde del abismo.',
      color: '#D68438',
    }
  return {
    title: 'PAICIO EN RUINAS',
    stamp: 'MINISTRO CULPABLE',
    fate: 'Vuelves a tu celda. Tu nombre será sinónimo de catástrofe.',
    color: 'var(--color-crisis)',
  }
}

export default function Outcome({
  episode,
  policyId,
  allies,
  onConceptSeen,
  onRestart,
  onNextEpisode,
}) {
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  // Ep5 usa sequenceOutcomes; el resto usa policies.
  const policy = useMemo(() => {
    if (episode.sequenceMode) {
      const so = episode.sequenceOutcomes[policyId]
      // Adaptar sequenceOutcome al formato que espera el resto del componente.
      return so
        ? {
            ...so,
            supportedBy: [],
            rejectedBy: [],
            concept: 'reformaMonetaria',
            history: so.history ?? '',
          }
        : null
    }
    return episode.policies.find((p) => p.id === policyId)
  }, [episode, policyId])

  const [revealed, setRevealed] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const scores = useMemo(() => computeScores(policy, allies), [policy, allies])
  const curve = policy?.inflationCurve ?? [100, 80, 60, 40, 30, 20]
  const global = Math.round(
    DIMENSIONS.reduce((s, d) => s + scores[d.key], 0) / DIMENSIONS.length,
  )
  const v = verdict(global)
  const support = allies.filter((id) => policy?.supportedBy?.includes(id)).length
  const strong = support >= 1 && allies.length >= 2
  const headline = episode.sequenceMode ? policy?.headlineWin : (strong ? policy?.headlineWin : policy?.headlineWeak)

  // Encuentra el siguiente episodio jugable.
  const currentIdx = episodes.findIndex((e) => e.id === episode.id)
  const nextEpisode = episodes.slice(currentIdx + 1).find((e) => !e.bloqueado)


  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="grain relative mx-auto max-w-md px-5 py-6">
      <div className="relative z-10">
        {/* Gráfico de inflación animado (se dibuja durante el suspenso) */}
        <InflationGraph curve={curve} />

        {!revealed ? (
          <p className="animate-slow-pulse mt-6 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-paper-dim">
            Paicio reacciona…
          </p>
        ) : (
          <div className="animate-fade-up mt-6">
            {/* ───────── VEREDICTO (héroe, pensado para captura) ───────── */}
            <div className="relative overflow-hidden rounded-md border border-paper-dim bg-paper px-5 py-5 text-ink shadow-2xl shadow-black/60">
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-ink/55">
                El Heraldo de Paicio · Edición extraordinaria
              </p>

              <h2
                className="mt-2 font-display text-[2rem] font-black uppercase leading-[0.95] tracking-tight"
                style={{ color: v.color }}
              >
                {v.title}
              </h2>

              <p className="mt-2 font-display text-base font-bold italic leading-tight text-ink/80">
                {headline}
              </p>

              {/* Sello tipo timbre */}
              <div
                className="pointer-events-none absolute right-3 top-4 flex h-20 w-20 rotate-[-12deg] items-center justify-center rounded-full border-2 text-center"
                style={{ borderColor: v.color, opacity: 0.85 }}
              >
                <span
                  className="font-mono text-[0.5rem] font-bold uppercase leading-tight tracking-wide"
                  style={{ color: v.color }}
                >
                  {v.stamp}
                </span>
              </div>

              {/* Score global grande */}
              <div className="mt-4 flex items-end gap-2 border-t border-ink/15 pt-3">
                <span
                  className="font-display text-5xl font-black leading-none tabular-nums"
                  style={{ color: v.color }}
                >
                  {global}
                </span>
                <span className="mb-1 font-mono text-[0.6rem] uppercase tracking-wide text-ink/55">
                  / 100
                  <br />
                  índice país
                </span>
              </div>
            </div>

            {/* Suerte del ministro */}
            <p className="mt-4 font-body text-[0.95rem] italic leading-relaxed text-paper">
              {v.fate}
            </p>

            {/* Qué pasó con la economía */}
            <p className="mt-3 font-body text-[0.88rem] leading-relaxed text-paper/85">
              {policy.resultText}
            </p>

            {/* Coalición final */}
            <div className="mt-4 flex flex-wrap gap-2">
              {allies.length > 0 ? (
                allies.map((id) => (
                  <span
                    key={id}
                    className="flex items-center gap-1.5 rounded-sm border border-positive/50 bg-positive/10 py-1 pl-1 pr-2 font-mono text-[0.6rem] text-positive"
                  >
                    <img
                      src={portraits[id]}
                      alt=""
                      className="h-4 w-4 rounded-full object-cover"
                    />
                    {prisonersById[id].name}
                  </span>
                ))
              ) : (
                <span className="font-mono text-[0.65rem] text-crisis">
                  Gobernaste sin coalición. El presidente quedó solo contigo.
                </span>
              )}
            </div>

            {/* ───────── Dashboard de métricas (animan desde 50) ───────── */}
            <div className="mt-6 rounded-md border border-edge bg-cell-2/50 p-4">
              <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
                Estado de la nación
              </p>
              <div className="space-y-3">
                {DIMENSIONS.map((d, i) => (
                  <ScoreBar
                    key={d.key}
                    label={d.label}
                    value={scores[d.key]}
                    delay={i * 0.15}
                  />
                ))}
              </div>
            </div>

            {/* Historia real (desplegable) */}
            <div className="mt-6">
              {!showHistory ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowHistory(true)
                    onConceptSeen?.(policy.concept)
                  }}
                  className="w-full rounded-sm border border-paper-dim bg-cell px-4 py-3 font-display font-semibold text-paper transition-all hover:border-paper active:scale-[0.99]"
                >
                  ¿Qué pasó en la historia real?
                </button>
              ) : (
                <div className="animate-fade-up rounded-md border border-edge bg-cell/80 p-4">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-crisis">
                    {episode.contextoHistorico.titulo}
                  </h3>
                  <p className="mt-2 font-body text-[0.86rem] leading-relaxed text-paper/90">
                    {policy.history}
                  </p>
                </div>
              )}
            </div>

            {/* Botones finales */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onRestart}
                className="rounded-sm border border-paper-dim bg-cell-2 px-4 py-2.5 font-display font-semibold text-paper transition-all hover:border-paper active:scale-[0.99]"
              >
                Intentar de nuevo
              </button>
              {nextEpisode ? (
                <button
                  type="button"
                  onClick={() => onNextEpisode?.(nextEpisode)}
                  className="rounded-sm border border-crisis bg-crisis/20 px-4 py-2.5 font-display font-semibold text-paper transition-all hover:bg-crisis/30 active:scale-[0.99]"
                >
                  Episodio {nextEpisode.numero} →
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Próximamente"
                  className="cursor-not-allowed rounded-sm border border-edge bg-cell/40 px-4 py-2.5 font-display font-semibold text-paper-dim/50"
                >
                  Próximo episodio →
                </button>
              )}
            </div>

            {/* Pie de marca (para la captura de pantalla) */}
            <p className="mt-6 text-center font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-dim/60">
              PAICIO · El Ministro Encarcelado · ¿Lo harías mejor?
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Gráfico de inflación SVG que se "dibuja" al montar.
function InflationGraph({ curve }) {
  const w = 320
  const h = 140
  const max = Math.max(...curve)
  const pts = curve.map((val, i) => {
    const x = (i / (curve.length - 1)) * w
    const y = h - (val / max) * (h - 16) - 8
    return [x, y]
  })
  const path = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ')
  const ends = curve[curve.length - 1] > curve[0] * 0.6
  const color = ends ? 'var(--color-crisis)' : 'var(--color-positive)'

  return (
    <div className="rounded-md border border-edge bg-cell-2/60 p-4">
      <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-paper-dim">
        Inflación en Paicio (índice)
      </p>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        role="img"
        aria-label="Curva de inflación"
      >
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1="0"
            x2={w}
            y1={h * g}
            y2={h * g}
            stroke="var(--color-edge)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 1000,
            animation: 'draw 2.4s ease-out forwards',
          }}
        />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="3"
            fill={color}
            opacity={i === pts.length - 1 ? 1 : 0.5}
          />
        ))}
      </svg>
      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </div>
  )
}

// Barra de métrica que anima desde el estado inicial (50) hacia el valor final.
function ScoreBar({ label, value, delay }) {
  const tone = value >= 60 ? 'bg-positive' : value >= 40 ? 'bg-paper-dim' : 'bg-crisis'
  const [w, setW] = useState(50)
  useEffect(() => {
    const t = setTimeout(() => setW(value), 80)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[0.66rem] uppercase tracking-wide text-paper-dim">
          {label}
        </span>
        <span className="font-mono text-sm tabular-nums text-paper">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{
            width: `${w}%`,
            transition: 'width 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
            transitionDelay: `${delay}s`,
          }}
        />
      </div>
    </div>
  )
}
