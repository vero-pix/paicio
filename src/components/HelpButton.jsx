import { useState } from 'react'
import { LINES } from '../data/lines.js'
import { helpForEpisode, turnosDe } from '../data/mechanicHelp.js'
import { tutorialFor } from '../theme/tutorials.js'

// ─────────────────────────────────────────────────────────────────────────
// HelpButton — botón de Ayuda (?) persistente + panel.
//
// Se monta a nivel de App (como VersionBadge) para tener a mano el episodio y
// la fase, y aparece en TODAS las pantallas (portada, mapa, celda, mecánica,
// desenlace). Abrirlo es un overlay: NO desmonta la mecánica, así que el
// progreso de la partida en curso se conserva.
//
// El contenido es CONTEXTUAL: si hay un episodio activo, muestra "Cómo se juega
// esta crisis" derivado de la mecánica (verbo/dedo, medidores, meta, turnos).
// Si no, muestra la ayuda general de Paicio y sus 4 líneas.
//
// z-40 el disparador, z-50 el panel (bajo los coach-marks, z-60).
// ─────────────────────────────────────────────────────────────────────────

function Fila({ icon, label, children }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 shrink-0 text-[1rem] leading-none" aria-hidden>
        {icon}
      </span>
      <p className="font-nunito text-[0.86rem] leading-snug text-ink-soft">
        <span className="font-extrabold text-ink-warm">{label}:</span> {children}
      </p>
    </div>
  )
}

function ContextualHelp({ episode }) {
  const help = helpForEpisode(episode)
  const goal = tutorialFor(episode.id)?.goalChip
  const turnos = turnosDe(episode)

  return (
    <>
      <p className="mt-0.5 font-nunito text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-ink-mute">
        Cómo se juega
      </p>
      <h3 className="font-round text-[1.4rem] font-bold leading-tight text-ink-warm">
        {episode.titulo}
      </h3>

      {help ? (
        <div className="mt-4 space-y-3">
          <Fila icon="👆" label={help.verbo}>
            {help.gesto}
          </Fila>
          <Fila icon="📊" label="Medidores">
            {help.medidores}
          </Fila>
          {goal && (
            <Fila icon="🎯" label="Meta">
              {goal}.
            </Fila>
          )}
          {turnos && (
            <Fila icon="⏱️" label="Turnos">
              Tienes {turnos.n} {turnos.label} para lograrlo.
            </Fila>
          )}
          {help.swipe && (
            <Fila icon="🃏" label="Cartas">
              Cuando aparezca una carta de decisión, deslízala (derecha una opción,
              izquierda la otra) o toca los botones.
            </Fila>
          )}
        </div>
      ) : (
        <p className="mt-4 font-nunito text-[0.88rem] leading-snug text-ink-soft">
          Sigue los medidores y las pistas en pantalla: cada decisión mueve la
          economía. La mecánica es la lección.
        </p>
      )}
    </>
  )
}

function GeneralHelp() {
  return (
    <>
      <h3 className="font-round text-[1.5rem] font-bold leading-tight text-ink-warm">
        ¿Qué es Paicio?
      </h3>
      <p className="mt-2 font-nunito text-[0.9rem] leading-snug text-ink-soft">
        Economía que se juega, no se estudia. Tomas el mando de un país y decides:
        cada nivel es una mecánica distinta y{' '}
        <span className="font-extrabold text-ink-warm">la mecánica es la lección</span>.
      </p>

      <p className="mt-5 font-nunito text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-ink-mute">
        Cuatro líneas para recorrer
      </p>
      <div className="mt-2 space-y-2">
        {LINES.map((l) => (
          <div key={l.id} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-[1.1rem] leading-none" aria-hidden>
              {l.icon}
            </span>
            <p className="font-nunito text-[0.84rem] leading-snug text-ink-soft">
              <span className="font-extrabold text-ink-warm">{l.name}</span> ·{' '}
              {l.subtitle}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 font-nunito text-[0.86rem] leading-snug text-ink-soft">
        <span className="font-extrabold text-ink-warm">Cada crisis se juega distinto:</span>{' '}
        deslizas cartas, arrastras sliders, tocas en el momento justo. ¿Dudas en
        una partida? Vuelve a tocar este{' '}
        <span className="font-extrabold">?</span> para ver cómo se juega ese episodio.
      </p>

      <div className="mt-5 rounded-[16px] px-4 py-3" style={{ background: '#FBDAD3' }}>
        <p className="font-nunito text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-[#D24C39]">
          Eres tester
        </p>
        <p className="mt-1 font-nunito text-[0.82rem] leading-snug text-ink-soft">
          Si algo se rompe, confunde o se puede mejorar, toca el botón{' '}
          <span className="font-extrabold">💬</span> y me llega directo. Todo suma.
        </p>
      </div>
    </>
  )
}

export default function HelpButton({ episode = null }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Disparador fijo (arriba a la derecha, a la izquierda del 🔊). */}
      <div
        className="fixed right-14 top-3 z-40"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingRight: 'env(safe-area-inset-right)' }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ayuda: cómo se juega"
          className="shadow-card flex h-9 w-9 items-center justify-center rounded-full bg-surface font-round text-[1.1rem] font-bold text-ink-warm transition-colors hover:bg-panel"
        >
          ?
        </button>
      </div>

      {open && (
        <div
          className="on-cream animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-[#2A1C0C]/60 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="shadow-panel max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-t-[24px] bg-panel p-6 pb-8 sm:rounded-[24px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-nunito text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-ink-mute">
                Ayuda
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="-mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-mute hover:bg-ink/10 hover:text-ink-warm"
              >
                ✕
              </button>
            </div>

            <div className="mt-1">
              {episode ? <ContextualHelp episode={episode} /> : <GeneralHelp />}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="candy mt-6 w-full px-5 py-3 text-[0.95rem]"
              style={{ '--face': 'var(--color-gold)', '--edge': 'var(--color-gold-edge)' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}
