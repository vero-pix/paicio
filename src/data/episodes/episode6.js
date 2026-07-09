// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 6 — EL EFECTO TEQUILA
// Referencia: México 1994 · Crisis: Fuga de capitales y devaluación
//
// Misma estructura que episode3.js. Reusa la mecánica speculativeAttack
// (defender la paridad) con sabor mexicano: el "error de diciembre", la
// presión de los Tesobonos y el rescate internacional más grande hasta
// entonces. Componentes leen de aquí sin cambios.
//
// Mecánica: DEFENDER LA PARIDAD (guerra de desgaste). El jugador resiste
// un ataque especulativo al peso manejando reservas y empleo, mientras
// la agitación política (Chiapas, Colosio) y los Tesobonos presionan.
// Lógica en src/utils/speculativeAttack.js, UI en SpeculativeAttack.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep6',
  numero: 6,
  line: 'crisis',
  titulo: 'El Efecto Tequila',
  año: 1994,
  crisisHistorica: 'Fuga de capitales y devaluación del peso',
  paisReferencia: 'México',
  resumen:
    'Las reservas se esfuman. El peso se hunde. El "error de diciembre" cambió la economía mexicana para siempre.',
  bloqueado: false,

  // Mecánica central del episodio (reusa speculativeAttack).
  mechanic: 'speculativeAttack',

  // Periódico: la devaluación estalla el 20 de diciembre de 1994.
  newspaper: {
    name: 'EL HERALDO DE PAICIO',
    dateline: 'PAICIO, 20 de diciembre de 1994',
    number: '№ 14.327',
    headline:
      'EL PESO SE DESPLOMA: LAS RESERVAS PERDIERON LA MITAD EN UNA SEMANA',
    subhead:
      'El nuevo gobierno devaluó en lo que ya llaman "el error de diciembre". El Tesoro de EE.UU. prepara un rescate de emergencia.',
  },

  // Texto de apertura (animado línea a línea).
  opening: [
    'El peso lleva meses bajo presión.',
    'Las tasas en EE.UU. subieron y el capital se fue.',
    'El gobierno mantuvo la paridad con promesas y Tesobonos.',
    '',
    'El lunes de diciembre todo explotó.',
    'Las reservas cayeron de 30 mil millones a 6 mil millones en días.',
    'El Secretario del Tesoro de EE.UU. llama:',
    'el rescate más grande de la historia sobre la mesa.',
    '',
    'Eres el nuevo Secretario de Hacienda.',
    'Heredaste el error de diciembre.',
  ],

  // Narración (al evaluar la situación).
  cellNarration: [
    'El gobierno de Salinas de Paicio mantuvo el tipo de cambio fijo con orgullo: era el símbolo de la modernidad. Pero el peso estaba sobrevaluado y nadie quería verlo.',
    'Los Tesobonos —bonos gubernamentales indexados al dólar— escondían la deuda real. Cuando las tasas de la Fed subieron, el capital extranjero huyó más rápido de lo que llegó.',
    'Las reservas se evaporaron. El nuevo gobierno devaluó el 20 de diciembre —y la confianza se fue con ellas. EE.UU. y el FMI armaron un rescate de $50 mil millones, el más grande de la historia hasta entonces.',
  ],

  negotiationIntro:
    'El peso arde. El capital huye. En las montañas de Chiapas hay una insurgencia, en las calles un magnicidio sin resolver y en los mercados una apuesta contra tu moneda.',
  policyIntro:
    'Tesobonos vencen, las reservas sangran, el FMI llama. Elige cómo salir de esta sin llevarte el país.',
  needAlliesWarning:
    'La confianza de los mercados no espera. Necesitas al menos 2 aliados para presentar un plan de rescate creíble.',

  // Configuración del ticker (paridad cambiaria).
  ticker: {
    itemBase: 'Dólar',
    currency: 'Pesos',
    precioInicial: 3.4,
    tasaInflacion: 1.025, // factor por segundo (brecha crece ~2.5%)
    umbralCritico: 7.0, // devaluación profunda
  },

  // Panel "¿qué pasó en la historia real?".
  contextoHistorico: {
    titulo: 'México, 1994-1995',
  },

  // Config del gráfico de tendencia del desenlace.
  trendChart: {
    titulo: 'Tipo de cambio en Paicio',
    unidad: 'pesos por dólar (inicio = 3.4)',
    ejeX: ['Sem 0', '2', '4', '6', '8', '12'],
    real: {
      cifra: '−104%',
      cifraEtiqueta: 'se devaluó el peso entre dic 1994 y mar 1995',
      nota: 'El "Efecto Tequila" comenzó cuando México devaluó el peso el 20 de diciembre de 1994. En dos días el país perdió la mitad de sus reservas. El tipo de cambio pasó de 3.4 a 7.9 pesos por dólar en cuestión de semanas. El rescate liderado por EE.UU. (unos $50.000 millones entre el Tesoro, el FMI y el BIS) evitó el default, pero la economía cayó en recesión y el "error de diciembre" marcó a la política mexicana por décadas.',
    },
  },

  prisoners: [
    {
      id: 'tesobono',
      name: 'Don Tesobono',
      role: 'Presidente de la Bolsa de Valores de Paicio',
      portrait: '💼',
      accent: '#8E44AD',
      gender: 'm',
      blurb:
        'Convenció al gobierno de emitir Tesobonos —deuda en dólares— para atraer capital. Ahora esos bonos vencen y si el gobierno paga en pesos devaluados, pierde todo. Si paga en dólares, quiebra.',
      utility: 'Quiere que el gobierno pague los Tesobonos al valor original en dólares.',
      concept: 'tesobonos',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 35,
      hostileNote:
        'Si lo traicionas, ejecuta la cláusula de aceleración de los Tesobonos y todos los bonos vencen mañana.',
      supportsPolicy: ['rescate'],
      rejectsPolicy: ['default'],
      voice: {
        cooperate:
          '"Los Tesobonos son deuda sagrada, ministro. Si no pagas, nadie vuelve a prestarle a Paicio. Te ayudo a reestructurar si me garantizas el pago."',
        betrayed:
          '"¿Default en los Tesobonos? Acabo de dar la orden: todos los bonos vencen mañana. Veremos cómo le explicas eso a los mercados."',
      },
    },
    {
      id: 'comerciante_mex',
      name: 'Doña Tequila',
      role: 'Presidenta del Consejo Exportador de Paicio',
      portrait: '🌵',
      accent: '#27AE60',
      gender: 'f',
      blurb:
        'Exporta agave, tequila, aguacate y auto-partes. Con el peso caro, sus productos no compiten afuera. Reza en silencio por una devaluación que ponga sus precios en el mapa global.',
      utility: 'Quiere que el peso se devalúe para que sus exportaciones despeguen.',
      concept: 'competitividadCambiaria',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 50,
      hostileNote:
        'Si la traicionas, cierra sus plantas y se lleva sus inversiones a Centroamérica.',
      supportsPolicy: ['default'],
      rejectsPolicy: ['rescate'],
      voice: {
        cooperate:
          '"Un peso caro es una losa para mis exportaciones. Si sueltas la paridad de forma ordenada, te prometo que aguanto la inversión y el empleo."',
        betrayed:
          '"¿Otra vez a defender un peso que no vale lo que marca? Cierro la planta de Toluca y me voy a Guatemala. Ahí sí saben de tipo de cambio."',
      },
    },
    {
      id: 'politico_mex',
      name: 'Senador Oficial',
      role: 'Presidente de la Comisión de Hacienda del Congreso de Paicio',
      portrait: '🏛️',
      accent: '#C0392B',
      gender: 'm',
      blurb:
        'Del partido de siempre. Su prioridad: que la crisis no le cueste las elecciones de medio término. Sabe que la devaluación es necesaria, pero no quiere ponerle su firma.',
      utility: 'Quiere que el costo político del ajuste lo pague otro.',
      concept: 'populismoCambiario',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 40,
      hostileNote:
        'Si lo traicionas, bloquea el presupuesto de emergencia y te deja sin herramientas fiscales.',
      supportsPolicy: ['rescate'],
      rejectsPolicy: ['default'],
      voice: {
        cooperate:
          '"Te doy los votos para el rescate, pero el ajuste empieza después de las elecciones. Me juego mi curul por esto."',
        betrayed:
          '"¿Quieres que vote un ajuste en año político? Olvídalo. Que el FMI pague la cuenta — para eso están."',
      },
    },
    {
      id: 'fmi_mex',
      name: 'Mr. Treasury',
      role: 'Subsecretario del Tesoro de los Estados Unidos',
      portrait: '🇺🇸',
      accent: '#2C3E50',
      gender: 'm',
      blurb:
        'Llegó de Washington con una carpeta bajo el brazo: $50 mil millones en rescates, garantías y líneas de crédito. Pero todo viene con condiciones que huelen a ajuste.',
      utility: 'Quiere que Paicio firme un programa de reformas estructurales.',
      concept: 'rescateInternacional',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 30,
      hostileNote:
        'Si lo traicionas, el rescate se congela y Paicio queda fuera de los mercados internacionales.',
      supportsPolicy: ['rescate'],
      rejectsPolicy: ['default'],
      voice: {
        cooperate:
          '"El Presidente Clinton autorizó el rescate. Pero necesito reformas: disciplina fiscal, independencia del banco central y apertura financiera. ¿Trato?"',
        betrayed:
          '"Sin condiciones no hay fondos. Que el Congreso de Paicio explique por qué rechazó 50 mil millones."',
      },
    },
  ],

  // ── MECÁNICA DE DEFENSA DE LA PARIDAD ──────────────────────────────────
  // Config leída por SpeculativeAttack.jsx / speculativeAttack.js.
  // Reusa la misma lógica de guerra de desgaste que Chile (episodio 3).
  speculativeAttack: {
    intro:
      'El peso de Paicio está sobrevaluado y el mercado lo huele. Los Tesobonos vencen, la Fed sube tasas y el capital huye más rápido de lo que llega. Cada día el ataque especulativo se vuelve más feroz. Defender la paridad quema reservas o empleo. El rescate internacional puede darte aire, pero solo tú decides cuándo soltar.',
    dias: 6,
    reservasIniciales: 100,
    empleoInicial: 70,
    ataqueBase: 16, // presión inicial más alta que Chile (crisis más súbita)
    ataqueRamp: 7, // el ataque escala más rápido
    recesionRonda: 2,
    minRondaOrdenada: 2,
    acciones: [
      {
        id: 'tasas',
        name: 'Subir las tasas de interés',
        icon: '📈',
        desc: 'Encarece atacar el peso y frena la fuga de capitales, pero estrangula el crédito y hunde el empleo.',
        ataqueMult: 0.42,
        empleo: -15,
        advisor: 'tesobono',
        reaccion:
          '"Tasas altas, dinero caro. Duele, pero es lo único que los mercados entienden. La alternativa es perder el peso."',
      },
      {
        id: 'intervenir',
        name: 'Vender reservas para sostener el peso',
        icon: '💵',
        desc: 'Quemas dólares comprando pesos para mantener la paridad. Funciona hoy, pero cada ronda cuesta más.',
        ataqueMult: 0.28,
        reservasCosto: 7,
        advisor: 'comerciante_mex',
        reaccion:
          '"Defienda el peso todo lo que quiera, ministro. Mientras más queme reservas, más caro será soltarlo después."',
      },
      {
        id: 'fmi',
        name: 'Activar el rescate del Tesoro',
        icon: '🌐',
        desc: 'El Tesoro de EE.UU. y el FMI inyectan dólares a las reservas a cambio de un ajuste que pesa sobre la economía real.',
        reservas: 36,
        empleo: -8,
        usos: 1,
        advisor: 'fmi_mex',
        reaccion:
          '"El paquete está autorizado: 50 mil millones en garantías y créditos. A cambio, Paicio firma la disciplina fiscal. Duele, pero sin esto no llegan a fin de semana."',
      },
      {
        id: 'devaluar',
        name: 'Soltar la paridad (devaluar)',
        icon: '⚖️',
        desc: 'Dejas que el peso flote. Termina el ataque de inmediato, pero si lo haces tarde o sin credibilidad, el pánico se come lo que queda.',
        advisor: 'politico_mex',
        reaccion:
          '"Suelte el peso, ministro. Duele ahora, pero es menos doloroso que quemar las últimas reservas en una guerra perdida."',
      },
    ],
  },

  // ── CARTAS DE EVENTO ("shocks" tipo Reigns) ────────────────────────────
  // Capa de game loop: al inicio de algunas rondas cae una carta que golpea
  // los medidores (reservas / empleo). ~50% por ronda, sin reemplazo.
  eventos: [
    {
      id: 'fed',
      titulo: 'La Fed sube las tasas de nuevo',
      texto: 'Alan Greenspan aprieta: el crédito internacional se encarece y los capitales golondrina huyen de Paicio.',
      icon: '📈',
      efecto: { reservas: -10 },
    },
    {
      id: 'chiapas',
      titulo: 'Se intensifica el conflicto en Chiapas',
      texto: 'El EZLN ocupa cabeceras municipales. La incertidumbre política espanta a los inversionistas.',
      icon: '⛰️',
      efecto: { reservas: -7 },
    },
    {
      id: 'colosio',
      titulo: 'Magnicidio en Paicio',
      texto: 'El candidato presidencial es asesinado en un mitin. Los mercados se congelan. El capital huye.',
      icon: '🕊️',
      efecto: { reservas: -14, empleo: -6 },
    },
    {
      id: 'tesobonosVencen',
      titulo: 'Vencen los Tesobonos',
      texto: 'Los bonos indexados al dólar vencen y el gobierno tiene que pagar. Si paga en dólares, las reservas se desploman.',
      icon: '📄',
      efecto: { reservas: -12 },
    },
    {
      id: 'fugaCapitales',
      titulo: 'Fuga masiva de capitales',
      texto: 'Los fondos de inversión retiran todo de Paicio en 48 horas. Las reservas se evaporan.',
      icon: '🛫',
      efecto: { reservas: -12 },
    },
    {
      id: 'petroleoSube',
      titulo: 'El petróleo repunta en los mercados',
      texto: 'El crudo mexicano sube 15% en una semana. Entran dólares frescos que dan un respiro a las reservas.',
      icon: '🛢️',
      efecto: { reservas: 8 },
    },
    {
      id: 'exportaRepunta',
      titulo: 'Repunta la exportación de agave',
      texto: 'La demanda de tequila se dispara por el Tratado de Libre Comercio y entran dólares a la economía real.',
      icon: '🌵',
      efecto: { empleo: 6, reservas: 3 },
    },
    {
      id: 'rescateLideres',
      iconKey: 'fmi',
      titulo: 'El G7 ofrece garantías',
      texto: 'Los países del G7 ofrecen una línea de crédito contingente. Da confianza a los mercados, a cambio de supervisión internacional.',
      icon: '🌐',
      opciones: [
        {
          label: 'Aceptar las garantías del G7',
          efecto: { reservas: 14, empleo: -4 },
          replica: 'Dólares frescos y un voto de confianza del mundo desarrollado. El ajuste viene incluido.',
        },
        {
          label: 'Rechazar la supervisión',
          efecto: { empleo: 3 },
          replica: 'Sin condiciones. Pagamos el rescate a nuestro ritmo, sin supervisión de nadie.',
        },
      ],
    },
    {
      id: 'fmiLinea',
      titulo: 'El FMI ofrece una línea de crédito rápido',
      texto: 'Dólares inmediatos sin condiciones previas, pero los mercados lo leerán como señal de desesperación.',
      icon: '🏦',
      opciones: [
        {
          label: 'Tomar la línea de crédito',
          efecto: { reservas: 12, empleo: -3 },
          replica: 'Respiramos hoy. Mañana los mercados empiezan a preguntarse qué sabes que no les dices.',
        },
        {
          label: 'Declinar y mostrar fortaleza',
          efecto: { confianza: 4 },
          replica: 'Sin ayuda de emergencia. Mandas la señal de que controlas la situación, aunque sea mentira.',
        },
      ],
    },
  ],

  // Desenlaces por nivel (formato común a las mecánicas no-PD).
  outcomes: {
    // Devaluación ordenada con rescate internacional y empleo protegido.
    perfect: {
      id: 'perfect',
      concept: 'ataqueEspeculativo',
      headlineWin:
        'PAICIO SUPERA EL EFECTO TEQUILA: DEVALUACIÓN ORDENADA CON RESCATE INTERNACIONAL',
      resultText:
        'Soltaste el peso a tiempo, activaste el rescate del Tesoro y los mercados —a regañadientes— lo aceptaron. La devaluación fue dolorosa pero ordenada: las exportaciones se reactivaron, el rescate de EE.UU. y el FMI dio el oxígeno necesario, y el país evitó el default. Pagaste el precio de la sobrevaluación, pero sin quemar todas las reservas en una guerra perdida.',
      scores: { estabilidad: 62, empleo: 58, confianza: 55, crecimiento: 65 },
      inflationCurve: [100, 105, 130, 145, 140, 135],
      history:
        'México devaluó el 20 de diciembre de 1994 y el peso pasó de 3.4 a 7.9 por dólar en semanas. El rescate liderado por EE.UU. —unos $50.000 millones del Tesoro, el FMI y el BIS— evitó el default soberano. El "Efecto Tequila" contagió a otros mercados emergentes (Argentina, Brasil), pero México se recuperó más rápido que en crisis anteriores, en parte porque la devaluación ordenada y el respaldo internacional funcionaron.',
    },
    // Sobrevivió, pero el rescate llegó tarde o la devaluación fue caótica.
    partial: {
      id: 'partial',
      concept: 'tesobonos',
      headlineWin:
        'PAICIO RESISTE A MEDIAS: LA DEVALUACIÓN LLEGÓ TARDE Y EL RESCATE NO TAPA EL AGUJERO',
      resultText:
        'Aguantaste la paridad hasta el límite y cuando soltaste ya era casi tarde. El rescate internacional llegó, pero la confianza estaba tan dañada que los dólares se fueron casi tan rápido como llegaron. Las reservas quedaron al mínimo, las tasas por las nubes y la economía se contrajo. Sobreviviste, pero apenas.',
      scores: { estabilidad: 40, empleo: 36, confianza: 32, crecimiento: 38 },
      inflationCurve: [100, 115, 160, 190, 185, 175],
      history:
        'México dilató la devaluación durante meses antes de diciembre de 1994, quemando reservas para sostener un peso insostenible. Cuando finalmente soltó, la devaluación fue abrupta: el dólar subió de 3.4 a 7.9 en semanas. El rescate de $50.000 millones evitó el colapso total, pero el PIB cayó 6% en 1995 y la inflación anual superó el 50%. Cada semana de demora en reconocer la sobrevaluación se pagó con más recesión.',
    },
    // Reservas agotadas: default y colapso económico.
    wrong: {
      id: 'wrong',
      concept: 'rescateInternacional',
      headlineWin:
        'COLAPSO DEL PESO: PAICIO QUEMA RESERVAS, PIERDE EL RESCATE Y CAE EN DEFAULT',
      resultText:
        'Peleaste hasta el último dólar por una paridad que nadie creía. Cuando las reservas llegaron a cero, el rescate internacional se retiró: no había nada que rescatar. El peso se hundió sin control, los Tesobonos explotaron, la deuda en dólares se volvió impagable y el default fue inevitable. El "error de diciembre" se convirtió en la década perdida de Paicio.',
      scores: { estabilidad: 15, empleo: 22, confianza: 12, crecimiento: 18 },
      inflationCurve: [100, 130, 200, 260, 280, 270],
      history:
        'La crisis mexicana de 1994-95 mostraba el costo de no soltar a tiempo: el país pasó de 3.4 a más de 7 pesos por dólar en caída libre, el PIB se contrajo 6%, la inflación superó 50% y los Tesobonos llevaron la deuda pública a niveles insostenibles. Si no hubiera llegado el rescate del Tesoro de EE.UU., el default habría sido inevitable. El "Efecto Tequila" se llama así porque el contagio se sintió en toda América Latina.',
    },
  },

  // Vacío: en modo mecánica no se usan políticas, pero Outcome lo referencia.
  policies: [],
}
