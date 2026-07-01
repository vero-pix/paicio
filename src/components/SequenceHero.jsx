// ─────────────────────────────────────────────────────────────────────────
// SequenceHero — banner visual del Episodio 5 (Plan Real / URV).
//
// El Ep5 no tiene medidores en vivo (es un puzzle de orden), así que el héroe
// es un banner temático: la inflación crónica acechando y el "puente" de la URV
// que cruza del dinero viejo al Real. Refuerza la identidad de serie sin
// duplicar la lista de pasos que viene debajo.
// ─────────────────────────────────────────────────────────────────────────

export default function SequenceHero() {
  return (
    <div className="animate-fade-in overflow-hidden rounded-md border border-edge bg-cell-2/70">
      <div className="border-b border-edge/70 bg-cell/60 px-3 py-1.5 text-center">
        <p className="font-display text-[0.62rem] font-black tracking-[0.28em] text-paper">
          EL HERALDO DE PAICIO
        </p>
      </div>

      <div className="px-4 pt-3 text-center">
        <p className="font-display text-[0.86rem] font-black uppercase leading-tight text-paper">
          INFLACIÓN DE 2.500%: EL PLAN REAL ES LA ÚLTIMA CARTA
        </p>

        {/* Puente de la URV: del dinero viejo al Real */}
        <div className="mt-2 px-1">
          <svg viewBox="0 0 240 76" className="w-full" aria-hidden>
            {/* orillas */}
            <path d="M0 62 H36 M204 62 H240" stroke="var(--color-edge)" strokeWidth="1.6" />
            {/* pilares (los 4 pasos) */}
            <g stroke="var(--color-paper-dim)" strokeWidth="1.4" fill="none">
              <path d="M72 62V44M120 62V38M168 62V44" />
            </g>
            {/* tablero / arcos del puente */}
            <g stroke="var(--color-paper)" strokeWidth="1.7" fill="none" strokeLinecap="round">
              <path d="M36 44 Q120 8 204 44" />
              <path d="M36 44 H204" />
            </g>
            {/* extremos: moneda vieja → Real */}
            <g stroke="var(--color-crisis)" strokeWidth="1.5" fill="none">
              <circle cx="20" cy="52" r="8" />
              <path d="M17 52h6M20 49v6" />
            </g>
            <g stroke="var(--color-positive)" strokeWidth="1.5" fill="none">
              <circle cx="220" cy="52" r="8" />
              <path d="M220 48v8M217.5 50c0-1 1.1-1.6 2.5-1.6s2.5.6 2.5 1.6-1.1 1.4-2.5 1.5-2.5.6-2.5 1.6 1.1 1.6 2.5 1.6 2.5-.6 2.5-1.6" />
            </g>
          </svg>
        </div>

        <p className="mt-1 mb-3 font-body text-[0.72rem] italic leading-snug text-paper-dim">
          La URV: una moneda virtual como puente. El orden lo es todo.
        </p>
      </div>
    </div>
  )
}
