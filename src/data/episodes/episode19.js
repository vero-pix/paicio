// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 19 — EL DILEMA  (línea Micro · numero 5)
// Referencia: teoría de juegos / dilema del prisionero iterado. Ancla: dos
// gasolineras, una frente a la otra.
//
// Mecánica: priceWar (decidir con contraparte). Cada semana eliges mantener el
// precio alto (colaborar) o bajarlo para robar clientes (competir). La otra
// gasolinera REACCIONA a tu jugada anterior (tit-for-tat). Eliges → lees la
// reacción y los pagos → continúas.
//
// La lección: colaborar conviene a ambos, pero es difícil porque siempre tienta
// traicionar; y si el otro reacciona, terminan en guerra de precios. La repetición
// y la reputación hacen posible la cooperación.
//
// Lógica en src/utils/priceWar.js, UI en PriceWar.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep19',
  numero: 5,
  line: 'micro',
  titulo: 'El Dilema',
  año: 'hoy',
  crisisHistorica: 'Dos gasolineras',
  paisReferencia: 'La esquina',
  resumen:
    'Tú y la gasolinera de enfrente. Cada semana: ¿mantienes el precio alto o lo bajas para robarle clientes? Ella también decide… y reacciona a lo que hiciste tú. El dilema del prisionero, jugado en la vida real.',
  bloqueado: false,
  mechanic: 'priceWar',
  newspaper: null,
  opening: [
    'Tienes una gasolinera. Justo enfrente hay otra.',
    'Venden lo mismo. Los clientes van a la más barata.',
    '',
    'Cada semana decides: ¿mantienes el precio alto o lo bajas?',
    'Si los dos mantienen el precio alto, a los dos les va bien.',
    '',
    'Pero si tú bajas y ella no, le robas todos los clientes.',
    'El problema: ella piensa exactamente lo mismo… y reacciona a lo que hiciste.',
  ],
  cellNarration: [
    'Esto es el dilema del prisionero: a cada uno, por separado, le conviene traicionar (bajar el precio). Pero si ambos traicionan, terminan peor que si ambos hubieran cooperado. Eso se llama equilibrio de Nash: un resultado del que nadie quiere moverse solo, aunque juntos podrían estar mejor.',
    'Lo que cambia todo es que el juego se REPITE. La otra gasolinera te recuerda: si la traicionas hoy, mañana baja el precio también, y arrancan una guerra de precios en la que los dos pierden. Cuando sabes que te volverás a encontrar, cooperar hoy compra confianza para mañana.',
    'Por eso la reputación importa. La estrategia que suele ganar en el dilema iterado es simple: empieza cooperando y después copia lo que hizo el otro (tit-for-tat). Premia la colaboración, castiga la traición, pero perdona rápido. Colaborar no es ingenuo: es la jugada más rentable a la larga.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: {
    itemBase: 'El litro de bencina',
    precioInicial: 1200,
    currency: '$',
    tasaInflacion: 1,
    umbralCritico: 999999,
  },
  contextoHistorico: { titulo: 'La esquina, hoy' },
  trendChart: null,
  prisoners: [],
  // Config del verbo DECIDIR CON CONTRAPARTE. Pagos (tu ganancia / la de ellos).
  // La contraparte usa tit-for-tat (colabora primero, luego copia tu jugada).
  priceWar: {
    rondas: 5,
    pagos: {
      CC: { tu: 3, ellos: 3 }, // ambos precio alto → colusión
      DC: { tu: 5, ellos: 0 }, // tú bajas, ellos no → les robas clientes
      CD: { tu: 0, ellos: 5 }, // tú no, ellos bajan → te los roban
      DD: { tu: 1, ellos: 1 }, // ambos bajan → guerra de precios
    },
    // Balance (decisión final): sostener CC las 5 rondas da 15 → perfect. El techo
    // real es 17 (cooperar 4 rondas y traicionar solo la última, sin castigo
    // posterior: la clásica defección de fin de juego). Traicionar antes dispara la
    // guerra de precios y baja el total. Umbrales: perfect 14 (colaboración casi
    // pura), partial 10; traición temprana/mutua cae a 9 o menos → wrong.
    objetivo: { perfect: 14, partial: 10 },
  },
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'dilemaIterado',
      headlineWin: '¡SOSTUVISTE LA COLABORACIÓN! GANARON LOS DOS',
      resultText:
        'Mantuviste el precio alto pese a la tentación de traicionar, y la otra gasolinera te siguió: a los dos les fue bien y evitaron la guerra de precios. Eso es lo difícil del dilema — cooperar conviene, pero solo si logras construir confianza jugada tras jugada.',
      scores: { estabilidad: 84, empleo: 80, confianza: 88, crecimiento: 82 },
      history:
        'Robert Axelrod organizó en 1980 un torneo donde distintas estrategias jugaban el dilema del prisionero iterado. Ganó la más simple: tit-for-tat (coopera primero, luego copia al otro). Es amable (nunca traiciona primero), represalia (castiga la traición), perdona (vuelve a cooperar apenas el otro lo hace) y es clara. La lección: en juegos que se repiten, la cooperación no solo es posible, es la estrategia más rentable.',
    },
    partial: {
      id: 'partial',
      concept: 'dilemaIterado',
      headlineWin: 'GANASTE ALGO, PERO LA GUERRA DE PRECIOS TE COSTÓ',
      resultText:
        'Mezclaste colaboración y traición. Cada vez que bajaste el precio ganaste clientes por una semana… pero la otra gasolinera reaccionó, y la guerra de precios que siguió te dejó peor. La reputación importa cuando el juego se repite: cada traición se paga después.',
      scores: { estabilidad: 58, empleo: 56, confianza: 54, crecimiento: 60 },
      history:
        'La tentación de traicionar es real: en una sola jugada, bajar el precio siempre paga más. Por eso el equilibrio de Nash del dilema de una vuelta es (traicionar, traicionar), aunque deje a ambos peor. Lo que rescata la cooperación es la sombra del futuro: si el juego sigue, la represalia del otro vuelve cara la traición de hoy.',
    },
    wrong: {
      id: 'wrong',
      concept: 'dilemaIterado',
      headlineWin: 'GUERRA DE PRECIOS — LOS DOS PERDIERON',
      resultText:
        'Terminaste bajando el precio casi siempre, y la otra gasolinera te copió: guerra de precios de punta a punta. En una sola jugada traicionar tienta; pero cuando el juego se repite y el otro reacciona, la traición mutua deja a ambos mucho peor que si hubieran colaborado.',
      scores: { estabilidad: 28, empleo: 26, confianza: 22, crecimiento: 30 },
      history:
        'Las guerras de precios reales terminan así: aerolíneas, supermercados y estaciones de servicio que se bajan los precios mutuamente hasta vender casi a pérdida. Nadie quería empezarla, pero una vez que alguien traiciona, el otro responde y cuesta mucho volver atrás. Por eso muchos mercados buscan formas (legales o no) de coordinar precios: la colusión es justamente el intento de escapar del dilema… a costa de los clientes.',
    },
  },
  policies: [],
}
