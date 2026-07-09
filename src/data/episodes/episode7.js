// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 7 — EL FUJISHOCK
// Referencia: Perú 1990 · Crisis: Hiperinflación y terapia de shock
//
// Mecánica NUEVA: Terapia de Shock (shockTherapy). NO repite "La Imprenta"
// de Bolivia — el ángulo es la VELOCIDAD del ajuste vs. el COSTO SOCIAL.
// El jugador elige cada ronda qué tan agresivo es el shock: más rápido
// mata la inflación pero más apoyo social quema. La destreza está en
// encontrar el punto exacto donde la inflación se rompe sin que la
// sociedad reviente.
//
// Lógica en src/utils/shockTherapy.js, UI en ShockTherapy.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep7',
  numero: 7,
  line: 'crisis',
  titulo: 'El Fujishock',
  año: 1990,
  crisisHistorica: 'Hiperinflación y terapia de shock',
  paisReferencia: 'Perú',
  resumen:
    'La inflación devora al país. El nuevo presidente aplica el shock más brutal de América Latina.',
  bloqueado: false,

  // Mecánica nueva de terapia de shock.
  mechanic: 'shockTherapy',

  // Periódico: agosto de 1990, el día del Fujishock.
  newspaper: {
    name: 'EL HERALDO DE PAICIO',
    dateline: 'PAICIO, 8 de agosto de 1990',
    number: '№ 15.841',
    headline:
      'GOBIERNO APLICA EL SHOCK MÁS BRUTAL: PRECIOS SUBEN 3.000% EN UN DÍA',
    subhead:
      'El presidente recién electo elimina subsidios, devalúa la moneda y liberaliza la economía de golpe. "Que el pueblo sufra", declaró.',
  },

  // Texto de apertura (animado línea a línea).
  opening: [
    'La inflación de Paicio llegó a 7.650% anual.',
    'El sol se derrite: los precios suben mientras los miras.',
    'El gobierno anterior dejó el país en default con el FMI.',
    '',
    'El nuevo presidente prometió un shock.',
    'Nadie imaginó que sería tan brutal.',
    '',
    'El 8 de agosto de 1990 todo cambió.',
    'Los subsidios murieron, el sol se devaluó, los precios se triplicaron.',
    '',
    'Tú diseñaste el shock.',
    'Ahora tienes que administrar sus consecuencias.',
  ],

  // Narración (al evaluar la situación).
  cellNarration: [
    'El gobierno de Alan, el presidente anterior, fue un desastre: congeló precios, defaulted la deuda externa, quemó reservas. Dejó una hiperinflación de 7.650% y un país aislado del mundo.',
    'El nuevo presidente prometió no aplicar shock. Lo aplicó al asumir. La noche del 8 de agosto de 1990 —el "Fujishock"— los precios de la gasolina subieron 3.000%, el tipo de cambio se devaluó 227% y los subsidios desaparecieron en 24 horas.',
    'Funcionó: la inflación cayó a 139% en un año. Pero el costo fue inmenso: la pobreza subió del 42% al 55%, el desempleo explotó y Sendero Luminoso aprovechó el caos para crecer.',
  ],

  negotiationIntro:
    'La hiperinflación de 7.650% no se frena con medias tintas. Cada ronda eliges qué tan duro apretas. Mientras más rápido mata la inflación, más apoyo social quema. Elige tu velocidad.',
  policyIntro:
    'El shock está en marcha. Ahora decide cómo manejar las consecuencias sin que el país estalle.',
  needAlliesWarning:
    'El ajuste duele y la calle presiona. Necesitas al menos 2 aliados para sostener el plan de estabilización.',

  // Configuración del ticker (precios de la canasta básica).
  ticker: {
    itemBase: 'Canasta básica',
    currency: 'Intis',
    precioInicial: 85000,
    tasaInflacion: 1.045, // factor por segundo (~4.5%, hiperinflación)
    umbralCritico: 500000, // hiperinflación desbocada
  },

  // Panel "¿qué pasó en la historia real?".
  contextoHistorico: {
    titulo: 'Perú, 1990-1991',
  },

  // Config del gráfico de tendencia del desenlace.
  trendChart: {
    titulo: 'Inflación en Paicio',
    unidad: 'índice (inicio = 100)',
    ejeX: ['Mes 0', '3', '6', '9', '12', '18'],
    real: {
      cifra: '7.650% → 139%',
      cifraEtiqueta: 'cayó la inflación anual de Perú en 12 meses',
      nota: 'El Fujishock de agosto de 1990 fue una de las estabilizaciones más brutales de la historia: los precios de los bienes básicos se triplicaron de un día para otro. Pero funcionó: la inflación anual pasó de 7.650% a 139% en 1991 y a 56% en 1992. El costo social fue inmenso —la pobreza subió del 42% al 55%—, pero la hiperinflación se rompió para siempre. Sendero Luminoso aprovechó el descontento para crecer, pero el shock sentó las bases de la reinserción financiera del Perú.',
    },
  },

  prisoners: [
    {
      id: 'tecnico_peru',
      name: 'Dr. Shock',
      role: 'Jefe del equipo técnico de estabilización',
      portrait: '📈',
      accent: '#2C3E50',
      gender: 'm',
      blurb:
        'Diseñó el Fujishock. Sabe que no hay alternativa: o se mata la inflación de golpe o el país muere. Cada mes que pasa sin shock es otro mes de 50% de inflación.',
      utility: 'Quiere aplicar el shock total sin concesiones.',
      concept: 'terapiaShock',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 35,
      hostileNote:
        'Si lo traicionas, filtra a la prensa que el plan se está desviando y los mercados pierden toda confianza.',
      supportsPolicy: ['shock'],
      rejectsPolicy: ['gradual'],
      voice: {
        cooperate:
          '"El shock es la única opción, ministro. No hay plan B. Si aflojamos ahora, la hiperinflación vuelve peor."',
        betrayed:
          '"¿Quieren gradualismo? Ya lo intentaron con Alan. Mire cómo quedó el país. Que no digan que no les advertí."',
      },
    },
    {
      id: 'social_peru',
      name: 'Compañera Rosa',
      role: 'Dirigente de los comedores populares de Lima',
      portrait: '🍲',
      accent: '#C0392B',
      gender: 'f',
      blurb:
        'Alimenta a 500 familias en el cono norte de Lima con lo que consigue. Cuando los subsidios desaparecieron de golpe, sus ollas comunes se quedaron sin gas, sin arroz, sin aceite.',
      utility: 'Quiere que el shock incluya una red de protección social.',
      concept: 'costoSocial',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 50,
      hostileNote:
        'Si la traicionas, las ollas comunes se convierten en protestas que paralizan Lima.',
      supportsPolicy: ['gradual'],
      rejectsPolicy: ['shock'],
      voice: {
        cooperate:
          '"Mi gente no come promesas, ministro. Si el shock es inevitable, deme algo para darles mientras tanto. Un bono, una bolsa de arroz, lo que sea."',
        betrayed:
          '"¿Así que los pobres pagan todo otra vez? Mañana las ollas comunes salen a la calle. Veremos si su shock resiste el paro de Lima."',
      },
    },
    {
      id: 'empresario_peru',
      name: 'Don Mercado',
      role: 'Dueño de una cadena de bodegas en el mercado informal',
      portrait: '🏪',
      accent: '#27AE60',
      gender: 'm',
      blurb:
        'La mitad de la economía de Paicio pasa por sus manos: dólares paralelos, trueque, crédito informal. La inflación es su mejor negocio — la devaluación, su ruina.',
      utility: 'Quiere que se legalice la dolarización parcial.',
      concept: 'dolarizacionParalela',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 45,
      hostileNote:
        'Si lo traicionas, cierra sus líneas de crédito informal y la economía paralela colapsa.',
      supportsPolicy: ['shock'],
      rejectsPolicy: ['gradual'],
      voice: {
        cooperate:
          '"En mi bodega ya no acepto intis. Solo dólares o trueque. Si legaliza el dólar, le ayudo a que la economía real no se pare."',
        betrayed:
          '"¿Otra vez a perseguir el dólar paralelo? La calle ya votó con sus billeteras: todos usamos dólares. Usted no puede parar eso."',
      },
    },
    {
      id: 'militar_peru',
      name: 'Coronel Firmamento',
      role: 'Jefe de inteligencia del Comando Conjunto',
      portrait: '🎖️',
      accent: '#8E44AD',
      gender: 'm',
      blurb:
        'Sendero Luminoso controla el 40% del territorio. No le importa la inflación — le importa que el ajuste deje gente sin trabajo dispuesta a tomar las armas.',
      utility: 'Quiere que el shock incluya gasto en seguridad e inteligencia.',
      concept: 'conflictoInterno',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 40,
      hostileNote:
        'Si lo traicionas, retira el apoyo militar y Sendero avanza sobre las zonas que quedan sin protección.',
      supportsPolicy: ['shock'],
      rejectsPolicy: ['gradual'],
      voice: {
        cooperate:
          '"El shock es su problema, ministro. Mi problema es que cada desempleado es un recluta para Sendero. Necesito recursos para contenerlos."',
        betrayed:
          '"Sin presupuesto para seguridad, no respondo por el control territorial. Sendero ya está celebrando su ajuste."',
      },
    },
  ],

  // ── MECÁNICA DE TERAPIA DE SHOCK ───────────────────────────────────────
  // Config leída por ShockTherapy.jsx / shockTherapy.js.
  // El jugador elige cada ronda qué tan agresivo es el ajuste. Más agresivo
  // mata la inflación más rápido pero quema más apoyo social.
  shockTherapy: {
    intro:
      'La hiperinflación de Paicio se come el país: 7.650% anual, los precios suben mientras los miras. El Fujishock es la medicina: brutal, rápida, inevitable. Cada ronda eliges qué tan fuerte aprietas. Aprieta demasiado y la sociedad revienta. Aprieta muy poco y la inflación te gana. Encuentra el punto exacto.',
    rondas: 6,
    inflacionInicial: 82,
    apoyoInicial: 55,
    umbralInflacion: 32,  // por debajo = inflación derrotada
    umbralApoyo: 28,      // por encima = apoyo social viable
    umbralBreak: 38,      // por debajo, la inflación empieza a caer sola
    umbralApoyoColapso: 15, // por debajo = gobierno cae
    derivaInflacion: 4,   // inflación sube sola cada ronda (inercia)
    derivaPositiva: 3,    // inflación cae sola si se rompió el umbral
    desgasteApoyo: -3,    // apoyo social se erosiona cada ronda
    acciones: [
      {
        id: 'shockTotal',
        name: 'Shock total',
        icon: '⚡',
        desc: 'Liberalizas TODO: precios, tipo de cambio, aranceles. Mata la inflación de golpe, pero el costo social es inmediato y brutal.',
        inflacion: -30,
        apoyo: -22,
        advisor: 'tecnico_peru',
        reaccion:
          '"Duele. Duele mucho. Pero es la única forma de matar la hiperinflación. Si aflojamos ahora, el shock no sirvió de nada."',
      },
      {
        id: 'gradual',
        name: 'Ajuste gradual',
        icon: '📉',
        desc: 'Vas de a poco: subes precios regulados y ajustas el tipo de cambio mes a mes. Menos dolor hoy, inflación por más tiempo.',
        inflacion: -14,
        apoyo: -9,
        advisor: 'social_peru',
        reaccion:
          '"Así sí, ministro. La gente necesita tiempo para ajustarse. Un shock total mata de hambre a media Lima."',
      },
      {
        id: 'subsidios',
        name: 'Subsidios focalizados',
        icon: '🛡️',
        desc: 'Mantienes un colchón social: bonos, canasta básica, comedores populares. Salva apoyo pero casi no frena la inflación.',
        inflacion: -5,
        apoyo: 6,
        usos: 2,
        advisor: 'social_peru',
        reaccion:
          '"Gracias, ministro. Con esto las ollas comunes alcanzan para dos semanas más. Le compramos tiempo al shock."',
      },
      {
        id: 'dolarizar',
        name: 'Legalizar el dólar paralelo',
        icon: '💵',
        desc: 'Reconoces la dolarización de facto: contratos y ahorros pueden ser en dólares. Reduce presión inflacionaria sin ajuste adicional.',
        inflacion: -8,
        apoyo: -2,
        advisor: 'empresario_peru',
        reaccion:
          '"Por fin, ministro. Todo Paicio ya opera en dólares menos el gobierno. Legalícelo y la economía real deja de esconderse."',
      },
    ],
  },

  // ── CARTAS DE EVENTO ("shocks" tipo Reigns) ────────────────────────────
  eventos: [
    {
      id: 'sendero',
      titulo: 'Sendero Luminoso ataca un puesto policial',
      texto: 'La ofensiva senderista coincide con el ajuste. El descontento social llena sus filas de nuevos reclutas.',
      icon: '💣',
      efecto: { apoyo: -8 },
    },
    {
      id: 'colera',
      titulo: 'Brote de cólera en los conos de Lima',
      texto: 'La falta de agua potable y la desnutrición disparan una epidemia. Los comedores populares piden ayuda urgente.',
      icon: '🦠',
      efecto: { apoyo: -10 },
    },
    {
      id: 'fmiLineaPeru',
      titulo: 'El FMI ofrece reinserción financiera',
      texto: 'Reconocen el shock y ofrecen una línea de crédito. Los mercados internacionales vuelven a mirar a Paicio.',
      icon: '🌐',
      efecto: { inflacion: -5, apoyo: -3 },
    },
    {
      id: 'dolarParaleloPeru',
      titulo: 'El dólar paralelo se dispara',
      texto: 'En la calle el dólar duplica su valor oficial. Todos los precios se reindexan al blue y la inflación de acomoda.',
      icon: '💵',
      efecto: { inflacion: 7 },
    },
    {
      id: 'paroNacional',
      titulo: 'Los gremios llaman a paro nacional',
      texto: 'La CGTP paraliza el país: los sindicatos exigen la renuncia del gabinete económico.',
      icon: '✊',
      efecto: { apoyo: -8 },
    },
    {
      id: 'reinsercion',
      titulo: 'El Club de París renegocia la deuda',
      texto: 'Los acreedores internacionales aceptan reestructurar la deuda externa de Paicio. Un respiro fiscal inesperado.',
      icon: '🤝',
      efecto: { inflacion: -4, apoyo: 3 },
    },
    {
      id: 'cosechaPeru',
      titulo: 'Cosecha récord en la costa',
      texto: 'La agroexportación repunta: espárragos, uvas, mangos. Entran dólares frescos a la economía.',
      icon: '🌾',
      efecto: { inflacion: -3, apoyo: 4 },
    },
    {
      id: 'golpeOficiales',
      titulo: 'Oficiales del ejército se reúnen en secreto',
      texto: 'Se rumorea un golpe de Estado si el ajuste sigue hundiendo a la población.',
      icon: '🎖️',
      opciones: [
        {
          label: 'Prometer más gasto en seguridad',
          efecto: { apoyo: 6, inflacion: 3 },
          replica: 'Los militares se calman. El gasto extra aviva la inflación, pero la asonada se frena.',
        },
        {
          label: 'Aguantar el ajuste sin concesiones',
          efecto: { apoyo: -4 },
          replica: 'Sin presupuesto militar, los oficiales rumian su descontento. La asonada sigue siendo una amenaza.',
        },
      ],
    },
    {
      id: 'fmiCondiciones',
      titulo: 'El FMI exige más ajuste a cambio del crédito',
      texto: 'Quieren recorte del empleo público y eliminación total de subsidios restantes, o no liberan los fondos.',
      icon: '🏦',
      opciones: [
        {
          label: 'Aceptar las condiciones del FMI',
          efecto: { inflacion: -8, apoyo: -7 },
          replica: 'El crédito llega. La inflación baja. La calle se endurece. Todo según el manual del Fondo.',
        },
        {
          label: 'Rechazar y buscar financiamiento propio',
          efecto: { inflacion: 3, apoyo: 3 },
          replica: 'Sin condiciones externas. Ajustamos a nuestro ritmo, pero con menos respaldo internacional.',
        },
      ],
    },
  ],

  // Desenlaces por nivel.
  outcomes: {
    // Shock exitoso: inflación derrotada, apoyo social aguanta el mínimo.
    perfect: {
      id: 'perfect',
      concept: 'terapiaShock',
      headlineWin:
        'EL FUJISHOCK FUNCIONA: PAICIO ROMPE LA HIPERINFLACIÓN CON EL COSTO SOCIAL JUSTO',
      resultText:
        'Aplicaste el shock con la intensidad precisa: la inflación se rompió en meses —las expectativas se quebraron y los precios dejaron de dispararse— y el apoyo social, aunque golpeado, aguantó. Los comedores populares, las ollas comunes y los subsidios focalizados hicieron de colchón. El país salió de la hiperinflación sin reventar. Duele, pero funciona.',
      scores: { estabilidad: 78, empleo: 42, confianza: 62, crecimiento: 50 },
      inflationCurve: [100, 66, 40, 28, 18, 14],
      history:
        'Perú aplicó el Fujishock el 8 de agosto de 1990: liberalizó precios, eliminó subsidios, devaluó el sol y reabrió la economía. La inflación anual cayó de 7.650% a 139% en 1991, y a 56% en 1992. El costo fue enorme —la pobreza subió del 42% al 55%—, pero la hiperinflación nunca volvió. El shock funcionó exactamente como los ortodoxos predecían: brutal, rápido y definitivo.',
    },
    // Sobrevivió con daño: inflación baja pero a un costo social enorme.
    partial: {
      id: 'partial',
      concept: 'costoSocial',
      headlineWin:
        'LA INFLACIÓN CEDE PERO EL COSTO SOCIAL DEJA AL PAÍS AL BORDE DEL COLAPSO',
      resultText:
        'Lograste bajar la inflación, pero el costo fue casi tan destructivo como la enfermedad: el apoyo social se desplomó, la pobreza se disparó y Sendero Luminoso creció alimentado por el descontento. La hiperinflación terminó, pero el país está tan dañado que cuesta llamarlo victoria.',
      scores: { estabilidad: 50, empleo: 32, confianza: 35, crecimiento: 38 },
      inflationCurve: [100, 78, 58, 45, 38, 34],
      history:
        'El Fujishock funcionó, pero a un precio social que casi cuesta el gobierno: la pobreza saltó del 42% al 55%, el empleo informal trepó al 70% y Sendero Luminoso aprovechó la crisis para ocupar más territorio. El Perú de 1991 era un país más estable monetariamente, pero más pobre y más violento que el de 1989.',
    },
    // Colapso: la inflación no se frenó o el apoyo social colapsó.
    wrong: {
      id: 'wrong',
      concept: 'hiperinflacion',
      headlineWin:
        'EL SHOCK REVIENTA: PAICIO CAE EN LA TRAMPA DE LA HIPERINFLACIÓN O EL COLAPSO SOCIAL',
      resultText:
        'El shock fue demasiado fuerte o demasiado débil. Si apretaste de más, la sociedad reventó antes que la inflación: la calle se tomó las calles, el gobierno cayó y el siguiente presidente prometió lo contrario. Si apretaste de menos, la hiperinflación sobrevivió al shock y siguió comiéndose el país desde adentro. La ventana se cerró.',
      scores: { estabilidad: 18, empleo: 22, confianza: 14, crecimiento: 20 },
      inflationCurve: [100, 104, 120, 145, 162, 175],
      history:
        'El riesgo del Fujishock era doble: demasiado shock tumba al gobierno por el costo social; demasiado poco no rompe la hiperinflación y el país se desangra en cámara lenta. Perú evitó ambos extremos por poco. Otros países que intentaron shocks graduales —o shocks brutales sin red de protección— terminaron peor: o la inflación no cedió o el gobierno cayó.',
    },
  },

  // Vacío: en modo mecánica no se usan políticas, pero Outcome lo referencia.
  policies: [],
}
