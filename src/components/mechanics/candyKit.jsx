import { useState } from 'react'
import { concepts } from '../../data/concepts.js'
import { useCountUp } from '../../lib/animations.js'
import ActionIcon from '../icons/ActionIcon.jsx'

// ─────────────────────────────────────────────────────────────────────────
// candyKit — piezas de presentación compartidas por las mecánicas (rediseño
// LatAm). Fondo claro, medidores "barra de vida", asesor en marco-moneda,
// botones táctiles candy, panel de cierre y chip educativo. Solo look: la
// lógica de cada mecánica vive en sus utils.
// ─────────────────────────────────────────────────────────────────────────

// Paleta para pintar las acciones (se cicla por índice) + acentos especiales.
export const ACTION_PALETTE = [
  { face: '#F5A524', edge: '#D6871A' },
  { face: '#4FA3E3', edge: '#2F82C4' },
  { face: '#A579E0', edge: '#8657C4' },
  { face: '#35B98A', edge: '#1F9A6E' },
  { face: '#F06A54', edge: '#D24C39' },
]
export const CRISIS_ACCENT = { face: '#E8604F', edge: '#C43D2C' }
export const GOOD_ACCENT = { face: '#35B98A', edge: '#1F9A6E' }
export const GOLD_ACCENT = { face: 'var(--color-gold)', edge: 'var(--color-gold-edge)' }

// Envoltorio de pantalla: fondo luminoso + overlay de flash + ancho móvil.
export function MechanicShell({ shake, flash, tint, children }) {
  return (
    <div className={`on-cream relative ${shake ? 'animate-shake' : ''}`}>
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{ background: tint ?? 'linear-gradient(180deg,#FFF3DA,#FBE6C2)' }}
      />
      {flash && (
        <div
          className="animate-flash-green pointer-events-none fixed inset-0 z-40"
          style={{ background: 'var(--color-good)' }}
          aria-hidden
        />
      )}
      <div className="mx-auto max-w-md px-5 pb-10 pt-1">{children}</div>
    </div>
  )
}

// Barra superior: título + etiqueta de crisis + pill de ronda (candy).
export function TopBar({ title, crisis, accent, pill }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-round text-[1.3rem] font-bold leading-none text-ink-warm">
          {title}
        </h2>
        <p
          className="mt-1 font-nunito text-[0.66rem] font-extrabold uppercase tracking-wide"
          style={{ color: accent.edge }}
        >
          {crisis}
        </p>
      </div>
      <span
        className="candy shrink-0 px-3.5 py-2 text-[0.8rem]"
        style={{ '--face': accent.face, '--edge': accent.edge }}
      >
        {pill}
      </span>
    </div>
  )
}

// Íconos de medidor (heredan color con currentColor).
const METER_ICONS = {
  flame: (
    <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 .6 2 2 2 0-2-1-4 0-6z" />
  ),
  crowd: (
    <>
      <circle cx="6" cy="8" r="1.6" />
      <circle cx="12" cy="7" r="1.6" />
      <circle cx="18" cy="8" r="1.6" />
      <path d="M3 17c0-2 1.5-3 3-3s3 1 3 3" />
      <path d="M9 16c0-2 1.5-3 3-3s3 1 3 3" />
      <path d="M15 17c0-2 1.5-3 3-3s3 1 3 3" />
    </>
  ),
  vault: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" />
      <path d="M5 6v5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" />
      <path d="M5 11v5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-5" />
    </>
  ),
}

const METER_STYLE = {
  flame: { color: '#E8604F', tint: '#FBDAD3', fill: 'linear-gradient(90deg,#F5A524,#E8604F)' },
  crowd: { color: '#2FB37E', tint: '#D6F0E5', fill: 'linear-gradient(90deg,#7FD3A6,#2FB37E)' },
  vault: { color: '#4FA3E3', tint: '#DCEBFA', fill: 'linear-gradient(90deg,#8FC4EF,#4FA3E3)' },
}

// Medidor "barra de vida" temático (variant: flame | crowd | vault).
export function LifeBar({ variant, label, value }) {
  const s = METER_STYLE[variant] ?? METER_STYLE.crowd
  const pct = Math.max(0, Math.min(100, value))
  const display = Math.round(useCountUp(value, 700))
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
        style={{ background: s.tint, color: s.color }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden
        >
          {METER_ICONS[variant]}
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <span className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-mute">
            {label}
          </span>
          <span
            className="font-round text-[0.82rem] font-bold tabular-nums"
            style={{ color: s.color }}
          >
            {display}%
          </span>
        </div>
        <div
          className="mt-1 h-2.5 overflow-hidden rounded-full"
          style={{ background: '#F3E2C2', boxShadow: 'inset 0 1px 2px rgba(140,90,30,.25)' }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: s.fill, transition: 'width 0.6s ease-out' }}
          />
        </div>
      </div>
    </div>
  )
}

// Asesor: retrato en marco-moneda + burbuja blanca con nombre y cita.
export function AdvisorBubble({ portrait, name, nameColor, subtitle, text }) {
  return (
    <div className="animate-fade-up mt-4 flex items-start gap-3">
      <span className="coin shrink-0 rounded-full p-[3px]">
        <img
          src={portrait}
          alt=""
          className="h-12 w-12 rounded-full border-2 border-white object-cover"
        />
      </span>
      <div className="shadow-card min-w-0 flex-1 rounded-[18px] rounded-tl-[5px] bg-surface p-3">
        <p className="font-round text-[0.78rem] font-bold" style={{ color: nameColor }}>
          {name}
          {subtitle && (
            <span className="font-nunito text-[0.64rem] font-extrabold text-ink-mute">
              {' · '}
              {subtitle}
            </span>
          )}
        </p>
        <p className="mt-0.5 font-nunito text-[0.82rem] leading-snug text-ink-soft">{text}</p>
      </div>
    </div>
  )
}

// Botón de acción táctil. `id` alimenta el ActionIcon; `face`/`edge` el color.
export function CandyAction({ id, face, edge, name, hint, meta, disabled, picked, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`candy w-full p-3 text-left ${picked ? 'translate-y-1' : ''}`}
      style={{ '--face': face, '--edge': edge }}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <ActionIcon id={id} className="h-5 w-5 shrink-0 text-white" />
          <span className="font-round text-[0.95rem] font-bold leading-tight">{name}</span>
        </span>
        {meta && (
          <span className="shrink-0 font-nunito text-[0.56rem] font-extrabold uppercase tracking-wide text-white/85">
            {meta}
          </span>
        )}
      </span>
      {hint && (
        <span className="mt-1 block font-nunito text-[0.72rem] font-bold leading-snug text-white/85">
          {hint}
        </span>
      )}
    </button>
  )
}

// Panel de cierre: mensaje + CTA dorado al desenlace.
export function EndPanel({ text, onComplete }) {
  return (
    <div className="animate-fade-up mt-5">
      <p className="font-nunito text-[0.92rem] leading-snug text-ink-soft">{text}</p>
      <button
        type="button"
        onClick={onComplete}
        className="candy mt-4 w-full px-5 py-3.5 text-[1rem]"
        style={{ '--face': GOLD_ACCENT.face, '--edge': GOLD_ACCENT.edge }}
      >
        Ver el desenlace →
      </button>
    </div>
  )
}

// Chip educativo: revela un concepto en un panel claro y marca "visto".
export function EduChip({ conceptId, label, onSeen }) {
  const [open, setOpen] = useState(false)
  const c = concepts[conceptId]
  if (!c) return null
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          const next = !open
          setOpen(next)
          if (next) onSeen?.(conceptId)
        }}
        aria-expanded={open}
        className="rounded-full border border-dashed border-ink-mute/60 bg-surface/70 px-2.5 py-1 font-nunito text-[0.66rem] font-bold text-ink-soft transition-colors hover:border-ink-mute"
      >
        {label || c.title} ⓘ
      </button>
      {open && (
        <div
          role="dialog"
          className="animate-fade-up shadow-panel absolute left-0 top-full z-30 mt-2 w-64 max-w-[80vw] rounded-[16px] bg-panel p-3 text-left"
        >
          <p className="font-round text-[0.86rem] font-bold text-ink-warm">{c.title}</p>
          <p className="mt-1 font-nunito text-[0.78rem] italic text-ink-mute">{c.short}</p>
          <p className="mt-1.5 font-nunito text-[0.82rem] leading-snug text-ink-soft">{c.body}</p>
        </div>
      )}
    </div>
  )
}
