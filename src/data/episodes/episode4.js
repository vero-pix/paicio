// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 4 — LA DÉCADA PERDIDA
// Referencia: Brasil 1980s · Crisis: Inflación crónica y planes fallidos
//
// Misma estructura que episode1.js. Componentes leen de aquí sin cambios.
//
// Mecánica: EXPECTATIVAS E INERCIA. La inflación se autocumple porque todos la
// esperan e indexan. El jugador debe bajar las expectativas construyendo
// credibilidad; los congelamientos rebotan (la trampa de los planes fallidos).
// Lógica en src/utils/expectations.js, UI en Expectations.jsx.
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

  // Mecánica central del episodio (ver src/utils/expectations.js).
  mechanic: 'expectations',

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

  // ── MECÁNICA DE EXPECTATIVAS E INERCIA ─────────────────────────────────
  // Config leída por Expectations.jsx / expectations.js.
  expectations: {
    intro:
      'La inflación de Paicio se autocumple: todos la esperan, la indexan en precios y salarios, y entonces ocurre. No puedes matarla por decreto: tienes que bajar las EXPECTATIVAS, y para eso necesitas algo que ningún ministro tuvo en seis años: que te crean.',
    rondas: 6,
    expectativasIniciales: 80,
    credibilidadInicial: 22,
    reboteCongelar: 32, // cuánto rebotan las expectativas tras un congelamiento
    umbralExito: 32, // expectativas por debajo = inercia rota
    credExito: 50, // credibilidad mínima para el éxito
    umbralColapso: 10, // credibilidad por debajo = otro plan fallido
    acciones: [
      {
        id: 'ajusteFiscal',
        name: 'Hacer el ajuste fiscal de verdad',
        icon: '✂️',
        desc: 'Recortas el déficit en serio. Construye credibilidad de a poco — la materia prima de cualquier plan que funcione.',
        cred: 14,
        exp: -4,
        advisor: 'congreso',
        reaccion:
          '"Te doy los votos para el ajuste… pero después de octubre, y que no se note demasiado. Año electoral, ministro."',
      },
      {
        id: 'congelar',
        name: 'Congelar los precios por decreto',
        icon: '❄️',
        desc: 'Alivio instantáneo: las expectativas caen de golpe. Pero si nadie te cree, rebotan peor al mes siguiente y tu credibilidad se hunde.',
        exp: -26,
        cred: -15,
        congela: true,
        advisor: 'empresario',
        reaccion:
          '"¿Otro congelamiento? La última vez me quedé con la mercadería a pérdida. Esta vez remarco antes de que se derrita."',
      },
      {
        id: 'urv',
        name: 'Crear una unidad de cuenta estable',
        icon: '📐',
        desc: 'Una referencia de valor estable (como la URV) desactiva la inercia sin congelar nada. Funciona mejor cuanto más creíble seas.',
        cred: 8,
        advisor: 'indexador',
        reaccion:
          '"Ah… una unidad de cuenta estable. Eso sí puede funcionar: no matas la indexación, la haces irrelevante."',
      },
      {
        id: 'desindexar',
        name: 'Desindexar los contratos de a poco',
        icon: '🔗',
        desc: 'Desatas, uno a uno, los contratos atados a la inflación pasada. Reduce la inercia y suma algo de credibilidad.',
        cred: 6,
        exp: -6,
        advisor: 'ministro',
        reaccion:
          '"Desindexar de a poco, sin congelar nada. Es lento, pero es lo único que no probamos todavía."',
      },
    ],
  },

  // ── CARTAS DE EVENTO ("shocks" tipo Reigns) ────────────────────────────
  // Capa de game loop: al inicio de algunas rondas cae una carta que golpea los
  // medidores (expectativas / credibilidad) por el mismo clamp. ~50% por ronda,
  // sin reemplazo. Subir expectativas es MALO; subir credibilidad es bueno.
  // Sin `iconKey` → EventCard usa el emoji de `icon` (arte pendiente).
  eventos: [
    {
      id: 'filtracion',
      titulo: 'Se filtra que tu plan copia al anterior',
      texto: 'La prensa publica que el "plan nuevo" es una fotocopia del que ya fracasó. Nadie te cree.',
      icon: '📰',
      efecto: { credibilidad: -8 },
    },
    {
      id: 'sindicatos',
      titulo: 'Los sindicatos exigen indexar salarios',
      texto: 'Piden atar los sueldos a la inflación pasada. Si cedes, la inercia se perpetúa sola.',
      icon: '✊',
      efecto: { expectativas: 8 },
    },
    {
      id: 'dolarParalelo',
      titulo: 'Salta el dólar paralelo',
      texto: 'En la calle el dólar vuela y todos ajustan sus precios al blue. La inflación se autoalimenta.',
      icon: '💵',
      efecto: { expectativas: 7 },
    },
    {
      id: 'remarcaje',
      titulo: 'Los empresarios remarcan preventivamente',
      texto: 'Suben precios "por las dudas", antes de que suba el resto. La profecía empieza a cumplirse.',
      icon: '🏷️',
      efecto: { expectativas: 8, credibilidad: -3 },
    },
    {
      id: 'senalFiscal',
      titulo: 'La prensa aplaude una señal fiscal',
      texto: 'Un recorte creíble sale en portada. Por una vez, alguien empieza a tomarte en serio.',
      icon: '📈',
      efecto: { credibilidad: 7 },
    },
    {
      id: 'reboteCongelamiento',
      titulo: 'Rebota un congelamiento anterior',
      texto: 'Los precios que estaban pisados se sueltan de golpe y saltan más alto que antes.',
      icon: '❄️',
      efecto: { expectativas: 10 },
    },
    {
      id: 'fmiGesto',
      titulo: 'El FMI pide un gesto de austeridad',
      texto: 'Un ajuste visible ahora te daría credibilidad de verdad, pero te cuesta capital político.',
      icon: '🌐',
      opciones: [
        {
          label: 'Hacer el gesto',
          efecto: { credibilidad: 10, expectativas: -2 },
          replica: 'Duele políticamente, pero por primera vez el mercado te mira distinto.',
        },
        {
          label: 'Postergarlo',
          efecto: { credibilidad: -4 },
          replica: 'Otra promesa para después. Ya nadie cuenta los "después".',
        },
      ],
    },
    {
      id: 'respaldoCongreso',
      titulo: 'El Congreso ofrece respaldo… con condiciones',
      texto: 'Te dan los votos, pero exigen no tocar el gasto electoral. Respaldo hoy, inercia mañana.',
      icon: '🏛️',
      opciones: [
        {
          label: 'Aceptar el respaldo',
          efecto: { credibilidad: 8, expectativas: 3 },
          replica: 'Tienes los votos y una foto de unidad, aunque el gasto siga corriendo.',
        },
        {
          label: 'Gobernar sin ellos',
          efecto: { credibilidad: -3 },
          replica: 'Sin el Congreso, cada anuncio pesa la mitad. Pero el plan es tuyo, entero.',
        },
      ],
    },
  ],

  // Desenlaces por nivel (formato común a las mecánicas no-PD; ver Outcome.jsx).
  outcomes: {
    // Rompió la inercia con credibilidad.
    perfect: {
      id: 'perfect',
      concept: 'memoriaInflacionaria',
      headlineWin:
        'PAICIO ROMPE LA INERCIA: LA INFLACIÓN CEDE SIN CONGELAR UN SOLO PRECIO',
      resultText:
        'No hubo magia ni congelamiento. Construiste credibilidad de a poco y desactivaste la inercia con una unidad de cuenta estable. Cuando la gente dejó de esperar inflación, dejó de indexarla — y la inflación cedió sola. Por primera vez en una década, el precio de mañana se parece al de hoy.',
      scores: { estabilidad: 88, empleo: 68, confianza: 82, crecimiento: 72 },
      inflationCurve: [100, 78, 55, 38, 27, 20],
      history:
        'La inflación crónica no vive en los precios — vive en las expectativas. Mientras todos esperan inflación, la indexan y la inflación se cumple sola. El Plan Real (1994) rompió ese círculo sin congelar nada: creó una unidad de cuenta estable (la URV) que desindexó la economía de forma voluntaria, una vez que el gobierno tenía credibilidad fiscal. Atacó la causa, no el síntoma.',
    },
    // Bajó a medias: faltó credibilidad para rematarla.
    partial: {
      id: 'partial',
      concept: 'expectativasAdaptativas',
      headlineWin:
        'LA INFLACIÓN BAJA A MEDIAS: FALTÓ CREDIBILIDAD PARA REMATARLA',
      resultText:
        'Avanzaste, pero te quedaste corto. La inflación bajó un poco y se estancó: la gente, todavía con un pie en la desconfianza, siguió indexando "por las dudas". Sin esa última pizca de credibilidad, la inercia no terminó de romperse.',
      scores: { estabilidad: 52, empleo: 50, confianza: 45, crecimiento: 48 },
      inflationCurve: [100, 86, 72, 64, 60, 56],
      history:
        'Las expectativas adaptativas hacen que la inflación de hoy dependa de la de ayer. Bajarlas un poco no basta: si la gente no cree del todo que el plan va a durar, sigue indexando por las dudas, y la inflación se estabiliza alta en vez de morir.',
    },
    // Otro plan fallido: credibilidad agotada o expectativas disparadas.
    wrong: {
      id: 'wrong',
      concept: 'indexacionInercial',
      headlineWin:
        'OTRO PLAN FRACASA: LAS EXPECTATIVAS SE DISPARAN Y LA CREDIBILIDAD SE AGOTA',
      resultText:
        'Buscaste el alivio rápido del congelamiento y la trampa se cerró: las expectativas rebotaron peor, la gente remarcó antes de que se derritiera, y tu credibilidad —ya escasa— se hizo polvo. El sexto plan muere como los cinco anteriores.',
      scores: { estabilidad: 22, empleo: 35, confianza: 15, crecimiento: 28 },
      inflationCurve: [100, 58, 40, 72, 110, 140],
      history:
        'Entre 1986 y 1991 Brasil congeló precios cinco veces (Cruzado, Bresser, Verão, Collor I y II). Cada congelamiento dio alivio por meses y después la inflación volvió peor, porque atacaba el síntoma sin tocar la inercia. Cada fracaso destruía más credibilidad, hasta que ningún anuncio servía. Repetir la receta fallida solo acelera el colapso.',
    },
  },

  // Vacío: en modo mecánica no se usan políticas, pero Outcome lo referencia.
  policies: [],
}
