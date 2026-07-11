// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 15 — EL PRECIO JUSTO  (línea Micro · numero 2)
// Referencia: oferta y demanda / equilibrio de mercado. Ancla cotidiana chilena
// (la feria, el puesto de tomates), no académica.
//
// Mecánica: marketEquilibrium (aguja de equilibrio). Mueves el precio y ves en
// vivo el cruce de oferta y demanda: sobra (excedente), falta (escasez) o se
// vacía justo (equilibrio). Shocks desplazan la demanda cada ronda.
//
// La lección: el precio no es capricho; lo fija dónde se cruzan oferta y demanda.
//
// Lógica en src/utils/marketEquilibrium.js, UI en MarketEquilibrium.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep15',
  numero: 2,
  line: 'micro',
  titulo: 'El Precio Justo',
  año: 'hoy',
  crisisHistorica: 'La feria de tu barrio',
  paisReferencia: 'La feria',
  resumen:
    'Tienes un puesto de tomates en la feria. Ni muy caro (te quedas con la góndola llena) ni muy barato (se te agota y queda cola). Encuentra el precio que vacía el mercado.',
  bloqueado: false,
  mechanic: 'marketEquilibrium',
  newspaper: null,
  opening: [
    'Sábado en la mañana, la feria despierta.',
    'Armaste tu puesto: cajones de tomates rojos, bien maduros.',
    '',
    'La pregunta de siempre: ¿a cuánto el kilo?',
    'Muy caro y nadie compra: te vas con todo de vuelta.',
    'Muy barato y se acaba en media hora: quedó gente con las manos vacías.',
    '',
    'En algún punto está el precio justo — el que vacía el puesto.',
    'Vamos a buscarlo.',
  ],
  cellNarration: [
    'Nadie decide el precio de un pizarrón. Sale del tira y afloja entre lo que hay para vender (la oferta) y lo que la gente quiere llevar (la demanda). Donde esas dos fuerzas se cruzan, ahí está el precio de equilibrio.',
    'Si pones el precio por encima de ese cruce, ofreces más de lo que la gente quiere: sobra. Si lo pones por debajo, la gente quiere más de lo que hay: falta, se agota. El mercado "se vacía" solo cuando le achuntas al cruce.',
    'Y ese cruce se mueve: si el tomate se pone de moda, si la gente tiene más plata, si baja el precio del pepino… la demanda cambia, y el precio justo también.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: {
    itemBase: 'El kilo de tomate',
    precioInicial: 700,
    currency: '$/kilo',
    tasaInflacion: 1,
    umbralCritico: 999999,
  },
  contextoHistorico: { titulo: 'La feria, hoy' },
  trendChart: null,
  prisoners: [],
  // Config del verbo AGUJA DE EQUILIBRIO. Modelo lineal Qd = a − b·p, Qs = c + d·p
  // (p = precio/escala). Los eventos son deltas ACUMULATIVOS sobre la demanda `a`,
  // aplicados al ENTRAR a esa ronda → mueven el precio de equilibrio.
  marketEquilibrium: {
    rondas: 5,
    escala: 100, // p = precio / 100
    precioMin: 300,
    precioMax: 1600,
    precioPaso: 50,
    precioInicial: 700,
    demandaBase: 20, // intercepto `a` de la demanda (kilos cuando p=0)
    demandaPendiente: 1, // b
    ofertaIntercepto: 0, // c
    ofertaPendiente: 1, // d  → P* = a/2·escala
    tolerancia: 1.5, // |Qd−Qs| ≤ tol (kilos) → mercado vaciado
    barMax: 22, // escala visual de las barras (kilos)
    demandaMin: 8,
    unidad: '$/kilo',
    objetivo: { perfect: 4, partial: 2 }, // vaciados necesarios (de 5)
    eventos: [
      {
        ronda: 2,
        titulo: '🍅 Receta viral',
        desc: 'Un video con tu tomate se hizo viral. Todos quieren: la demanda sube.',
        delta: 6,
      },
      {
        ronda: 3,
        titulo: '🥒 Bajó el pepino',
        desc: 'El pepino (un sustituto) se abarató. Parte de la gente cambia: la demanda baja.',
        delta: -8,
      },
      {
        ronda: 4,
        titulo: '💸 Llegó el aguinaldo',
        desc: 'Con más plata en el bolsillo, la gente compra más: la demanda sube.',
        delta: 4,
      },
      {
        ronda: 5,
        titulo: '🌧️ Entró el frío',
        desc: 'Día lluvioso, menos ganas de ensalada: la demanda cae.',
        delta: -10,
      },
    ],
  },
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'equilibrioMercado',
      headlineWin: '¡PUESTO VACÍO Y CLIENTES CONTENTOS! LE ACHUNTASTE AL PRECIO JUSTO',
      resultText:
        'Vaciaste el puesto casi todas las rondas: ni cola ni cajones de vuelta. Cada vez que cambió la demanda, ajustaste el precio y volviste al punto justo. Entendiste lo esencial: el precio no lo pone el vendedor a dedo — lo fija dónde se cruzan lo que hay y lo que la gente quiere.',
      scores: { estabilidad: 88, empleo: 90, confianza: 85, crecimiento: 87 },
      history:
        'Esto es la ley de oferta y demanda, la pieza más básica de la microeconomía. Adam Smith la llamó "la mano invisible": nadie coordina el mercado, pero los precios se ajustan solos hasta que lo ofrecido calza con lo demandado. Cuando un precio se fija por decreto lejos de ese cruce, aparece lo que viste: si es muy bajo, escasez y colas; si es muy alto, excedente que nadie compra.',
    },
    partial: {
      id: 'partial',
      concept: 'equilibrioMercado',
      headlineWin: 'VENDISTE HARTO, PERO ALGUNAS RONDAS QUEDARON DESPAREJAS',
      resultText:
        'Le achuntaste a varias, pero en otras quedó cola o te sobraron cajones. El precio de equilibrio no se queda quieto: cada moda, cada sustituto, cada peso más en el bolsillo lo mueve. La pega es perseguirlo, no fijarlo una vez y olvidarse.',
      scores: { estabilidad: 60, empleo: 62, confianza: 58, crecimiento: 60 },
      history:
        'El equilibrio se desplaza cuando cambia la demanda (o la oferta). Un cambio de gustos, un sustituto más barato, más ingreso: la curva se corre y el precio justo con ella. Por eso los precios de la feria suben en invierno y bajan en cosecha — no es capricho del casero, es el cruce que se movió.',
    },
    wrong: {
      id: 'wrong',
      concept: 'equilibrioMercado',
      headlineWin: 'CASI SIEMPRE QUEDÓ COLA O GÓNDOLA LLENA',
      resultText:
        'La mayoría de las rondas el precio no calzó con la demanda: o pusiste muy caro y sobró, o muy barato y se agotó con gente esperando. Cuando el precio no está en el cruce, siempre falla para un lado. Buscar ese punto justo —vaciar el mercado— es de lo que se trata.',
      scores: { estabilidad: 28, empleo: 30, confianza: 25, crecimiento: 27 },
      history:
        'Precio muy alto → excedente (sobra oferta). Precio muy bajo → escasez (falta, colas, mercado negro). Los controles de precio mal calibrados producen exactamente esto: el techo de arriendos que seca la oferta de departamentos, o el precio fijado bajo que vacía las góndolas. La lección micro más básica: el precio informa y coordina; pelearse con el cruce tiene costo.',
    },
  },
  policies: [],
}
