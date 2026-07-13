import { useState } from 'react'

const QUESTIONS = {
  ep1: {
    pregunta: '¿Qué provocó la hiperinflación en Paicio?',
    opciones: [
      { id: 'a', label: 'Imprimir dinero sin respaldo para tapar el déficit' },
      { id: 'b', label: 'La deuda externa subió los precios del pan' },
      { id: 'c', label: 'Los especuladores acapararon los alimentos' },
    ],
    correcta: 'a',
    explicacion: 'El gobierno imprimió pesos para pagar sus cuentas. Cada vez que imprimía, los precios subían — y necesitaba imprimir aún más para pagar lo mismo.',
  },
  ep2: {
    pregunta: '¿Por qué la gente retira todo su dinero del banco en una corrida?',
    opciones: [
      { id: 'a', label: 'Porque los bancos ya no tienen liquidez' },
      { id: 'b', label: 'Porque cada uno teme que los demás retiren primero' },
      { id: 'c', label: 'Porque el gobierno lo ordena' },
    ],
    correcta: 'b',
    explicacion: 'Es una profecía autocumplida: si todos creen que el banco quebrará, retiran su dinero, y el banco efectivamente quiebra. El miedo colectivo causa la crisis.',
  },
  ep5: {
    pregunta: '¿Cuál fue la clave del Plan Real?',
    opciones: [
      { id: 'a', label: 'Congelar todos los precios de golpe' },
      { id: 'b', label: 'Imprimir una moneda nueva y reemplazar la vieja' },
      { id: 'c', label: 'Crear una unidad de cuenta estable antes de la moneda nueva' },
    ],
    correcta: 'c',
    explicacion: 'La genialidad fue crear la URV primero: una referencia de valor estable. La gente migró voluntariamente, y cuando todos los precios ya estaban en URV, crear el Real fue casi una formalidad.',
  },
  ep3: {
    pregunta: '¿Qué significa "defender la paridad"?',
    opciones: [
      { id: 'a', label: 'Usar reservas internacionales para mantener el tipo de cambio fijo' },
      { id: 'b', label: 'Subir los impuestos para equilibrar el presupuesto' },
      { id: 'c', label: 'Negociar con el FMI un nuevo préstamo' },
    ],
    correcta: 'a',
    explicacion: 'Defender la paridad es quemar reservas para sostener el valor de la moneda. El problema es que las reservas no son infinitas — y el mercado lo sabe.',
  },
}

export default function ConceptCheck({ episodeId }) {
  const q = QUESTIONS[episodeId]
  const [answered, setAnswered] = useState(null)
  const [show, setShow] = useState(false)

  if (!q) return null

  const correcta = answered === q.correcta

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="flex w-full items-center gap-2 rounded-[14px] bg-surface/70 px-3 py-2 text-left shadow-card transition-colors hover:bg-surface"
      >
        <span className="font-nunito text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-mute">
          {show ? '▼' : '▶'} ¿Aprendiste? Una pregunta rápida
        </span>
      </button>

      {show && (
        <div className="animate-fade-up mt-2.5 rounded-[16px] bg-surface p-3.5 shadow-card">
          <p className="font-nunito text-[0.82rem] font-bold leading-snug text-ink-warm">
            {q.pregunta}
          </p>

          <div className="mt-2.5 space-y-2">
            {q.opciones.map((o) => {
              const selected = answered === o.id
              const isCorrect = o.id === q.correcta
              return (
                <button
                  key={o.id}
                  type="button"
                  disabled={answered != null}
                  onClick={() => setAnswered(o.id)}
                  className={`flex w-full items-start gap-2.5 rounded-[12px] p-2.5 text-left transition-all ${
                    answered == null
                      ? 'bg-cream/50 hover:bg-cream'
                      : isCorrect
                        ? 'bg-good/10'
                        : selected && !isCorrect
                          ? 'bg-crisis-hot/10'
                          : 'bg-cream/30'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                      answered == null
                        ? 'border border-ink-mute/40 text-ink-mute'
                        : isCorrect
                          ? 'bg-good text-white'
                          : selected
                            ? 'bg-crisis-hot text-white'
                            : 'border border-ink-mute/20 text-ink-mute/50'
                    }`}
                  >
                    {answered != null && isCorrect ? '✓' : answered != null && selected ? '✗' : o.id.toUpperCase()}
                  </span>
                  <span className={`font-nunito text-[0.8rem] leading-snug ${answered == null ? 'text-ink-soft' : isCorrect ? 'text-good' : selected ? 'text-crisis-hot' : 'text-ink-mute'}`}>
                    {o.label}
                  </span>
                </button>
              )
            })}
          </div>

          {answered && (
            <div className="animate-fade-up mt-2.5 rounded-[12px] bg-panel p-2.5">
              <p className={`font-nunito text-[0.75rem] font-bold ${correcta ? 'text-good' : 'text-crisis-hot'}`}>
                {correcta ? '✓ Correcto' : '✗ No exactamente'}
              </p>
              <p className="mt-0.5 font-nunito text-[0.72rem] leading-snug text-ink-soft">
                {q.explicacion}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
