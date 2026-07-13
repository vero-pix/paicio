# PAICIO — Concepto de la línea "Microeconomía"

**Fecha:** 2026-07-09 · Documento de diseño (decisión: "hagamos el concepto").
Definir ANTES de construir, para no repetir el scaffold ciego del auto-mode.

## Por qué una línea propia

Hoy la microeconomía está diluida dentro de `origins`, que mezcla escalas: micro
(Smith/alfileres, Ford/línea de montaje) con macro (Keynes/demanda, Friedman/regla
monetaria). `origins` funciona mejor como **línea de tiempo del pensamiento
económico** (una historia de pensadores, 1776→1976). La micro necesita otra cosa:
una línea **concept-first** que enseñe cómo funcionan los mercados y las empresas
a escala pequeña — precio, competencia, incentivos, estrategia.

## Decisión de arquitectura recomendada

**No canibalizar `origins`.** La fábrica de alfileres (1776) es el arranque
natural de "cómo nació la economía": sacarla deja a `origins` sin su inicio.
Recomiendo construir Micro con **episodios nuevos** enfocados en mecánica de
mercado (que `origins` no cubre), y dejar alfileres/montaje donde anclan la
historia. Así las dos líneas quedan sanas y aditivas, sin duplicar.

Alternativas: (a) mover alfileres+montaje a Micro (gutea origins — no recomendado);
(b) cross-list en ambas (requiere refactor: hoy `episode.line` es un solo id).

## Identidad de la línea (para `src/data/lines.js`)

```
id: 'micro'
name: 'Microeconomía'
subtitle: 'Cómo funcionan los mercados'
desc: 'Antes de gobernar un país, entiende la pieza mínima: un precio, un
  vendedor, una decisión. Por qué suben los arriendos, por qué el único
  almacén cobra más, por qué lo que conviene a cada uno arruina a todos.'
icon: '⚖️'  (balanza — a definir con Claude Design)
gradient: [tono a definir con la paleta LatAm luminosa]
```

## Roster propuesto (5 episodios, un verbo distinto cada uno)

Mantiene el principio mecánica=lección y aporta al dinamismo (verbos variados).

1. **El Precio Justo** — Oferta y demanda / equilibrio de mercado.
   - Verbo: **aguja/balance** — mueves el precio hasta vaciar el mercado (ni cola
     ni góndola llena). Ves escasez/excedente en vivo.
   - Ancla: un mercado cotidiano (arriendos, feria).
   - Lección: el precio no es capricho; lo fija dónde se cruzan oferta y demanda.

2. **El Único Vendedor** — Monopolio vs competencia / poder de mercado.
   - Verbo: **slider de precio sobre curva de demanda** — subes precio, ganas
     margen pero pierdes volumen; busca el óptimo.
   - Ancla: la única farmacia del pueblo.
   - Lección: por qué el monopolista cobra de más y qué cambia con competencia.

3. **La Cuenta de Todos** — Externalidades / tragedia de los comunes.
   - Verbo: **reparto/regulación** — impuesto o cuota para internalizar el daño
     (contaminación, congestión, sobrepesca) sin matar la actividad.
   - Ancla: un río compartido / pesca.
   - Lección: lo que conviene a cada uno puede arruinar a todos; el rol del Estado.

4. **El Dilema** — Teoría de juegos / comportamiento estratégico.
   - Verbo: **decisión con contraparte que reacciona** (swipe/elige; la otra
     empresa responde). Reintroduce teoría de juegos ligera (el prisionero se
     borró; vuelve como concepto, no como el subsistema viejo).
   - Ancla: dos gasolineras que deciden coludir o competir.
   - Lección: por qué colaborar es difícil aunque convenga a ambos.

5. **La Elección** — Costo de oportunidad / utilidad (episodio-tutorial de la línea).
   - Verbo: **arrastrar/asignar** un presupuesto personal entre deseos que compiten.
   - Ancla: el bolsillo del jugador.
   - Lección: todo tiene un costo en lo que dejas de hacer. Buen primer episodio.

## Orden de la línea (criterio explícito)

Pedagógico, de lo simple a lo estratégico: **La Elección → El Precio Justo → El
Único Vendedor → La Cuenta de Todos → El Dilema.** (Individuo → mercado →
estructura de mercado → sociedad → estrategia.) Mostrar el criterio al jugador.

## Relación con `origins`

`origins` queda como **historia del pensamiento** (Smith → Marx → Ford → Keynes →
Friedman), intacta. Micro es **conceptos de mercado**, presente y atemporal. Se
complementan: origins responde "de dónde vienen las ideas", Micro "cómo funciona
el mercado hoy".

## Decisiones abiertas [requieren tu OK]

1. ¿Construir Micro con 5 episodios nuevos (recomendado) o migrar alfileres/montaje?
2. ¿5 episodios o arrancar con 3 (Elección, Precio Justo, Único Vendedor) y crecer?
3. Nombre de la línea: "Microeconomía" vs algo más lúdico (ej. "El Mercado",
   "Piezas Mínimas").

## Implementación (cuando apruebes)

- Agregar la entrada `micro` a `LINES` en `src/data/lines.js` (orden según decisión
  de comprensión: si origins va primero, Micro puede ir tras origins como
  "fundamentos" antes de las crisis).
- Cada episodio: archivo nuevo con `line: 'micro'`, `numero` según el orden de
  arriba, mecánica propia (reusar verbos de MECANICAS-DINAMISMO.md donde calce).
- NO auto-scaffold: diseñar contenido y eventos episodio por episodio, con tu
  revisión de los mazos.
- Cada release: versión + novedad, verificar en navegador, `vercel --prod --yes`.
```
