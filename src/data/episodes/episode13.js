// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 13 — LA CUECA DEL COBRE
// Referencia: Chile, 1971–2025 · Volatilidad del cobre y Codelco
//
// Mecánica NUEVA: volatilityDance (rhythm game). El precio del cobre oscila
// como una pareja de cueca. El jugador debe clickear en el momento exacto
// para vender cuando el precio está en la zona dorada.
//
// La lección: el ciclo del cobre domina la economía chilena. La
// "maldición de los recursos naturales" no es un destino — depende de
// cuándo y cómo vendes. Y de si inviertes cuando hay bonanza.
//
// Lógica en src/utils/volatilityDance.js, UI en VolatilityDance.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep13',
  numero: 1,
  line: 'chile',
  titulo: 'La Cueca del Cobre',
  año: 1971,
  crisisHistorica: 'El baile del cobre',
  paisReferencia: 'Chile',
  resumen:
    'El cobre es el sueldo de Chile. Pero su precio baila como cueca: sube, baja, y si no le agarras el ritmo, te deja sin plata. Aprende a bailar con la volatilidad.',
  bloqueado: false,
  mechanic: 'volatilityDance',
  newspaper: {
    name: 'EL MERCURIO',
    dateline: 'SANTIAGO, 11 de julio de 1971',
    number: 'Edición Especial',
    headline: 'CODELCO: EL COBRE ES DE CHILE',
    subhead:
      'Por primera vez, el cobre chileno es completamente nuestro. La gran pregunta: ¿qué hacemos cuando el precio sube? ¿Y cuando baja?',
  },
  opening: [
    'Chile, 1971.',
    'El cobre acaba de ser nacionalizado.',
    'La fiesta es enorme.',
    '',
    'Pero en la minería hay una verdad incómoda:',
    'el precio del cobre no lo pone Chile.',
    'Lo pone el mundo.',
    'Y el mundo es impredecible.',
    '',
    'Un estaño, un ritmo que no controlas.',
    'Tu pega es bailar con el precio.',
    'Vender cuando está arriba.',
    'Aguantar cuando está abajo.',
    'Y ojalá invertir cuando hay viento a favor.',
    '',
    'La cueca del cobre empieza.',
    '¿Le agarras el ritmo?',
  ],
  cellNarration: [
    'El cobre es el 50% de las exportaciones chilenas. Cuando el precio sube, el fisco se llena. Cuando baja, se ajusta el cinturón. El patrón se repite desde 1971: auge, caída, auge, caída.',
    'La "maldición de los recursos naturales" no es inevitable. Noruea evitó la maldición del petróleo ahorrando en los años buenos. Chile lleva décadas intentándolo — a veces resulta, a veces no.',
    'Codelco es la empresa más importante del país. Pero necesita inversión para mantener producción. Invertir cuando el precio está alto parece obvio... pero siempre hay alguien que quiere gastar la plata en otra cosa.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: null,
  contextoHistorico: { titulo: 'Chile, el país del cobre' },
  trendChart: null,
  prisoners: [],
  volatilityDance: {
    intro: 'El precio del cobre baila como cueca. Cada ronda tenés que elegir una estrategia y cliquear en el momento justo. La barra se mueve; la zona dorada es el mejor precio. Afiná el oído y la paciencia.',
    rondas: 8,
  },
  eventos: [
    {
      ronda: 3,
      titulo: 'China aparece',
      desc: 'China entra al mercado comprando cobre como si no hubiera mañana. El precio se dispara artificialmente. ¿Vendes ahora o esperas más?',
      efecto: {},
    },
    {
      ronda: 5,
      titulo: 'Huelga en la mina',
      desc: 'Paro de trabajadores en Chuquicamata. La producción cae y el precio sube por la escasez, pero invertir en Codelco ahora es más caro.',
      efecto: {},
    },
    {
      ronda: 7,
      titulo: 'El sustituto',
      desc: 'Aparece una tecnología que reemplaza el cobre en componentes eléctricos. El precio se desploma — ojo con quedar con inventario caro.',
      efecto: {},
    },
  ],
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'volatilidadCobre',
      headlineWin: '¡MAESTRO CUECUERO! LE AGARRASTE EL RITMO AL COBRE',
      resultText:
        'Bailaste con el precio del cobre como un cuequero de fiesta: vendiste en los peaks, no entraste en pánico en las bajas, e invertiste cuando hubo viento a favor. Chile tiene colchón fiscal, Codelco está modernizado y el futuro se ve estable. El cobre baila, pero vos llevás la batuta.',
      scores: { cobre: 92, timing: 88, codelco: 80 },
      history:
        'Chile depende del cobre desde el siglo XIX. En los 2000, con precios históricos (superciclo 2003-2013), el país ahorró US$ 20.000 millones en fondos soberanos. Pero la tentación de gastar siempre gana: en 2014, cuando el precio cayó, el gasto fiscal no se ajustó y el déficit creció. La lección del cobre no es vender caro — es ahorrar cuando está caro.',
    },
    partial: {
      id: 'partial',
      concept: 'volatilidadCobre',
      headlineWin: 'SEDE BIEN, PERO TE FALTÓ RITMO PARA EL AGUANTE',
      resultText:
        'Tuviste momentos brillantes pero también te agarraron mal parado. Tal vez vendiste cuando el precio iba subiendo, o no invertiste en los momentos clave. Chile sobrevive pero sin el colchón que podría haber tenido. El cobre te bailó un poco — la próxima, mejor punteo.',
      scores: { cobre: 60, timing: 55, codelco: 50 },
      history:
        'El ciclo del cobre es implacable: entre 2004 y 2011 el precio pasó de US$1.20 a US$4.40 la libra. Entre 2015 y 2020 cayó a US$2.20. Los países que ahorran en las vacas gordas (como Noruega) capean las vacas flacas. Chile ahorró algo, pero no lo suficiente. La política del cobre es también política fiscal.',
    },
    wrong: {
      id: 'wrong',
      concept: 'volatilidadCobre',
      headlineWin: 'TE BAILARON: EL COBRE TE GANÓ',
      resultText:
        'El precio del cobre te llevó y te trajo como hoja al viento. Vendiste cuando estaba barato por miedo, te quedaste cuando estaba caro por ambición, y no invertiste en Codelco cuando había que hacerlo. El fisco terminó con déficit y la minería estancada. El cobre no perdona la falta de ritmo.',
      scores: { cobre: 22, timing: 25, codelco: 20 },
      history:
        'La maldición de los recursos naturales es real cuando un país depende de un solo commoditie sin diversificar. Zambia, Nigeria y Venezuela lo sufrieron. Chile ha esquivado la peor parte — pero no porque el cobre sea diferente: porque hubo instituciones que contuvieron el desastre. Igual, cada ciclo de precios deja una lección: la paciencia y la disciplina son más importantes que el precio mismo.',
    },
  },
  policies: [],
}
