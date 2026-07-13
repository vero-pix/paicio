# PAICIO — Mecánicas para dar dinamismo (referencia de diseño)

**Fecha:** 2026-07-09 · **Estado base:** v0.26.0, 14 episodios jugables en prod.

## Diagnóstico

PAICIO tiene **13 motores de mecánica distintos** pero casi **un solo verbo de
interacción**: en la práctica todo se juega igual — *tocas un botón cada turno y
miras medidores*. Ninguna mecánica usa drag, slider ni tiempo real (solo
`VolatilityDance` roza animación con `requestAnimationFrame`; `sequence` de Ep5 es
un reordenamiento). Por eso el juego se siente plano pese a la variedad temática.

**El dinamismo NO sale de un motor #14. Sale de verbos de interacción nuevos.**

## Principios a preservar (no romper)

- **La mecánica ES la lección** (balance 70% juego / 30% lección). Cada verbo
  nuevo debe enseñar un concepto económico, no ser adorno.
- **Mobile, una mano.** Gestos pulgar-friendly (swipe, tap, drag vertical corto).
- **Prototipar → validar → replicar.** Un verbo nuevo se prueba en UN episodio,
  se valida que engancha, y recién ahí se esparce. No rethematizar las 14 de una.
- **Copy:** español chileno con tuteo (jamás voseo). Sin jerga corporativa.
- **Reusar la infraestructura:** `useGameLayer`/`gameLayer` (score, momentum,
  combo, jugo), `EventCard`, `candyKit`. No reinventar el game-feel.

## Verbo actual (inventario)

Turn-based button choice: hyperinflation, bankRun, speculativeAttack (Ep3/Ep6),
expectations, shockTherapy, pinFactory, assemblyLine, surplusValue,
aggregateDemand, monetaryRule, pensionReform. · Reorder puzzle: sequence (Ep5).
· Semi-real-time: volatilityDance (Ep13).

---

## Archetipos propuestos

Orden por ratio impacto/esfuerzo. Empezar por el #0.

### 0. Deck tipo swipe (Reigns) para las cartas de evento — EMPEZAR AQUÍ
- **Verbo:** swipe izquierda/derecha.
- **Qué es:** NO es mecánica nueva. Reencuadra la capa de eventos que ya existe
  (`EventCard`) como un mazo que deslizas; cada swipe mueve medidores.
- **Enseña:** decisiones con consecuencias inmediatas (ya lo hace el contenido).
- **Dónde:** transversal a las 14 (reutiliza toda la data de eventos existente).
- **Esfuerzo:** BAJO. Mayor ganancia de "feel" por el menor costo.
- **Impl.:** capa de gesto sobre `EventCard`; prototipar en 1 episodio con eventos
  de decisión (ej. Ep2 Argentina) detrás de flag, luego habilitar en todas.

### 1. Repartir el presupuesto (sliders)
- **Verbo:** drag / slider.
- **Qué es:** arrastras un pool fijo entre demandas que compiten; consecuencias
  en vivo.
- **Enseña:** costo de oportunidad, trade-offs fiscales, restricción presupuestaria.
- **Dónde:** episodio de austeridad/ajuste fiscal (nuevo o reencuadre de uno de
  teoría, ej. Demanda Agregada).
- **Esfuerzo:** MEDIO. Muy mobile.

### 2. Ventana de oportunidad (timing)
- **Verbo:** reacción / tap en el momento justo.
- **Qué es:** un indicador se mueve; tocas a tiempo para devaluar / subir tasas /
  intervenir.
- **Enseña:** el costo de actuar tarde o temprano — corazón de defender la paridad.
- **Dónde:** Chile (Ep3) / México (Ep6), que hoy usan speculativeAttack por turnos.
- **Esfuerzo:** MEDIO.

### 3. Corrida bancaria en tiempo real
- **Verbo:** tap bajo presión (mini tower-defense).
- **Qué es:** los retiros aparecen en cola; inyectas liquidez o cierras
  ventanillas antes de que desborde.
- **Enseña:** contagio, iliquidez, por qué el corralito.
- **Dónde:** Ep2 Argentina (convierte bankRun de turnos a visceral).
- **Esfuerzo:** MEDIO-ALTO (requiere loop de tiempo real y balance de dificultad).

### 4. Presiona tu suerte (la imprenta)
- **Verbo:** riesgo escalante (push-your-luck).
- **Qué es:** "¿una ronda más de imprimir?" Cada vez pagas hoy pero sube la
  probabilidad de reventar; cobras antes del colapso.
- **Enseña:** hiperinflación y la seducción de la máquina de imprimir.
- **Dónde:** Ep1 La Gran Quema (reencuadre de hyperinflation).
- **Esfuerzo:** MEDIO. Alta tensión emocional.

### 5. Mantener el equilibrio (aguja)
- **Verbo:** balanceo continuo (empujar izq/der).
- **Qué es:** sostienes una aguja al centro entre dos fuerzas mientras los shocks
  la mueven.
- **Enseña:** trade-off inflación vs desempleo (Phillips) o paridad vs reservas;
  la regla monetaria.
- **Dónde:** Regla Monetaria (Ep12) / Demanda Agregada (Ep11).
- **Esfuerzo:** MEDIO-ALTO.

---

## Secuencia recomendada

1. **#0 Swipe** — toca las 14 barato, valida que el gesto sube el enganche.
2. **#4 Imprenta push-your-luck** en Ep1 — primer verbo nuevo, alto retorno.
3. **#1 Sliders** en un episodio fiscal — segundo verbo.
4. Medir con testers antes de esparcir. Recién ahí #2/#3/#5.

Cada cambio: subir versión en `src/data/version.js` con novedad, verificar en
navegador, y `vercel --prod --yes` tras push.
