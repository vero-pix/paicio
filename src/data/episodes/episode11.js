// ─────────────────────────────────────────────────────────────────────────
// EPISODIO 11 — LA DEMANDA AGREGADA
// Referencia: John M. Keynes, 1936 · Teoría General del Empleo, el Interés
// y el Dinero
//
// Mecánica NUEVA: aggregateDemand (política fiscal y monetaria). El jugador
// dirige la política económica durante la Gran Depresión y elige cómo
// reactivar la demanda agregada.
//
// La lección: cuando el sector privado no gasta, el gobierno debe gastar.
// La paradoja del ahorro, el multiplicador y el rol del déficit en crisis.
//
// Lógica en src/utils/aggregateDemand.js, UI en AggregateDemand.jsx.
// ─────────────────────────────────────────────────────────────────────────

export default {
  id: 'ep11',
  numero: 4,
  line: 'origins',
  titulo: 'La Demanda Agregada',
  año: 1936,
  crisisHistorica: 'Cómo salir de la Gran Depresión',
  paisReferencia: 'Inglaterra',
  resumen:
    'La economía está en el suelo. John Maynard Keynes te dice que gastes. Aprende por qué la demanda agregada es la llave para salir de una depresión.',
  bloqueado: true,
  mechanic: 'aggregateDemand',
  newspaper: {
    name: 'THE TIMES',
    dateline: 'LONDRES, 4 de febrero de 1936',
    number: 'Vol. CXLVIII',
    headline: '¿GASTAR PARA SALIR DE LA CRISIS? LA TEORÍA QUE REVOLUCIONA LA ECONOMÍA',
    subhead:
      'John Maynard Keynes publica "La Teoría General del Empleo, el Interés y el Dinero". Propone que el gobierno gaste cuando el sector privado no lo hace.',
  },
  opening: [
    'Londres, 1936.',
    'El mundo aún no se recupera de la Gran Depresión.',
    'El desempleo supera el 20% en Inglaterra.',
    'Fábricas cerradas, familias enteras en la calle.',
    '',
    'En Cambridge, un economista escribe a contracorriente.',
    'Mientras todos predican la austeridad, él dice lo contrario.',
    '',
    'John Maynard Keynes acaba de publicar su libro.',
    'Y viene a convencerte de que gastar es la solución.',
  ],
  cellNarration: [
    'Keynes dijo: cuando la gente deja de gastar porque tiene miedo, las empresas dejan de producir porque no venden, y despiden gente. La gente despedida gasta menos todavía. Es una espiral. Para romperla, alguien tiene que gastar. Si el sector privado no lo hace, debe hacerlo el gobierno.',
    'Antes de Keynes, la economía clásica decía: espera, el mercado se ajusta solo. Keynes respondió: "A largo plazo, todos estaremos muertos". La economía puede quedarse estancada indefinidamente si nadie inyecta demanda.',
    'El New Deal de Roosevelt ya estaba aplicando estas ideas sin saberlo. Keynes venía a darles nombre y teoría.',
  ],
  negotiationIntro: '',
  policyIntro: '',
  needAlliesWarning: '',
  ticker: null,
  contextoHistorico: { titulo: 'Cambridge, 1936' },
  trendChart: null,
  prisoners: [],
  aggregateDemand: {
    intro: 'Keynes se sienta a tu lado. "El problema es simple", dice. "La gente no gasta, las empresas no producen. Tienes que romper el ciclo. Gasta tú." Cada ronda eliges una política para reactivar la economía. El objetivo: bajar el desempleo sin disparar la inflación.',
    rondas: 6,
    desempleoInicial: 22,
    inflacionInicial: 0.5,
    pibInicial: 80,
    deudaInicial: 40,
  },
  eventos: [
    {
      ronda: 3,
      titulo: 'Huelga General',
      desc: 'Los sindicatos exigen protección laboral. El descontento social crece. El desempleo duele y la gente se organiza.',
      efecto: { desempleo: 3 },
    },
    {
      ronda: 5,
      titulo: 'La Bolsa Reacciona',
      desc: 'Tus medidas comienzan a dar señales. Los inversores recuperan la confianza y el crédito empieza a fluir.',
      efecto: { pib: 5, inflacion: 1 },
    },
  ],
  outcomes: {
    perfect: {
      id: 'perfect',
      concept: 'demandaAgregada',
      headlineWin: '¡LA ECONOMÍA REACTIVADA! KEYNES TENÍA RAZÓN: HAY QUE GASTAR',
      resultText:
        'Bajaste el desempleo a niveles aceptables sin disparar la inflación. Keynes sonríe satisfecho. "¿Ves? El gobierno tiene un rol. Cuando el barco se hunde, no puedes esperar que los pasajeros remen. Tienes que bombear el agua." Tu país sale de la depresión más rápido que sus vecinos. La lección queda escrita: la demanda agregada importa.',
      scores: { empleo: 90, inflacion: 85, crecimiento: 88 },
      history:
        'La Teoría General de Keynes (1936) cambió la economía para siempre. Durante la Gran Depresión, el desempleo en EE.UU. llegó al 25%. Roosevelt gastó en infraestructura, empleo público y subsidios. Para 1940, el desempleo había bajado al 15%. La Segunda Guerra Mundial, con su gasto masivo, lo llevaría al 2%. Keynes había visto algo que nadie más veía.',
    },
    partial: {
      id: 'partial',
      concept: 'demandaAgregada',
      headlineWin: 'MEJORAS NOTABLES, PERO SIN TERMINAR DE ROMPER LA ESPIRAL',
      resultText:
        'Tus políticas ayudaron, pero no fueron suficientes. Tal vez gastaste poco, o subiste las tasas demasiado pronto. Keynes te mira con una mezcla de aprobación y frustración. "Vas por buen camino. Pero la recuperación requiere convicción. No puedes estimular a medias."',
      scores: { empleo: 60, inflacion: 65, crecimiento: 55 },
      history:
        'La lección de Keynes: cuando el desempleo es alto, el gobierno debe gastar DÉFICIT. No importa la deuda en el corto plazo. Lo importante es romper la espiral deflacionaria. Países que aplicaron estímulos fiscales agresivos se recuperaron antes que los que aplicaron austeridad.',
    },
    wrong: {
      id: 'wrong',
      concept: 'demandaAgregada',
      headlineWin: 'LA DEPRESIÓN SE PROFUNDIZA — LA AUSTERIDAD NO FUNCIONA',
      resultText:
        'Aplicaste políticas de austeridad en el peor momento. Subiste tasas, recortaste gasto, esperaste que el mercado se ajustara solo. El desempleo subió, la economía se contrajo, la inflación no importaba porque no había consumo. Keynes cierra su libro con tristeza. "Me temo que no entendiste. En una depresión, la paradoja del ahorro destruye todo: cuanto más ahorra cada uno, menos ahorra el conjunto."',
      scores: { empleo: 20, inflacion: 40, crecimiento: 15 },
      history:
        'Keynes llamó "paradoja del ahorro" a esto: cuando todos ahorran por miedo, nadie gasta y la economía se contrae. Lo que es bueno para un individuo (ahorrar) es malo para la economía (nadie consume). La solución: que el gobierno gaste para compensar. La austeridad en una depresión, decía, es como sangrar a un paciente anémico.',
    },
  },
  policies: [],
}
