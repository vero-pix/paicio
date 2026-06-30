// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 2 — EL CORRALITO DE PAICIO
// Referencia: Argentina 2001 · Crisis: Corrida bancaria y congelamiento
//
// Misma estructura que episode1.js. Componentes leen de aquí sin cambios.
//
// Mecánica: dilema del prisionero estándar (igual que Ep1).
// Narrativa: negociación en dos frentes — bancos vs. gente en la calle.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep2',
  numero: 2,
  titulo: 'El Corralito de Paicio',
  año: 2001,
  crisisHistorica: 'Corrida bancaria y congelamiento de depósitos',
  paisReferencia: 'Argentina',
  resumen:
    'Los bancos cierran. La gente no puede sacar su plata. El presidente huyó.',
  bloqueado: false,

  // Periódico de la pantalla de celda.
  newspaper: {
    name: 'EL HERALDO DE PAICIO',
    dateline: 'PAICIO, 20 de diciembre de 2001',
    number: '№ 12.408',
    headline:
      'BANCOS CERRADOS: EL CORRALITO ATRAPA A MILLONES DE AHORRISTAS',
    subhead:
      'El presidente huyó en helicóptero. El Ministro de Economía queda a cargo del caos.',
  },

  // Texto de apertura (animado línea a línea).
  opening: [
    'Los bancos cerraron hace 48 horas.',
    'Hay gente golpeando las persianas con cacerolas.',
    'Tu cuenta bancaria existe, pero no puedes tocarla.',
    '',
    'El presidente se fue en helicóptero anoche.',
    'Te dejaron a cargo del Ministerio.',
    'No lo pediste. No lo querías.',
    '',
    'Tienes una sola semana antes de que explote todo.',
  ],

  // Narración en la celda (al evaluar la situación).
  cellNarration: [
    'La convertibilidad —un peso, un dólar— sostuvo la economía por una década. Pero era un espejismo: el país se endeudó en dólares que ya no puede pagar.',
    'Los bancos prestaron los depósitos en pesos como si fueran dólares. Ahora la gente quiere sus dólares y los bancos no los tienen.',
    'Desde esta oficina vacía vas a negociar con los que quedan. Cuatro actores, cuatro intereses cruzados. Necesitas al menos dos de tu lado.',
  ],

  negotiationIntro:
    'Dos frentes: los bancos quieren un rescate, la calle quiere su dinero. No puedes darle a los dos. Cada negociación es un Dilema del Prisionero.',
  policyIntro:
    'Tienes coalición. Es hora de definir qué hacer con la convertibilidad, la deuda y los depósitos atrapados.',
  needAlliesWarning:
    'Necesitas al menos 2 aliados para presentar un plan creíble. Sigue negociando.',

  // Configuración del ticker (simula la brecha cambiaria).
  ticker: {
    itemBase: 'Dólar libre',
    currency: 'Pesos',
    precioInicial: 1.0,
    tasaInflacion: 1.022, // factor por segundo (brecha crece ~2.2%)
    umbralCritico: 3.5, // devaluación visible
  },

  // Panel "¿qué pasó en la historia real?".
  contextoHistorico: {
    titulo: 'Argentina, 2001',
  },

  prisoners: [
    {
      id: 'banquero2',
      name: 'Don Salvatore',
      role: 'Presidente de la Asociación de Bancos de Paicio',
      portrait: '🏦',
      accent: '#8B6914',
      gender: 'm',
      blurb:
        'Prestó los depósitos de la gente y ahora no puede devolverlos. Habla de "riesgo sistémico" cuando quiere decir "sálvenme a mí primero".',
      utility: 'Quiere un rescate estatal sin auditoría.',
      concept: 'corridaBancaria',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 40,
      hostileNote:
        'Si lo traicionas, sacará capitales del país por la puerta trasera antes de que amanezca.',
      supportsPolicy: ['convertibilidad'],
      rejectsPolicy: ['default'],
      voice: {
        cooperate:
          '"Bien. Le abro los libros al Ministerio. Pero quiero garantía de que no nos dejan caer."',
        betrayed:
          '"¿Así juegan? Entonces esta noche muevo todo offshore. Suerte explicándole eso a la gente."',
      },
    },
    {
      id: 'vecina',
      name: 'Doña Carmen',
      role: 'Vocera de los ahorristas atrapados',
      portrait: '📢',
      accent: '#C0392B',
      gender: 'f',
      blurb:
        'Ahorró toda su vida para comprar su casa. Hoy el banco le dice que su plata "está pero no está". Golpea cacerolas desde las 8 de la noche.',
      utility: 'Quiere acceso inmediato a los depósitos.',
      concept: 'riesgoSoberano',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 45,
      hostileNote:
        'Si la traicionas, la calle se radicaliza. Los cacerolazos se convierten en saqueos.',
      supportsPolicy: ['default'],
      rejectsPolicy: ['convertibilidad'],
      voice: {
        cooperate:
          '"Le doy una semana, ministro. Una. Si mi plata no aparece, vuelvo con más gente."',
        betrayed:
          '"¿Otra vez nos mienten? Esta noche no va a quedar un banco con los vidrios enteros."',
      },
    },
    {
      id: 'acreedor',
      name: 'Mr. Whitfield',
      role: 'Representante de los acreedores internacionales',
      portrait: '💼',
      accent: '#2C3E50',
      gender: 'm',
      blurb:
        'Tiene bonos de Paicio por miles de millones. Si Paicio hace default, pierde todo. Si no lo hace, Paicio se hunde. Ambos lo saben.',
      utility: 'Quiere que Paicio siga pagando la deuda.',
      concept: 'convertibilidad',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 35,
      hostileNote:
        'Si lo traicionas, embargo de activos de Paicio en el exterior y cierre total del crédito.',
      supportsPolicy: ['convertibilidad'],
      rejectsPolicy: ['default'],
      voice: {
        cooperate:
          '"Podemos reestructurar, pero necesito un compromiso creíble de pago. Nada de moratorias unilaterales."',
        betrayed:
          '"Default unilateral. Perfecto. Nos vemos en los tribunales de Nueva York. Paicio no vuelve a pedir prestado en décadas."',
      },
    },
    {
      id: 'gobernador',
      name: 'Don Caudillo',
      role: 'Gobernador de la Provincia de Pampa Grande',
      portrait: '🏛️',
      accent: '#27AE60',
      gender: 'm',
      blurb:
        'Ya imprime su propia cuasi-moneda provincial: los "Patacones". No espera a que Buenos Aires resuelva nada.',
      utility: 'Quiere autonomía fiscal y legalizar los Patacones.',
      concept: 'cuasiMoneda',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 50,
      hostileNote:
        'Si lo traicionas, las provincias dejan de enviar impuestos al gobierno central.',
      supportsPolicy: ['dolarizacion'],
      rejectsPolicy: ['convertibilidad'],
      voice: {
        cooperate:
          '"Le entro. Pero las provincias necesitan oxígeno fiscal. Si me das eso, te doy los votos."',
        betrayed:
          '"¿Centralismo otra vez? Ya tengo mi moneda propia. Arréglense solos en la capital."',
      },
    },
  ],

  policies: [
    {
      id: 'default',
      letter: 'A',
      name: 'Default soberano + devaluación',
      summary:
        'Declarar la cesación de pagos, romper la convertibilidad y devaluar el peso.',
      effect: 'Libera presión fiscal y permite exportar.',
      cost: 'Colapso del poder adquisitivo. Los ahorros en pesos se evaporan.',
      impact: {
        inflacion: { fill: 1, label: 'Se dispara', good: false },
        empleo: { fill: 2, label: 'Cae fuerte', good: false },
      },
      inflationCurve: [100, 130, 175, 150, 110, 85],
      concept: 'riesgoSoberano',
      supportedBy: ['vecina'],
      rejectedBy: ['banquero2', 'acreedor'],
      scores: {
        estabilidad: 35,
        empleo: 42,
        confianza: 28,
        crecimiento: 55,
      },
      headlineWin:
        'PAICIO ROMPE CON EL DÓLAR: DEFAULT Y DEVALUACIÓN',
      headlineWeak:
        'DEFAULT SIN PLAN: LA DEVALUACIÓN APLASTA A LOS MÁS POBRES',
      resultText:
        'El peso se derrumba. Los que tenían ahorros en pesos pierden la mitad de la noche a la mañana. Pero las exportaciones renacen y en dos años la economía crece de nuevo. El dolor fue brutal, pero breve.',
      history:
        'Argentina declaró el default más grande de la historia en diciembre de 2001, seguido de una devaluación del 200%. El PIB cayó 11% en 2002, pero la economía creció a tasas chinas del 2003 al 2007. El default fue caótico, pero rompió la trampa de la convertibilidad y permitió una recuperación exportadora inesperadamente rápida.',
    },
    {
      id: 'dolarizacion',
      letter: 'B',
      name: 'Dolarización total',
      summary:
        'Eliminar el peso y adoptar el dólar estadounidense como moneda única.',
      effect: 'Mata la incertidumbre cambiaria de raíz.',
      cost: 'Paicio pierde toda soberanía monetaria. Sin moneda propia, no hay política monetaria.',
      impact: {
        inflacion: { fill: 4, label: 'Desaparece', good: true },
        empleo: { fill: 2, label: 'Se estanca', good: false },
      },
      inflationCurve: [100, 60, 30, 18, 12, 10],
      concept: 'convertibilidad',
      supportedBy: ['gobernador'],
      rejectedBy: ['vecina'],
      scores: {
        estabilidad: 80,
        empleo: 38,
        confianza: 70,
        crecimiento: 35,
      },
      headlineWin:
        'ADIÓS AL PESO: PAICIO ADOPTA EL DÓLAR',
      headlineWeak:
        'DOLARIZACIÓN A MEDIAS: EL PAÍS PIERDE SOBERANÍA SIN GANAR ESTABILIDAD',
      resultText:
        'El dólar llega. La inflación muere. Pero sin moneda propia, Paicio no puede devaluar para competir ni ajustar la política monetaria cuando venga la siguiente crisis. Ecuador lo hizo en 2000: la inflación desapareció, pero la pobreza tardó una década en bajar.',
      history:
        'Ecuador dolarizó en enero de 2000 tras una crisis bancaria catastrófica. La inflación cayó a un dígito, pero perdió toda flexibilidad monetaria. En las crisis siguientes, sin moneda que devaluar, el ajuste lo pagó el empleo. Argentina lo discutió en 2001 pero nunca lo ejecutó: el costo político era enorme y no tenían suficientes reservas.',
    },
    {
      id: 'convertibilidad',
      letter: 'C',
      name: 'Mantener la convertibilidad a toda costa',
      summary:
        'Defender el 1-a-1 con más ajuste fiscal, más deuda y más corralito.',
      effect: 'Evita la devaluación... por ahora.',
      cost: 'Cada mes que pasa la bomba crece. La recesión se profundiza y la calle estalla.',
      impact: {
        inflacion: { fill: 3, label: 'Controlada', good: true },
        empleo: { fill: 1, label: 'Se hunde', good: false },
      },
      inflationCurve: [100, 95, 88, 92, 105, 130],
      concept: 'corridaBancaria',
      supportedBy: ['banquero2', 'acreedor'],
      rejectedBy: ['vecina', 'gobernador'],
      scores: {
        estabilidad: 55,
        empleo: 25,
        confianza: 45,
        crecimiento: 20,
      },
      headlineWin:
        'EL 1-A-1 RESISTE: PAICIO APUESTA A LA CONVERTIBILIDAD',
      headlineWeak:
        'AJUSTE SIN FIN: LA CONVERTIBILIDAD ASFIXIA A PAICIO',
      resultText:
        'El tipo de cambio se sostiene, pero a costa de una recesión cada vez más profunda. Más ajuste, más desempleo, más enojo. Es como poner una tapa a una olla a presión: el estallido no desaparece, solo se posterga.',
      history:
        'La convertibilidad argentina (1991-2001) mantuvo 1 peso = 1 dólar durante una década. Funcionó para matar la hiperinflación, pero se convirtió en una camisa de fuerza: Argentina no podía devaluar para competir y se endeudó en dólares para financiar el déficit. Cuando los mercados dejaron de prestar, el sistema implosionó.',
    },
  ],
}
