import SequenceChoice from '../SequenceChoice.jsx'
import HyperInflation from './HyperInflation.jsx'
import BankRun from './BankRun.jsx'
import SpeculativeAttack from './SpeculativeAttack.jsx'
import Expectations from './Expectations.jsx'
import ShockTherapy from './ShockTherapy.jsx'
import PinFactory from './PinFactory.jsx'
import AssemblyLine from './AssemblyLine.jsx'
import SurplusValue from './SurplusValue.jsx'
import AggregateDemand from './AggregateDemand.jsx'
import MonetaryRule from './MonetaryRule.jsx'
import VolatilityDance from './VolatilityDance.jsx'
import PensionReform from './PensionReform.jsx'
import PrintPress from './PrintPress.jsx'
import BudgetFlow from './BudgetFlow.jsx'
import MarketEquilibrium from './MarketEquilibrium.jsx'
import MonopolyPrice from './MonopolyPrice.jsx'
import ChoiceBudget from './ChoiceBudget.jsx'

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
  shockTherapy: ShockTherapy,
  pinFactory: PinFactory,
  assemblyLine: AssemblyLine,
  surplusValue: SurplusValue,
  aggregateDemand: AggregateDemand,
  monetaryRule: MonetaryRule,
  volatilityDance: VolatilityDance,
  pensionReform: PensionReform,
  pressYourLuck: PrintPress, // prototipo (archetipo #4), se enruta por episode.mechanicVariant
  budgetFlow: BudgetFlow, // prototipo (archetipo #1 — REPARTIR), se enruta por episode.mechanicVariant
  marketEquilibrium: MarketEquilibrium, // prototipo (línea Micro, ep15 — aguja de equilibrio)
  monopolyPrice: MonopolyPrice, // prototipo (línea Micro, ep17 — slider de precio / monopolio)
  choiceBudget: ChoiceBudget, // prototipo (línea Micro, ep16 — asignar presupuesto / costo de oportunidad)
}

export default function MechanicHost({ episode, allies, dailySeed, onComplete, onConceptSeen }) {
  // `mechanicVariant` permite enrutar a un prototipo sin borrar `mechanic`
  // (para poder comparar). Ej.: Ep1 con mechanicVariant: 'pressYourLuck'.
  const Mechanic = MECHANICS[episode.mechanicVariant ?? episode.mechanic]

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
        dailySeed={dailySeed}
        onComplete={onComplete}
        onConceptSeen={onConceptSeen}
      />
    </div>
  )
}
