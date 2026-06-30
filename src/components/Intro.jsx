// Pantalla de introducción: explica de qué se trata PAICIO antes de elegir
// episodio. Se muestra una vez por navegador (localStorage), y se puede
// volver a ver desde el selector con el enlace "¿Qué es PAICIO?".
export default function Intro({ onEnter }) {
  const beats = [
    {
      label: 'La situación',
      text: 'Eres el Ministro de Economía de Paicio, un país que no existe. Sus crisis, en cambio, sí existieron.',
    },
    {
      label: 'Estás preso',
      text: 'El presidente te culpó del desastre y te encerró. Desde la celda tienes que negociar tu salida y elegir la política que salvará —o hundirá— al país.',
    },
    {
      label: 'Cinco crisis reales',
      text: 'La hiperinflación de Weimar, el corralito argentino, el milagro chileno, la década perdida de Brasil y el Plan Real. Cada episodio recrea una crisis que de verdad pasó.',
    },
    {
      label: 'Cada decisión enseña',
      text: 'Teoría de juegos, inflación, deuda, el dilema del prisionero. No hay respuestas fáciles: vas a ver las consecuencias de lo que elijas.',
    },
  ]

  return (
    <div className="grain vignette relative mx-auto min-h-[80vh] max-w-md px-5 py-12">
      <div className="relative z-10">
        <header className="animate-fade-up text-center">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-paper-dim">
            El Ministro Encarcelado
          </p>
          <h1 className="mt-2 font-display text-5xl font-black tracking-tight text-paper">
            PAICIO
          </h1>
          <p className="mx-auto mt-4 max-w-xs font-body text-[0.92rem] italic leading-snug text-paper/80">
            Cinco crisis económicas reales. Un país ficticio. ¿Sobrevives a todas?
          </p>
        </header>

        <div className="mt-10 space-y-5">
          {beats.map((b, i) => (
            <div
              key={b.label}
              className="animate-fade-up border-l-2 border-edge pl-4"
              style={{ animationDelay: `${0.15 + i * 0.12}s` }}
            >
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-crisis">
                {b.label}
              </p>
              <p className="mt-1.5 font-body text-[0.92rem] leading-snug text-paper/90">
                {b.text}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="animate-fade-up mt-11 w-full rounded-sm border border-crisis bg-crisis/15 px-5 py-3.5 font-display text-base font-semibold tracking-wide text-paper transition-all hover:bg-crisis/25 active:scale-[0.99]"
          style={{ animationDelay: `${0.15 + beats.length * 0.12}s` }}
        >
          Entrar a la celda →
        </button>

        <p
          className="animate-fade-up mt-6 text-center font-mono text-[0.56rem] uppercase tracking-[0.2em] text-paper-dim/50"
          style={{ animationDelay: `${0.25 + beats.length * 0.12}s` }}
        >
          Teoría de juegos · Historia económica · Toma de decisiones
        </p>
      </div>
    </div>
  )
}
