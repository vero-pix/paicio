// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 1 — LA GRAN QUEMA
// Referencia: Weimar, Alemania 1923 · Crisis: Hiperinflación
//
// Objeto de datos autocontenido. Los componentes (Cell, PrisonerList,
// NegotiationMatrix, PolicyChoice, Outcome) leen de aquí. Cambiar de episodio
// = cambiar este objeto, no el código.
//
// Propiedades de cada prisionero:
//  - utility: lo que quiere a cambio de su apoyo
//  - basePayoff: matriz 2x2 [prisionero, jugador] — CC(3,3) CT(0,5) TC(5,0) TT(1,1)
//  - cooperBias: sesgo (-2..+2); positivo = más cooperador
//  - initialTrust: confianza de partida (0-100)
//  - concept: concepto económico que enseña esa negociación
//  - supportsPolicy / rejectsPolicy: ids de políticas
//
// Propiedades de cada política:
//  - scores: resultado base (0-100) por dimensión
//  - impact: barras visuales (inflación / empleo)
//  - inflationCurve: índice de inflación a lo largo del tiempo (gráfico del desenlace)
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep1',
  numero: 1,
  titulo: 'La Gran Quema',
  año: 1923,
  crisisHistorica: 'Hiperinflación',
  paisReferencia: 'Weimar, Alemania',
  resumen: 'El dinero se quema en tus manos. El pan cuesta más al mediodía que en la mañana.',
  bloqueado: false,

  // Mecánica central del episodio (ver src/utils/hyperinflation.js).
  mechanic: 'hyperinflation',

  // Periódico de la pantalla de celda.
  newspaper: {
    name: 'EL HERALDO DE PAICIO',
    dateline: 'PAICIO, 14 de noviembre de 1923',
    number: '№ 4.812',
    headline: 'EL PAN SUPERA LOS 4.800 MARCOS: LA MONEDA SE DERRUMBA',
    subhead:
      'El Gobierno imprime para pagar la deuda de guerra. El Ministro de Economía, tras las rejas.',
  },

  // Texto de apertura (animado línea a línea).
  opening: [
    'El pan cuesta hoy 4.800 Marcos de Paicio.',
    'Ayer costaba 1.200.',
    'La semana pasada, 80.',
    '',
    'Llevas tres días en la Prisión Central.',
    'El presidente dijo que fue tu culpa.',
    'Ambos saben que mintió.',
    '',
    'Tienes una sola oportunidad de salir.',
  ],

  // Narración en la celda (al evaluar la situación).
  cellNarration: [
    'El presidente imprimió dinero para pagar la deuda de guerra. Los precios suben hora a hora. Te culparon a ti, pero ahora la máquina de imprimir es tuya.',
    'Cada mes hay cuentas del Estado que pagar y la recaudación no alcanza. La salida fácil es imprimir más — y así fue como empezó todo.',
    'Tu misión: frenar la hiperinflación antes de que el Marco se vuelva papel… o de que el pueblo te derroque.',
  ],

  negotiationIntro:
    'Forma tu coalición. En cada mesa, un Dilema del Prisionero: COOPERAR construye confianza, TRAICIONAR busca ventaja inmediata. El ticker no se detiene.',
  policyIntro:
    'Tienes coalición. Es hora de enviar tu propuesta al presidente. Elige con cuidado: una política que contradiga a un aliado lo hará traicionarte.',
  needAlliesWarning:
    'Necesitas al menos 2 aliados antes de proponer una política. Sigue negociando.',

  // Configuración del ticker de inflación.
  ticker: {
    itemBase: 'Pan de Paicio',
    currency: 'Marcos',
    precioInicial: 4800,
    tasaInflacion: 1.018, // factor por segundo (≈ +1.8%)
    umbralCritico: 10000, // umbral de hiperinflación visible
  },

  // Panel "¿qué pasó en la historia real?" (el detalle por política está en policy.history).
  contextoHistorico: {
    titulo: 'Alemania, 1923',
  },

  // Config del gráfico de tendencia del desenlace (cifras + comparación real).
  trendChart: {
    titulo: 'Inflación en Paicio',
    unidad: 'índice (inicio = 100)',
    ejeX: ['Mes 0', '3', '6', '9', '12', '18'],
    real: {
      cifra: '×1.000.000',
      cifraEtiqueta: 'subió el precio del pan en un año (real)',
      nota: 'En la Alemania de 1923 los precios se duplicaban cada ~3 días. Un pan pasó de 250 marcos a 200.000 millones. El Rentenmark frenó la hiperinflación en pocas semanas al respaldar la moneda y cortar la emisión.',
    },
  },

  prisoners: [
    {
      id: 'marcos',
      name: 'Don Marcos',
      role: 'Ex Presidente del Banco Central de Paicio',
      portrait: '🏦',
      accent: '#C9A24B',
      gender: 'm',
      blurb:
        'Ejecutó las órdenes de imprimir dinero. Sabe exactamente cuánto se emitió. Habla bajo, como quien ya calculó todas las salidas.',
      utility: 'Quiere inmunidad procesal.',
      concept: 'senoreaje',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 55,
      hostileNote:
        'Si lo traicionas, filtrará las cifras de emisión a la prensa para hundirte contigo.',
      supportsPolicy: ['ancla'],
      rejectsPolicy: ['control'],
      voice: {
        cooperate:
          '“Bien. Tengo los registros de cada Marco emitido. Te conviene tenerme cerca.”',
        betrayed:
          '“Ya veo. Entonces los dos nos quemamos. Recuerda que yo tengo los números.”',
      },
    },
    {
      id: 'rosa',
      name: 'Compañera Gladys',
      role: 'Líder del Sindicato Nacional de Trabajadores',
      portrait: '✊',
      accent: '#C0392B',
      gender: 'f',
      blurb:
        'Sus afiliados piden aumento mientras la inflación los devora. No le interesa la teoría: le interesa que su gente coma mañana.',
      utility: 'Quiere garantía de indexación salarial.',
      concept: 'indexacion',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 50,
      hostileNote:
        'Si la traicionas, convoca a paro general y la calle se vuelve contra ti.',
      supportsPolicy: ['control'],
      rejectsPolicy: ['ancla'],
      voice: {
        cooperate:
          '“Confío, pero te estoy mirando. Mi gente no aguanta otra promesa rota.”',
        betrayed:
          '“¿Así que de nuevo nosotros pagamos? Mañana no se mueve un solo tren en Paicio.”',
      },
    },
    {
      id: 'fondo',
      name: 'Señor Fondo',
      role: 'Representante del Fondo Monetario de Paicio',
      portrait: '💼',
      accent: '#5B8DB8',
      gender: 'm',
      blurb:
        'Tiene acceso a las reservas internacionales. Cada palabra suya viene con una condición adjunta. Sonríe sin calidez.',
      utility: 'Quiere la firma del programa de ajuste.',
      concept: 'condicionalidad',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 45,
      hostileNote:
        'Si lo traicionas, cierra la línea de crédito y te quedas sin reservas.',
      supportsPolicy: ['ancla'],
      rejectsPolicy: ['reforma'],
      voice: {
        cooperate:
          '“Aceptable. El crédito se libera contra reformas verificables. Sin sorpresas.”',
        betrayed:
          '“Entonces no hay programa. Y sin nosotros, no hay reservas. Suerte con eso.”',
      },
    },
    {
      id: 'comerciante',
      name: 'El Comerciante',
      role: 'Representante de la Cámara de Comercio de Paicio',
      portrait: '⚖️',
      accent: '#27AE60',
      gender: 'm',
      blurb:
        'Sus negocios colapsan porque nadie sabe qué costará nada mañana. No es de izquierda ni de derecha: es de certezas.',
      utility: 'Quiere certeza, no ideología.',
      concept: 'credibilidad',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 55,
      hostileNote:
        'Si lo traicionas, retira su capital del país y arrastra a otros comerciantes.',
      supportsPolicy: ['reforma'],
      rejectsPolicy: ['control'],
      voice: {
        cooperate:
          '“Trato. Solo dame reglas estables y mis socios vuelven a abrir las cortinas.”',
        betrayed:
          '“Sin reglas no hay negocio. Saco mi plata de Paicio esta misma noche.”',
      },
    },
  ],

  // ── MECÁNICA DE HIPERINFLACIÓN ("La Imprenta") ─────────────────────────
  // Config leída por HyperInflation.jsx / hyperinflation.js.
  hyperinflation: {
    intro:
      'La hiperinflación se alimenta sola: imprimes para pagar las cuentas del Estado, los precios suben, y necesitas imprimir aún más para pagar lo mismo. Cada mes eliges cómo cubrir el gasto. Imprimir es fácil y acelera el desastre; frenarlo cuesta apoyo. La única salida real: cortar la imprenta y lanzar una moneda creíble a tiempo.',
    meses: 8,
    inflacionInicial: 28,
    apoyoInicial: 55,
    umbralReforma: 65, // por encima, la reforma ya no convence a nadie
    golpeImprimir: 9, // inflación que suma la primera impresión
    escaladaImprimir: 6, // cada impresión suma esto extra sobre la anterior
    acciones: [
      {
        id: 'imprimir',
        name: 'Imprimir dinero',
        icon: '🖨️',
        desc: 'Enciende la imprenta y paga las cuentas de hoy. Fácil… pero cada vez dispara más la inflación.',
        advisor: 'marcos',
        reaccion:
          '"La imprenta ya está caliente, ministro. Un cero más al billete y las cuentas de hoy están pagadas. Mañana vemos."',
      },
      {
        id: 'ajuste',
        name: 'Ajuste fiscal',
        icon: '✂️',
        desc: 'Subes impuestos y recortas gasto para pagar con plata real. Frena algo la inflación, pero el pueblo lo sufre.',
        inflacion: -5,
        apoyo: -14,
        advisor: 'rosa',
        reaccion:
          '"¿Más impuestos y recortes? Mi gente ya no llega a fin de día. Esto se paga con hambre, ministro."',
      },
      {
        id: 'renegociar',
        name: 'Renegociar la deuda de guerra',
        icon: '🤝',
        desc: 'Alivias las reparaciones que ahogan al Estado. Menos presión para imprimir de aquí en adelante.',
        inflacion: -3,
        apoyo: -4,
        usos: 2,
        advisor: 'fondo',
        reaccion:
          '"Podemos aliviar la deuda de guerra… a cambio de supervisión. Nada es gratis, ministro."',
      },
      {
        id: 'reforma',
        name: 'Reforma monetaria (el Rentenmark)',
        icon: '⚓',
        desc: 'Cortas la imprenta y lanzas una moneda nueva, respaldada y limitada. Si la inflación aún es manejable, la frena en seco. Si esperaste demasiado, nadie le cree.',
        advisor: 'comerciante',
        reaccion:
          '"Una moneda nueva y de verdad respaldada… si la gente la cree, mañana vuelvo a poner precios. Eso necesito: certeza."',
      },
    ],
  },

  // Desenlaces por nivel (formato común a las mecánicas no-PD; ver Outcome.jsx).
  outcomes: {
    // Reforma exitosa a tiempo: el Rentenmark frena la hiperinflación.
    perfect: {
      id: 'perfect',
      concept: 'ancla',
      headlineWin:
        'EL RENTENMARK NACE: PAICIO FRENA LA HIPERINFLACIÓN EN SEMANAS',
      resultText:
        'Cortaste la imprenta y lanzaste una moneda nueva, respaldada y creíble, justo a tiempo. Cuando la gente confió en que ya no habría emisión sin límite, los precios se congelaron casi de un día para otro. La pesadilla del pan que cambiaba de precio a mediodía terminó.',
      scores: { estabilidad: 92, empleo: 55, confianza: 88, crecimiento: 60 },
      inflationCurve: [100, 62, 30, 16, 10, 8],
      history:
        'En noviembre de 1923 Alemania frenó la hiperinflación casi de un día para otro con el Rentenmark: una moneda nueva, respaldada en la tierra y luego en oro, emitida en cantidad limitada. Funcionó porque vino con disciplina fiscal —el gobierno dejó de imprimir para tapar el déficit— y con credibilidad. Eso hiciste tú: apagar la imprenta y anclar la moneda antes de que fuera tarde.',
    },
    // Contuvo lo peor, pero tarde y con daño.
    partial: {
      id: 'partial',
      concept: 'senoreaje',
      headlineWin:
        'LA INFLACIÓN CEDE A MEDIAS: EL FRENO LLEGÓ TARDE Y CON DOLOR',
      resultText:
        'Al final contuviste lo peor, pero recién cuando el daño ya estaba hecho. Los ahorros de la gente se evaporaron por el camino y la recuperación arranca desde muy abajo. Frenaste la sangría, pero pagaste de más por haber demorado.',
      scores: { estabilidad: 48, empleo: 40, confianza: 42, crecimiento: 44 },
      inflationCurve: [100, 90, 78, 66, 58, 52],
      history:
        'Imprimir dinero para pagar las cuentas del Estado es un impuesto invisible: financia hoy destruyendo el ahorro de todos mañana. Cuanto más se demora la reforma, más caro y doloroso es el ajuste. Alemania tardó años en cortar la imprenta; el costo social fue enorme.',
    },
    // La imprenta no se detuvo: colapso hiperinflacionario.
    wrong: {
      id: 'wrong',
      concept: 'hiperinflacion',
      headlineWin:
        'LA GRAN QUEMA: EL MARCO SE CONVIERTE EN PAPEL SIN VALOR',
      resultText:
        'La imprenta no se detuvo a tiempo. Los precios se dispararon hasta que el Marco dejó de servir: la gente empapeló paredes con billetes y llevó el sueldo en carretillas. La moneda murió y con ella el ahorro de una generación.',
      scores: { estabilidad: 15, empleo: 25, confianza: 10, crecimiento: 20 },
      inflationCurve: [100, 145, 200, 260, 320, 380],
      history:
        'En 1923 el marco alemán perdió tanto valor que la gente empapelaba paredes con billetes y llevaba el sueldo en carretillas. Un pan llegó a costar 200.000 millones de marcos. El gobierno siguió imprimiendo para pagar sus cuentas hasta que la moneda simplemente dejó de aceptarse. La hiperinflación no se detiene sola: hay que apagar la imprenta.',
    },
  },

  // Vacío: en modo mecánica no se usan políticas, pero Outcome lo referencia.
  policies: [],
}
