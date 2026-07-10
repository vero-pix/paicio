import { useEffect, useMemo, useState } from 'react'
import { episodes } from '../data/episodes/index.js'
import { accentFor } from '../theme/accents.js'
import { sting } from '../lib/sound.js'
import { useScreenFx } from '../lib/animations.js'
import { readBest, recordBest } from '../utils/gameLayer.js'
import { writeDaily, dailyShareText, starBar, fechaCorta } from '../utils/daily.js'

// ─────────────────────────────────────────────────────────────────────────
// Outcome — "Desenlace / Veredicto" (rediseño LatAm).
//
// Pantalla de resultado, pensada para compartir: kicker + estrellas + título,
// tres chips de score, y la card oscura "Lo que pasó de verdad" que compara la
// cifra histórica real con tu partida. Reutiliza la lógica de scores y veredicto
// existente; solo cambia la presentación. Guarda contra `policy` nula para no
// caer si el estado llega con un outcome que no resuelve.
// ─────────────────────────────────────────────────────────────────────────

const DIMENSIONS = [
  { key: 'estabilidad', label: 'Estabilidad monetaria' },
  { key: 'empleo', label: 'Empleo' },
  { key: 'confianza', label: 'Confianza internacional' },
  { key: 'crecimiento', label: 'Crecimiento' },
]

// Chips visibles en el veredicto (3, con etiqueta corta).
const CHIPS = [
  { key: 'estabilidad', label: 'Estabilidad' },
  { key: 'empleo', label: 'Empleo' },
  { key: 'confianza', label: 'Confianza' },
]

// Guiño de bandera por episodio (presentación).
const FLAGS = { ep1: '🇧🇴', ep2: '🇦🇷', ep3: '🇨🇱', ep4: '🇧🇷', ep5: '🇧🇷' }

// Color de un score según su nivel.
function scoreColor(v) {
  return v >= 60 ? '#2FB37E' : v >= 40 ? '#F5A524' : '#E8604F'
}

// Cómo quedó la crisis en tu partida (columna derecha de la card real).
function partidaFor(kind) {
  if (kind === 'perfect') return { word: 'bajo control', color: '#35B98A' }
  if (kind === 'partial') return { word: 'a medias', color: '#F5A524' }
  return { word: 'sin control', color: '#E8604F' }
}

// Ajusta los scores base de la política según la coalición (solo dilema del
// prisionero; las mecánicas propias usan los scores del outcome directo).
function computeScores(policy, allies) {
  const support = allies.filter((id) => policy.supportedBy.includes(id)).length
  const out = {}
  for (const d of DIMENSIONS) {
    let v = policy.scores[d.key]
    v += support * 5
    v += (allies.length - 2) * 2
    out[d.key] = Math.max(0, Math.min(100, Math.round(v)))
  }
  return out
}

// Veredicto final: traduce el promedio de las métricas en la suerte del ministro.
function verdict(globalScore) {
  if (globalScore >= 72)
    return { title: '¡Paicio a salvo!', color: '#2FB37E' }
  if (globalScore >= 55)
    return { title: 'Paicio resiste', color: '#35B98A' }
  if (globalScore >= 42)
    return { title: 'Paicio en vilo', color: '#F5A524' }
  return { title: 'Paicio en ruinas', color: '#E8604F' }
}

// Estrella (rellena o vacía), con pop opcional en la central.
function Star({ filled, size, pop }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={pop ? 'animate-pop' : ''}
      style={{ width: size, height: size }}
      fill={filled ? '#F5B331' : 'none'}
      stroke={filled ? '#E0912A' : '#D8C39A'}
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.2 5.9-.9z" />
    </svg>
  )
}

export default function Outcome({
  episode,
  policyId,
  mechanicResult,
  allies,
  daily,
  onConceptSeen,
  onRestart,
  onRetry,
  onExit,
  onNextEpisode,
}) {
  const acc = accentFor(episode.id)

  const isCustomMechanic = episode.mechanic && episode.mechanic !== 'prisonersDilemma'
  const policy = useMemo(() => {
    if (isCustomMechanic) {
      const so = episode.outcomes?.[policyId]
      return so
        ? { ...so, supportedBy: [], rejectedBy: [], concept: so.concept ?? 'reformaMonetaria', history: so.history ?? '' }
        : null
    }
    return episode.policies.find((p) => p.id === policyId) ?? null
  }, [episode, policyId, isCustomMechanic])

  const scores = useMemo(() => {
    if (isCustomMechanic || !policy) {
      const out = {}
      for (const d of DIMENSIONS)
        out[d.key] = Math.max(0, Math.min(100, Math.round(policy?.scores?.[d.key] ?? 0)))
      return out
    }
    return computeScores(policy, allies)
  }, [policy, allies, isCustomMechanic])

  const global = Math.round(
    DIMENSIONS.reduce((s, d) => s + scores[d.key], 0) / DIMENSIONS.length,
  )
  const v = verdict(global)
  const resultKind = global >= 55 ? 'perfect' : global >= 42 ? 'partial' : 'wrong'
  const stars = resultKind === 'perfect' ? 3 : resultKind === 'partial' ? 2 : 1
  const partida = partidaFor(resultKind)

  // Jugo de la pantalla final: puntaje + "superaste al X%". Ahora en toda
  // mecánica que trae puntaje corrido (Ep1–Ep4); Ep5 (puzzle) no lo trae.
  const juicy = mechanicResult?.score != null
  // Puntaje: el corrido de la partida si llegó (game feel); si no, uno derivado
  // del desempeño global. El percentil es una CURVA LOCAL estimada (no backend);
  // no es un dato real, es una referencia por desempeño.
  const score = mechanicResult?.score != null ? mechanicResult.score : Math.round(global * 12.5)
  const percentil = Math.max(3, Math.min(99, Math.round(global * 0.95 + 4)))
  // Tensión de "casi": cuánto faltó para la siguiente estrella (umbrales 42/55).
  const nextStarGap = stars === 1 ? 42 - global : stars === 2 ? 55 - global : null
  const nearMiss = nextStarGap != null && nextStarGap > 0 && nextStarGap <= 6 ? stars + 1 : null
  const [shared, setShared] = useState(false)

  const isDaily = !!daily
  const won = resultKind !== 'wrong'
  // "Mejor intento" (fracaso barato): récord previo antes de registrar el actual.
  // En modo diario no se compara (un intento) para no confundir.
  const [prevBest] = useState(() => (juicy && !isDaily ? readBest(episode.id) : 0))
  const nuevoRecord = juicy && !isDaily && score > prevBest && prevBest > 0

  function compartir() {
    const flag = FLAGS[episode.id] ?? ''
    // El reto diario comparte SIN spoilers (ni crisis ni desenlace): fecha,
    // estrellas y puntaje, estilo Wordle.
    const texto = isDaily
      ? dailyShareText(daily.iso, { stars, score })
      : [
          `PAICIO · ${episode.paisReferencia.split(',')[0]} ${episode.año} ${flag}`,
          `${'⭐'.repeat(stars)}  ·  ${score} pts`,
          v.title,
          `Superé al ${percentil}% de los ministros`,
          'https://paicio.economics.cl',
        ].join('\n')
    if (navigator.share) {
      navigator.share({ text: texto }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(texto).then(
        () => {
          setShared(true)
          setTimeout(() => setShared(false), 1800)
        },
        () => {},
      )
    }
  }

  const real = episode.trendChart?.real ?? {}
  const historyText = policy?.history || real.nota || ''

  const currentIdx = episodes.findIndex((e) => e.id === episode.id)
  const nextEpisode = episodes.slice(currentIdx + 1).find((e) => !e.bloqueado)

  const [revealed, setRevealed] = useState(false)
  const { fx, trigger } = useScreenFx()

  useEffect(() => {
    const t = setTimeout(() => {
      setRevealed(true)
      sting(resultKind)
      if (resultKind === 'perfect') trigger('flash')
      else if (resultKind === 'wrong') trigger('shake')
    }, 1700)
    return () => clearTimeout(t)
  }, [resultKind])

  // El concepto educativo queda "visto" cuando se revela el desenlace.
  useEffect(() => {
    if (revealed && policy?.concept) onConceptSeen?.(policy.concept)
  }, [revealed, policy, onConceptSeen])

  // Al revelarse: registra el mejor intento (modo normal) y sella el resultado
  // del Reto Diario (para el candado "ya jugaste hoy").
  useEffect(() => {
    if (!revealed) return
    if (juicy && !isDaily) recordBest(episode.id, score)
    if (isDaily) writeDaily(daily.iso, { stars, score, epId: episode.id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed])

  return (
    <div className={`on-cream relative ${fx === 'shake' ? 'animate-shake' : ''}`}>
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg,#E9F7EE 0%,#FBEFD4 60%,#FCE7C6 100%)' }}
      />
      {fx === 'flash' && (
        <div
          className="animate-flash-green pointer-events-none fixed inset-0 z-40"
          style={{ background: 'var(--color-good)' }}
          aria-hidden
        />
      )}

      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 pb-8 pt-2">
        {!revealed ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="animate-slow-pulse font-nunito text-[0.8rem] font-extrabold uppercase tracking-[0.2em] text-ink-mute">
              Paicio reacciona…
            </p>
          </div>
        ) : (
          <div className="animate-fade-up flex flex-1 flex-col">
            {/* Kicker + estrellas + título */}
            {isDaily && (
              <p className="mb-1 text-center font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-ink-mute">
                🗓️ Reto Diario · {fechaCorta(daily.iso)}
              </p>
            )}
            <p
              className="text-center font-nunito text-[0.68rem] font-extrabold uppercase tracking-[0.15em]"
              style={{ color: v.color }}
            >
              Veredicto · {episode.paisReferencia.split(',')[0]} {episode.año}
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <Star filled={stars >= 1} size={34} />
              <Star filled={stars >= 2} size={46} pop />
              <Star filled={stars >= 3} size={34} />
            </div>
            <h1 className="mt-3 text-balance text-center font-round text-[1.9rem] font-bold leading-[1.05] text-ink-warm">
              {v.title}
            </h1>
            {policy?.resultText && (
              <p className="mx-auto mt-2 max-w-[19rem] text-center font-nunito text-[0.86rem] leading-snug text-ink-soft">
                {policy.resultText}
              </p>
            )}

            {/* Puntaje + percentil (prototipo Ep1) */}
            {juicy && (
              <div className="mt-4 flex items-stretch justify-center gap-2.5">
                <div className="shadow-card rounded-[16px] bg-surface px-4 py-2.5 text-center">
                  <p
                    className="font-round text-[1.5rem] font-bold leading-none tabular-nums"
                    style={{ color: v.color }}
                  >
                    {score.toLocaleString('es-CL')}
                  </p>
                  <p className="mt-1 font-nunito text-[0.56rem] font-extrabold uppercase tracking-wide text-ink-mute">
                    Puntaje
                  </p>
                </div>
                <div className="shadow-card flex flex-col items-center justify-center rounded-[16px] bg-surface px-4 py-2.5 text-center">
                  <p className="font-nunito text-[0.78rem] font-bold leading-tight text-ink-soft">
                    Superaste al{' '}
                    <span className="font-round text-[1rem]" style={{ color: v.color }}>
                      {percentil}%
                    </span>{' '}
                    de los ministros
                  </p>
                  <p className="mt-0.5 font-nunito text-[0.52rem] font-extrabold uppercase tracking-wide text-ink-mute/70">
                    estimado
                  </p>
                </div>
              </div>
            )}

            {/* Tensión de "casi": faltó poco para otra estrella. */}
            {juicy && nearMiss && (
              <p
                className="mx-auto mt-2.5 rounded-full px-3 py-1 text-center font-nunito text-[0.76rem] font-bold"
                style={{ background: '#FBE7C6', color: '#9A6B12' }}
              >
                ✨ Te faltó poco para {nearMiss} estrellas — ¡un intento más!
              </p>
            )}

            {/* Chips de score */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {CHIPS.map((c) => (
                <div
                  key={c.key}
                  className="shadow-card rounded-[16px] bg-surface px-2 py-3 text-center"
                >
                  <p
                    className="font-round text-[1.6rem] font-bold leading-none tabular-nums"
                    style={{ color: scoreColor(scores[c.key]) }}
                  >
                    {scores[c.key]}
                  </p>
                  <p className="mt-1 font-nunito text-[0.58rem] font-extrabold uppercase tracking-wide text-ink-mute">
                    {c.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Lo que pasó de verdad */}
            <div
              className="shadow-card-dark relative mt-4 overflow-hidden rounded-[20px] p-4"
              style={{ background: 'linear-gradient(160deg,#3B2A17,#26190B)' }}
            >
              <p className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-[#E8C67F]">
                Lo que pasó de verdad {FLAGS[episode.id] ?? ''}
              </p>
              <div className="mt-2.5 flex items-stretch gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-nunito text-[0.52rem] font-extrabold uppercase tracking-wide text-[#B79A63]">
                    En la realidad
                  </p>
                  <p className="font-round text-[1.5rem] font-bold leading-none text-[#E8604F]">
                    {real.cifra ?? '—'}
                  </p>
                </div>
                <div className="w-px shrink-0 bg-white/10" />
                <div className="min-w-0 flex-1">
                  <p className="font-nunito text-[0.52rem] font-extrabold uppercase tracking-wide text-[#B79A63]">
                    Tu partida
                  </p>
                  <p
                    className="font-round text-[1.5rem] font-bold leading-none"
                    style={{ color: partida.color }}
                  >
                    {partida.word}
                  </p>
                </div>
              </div>
              {real.cifraEtiqueta && (
                <p className="mt-2 font-nunito text-[0.6rem] italic text-[#B79A63]">
                  {real.cifraEtiqueta}
                </p>
              )}
              {historyText && (
                <p className="mt-2 border-t border-white/10 pt-2 font-nunito text-[0.72rem] leading-relaxed text-[#D9C7A2]">
                  {historyText}
                </p>
              )}
            </div>

            {/* Empuja la barra inferior hacia abajo */}
            <div className="flex-1" />

            {/* Mejor intento / récord (fracaso barato, solo modo normal). */}
            {juicy && !isDaily && (nuevoRecord || prevBest > 0) && (
              <p
                className="mx-auto mt-3 rounded-full px-3 py-1 text-center font-nunito text-[0.74rem] font-bold"
                style={{ background: '#F7E0B0', color: '#9A6B12' }}
              >
                {nuevoRecord
                  ? '🏆 ¡Nuevo récord personal!'
                  : `Tu mejor intento: ${Math.max(prevBest, score).toLocaleString('es-CL')} pts`}
              </p>
            )}

            {/* Compartir resultado (mecánicas con puntaje o Reto Diario). */}
            {(juicy || isDaily) && (
              <button
                type="button"
                onClick={compartir}
                className="candy candy-soft mt-6 w-full px-5 py-3 text-[0.94rem]"
              >
                {shared ? '¡Copiado! ✓' : 'Compartir resultado ⤴'}
              </button>
            )}

            {/* Barra inferior — depende del modo/resultado:
                · Reto Diario: un intento, solo volver al mapa.
                · Derrota (modo normal): "Reintentar" primario (fracaso barato).
                · Victoria: "un intento más" + siguiente crisis / completaste. */}
            <div className={`${juicy || isDaily ? 'mt-3' : 'mt-6'} flex items-center gap-3`}>
              {isDaily ? (
                <button
                  type="button"
                  onClick={onExit}
                  className="candy flex-1 px-5 py-3.5 text-[1rem]"
                  style={{ '--face': acc.face, '--edge': acc.edge }}
                >
                  Volver al mapa →
                </button>
              ) : !won ? (
                <>
                  <button
                    type="button"
                    onClick={onExit}
                    title="Volver al mapa"
                    aria-label="Volver al mapa"
                    className="candy candy-soft flex h-[52px] w-[52px] shrink-0 items-center justify-center text-[1.2rem]"
                  >
                    ⌂
                  </button>
                  <button
                    type="button"
                    onClick={onRetry}
                    className="candy flex-1 px-5 py-3.5 text-[1rem]"
                    style={{ '--face': acc.face, '--edge': acc.edge }}
                  >
                    ↻ Reintentar — ¡un intento más!
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onRetry}
                    title="Intentar de nuevo"
                    aria-label="Intentar de nuevo"
                    className="candy candy-soft flex h-[52px] w-[52px] shrink-0 items-center justify-center text-[1.2rem]"
                  >
                    ↻
                  </button>
                  {nextEpisode ? (
                    <button
                      type="button"
                      onClick={() => onNextEpisode?.(nextEpisode)}
                      className="candy flex-1 px-5 py-3.5 text-[1rem]"
                      style={{ '--face': '#35B98A', '--edge': '#1F9A6E' }}
                    >
                      Siguiente crisis →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onRestart}
                      className="candy flex-1 px-5 py-3.5 text-[1rem]"
                      style={{ '--face': acc.face, '--edge': acc.edge }}
                    >
                      Completaste PAICIO · Jugar de nuevo
                    </button>
                  )}
                </>
              )}
            </div>

            <p className="mt-5 text-center font-nunito text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-ink-mute/70">
              PAICIO · ¿Lo harías mejor?
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
