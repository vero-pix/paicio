# PAICIO — Hoja de ruta de episodios

Agregar esta sección al CLAUDE.md maestro. Define los 5 episodios del juego.
Episodio 1 ya está construido. Episodios 2-5 son la hoja de ruta — NO construir ahora,
solo documentar para que la arquitectura del código los soporte.

---

## ARQUITECTURA QUE DEBE SOPORTAR MÚLTIPLES EPISODIOS

> ✅ HECHO (jun 2026). La refactor data-driven está implementada:
> - `src/data/episodes/episode1.js` — episodio autocontenido (narrativa, ticker, prisioneros, políticas, contexto histórico).
> - `src/data/episodes/index.js` — registro con stubs bloqueados (Ep2-5).
> - Pantalla `EpisodeSelect` con episodios 2-5 bloqueados ("Próximamente").
> - Componentes (Cell, PolicyChoice, Outcome, ticker) leen del episodio activo; nada hardcodeado.
> - Estado en localStorage migrado a `paicio.state.v2` con `episodeId`.
>
> NOTA: los episodios 3 (empezar en la cima) y 5 (mecánica de secuencia) necesitarán
> código de componente nuevo, no solo data. Ver observación al pie.

Antes de construir más episodios, refactorizar para que cada episodio sea data, no código:

```
/src/data/episodes/
  episode1.js   ← La Gran Quema (existente)
  episode2.js   ← El Corralito de Paicio
  episode3.js   ← El Milagro que No Fue
  episode4.js   ← La Década Perdida
  episode5.js   ← El Plan Real de Paicio
```

Cada archivo de episodio exporta la misma estructura:
```js
export default {
  id, titulo, año, crisisHistorica, paisReferencia,
  setupNarrativo,
  ticker: { itemBase, precioInicial, tasaInflacion, umbralCritico },
  prisioneros: [...],   // 4 actores con utilityFunction
  politicas: [...],     // 3 opciones con efectos
  desenlaces: [...],    // finales posibles según coalición+politica
  contextoHistorico: {} // el panel "qué pasó en la realidad"
}
```

Los componentes (Cell, PrisonerList, NegotiationMatrix, PolicyChoice, Outcome)
leen del episodio activo. Cambiar de episodio = cambiar el objeto de data, no el código.

---

## EPISODIO 1 — LA GRAN QUEMA (construido)

- Referencia: Weimar, Alemania 1923
- Crisis: Hiperinflación
- Función pedagógica: tutorial — mecánica más visceral
- Concepto central: emisión monetaria y espiral inflacionaria

---

## EPISODIO 2 — EL CORRALITO DE PAICIO

- Referencia: Argentina 2001
- Crisis: Corrida bancaria y congelamiento de depósitos
- Setup: Los bancos de Paicio cierran. La gente no puede sacar su dinero.
  Hay cacerolazos en la calle. El presidente huyó en helicóptero.
  Te dejaron a cargo del Ministerio en el peor momento posible.

- Mecánica nueva: negociación en DOS frentes simultáneos
  - Los bancos (quieren que el Estado los rescate)
  - La gente en la calle (quiere su dinero de vuelta)
  - No puedes satisfacer a ambos — ese es el dilema

- Los 4 actores:
  - El Banquero — quiere rescate estatal sin condiciones
  - La Vecina del Cacerolazo — representa los ahorristas atrapados
  - El Acreedor Externo — la deuda soberana en default
  - El Gobernador Provincial — emite cuasi-moneda local (los "Patacones")

- Las 3 políticas:
  - Default + devaluación (Argentina real)
  - Dolarización total (Ecuador 2000)
  - Mantener convertibilidad a toda costa (lo que colapsó)

- Concepto central: confianza bancaria, corrida, riesgo soberano
- Conceptos secundarios: convertibilidad, cuasi-monedas, default selectivo

---

## EPISODIO 3 — EL MILAGRO QUE NO FUE

- Referencia: Chile 1975–1982
- Crisis: Colapso del modelo tras boom inicial
- Setup: Los "Chicago Boys" de Paicio aplicaron el modelo de libre mercado.
  Funcionó por años — crecimiento, inversión, optimismo. Luego llegó la crisis
  de deuda de 1982 y todo colapsó. Tú heredas el desastre. No lo causaste,
  pero ahora es tu problema.

- Mecánica nueva: el jugador NO empieza preso — empieza en la cima.
  El primer tercio del juego es mantener el éxito. Luego viene el colapso.
  Lección: la euforia es parte del ciclo.

- Los 4 actores:
  - El Tecnócrata — defiende el modelo aunque se hunda
  - El Banquero Endeudado — pidió dólares baratos, ahora no puede pagar
  - El Trabajador — perdió protección laboral en nombre de la eficiencia
  - El FMI — ofrece rescate con más austeridad

- Las 3 políticas:
  - Rescatar la banca privada con fondos públicos (lo que se hizo)
  - Dejar quebrar a los bancos (purismo de mercado)
  - Nacionalizar temporalmente (intervención pragmática)

- Concepto central: tipo de cambio fijo, deuda en dólares, descalce de monedas
- Conceptos secundarios: riesgo moral, rescate bancario, ciclo de auge y caída

---

## EPISODIO 4 — LA DÉCADA PERDIDA

- Referencia: Brasil 1980s
- Crisis: Inflación crónica y planes económicos fallidos en serie
- Setup: Paicio probó cinco planes económicos en una década. Cruzado, Bresser,
  Verão, Collor I, Collor II — todos fracasaron. La gente ya no cree en ningún plan.
  El presidente te pide un sexto plan. Sabes que los cinco anteriores fallaron.
  La presión política es lanzar algo ya, aunque sepas que va a fallar igual.

- Mecánica nueva: gestión de credibilidad agotada.
  Cada plan fallido previo reduce la confianza inicial de TODOS los actores.
  El jugador empieza con la barra de confianza casi vacía.
  La pregunta no es qué plan, sino cómo recuperar credibilidad antes de actuar.

- Los 4 actores:
  - El Ministro Saliente — diseñó el plan anterior que falló
  - El Indexador — la economía entera está atada a la inflación pasada
  - El Empresario Escéptico — ya no ajusta precios, solo los sube preventivamente
  - El Congreso — bloquea cualquier medida impopular

- Las 3 políticas:
  - Otro shock heterodoxo (congelar precios — lo que falló 5 veces)
  - Plan gradual con ancla cambiaria (camino al Plan Real)
  - Default interno y reestructuración de deuda pública

- Concepto central: indexación, inercia inflacionaria, credibilidad
- Conceptos secundarios: memoria inflacionaria, expectativas adaptativas

---

## EPISODIO 5 — EL PLAN REAL DE PAICIO

- Referencia: Brasil 1994 (Plan Real, Fernando Henrique Cardoso)
- Crisis: La oportunidad de terminar la inflación crónica de una vez
- Setup: Después de una década de fracasos, tienes una última oportunidad.
  El truco no es congelar precios — es algo más sutil. Crear una unidad de cuenta
  estable (la URV) que conviva con la moneda vieja antes de hacer el cambio.
  Si lo haces en el orden correcto, ganas. Por primera vez en el juego,
  la victoria total es posible.

- Mecánica nueva: SECUENCIA correcta.
  No es elegir una política — es ordenar varias en la secuencia correcta.
  El jugador tiene 4 acciones y debe ejecutarlas en el orden exacto.
  Orden incorrecto = fracaso. Orden correcto = el único final feliz del juego.

- Los 4 actores (aquí son aliados potenciales, no obstáculos):
  - El Economista Joven — diseñó la URV, necesita respaldo político
  - El Presidente — te dará autonomía SI le garantizas que funciona
  - El Pueblo — desconfía después de 5 planes fallidos
  - El Mercado — apostará a favor o en contra según tu credibilidad

- La mecánica de secuencia:
  1. Crear la unidad de cuenta estable (URV)
  2. Dejar que precios y salarios migren voluntariamente
  3. Anclar la nueva moneda al dólar
  4. Convertir la URV en la moneda definitiva (el Real)

- Concepto central: unidad de cuenta vs medio de pago, desindexación voluntaria
- Conceptos secundarios: ancla nominal, reforma monetaria exitosa, expectativas

- Función narrativa: cierre del arco. Paicio finalmente vence la inflación.
  El jugador que llega hasta aquí entendió, sin que se lo dijeran, por qué
  unos planes funcionan y otros no.

---

## ARCO NARRATIVO GLOBAL

El orden de los episodios refleja el arco real de América Latina en el siglo XX:

1. Hiperinflación extrema (caos monetario)
2. Crisis de confianza bancaria (caos financiero)
3. Ideología aplicada y su colapso (caos del modelo)
4. Fracaso crónico y credibilidad agotada (caos institucional)
5. La solución que finalmente funcionó (orden recuperado)

El jugador no aprende fechas ni teoría. Aprende la lógica de las crisis económicas
viviéndolas en orden. Para cuando llega al Episodio 5, entiende intuitivamente
por qué el Plan Real funcionó donde cinco planes anteriores fallaron.

---

## INSTRUCCIÓN DE IMPLEMENTACIÓN

NO construir los episodios 2-5 ahora. Primero:

1. Refactorizar Episodio 1 para que sea 100% data-driven (episode1.js)
2. Verificar que los componentes leen del episodio activo sin hardcodear nada
3. Crear un selector de episodios en pantalla inicial (episodios 2-5 bloqueados)
4. Solo después de validar tracción del Episodio 1, construir Episodio 2

La hoja de ruta queda documentada. La construcción es incremental y validada por uso.
