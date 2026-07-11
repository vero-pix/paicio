// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 16 — LA ELECCIÓN  (línea Micro · numero 1 — abre la línea)
// Referencia: costo de oportunidad / restricción presupuestaria. Ancla: tu
// bolsillo (mesada o sueldo del mes).
//
// Mecánica: choiceBudget (asignar presupuesto). Eliges qué deseos llevar con
// plata limitada; no puedes tenerlo todo. Cada elección cuesta lo mejor que
// dejas fuera (costo de oportunidad).
//
// Balance verificado: en cada ronda el óptimo reparte en gustos chicos y la
// tentación cara (zapatillas/audífonos) rinde menos — el costo de oportunidad
// se siente. Lógica en src/utils/choiceBudget.js, UI en ChoiceBudget.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep16',
  numero: 1,
  line: 'micro',
  titulo: 'La Elección',
  año: 'hoy',
  crisisHistorica: 'Tu bolsillo',
  paisReferencia: 'Tu bolsillo',
  resumen:
    'Te llegó la plata del mes y hay más deseos que billetera. No puedes tenerlo todo: cada cosa que eliges es plata (y felicidad) que sacrificas en otra. Arma la mejor combinación con lo que tienes.',
  bloqueado: false,
  mechanic: 'choiceBudget',
  newspaper: null,
  opening: [
    'Llegó la plata del mes.',
    'Y, como siempre, hay más ganas que billetera.',
    '',
    'Salir con amigos, ese libro que quieres, el cine, guardar un poco…',
    'No alcanza para todo. Toca elegir.',
    '',
    'Y elegir algo es, siempre, renunciar a otra cosa.',
    'Eso que dejas fuera tiene un nombre: costo de oportunidad.',
  ],
  cellNarration: [
    'La economía parte de una idea simple: los recursos son limitados y los deseos no. Con plata (o tiempo) limitada, elegir una cosa significa NO elegir otra. El costo real de lo que compras no es solo su precio: es lo mejor que pudiste hacer con esa misma plata y no hiciste.',
    'A eso se le llama costo de oportunidad. El café diario "cuesta" el libro que no compraste; la hora en el celular "cuesta" el estudio que no hiciste. No hay decisión sin renuncia.',
    'Por eso administrar plata no es solo sumar y restar: es priorizar. La mejor elección no es la que gasta todo ni la que ahorra todo — es la que te deja la mayor felicidad posible dentro de lo que tienes.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: {
    itemBase: 'Tu plata del mes',
    precioInicial: 10000,
    currency: '$',
    tasaInflacion: 1,
    umbralCritico: 999999,
  },
  contextoHistorico: { titulo: 'Tu bolsillo, hoy' },
  trendChart: null,
  prisoners: [],
  // Config del verbo ASIGNAR. Cada ronda: un presupuesto y deseos con precio y
  // felicidad. La mejor combinación (óptimo) se calcula por fuerza bruta.
  choiceBudget: {
    rondas: 4,
    objetivo: { perfect: 0.9, partial: 0.65 }, // % de la felicidad óptima acumulada
    rondasData: [
      {
        presupuesto: 10000,
        items: [
          { id: 'salir1', label: 'Salir a comer', icon: '🍔', precio: 6000, felicidad: 7 },
          { id: 'libro1', label: 'Un libro', icon: '📚', precio: 4000, felicidad: 5 },
          { id: 'cine1', label: 'Cine', icon: '🎬', precio: 3000, felicidad: 4 },
          { id: 'ahorro1', label: 'Ahorrar', icon: '🐷', precio: 5000, felicidad: 6 },
        ],
      },
      {
        // La tentación cara (zapatillas) rinde menos que tres gustos chicos.
        presupuesto: 12000,
        items: [
          { id: 'zapa2', label: 'Zapatillas nuevas', icon: '👟', precio: 9000, felicidad: 9 },
          { id: 'salir2', label: 'Salir a comer', icon: '🍔', precio: 5000, felicidad: 6 },
          { id: 'libro2', label: 'Un libro', icon: '📚', precio: 4000, felicidad: 5 },
          { id: 'ahorro2', label: 'Ahorrar', icon: '🐷', precio: 3000, felicidad: 4 },
        ],
      },
      {
        // Shock: te bajaron la mesada. Menos plata, prioridades más duras.
        presupuesto: 7000,
        items: [
          { id: 'salir3', label: 'Salir a comer', icon: '🍔', precio: 5000, felicidad: 6 },
          { id: 'libro3', label: 'Un libro', icon: '📚', precio: 4000, felicidad: 5 },
          { id: 'cine3', label: 'Cine', icon: '🎬', precio: 3000, felicidad: 4 },
          { id: 'ahorro3', label: 'Ahorrar', icon: '🐷', precio: 3000, felicidad: 4 },
        ],
      },
      {
        // Otra tentación cara: audífonos. Tres gustos chicos rinden más.
        presupuesto: 12000,
        items: [
          { id: 'audio4', label: 'Audífonos', icon: '🎧', precio: 11000, felicidad: 10 },
          { id: 'salir4', label: 'Salir a comer', icon: '🍔', precio: 5000, felicidad: 6 },
          { id: 'libro4', label: 'Un libro', icon: '📚', precio: 4000, felicidad: 5 },
          { id: 'cine4', label: 'Cine', icon: '🎬', precio: 3000, felicidad: 4 },
        ],
      },
    ],
  },
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'costoOportunidad',
      headlineWin: '¡ELEGISTE COMO CAMPEÓN/A! ENTENDISTE EL COSTO DE OPORTUNIDAD',
      resultText:
        'Casi siempre armaste la combinación que más felicidad te daba con la plata que tenías. No caíste en la tentación de gastarlo todo en una sola cosa cara: entendiste que lo caro de cada elección es lo mejor que dejas fuera.',
      scores: { estabilidad: 85, empleo: 82, confianza: 88, crecimiento: 84 },
      history:
        'El costo de oportunidad es la idea más básica de la economía: como no puedes tenerlo todo, el costo real de una decisión es lo mejor que renunciaste. Vale para tu plata, tu tiempo y hasta para los países (gastar en esto es no gastar en aquello). Quien decide bien no mira solo el precio: mira qué deja de hacer.',
    },
    partial: {
      id: 'partial',
      concept: 'costoOportunidad',
      headlineWin: 'BUENAS ELECCIONES, PERO DEJASTE FELICIDAD SOBRE LA MESA',
      resultText:
        'Elegiste bien varias veces, pero en otras una combinación distinta te habría dejado más contento/a con la misma plata. A veces la cosa cara y tentadora rinde menos que dos o tres gustos chicos. Priorizar es comparar, no solo desear.',
      scores: { estabilidad: 58, empleo: 56, confianza: 62, crecimiento: 58 },
      history:
        'Elegir bien es maximizar felicidad por peso gastado. Un solo capricho caro puede "comerse" el presupuesto y dejarte con menos que si repartieras. El truco es preguntarse: con esta misma plata, ¿hay algo que me deje más contento/a?',
    },
    wrong: {
      id: 'wrong',
      concept: 'costoOportunidad',
      headlineWin: 'TE QUEDASTE LEJOS DE LA MEJOR COMBINACIÓN',
      resultText:
        'La mayoría de las veces la elección no fue la que más rendía: o dejaste plata sin usar, o la gastaste en cosas que daban poca felicidad por su precio. Con recursos limitados, cada peso cuenta y cada elección tiene un costo: lo que dejas fuera.',
      scores: { estabilidad: 30, empleo: 28, confianza: 26, crecimiento: 29 },
      history:
        'No decidir también es decidir: dejar plata sin usar es renunciar a felicidad. Y gastarla mal (mucho en lo que rinde poco) también. La restricción presupuestaria obliga a jerarquizar; el costo de oportunidad es la vara para hacerlo.',
    },
  },
  policies: [],
}
