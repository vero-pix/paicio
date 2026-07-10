// ─────────────────────────────────────────────────────────────────────────
// Briefings de episodio — CAPA DE PRESENTACIÓN.
//
// El rediseño reemplaza la "celda" del periódico por un briefing luminoso que
// necesita dos textos que NO viven (uniformes) en los datos del juego: la
// misión del nivel y la provocación del antagonista al recibir el cargo.
//
// Se centralizan acá para no tocar src/data/episodes/* (regla del rediseño y
// para que el swap de datos futuro no arrastre este copy). El resto del
// briefing —título, setup, dato clave— se lee de los datos reales del episodio.
// Tono: chileno neutro, tuteo (nunca voseo).
// ─────────────────────────────────────────────────────────────────────────

import { portraits } from '../assets/portraits.js'

export const EPISODE_BRIEFINGS = {
  ep1: {
    mission:
      'La imprenta te tienta con alivio fácil, pero cada vez que la enciendes acercas el colapso. Sabe cuándo cortar y estabilizar.',
    antagonist: {
      portrait: portraits.presidente,
      name: 'El Presidente',
      quote: '"El país es tuyo, ministro. Yo ya hice mi parte… que tengas suerte."',
    },
  },
  ep2: {
    mission:
      'Detén la corrida bancaria y decide qué hacer con los ahorros, sin que reviente el sistema ni la calle.',
    antagonist: {
      portrait: portraits.gobernador,
      name: 'El Gobernador',
      quote: '"Los bancos ya cerraron. La fila en la puerta ahora es problema tuyo."',
    },
  },
  ep3: {
    mission:
      'Defiende la paridad mientras puedas… y suéltala a tiempo, antes de que se lleve todo por delante.',
    antagonist: {
      portrait: portraits.tecnocrata,
      name: 'El Tecnócrata',
      quote: '"El modelo era perfecto. Si ahora se cae, será por cómo lo manejes tú."',
    },
  },
  ep4: {
    mission:
      'Rompe la inercia inflacionaria: gánale a las expectativas sin quebrar al país en el intento.',
    antagonist: {
      portrait: portraits.congreso,
      name: 'El Congreso',
      quote: '"Cinco planes fracasaron. Tráenos el sexto… y ya veremos si te creemos."',
    },
  },
  ep5: {
    mission:
      'Termina con la inflación crónica. El truco no es congelar precios: es la secuencia correcta.',
    antagonist: {
      portrait: portraits.presidenteReal,
      name: 'El Presidente',
      quote: '"Es tu última bala, ministro. Si fallas, nadie volverá a intentarlo."',
    },
  },
  ep6: {
    mission:
      'Defiende el peso sin quemar todas las reservas, consigue el rescate internacional y suelta la paridad a tiempo.',
    antagonist: {
      portrait: portraits.presidente,
      name: 'El Presidente saliente',
      quote: '"El peso es fuerte, Secretario. Solo necesita un poco más de confianza… confianza."',
    },
  },
  ep7: {
    mission:
      'Aplica el shock justo: mata la hiperinflación sin que el costo social reviente al país.',
    antagonist: {
      portrait: portraits.presidenteReal,
      name: 'El Presidente electo',
      quote: '"No me importa lo que prometí en campaña. Esto es lo que hay que hacer. Hágalo."',
    },
  },
  ep8: {
    mission:
      'Acompaña a Adam Smith por la fábrica de alfileres y descubre por qué la división del trabajo es la clave de la riqueza.',
    antagonist: {
      portrait: portraits.smith,
      name: 'Adam Smith',
      quote: '"Permitidme observar vuestro taller, buen hombre. He oído que fabricáis alfileres."',
    },
  },
  ep9: {
    mission:
      'Lleva la producción del Model T de 12 horas a 93 minutos por auto y democratiza el automóvil.',
    antagonist: {
      portrait: portraits.ford,
      name: 'Henry Ford',
      quote: '"Cualquier cliente puede tener un auto del color que quiera, siempre que sea negro."',
    },
  },

  ep10: {
    mission:
      'Descubre la plusvalía: la fuerza invisible que hace funcionar el capitalismo. Marx te guiará.',
    antagonist: {
      portrait: portraits.marx,
      name: 'Karl Marx',
      quote: '"El trabajador solo es rico mientras más valor produce de lo que cuesta mantenerlo. Esa diferencia es la plusvalía."',
    },
  },

  ep11: {
    mission:
      'La economía está en el suelo. Aplica las ideas de Keynes y reactiva la demanda agregada.',
    antagonist: {
      portrait: portraits.keynes,
      name: 'John M. Keynes',
      quote: '"El problema no es la producción. Es la demanda. Si la gente no gasta, el gobierno debe hacerlo."',
    },
  },

  ep12: {
    mission:
      'Domina la inflación con la regla monetaria de Friedman. Cada decisión de oferta de dinero afecta las expectativas de todos.',
    antagonist: {
      portrait: portraits.friedman,
      name: 'Milton Friedman',
      quote: '"La inflación es siempre y en todo lugar un fenómeno monetario."',
    },
  },

  ep13: {
    mission:
      'El cobre es el sueldo de Chile. Aprende a bailar con su precio: vende cuando está arriba, aguanta cuando está abajo e invierte cuando hay viento a favor.',
    antagonist: {
      portrait: portraits.trabajadorChile,
      name: 'El Precio del Cobre',
      quote: '"No me importa tu presupuesto fiscal. Yo bailo solo."',
    },
  },

  ep14: {
    mission:
      'Misma plata, sistemas distintos, resultados muy diferentes. Descubre por qué Australia, Canadá y Suecia tienen las pensiones que funcionan — y cómo llevar esas ideas a tu país.',
    antagonist: {
      portrait: portraits.tecnocrata,
      name: 'El Diseñador',
      quote: '"El sistema no falla porque falte plata. Falla porque está mal diseñado. Las reglas lo son todo."',
    },
  },

  ep15: {
    mission:
      'Ponle precio a tu puesto de tomates y vacía el mercado: ni cola en la puerta ni cajones de vuelta. Persigue el precio justo cada vez que cambie la demanda.',
    antagonist: {
      portrait: portraits.comerciante,
      name: 'La Casera',
      quote: '"Mijo, el precio no lo pones tú ni yo. Lo pone la feria. Si cobras de más, te quedas con los tomates."',
    },
  },

  ep17: {
    mission:
      'Eres la única farmacia del pueblo. Ponle precio al remedio buscando la máxima ganancia (por encima del costo, porque puedes)… y cuando llegue la competencia, aprende a soltar el margen.',
    antagonist: {
      portrait: portraits.comerciante,
      name: 'El Boticario',
      quote: '"Aquí no hay otra farmacia, ¿verdad? Entonces el precio lo pones tú. Pero cuidado: si cobras demasiado, hasta el enfermo se aguanta."',
    },
  },

  ep16: {
    mission:
      'Te llegó la plata del mes y no alcanza para todo. Arma la combinación de deseos que más felicidad te deje — y fíjate en lo que dejas fuera: ese es su verdadero costo.',
    antagonist: {
      portrait: portraits.vecina,
      name: 'Tu bolsillo',
      quote: '"No alcanza para todo, y nunca va a alcanzar. La pregunta no es qué quieres: es qué estás dispuesto/a a dejar."',
    },
  },
}

const FALLBACK = EPISODE_BRIEFINGS.ep1

export const briefingFor = (id) => EPISODE_BRIEFINGS[id] ?? FALLBACK
