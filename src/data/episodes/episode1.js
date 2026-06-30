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
    'El presidente imprimió dinero para pagar la deuda de guerra. Los precios suben hora a hora.',
    'Te culparon a ti. Pero te necesita, y no puede admitirlo.',
    'Desde esta celda vas a negociar tu salida. Cuatro prisioneros, cuatro intereses. Necesitas al menos dos de tu lado.',
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
    unidad: 'índice (pico = 100)',
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

  policies: [
    {
      id: 'ancla',
      letter: 'A',
      name: 'Ancla monetaria dura',
      summary: 'Detener la emisión por completo y fijar el tipo de cambio al oro.',
      effect: 'Frena la inflación rápido.',
      cost: 'Recesión severa y desempleo alto durante 18 meses.',
      impact: {
        inflacion: { fill: 4, label: 'Frena en seco', good: true },
        empleo: { fill: 1, label: 'Se desploma', good: false },
      },
      inflationCurve: [100, 70, 40, 22, 14, 10],
      concept: 'ancla',
      supportedBy: ['fondo', 'marcos'],
      rejectedBy: ['rosa'],
      scores: { estabilidad: 88, empleo: 38, confianza: 72, crecimiento: 45 },
      headlineWin: 'EL MARCO SE DETIENE: PAICIO ATA SU MONEDA AL ORO',
      headlineWeak: 'AJUSTE A MEDIAS: EL ANCLA NO CONVENCE A LOS MERCADOS',
      resultText:
        'La inflación se frena en seco, pero las fábricas cierran y las filas de desempleados crecen. Paicio compra estabilidad al precio de un año y medio de dolor.',
      history:
        'En Alemania, el Rentenmark (noviembre 1923), respaldado en la tierra y luego en oro, detuvo la hiperinflación casi de inmediato. Funcionó porque vino con disciplina fiscal y respaldo creíble. El costo: recesión y desempleo. Tu ancla sigue esa misma lógica: dolor a cambio de credibilidad.',
    },
    {
      id: 'reforma',
      letter: 'B',
      name: 'Reforma monetaria gradual',
      summary:
        'Crear una moneda nueva —el Nuevo Marco de Paicio— con conversión controlada.',
      effect: 'Transición más lenta, pero menos trauma social.',
      cost: 'Requiere una credibilidad institucional que Paicio aún no tiene.',
      impact: {
        inflacion: { fill: 3, label: 'Baja de a poco', good: true },
        empleo: { fill: 3, label: 'Aguanta', good: true },
      },
      inflationCurve: [100, 86, 64, 44, 32, 26],
      concept: 'credibilidad',
      supportedBy: ['comerciante'],
      rejectedBy: ['fondo'],
      scores: { estabilidad: 70, empleo: 62, crecimiento: 64, confianza: 58 },
      headlineWin: 'NACE EL NUEVO MARCO: PAICIO APUESTA A LA CONFIANZA',
      headlineWeak: 'LA NUEVA MONEDA TAMBALEA: FALTA RESPALDO INSTITUCIONAL',
      resultText:
        'El Nuevo Marco convive un tiempo con el viejo. Si la gente cree, se estabiliza sin destruir el empleo. Si no cree, la nueva moneda se quema igual que la anterior.',
      history:
        'Una reforma monetaria gradual puede funcionar —como en parte hizo el Rentenmark al ganar confianza—, pero depende por completo de la credibilidad. Sin instituciones sólidas detrás, una moneda nueva no es más que papel con otro nombre. Tu apuesta vive o muere por la confianza.',
    },
    {
      id: 'control',
      letter: 'C',
      name: 'Control de precios + emisión controlada',
      summary: 'Fijar precios por decreto y limitar —sin detener— la emisión.',
      effect: 'Alivio inmediato.',
      cost: 'Colapso garantizado en 6 meses: mercado negro, escasez, crisis peor.',
      impact: {
        inflacion: { fill: 1, label: 'Sigue desbocada', good: false },
        empleo: { fill: 3, label: 'Estable (por ahora)', good: null },
      },
      inflationCurve: [100, 62, 40, 55, 82, 98],
      concept: 'indexacion',
      supportedBy: ['rosa'],
      rejectedBy: ['marcos', 'fondo', 'comerciante'],
      scores: { estabilidad: 30, empleo: 55, crecimiento: 28, confianza: 25 },
      headlineWin: 'PRECIOS CONGELADOS: ALIVIO HOY EN LAS CALLES DE PAICIO',
      headlineWeak: 'GÓNDOLAS VACÍAS: EL CONTROL DE PRECIOS YA HACE AGUA',
      resultText:
        'Por unas semanas, el pan vuelve a tener un precio. Luego desaparece de las góndolas: nadie vende a pérdida. El mercado negro florece y la crisis vuelve, peor.',
      history:
        'Los controles de precios sin frenar la emisión han fracasado una y otra vez —de Weimar a tantas economías después—. Atacan el síntoma (el precio) y no la causa (la emisión). El resultado típico: escasez, mercado negro y una crisis aún mayor cuando el dique cede.',
    },
  ],
}
