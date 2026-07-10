// ─────────────────────────────────────────────────────────────────────────
// Ayuda contextual por mecánica — "Cómo se juega esta crisis".
//
// Cada episodio se juega con un VERBO distinto (deslizar, arrastrar, tocar en el
// momento justo…). Este mapa, keado por la mecánica (episode.mechanicVariant ??
// episode.mechanic), alimenta el panel de Ayuda con: qué haces con el dedo, qué
// miden los medidores y (cuando aplica) si las cartas se deslizan. La meta y la
// cantidad de turnos se derivan en vivo del episodio (goalChip de tutorials.js y
// rondas/dias de la config), así que acá va solo lo que no vive en otro lado.
// ─────────────────────────────────────────────────────────────────────────

export const MECHANIC_HELP = {
  pressYourLuck: {
    verbo: 'Presiona tu suerte',
    gesto: 'Toca "Imprimir" para ganar alivio ahora… o "Cortar" y estabilizar antes de que reviente.',
    medidores: 'El alivio que acumulas y el riesgo de un reventón hiperinflacionario.',
  },
  hyperinflation: {
    verbo: 'Toca',
    gesto: 'Cada mes decides cuánto dinero imprimir para tapar el hoyo fiscal.',
    medidores: 'La inflación y el respaldo de la gente.',
  },
  bankRun: {
    verbo: 'Toca',
    gesto: 'Cada día eliges una medida para frenar la corrida antes de que se seque el banco.',
    medidores: 'Las reservas del banco y la confianza de la gente.',
    swipe: true,
  },
  speculativeAttack: {
    verbo: 'Toca',
    gesto: 'Cada día decides cómo defender la paridad… y cuándo soltarla a tiempo.',
    medidores: 'Las reservas internacionales y el empleo.',
    swipe: true,
  },
  expectations: {
    verbo: 'Toca',
    gesto: 'Cada ronda eliges una medida para romper la inercia inflacionaria.',
    medidores: 'Las expectativas de inflación y tu credibilidad.',
    swipe: true,
  },
  shockTherapy: {
    verbo: 'Toca',
    gesto: 'Cada ronda eliges la intensidad del ajuste: mucho duele, poco no alcanza.',
    medidores: 'La inflación y el apoyo social.',
    swipe: true,
  },
  sequence: {
    verbo: 'Arrastra',
    gesto: 'Ordena los cuatro pasos del plan en la secuencia correcta.',
    medidores: 'No hay medidores: lo que importa es el orden.',
  },
  pinFactory: {
    verbo: 'Toca',
    gesto: 'Responde y descubre en vivo por qué dividir el trabajo multiplica la producción.',
    medidores: 'No hay medidores: es una demostración.',
  },
  assemblyLine: {
    verbo: 'Toca',
    gesto: 'Cada ronda eliges una mejora para la línea de montaje.',
    medidores: 'Los minutos por auto y el costo de producción.',
    swipe: true,
  },
  surplusValue: {
    verbo: 'Toca',
    gesto: 'Cada ronda decides cuánto exprimir la fábrica.',
    medidores: 'El capital que acumulas y la moral de los obreros.',
  },
  aggregateDemand: {
    verbo: 'Toca',
    gesto: 'Cada ronda eliges una política para reactivar la economía.',
    medidores: 'Desempleo, inflación, PIB y deuda pública.',
    swipe: true,
  },
  budgetFlow: {
    verbo: 'Arrastra',
    gesto: 'Reparte un presupuesto fijo entre las palancas arrastrando las fronteras de la barra. El multiplicador se ve en vivo.',
    medidores: 'Desempleo, inflación, PIB y deuda pública.',
  },
  monetaryRule: {
    verbo: 'Toca',
    gesto: 'Cada ronda eliges una acción monetaria para domar la inflación.',
    medidores: 'Inflación, desempleo, expectativas y credibilidad.',
  },
  volatilityDance: {
    verbo: 'Toca en el momento justo',
    gesto: 'La barra oscila como el precio del cobre: tócala en la zona dorada para vender caro.',
    medidores: 'El cobre que acumulas según tu timing.',
  },
  pensionReform: {
    verbo: 'Toca',
    gesto: 'Cada ronda eliges una reforma al sistema de pensiones.',
    medidores: 'Tasa de reemplazo, cobertura, confianza, fondo y costo fiscal.',
  },
  marketEquilibrium: {
    verbo: 'Mueve la aguja',
    gesto: 'Arrastra la aguja del precio (o usa −/+). Sube si se agota, baja si sobra, hasta vaciar el mercado; luego fija el precio.',
    medidores: 'Cuánto hay para vender (oferta) y cuánto quiere comprar la gente (demanda).',
  },
  monopolyPrice: {
    verbo: 'Mueve el precio',
    gesto: 'Arrastra el slider del precio (o −/+) buscando la máxima ganancia: la barra verde se llena en la cima de la joroba. Luego fija el precio.',
    medidores: 'Las unidades que vendes y la ganancia (precio − costo × unidades).',
  },
  choiceBudget: {
    verbo: 'Toca para elegir',
    gesto: 'Toca los deseos para llevarlos (y de nuevo para soltarlos) sin pasarte de tu plata. No alcanza para todo: elegir uno es dejar otro. Luego confirma.',
    medidores: 'La plata que te queda y la felicidad que juntas con lo elegido.',
  },
  externalityReg: {
    verbo: 'Mueve el límite',
    gesto: 'Arrastra el límite a la pesca (o −/+): poco límite = mucha actividad pero el río se agota; mucho = río sano pero poca economía. Cierra la temporada cuando encuentres el punto.',
    medidores: 'La salud del río (un stock que se arrastra entre temporadas) y la actividad económica.',
  },
}

// Turnos del episodio para el verbo activo: rondas o días, con su etiqueta.
export function turnosDe(episode) {
  const key = episode?.mechanicVariant ?? episode?.mechanic
  const cfg = key ? episode?.[key] : null
  if (!cfg) return null
  if (typeof cfg.rondas === 'number') return { n: cfg.rondas, label: cfg.rondas === 1 ? 'ronda' : 'rondas' }
  if (typeof cfg.dias === 'number') return { n: cfg.dias, label: cfg.dias === 1 ? 'día' : 'días' }
  return null
}

export const helpForEpisode = (episode) => {
  const key = episode?.mechanicVariant ?? episode?.mechanic
  return key ? MECHANIC_HELP[key] ?? null : null
}
