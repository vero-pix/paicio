// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 4 — LA DÉCADA PERDIDA
// Referencia: Brasil 1980s · Crisis: Inflación crónica y planes fallidos
//
// Misma estructura que episode1.js. Componentes leen de aquí sin cambios.
//
// Mecánica especial narrativa: la credibilidad del jugador empieza baja
// (5 planes anteriores fracasaron). No requiere código de componente
// nuevo — se modela via initialTrust bajo en todos los prisioneros.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep4',
  numero: 4,
  titulo: 'La Década Perdida',
  año: 1987,
  crisisHistorica: 'Inflación crónica y planes fallidos en serie',
  paisReferencia: 'Brasil',
  resumen:
    'Cinco planes económicos fracasaron. Nadie cree en ninguno. Te piden un sexto.',
  bloqueado: false,

  // Periódico de la pantalla de celda.
  newspaper: {
    name: 'EL HERALDO DE PAICIO',
    dateline: 'PAICIO, 3 de marzo de 1987',
    number: '№ 9.215',
    headline:
      'PLAN CRUZADO FRACASA: LA INFLACIÓN VUELVE A 400% ANUAL',
    subhead:
      'Es el quinto plan en seis años. El nuevo Ministro de Hacienda jura que esta vez será diferente.',
  },

  // Texto de apertura (animado línea a línea).
  opening: [
    'La canasta básica cuesta 2.400 cruzeiros.',
    'Hace tres meses costaba 1.200.',
    'Hace un año costaba 300.',
    '',
    'El Plan Cruzado congeló los precios. Funcionó 8 meses.',
    'Después la inflación volvió, peor que antes.',
    'Antes de eso, el Plan Bresser. Antes, el Plan Verão.',
    '',
    'Te piden el sexto plan. Nadie te cree.',
  ],

  // Narración en la celda (al evaluar la situación).
  cellNarration: [
    'La economía de Paicio lleva una década atada a la inflación pasada: los precios de hoy se calculan sobre los precios de ayer, que se calcularon sobre los de antes de ayer. Es una serpiente que se muerde la cola.',
    'Cinco ministros intentaron romper el ciclo con congelamiento de precios. Cinco veces la inflación volvió peor. La gente ya no cree en ningún plan.',
    'Tu problema no es solo económico — es de credibilidad. Antes de elegir qué hacer, tienes que convencer a alguien de que esta vez es en serio.',
  ],

  negotiationIntro:
    'Nadie te cree. Cinco planes fracasaron antes que tú. Cada negociación empieza con la confianza por el piso. Vas a tener que ganártela.',
  policyIntro:
    'Tienes coalición. Pero la verdadera pregunta no es qué plan eliges, sino si alguien te cree cuando lo anuncies.',
  needAlliesWarning:
    'Con tu credibilidad por el piso, necesitas al menos 2 aliados. Sin respaldo, no hay plan que sobreviva.',

  // Configuración del ticker (inflación de canasta básica).
  ticker: {
    itemBase: 'Canasta básica',
    currency: 'Cruzeiros',
    precioInicial: 2400,
    tasaInflacion: 1.025, // factor por segundo (~2.5%, más agresiva)
    umbralCritico: 6000, // inflación crónica evidente
  },

  // Panel "¿qué pasó en la historia real?".
  contextoHistorico: {
    titulo: 'Brasil, 1980-1994',
  },

  // Config del gráfico de tendencia del desenlace (cifras + comparación real).
  trendChart: {
    titulo: 'Inflación en Paicio',
    unidad: 'índice (inicio = 100)',
    ejeX: ['Mes 0', '3', '6', '9', '12', '18'],
    real: {
      cifra: '≈3.000%',
      cifraEtiqueta: 'inflación anual en el peak (Brasil, 1990)',
      nota: 'Durante más de una década los precios subieron sin control: la inflación anual llegó a casi 3.000% en 1990 y rondó el 2.500% en 1993. Brasil intentó seis planes para frenarla (Cruzado, Bresser, Verão, Collor I y II...) y todos fracasaron porque atacaban el síntoma, no la causa.',
    },
  },

  prisoners: [
    {
      id: 'ministro',
      name: 'Dr. Bresser',
      role: 'Ex Ministro de Hacienda de Paicio',
      portrait: '📋',
      accent: '#7D6608',
      gender: 'm',
      blurb:
        'Diseñó el plan anterior que fracasó. Sabe exactamente por qué falló, pero no lo admite en público. Tiene datos que necesitas.',
      utility: 'Quiere que no lo culpen del fracaso anterior.',
      concept: 'indexacionInercial',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 35, // Bajo — desconfía del sucesor.
      hostileNote:
        'Si lo traicionas, filtra a la prensa que tu plan es una copia del suyo y destruye tu credibilidad residual.',
      supportsPolicy: ['shock'],
      rejectsPolicy: ['gradual'],
      voice: {
        cooperate:
          '"Te paso mis archivos. El Plan Cruzado falló por el timing, no por el diseño. No repitas mi error."',
        betrayed:
          '"¿Me culpas a mí? Perfecto. Mañana la prensa sabrá que tu plan es una fotocopia del mío."',
      },
    },
    {
      id: 'indexador',
      name: 'Profesor Índice',
      role: 'Director del Instituto de Estadísticas de Paicio',
      portrait: '📊',
      accent: '#5B8DB8',
      gender: 'm',
      blurb:
        'La economía entera está atada a sus números. Cada contrato, cada salario, cada alquiler se ajusta por el índice que él publica. Es el engranaje invisible de la inercia.',
      utility: 'Quiere preservar la independencia del instituto.',
      concept: 'memoriaInflacionaria',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 40, // Cauteloso pero cooperador si lo respetas.
      hostileNote:
        'Si lo traicionas, publica índices que contradicen tu plan y destruye la narrativa oficial.',
      supportsPolicy: ['gradual'],
      rejectsPolicy: ['shock'],
      voice: {
        cooperate:
          '"La indexación es el problema, sí. Pero no la puedes matar por decreto. Te enseño cómo desactivarla de a poco."',
        betrayed:
          '"¿Quieren manipular el índice? Entonces publico los números reales yo solo. La verdad no se congela."',
      },
    },
    {
      id: 'empresario',
      name: 'Doña Fortuna',
      role: 'Presidenta de la Cámara de Industria de Paicio',
      portrait: '🏭',
      accent: '#27AE60',
      gender: 'f',
      blurb:
        'Ya no fija precios según costos — los sube preventivamente porque sabe que la inflación viene. Si todos hacen lo mismo, la profecía se cumple sola.',
      utility: 'Quiere reglas claras y un horizonte de más de 3 meses.',
      concept: 'expectativasAdaptativas',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 30, // Muy escéptica — quemada 5 veces.
      hostileNote:
        'Si la traicionas, remarca todos los precios un 40% preventivo y arrastra al sector privado.',
      supportsPolicy: ['gradual'],
      rejectsPolicy: ['defaultInterno'],
      voice: {
        cooperate:
          '"Le doy 90 días sin remarcar. Pero si este plan se cae como los otros, subo todo un 50% preventivo."',
        betrayed:
          '"¿Otro plan mágico? Mañana remarco todo un 40%. No me van a agarrar desprevenida otra vez."',
      },
    },
    {
      id: 'congreso',
      name: 'Senador Bloque',
      role: 'Presidente del bloque mayoritario en el Congreso de Paicio',
      portrait: '🏛️',
      accent: '#8E44AD',
      gender: 'm',
      blurb:
        'Controla los votos para aprobar cualquier reforma. No tiene ideología: tiene precio. Si la calle está en contra, él también.',
      utility: 'Quiere que el ajuste no caiga en año electoral.',
      concept: 'populismoFiscal',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 30, // Oportunista — muy difícil de conseguir.
      hostileNote:
        'Si lo traicionas, bloquea tu presupuesto en el Congreso y te deja gobernar sin plata.',
      supportsPolicy: ['shock'],
      rejectsPolicy: ['defaultInterno'],
      voice: {
        cooperate:
          '"Te doy los votos, pero nada de tocar jubilaciones antes de octubre. ¿Trato?"',
        betrayed:
          '"¿Me quieres hacer votar un ajuste en año electoral? Tu presupuesto muere en comisión."',
      },
    },
  ],

  policies: [
    {
      id: 'shock',
      letter: 'A',
      name: 'Otro shock heterodoxo',
      summary:
        'Congelar precios, salarios y tipo de cambio por decreto. El sexto intento.',
      effect: 'Alivio inmediato. La inflación desaparece... por un tiempo.',
      cost: 'Si falla otra vez, será la última gota. La credibilidad se agota para siempre.',
      impact: {
        inflacion: { fill: 4, label: 'Desaparece (¿por cuánto?)', good: null },
        empleo: { fill: 3, label: 'Estable', good: true },
      },
      inflationCurve: [100, 30, 18, 35, 70, 95],
      concept: 'indexacionInercial',
      supportedBy: ['ministro', 'congreso'],
      rejectedBy: ['indexador', 'empresario'],
      scores: {
        estabilidad: 40,
        empleo: 58,
        confianza: 25,
        crecimiento: 38,
      },
      headlineWin:
        'SEXTO PLAN: PAICIO CONGELA PRECIOS OTRA VEZ',
      headlineWeak:
        'EL CONGELAMIENTO SE DERRITE: LA INFLACIÓN VUELVE EN MESES',
      resultText:
        'Funciona 6 meses. Los supermercados bajan los precios, la gente respira. Pero los empresarios dejan de producir lo que venden a pérdida. Las góndolas se vacían. La inflación vuelve peor que antes. El sexto plan muere como los cinco anteriores.',
      history:
        'Brasil probó cinco planes de shock entre 1986 y 1991: Cruzado, Bresser, Verão, Collor I y Collor II. Todos congelaron precios por decreto. Todos funcionaron por meses. Todos fracasaron porque atacaban el síntoma (los precios) sin resolver la causa (la inercia indexatoria). El sexto intento nunca llegó: el Plan Real (1994) usó una estrategia completamente diferente.',
    },
    {
      id: 'gradual',
      letter: 'B',
      name: 'Plan gradual con ancla cambiaria',
      summary:
        'Desindexar la economía de a poco y usar el tipo de cambio como ancla antiinflacionaria.',
      effect: 'Requiere paciencia y credibilidad que no tienes.',
      cost: 'Si el mercado no te cree, el ancla se rompe y la inflación se come la transición.',
      impact: {
        inflacion: { fill: 3, label: 'Baja de a poco', good: true },
        empleo: { fill: 3, label: 'Aguanta', good: true },
      },
      inflationCurve: [100, 82, 60, 42, 30, 22],
      concept: 'memoriaInflacionaria',
      supportedBy: ['indexador', 'empresario'],
      rejectedBy: ['ministro'],
      scores: {
        estabilidad: 72,
        empleo: 55,
        confianza: 65,
        crecimiento: 58,
      },
      headlineWin:
        'PLAN GRADUAL: PAICIO DESATA LOS NUDOS DE LA INFLACIÓN',
      headlineWeak:
        'EL GRADUALISMO NO CONVENCE: EL MERCADO DUDA DEL ANCLA',
      resultText:
        'No hay magia ni congelamiento. Se desindexan los contratos de a uno, se ancla el tipo de cambio, se gana credibilidad milímetro a milímetro. Es lento y vulnerable, pero si funciona, es la base del plan que finalmente matará la inflación.',
      history:
        'El camino gradual anticipó la lógica del Plan Real (1994): en vez de congelar, crear una unidad de cuenta estable (la URV) que desindexara la economía voluntariamente. Cardoso entendió que el problema no eran los precios sino la memoria inflacionaria incrustada en cada contrato. Tu plan gradual sigue esa intuición, aunque en 1987 nadie tenía la credibilidad para ejecutarlo.',
    },
    {
      id: 'defaultInterno',
      letter: 'C',
      name: 'Default interno y reestructuración',
      summary:
        'Congelar depósitos, reestructurar la deuda interna y eliminar contratos indexados por la fuerza.',
      effect: 'Rompe la inercia de golpe.',
      cost: 'Confiscación de facto. La clase media pierde los ahorros. Colapsas la confianza.',
      impact: {
        inflacion: { fill: 2, label: 'Baja por shock', good: null },
        empleo: { fill: 1, label: 'Se desploma', good: false },
      },
      inflationCurve: [100, 55, 38, 30, 45, 60],
      concept: 'expectativasAdaptativas',
      supportedBy: [],
      rejectedBy: ['empresario', 'congreso'],
      scores: {
        estabilidad: 45,
        empleo: 30,
        confianza: 20,
        crecimiento: 28,
      },
      headlineWin:
        'PAICIO CONGELA DEPÓSITOS: EL GOBIERNO CONFISCA PARA SOBREVIVIR',
      headlineWeak:
        'CONFISCACIÓN SIN RESULTADO: EL DEFAULT INTERNO DESTRUYE LA CONFIANZA',
      resultText:
        'Congelas los depósitos como hizo Collor en 1990. La inflación baja un momento porque sacaste dinero de circulación. Pero la economía se paraliza, la gente pierde la confianza en los bancos para siempre, y el costo político es una condena.',
      history:
        'El Plan Collor (marzo 1990) congeló el 80% de todos los depósitos bancarios en Brasil de la noche a la mañana. Fue la confiscación más agresiva de la historia democrática brasileña. La inflación bajó temporalmente, pero la economía se paralizó y Collor terminó destituido por corrupción. La lección: atacar la liquidez no mata la inercia.',
    },
  ],
}
