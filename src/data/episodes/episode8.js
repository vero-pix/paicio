// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 8 — LA FÁBRICA DE ALFILERES
// Referencia: Adam Smith, 1776 · La Riqueza de las Naciones
//
// Mecánica NUEVA: pinFactory (demostración interactiva). El jugador guía
// a Adam Smith por una fábrica de alfileres del siglo XVIII, tomando
// decisiones sobre división del trabajo, entrenamiento, herramientas y
// organización. Cada paso revela una lección de economía clásica.
//
// No es una crisis — no hay medidores que se disparen ni fracaso
// catastrófico. Es una DEMOSTRACIÓN interactiva donde el "score" es
// cuántos alfileres produce la fábrica al final del recorrido.
//
// Lógica en src/utils/pinFactory.js, UI en PinFactory.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep8',
  numero: 1,
  line: 'origins',
  titulo: 'La Fábrica de Alfileres',
  año: 1776,
  crisisHistorica: 'El nacimiento de la economía moderna',
  paisReferencia: 'Escocia',
  resumen:
    'Acompaña a Adam Smith por una fábrica de alfileres y descubre por qué la división del trabajo cambió el mundo.',
  bloqueado: false,

  // Mecánica nueva: demostración interactiva de producción.
  mechanic: 'pinFactory',

  // Periódico — "panfleto" del siglo XVIII.
  newspaper: {
    name: 'THE EDINBURGH GAZETTE',
    dateline: 'EDIMBURGO, 9 de marzo de 1776',
    number: 'Vol. I',
    headline:
      '¡UN LIBRO QUE CAMBIARÁ LA ECONOMÍA!',
    subhead:
      'Adam Smith publica "Una Investigación sobre la Naturaleza y Causas de la Riqueza de las Naciones". El mundo no volverá a ser el mismo.',
  },

  // Texto de apertura.
  opening: [
    'Escocia, 1776.',
    'Un hombre camina por los callejones de Edimburgo.',
    'Lleva un manuscrito bajo el brazo.',
    'En sus páginas: una idea que cambiará el mundo.',
    '',
    'Adam Smith acaba de publicar',
    '"La Riqueza de las Naciones".',
    'Pero antes de teorizar, quiere ver cómo se hace realmente.',
    '',
    'Te ha pedido que lo lleves a una fábrica de alfileres.',
    'Acompáñalo.',
  ],

  // Narración.
  cellNarration: [
    'Antes de Smith, la gente pensaba que la riqueza venía del oro, la tierra o el ejército. Smith dijo: la riqueza viene del TRABAJO, y el trabajo se multiplica cuando se divide.',
    'En su libro famoso, describe una fábrica de alfileres donde 10 hombres, especializados, producen 48.000 alfileres al día — mientras que 10 hombres trabajando solos producirían apenas 200.',
    'Esta es la idea que explica por qué unas naciones son ricas y otras pobres. Y la vas a vivir tú mismo.',
  ],

  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',

  // No hay ticker — no es una crisis.
  ticker: null,

  contextoHistorico: {
    titulo: 'Escocia, 1776',
  },

  trendChart: null,

  // No hay prisioneros.
  prisoners: [],

  // ── MECÁNICA DE LA FÁBRICA DE ALFILERES ──────────────────────────────
  pinFactory: {
    intro: 'Adam Smith te acompaña por la fábrica. En cada paso, él te hará una pregunta. Tu respuesta decide cuánto aprende — y cuántos alfileres produce tu taller.',
    workers: 10,
    outputInicial: 200,
    pasos: 7,
  },

  eventos: [],

  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'divisionTrabajo',
      headlineWin:
        '¡48.000 ALFILERES POR DÍA! LA DIVISIÓN DEL TRABAJO EN SU MÁXIMA EXPRESIÓN',
      resultText:
        'Llevaste la fábrica a su máximo potencial: dividiste el trabajo, entrenaste a los trabajadores, compraste herramientas especializadas, organizaste el flujo y mecanizaste lo que pudiste. Adam Smith toma notas frenéticamente. "Esto", dice, "es la Riqueza de las Naciones". Tu fábrica produce 48.000 alfileres al día — 240 veces más que al principio.',
      scores: { produccion: 95, eficiencia: 90, aprendizaje: 92 },
      history:
        'Adam Smith escribió en 1776: "Un obrero solo, sin educación ni instrucción, difícilmente haría un alfiler al día. Pero cuando se divide el trabajo, diez hombres pueden hacer 48.000 alfileres al día". Smith usó este ejemplo para mostrar que la división del trabajo es la fuente de la prosperidad moderna. Hoy, la fábrica de alfileres es la metáfora fundacional de la economía.',
    },
    partial: {
      id: 'partial',
      concept: 'divisionTrabajo',
      headlineWin:
        'LA FÁBRICA PRODUCE BIEN, PERO SIN LLEGAR AL POTENCIAL DE SMITH',
      resultText:
        'Lograste organizar la fábrica mejor que al principio, pero te quedaste corto. Tal vez no invertiste en herramientas, o no entrenaste suficiente, o no mecanizaste. Smith ve el potencial, pero no la demostración completa. "La próxima vez", dice, "intentad la división total del trabajo".',
      scores: { produccion: 55, eficiencia: 50, aprendizaje: 60 },
      history:
        'Smith observó que la especialización multiplica la producción, pero requiere inversión en herramientas y entrenamiento. La fábrica que no invierte en sus trabajadores y sus máquinas nunca alcanza su potencial. Es una lección que aplica tanto a una fábrica de 1776 como a una startup de 2026.',
    },
    wrong: {
      id: 'wrong',
      concept: 'divisionTrabajo',
      headlineWin:
        'LA FÁBRICA SIGUE IGUAL: SMITH NO ENCUENTRA SU EJEMPLO',
      resultText:
        'Te dio miedo cambiar. Preferiste mantener el método tradicional en vez de dividir el trabajo, entrenar, invertir y mecanizar. Smith se va cortés pero decepcionado. "Tal vez en otra fábrica", murmura. Pero en su libro escribirá igual sobre la división del trabajo — solo que no tendrá tu ejemplo que mostrar.',
      scores: { produccion: 20, eficiencia: 30, aprendizaje: 20 },
      history:
        'Smith sabía que el cambio asusta. La división del trabajo requirió que los artesanos abandonaran su orgullo de hacer algo "completo" para hacer una sola tarea. Pero los que se negaron a cambiar fueron desplazados por los que sí lo hicieron. El progreso no espera a los que dudan.',
    },
  },

  policies: [],
}
