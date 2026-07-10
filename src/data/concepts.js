// Glosario de conceptos económicos de todos los episodios.
// Cada concepto aparece en contexto, nunca como clase. Máximo 2 líneas de cuerpo.

export const concepts = {
  // ── Episodio 1 — La Gran Quema (Weimar 1923) ──────────────────────────
  hiperinflacion: {
    title: 'Hiperinflación',
    short: 'Inflación tan rápida que el dinero pierde valor de una hora a otra.',
    body: 'Convencionalmente, sobre 50% mensual. El pan que cuesta 500 en la mañana cuesta 4.800 en la tarde: nadie quiere guardar dinero, todos quieren gastarlo ya.',
  },
  senoreaje: {
    title: 'Señoreaje',
    short: 'La ganancia que obtiene el Estado al imprimir dinero nuevo.',
    body: 'Como imprimir cuesta casi nada y el billete vale más, el gobierno se financia emitiendo. Pero abusar del señoreaje es exactamente lo que destruye la moneda.',
  },
  nash: {
    title: 'Equilibrio de Nash',
    short: 'Un resultado en el que nadie gana cambiando su jugada por su cuenta.',
    body: 'En el dilema del prisionero, (Traicionar, Traicionar) es el equilibrio de Nash: ambos terminan peor que cooperando, pero ninguno se atreve a ceder primero.',
  },
  dilemaIterado: {
    title: 'Dilema del prisionero iterado',
    short: 'El mismo dilema, jugado muchas veces con la misma persona.',
    body: 'Cuando sabes que te volverás a encontrar, cooperar hoy compra confianza para mañana. La reputación cambia el juego: traicionar deja de pagar.',
  },
  ancla: {
    title: 'Ancla monetaria',
    short: 'Atar la moneda a algo fijo (oro, otra divisa) para frenar la inflación.',
    body: 'Cuando la moneda tiene un ancla creíble —un tipo de cambio fijo, un respaldo o una regla firme—, el gobierno ya no puede imprimir sin límite. Frena la inflación rápido, pero el ajuste suele traer recesión.',
  },
  equilibrioMercado: {
    title: 'Precio de equilibrio',
    short: 'El precio donde lo que se ofrece calza con lo que se quiere comprar.',
    body: 'Si el precio está por encima, sobra (excedente); si está por debajo, falta (escasez y colas). En el cruce de oferta y demanda el mercado "se vacía": se vende justo lo que hay. Ese punto se mueve cuando cambian los gustos, el ingreso o los sustitutos.',
  },
  poderMercado: {
    title: 'Poder de mercado',
    short: 'La capacidad de un vendedor de fijar el precio por encima del costo.',
    body: 'Un monopolista (único vendedor, sin sustituto) elige el precio que maximiza su ganancia, y ese precio queda por encima del competitivo. La competencia le quita ese poder: cuando la gente puede comparar, el precio baja hacia el costo.',
  },
  costoOportunidad: {
    title: 'Costo de oportunidad',
    short: 'Lo mejor que dejas fuera cada vez que eliges algo.',
    body: 'Como los recursos (plata, tiempo) son limitados, elegir una cosa es renunciar a otra. El costo real de una decisión no es solo su precio: es la mejor alternativa que sacrificaste. Vale para tu bolsillo, tu tiempo y hasta para un país.',
  },
  indexacion: {
    title: 'Indexación salarial',
    short: 'Subir los salarios automáticamente según la inflación.',
    body: 'Protege a los trabajadores hoy, pero si los precios suben porque los salarios suben porque los precios suben… alimenta la espiral. Es gasolina y extintor a la vez.',
  },
  condicionalidad: {
    title: 'Condicionalidad del FMI',
    short: 'El préstamo llega solo si aceptas las condiciones del prestamista.',
    body: 'Austeridad, recortes, privatizaciones. Estabiliza las cuentas y da credibilidad externa, pero el costo social y político lo pagas tú, no el Fondo.',
  },
  credibilidad: {
    title: 'Credibilidad institucional',
    short: 'Que la gente crea que tu plan se va a cumplir de verdad.',
    body: 'Una reforma monetaria funciona solo si todos confían en la nueva moneda. Sin instituciones creíbles, la nueva moneda se quema tan rápido como la vieja.',
  },

  // ── Episodio 2 — El Corralito de Paicio (Argentina 2001) ──────────────
  corridaBancaria: {
    title: 'Corrida bancaria',
    short: 'Todos corren al banco al mismo tiempo a sacar su dinero.',
    body: 'Si todos quieren retirar a la vez, el banco quiebra — porque prestó los depósitos. Lo irónico: la corrida sucede porque la gente teme que suceda. El miedo se auto-cumple.',
  },
  riesgoSoberano: {
    title: 'Riesgo soberano',
    short: 'La probabilidad de que un país no pague su deuda.',
    body: 'Cuando el riesgo sube, los mercados exigen tasas más altas para prestarle. En algún punto, las tasas se vuelven impagables y el default pasa de posibilidad a inevitabilidad.',
  },
  convertibilidad: {
    title: 'Convertibilidad',
    short: 'Fijar por ley que tu moneda vale exactamente igual que otra (ej: 1 peso = 1 dólar).',
    body: 'Funciona para matar la inflación, pero ata las manos: si tu economía pierde competitividad, no puedes devaluar. Argentina la mantuvo 10 años hasta que implosionó.',
  },
  cuasiMoneda: {
    title: 'Cuasi-moneda',
    short: 'Bonos provinciales que circulan como dinero cuando el dinero real no alcanza.',
    body: 'Patacones, Lecop, Quebracho — las provincias argentinas imprimieron sus propios billetes en 2001. Funcionan porque la gente necesita algo con qué pagar, aunque no sea "dinero de verdad".',
  },

  // ── Episodio 4 — La Década Perdida (Brasil 1987) ──────────────────────
  indexacionInercial: {
    title: 'Indexación inercial',
    short: 'Ajustar todos los precios de hoy por la inflación de ayer.',
    body: 'Cada contrato, alquiler y salario se ata a un índice. El problema: como todos ajustan por la inflación pasada, la inflación pasada se reproduce automáticamente en el futuro. Es la serpiente que se muerde la cola.',
  },
  memoriaInflacionaria: {
    title: 'Memoria inflacionaria',
    short: 'La gente recuerda la inflación pasada y actúa como si fuera a repetirse.',
    body: 'Después de años de inflación alta, la gente sube precios preventivamente, pide aumentos antes de que los precios suban, y desconfía de cualquier plan. La memoria es más fuerte que la realidad.',
  },
  expectativasAdaptativas: {
    title: 'Expectativas adaptativas',
    short: 'Predecir el futuro mirando el pasado reciente.',
    body: 'Si la inflación fue 20% el mes pasado, espero 20% este mes y subo precios un 20% preventivo. Si todos hacen lo mismo, la profecía se cumple sola. Para romper el ciclo hay que romper la expectativa.',
  },
  populismoFiscal: {
    title: 'Populismo fiscal',
    short: 'Gastar más de lo que se recauda para ganar votos.',
    body: 'El gasto público sube antes de cada elección y la cuenta se paga con emisión e inflación después. El ciclo político alimenta el ciclo inflacionario. El que gana las elecciones hereda la bomba.',
  },

  // ── Episodio 3 — El Milagro que No Fue (Chile 1982) ───────────────────
  riesgoMoral: {
    title: 'Riesgo moral',
    short: 'Tomar más riesgos porque sabes que alguien más pagará las consecuencias.',
    body: 'Los bancos se endeudaron en dólares sabiendo que si todo salía mal, el Estado los rescataría. Si los rescatas, confirmas la lógica: la próxima crisis será peor.',
  },
  descalceMoneda: {
    title: 'Descalce de monedas',
    short: 'Endeudarse en dólares pero ganar en pesos.',
    body: 'Los bancos chilenos pidieron dólares baratos y los prestaron en pesos. Cuando el dólar subió, la deuda explotó. Es como alquilar en dólares con sueldo en pesos.',
  },
  cicloAugeCaida: {
    title: 'Ciclo de auge y caída',
    short: 'El crecimiento exagerado de hoy siembra la crisis de mañana.',
    body: 'El boom del crédito barato infla activos. Cuando la fiesta termina — porque las tasas suben o el capital sale — la caída es proporcional al auge. La euforia es parte del ciclo.',
  },
  ajusteEstructural: {
    title: 'Ajuste estructural',
    short: 'Reformas profundas exigidas por el FMI a cambio de financiamiento.',
    body: 'Recorte del gasto público, privatizaciones, apertura comercial. Estabiliza las cuentas externas pero el costo social es inmediato y concentrado en los más vulnerables.',
  },
  ataqueEspeculativo: {
    title: 'Ataque especulativo',
    short: 'Los mercados apuestan contra una moneda que creen sobrevaluada.',
    body: 'Si la paridad fija parece insostenible, los especuladores venden la moneda esperando la devaluación. Defenderla quema reservas (intervención) o empleo (tasas altas). Es una guerra de desgaste: tarde o temprano el banco central se queda sin munición.',
  },
  terapiaShock: {
    title: 'Terapia de shock',
    short: 'Estabilizar de golpe: liberar precios, cortar subsidios y frenar la emisión, todo de una vez.',
    body: 'En vez de ajustar gradualmente, se aplica todo junto y rápido para quebrar la inercia inflacionaria y recuperar credibilidad. Puede frenar la hiperinflación en seco, pero el costo social inicial es brutal: los precios se disparan al liberarse y el empleo cae. Perú lo vivió con el "Fujishock" de 1990.',
  },
  trinidadImposible: {
    title: 'La trinidad imposible',
    short: 'No puedes tener a la vez tipo de cambio fijo, libre movimiento de capitales y política monetaria propia.',
    body: 'Solo se pueden elegir dos de los tres. Chile fijó el cambio y abrió los capitales, así que perdió el control monetario. Cuando el mundo subió las tasas, no pudo responder y la paridad se quebró.',
  },

  // ── Episodio 5 — El Plan Real de Paicio (Brasil 1994) ─────────────────
  unidadCuenta: {
    title: 'Unidad de cuenta',
    short: 'Una referencia estable para fijar precios, separada del medio de pago.',
    body: 'La URV no era dinero — era un índice. Si todos fijan precios en URV y la URV es estable, la inflación del cruzeiro deja de importar. Es como cotizar en dólares sin adoptar el dólar.',
  },
  reformaMonetaria: {
    title: 'Reforma monetaria',
    short: 'Cambiar la moneda para romper la inercia inflacionaria.',
    body: 'Cinco planes lo intentaron congelando precios. El Plan Real lo hizo distinto: primero desindexó la economía con la URV, después cambió la moneda. El orden lo cambió todo.',
  },
  confianzaPublica: {
    title: 'Confianza pública',
    short: 'Que la gente crea que la nueva moneda conservará su valor.',
    body: 'Una moneda vale lo que la gente cree que vale. Si nadie confía en el Real, todos vuelven al cruzeiro y la reforma fracasa. La confianza es el mecanismo de transmisión del plan.',
  },
  anclaNominal: {
    title: 'Ancla nominal',
    short: 'Un precio fijo (tipo de cambio, índice) que ancla las expectativas de inflación.',
    body: 'Si el Real se fija al dólar, la gente espera que los precios en reales se comporten como los precios en dólares. El ancla coordina expectativas y rompe la inercia — mientras sea creíble.',
  },

  // ── Episodio 14 — Pensiones: La Cuenta que Crece (modelos globales) ────
  pensiones: {
    title: 'Diseño de pensiones',
    short: 'El resultado de un sistema de pensiones depende más de sus reglas que de cuánta plata entra.',
    body: 'Con el mismo aporte, un sistema puede jubilar a la gente con el doble que otro. La diferencia está en el diseño: comisiones bajas, competencia real, inversión global diversificada y un pilar solidario para quien no alcanza a acumular. Australia, Canadá y Suecia lo demuestran.',
  },
}

