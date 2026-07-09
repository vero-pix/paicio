// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 10 — LA PLUSVALÍA
// Referencia: Karl Marx, 1867 · El Capital, Vol. I
//
// Mecánica NUEVA: surplusValue (equilibrio capital / moral obrera). El
// jugador dirige una fábrica textil y decide cuánto explota la fuerza de
// trabajo. Cada acción da capital a costa de la moral — o viceversa.
//
// La lección: la plusvalía es la diferencia entre el valor que crea el
// trabajador y el salario que recibe. El sistema capitalista se sostiene
// sobre esa diferencia.
//
// Lógica en src/utils/surplusValue.js, UI en SurplusValue.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep10',
  numero: 2,
  line: 'origins',
  titulo: 'La Plusvalía',
  año: 1867,
  crisisHistorica: 'El nacimiento de la explotación moderna',
  paisReferencia: 'Inglaterra',
  resumen:
    'Dirige una fábrica textil en Manchester y descubre cómo funciona la plusvalía: la diferencia entre lo que el trabajador produce y lo que recibe.',
  bloqueado: false,
  mechanic: 'surplusValue',
  newspaper: {
    name: 'THE MANCHESTER GUARDIAN',
    dateline: 'MANCHESTER, 14 de septiembre de 1867',
    number: 'Vol. IV',
    headline: '¡UN LIBRO QUE DENUNCIA EL CAPITALISMO!',
    subhead:
      'Karl Marx publica "El Capital" en Londres. Describe la explotación del trabajador como la base del sistema industrial.',
  },
  opening: [
    'Manchester, 1867.',
    'El humo de las chimeneas cubre la ciudad.',
    'El ruido de los telares nunca se detiene.',
    '',
    'Un hombre barbudo camina entre las fábricas.',
    'Se llama Karl Marx.',
    'Y está a punto de cambiar cómo entendemos el trabajo.',
    '',
    'Te ha pedido entrar a tu fábrica textil.',
    'Dice que quiere mostrarte algo.',
  ],
  cellNarration: [
    'Marx escribió que el capitalismo funciona así: el trabajador produce bienes que valen más de lo que recibe en salario. Esa diferencia es la PLUSVALÍA. El dueño se la queda.',
    'No es robo — es la base del sistema. El trabajador vende su fuerza de trabajo, el capitalista la usa para generar ganancia. Pero si la explotación es demasiado alta, los trabajadores se rebelan.',
    'Tu fábrica produce 100 libras de tela al día. Cada trabajador recibe 2 chelines. Pero produce 10 chelines en valor. ¿Te quedas con la diferencia o se la das al trabajador?',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: null,
  contextoHistorico: { titulo: 'Manchester, 1867' },
  trendChart: null,
  prisoners: [],
  surplusValue: {
    intro: 'Marx te observa dirigir la fábrica. Cada ronda puedes explotar más a tus obreros para acumular capital… o ceder para mantener la paz. El equilibrio entre ganancia y revolución es tu responsabilidad.',
    rondas: 6,
    capitalInicial: 100,
    produccionBase: 100,
    moralInicial: 60,
  },
  eventos: [
    {
      ronda: 2,
      titulo: '¡Ludismo!',
      desc: 'Un grupo de trabajadores rompe las máquinas nuevas. Creen que las máquinas les quitan el trabajo. El ánimo cae en toda la fábrica.',
      efecto: { moral: -15 },
    },
    {
      ronda: 4,
      titulo: 'El Manifiesto',
      desc: 'Circula un panfleto entre los obreros: "Proletarios del mundo, uníos!" Marx sonríe desde la esquina.',
      efecto: { moral: -10 },
    },
  ],
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'plusvalia',
      headlineWin: '¡ACUMULASTE CAPITAL SIN ROMPER LA FÁBRICA! LA PLUSVALÍA EN SU MÁXIMA EXPRESIÓN',
      resultText:
        'Lograste extraer la máxima plusvalía posible sin provocar una revuelta. Marx toma notas y asiente: "Esto es exactamente lo que describo en El Capital. El capitalista maximiza la plusvalía hasta el límite de la resistencia obrera. Así funciona el sistema." Tu fábrica generó una fortuna.',
      scores: { capital: 92, explotacion: 88, estabilidad: 75 },
      history:
        'Marx definió la plusvalía como el valor no pagado del trabajo del obrero. En 1867, un trabajador textil inglés producía 10 chelines diarios pero recibía 2. La diferencia de 8 chelines — la plusvalía — se la quedaba el dueño. Marx argumentó que esta explotación es inevitable en el capitalismo, pero que tiene un límite: cuando los trabajadores toman conciencia, el sistema tiembla. La economía posterior disputó la teoría del valor-trabajo, pero la pregunta sobre la distribución del ingreso sigue abierta.',
    },
    partial: {
      id: 'partial',
      concept: 'plusvalia',
      headlineWin: 'LA FÁBRICA SOBREVIVE, PERO LA PLUSVALÍA PODRÍA SER MAYOR',
      resultText:
        'Mantuviste la fábrica funcionando y acumulaste algo de capital, pero sin llegar al máximo potencial y con conflictos esporádicos. Marx te mira con curiosidad. "Te detuviste a medio camino. ¿Miedo a la revuelta? ¿O escrúpulos morales?" En cualquier caso, la plusvalía existe, y tú la ejerciste.',
      scores: { capital: 55, explotacion: 60, estabilidad: 50 },
      history:
        'La plusvalía no desaparece porque el dueño sea "bueno". En el sistema capitalista, la ganancia depende de pagar menos de lo que el trabajo produce. Marx diría que un capitalista moderado solo retrasa lo inevitable: la concentración del capital y la caída de la tasa de ganancia.',
    },
    wrong: {
      id: 'wrong',
      concept: 'plusvalia',
      headlineWin: 'LA FÁBRICA QUEBRÓ — O LOS OBREROS SE REBELARON — LA PLUSVALÍA SE ESFUMÓ',
      resultText:
        'Tu gestión de la plusvalía fracasó. Si explotaste demasiado, los trabajadores se levantaron y destruyeron la fábrica. Si fuiste muy blando, la fábrica quebró por falta de ganancia. Marx cierra su cuaderno. "La contradicción es clara: el capitalista necesita explotar para sobrevivir, pero el obrero necesita rebelarse para vivir. Esta tensión define nuestra época."',
      scores: { capital: 20, explotacion: 30, estabilidad: 15 },
      history:
        'Para Marx, el capitalismo lleva en sí mismo las semillas de su destrucción. La explotación genera resistencia. La resistencia genera represión. La represión genera revolución. La historia, decía, es la historia de la lucha de clases. Y tú acabas de vivirla en pequeño.',
    },
  },
  policies: [],
}
