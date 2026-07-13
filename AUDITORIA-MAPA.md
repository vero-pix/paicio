# PAICIO — Auditoría de arquitectura del mapa y contenido

**Fecha:** 2026-07-09 · **Estado base:** v0.29.0 en prod (pressYourLuck en Ep1, swipe global).

Auditoría fundada en el código (`src/data/lines.js`, `src/data/episodes/*`), no en
impresiones. Cada decisión de producto marcada **[requiere tu OK]** lleva mi
recomendación por defecto; puedes vetarla.

## Hallazgos

### A. Dos líneas sanas, dos huérfanas
- `crisis` (Crisis Latinoamericanas): 7 episodios. Sana.
- `origins` (Orígenes): 5 episodios. Sana.
- `chile` (Chile): **1 episodio** (ep13, cobre 1971). Huérfana.
- `norte` (El Norte): **1 episodio** (ep14, pensiones 2025). Huérfana.

Las descripciones de las huérfanas prometen mundos enteros — Chile: "del cobre a
las AFP, de Allende a los Chicago Boys"; El Norte: "Australia, Suiza, Singapur,
Noruega" — pero cada una tiene un solo nodo. Eso es lo que se siente
"desconectado": líneas medio vacías con un punto solitario.

### B. Chile está partido en dos
La crisis chilena de 1982 (ep3, `speculativeAttack`) vive dentro de `crisis`,
mientras el cobre 1971 (ep13) está en la línea `chile`. Chile fragmentado entre
dos líneas: una promete identidad chilena completa y tiene 1 episodio; el otro
episodio chileno está en la línea de al lado.

### C. El orden es implícito e inconsistente
- `origins`: los `numero` siguen la cronología (1776→1867→1913→1936→1976). Se lee
  como línea de tiempo del pensamiento económico. Correcto.
- `crisis`: los `numero` (1–7) NO son cronológicos (Bolivia 85, Argentina 01,
  Chile 82, Brasil 87, Brasil 94, México 94, Perú 90). Es un orden de
  dificultad/onboarding — legítimo, pero no declarado.
- Ningún criterio es visible para el jugador, por eso se siente arbitrario.

### D. Microeconomía diluida
`origins` mezcla escalas: MICRO (Smith/alfileres = división del trabajo;
Ford/línea de montaje = productividad) con MACRO (Keynes/demanda agregada;
Friedman/regla monetaria). No hay sección de microeconomía propia.

### E. Coherencia mecánica-narrativa
Ep1 declara `rondas: 8` / `meses: 8` con solo **4 acciones fijas** (imprimir,
ajuste, renegociar, reforma). 8 turnos entre las mismas 4 opciones se siente
repetitivo, y con la nueva mecánica `pressYourLuck` ese marco "8 meses × 4
políticas" quedó como resabio del modelo viejo por turnos. Revisar conteo/acciones
para que calce con el verbo nuevo, y auditar el resto (varios en rondas 6/8).

## Decisiones de producto

### 1. Líneas huérfanas (Chile, El Norte) — [requiere tu OK]
**Recomendación:** no mostrar líneas de un solo nodo. Marcarlas "En construcción"
con su episodio jugable + nodos "próximamente" con candado, hasta que cada una
tenga 3+ episodios. Alternativas: (a) ocultarlas del todo por ahora; (b)
rellenarlas con contenido ya (riesgo: más episodios sin validar).

### 2. Sección de microeconomía — [requiere tu OK]
**Recomendación:** diseñar antes de construir. Definir la línea Micro en un doc
(qué conceptos, qué mecánicas, qué episodios extraer de `origins`) y recién ahí
programar, para no repetir el scaffold ciego del auto-mode. Alternativas: (a)
nueva línea Micro ya, extrayendo alfileres y línea de montaje; (b) dejar todo en
`origins`.

### 3. Orden de líneas — [requiere tu OK]
Fork real (no lo decido por ti):
- **Origins primero** (tu instinto): orden de aprendizaje — la economía nace en
  1776, aprendes los conceptos y luego los aplicas en las crisis.
- **Crisis primero** (actual): orden de enganche — las crisis LatAm son el hook
  emocional y la identidad del producto; la teoría de Orígenes es más árida para
  un primer minuto casual.
Mi lectura: para un juego casual, el hook manda en la primera sesión, pero si el
público es educativo/aula, aprendizaje manda. Decides según tu público objetivo.

En ambos casos: hacer el criterio de orden **explícito y legible** (mostrar el
año, marcar "empieza aquí").

## Plan por fases (tras tus decisiones)

1. **Fix de IA de líneas** (rápido, alto valor): resolver huérfanas + orden.
2. **Coherencia Ep1** (turnos vs acciones de pressYourLuck) y barrido del resto.
3. **Diseño de línea Micro** (doc) → luego construcción.
4. Continuar verbos nuevos (sliders Ep11 en curso) en paralelo, sin bloquear.

Cada cambio: subir versión en `src/data/version.js` con novedad, verificar en
navegador, `vercel --prod --yes` tras push.
