import SequenceChoice from '../SequenceChoice.jsx'
import HyperInflation from './HyperInflation.jsx'
import BankRun from './BankRun.jsx'
import SpeculativeAttack from './SpeculativeAttack.jsx'
import Expectations from './Expectations.jsx'

// ─────────────────────────────────────────────────────────────────────────
// MechanicHost — despachador de la mecánica central de cada episodio.
//
// Se renderiza en la fase interactiva (post-celda) para los episodios cuya
// `mechanic` NO es el dilema del prisionero. Cada mecánica es autocontenida:
// recibe el contrato común (episode, allies, onComplete, onConceptSeen) y
// termina llamando onComplete(outcomeId), donde outcomeId es una clave de
// `episode.outcomes` (perfect / partial / wrong).
//
// El dilema del prisionero (Ep1) NO pasa por aquí: lo maneja App.jsx con su
// flujo propio de negociación + política.
// ─────────────────────────────────────────────────────────────────────────

const MECHANICS = {
  hyperinflation: HyperInflation,
  sequence: SequenceChoice,
  bankRun: BankRun,
  speculativeAttack: SpeculativeAttack,
  expectations: Expectations,
}

export default function MechanicHost({ episode, allies, onComplete, onConceptSeen }) {
  const Mechanic = MECHANICS[episode.mechanic]

  if (!Mechanic) {
    // Salvaguarda: mecánica desconocida. No debería ocurrir.
    return (
      <div className="mx-auto max-w-md px-5 py-10 text-center font-mono text-sm text-crisis">
        Mecánica no encontrada: {String(episode.mechanic)}
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <Mechanic
        episode={episode}
        allies={allies}
        onComplete={onComplete}
        onConceptSeen={onConceptSeen}
      />
    </div>
  )
}
