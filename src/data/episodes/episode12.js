// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 12 — LA REGLA MONETARIA
// Referencia: Milton Friedman, 1976 · Premio Nobel de Economía
//
// Mecánica NUEVA: monetaryRule (política monetaria y expectativas). El
// jugador fija el crecimiento de la oferta monetaria cada ronda y ve cómo
// reacciona la economía con retardo. La lección: la discreción castiga, la
// regla estabiliza. Las expectativas adaptativas hacen que no exista un
// trade-off permanente entre inflación y desempleo.
//
// Cierra el arco Orígenes y enlaza con la línea de crisis (Chicago Boys,
// Ep3 — Chile 1982).
//
// Lógica en src/utils/monetaryRule.js, UI en MonetaryRule.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep12',
  numero: 5,
  line: 'origins',
  titulo: 'La Regla Monetaria',
  año: 1976,
  crisisHistorica: 'El fin de la gran inflación',
  paisReferencia: 'Estados Unidos',
  resumen:
    'La receta keynesiana dejó de funcionar: inflación y desempleo suben juntos. Friedman dice que el error es creer que puedes elegir entre uno y otro. Aprende por qué la regla vence a la discreción.',
  bloqueado: true,
  mechanic: 'monetaryRule',
  newspaper: {
    name: 'THE WALL STREET JOURNAL',
    dateline: 'NUEVA YORK, 8 de octubre de 1976',
    number: 'Vol. CLX',
    headline: '¿PREMIAR AL ENEMIGO DE LA INFLACIÓN? LA ACADEMIA SUECA DISTINGUE A FRIEDMAN',
    subhead:
      'Milton Friedman recibe el Nobel por su análisis del consumo, la historia monetaria y la complejidad de la política de estabilización. Su receta: una regla fija para la oferta de dinero.',
  },
  opening: [
    'Estados Unidos, 1976.',
    'La receta keynesiana de posguerra dejó de funcionar.',
    'Los precios suben y el desempleo también —',
    'estanflación, una palabra nueva para un problema nuevo.',
    '',
    'Un economista de Chicago dice que el error',
    'es creer que se puede "elegir" un poco más de inflación',
    'a cambio de menos desempleo.',
    '',
    'Milton Friedman te entrega la manija de la oferta monetaria.',
    'Y te reta: gánale a la inflación sin hundir el empleo.',
    'La trampa es tentadora — expandir da empleo hoy.',
    'El precio se paga después.',
  ],
  cellNarration: [
    'Friedman demostró que la inflación es siempre un fenómeno monetario. No los sindicatos, no los empresarios, no el petróleo: la causa última es que el banco central imprime demasiado dinero.',
    'Su propuesta: una regla monetaria. El banco central debe comprometerse a crecer la oferta de dinero a una tasa fija (k%) cada año, igual al crecimiento real de la economía. Sin discrecionalidad, sin política activa.',
    'La curva de Phillips (canje inflación/desempleo) no es un menú permanente: solo funciona por sorpresa, y a costa de expectativas más altas. Existe una tasa natural de desempleo; empujar por debajo con dinero solo compra empleo temporal e inflación permanente.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: null,
  contextoHistorico: { titulo: 'Chicago, 1976' },
  trendChart: null,
  prisoners: [],
  monetaryRule: {
    intro: 'Cada ronda fijas el crecimiento de la oferta monetaria. La economía reacciona con retardo: expandir da empleo hoy, pero las expectativas se ajustan y la inflación se paga después. La lección: la discreción castiga, la regla estabiliza.',
    rondas: 6,
    inflacionInicial: 11,
    desempleoInicial: 7,
    tasaNatural: 6,
    expectativa: 9,
    credibilidadInicial: 25,
  },
  eventos: [
    {
      ronda: 3,
      titulo: 'Presión Electoral',
      desc: 'El gobierno te pide expandir la oferta para bajar el desempleo antes de las elecciones. La tentación es grande.',
      efecto: { credibilidad: -8 },
    },
    {
      ronda: 5,
      titulo: 'Shock Petrolero',
      desc: 'La OPEP sube el precio del crudo. La inflación importada salta sola, sin que hayas movido la política monetaria.',
      efecto: { inflacion: 3 },
    },
  ],
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'reglaMonetaria',
      headlineWin: '¡INFLACIÓN BAJA Y ESTABLE! LA REGLA VENCE A LA DISCRECIÓN',
      resultText:
        'Convergiste a inflación baja y estable con desempleo en la tasa natural. Sostuviste la regla y ganaste credibilidad. Friedman asiente: "Descubriste lo que a los gobiernos les cuesta aceptar: el mejor timón es una regla, no una mano discrecional." La lección: la inflación es un fenómeno monetario; una regla creíble la doma.',
      scores: { estabilidad: 92, credibilidad: 88, empleo: 80 },
      history:
        'Friedman ganó el Nobel en 1976. Su recomendación: el banco central debe seguir una regla fija de crecimiento monetario (k%), igual al crecimiento real del PIB. Paul Volcker aplicó una versión de esto en 1979 para romper la inflación en EE.UU. — desempleo al 11%, pero inflación del 14% al 4%. El monetarismo fue matizado después (metas de inflación en vez de agregados), pero la lección central sobrevivió: la política discrecional genera inflación; la credibilidad y las reglas la controlan. Esta idea llegó a Chile con los Chicago Boys, que la aplicaron —con resultados controversiales— en la crisis de 1982.',
    },
    partial: {
      id: 'partial',
      concept: 'reglaMonetaria',
      headlineWin: 'BAJASTE LA INFLACIÓN PERO CON TUMBOS (STOP-GO)',
      resultText:
        'Lograste reducir la inflación, pero a los tumbos: acelerones y frenazos que costaron credibilidad y empleo. Friedman te mira con severidad: "Zigzagueaste. Cada freno y acelerón te costó confianza. La economía no es un coche de carreras: es un barco. Los cambios bruscos marean a todos."',
      scores: { estabilidad: 58, credibilidad: 55, empleo: 50 },
      history:
        'La crítica de Friedman a la política discrecional: los bancos centrales prometen estabilidad pero expanden en épocas electorales (ciclo político-económico stop-go). El resultado: inflación crónica sin reducción permanente del desempleo. La credibilidad es el activo más valioso de un banquero central.',
    },
    wrong: {
      id: 'wrong',
      concept: 'reglaMonetaria',
      headlineWin: 'ESTANFLACIÓN: INFLACIÓN ALTA + DESEMPLEO ALTO',
      resultText:
        'Intentaste explotar el canje expandiendo sin control. Terminaste con estanflación — inflación alta y desempleo alto a la vez, exactamente lo que la teoría keynesiana pura decía imposible. Friedman cierra su discurso: "Creíste que podías comprar empleo con inflación. El mercado aprendió tu truco. Bienvenido a los años setenta."',
      scores: { estabilidad: 22, credibilidad: 20, empleo: 25 },
      history:
        'La Gran Inflación de los 70 demostró que la curva de Phillips no es un menú permanente. Cuando los gobiernos intentaron explotar el canje inflación/desempleo, las expectativas se ajustaron y terminaron con lo peor de ambos mundos. Friedman predijo que esto pasaría. La lección: no hay almuerzo gratis en política monetaria. Hoy, la mayoría de los bancos centrales del mundo siguen metas de inflación — una versión más sofisticada de la regla de Friedman.',
    },
  },
  policies: [],
}
