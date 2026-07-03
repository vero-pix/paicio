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
//
// Mecánica: DEFENDER LA PARIDAD (guerra de desgaste). El jugador resiste un
// ataque especulativo a la paridad fija manejando reservas y empleo, y debe
// devaluar a tiempo. Lógica en src/utils/speculativeAttack.js.
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

  // Mecánica central del episodio (ver src/utils/speculativeAttack.js).
  mechanic: 'speculativeAttack',

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

  // ── MECÁNICA DE DEFENSA DE LA PARIDAD ──────────────────────────────────
  // Config leída por SpeculativeAttack.jsx / speculativeAttack.js.
  speculativeAttack: {
    intro:
      'La paridad fija de Paicio quedó sobrevaluada y el mercado lo huele. Cada día los especuladores atacan más fuerte. Defenderla quema reservas o empleo. No puedes aguantar para siempre: el arte es soltarla a tiempo.',
    dias: 6,
    reservasIniciales: 100,
    empleoInicial: 72,
    ataqueBase: 14, // presión especulativa del día 1
    ataqueRamp: 6, // cuánto crece el ataque cada día
    recesionRonda: 2, // caída de empleo de fondo por ronda
    minRondaOrdenada: 2, // antes de esta ronda, devaluar = pánico (no "ordenado")
    acciones: [
      {
        id: 'tasas',
        name: 'Subir las tasas de interés',
        icon: '📈',
        desc: 'Encarece atacar la moneda: frena la fuga de capitales, pero estrangula la economía y el empleo.',
        ataqueMult: 0.45,
        empleo: -13,
        advisor: 'tecnocrata',
        reaccion:
          '"Tasas altas, disciplina de mercado. Duele, pero el modelo se defiende solo si lo dejamos actuar."',
      },
      {
        id: 'intervenir',
        name: 'Vender reservas para sostener',
        icon: '💵',
        desc: 'Intervienes el mercado comprando tu propia moneda. Sostiene la paridad hoy, a costa de munición.',
        ataqueMult: 0.3,
        reservasCosto: 6,
        advisor: 'banqueroDeuda',
        reaccion:
          '"Defienda el tipo de cambio, ministro. Si devalúa, mi deuda en dólares nos entierra a mí y a medio país."',
      },
      {
        id: 'fmi',
        name: 'Pedir un préstamo al FMI',
        icon: '🌐',
        desc: 'Recargas reservas con dólares frescos, pero con condiciones que pesan sobre el empleo.',
        reservas: 34,
        empleo: -7,
        usos: 1,
        advisor: 'fmiChile',
        reaccion:
          '"Adelantamos los dólares. A cambio, esperamos el ajuste firmado. Ya conoce la rutina, ministro."',
      },
      {
        id: 'devaluar',
        name: 'Soltar la paridad (devaluar)',
        icon: '⚖️',
        desc: 'Dejas que la moneda encuentre su valor. Termina el ataque — pero si lo haces tarde, el daño ya está hecho.',
        advisor: 'trabajadorChile',
        reaccion:
          '"Por fin algo de aire. La moneda cara solo servía para importar lujos mientras cerraban las fábricas."',
      },
    ],
  },

  // ── CARTAS DE EVENTO ("shocks" tipo Reigns) ────────────────────────────
  // Capa de game loop: al inicio de algunas rondas cae una carta que golpea los
  // medidores (reservas / empleo) por el mismo clamp. ~50% por ronda, sin
  // reemplazo. Sin `iconKey` → EventCard usa el emoji de `icon` (arte pendiente).
  eventos: [
    {
      id: 'fed',
      titulo: 'La Fed sube las tasas',
      texto: 'El crédito mundial se encarece de golpe. Sostener la paridad cuesta el doble de reservas.',
      icon: '📈',
      efecto: { reservas: -8 },
    },
    {
      id: 'cobre',
      titulo: 'Se desploma el precio del cobre',
      texto: 'El principal producto de Paicio pierde un tercio de su valor. Las minas mandan a casa a miles.',
      icon: '⛏️',
      efecto: { empleo: -8 },
    },
    {
      id: 'quiebraBanco',
      titulo: 'Quiebra un banco grande',
      texto: 'Uno de los bancos endeudados en dólares no puede pagar. El sistema tiembla.',
      icon: '🏚️',
      efecto: { reservas: -6, empleo: -5 },
    },
    {
      id: 'fugaDolares',
      titulo: 'Fuga de dólares',
      texto: 'Los que saben huelen la devaluación y sacan sus dólares del país antes que nadie.',
      icon: '🛫',
      efecto: { reservas: -10 },
    },
    {
      id: 'rumorDeval',
      titulo: 'Rumor de devaluación inminente',
      texto: 'La prensa da la paridad por perdida. Todos corren a comprar dólares mientras estén baratos.',
      icon: '🗣️',
      efecto: { reservas: -8 },
    },
    {
      id: 'exportaPunta',
      titulo: 'Salto exportador puntual',
      texto: 'Un embarque grande de fruta y harina entra dólares frescos a las reservas.',
      icon: '📦',
      efecto: { reservas: 7 },
    },
    {
      id: 'paroCobre',
      titulo: 'Los mineros del cobre amenazan con paro',
      texto: 'Sin red de protección, los trabajadores exigen un gesto o paran la exportación que te queda.',
      icon: '✊',
      opciones: [
        {
          label: 'Ceder: subsidio de emergencia',
          efecto: { empleo: 8, reservas: -6 },
          replica: 'Las minas siguen andando y la calle se calma, pero las arcas quedan más flacas.',
        },
        {
          label: 'Aguantar la línea dura',
          efecto: { empleo: -8 },
          replica: 'Ni un peso extra. El paro se declara y la producción se detiene.',
        },
      ],
    },
    {
      id: 'rescateFMI',
      iconKey: 'fmi',
      titulo: 'El FMI ofrece un préstamo puente',
      texto: 'Dólares para reforzar reservas, a cambio de un ajuste que hunde más el empleo.',
      icon: '🌐',
      opciones: [
        {
          label: 'Tomar el préstamo',
          efecto: { reservas: 16, empleo: -6 },
          replica: 'Munición fresca para defender la paridad… pero el ajuste pega donde ya duele.',
        },
        {
          label: 'Rechazar las condiciones',
          efecto: { empleo: 3 },
          replica: 'Sin la letra chica del Fondo. Defiendes con lo que tienes.',
        },
      ],
    },
  ],

  // Desenlaces por nivel (formato común a las mecánicas no-PD; ver Outcome.jsx).
  // La curva representa el ÍNDICE DE DESEMPLEO (más bajo = mejor).
  outcomes: {
    // Devaluación ordenada y a tiempo.
    perfect: {
      id: 'perfect',
      concept: 'trinidadImposible',
      headlineWin:
        'DEVALUACIÓN ORDENADA: PAICIO SUELTA LA PARIDAD A TIEMPO Y SALVA EL EMPLEO',
      resultText:
        'Resististe lo justo y soltaste la paridad antes de quemar todo. La moneda encontró un valor competitivo, las exportaciones repuntaron y el empleo aguantó. Aceptaste que la paridad era insostenible en vez de pelear una guerra perdida.',
      scores: { estabilidad: 70, empleo: 66, confianza: 60, crecimiento: 68 },
      inflationCurve: [100, 96, 84, 70, 58, 50],
      history:
        'Un tipo de cambio fijo sobrevaluado no se puede defender para siempre: el mercado tiene más munición que cualquier banco central. Los países que devaluaron a tiempo —en vez de quemar todas sus reservas— sufrieron mucho menos. La clave es reconocer cuándo la paridad es insostenible y soltarla de forma ordenada.',
    },
    // Devaluó tarde (con daño) o demasiado pronto (pánico), o nunca soltó.
    partial: {
      id: 'partial',
      concept: 'ataqueEspeculativo',
      headlineWin:
        'PAICIO DEVALÚA, PERO TARDE: LA DEFENSA SE COMIÓ RESERVAS Y EMPLEO',
      resultText:
        'Al final soltaste la paridad, pero recién cuando ya casi no quedaba con qué defenderla. Las tasas altas y la fuga de reservas dejaron una recesión más profunda de la necesaria. La corrección llegó, cara.',
      scores: { estabilidad: 45, empleo: 38, confianza: 40, crecimiento: 42 },
      inflationCurve: [100, 108, 120, 126, 122, 118],
      history:
        'Chile defendió su paridad fija (39 pesos por dólar) hasta mediados de 1982, perdiendo reservas y subiendo tasas que ahogaron la economía. Cuando finalmente devaluó, el daño ya estaba hecho. Aguantar de más convierte una corrección manejable en una crisis.',
    },
    // Reservas agotadas: devaluación caótica / empleo destruido.
    wrong: {
      id: 'wrong',
      concept: 'descalceMoneda',
      headlineWin:
        'SE ACABARON LAS RESERVAS: DEVALUACIÓN CAÓTICA Y COLAPSO EN PAICIO',
      resultText:
        'Peleaste hasta el último dólar. Cuando las reservas llegaron a cero, la devaluación se impuso sola, brutal y sin control. La deuda en dólares explotó, los bancos cayeron y el desempleo se disparó. La guerra de desgaste tenía un solo final, y lo postergaste hasta hacerlo peor.',
      scores: { estabilidad: 20, empleo: 22, confianza: 18, crecimiento: 25 },
      inflationCurve: [100, 122, 150, 175, 185, 180],
      history:
        'En 1982 Chile agotó reservas defendiendo una paridad insostenible. La devaluación llegó igual, pero tarde y caótica: el PIB cayó 14%, el desempleo trepó a cerca del 30% (con planes de emergencia) y el Estado tuvo que rescatar a toda la banca. Es el costo de pelear una guerra de desgaste imposible de ganar.',
    },
  },

  // Vacío: en modo mecánica no se usan políticas, pero Outcome lo referencia.
  policies: [],
}
