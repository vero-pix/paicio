// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 2 — EL CORRALITO DE PAICIO
// Referencia: Argentina 2001 · Crisis: Corrida bancaria y congelamiento
//
// Misma estructura que episode1.js. Componentes leen de aquí sin cambios.
//
// Mecánica: CORRIDA BANCARIA (juego de coordinación). El jugador contiene el
// pánico a lo largo de 5 días manejando reservas y confianza. Los 4 personajes
// reaccionan como asesores. Lógica en src/utils/bankRun.js, UI en BankRun.jsx.
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

  // Mecánica central del episodio (ver src/utils/bankRun.js).
  mechanic: 'bankRun',

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

  // Config del gráfico de tendencia del desenlace (cifras + comparación real).
  trendChart: {
    titulo: 'Crisis del peso en Paicio',
    unidad: 'índice de inestabilidad (inicio = 100)',
    ejeX: ['Mes 0', '3', '6', '9', '12', '18'],
    real: {
      cifra: '−75%',
      cifraEtiqueta: 'cayó el peso frente al dólar (2001-02)',
      nota: 'Argentina rompió la paridad 1-a-1 con el dólar: pasó de $1 a casi $4. El corralito congeló los ahorros (límite de $250 por semana), el PIB cayó cerca de 11% en 2002 y la pobreza saltó del 26% al 57%. Declaró el mayor default soberano de la historia hasta entonces: unos US$100.000 millones.',
    },
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

  // ── MECÁNICA DE CORRIDA BANCARIA ───────────────────────────────────────
  // Config leída por BankRun.jsx / bankRun.js. El jugador maneja reservas y
  // confianza durante `dias` días, eligiendo una acción por día.
  bankRun: {
    intro:
      'La gente corre a sacar su plata. Mientras más corren, menos reservas quedan; y mientras menos reservas, más corren. Tu trabajo: cortar el pánico antes de que los bancos se queden secos. Tienes 5 días.',
    dias: 5,
    reservasIniciales: 100,
    confianzaInicial: 42,
    presionBase: 30, // retiro base cuando la confianza es 0
    umbralCalma: 60, // confianza necesaria para "calmar" la corrida
    freezeFactor: 0.3, // el corralito multiplica el retiro por esto
    acciones: [
      {
        id: 'garantia',
        name: 'Garantizar los depósitos',
        icon: '🛡️',
        desc: 'Anuncias que el Estado respalda cada peso. Devuelve la calma de golpe… si te creen.',
        confianza: 30,
        reservas: -4,
        usos: 1,
        advisor: 'banquero2',
        reaccion:
          '"Por fin algo sensato, ministro. Con respaldo estatal de verdad, la gente deja de correr."',
      },
      {
        id: 'corralito',
        name: 'Imponer el corralito',
        icon: '🔒',
        desc: 'Limitas los retiros por decreto. Frena la sangría de reservas, pero la gente se siente atrapada.',
        confianza: -22,
        reservas: 0,
        usos: 1,
        advisor: 'vecina',
        reaccion:
          '"¿Mi plata atrapada adentro? ¡Es un robo! Esta noche volvemos con las cacerolas, ministro."',
      },
      {
        id: 'fmi',
        name: 'Abrir la línea del FMI',
        icon: '🌐',
        desc: 'Traes dólares frescos a las reservas, a cambio de condiciones que la calle detesta.',
        confianza: -8,
        reservas: 32,
        usos: 1,
        advisor: 'acreedor',
        reaccion:
          '"Liberamos el crédito. Pero esperamos disciplina fiscal a cambio. Nada de sorpresas."',
      },
      {
        id: 'calmar',
        name: 'Hablarle al país',
        icon: '📣',
        desc: 'Sales en cadena nacional a dar calma. Funciona la primera vez; después, cada vez menos.',
        confianza: 12,
        reservas: 0,
        decae: true,
        advisor: 'gobernador',
        reaccion:
          '"Palabras bonitas, ministro. Pero acá en la provincia ya imprimimos Patacones por las dudas."',
      },
    ],
  },

  // ── CARTAS DE EVENTO ("shocks" tipo Reigns) ────────────────────────────
  // Capa de game loop: al inicio de algunos días cae una carta que golpea los
  // medidores (reservas / confianza) por el mismo clamp. ~50% por día, sin
  // reemplazo. Sin `iconKey` → EventCard usa el emoji de `icon` (arte pendiente).
  eventos: [
    {
      id: 'riesgoPais',
      titulo: 'El riesgo país se dispara',
      texto: 'Los bonos de Paicio se desploman. Los mercados dan por muerta la convertibilidad.',
      icon: '📉',
      efecto: { confianza: -8 },
    },
    {
      id: 'cacerolazo',
      titulo: 'Cacerolazo nacional',
      texto: 'Miles salen a golpear ollas frente al Congreso. "¡Que se vayan todos!", gritan.',
      icon: '🍳',
      efecto: { confianza: -10 },
    },
    {
      id: 'patacones',
      titulo: 'Las provincias emiten su cuasi-moneda',
      texto: 'Sin pesos para pagar sueldos, las provincias imprimen bonos propios. El peso pierde piso.',
      icon: '🎫',
      efecto: { confianza: -6 },
    },
    {
      id: 'fugaCapitales',
      titulo: 'Fuga de capitales al exterior',
      texto: 'Los grandes depositantes giran su plata a Montevideo antes de que sea tarde.',
      icon: '🛫',
      efecto: { reservas: -12 },
    },
    {
      id: 'rumorPeso',
      titulo: 'Rumor: pesificarán los depósitos en dólares',
      texto: 'Corre la voz de que los ahorros en dólares se devolverán en pesos devaluados. Pánico.',
      icon: '💵',
      efecto: { confianza: -11 },
    },
    {
      id: 'exportaciones',
      titulo: 'Repunte de exportaciones',
      texto: 'La cosecha récord entra dólares frescos a las arcas y da un respiro de calma.',
      icon: '🌾',
      efecto: { reservas: 8, confianza: 3 },
    },
    {
      id: 'feriado',
      titulo: 'La banca pide un feriado bancario',
      texto: 'Cerrar las ventanillas un día frena la sangría… pero confirma a todos que algo anda muy mal.',
      icon: '🚪',
      opciones: [
        {
          label: 'Declarar el feriado',
          efecto: { reservas: 6, confianza: -8 },
          replica: 'Las reservas dejan de sangrar por hoy, pero la fila del lunes será el doble.',
        },
        {
          label: 'Mantener los bancos abiertos',
          efecto: { confianza: 4, reservas: -6 },
          replica: 'La gente ve las puertas abiertas y respira… pero igual se lleva lo suyo.',
        },
      ],
    },
    {
      id: 'blindaje',
      iconKey: 'fmi',
      titulo: 'El FMI ofrece un blindaje',
      texto: 'Un megapréstamo para reforzar las reservas, a cambio de un ajuste que la calle detesta.',
      icon: '🌐',
      opciones: [
        {
          label: 'Aceptar el blindaje',
          efecto: { reservas: 16, confianza: -6 },
          replica: 'Las arcas se llenan de dólares prestados. La calle ya afila las cacerolas.',
        },
        {
          label: 'Rechazarlo',
          efecto: { confianza: 3 },
          replica: 'Sin ayuda de afuera y sin condiciones. Lo resolvemos solos… o no.',
        },
      ],
    },
  ],

  // Desenlaces por nivel (formato común a las mecánicas no-PD; ver Outcome.jsx).
  outcomes: {
    // Calmó la corrida sin congelar: confianza alta y sin corralito.
    perfect: {
      id: 'perfect',
      concept: 'corridaBancaria',
      headlineWin:
        'PAICIO CALMA LA CORRIDA: LOS BANCOS REABREN SIN CONGELAR LOS AHORROS',
      resultText:
        'Mantuviste la confianza alta y el pánico se apagó solo. Cuando la gente creyó que su plata estaba segura, dejó de correr a sacarla — y al dejar de correr, quedó segura de verdad. Cortaste la profecía autocumplida sin atrapar el ahorro de nadie.',
      scores: { estabilidad: 82, empleo: 60, confianza: 88, crecimiento: 58 },
      inflationCurve: [100, 80, 55, 38, 28, 22],
      history:
        'Una corrida bancaria es un juego de coordinación: el banco es solvente si nadie corre, e insolvente si todos corren. Por eso existen los seguros de depósito (como el FDIC en EE.UU.): no tanto para pagar tras la quiebra, sino para que la quiebra nunca pase. Si la gente sabe que su plata está garantizada, no tiene motivo para correr.',
    },
    // Sobrevivió, pero con corralito o confianza baja.
    partial: {
      id: 'partial',
      concept: 'corridaBancaria',
      headlineWin:
        'EL CORRALITO CONTIENE EL PÁNICO, PERO ATRAPA LOS AHORROS DE MILLONES',
      resultText:
        'Sobreviviste, pero tuviste que cerrar la jaula: limitaste los retiros para frenar la sangría. Los bancos no quebraron, pero la gente quedó con su plata adentro y la bronca en la calle. Ganaste tiempo a cambio de confianza.',
      scores: { estabilidad: 52, empleo: 44, confianza: 35, crecimiento: 40 },
      inflationCurve: [100, 105, 110, 98, 90, 85],
      history:
        'El corralito argentino (diciembre de 2001) limitó los retiros a $250 por semana. Frenó la corrida, pero atrapó los ahorros de millones y desató los cacerolazos que tumbaron al gobierno. Es la paradoja del corralito: la medida que salva a los bancos es la misma que destruye la confianza en ellos.',
    },
    // Las reservas llegaron a cero: colapso.
    wrong: {
      id: 'wrong',
      concept: 'riesgoSoberano',
      headlineWin:
        'COLAPSO BANCARIO: PAICIO SE QUEDA SIN RESERVAS Y LOS BANCOS QUIEBRAN',
      resultText:
        'Las reservas llegaron a cero. Cuando el último dólar salió por la ventanilla, los bancos cerraron para siempre. La gente perdió sus ahorros, el sistema de pagos se paralizó y el país cayó en el caos que tratabas de evitar.',
      scores: { estabilidad: 18, empleo: 28, confianza: 12, crecimiento: 22 },
      inflationCurve: [100, 130, 175, 190, 180, 170],
      history:
        'Cuando una corrida se completa, no queda banco en pie: las reservas se agotan y hasta las instituciones solventes caen arrastradas por el pánico. Argentina llegó al borde en 2001; el costo final fue una caída del PIB de ~11% en 2002, pobreza del 57% y el mayor default soberano de la historia hasta entonces (~US$100.000 millones).',
    },
  },

  // Vacío: en modo mecánica no se usan políticas, pero Outcome lo referencia.
  policies: [],
}
