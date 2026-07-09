// ─────────────────────────────────────────────────────────────────────────
// Lógica de la mecánica "Fábrica de Alfileres" (Episodio 8 — Adam Smith).
//
// Es una DEMOSTRACIÓN INTERACTIVA de la división del trabajo. El jugador
// guía a Adam Smith a través de 7 pasos que revelan cómo la especialización
// multiplica la producción. No hay "fracaso" — el output final es el score.
//
// Smith observa la fábrica y el jugador decide cómo organizar el trabajo.
// Cada paso tiene opciones que afectan output, especialización y ánimo.
// ─────────────────────────────────────────────────────────────────────────

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v))

export function initPinFactory(cfg) {
  return {
    paso: 1,
    output: cfg.outputInicial, // pins/día
    specialization: 0,
    workers: cfg.workers,
    tools: 1.0,
    maxOutput: 0, // récord alcanzado
    pasos: [], // historial
  }
}

const CALCULOS = {
  // output base según especialización
  outputBase: (s) => 200 * (1 + s * 4.5),
  // penalización por herramientas malas
  toolPenalty: (t) => t < 1 ? 1 - (1 - t) * 0.3 : 1,
}

// Cada paso del recorrido. `id` identifica la escena, `choices` son las
// opciones del jugador, cada una con efectos y un texto narrativo.
export const STEPS = [
  // ── Paso 1: La llegada ──────────────────────────────────────────────
  {
    paso: 1,
    smithQuote: '"Permitidme observar vuestro taller, buen hombre. ¿Cómo fabricáis los alfileres?"',
    setup: 'Tus 10 trabajadores hacen cada uno un alfiler completo, de principio a fin.',
    choices: [
      {
        id: 'tradicional',
        label: 'Mostrar el método tradicional',
        text: 'Cada trabajador hace el alfiler entero: estira el alambre, lo corta, le hace punta, pone la cabeza, lo pule.',
        efectos: { output: 0, specialization: 0 },
        smithReaction: '"Curioso… cada hombre fabrica 20 alfileres al día. Diez hombres: 200 alfileres. Nada despreciable."',
      },
    ],
  },

  // ── Paso 2: La idea ─────────────────────────────────────────────────
  {
    paso: 2,
    smithQuote: '"Decidme: ¿y si cada hombre se especializara en una sola operación?"',
    setup: 'Smith propone dividir el trabajo en 18 operaciones distintas. Cada trabajador haría una sola.',
    choices: [
      {
        id: 'rechazar',
        label: 'Mantener el método actual',
        text: 'Cada trabajador sigue haciendo alfileres completos. Es confiable y no requiere cambios.',
        efectos: { output: 0, specialization: 0 },
        smithReaction: '"La costumbre es una tirana silenciosa. Pero observad: si os atrevéis a cambiar…"',
        outputFinal: 200,
      },
      {
        id: 'especializar',
        label: 'Dividir el trabajo en 18 operaciones',
        text: 'Asignas a cada trabajador una sola tarea: uno estira, otro corta, otro hace la punta…',
        efectos: { output: 4800, specialization: 25 },
        smithReaction: '"¡Magnífico! Ved lo que sucede: donde antes había 200 alfileres, ahora hay 4.800. La división del trabajo multiplica la destreza de cada hombre."',
        outputFinal: 4800,
      },
    ],
  },

  // ── Paso 3: El entrenamiento ─────────────────────────────────────────
  {
    paso: 3,
    smithQuote: '"Cada trabajador, concentrado en una sola tarea, se vuelve más diestro. ¿Qué haréis con esa habilidad?"',
    setup: 'Los trabajadores mejoran en sus tareas específicas. Algunos son más rápidos que otros.',
    choices: [
      {
        id: 'ignorar',
        label: 'Dejar que aprendan solos',
        text: 'La práctica hace al maestro. Con el tiempo, cada trabajador mejora naturalmente.',
        efectos: { output: 1200, specialization: 5 },
        smithReaction: '"Ciertamente, la práctica mejora a cualquier hombre. Pero observad cuánto más lento va el que aprende solo."',
        outputFinal: 6000,
      },
      {
        id: 'entrenar',
        label: 'Asignar un maestro para entrenarlos',
        text: 'Dedicas a un trabajador como instructor. Pierdes una mano de obra hoy, pero todos aprenden más rápido.',
        efectos: { output: 8000, specialization: 15 },
        smithReaction: '"Invertir en la habilidad del trabajador es tan importante como invertir en la máquina. Un hombre instruido rinde el triple que uno que aprende solo."',
        outputFinal: 12800,
      },
    ],
  },

  // ── Paso 4: Las herramientas ─────────────────────────────────────────
  {
    paso: 4,
    smithQuote: '"He observado que vuestras herramientas son sencillas. ¿Habéis considerado mejorarlas?"',
    setup: 'Los trabajadores usan herramientas básicas. Smith sugiere invertir en mejores instrumentos.',
    choices: [
      {
        id: 'seguir',
        label: 'Seguir con las herramientas actuales',
        text: 'Las herramientas actuales funcionan. Una inversión en herramientas nuevas es cara y no sabes si rendirá.',
        efectos: { output: 2000, specialization: 0, tools: 0.2 },
        smithReaction: '"Sin buenas herramientas, el mejor artesano rinde la mitad. Es como tener un caballo veloz en un camino de barro."',
        outputFinal: 14800,
      },
      {
        id: 'invertir',
        label: 'Invertir en herramientas especializadas',
        text: 'Compras limas más finas, tenazas mejor diseñadas, y un molino de agua para estirar el alambre.',
        efectos: { output: 12000, specialization: 5, tools: 0.5 },
        smithReaction: '"¡Ah! Una máquina bien diseñada es como tener diez trabajadores más. La herramienta especializada multiplica la fuerza del brazo que la usa."',
        outputFinal: 24800,
      },
    ],
  },

  // ── Paso 5: El flujo ─────────────────────────────────────────────────
  {
    paso: 5,
    smithQuote: '"Ahora que tenéis destreza y herramientas, decidme: ¿cómo movéis el material entre estaciones?"',
    setup: 'El taller creció. Ahora hay 18 operaciones y las piezas se mueven de una estación a otra.',
    choices: [
      {
        id: 'central',
        label: 'Que cada trabajador busque su material',
        text: 'Cada trabajador va al almacén, toma el material, hace su tarea, y lleva la pieza a la siguiente estación.',
        efectos: { output: 5000, specialization: 0 },
        smithReaction: '"Cada viaje al almacén es tiempo perdido. El trabajador más hábil no produce si está caminando."',
        outputFinal: 29800,
      },
      {
        id: 'flujo',
        label: 'Organizar el taller en línea de producción',
        text: 'Colocas las estaciones en orden. El material pasa de una a otra sin que nadie se mueva. Contratas a un aprendiz para mover las piezas entre estaciones.',
        efectos: { output: 15000, specialization: 5 },
        smithReaction: '"Observad: el material fluye como el agua río abajo. Nadie se detiene, nadie camina, todos producen. El orden mismo es una máquina."',
        outputFinal: 39800,
      },
    ],
  },

  // ── Paso 6: La máquina ───────────────────────────────────────────────
  {
    paso: 6,
    smithQuote: '"He visto que usáis un molino de agua. ¿Podríais aplicar esa fuerza a más operaciones?"',
    setup: 'El molino de agua mueve una sola máquina. Smith sugiere mecanizar más pasos.',
    choices: [
      {
        id: 'manual',
        label: 'Mantener el trabajo manual',
        text: 'Las máquinas son caras y se descomponen. El trabajo manual es confiable y flexible.',
        efectos: { output: 5000, specialization: 0 },
        smithReaction: '"El hombre es más flexible que la máquina, sí. Pero la máquina nunca se cansa, nunca pide aumento, nunca se distrae."',
        outputFinal: 44800,
      },
      {
        id: 'mecanizar',
        label: 'Mecanizar el estirado y corte del alambre',
        text: 'Conectas el molino de agua a las máquinas de estirar y cortar. Dos trabajadores pasan a tareas más finas.',
        efectos: { output: 10000, specialization: 5 },
        smithReaction: '"La máquina es la extensión del pensamiento humano convertida en movimiento. Dos hombres hacen ahora el trabajo de veinte. Esto, amigo mío, es el progreso."',
        outputFinal: 49800,
      },
    ],
  },

  // ── Paso 7: La culminación ──────────────────────────────────────────
  {
    paso: 7,
    smithQuote: '"Contadme: ¿cuántos alfileres produce ahora vuestra fábrica en un día?"',
    setup: 'La fábrica ha pasado de 200 alfileres/día a una producción que Smith nunca imaginó posible.',
    choices: [
      {
        id: 'celebrar',
        label: 'Celebrar el logro y mostrarle los números',
        text: 'Le muestras a Smith los libros: 48.000 alfileres al día. El maestro sonríe.',
        efectos: { output: 0, specialization: 0 },
        smithReaction: '"De 200 a casi 50.000 alfileres. Todo por dividir el trabajo, entrenar al hombre, mejorar la herramienta y ordenar el taller. Eso, joven, es lo que llamo "La Riqueza de las Naciones"."',
      },
    ],
  },
]

// Calcula el output actual de la fábrica.
function calcOutput(state, cfg) {
  const base = CALCULOS.outputBase(state.specialization)
  const penalizado = base * CALCULOS.toolPenalty(state.tools)
  return Math.round(penalizado * (state.workers / cfg.workers))
}

// Avanza al siguiente paso con la elección del jugador.
export function playStep(state, cfg, choice) {
  const pasoActual = STEPS[state.paso - 1]
  const outputGanado = choice.outputFinal ?? calcOutput(
    { ...state, specialization: clamp(state.specialization + (choice.efectos?.specialization ?? 0)), tools: state.tools + (choice.efectos?.tools ?? 0) },
    cfg,
  )

  const nextState = {
    ...state,
    paso: state.paso + 1,
    output: outputGanado,
    specialization: clamp(state.specialization + (choice.efectos?.specialization ?? 0)),
    tools: clamp(state.tools + (choice.efectos?.tools ?? 0), 0.5, 2.0),
    maxOutput: Math.max(state.maxOutput, outputGanado),
    pasos: [...state.pasos, { paso: state.paso, choice: choice.id, output: outputGanado }],
  }

  return nextState
}

export function isOver(state, cfg) {
  return state.paso > STEPS.length
}

// Estrellas basadas en el output final.
export function outcomeTier(state, cfg) {
  const final = state.maxOutput
  if (final >= 48000) return 'perfect'   // 3 estrellas — alcanzó el hito de Smith
  if (final >= 20000) return 'partial'    // 2 estrellas — buena producción
  return 'wrong'                          // 1 estrella — se quedó corto
}
