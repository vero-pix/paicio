// ─────────────────────────────────────────────────────────────────────────
// Tutoriales de episodio — CAPA DE PRESENTACIÓN (onboarding).
//
// Textos del coach-mark por episodio, centralizados acá (como briefings.js) para
// no tocar src/data/episodes/*. Cada crisis puede tener su propio coach: cambia
// los captions/objetivo sin tocar la mecánica.
//
// - goalChip: recordatorio de meta siempre visible en la pantalla de decisión.
// - firstTurnHint: acción sugerida en el mes 1 (pulso "empieza por aquí").
// - steps[].target: clave del elemento REAL a resaltar (la mecánica mapea la
//   clave → ref). caption: máx 2 líneas.
// - event: paso contextual, la 1ª vez que aparece una carta de evento.
//
// Tono: chileno neutro, tuteo (nunca voseo).
// ─────────────────────────────────────────────────────────────────────────

export const EPISODE_TUTORIALS = {
  ep1: {
    goalChip: 'Consolida el máximo alivio… sin que reviente',
    steps: [
      {
        target: 'goal',
        caption: 'Eres el ministro. La imprenta te tienta con alivio fácil, pero cada uso acerca el colapso.',
      },
      {
        target: 'meters',
        caption: 'Imprimir sube el Alivio… y también el Riesgo de reventón. Si revienta, la moneda muere.',
      },
      {
        target: 'actions',
        caption: 'Imprime por más alivio, o corta y estabiliza para consolidar lo ganado antes del colapso.',
      },
    ],
  },

  ep2: {
    goalChip: 'Corta el pánico antes del día 5',
    firstTurnHint: { action: 'garantia', label: 'Empieza por aquí' },
    steps: [
      {
        target: 'meters',
        caption: 'Dos frentes: Reservas y Confianza. Si cualquiera llega a cero, los bancos caen.',
      },
      {
        target: 'actions',
        caption: 'Cada día eliges UNA medida. Tócala para ver su efecto antes de confirmar.',
      },
    ],
    event: {
      caption: '¡Imprevisto! Rumores y shocks caen al azar. Reacciona y sigue tu plan.',
    },
  },

  ep3: {
    goalChip: 'Suelta la paridad a tiempo',
    firstTurnHint: { action: 'intervenir', label: 'Defiende primero' },
    steps: [
      {
        target: 'meters',
        caption: 'Defender quema Reservas o Empleo. Si cualquiera se agota, la caída es caótica.',
      },
      {
        target: 'actions',
        caption: 'Cada ronda eliges cómo responder. La salida real es devaluar… a tiempo.',
      },
    ],
    event: {
      caption: '¡Shock del mercado! Los ataques caen al azar. Aguanta y calcula.',
    },
  },

  ep4: {
    goalChip: 'Baja las expectativas con credibilidad',
    firstTurnHint: { action: 'ajusteFiscal', label: 'Construye credibilidad' },
    steps: [
      {
        target: 'meters',
        caption: 'Baja las Expectativas para ganar; la Credibilidad es tu munición. Sin ella, nada dura.',
      },
      {
        target: 'actions',
        caption: 'Cada mes eliges una jugada. Congelar alivia hoy… y rebota mañana.',
      },
    ],
    event: {
      caption: '¡Ruido en la calle! Rumores y remarcajes caen al azar. No pierdas la calma.',
    },
  },

  ep5: {
    steps: [
      {
        target: 'list',
        caption: 'Ordena los 4 pasos con las flechas ↑ ↓. Solo un orden gana: el timing lo es todo.',
      },
    ],
  },

  ep6: {
    goalChip: 'Suelta la paridad a tiempo con el rescate',
    firstTurnHint: { action: 'intervenir', label: 'Defiende primero' },
    steps: [
      {
        target: 'meters',
        caption: 'Defender el peso quema Reservas o Empleo. Si cualquiera se agota, la caída es caótica.',
      },
      {
        target: 'actions',
        caption: 'Cada ronda eliges cómo responder. El rescate del Tesoro te da aire, pero no para siempre.',
      },
    ],
    event: {
      caption: '¡Shock político! Asesinatos, insurgencias y corridas. Aguanta y decide.',
    },
  },

  ep7: {
    goalChip: 'Mata la inflación sin que reviente el país',
    firstTurnHint: { action: 'shockTotal', label: 'Aprieta fuerte' },
    steps: [
      {
        target: 'meters',
        caption: 'Baja la Inflación (bueno) sin agotar el Apoyo social (malo). La deriva inflacionaria sube sola cada ronda.',
      },
      {
        target: 'actions',
        caption: 'Cada ronda eliges la intensidad del shock. Más agresivo mata la inflación más rápido pero quema apoyo.',
      },
    ],
    event: {
      caption: '¡Crisis social! Sendero, cólera y paros caen al azar. El shock tiene consecuencias.',
    },
  },
  ep8: {
    steps: [
      {
        target: 'actions',
        caption: 'Cada paso, Smith te hace una pregunta. Elige con cuidado: tus decisiones deciden cuánto produce la fábrica.',
      },
    ],
  },

  ep9: {
    goalChip: 'Llega a 93 minutos por auto',
    firstTurnHint: { action: 'lineaMontaje', label: 'Empieza con la línea' },
    steps: [
      {
        target: 'meters',
        caption: 'Baja el Tiempo por auto sin disparar el Costo. La línea de montaje transforma todo.',
      },
      {
        target: 'actions',
        caption: 'Cada ronda eliges una innovación. Cada una mejora el tiempo a cambio de costo o inversión.',
      },
    ],
    event: {
      caption: '¡Imprevisto industrial! Rotación, demanda y competencia cambian el juego.',
    },
  },

  ep10: {
    goalChip: 'Acumula capital sin perder la fábrica',
    steps: [
      {
        target: 'meters',
        caption: 'Equilibra el Capital (tu ganancia) con la Moral obrera. Si una llega a cero, perdiste.',
      },
      {
        target: 'actions',
        caption: 'Cada acción te da capital a costa de la moral — o viceversa. Elige sabiamente.',
      },
    ],
  },

  ep11: {
    goalChip: 'Baja el desempleo sin disparar inflación',
    firstTurnHint: { action: 'gastoPublico', label: 'Keynes recomienda gastar' },
    steps: [
      {
        target: 'meters',
        caption: 'Vigila Desempleo e Inflación. Si una se dispara, perdiste.',
      },
      {
        target: 'actions',
        caption: 'Gasto público, tasas, impuestos o confianza — cada herramienta tiene su costo.',
      },
    ],
  },

  ep12: {
    goalChip: 'Domina la inflación sin causar recesión',
    firstTurnHint: { action: 'reglaK', label: 'Friedman dice: regla k%' },
    steps: [
      {
        target: 'meters',
        caption: 'Inflación, Desempleo, Expectativas y Credibilidad. Las expectativas son el termómetro de tu credibilidad.',
      },
      {
        target: 'actions',
        caption: 'Expandir da empleo hoy pero sube expectativas. Regla k% estabiliza. Contraer frena inflación pero duele.',
      },
    ],
  },

  ep13: {
    goalChip: 'Acumula cobre vendiendo en el momento justo',
    steps: [
      {
        target: 'actions',
        caption: 'Cada ronda eliges cómo vender. La barra se mueve sola: haz clic cuando esté en la zona dorada.',
      },
      {
        target: 'meters',
        caption: '¡Cuidado! El timing lo es todo. Muy temprano o muy tarde y el precio se te va.',
      },
    ],
  },

  ep14: {
    goalChip: 'Lleva la tasa de reemplazo al 70%+',
    steps: [
      {
        target: 'meters',
        caption: 'Tasa de reemplazo, cobertura, confianza y fondo. Todo importa. No descuides ninguno.',
      },
      {
        target: 'actions',
        caption: 'Cada reforma tiene efectos distintos. Algunas son impopulares pero necesarias. Otras son fáciles pero insuficientes.',
      },
    ],
  },
}

export const tutorialFor = (id) => EPISODE_TUTORIALS[id] ?? null
