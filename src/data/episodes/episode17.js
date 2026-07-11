// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 17 — EL ÚNICO VENDEDOR  (línea Micro · numero 3)
// Referencia: monopolio y poder de mercado. Ancla: la única farmacia del pueblo.
//
// Mecánica: monopolyPrice (slider de precio). Mueves el precio sobre la curva de
// demanda; la ganancia = (precio − costo) × unidades es una joroba con un punto
// máximo (el precio de monopolio). Cuando llega la competencia, la demanda se
// vuelve más elástica y ese punto baja.
//
// La lección: el único vendedor cobra por encima del costo porque puede; la
// competencia empuja el precio hacia el costo.
//
// Lógica en src/utils/monopolyPrice.js, UI en MonopolyPrice.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep17',
  numero: 3,
  line: 'micro',
  titulo: 'El Único Vendedor',
  año: 'hoy',
  crisisHistorica: 'La farmacia del pueblo',
  paisReferencia: 'El pueblo',
  resumen:
    'Eres la única farmacia en kilómetros. Le pones precio a un remedio: muy caro y nadie compra, muy barato y regalas el margen. Busca el precio que más ganancia deja… hasta que llegue la competencia.',
  bloqueado: false,
  mechanic: 'monopolyPrice',
  newspaper: null,
  opening: [
    'Tu farmacia es la única del pueblo.',
    'No hay otra en 40 kilómetros.',
    '',
    'Llega una caja de remedio para la presión. ¿A cuánto la vendes?',
    'Caro: ganas harto por caja, pero la gente lo piensa dos veces.',
    'Barato: vuela de la góndola, pero casi no te queda margen.',
    '',
    'En algún punto está la ganancia máxima. Y como eres el único…',
    'puedes cobrar más de lo que costaría con competencia.',
  ],
  cellNarration: [
    'Un monopolio es cuando hay un solo vendedor de algo sin sustituto cercano. No pone el precio a lo loco: lo pone donde su ganancia es máxima. Y ese punto está por ENCIMA del costo — más alto que si hubiera competencia.',
    'La ganancia forma una joroba: subes el precio y ganas más por unidad, pero vendes menos; bajas y vendes más, pero ganas menos por unidad. La cima de la joroba es el precio de monopolio.',
    'Cuando aparece otra farmacia, la gente compara y se va a la más barata: tu demanda se vuelve elástica. La cima de la joroba baja — te obliga a acercar el precio al costo. Eso es lo que hace la competencia por la gente.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: {
    itemBase: 'La caja de remedio',
    precioInicial: 1200,
    currency: '$',
    tasaInflacion: 1,
    umbralCritico: 999999,
  },
  contextoHistorico: { titulo: 'El pueblo, hoy' },
  trendChart: null,
  prisoners: [],
  // Config del verbo SLIDER DE PRECIO. Q = a − b·p (p = precio/escala);
  // ganancia = (p − costo)·Q. Óptimo p* = (a/b + costo)/2. Eventos desplazan
  // demanda (a) y elasticidad (b) — la competencia sube b y baja el óptimo.
  monopolyPrice: {
    rondas: 4,
    escala: 100, // p = precio / 100
    escalaGanancia: 100, // factor cosmético para mostrar la ganancia en pesos
    precioMin: 400,
    precioMax: 3000,
    precioPaso: 100,
    precioInicial: 1200,
    costo: 5, // costo por unidad, en p-units → $500
    demandaBase: 30, // a
    elasticidadBase: 2, // b
    demandaMin: 6,
    umbralAcierto: 0.85, // ganancia ≥ 85% del máximo = acierto
    unidad: '$',
    objetivo: { perfect: 3, partial: 2 }, // aciertos (de 4)
    eventos: [
      {
        ronda: 2,
        titulo: '🤧 Llega el invierno',
        desc: 'Se vienen los resfríos: más gente necesita el remedio. La demanda sube.',
        demanda: 8,
      },
      {
        ronda: 3,
        titulo: '🏪 Abre otra farmacia',
        desc: 'Ya no eres el único. La gente compara precios: tu demanda se vuelve más sensible (elástica) y el precio que más gana baja.',
        demanda: -4,
        elasticidadMult: 1.8,
      },
      {
        ronda: 4,
        titulo: '💊 Entra el genérico',
        desc: 'Aparece un genérico barato. La competencia aprieta aún más: el margen se achica y el precio se acerca al costo.',
        demanda: -6,
        elasticidadMult: 1.4,
      },
    ],
  },
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'poderMercado',
      headlineWin: '¡LE ACHUNTASTE A LA JOROBA! ENTENDISTE EL PODER DE MERCADO',
      resultText:
        'Como único vendedor encontraste el precio que más ganancia deja — por encima del costo, porque podías. Y cuando llegó la competencia, ajustaste hacia abajo: el precio justo cayó solo. Ese es el poder de mercado y, a la vez, su límite.',
      scores: { estabilidad: 86, empleo: 84, confianza: 88, crecimiento: 85 },
      history:
        'El monopolista maximiza ganancia donde el ingreso marginal iguala al costo marginal — y eso queda por encima del precio competitivo. Por eso el único almacén de un pueblo, la única farmacia o el único proveedor de agua cobran de más: no por maldad, por poder de mercado. La competencia (o la regulación) es lo que empuja el precio hacia el costo y beneficia a los compradores.',
    },
    partial: {
      id: 'partial',
      concept: 'poderMercado',
      headlineWin: 'GANASTE PLATA, PERO NO SIEMPRE EN LA CIMA',
      resultText:
        'Le achuntaste a varias rondas, pero en otras cobraste de más (te quedaste con cajas sin vender) o de menos (regalaste margen). La ganancia es una joroba: el truco es encontrar la cima cada vez que la demanda cambia.',
      scores: { estabilidad: 60, empleo: 58, confianza: 62, crecimiento: 60 },
      history:
        'El precio de monopolio se mueve cuando cambia la demanda o la elasticidad. Más clientes desesperados → puedes cobrar más. Más competencia → tienes que cobrar menos. Perseguir la cima de la joroba es exactamente lo que hace un negocio con poder de mercado.',
    },
    wrong: {
      id: 'wrong',
      concept: 'poderMercado',
      headlineWin: 'CASI SIEMPRE FUERA DE LA CIMA: MUY CARO O MUY BARATO',
      resultText:
        'La mayoría de las rondas quedaste lejos del punto: muy caro y la gente no compra; muy barato y regalas el margen. Ni lo uno ni lo otro maximiza la ganancia. Buscar la cima de la joroba — y verla bajar con la competencia — es de lo que se trata.',
      scores: { estabilidad: 30, empleo: 28, confianza: 26, crecimiento: 29 },
      history:
        'Cobrar de más ahuyenta compradores; cobrar de menos deja plata sobre la mesa. El poder de mercado permite subir el precio por encima del costo, pero incluso el monopolista pierde si se pasa. Y en cuanto entra competencia, ese margen se derrite: por eso los monopolios se defienden tanto de que aparezcan rivales.',
    },
  },
  policies: [],
}
