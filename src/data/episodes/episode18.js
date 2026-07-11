// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 18 — LA CUENTA DE TODOS  (línea Micro · numero 4)
// Referencia: externalidades / tragedia de los comunes. Ancla: un río (caladero)
// compartido del pueblo.
//
// Mecánica: externalityReg (regular). Pones el límite a la pesca cada temporada.
// Poco límite → mucha actividad pero el río colapsa; mucho límite → río sano
// pero economía muerta. El río es un stock que evoluciona.
//
// La lección: lo que conviene a cada uno (pescar al máximo) arruina a todos (el
// río se agota). El rol del Estado es internalizar ese costo con una regla.
//
// Lógica en src/utils/externalityReg.js, UI en ExternalityReg.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep18',
  numero: 4,
  line: 'micro',
  titulo: 'La Cuenta de Todos',
  año: 'hoy',
  crisisHistorica: 'El río compartido',
  paisReferencia: 'El río',
  resumen:
    'El río da de comer a todo el pueblo. A cada pescador le conviene sacar todo lo que pueda… y entre todos lo vacían. Tú pones el límite: cuida el río sin ahogar la economía.',
  bloqueado: false,
  mechanic: 'externalityReg',
  newspaper: null,
  opening: [
    'El río es de todos y de nadie.',
    'Todo el pueblo pesca ahí.',
    '',
    'A cada pescador le conviene sacar un pez más. Y otro. Y otro.',
    'Nadie quiere quedarse atrás… así que todos sacan al máximo.',
    '',
    'El problema: el río no aguanta el ritmo de todos juntos.',
    'Si nadie pone un límite, un día no queda nada para nadie.',
  ],
  cellNarration: [
    'Una externalidad es un costo (o beneficio) que tu decisión le pasa a otros sin que lo pagues. Cuando pescas de más, el costo —menos peces mañana— lo pagan todos, incluido tú, pero repartido. Como a cada uno le conviene sacar más, entre todos agotan el recurso: la tragedia de los comunes.',
    'El mercado solo no lo resuelve: nadie tiene incentivo a cuidar lo que es de todos. Por eso aparece el Estado con una regla —una cuota, un impuesto, un límite— que hace que cada uno "sienta" el costo que le pasa al resto. Eso se llama internalizar la externalidad.',
    'Pero la regla tiene su punto: demasiado límite mata la economía (nadie pesca), muy poco mata el recurso (el río colapsa). El buen regulador busca el equilibrio que sostiene el río Y el pan.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: {
    itemBase: 'La pesca del día',
    precioInicial: 40,
    currency: 'kg',
    tasaInflacion: 1,
    umbralCritico: 999999,
  },
  contextoHistorico: { titulo: 'El río, hoy' },
  trendChart: null,
  prisoners: [],
  // Config del verbo REGULAR. El río es un stock: se regenera (logística) y baja
  // por la presión de la actividad. El límite frena la actividad y la presión.
  externalityReg: {
    rondas: 5,
    rioInicial: 75,
    limiteInicial: 30,
    actividadMax: 20,
    factorPresion: 0.8,
    regenBase: 7,
    objetivo: { rioColapso: 25, rioSano: 45, actividadPerfect: 45, actividadPartial: 32 },
    eventos: [
      {
        ronda: 3,
        titulo: '🌵 Llega la sequía',
        desc: 'Baja el caudal: el río aguanta menos presión que antes. Cuídalo más.',
        rio: -15,
      },
      {
        ronda: 4,
        titulo: '🏭 Se instala una fábrica',
        desc: 'Una fábrica vierte al río sin dar pesca: se suma presión. Aprieta el límite o el río no da más.',
        rio: -12,
      },
    ],
  },
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'externalidades',
      headlineWin: '¡RÍO VIVO Y PUEBLO CON PAN! DOMASTE LA EXTERNALIDAD',
      resultText:
        'Mantuviste el río sano y la economía andando temporada tras temporada. Ese es el rol de la regla: hacer que cada pescador cargue con el costo que le pasa a los demás. Sin límite, lo que convenía a cada uno habría vaciado el río de todos.',
      scores: { estabilidad: 85, empleo: 86, confianza: 84, crecimiento: 82 },
      history:
        'La tragedia de los comunes (Hardin, 1968) explica por qué se sobreexplotan pesquerías, bosques y el aire: son de todos, así que nadie los cuida. La solución no es prohibir la actividad, sino ponerle un precio o un límite a la externalidad —cuotas de pesca, impuestos al carbono, permisos transables— para que el interés privado calce con el bien común. Elinor Ostrom ganó el Nobel mostrando que las comunidades también pueden autorregularse.',
    },
    partial: {
      id: 'partial',
      concept: 'externalidades',
      headlineWin: 'EL RÍO AGUANTÓ, PERO DEJASTE PLATA (O PECES) EN LA MESA',
      resultText:
        'El río sobrevivió, pero no encontraste el punto: o regulaste de más (poca pesca, economía apretada) o de menos (el río quedó al filo). Regular una externalidad es un equilibrio fino: cuidar el recurso sin ahogar la actividad que vive de él.',
      scores: { estabilidad: 60, empleo: 58, confianza: 62, crecimiento: 56 },
      history:
        'El límite óptimo iguala el beneficio de una unidad más de actividad con el daño que le causa al resto. Poco límite deja que la externalidad destruya el recurso; demasiado, sacrifica bienestar sin necesidad. Los sistemas de cuotas bien calibrados (como las pesquerías de Nueva Zelanda o Islandia) buscan justo ese balance.',
    },
    wrong: {
      id: 'wrong',
      concept: 'externalidades',
      headlineWin: 'EL RÍO COLAPSÓ — LA TRAGEDIA DE LOS COMUNES',
      resultText:
        'Sin un límite que frenara la sobrepesca, a cada uno le convino sacar más… hasta que no quedó nada para nadie. Así se agotan los recursos compartidos cuando nadie internaliza el costo que le pasa al resto. El río de todos terminó siendo el problema de todos.',
      scores: { estabilidad: 26, empleo: 24, confianza: 22, crecimiento: 20 },
      history:
        'Pasó de verdad: el bacalao de Terranova colapsó en 1992 por sobrepesca y nunca se recuperó del todo; con él se perdieron decenas de miles de empleos. El recurso "gratis" y de todos es justo el que más riesgo corre de agotarse. Sin reglas, la suma de decisiones individuales racionales produce un desastre colectivo.',
    },
  },
  policies: [],
}
