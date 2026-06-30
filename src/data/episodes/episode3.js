// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 3 — EL MILAGRO QUE NO FUE
// Referencia: Chile 1975–1982 · Crisis: Colapso tras el boom
//
// Mecánica narrativa especial: el jugador NO empieza preso. Empieza en la
// cima: los Chicago Boys de Paicio aplicaron libre mercado, funcionó por
// años, y luego la crisis de deuda de 1982 destruyó todo. El jugador
// hereda el desastre.
//
// Esto se modela con `startsAtTop: true` — el Cell muestra un periódico
// de éxito (no de crisis) y la narración revela el colapso gradualmente.
// La mecánica de negociación y políticas es igual a los otros episodios.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep3',
  numero: 3,
  titulo: 'El Milagro que No Fue',
  año: 1982,
  crisisHistorica: 'Colapso del modelo tras el boom',
  paisReferencia: 'Chile',
  resumen:
    'El modelo de libre mercado funcionó por años. Luego todo colapsó. Heredas el desastre.',
  bloqueado: false,

  // Flag especial: el jugador empieza "en la cima", no en la celda.
  // El Cell muestra periódico de éxito → narración revela el colapso.
  startsAtTop: true,

  // Periódico: muestra el éxito pasado (contraste con el colapso que viene).
  newspaper: {
    name: 'EL HERALDO DE PAICIO',
    dateline: 'PAICIO, 5 de enero de 1982',
    number: '№ 8.103',
    headline:
      'EL MILAGRO DE PAICIO: 7 AÑOS DE CRECIMIENTO ININTERRUMPIDO',
    subhead:
      'Los Chicago Boys celebran. "El modelo funciona", declara el Ministro. Pero la deuda externa crece en silencio.',
  },

  // Texto de apertura: empieza con el éxito, termina con el golpe.
  opening: [
    'Siete años de crecimiento.',
    'Inversión extranjera récord.',
    'Los tecnócratas te llaman "el milagro económico".',
    '',
    'Pero ayer el Banco Central confesó:',
    'la deuda externa supera el 80% del PIB.',
    'Los bancos pidieron dólares baratos.',
    'Ahora el dólar subió y no pueden pagar.',
    '',
    'El milagro se acabó. Te dejaron el desastre.',
  ],

  // Narración (al evaluar la situación).
  cellNarration: [
    'Los Chicago Boys de Paicio liberaron la economía: eliminaron aranceles, privatizaron empresas, desregularon los bancos. Y funcionó — el PIB creció, la inflación bajó, el capital llegó a raudales.',
    'El problema fue invisible durante años: los bancos se endeudaron en dólares a tasa baja. Cuando las tasas internacionales subieron en 1981, la burbuja estalló.',
    'Ahora los bancos quiebran, las empresas cierran y el desempleo sube al 20%. No causaste esto, pero eres el último en la cadena de mando. Negocia con los que quedan.',
  ],

  negotiationIntro:
    'El modelo brilló por años. Ahora arden los escombros. Negocia con los sobrevivientes del milagro que no fue.',
  policyIntro:
    'Los bancos caen, las empresas cierran. Elige: ¿quién paga la cuenta del boom?',
  needAlliesWarning:
    'El desastre no espera. Necesitas al menos 2 aliados para presentar un plan creíble.',

  // Configuración del ticker (desempleo, no inflación).
  ticker: {
    itemBase: 'Tasa de desempleo',
    currency: '%',
    precioInicial: 12,
    tasaInflacion: 1.012, // factor por segundo (desempleo sube ~1.2%)
    umbralCritico: 25, // desempleo masivo
  },

  // Panel "¿qué pasó en la historia real?".
  contextoHistorico: {
    titulo: 'Chile, 1975-1983',
  },

  // Config del gráfico de tendencia del desenlace (cifras + comparación real).
  trendChart: {
    titulo: 'Desempleo en Paicio',
    unidad: 'índice (inicio = 100)',
    ejeX: ['Mes 0', '6', '12', '18', '24', '30'],
    real: {
      cifra: '−14%',
      cifraEtiqueta: 'cayó el PIB de Chile en 1982',
      nota: 'El "milagro" se derrumbó: el PIB cayó 14% en 1982 y el desempleo llegó a cerca del 30% contando los planes de empleo de emergencia (PEM y POJH). El Estado tuvo que rescatar a la banca quebrada y el ingreso por persona retrocedió a niveles de los años 60.',
    },
  },

  prisoners: [
    {
      id: 'tecnocrata',
      name: 'Dr. Chicago',
      role: 'Ministro de Hacienda saliente, discípulo de los Chicago Boys',
      portrait: '📈',
      accent: '#2C3E50',
      gender: 'm',
      blurb:
        'Diseñó el modelo que funcionó por 7 años. Ahora se derrumba y él insiste en que el problema no es el modelo sino la "implementación". No va a admitir el error.',
      utility: 'Quiere que el modelo sobreviva intacto.',
      concept: 'riesgoMoral',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 35,
      hostileNote:
        'Si lo traicionas, publica un manifiesto culpando a tu "intervención" de destruir el modelo.',
      supportsPolicy: ['purismo'],
      rejectsPolicy: ['nacionalizar'],
      voice: {
        cooperate:
          '"El modelo es sólido. Lo que falló fue la supervisión bancaria. Te doy los datos si me dejas corregirlo desde adentro."',
        betrayed:
          '"¿Intervención estatal? Es exactamente lo que nos trajo aquí en los años 70. Publicaré por qué tu plan destruye todo lo que construimos."',
      },
    },
    {
      id: 'banqueroDeuda',
      name: 'Don Crédito',
      role: 'Presidente del banco más grande de Paicio',
      portrait: '🏦',
      accent: '#8B6914',
      gender: 'm',
      blurb:
        'Pidió dólares baratos cuando el mundo prestaba, compró acciones de sus propias empresas con el dinero, y ahora no puede devolver nada. Es el símbolo del boom convertido en bust.',
      utility: 'Quiere que el Estado absorba sus pérdidas.',
      concept: 'descalceMoneda',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 40,
      hostileNote:
        'Si lo traicionas, arrastra a otros bancos en su caída y provoca un pánico sistémico.',
      supportsPolicy: ['rescate'],
      rejectsPolicy: ['purismo'],
      voice: {
        cooperate:
          '"Asumo que me equivoqué. Pero si me dejan caer, caen los depósitos de 2 millones de personas. Nadie quiere eso."',
        betrayed:
          '"¿Me dejan quebrar? Perfecto. Mañana abro los libros y muestro a quién más le presté. Caemos todos juntos."',
      },
    },
    {
      id: 'trabajadorChile',
      name: 'Compañero Fierro',
      role: 'Dirigente de los trabajadores del cobre de Paicio',
      portrait: '⛏️',
      accent: '#C0392B',
      gender: 'm',
      blurb:
        'El modelo eliminó la protección laboral en nombre de la eficiencia. Ahora con el 20% de desempleo, los trabajadores no tienen red de contención. Fierro los organiza.',
      utility: 'Quiere seguro de desempleo y protección laboral.',
      concept: 'cicloAugeCaida',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 50,
      hostileNote:
        'Si lo traicionas, la protesta social se radicaliza. Huelga general del cobre.',
      supportsPolicy: ['nacionalizar'],
      rejectsPolicy: ['purismo'],
      voice: {
        cooperate:
          '"Mi gente aguanta si hay un plan de verdad. Pero necesito algo concreto: seguro de desempleo, ahora."',
        betrayed:
          '"¿Más austeridad para los de abajo? Paro del cobre a partir del lunes. A ver quién exporta sin nosotros."',
      },
    },
    {
      id: 'fmiChile',
      name: 'Señora Fischer',
      role: 'Representante del Fondo Monetario Internacional',
      portrait: '💼',
      accent: '#5B8DB8',
      gender: 'f',
      blurb:
        'Ofrece un rescate, pero con condiciones que profundizan la recesión. Sonríe mientras te lee la letra chica del acuerdo.',
      utility: 'Quiere programa de ajuste estructural firmado.',
      concept: 'ajusteEstructural',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 40,
      hostileNote:
        'Si la traicionas, cierra la línea de crédito y Paicio pierde acceso a mercados internacionales.',
      supportsPolicy: ['rescate'],
      rejectsPolicy: ['nacionalizar'],
      voice: {
        cooperate:
          '"Firmamos. Liberamos los fondos contra reformas verificables. Nada personal, ministro — así funciona esto."',
        betrayed:
          '"Sin acuerdo, sin fondos. Paicio puede llamarnos cuando esté listo para ser serio. Nuestra paciencia tiene límites."',
      },
    },
  ],

  policies: [
    {
      id: 'rescate',
      letter: 'A',
      name: 'Rescatar la banca privada con fondos públicos',
      summary:
        'El Estado absorbe la deuda de los bancos, los recapitaliza y negocia con los acreedores externos.',
      effect: 'Evita el pánico bancario y mantiene el crédito.',
      cost: 'Los contribuyentes pagan la fiesta de los banqueros. El riesgo moral se institucionaliza.',
      impact: {
        inflacion: { fill: 2, label: 'Sube moderada', good: false },
        empleo: { fill: 3, label: 'Se estabiliza', good: true },
      },
      inflationCurve: [100, 85, 70, 55, 48, 42],
      concept: 'riesgoMoral',
      supportedBy: ['banqueroDeuda', 'fmiChile'],
      rejectedBy: ['trabajadorChile'],
      scores: {
        estabilidad: 68,
        empleo: 48,
        confianza: 72,
        crecimiento: 55,
      },
      headlineWin:
        'EL ESTADO SALVA A LA BANCA: PAICIO ABSORBE LA DEUDA PRIVADA',
      headlineWeak:
        'RESCATE SIN CONDICIONES: LOS BANQUEROS GANAN, LA GENTE PAGA',
      resultText:
        'El Estado absorbe las deudas de los bancos. Los depósitos se salvan, el crédito fluye de nuevo. Pero la factura la pagan los contribuyentes con una década de austeridad fiscal. Los que causaron la crisis salen indemnes.',
      history:
        'Chile hizo exactamente esto en 1982-83: el Estado intervino los bancos, absorbió sus deudas en dólares y los recapitalizó con fondos públicos. El costo fue enorme — equivalente al 35% del PIB — pero evitó un colapso sistémico. La economía se recuperó, pero la desigualdad creció y los contribuyentes pagaron la fiesta de los banqueros durante 20 años.',
    },
    {
      id: 'purismo',
      letter: 'B',
      name: 'Dejar quebrar a los bancos',
      summary:
        'Respetar el mercado: si tomaron riesgos y perdieron, que asuman las consecuencias.',
      effect: 'Envía una señal de disciplina de mercado.',
      cost: 'Los depósitos se pierden. Pánico bancario. Recesión profunda.',
      impact: {
        inflacion: { fill: 3, label: 'Controlada', good: true },
        empleo: { fill: 1, label: 'Colapsa', good: false },
      },
      inflationCurve: [100, 90, 78, 65, 55, 50],
      concept: 'descalceMoneda',
      supportedBy: ['tecnocrata'],
      rejectedBy: ['banqueroDeuda', 'trabajadorChile'],
      scores: {
        estabilidad: 55,
        empleo: 25,
        confianza: 60,
        crecimiento: 30,
      },
      headlineWin:
        'EL MERCADO MANDA: PAICIO DEJA CAER A LOS BANCOS INSOLVENTES',
      headlineWeak:
        'PURISMO SUICIDA: LOS DEPÓSITOS SE PIERDEN Y EL PÁNICO SE EXTIENDE',
      resultText:
        'Los bancos quiebran. Los depósitos desaparecen. Es la consecuencia lógica del libre mercado, pero la gente que perdió sus ahorros no quiere lógica — quiere su dinero. El desempleo supera el 25%.',
      history:
        'Ningún país ha dejado quebrar a toda su banca en una crisis sistémica — el costo social es demasiado alto. Incluso los más ortodoxos (EE.UU. en 2008, Suecia en 1992) intervinieron. El purismo total es coherente en teoría pero suicida en la práctica: la destrucción de depósitos genera una espiral recesiva que dura años.',
    },
    {
      id: 'nacionalizar',
      letter: 'C',
      name: 'Nacionalización temporal',
      summary:
        'El Estado interviene los bancos, los sanea, y los devuelve al sector privado después.',
      effect: 'Protege los depósitos sin regalar la recapitalización.',
      cost: 'Requiere capacidad estatal que Paicio quizás no tiene. Los mercados desconfían.',
      impact: {
        inflacion: { fill: 2, label: 'Moderada', good: null },
        empleo: { fill: 2, label: 'Baja con red', good: null },
      },
      inflationCurve: [100, 80, 62, 50, 44, 38],
      concept: 'cicloAugeCaida',
      supportedBy: ['trabajadorChile'],
      rejectedBy: ['tecnocrata', 'fmiChile'],
      scores: {
        estabilidad: 62,
        empleo: 55,
        confianza: 42,
        crecimiento: 52,
      },
      headlineWin:
        'INTERVENCIÓN PRAGMÁTICA: PAICIO NACIONALIZA LA BANCA PARA SANEARLA',
      headlineWeak:
        'NACIONALIZACIÓN SIN RUMBO: EL ESTADO NO SABE MANEJAR BANCOS',
      resultText:
        'El Estado toma control de los bancos, protege los depósitos y hace pagar a los accionistas — no a los contribuyentes. Es el camino del medio: ni purismo suicida ni regalo a los banqueros. Pero requiere una capacidad estatal que en Paicio escasea.',
      history:
        'Suecia usó este modelo en 1992: nacionalizó temporalmente sus bancos, los saneó y los reprivatizó con ganancias para el Estado. Funcionó brillantemente. Chile en 1983 hizo algo similar pero menos limpio: intervino los bancos pero terminó subsidiando a los accionistas. La diferencia está en la ejecución, no en el concepto.',
    },
  ],
}
