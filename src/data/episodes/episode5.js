// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 5 — EL PLAN REAL DE PAICIO
// Referencia: Brasil 1994 · Crisis: La oportunidad de terminar la
// inflación crónica de una vez.
//
// MECÁNICA ÚNICA: SECUENCIA CORRECTA.
// En vez de elegir 1 de 3 políticas, el jugador ordena 4 acciones.
// Solo la secuencia correcta produce el único final feliz del juego.
//
// El componente `SequenceChoice` reemplaza a `PolicyChoice` para este
// episodio. Se activa via `sequenceMode: true`.
//
// La evaluación del desenlace usa `sequences` en vez de `policies`:
// cada permutación posible mapea a un resultado (correcto, parcial, malo).
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep5',
  numero: 5,
  titulo: 'El Plan Real de Paicio',
  año: 1994,
  crisisHistorica: 'La oportunidad de terminar la inflación crónica',
  paisReferencia: 'Brasil',
  resumen:
    'Una última oportunidad. El truco no es congelar precios: es la secuencia correcta.',
  bloqueado: false,

  // Flag: este episodio usa SequenceChoice en vez de PolicyChoice.
  sequenceMode: true,

  // Periódico de la pantalla de celda.
  newspaper: {
    name: 'EL HERALDO DE PAICIO',
    dateline: 'PAICIO, 28 de febrero de 1994',
    number: '№ 11.087',
    headline:
      'INFLACIÓN DE 2.500% ANUAL: EL NUEVO MINISTRO JURA QUE ESTA VEZ ES DIFERENTE',
    subhead:
      'Cinco planes fracasaron. El Ministro de Hacienda tiene una idea que nadie entiende: una moneda de transición.',
  },

  // Texto de apertura (animado línea a línea).
  opening: [
    'Cinco planes fracasaron.',
    'Cruzado. Bresser. Verão. Collor I. Collor II.',
    'Todos congelaron precios. Todos fallaron.',
    '',
    'Tienes una idea diferente.',
    'No vas a congelar nada.',
    'Vas a crear una moneda nueva… antes de crear la moneda nueva.',
    '',
    'Si lo haces en el orden correcto, ganas.',
    'Por primera vez, la victoria total es posible.',
  ],

  // Narración en la celda (al evaluar la situación).
  cellNarration: [
    'El truco no es congelar precios — eso ya se intentó cinco veces. El truco es romper la inercia inflacionaria sin shock. ¿Cómo? Con una unidad de cuenta estable que conviva con la moneda vieja.',
    'La URV (Unidad Real de Valor) no es dinero — es un índice que la gente puede usar como referencia. Si los precios se fijan en URV y la URV es estable, la inflación del cruzeiro deja de importar.',
    'Pero el orden es todo. Si conviertes antes de que la gente migre, fracasas. Si anclas antes de estabilizar, fracasas. La secuencia es el plan.',
  ],

  negotiationIntro:
    'Aquí los prisioneros son aliados potenciales, no obstáculos. Necesitas respaldo político para ejecutar el plan. Pero primero, convéncelos de que esta vez es diferente.',
  policyIntro:
    'No eliges una política. Ordenas cuatro acciones. La secuencia correcta es tu único camino a la victoria.',
  needAlliesWarning:
    'Sin respaldo político, ni la mejor idea sobrevive. Necesitas al menos 2 aliados.',

  // Configuración del ticker (inflación mensual del cruzeiro).
  ticker: {
    itemBase: 'Canasta básica',
    currency: 'Cruzeiros Reais',
    precioInicial: 85000,
    tasaInflacion: 1.03, // factor por segundo (~3%, hiperinflación)
    umbralCritico: 200000, // inflación crónica visible
  },

  // Panel "¿qué pasó en la historia real?".
  contextoHistorico: {
    titulo: 'Brasil, 1994 — El Plan Real',
  },

  prisoners: [
    {
      id: 'economistaJoven',
      name: 'Dra. Larida',
      role: 'Economista que diseñó la URV',
      portrait: '📐',
      accent: '#27AE60',
      gender: 'f',
      blurb:
        'Diseñó la idea de la URV en un paper académico hace 10 años. Nadie la escuchó hasta ahora. Necesita respaldo político para ejecutarla.',
      utility: 'Quiere autonomía técnica sin interferencia política.',
      concept: 'unidadCuenta',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 2,
      initialTrust: 60,
      hostileNote:
        'Si la traicionas, renuncia públicamente y el plan pierde su cerebro técnico.',
      supportsPolicy: [],
      rejectsPolicy: [],
      voice: {
        cooperate:
          '"¡Por fin alguien entiende! La URV es la clave. Déjame ejecutar y prometo que esta vez funciona."',
        betrayed:
          '"¿Quieren modificar la URV por presión política? Entonces no es mi plan. Renuncio y publico por qué fallará."',
      },
    },
    {
      id: 'presidenteReal',
      name: 'El Presidente',
      role: 'Presidente de la República de Paicio',
      portrait: '🏛️',
      accent: '#8E44AD',
      gender: 'm',
      blurb:
        'Te dará autonomía total SI le garantizas que funciona. Es un académico metido a político: entiende la economía, pero necesita que los números cierren antes de arriesgar su capital político.',
      utility: 'Quiere resultados antes de las elecciones.',
      concept: 'reformaMonetaria',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 50,
      hostileNote:
        'Si lo traicionas, te saca del cargo y nombra a otro ministro que congele precios (sexto intento).',
      supportsPolicy: [],
      rejectsPolicy: [],
      voice: {
        cooperate:
          '"Te doy carta blanca. Pero si esto no funciona antes de octubre, te reemplazo y vamos al Plan Cruzado VI."',
        betrayed:
          '"Me arriesgué por tu idea y me fallaste. Mañana hay un nuevo ministro. ¿Quién quiere congelar precios?"',
      },
    },
    {
      id: 'puebloReal',
      name: 'Doña María',
      role: 'Representante de las asociaciones de consumidores',
      portrait: '🛒',
      accent: '#C0392B',
      gender: 'f',
      blurb:
        'Desconfía después de 5 planes fallidos. Ha visto cómo cada "nueva moneda" se convierte en papel inútil. No le pidas fe — muéstrale hechos.',
      utility: 'Quiere que los precios dejen de subir. Punto.',
      concept: 'confianzaPublica',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 35,
      hostileNote:
        'Si la traicionas, la gente se resiste a la nueva moneda y la URV fracasa por desconfianza.',
      supportsPolicy: [],
      rejectsPolicy: [],
      voice: {
        cooperate:
          '"No le creo, pero le doy una chance más. Si el pan tiene el mismo precio dos semanas seguidas, le creo."',
        betrayed:
          '"¿Otra moneda nueva? ¿Nos creen estúpidos? No voy a cambiar mis cruzeiros por más papel pintado."',
      },
    },
    {
      id: 'mercadoReal',
      name: 'Sr. Mercado',
      role: 'Director de la Bolsa de Valores de Paicio',
      portrait: '📊',
      accent: '#C9A24B',
      gender: 'm',
      blurb:
        'Apostará a favor o en contra de tu plan según tu credibilidad. Si cree que funciona, el capital fluye. Si duda, ataca la moneda.',
      utility: 'Quiere previsibilidad y reglas claras.',
      concept: 'anclaNominal',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 40,
      hostileNote:
        'Si lo traicionas, ataca la nueva moneda con especulación y fuerza una devaluación prematura.',
      supportsPolicy: [],
      rejectsPolicy: [],
      voice: {
        cooperate:
          '"Si el plan es creíble, apuesto a favor. El capital llega cuando hay reglas, no cuando hay discursos."',
        betrayed:
          '"Inconsistencia técnica. Vendemos todo. Que el mercado decida cuánto vale su moneda nueva."',
      },
    },
  ],

  // ── MECÁNICA DE SECUENCIA ──────────────────────────────────────────────
  // En vez de `policies`, el Ep5 usa `sequence`: 4 acciones que el jugador
  // debe ordenar. Solo una secuencia es correcta.

  sequence: {
    intro:
      'No eliges una política — ordenas cuatro acciones. El orden lo es todo. Arrastra las piezas a la secuencia correcta.',
    actions: [
      {
        id: 'urv',
        letter: '1',
        name: 'Crear la URV',
        description: 'Establecer la Unidad Real de Valor como referencia estable de precios.',
        icon: '📐',
      },
      {
        id: 'migrar',
        letter: '2',
        name: 'Migrar precios y salarios',
        description: 'Dejar que contratos, precios y salarios migren voluntariamente a la URV.',
        icon: '🔄',
      },
      {
        id: 'anclar',
        letter: '3',
        name: 'Anclar al dólar',
        description: 'Fijar la nueva moneda a una banda cambiaria atada al dólar.',
        icon: '⚓',
      },
      {
        id: 'convertir',
        letter: '4',
        name: 'Convertir la URV en el Real',
        description: 'Transformar la URV en la moneda definitiva: el Real de Paicio.',
        icon: '💰',
      },
    ],

    // Orden correcto: URV → migrar → anclar → convertir.
    correctOrder: ['urv', 'migrar', 'anclar', 'convertir'],
  },

  // Resultados según la secuencia elegida. Se evalúan por grado de acierto.
  sequenceOutcomes: {
    // Victoria total: secuencia perfecta.
    perfect: {
      id: 'perfect',
      headlineWin: 'EL REAL NACE: PAICIO VENCE LA INFLACIÓN POR PRIMERA VEZ EN UNA DÉCADA',
      resultText:
        'Lo hiciste en el orden correcto. La URV creó una referencia estable, la gente migró voluntariamente, el ancla cambiaria dio credibilidad, y el Real nació fuerte. La inflación que durante una década destruyó vidas cae del 2.500% al 8% en un año. Por primera vez, el pan cuesta lo mismo hoy que mañana.',
      scores: { estabilidad: 92, empleo: 75, confianza: 90, crecimiento: 80 },
      inflationCurve: [100, 60, 30, 15, 8, 5],
      history:
        'El Plan Real de Fernando Henrique Cardoso (julio 1994) es uno de los éxitos más elegantes de la historia económica. La URV no era dinero — era una unidad de cuenta estable que desindexó la economía voluntariamente. Cuando todos los precios ya estaban en URV, convertirla en el Real fue casi trivial. La inflación cayó del 2.500% al 22% en un año. La clave: la secuencia correcta.',
    },
    // Parcialmente correcto (2-3 en orden).
    partial: {
      id: 'partial',
      headlineWin: 'EL REAL LLEGA, PERO RENGUEA: LA SECUENCIA FALLÓ EN PARTE',
      resultText:
        'Casi. Tenías las piezas correctas pero el orden no fue exacto. La inflación baja, pero no muere. La nueva moneda llega débil, la gente desconfía, y el mercado ataca. Es mejor que los cinco planes anteriores, pero no es la victoria que el país necesitaba.',
      scores: { estabilidad: 58, empleo: 50, confianza: 48, crecimiento: 45 },
      inflationCurve: [100, 70, 50, 42, 38, 35],
      history:
        'Si el Plan Real hubiera invertido pasos — por ejemplo, convertir antes de que la gente migrara a la URV — habría sido otro Cruzado: una moneda nueva sin credibilidad. La genialidad del plan fue dejar que la desindexación fuera voluntaria y gradual. Sin eso, era otro decreto más.',
    },
    // Muy mal (0-1 en orden).
    wrong: {
      id: 'wrong',
      headlineWin: 'PLAN REAL FRACASA: LA SECUENCIA EQUIVOCADA DESTRUYE LA ÚLTIMA OPORTUNIDAD',
      resultText:
        'La secuencia fue incorrecta. Creaste una moneda nueva sin desindexar primero — exactamente lo que hicieron los cinco planes anteriores. La inflación devora al Real en semanas. Era la última oportunidad y la desperdiciaste. Paicio vuelve al cruzeiro y a la miseria inflacionaria.',
      scores: { estabilidad: 25, empleo: 35, confianza: 15, crecimiento: 20 },
      inflationCurve: [100, 50, 35, 55, 80, 100],
      history:
        'Cada plan de shock que fracasó en Brasil (1986-1991) cometió la misma versión de este error: crear una moneda nueva o congelar precios sin resolver la inercia subyacente. El Plan Real funcionó porque resolvió primero la causa (indexación inercial) y después cambió la moneda. El orden no era un detalle — era el plan.',
    },
  },

  // Políticas vacías (no se usan en modo secuencia, pero el Outcome
  // necesita acceso a `episode.policies` sin crashear).
  policies: [],
}
