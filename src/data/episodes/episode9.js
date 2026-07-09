// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 9 — LA LÍNEA DE MONTAJE
// Referencia: Henry Ford, 1913 · Highland Park, Michigan
//
// Mecánica NUEVA: assemblyLine (mejora continua). El jugador dirige la
// producción del Model T y elige qué innovaciones aplicar para reducir
// el tiempo de ensamblaje. La línea de montaje, la estandarización,
// la integración vertical y el salario de $5 son las herramientas.
//
// La lección: la producción en masa transformó el mundo — y cada pieza
// del sistema de Ford (línea, piezas, proveedores, trabajadores) fue
// una innovación deliberada, no un solo invento.
//
// Lógica en src/utils/assemblyLine.js, UI en AssemblyLine.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep9',
  numero: 3,
  line: 'origins',
  titulo: 'La Línea de Montaje',
  año: 1913,
  crisisHistorica: 'El nacimiento de la producción en masa',
  paisReferencia: 'Estados Unidos',
  resumen:
    'El Ford Model T cuesta $850 y tarda 12 horas en fabricarse. Henry Ford quiere que cueste $300 y tarde 93 minutos.',
  bloqueado: false,

  mechanic: 'assemblyLine',

  newspaper: {
    name: 'DETROIT FREE PRESS',
    dateline: 'HIGHLAND PARK, MICHIGAN, 7 de octubre de 1913',
    number: 'Edición Extra',
    headline:
      '¡LA NUEVA LÍNEA DE MONTAJE DE FORD PRODUCE UN AUTO CADA 93 MINUTOS!',
    subhead:
      'El "Model T" se fabrica ahora en una fracción del tiempo. "Voy a democratizar el automóvil", declara Ford.',
  },

  opening: [
    'Detroit, 1913.',
    'El automóvil es un lujo de ricos.',
    'Cuesta $850 — el salario de dos años de un obrero.',
    '',
    'Henry Ford tiene una obsesión:',
    'un auto que cualquier trabajador pueda comprar.',
    '',
    'Pero para eso necesita producir como nadie ha producido antes.',
    'Te ha contratado para lograrlo.',
    '',
    'Bienvenido a Highland Park.',
    'Tenemos que pasar de 12 horas a 93 minutos por auto.',
  ],

  cellNarration: [
    'Antes de Ford, los autos se fabricaban como carruajes: un equipo de artesanos armaba cada auto desde cero en un mismo lugar. Un auto por día, 12 horas de trabajo, $850 de costo.',
    'Ford quería un auto para las masas: el Model T. Pero para venderlo barato, tenía que fabricarlo como nunca se había fabricado nada. La solución: la línea de montaje móvil, piezas intercambiables, trabajadores especializados y una escala que nadie había soñado.',
    'En 1913, Highland Park se convirtió en la fábrica más productiva del mundo. El tiempo de ensamblaje cayó de 12 horas a 93 minutos. El precio del Model T: de $850 a $300. El salario de los obreros: el doble del promedio. Y el mundo cambió para siempre.',
  ],

  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',

  ticker: {
    itemBase: 'Tiempo por auto',
    currency: 'minutos',
    precioInicial: 720,
    tasaInflacion: 0.98, // baja en vez de subir (mejora)
    umbralCritico: 93,
  },

  contextoHistorico: {
    titulo: 'Highland Park, 1913',
  },

  trendChart: {
    titulo: 'Tiempo de ensamblaje del Model T',
    unidad: 'minutos por auto',
    ejeX: ['1912', '1913', '1914', '1915', '1916'],
    real: {
      cifra: '720 → 93',
      cifraEtiqueta: 'minutos por auto (1912 → 1914)',
      nota: 'La línea de montaje de Ford redujo el tiempo de ensamblaje del Model T de 12 horas (720 min) a 93 minutos, una mejora del 87%. La producción saltó de 82.000 autos en 1912 a 585.000 en 1916. El precio cayó de $850 a $360. Ford pagaba $5 por día —el doble del promedio industrial— y aún así redujo costos porque la rotación de personal cayó del 370% al 16%.',
    },
  },

  prisoners: [
    {
      id: 'ford',
      name: 'Henry Ford',
      role: 'Fundador de Ford Motor Company',
      portrait: '🏭',
      accent: '#2C3E50',
      gender: 'm',
      blurb:
        '"Cualquier cliente puede tener un auto del color que quiera, siempre que sea negro." Obsesivo, visionario, implacable. Sabe exactamente lo que quiere: bajar el costo a $300.',
      utility: 'Quiere maximizar la producción a cualquier costo.',
      concept: 'economiasEscala',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: -1,
      initialTrust: 40,
      supportsPolicy: ['linea'],
      rejectsPolicy: ['artesanal'],
      voice: {
        cooperate:
          '"Cada minuto que ahorres en el ensamblaje son dólares enteros en el precio final. No me importa cómo — hazlo."',
        betrayed:
          '"¿Más lento que antes? Estás despedido. Yo mismo voy a diseñar esta línea."',
      },
    },
    {
      id: 'ingeniero',
      name: 'Charles Sorensen',
      role: 'Jefe de producción de Highland Park',
      portrait: '🔧',
      accent: '#5B8DB8',
      gender: 'm',
      blurb:
        'El genio de la producción que diseñó la primera línea de montaje móvil. Donde Ford ve un número, Sorensen ve un flujo de piezas y cuerpos en movimiento.',
      utility: 'Quiere probar la línea de montaje móvil, aunque sea riesgosa.',
      concept: 'ingenieriaProduccion',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 1,
      initialTrust: 50,
      supportsPolicy: ['linea'],
      rejectsPolicy: ['artesanal'],
      voice: {
        cooperate:
          '"He calculado el flujo: si movemos el chasis en vez de mover a los obreros, ganamos 30 minutos por auto."',
        betrayed:
          '"Sin la línea móvil, esto es una herrería con techito. No cuentes conmigo para hacer carruajes."',
      },
    },
    {
      id: 'obrero',
      name: 'James Miller',
      role: 'Representante de los trabajadores de Highland Park',
      portrait: '👷',
      accent: '#C0392B',
      gender: 'm',
      blurb:
        'Trabajó en la línea desde el primer día. Vio cómo el ritmo de la línea se volvió implacable. La rotación es del 370% anual — la gente no aguanta.',
      utility: 'Quiere mejor salario y condiciones para los trabajadores.',
      concept: 'taylorismo',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 45,
      supportsPolicy: ['salario'],
      rejectsPolicy: ['fordismo'],
      voice: {
        cooperate:
          '"Si nos paga $5 al día como dice, la gente se queda. Pero la línea no puede ir más rápido sin matar a alguien."',
        betrayed:
          '"¿Otro apretón sin aumento? La rotación se va a 400% y usted se queda sin brazos."',
      },
    },
    {
      id: 'proveedor',
      name: 'Albert Kahn',
      role: 'Arquitecto e ingeniero de proveedores',
      portrait: '🏗️',
      accent: '#27AE60',
      gender: 'm',
      blurb:
        'Diseñó la fábrica de River Rouge — integración vertical total. El mineral entra por un lado, el auto sale por el otro. Él sabe cómo conectar cada pieza del sistema.',
      utility: 'Quiere integrar la cadena de suministro para eliminar intermediarios.',
      concept: 'integracionVertical',
      basePayoff: { CC: [3, 3], CT: [0, 5], TC: [5, 0], TT: [1, 1] },
      cooperBias: 0,
      initialTrust: 40,
      supportsPolicy: ['integracion'],
      rejectsPolicy: ['subcontratar'],
      voice: {
        cooperate:
          '"Dejen de comprar piezas a terceros. Construyamos todo nosotros: del mineral al auto terminado."',
        betrayed:
          '"Siguen comprando piezas afuera? No entienden la escala. Sigan pagando sobreprecio."',
      },
    },
  ],

  // ── MECÁNICA DE LÍNEA DE MONTAJE ─────────────────────────────────────
  assemblyLine: {
    intro:
      'Highland Park produce el Model T como un carruaje: 12 horas por auto. Henry Ford quiere 93 minutos. Cada ronda eliges una innovación para acelerar la producción. El tiempo baja, pero cada innovación tiene su costo. La meta: 93 minutos por auto.',
    rondas: 6,
    tiempoInicial: 720,
    costoInicial: 70,
    acciones: [
      {
        id: 'lineaMontaje',
        name: 'Línea de montaje móvil',
        icon: '⚙️',
        desc: 'El chasis se mueve frente a los trabajadores en vez de que ellos se muevan alrededor del auto. Menos tiempo muerto, más velocidad.',
        tiempo: -120,
        costo: 5,
        innovacion: 20,
        advisor: 'ingeniero',
        reaccion:
          '"El chasis se mueve, los hombres se quedan quietos. Cada uno hace su tarea y el auto avanza. Es hermoso, como un río."',
      },
      {
        id: 'estandar',
        name: 'Estandarizar piezas',
        icon: '📏',
        desc: 'Cada pieza del Model T es idéntica y no necesita ajuste manual. Se ensambla sin limar ni modificar.',
        tiempo: -90,
        costo: -3,
        innovacion: 15,
        advisor: 'proveedor',
        reaccion:
          '"Piezas que calzan sin ajuste — eso es el verdadero invento. La línea es solo el teatro; las piezas estandarizadas son la obra."',
      },
      {
        id: 'integracion',
        name: 'Integración vertical',
        icon: '🏗️',
        desc: 'Ford compra los proveedores y produce todo internamente: del acero al vidrio. Menos costo, más control.',
        tiempo: -30,
        costo: -1,
        innovacion: 10,
        usos: 1,
        advisor: 'proveedor',
        reaccion:
          '"River Rouge: el mineral entra por un lado, el auto sale por el otro. Sin intermediarios, sin demoras, sin márgenes."',
      },
      {
        id: 'salarioDoble',
        name: '$5 al día (el doble del promedio)',
        icon: '💰',
        desc: 'Duplicas el salario a $5 por día. Los trabajadores dejan de renunciar y la productividad se dispara.',
        tiempo: -60,
        costo: 8,
        innovacion: 25,
        usos: 1,
        advisor: 'obrero',
        reaccion:
          '"¿Cinco dólares al día? Nadie paga eso. La gente va a hacer cola desde Canadá. Y los que estamos adentro, no nos vamos a ir nunca."',
      },
    ],
  },

  // ── CARTAS DE EVENTO ────────────────────────────────────────────────────
  eventos: [
    {
      id: 'rotacion',
      titulo: 'La rotación de personal llega al 370% anual',
      texto: 'Los trabajadores no aguantan el ritmo. Renuncian y hay que entrenar reemplazos constantemente.',
      icon: '🚶',
      efecto: { tiempo: 30, innovacion: -5 },
    },
    {
      id: 'acero',
      titulo: 'Baja el precio del acero',
      texto: 'Las acereras de Pittsburgh bajan sus precios. El costo de producción cae.',
      icon: '🏗️',
      efecto: { costo: -5 },
    },
    {
      id: 'demanda',
      titulo: 'La demanda del Model T explota',
      texto: 'Los pedidos se acumulan. La presión de producir más se siente en toda la fábrica.',
      icon: '📈',
      efecto: { innovacion: 8 },
    },
    {
      id: 'competencia',
      titulo: 'General Motors innova',
      texto: 'La competencia introduce una nueva técnica de ensamblaje. Ford pierde ventaja.',
      icon: '🚗',
      efecto: { tiempo: 20 },
    },
    {
      id: 'huelga',
      titulo: 'Los trabajadores amenazan con huelga',
      texto: 'El ritmo de la línea es insostenible. Piden una pausa o mejor salario.',
      icon: '✊',
      opciones: [
        {
          label: 'Aumentar el salario a $5',
          efecto: { costo: 8, tiempo: -30, innovacion: 10 },
          replica: 'Duele el bolsillo, pero la rotación cae y la productividad sube. Ford lo llama "el mejor negocio que hicimos".',
        },
        {
          label: 'Mantener el ritmo sin concesiones',
          efecto: { tiempo: 25 },
          replica: 'La línea sigue. Los trabajadores también — por ahora. La rotación se dispara.',
        },
      ],
    },
    {
      id: 'innovacion',
      titulo: 'Un capataz inventa una mejora',
      texto: 'Un trabajador sugiere mover la línea 30 cm más arriba. Suena tonto, pero ahorla segundos por auto que suman horas al día.',
      icon: '💡',
      opciones: [
        {
          label: 'Implementar la mejora y premiar al capataz',
          efecto: { tiempo: -20, innovacion: 8 },
          replica: 'Segundos ahorrados, minutos ganados. El trabajador que innova es el mejor ingeniero.',
        },
        {
          label: 'Ignorarla y mantener el proceso',
          efecto: {},
          replica: 'No hay tiempo para experimentos. La línea no se detiene por ocurrencias.',
        },
      ],
    },
  ],

  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'economiasEscala',
      headlineWin:
        '¡93 MINUTOS! LA LÍNEA DE MONTAJE DE FORD: LA FÁBRICA MÁS PRODUCTIVA DEL MUNDO',
      resultText:
        'Llegaste a 93 minutos por auto — el récord de Highland Park. La línea de montaje móvil, las piezas estandarizadas, la integración vertical y el salario de $5 convirtieron a Ford en la fábrica más productiva del planeta. El Model T baja a $300, el trabajador gana el doble y el mundo entero quiere un auto. La producción en masa acaba de nacer.',
      scores: { eficiencia: 92, innovacion: 88, impacto: 95 },
      history:
        'La línea de montaje de Ford en Highland Park (1913) redujo el tiempo de ensamblaje de 12 horas a 93 minutos. La producción pasó de 82.000 autos (1912) a 585.000 (1916). El precio del Model T cayó de $850 a $360. El salario de $5 por día duplicó el promedio industrial, pero la rotación de personal cayó del 370% al 16%. Ford demostró que pagar bien y producir en masa no eran ideas opuestas — eran la misma idea.',
    },
    partial: {
      id: 'partial',
      concept: 'ingenieriaProduccion',
      headlineWin:
        'MEJORASTE LA PRODUCCIÓN, PERO SIN LLEGAR AL RÉCORD DE FORD',
      resultText:
        'Lograste reducir el tiempo de ensamblaje significativamente, pero no alcanzaste los 93 minutos de Ford. Tal vez no implementaste la línea móvil, o no integraste los proveedores, o no convenciste a Ford de pagar $5 al día. La fábrica produce más que antes, pero el potencial quedó en el tintero.',
      scores: { eficiencia: 55, innovacion: 50, impacto: 60 },
      history:
        'La línea de montaje no fue un solo invento sino un sistema: línea móvil + piezas intercambiables + integración vertical + incentivos al trabajador. Las fábricas que implementaron solo algunas piezas del sistema mejoraron, pero nunca alcanzaron la productividad de Ford. El sistema funciona como sistema.',
    },
    wrong: {
      id: 'wrong',
      concept: 'taylorismo',
      headlineWin:
        'LA FÁBRICA SIGUE IGUAL: SIN INNOVACIÓN NO HAY PRODUCCIÓN EN MASA',
      resultText:
        'Te dio miedo cambiar el proceso. La fábrica de Highland Park sigue produciendo como en 1912: un auto cada 12 horas, artesanalmente, caro. Ford te mira decepcionado. "Pensé que entendías la visión", dice. El Model T sigue siendo un lujo de ricos.',
      scores: { eficiencia: 25, innovacion: 20, impacto: 30 },
      history:
        'Antes de Ford, los autos se fabricaban como carruajes: uno por día, $850, solo para ricos. Ford entendió que el problema no era técnico — era de sistema. La producción en masa requirió cambiar la forma de pensar la fábrica, el trabajador y el producto. Quien no innovó en 1913, desapareció en 1920.',
    },
  },

  policies: [],
}
