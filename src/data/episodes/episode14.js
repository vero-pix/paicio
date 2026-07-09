// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 14 — PENSIONES: LA CUENTA QUE CRECE
// Referencia: Australia (Superannuation), Canadá (CPP), Suecia (AP7)
//
// Mecánica NUEVA: pensionReform. Sos ministro de finanzas y heredás un
// sistema de pensiones quebrado. Cada runda aplicás una reforma para
// acercar tu sistema a los modelos que sí funcionan en el mundo.
//
// La lección: los sistemas de pensiones no fallan por casualidad.
// Falla el diseño: comisiones altas, poca competencia, poca
// diversificación. Los países que lo hicieron bien tienen reglas
// simples y un Estado que regula, no que administra.
//
// Lógica en src/utils/pensionReform.js, UI en PensionReform.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep14',
  numero: 1,
  line: 'norte',
  titulo: 'La Cuenta que Crece',
  año: 2025,
  crisisHistorica: 'El diseño de las pensiones',
  paisReferencia: 'Modelos globales',
  resumen:
    'Australia, Canadá, Suecia: tres países donde las pensiones funcionan. Misma plata, resultados muy distintos. Descubrí qué hace la diferencia y construí un sistema que sí sirva.',
  bloqueado: true,
  mechanic: 'pensionReform',
  newspaper: {
    name: 'THE AUSTRALIAN',
    dateline: 'SIDNEY, 1 de julio de 1992',
    number: 'Vol. XXIX',
    headline: 'AUSTRALIA CREA EL AHORRO OBLIGATORIO: EL 9% DE TU SUELDO PARA TU JUBILACIÓN',
    subhead:
      'El gobierno instituye el Superannuation Guarantee. Todos los trabajadores tendrán una cuenta de ahorro individual, administrada por fondos sin fines de lucro. El cambio más profundo desde el sistema de salud.',
  },
  opening: [
    'Llegás al ministerio y te pasan el diagnóstico:',
    '',
    'La gente trabaja 40 años, ahorra obligatoriamente,',
    'y al final recibe una miseria.',
    'La culpa no es de la plata.',
    'Es del diseño.',
    '',
    'Australia, Canadá y Suecia hacen lo mismo',
    '— aporte obligatorio, capitalización individual —',
    'y les funciona.',
    '',
    '¿Qué tienen ellos que nosotros no?',
    'No es magia.',
    'Son reglas: comisiones bajas, competencia real,',
    'diversificación global y un Estado que regula bien.',
    '',
    'Tenés 8 reformas para transformar el sistema.',
    'El reloj corre.',
  ],
  cellNarration: [
    'Australia creó su Superannuation en 1992. Aporte obligatorio 12%, fondos sin fines de lucro (industry funds), comisiones bajas por ley, inversión global diversificada. Un trabajador australiano se jubila hoy con 2-3 veces lo que uno chileno con el mismo sueldo.',
    'Canadá tiene el CPP, administrado por una agencia pública independiente que invierte globalmente. Una de las tasas de reemplazo más altas del mundo desarrollado. Comisiones casi cero.',
    'La diferencia no está en la fórmula mágica. Está en las reglas: competencia real entre fondos, prohibición de comisiones excesivas, inversión global sin trabas, y un pilar solidario para los que no acumulan.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: null,
  contextoHistorico: { titulo: 'El diseño importa' },
  trendChart: null,
  prisoners: [],
  pensionReform: {
    intro: 'Heredás un sistema donde la gente aporta 40 años y recibe una fracción de lo que ahorró. Cada reforma que aplicás cambia las reglas. El objetivo es llegar a una tasa de reemplazo del 70% o más, sin quebrar el fisco ni perder a la gente.',
    rondas: 8,
    tasaInicial: 25,
    coberturaInicial: 60,
    costoFiscalInicial: 2,
    confianzaInicial: 20,
    fondoInicial: 60,
    reformsDisponibles: 6,
  },
  eventos: [
    {
      ronda: 3,
      titulo: 'Presión por retiro anticipado',
      desc: 'Un grupo político propone permitir retiros del 10% del fondo para "aliviar la economía". Popular, pero desangra el sistema.',
      efecto: { confianza: -10 },
    },
    {
      ronda: 5,
      titulo: 'Crisis de mercado',
      desc: 'Los mercados globales caen 20%. Los fondos de pensiones pierden valor. La gente se asusta.',
      efecto: { fondo: -15 },
    },
    {
      ronda: 7,
      titulo: 'Envejecimiento',
      desc: 'La población envejece. Cada vez menos activos sostienen a más jubilados. Urge tener un sistema sólido antes de que sea tarde.',
      efecto: { costoFiscal: 1 },
    },
  ],
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'pensiones',
      headlineWin: '¡SISTEMA DE PRIMER MUNDO! TASA DE REEMPLAZO SUPERIOR AL 70%',
      resultText:
        'Aplicaste las reformas correctas en el orden correcto. Comisiones bajas, competencia real, diversificación global, pilar solidario. El sistema que diseñaste se parece al australiano, al canadiense, al sueco. La gente se jubila con dignidad. El fisco no quiebra. Y los políticos no pueden meterle mano porque las reglas están escritas en piedra.',
      scores: { tasaReemplazo: 92, cobertura: 88, confianza: 85 },
      history:
        'Australia (Super Guarantee, 1992) es el caso más exitoso de reforma previsional moderna. En 30 años acumuló AUD$3.5 billones en fondos, equivalentes al 150% del PIB. Las claves: aporte obligatorio escalonado hasta 12%, industria funds sin fines de lucro, comisiones reguladas por ley, inversión global sin restricciones, y un sistema de cuentas individuales con portabilidad total. No es magia: son reglas.',
    },
    partial: {
      id: 'partial',
      concept: 'pensiones',
      headlineWin: 'MEJORASTE EL SISTEMA, PERO SIN LLEGAR AL POTENCIAL',
      resultText:
        'Lograste avances, pero te faltó una reforma clave. Tal vez dejaste las comisiones muy altas, o no te atreviste a diversificar globalmente. El sistema es mejor que antes, pero no alcanza el nivel de los países que sí funcionan. La gente jubilada está mejor, pero no bien.',
      scores: { tasaReemplazo: 58, cobertura: 65, confianza: 50 },
      history:
        'Medio camino es peligroso en pensiones. Canadá hizo su reforma en dos etapas: primero subió aportes, después creó el CPP Investment Board con mandato de inversión global independiente. La clave fue hacer las dos cosas, no solo una.',
    },
    wrong: {
      id: 'wrong',
      concept: 'pensiones',
      headlineWin: 'EL SISTEMA NO AGUANTÓ LA REFORMA',
      resultText:
        'No lograste transformar el sistema. Las reformas fueron insuficientes, mal aplicadas o bloqueadas por la presión política. La gente sigue jubilándose con una fracción de lo que ahorró. El sistema es insostenible y la próxima generación pagará la cuenta.',
      scores: { tasaReemplazo: 25, cobertura: 40, confianza: 20 },
      history:
        'Argentina intentó múltiples reformas previsionales entre 1994 y 2008: sistema mixto, luego estatización, luego vuelta atrás. Cada reforma parcial sin visión de largo plazo terminó empeorando el sistema. La lección: las pensiones no se arreglan con parches. Se arreglan con un diseño completo que trascienda los gobiernos.',
    },
  },
  policies: [],
}
