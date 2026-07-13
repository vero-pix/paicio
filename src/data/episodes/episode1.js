// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 1 — LA GRAN QUEMA
// Referencia: Bolivia, 1985 · Crisis: Hiperinflación
//
// Objeto de datos autocontenido. Los componentes (Cell, PrisonerList,
// NegotiationMatrix, PolicyChoice, Outcome) leen de aquí. Cambiar de episodio
// = cambiar este objeto, no el código.
//
// Nota de contenido: este episodio pasó de Weimar 1923 a Bolivia 1985. Es un
// swap de CONTEXTO — la mecánica "La Imprenta" (utils/hyperinflation.js), sus
// números y la estructura de datos NO cambian. La hiperinflación boliviana
// (~11.750% en 1985) se frenó en semanas con el Decreto Supremo 21060 / Nueva
// Política Económica (agosto 1985, gobierno de Víctor Paz Estenssoro, asesorado
// por Jeffrey Sachs): cortó la emisión, unificó el tipo de cambio y ajustó el
// déficit. En 1987 el peso boliviano fue reemplazado por el boliviano.
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
  line: 'crisis',
  titulo: 'La Gran Quema',
  año: 1985,
  crisisHistorica: 'Hiperinflación',
  paisReferencia: 'Bolivia',
  resumen: 'El dinero se quema en tus manos. El pan cuesta más al mediodía que en la mañana.',
  bloqueado: false,

  // Mecánica de Ep1: "La Imprenta" / Presiona tu suerte (archetipo #4,
  // push-your-luck; ver src/components/mechanics/PrintPress.jsx). Reemplazó a
  // `hyperinflation`; el engine viejo (utils/hyperinflation.js, HyperInflation.jsx)
  // queda en el repo por si hay que revertir vía git.
  mechanic: 'pressYourLuck',
  pressYourLuck: {
    rondas: 8,
    riesgoBase: 6, // presión inicial
    objetivoPozo: 45, // alivio consolidado para "perfect"
    alivioDecaimiento: 1.5, // la imprenta rinde algo menos cada ronda

    // Decisión graduada: cada ronda eliges CUÁNTO imprimir. Más alivio ahora =
    // más calor (salto de presión) ahora y para la próxima. No hay una jugada
    // única óptima: depende de cuán cerca estás de cortar y de tu apetito de riesgo.
    //   alivio: lo que suma al pozo · calor: cuánto sube la presión (= +prob. reventar)
    // Balance: la 1ª tanda nunca revienta (protección de entrada). Un audaz llega
    // a perfect en ~2 "todo" (≈54% cada uno) o ~3 "media"; cortar tras 2 asegura
    // partial; jugar solo cortas sobrevive pero rara vez llega a perfect.
    tandas: [
      { id: 'corta', label: 'Tanda corta', desc: 'Un respiro. Poco alivio, poca presión.', alivio: 10, calor: 6 },
      { id: 'media', label: 'Tanda media', desc: 'El término medio. Alivio real, presión real.', alivio: 18, calor: 12 },
      { id: 'todo', label: 'Todo a la máquina', desc: 'A fondo. Mucho alivio… y la caldera salta.', alivio: 30, calor: 20 },
    ],

    // Incertidumbre viva: 2 de estos caen a mitad de run (sembrados) y mueven la
    // presión en vivo. `rescate` la enfría; `shock` la dispara. Cambian el cálculo
    // a mitad de partida para que no se pueda "resolver" de antemano.
    eventosImprenta: [
      { id: 'petroleo', tipo: 'shock', icon: '🛢️', titulo: 'Se dispara el petróleo', calor: 16, texto: 'Todo lo que anda en camión sube. La caldera se calienta sola.' },
      { id: 'deuda', tipo: 'shock', icon: '📄', titulo: 'Vence la deuda externa', calor: 14, texto: 'Los acreedores cobran hoy y la tentación de imprimir aprieta.' },
      { id: 'renegocia', tipo: 'rescate', icon: '🤝', titulo: 'Renegocias la deuda', calor: -18, texto: 'Reprogramas los pagos: la imprenta alcanza a respirar.' },
      { id: 'fmi', tipo: 'rescate', icon: '🏦', titulo: 'Entra un crédito del FMI', calor: -16, texto: 'Dólares frescos a la caja y baja la presión de emitir.' },
    ],
  },

  // Periódico de la pantalla de celda.
  newspaper: {
    name: 'EL HERALDO DE PAICIO',
    dateline: 'PAICIO, 28 de agosto de 1985',
    number: '№ 4.812',
    headline: 'EL PAN SUPERA LOS 4.800 PESOS: LA MONEDA SE DERRUMBA',
    subhead:
      'El Gobierno imprime para tapar el déficit mientras la deuda externa ahoga al país. El Ministro de Economía, tras las rejas.',
  },

  // Texto de apertura (animado línea a línea).
  opening: [
    'El pan cuesta hoy 4.800 pesos de Paicio.',
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
    'El gobierno imprimió pesos sin parar para tapar el déficit y sostener el gasto, mientras la deuda externa se volvía impagable. Los precios suben hora a hora. Te culparon a ti, pero ahora la máquina de imprimir es tuya.',
    'Cada mes hay cuentas del Estado que pagar y la recaudación no alcanza. La salida fácil es imprimir más — y así fue como empezó todo.',
    'Tu misión: frenar la hiperinflación antes de que el peso se vuelva papel… o de que el pueblo te derroque.',
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
    currency: 'Pesos',
    precioInicial: 4800,
    tasaInflacion: 1.018, // factor por segundo (≈ +1.8%)
    umbralCritico: 10000, // umbral de hiperinflación visible
  },

  // Panel "¿qué pasó en la historia real?" (el detalle por política está en policy.history).
  contextoHistorico: {
    titulo: 'Bolivia, 1985',
  },

  // Config del gráfico de tendencia del desenlace (cifras + comparación real).
  trendChart: {
    titulo: 'Inflación en Paicio',
    unidad: 'índice (inicio = 100)',
    ejeX: ['Mes 0', '3', '6', '9', '12', '18'],
    real: {
      cifra: '11.750%',
      cifraEtiqueta: 'llegó la inflación anual de Bolivia en 1985 (real)',
      nota: 'En 1985 Bolivia vivió una de las peores hiperinflaciones de la historia: cerca de 11.750% anual. El Decreto Supremo 21060 —la Nueva Política Económica del gobierno de Víctor Paz Estenssoro, asesorado por Jeffrey Sachs— la frenó en semanas: cortó la emisión, unificó el tipo de cambio y ajustó el déficit fiscal. En 1987 el peso boliviano fue reemplazado por el boliviano.',
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
          '“Bien. Tengo los registros de cada peso emitido. Te conviene tenerme cerca.”',
        betrayed:
          '“Ya veo. Entonces los dos nos quemamos. Recuerda que yo tengo los números.”',
      },
    },
    {
      id: 'rosa',
      name: 'Compañera Gladys',
      role: 'Líder de la Central Obrera de Paicio',
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
          '“¿Así que de nuevo nosotros pagamos? Mañana no se mueve un solo camión en Paicio.”',
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
    moneda: '$b',
    intro:
      'La hiperinflación se alimenta sola: imprimes para pagar las cuentas del Estado, los precios suben, y necesitas imprimir aún más para pagar lo mismo. Cada mes eliges cómo cubrir el gasto. Imprimir es fácil y acelera el desastre; frenarlo cuesta apoyo. La única salida real: cortar la imprenta y aplicar una estabilización creíble a tiempo.',
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
        name: 'Renegociar la deuda externa',
        icon: '🤝',
        desc: 'Reprogramas los pagos de la deuda externa que ahogan al Estado. Menos presión para imprimir de aquí en adelante.',
        inflacion: -3,
        apoyo: -4,
        usos: 2,
        advisor: 'fondo',
        reaccion:
          '"Podemos reprogramar la deuda externa… a cambio de supervisión. Nada es gratis, ministro."',
      },
      {
        id: 'reforma',
        name: 'Estabilización (Decreto 21060)',
        icon: '⚓',
        desc: 'Cortas la imprenta y aplicas un plan creíble: unificas el tipo de cambio y ajustas el déficit. Si la inflación aún es manejable, la frena en seco. Si esperaste demasiado, nadie le cree.',
        advisor: 'comerciante',
        reaccion:
          '"Un plan de verdad, con reglas estables y sin más emisión… si la gente lo cree, mañana vuelvo a poner precios. Eso necesito: certeza."',
      },
    ],
  },

  // ── CARTAS DE EVENTO ("shocks" tipo Reigns) ────────────────────────────
  // Capa de game loop: al inicio de algunos meses cae una carta que reacciona
  // sobre los medidores (pasa por el mismo clamp). ~50% por mes, sin reemplazo.
  //  - PASIVA: `efecto` { inflacion, apoyo } + botón "Seguir".
  //  - DECISIÓN: `opciones` [{ label, efecto, replica, pills? }, …].
  // `pills` opcional pinta etiquetas de flavor (p. ej. "Reservas ↑"); si falta,
  // se derivan solas de `efecto`. `tono`: good | bad | neutral.
  eventos: [
    {
      id: 'petroleo',
      iconKey: 'petroleo',
      titulo: 'Sube el petróleo mundial',
      texto: 'El barril se dispara y todo lo que se mueve en camión sube con él.',
      icon: '🛢️',
      efecto: { inflacion: 7 },
    },
    {
      id: 'paro',
      iconKey: 'sindicato',
      titulo: 'La COB llama a paro general',
      texto: 'La Central Obrera para el país: nadie trabaja, todos exigen aumento.',
      icon: '✊',
      efecto: { inflacion: 3, apoyo: -10 },
    },
    {
      id: 'deuda',
      iconKey: 'deuda-externa',
      titulo: 'Vence un pago de deuda externa',
      texto: 'Los acreedores cobran hoy. La caja no alcanza y la tentación de imprimir crece.',
      icon: '📄',
      efecto: { inflacion: 6 },
    },
    {
      id: 'dolarizacion',
      iconKey: 'dolar',
      titulo: 'Rumor: el gobierno dolarizará',
      texto: 'Corre el rumor de que se abandonará el peso. La gente corre a comprar dólares.',
      icon: '💵',
      efecto: { inflacion: 8, apoyo: -4 },
    },
    {
      id: 'cosecha',
      iconKey: 'cosecha',
      titulo: 'Cosecha récord en el altiplano',
      texto: 'La papa y el grano abundan: los precios de la comida ceden y el ánimo mejora.',
      icon: '🌾',
      efecto: { inflacion: -4, apoyo: 5 },
    },
    {
      id: 'fmi',
      iconKey: 'fmi',
      titulo: 'El FMI ofrece crédito',
      texto: 'Dólares frescos ahora, a cambio de un ajuste que la calle detesta.',
      icon: '🏦',
      opciones: [
        {
          label: 'Aceptar el crédito',
          efecto: { inflacion: -8, apoyo: -6 },
          pills: [
            { label: 'Reservas ↑', tono: 'good' },
            { label: 'Apoyo −6', tono: 'bad' },
          ],
          replica: 'Las reservas respiran, pero la calle ya afila los cuchillos.',
        },
        {
          label: 'Rechazar',
          efecto: {},
          pills: [{ label: 'sin cambios', tono: 'neutral' }],
          replica: 'Sin ayuda de afuera. Lo resolvemos solos… o no.',
        },
      ],
    },
    {
      id: 'especuladores',
      iconKey: 'acaparamiento',
      titulo: 'Especuladores acaparan alimentos',
      texto: 'Bodegas llenas y estantes vacíos: esconden la comida esperando que suba más.',
      icon: '📦',
      efecto: { inflacion: 6 },
    },
    {
      id: 'corrida',
      iconKey: 'banco-corrida',
      titulo: 'Rumor de corrida bancaria',
      texto: 'Corre el rumor de que los bancos no devuelven la plata. Se forman filas para sacar todo.',
      icon: '🏛️',
      efecto: { inflacion: 4, apoyo: -6 },
    },
  ],

  // Desenlaces por nivel (formato común a las mecánicas no-PD; ver Outcome.jsx).
  outcomes: {
    // Estabilización exitosa a tiempo: el Decreto 21060 frena la hiperinflación.
    perfect: {
      id: 'perfect',
      concept: 'ancla',
      headlineWin:
        'EL DECRETO 21060 FRENA LA HIPERINFLACIÓN DE PAICIO EN SEMANAS',
      resultText:
        'Cortaste la imprenta y aplicaste un plan creíble justo a tiempo: unificaste el tipo de cambio, ajustaste el déficit y frenaste la emisión. Cuando la gente confió en que ya no habría dinero sin respaldo, los precios se congelaron casi de un día para otro. La pesadilla del pan que cambiaba de precio a mediodía terminó.',
      scores: { estabilidad: 92, empleo: 55, confianza: 88, crecimiento: 60 },
      inflationCurve: [100, 62, 30, 16, 10, 8],
      history:
        'En agosto de 1985 Bolivia frenó una hiperinflación de ~11.750% anual en pocas semanas con el Decreto Supremo 21060: la Nueva Política Económica de Víctor Paz Estenssoro, asesorado por Jeffrey Sachs. Funcionó porque cortó la emisión, unificó el tipo de cambio y vino con disciplina fiscal —el Estado dejó de imprimir para tapar el déficit— y credibilidad. Eso hiciste tú: apagar la imprenta y estabilizar antes de que fuera tarde.',
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
        'Imprimir dinero para pagar las cuentas del Estado es un impuesto invisible: financia hoy destruyendo el ahorro de todos mañana. Cuanto más se demora la estabilización, más caro y doloroso es el ajuste. En Bolivia, cada mes de emisión sin freno se pagó con más inflación y más pobreza antes de que el 21060 cortara la espiral.',
    },
    // La imprenta no se detuvo: colapso hiperinflacionario.
    wrong: {
      id: 'wrong',
      concept: 'hiperinflacion',
      headlineWin:
        'LA GRAN QUEMA: EL PESO SE CONVIERTE EN PAPEL SIN VALOR',
      resultText:
        'La imprenta no se detuvo a tiempo. Los precios se dispararon hasta que el peso dejó de servir: la gente cargaba fajos de billetes en bolsas para comprar comida y contaba la plata por peso, no por cifra. La moneda murió y con ella el ahorro de una generación.',
      scores: { estabilidad: 15, empleo: 25, confianza: 10, crecimiento: 20 },
      inflationCurve: [100, 145, 200, 260, 320, 380],
      history:
        'Antes del 21060, el peso boliviano perdió tanto valor que la gente llevaba el sueldo en fajos y pesaba los billetes en vez de contarlos. El gobierno siguió imprimiendo para pagar sus cuentas mientras la deuda externa se volvía impagable, hasta que la moneda simplemente dejó de aceptarse. La hiperinflación no se detiene sola: hay que apagar la imprenta.',
    },
  },

  // Vacío: en modo mecánica no se usan políticas, pero Outcome lo referencia.
  policies: [],
}
