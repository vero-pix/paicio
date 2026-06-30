import { useMemo, useState } from 'react'
import EducationalTooltip from './EducationalTooltip.jsx'
import { portraits } from '../assets/portraits.js'

// Fase 3: selección de política. Lee las políticas y prisioneros del episodio activo.
// Cada política es una card con barras de impacto (inflación / empleo) y las señales
// de coalición. Un botón "Comparar las 3" superpone las tres en formato de filas.
export default function PolicyChoice({ episode, allies, onChoose, onConceptSeen }) {
  const policies = episode.policies
  const prisonersById = useMemo(
    () => Object.fromEntries(episode.prisoners.map((p) => [p.id, p])),
    [episode],
  )

  const [confirming, setConfirming] = useState(null)
  const [comparing, setComparing] = useState(false)

  const betrayers = (policy) => allies.filter((id) => policy.rejectedBy.includes(id))
  const backers = (policy) => allies.filter((id) => policy.supportedBy.includes(id))

  return (
    <div className="grain relative mx-auto max-w-md px-5 py-6">
      <div className="relative z-10">
        <h2 className="font-display text-2xl font-black text-paper">La Propuesta</h2>
        <p className="mt-2 font-body text-[0.88rem] leading-snug text-paper-dim">
          Envía tu plan al presidente. Una política que contradiga a un aliado lo
          hará traicionar tu coalición.
        </p>

        {/* Coalición actual */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {allies.length === 0 ? (
            <span className="font-mono text-[0.7rem] text-crisis">
              Sin aliados en la coalición.
            </span>
          ) : (
            allies.map((id) => (
              <span
                key={id}
                className="flex items-center gap-1.5 rounded-sm border border-positive/50 bg-positive/10 py-1 pl-1 pr-2 font-mono text-[0.62rem] text-positive"
              >
                <img
                  src={portraits[id]}
                  alt=""
                  className="h-4 w-4 rounded-full object-cover"
                />
                {prisonersById[id].name}
              </span>
            ))
          )}
        </div>

        {/* Comparar las 3 */}
        <button
          type="button"
          onClick={() => setComparing(true)}
          className="mt-4 w-full rounded-sm border border-dashed border-paper-dim/70 bg-paper/5 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-wide text-paper-dim transition-colors hover:border-paper hover:text-paper"
        >
          ⊟ Comparar las 3 políticas
        </button>

        {/* Cards de política */}
        <div className="mt-5 space-y-4">
          {policies.map((policy, i) => {
            const willBack = backers(policy)
            const willBetray = betrayers(policy)
            return (
              <div
                key={policy.id}
                className="animate-fade-up rounded-md border border-edge bg-cell/80 p-4"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-paper-dim font-display text-lg font-black text-paper">
                    {policy.letter}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold leading-tight text-paper">
                      {policy.name}
                    </h3>
                    <p className="mt-1 font-body text-[0.82rem] leading-snug text-paper/90">
                      {policy.summary}
                    </p>
                  </div>
                </div>

                {/* Barras de impacto */}
                <div className="mt-3 space-y-2 border-t border-edge/60 pt-3">
                  <ImpactBar metric="Inflación" data={policy.impact.inflacion} />
                  <ImpactBar metric="Empleo" data={policy.impact.empleo} />
                </div>

                {/* Costo */}
                <p className="mt-3 font-body text-[0.78rem] text-crisis">
                  <span className="font-mono text-[0.6rem] uppercase">Costo: </span>
                  {policy.cost}
                </p>

                <div className="mt-3">
                  <EducationalTooltip
                    conceptId={policy.concept}
                    onSeen={onConceptSeen}
                  />
                </div>

                {/* Señales de coalición */}
                {(willBack.length > 0 || willBetray.length > 0) && (
                  <div className="mt-3 space-y-1 border-t border-edge/60 pt-2">
                    {willBack.map((id) => (
                      <p key={id} className="font-mono text-[0.62rem] text-positive">
                        ✓ {prisonersById[id].name} la apoya
                      </p>
                    ))}
                    {willBetray.map((id) => (
                      <p key={id} className="font-mono text-[0.62rem] text-crisis">
                        ⚠ {prisonersById[id].name} la rechaza — te traicionará
                      </p>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setConfirming(policy)}
                  className="mt-4 w-full rounded-sm border border-paper-dim bg-cell-2 px-4 py-2.5 font-display font-semibold text-paper transition-all hover:border-paper active:scale-[0.99]"
                >
                  Aplicar política {policy.letter}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Overlay de comparación */}
      {comparing && (
        <CompareOverlay
          policies={policies}
          prisonersById={prisonersById}
          allies={allies}
          onClose={() => setComparing(false)}
        />
      )}

      {/* Confirmación */}
      {confirming && (
        <ConfirmModal
          policy={confirming}
          prisonersById={prisonersById}
          betrayers={betrayers(confirming)}
          onCancel={() => setConfirming(null)}
          onConfirm={() => onChoose(confirming.id, betrayers(confirming))}
        />
      )}
    </div>
  )
}

// Barra de impacto de 4 bloques. Color según si el efecto es bueno/malo/neutral.
function ImpactBar({ metric, data }) {
  const tone =
    data.good === true ? 'bg-positive' : data.good === false ? 'bg-crisis' : 'bg-paper-dim'
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 font-mono text-[0.6rem] uppercase tracking-wide text-paper-dim">
        {metric}
      </span>
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-2.5 w-4 rounded-[2px] ${n < data.fill ? tone : 'bg-ink'}`}
          />
        ))}
      </span>
      <span className="font-body text-[0.74rem] text-paper/85">{data.label}</span>
    </div>
  )
}

// Overlay que compara las 3 políticas en formato de filas (legible en mobile).
function CompareOverlay({ policies, prisonersById, allies, onClose }) {
  const row = (render) => (
    <div className="grid grid-cols-3 gap-2">
      {policies.map((p) => (
        <div key={p.id} className="min-w-0">
          {render(p)}
        </div>
      ))}
    </div>
  )

  return (
    <div className="animate-fade-in fixed inset-0 z-40 flex items-end justify-center bg-ink/85 backdrop-blur-sm sm:items-center">
      <div className="grain relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-xl border-t border-edge bg-cell p-5 shadow-2xl shadow-black/70 sm:rounded-xl sm:border">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-paper">
              Comparar políticas
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="font-mono text-paper-dim hover:text-paper"
            >
              ✕
            </button>
          </div>

          {/* Encabezado: letras */}
          <div className="mt-4">
            {row((p) => (
              <div className="text-center">
                <span className="font-display text-xl font-black text-paper">
                  {p.letter}
                </span>
                <p className="mt-0.5 font-body text-[0.62rem] leading-tight text-paper-dim">
                  {p.name}
                </p>
              </div>
            ))}
          </div>

          <Divider label="Inflación" />
          {row((p) => (
            <ImpactDot data={p.impact.inflacion} />
          ))}

          <Divider label="Empleo" />
          {row((p) => (
            <ImpactDot data={p.impact.empleo} />
          ))}

          <Divider label="Apoyan (de tus aliados)" />
          {row((p) => (
            <ColAllies
              ids={allies.filter((id) => p.supportedBy.includes(id))}
              prisonersById={prisonersById}
              tone="positive"
              empty="—"
            />
          ))}

          <Divider label="Te traicionarían" />
          {row((p) => (
            <ColAllies
              ids={allies.filter((id) => p.rejectedBy.includes(id))}
              prisonersById={prisonersById}
              tone="crisis"
              empty="—"
            />
          ))}

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-sm border border-paper-dim bg-cell-2 px-4 py-2.5 font-display font-semibold text-paper transition-all hover:border-paper"
          >
            Volver a elegir
          </button>
        </div>
      </div>
    </div>
  )
}

function Divider({ label }) {
  return (
    <p className="mt-4 mb-2 border-t border-edge/60 pt-2 text-center font-mono text-[0.58rem] uppercase tracking-[0.15em] text-paper-dim">
      {label}
    </p>
  )
}

function ImpactDot({ data }) {
  const tone =
    data.good === true ? 'text-positive' : data.good === false ? 'text-crisis' : 'text-paper-dim'
  return (
    <div className="text-center">
      <span className="flex justify-center gap-0.5" aria-hidden>
        {[0, 1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 w-1.5 rounded-full ${n < data.fill ? tone.replace('text-', 'bg-') : 'bg-ink'}`}
          />
        ))}
      </span>
      <p className={`mt-1 font-body text-[0.66rem] leading-tight ${tone}`}>
        {data.label}
      </p>
    </div>
  )
}

function ColAllies({ ids, prisonersById, tone, empty }) {
  const color = tone === 'positive' ? 'text-positive' : 'text-crisis'
  if (ids.length === 0)
    return <p className="text-center font-mono text-[0.62rem] text-paper-dim/50">{empty}</p>
  return (
    <div className="space-y-0.5 text-center">
      {ids.map((id) => (
        <p key={id} className={`font-mono text-[0.58rem] leading-tight ${color}`}>
          {prisonersById[id].name.split(' ').slice(-1)[0]}
        </p>
      ))}
    </div>
  )
}

function ConfirmModal({ policy, prisonersById, betrayers, onCancel, onConfirm }) {
  return (
    <div className="animate-fade-in fixed inset-0 z-40 flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-xl border-t border-edge bg-cell p-5 sm:rounded-xl sm:border">
        <h3 className="font-display text-lg font-semibold text-paper">
          Confirmar Política {policy.letter}
        </h3>
        <p className="mt-2 font-body text-[0.85rem] text-paper/90">{policy.name}.</p>
        {betrayers.length > 0 ? (
          <div className="mt-3 rounded-sm border border-crisis/50 bg-crisis/10 px-3 py-2">
            {betrayers.map((id) => (
              <p key={id} className="font-mono text-[0.7rem] text-crisis">
                ⚠ {prisonersById[id].name} abandonará tu coalición.
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-3 font-mono text-[0.7rem] text-positive">
            Tu coalición se mantiene unida.
          </p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-sm border border-edge bg-cell-2 px-4 py-2.5 font-display font-semibold text-paper-dim transition-all hover:text-paper"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-sm border border-crisis bg-crisis/20 px-4 py-2.5 font-display font-semibold text-paper transition-all hover:bg-crisis/30 active:scale-[0.99]"
          >
            Enviar al presidente
          </button>
        </div>
      </div>
    </div>
  )
}
