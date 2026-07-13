# UX Review — PAICIO

**Fecha:** 2026-07-11
**Revisor:** Lead UX Designer (20+ años en videojuegos educativos, serious games, diseño de producto)
**Metodología:** Nielsen Norman Group heuristics + Game UX específico + Diseño emocional + Accesibilidad

---

## 1. Primera impresión

- **App.jsx**: al entrar, si `activeLine === null`, se renderiza `LineSelect`. El jugador ve "PAICIO" grande, una moneda animada, total de estrellas, y un llamado a "ELIGE TU LÍNEA". Hay 5 tarjetas de líneas (Crisis, Orígenes, Chile, El Norte, Micro).
- **Lo que entiende en 5s**: ve un juego de economía con líneas temáticas. La moneda + wordmark dan identidad de marca.
- **Lo que confunde**: Las líneas "Chile" y "El Norte" tienen tarjetas que prometen muchos episodios ("del cobre a las AFP", "Australia, Suiza, Singapur") pero cada una tiene **un solo episodio**. El jugador entra a Chile esperando una línea completa y encuentra un nodo solitario. Eso genera **falsa expectativa**.
- **Qué cree que puede hacer**: elegir una línea y jugar episodios. Correcto.

---

## 2. Objetivo por pantalla

| Pantalla | ¿Claro? | Problema |
|----------|---------|----------|
| Intro / Bienvenida | Sí | Demasiado texto. 7 párrafos distintos. El jugador quiere jugar, no leer. |
| LineSelect | Sí | "ELIGE TU LÍNEA" es claro. Las tarjetas tienen icono + título + descripción. Correcto. |
| EpisodeSelect | Parcial | El mapa zigzag con nodos es visualmente atractivo pero el criterio de orden no es visible. ¿Por qué Bolivia 1985 está antes que Argentina 2001? No se explica. |
| Cell (briefing) | Parcial | Mucha información: chip de crisis, título, resumen, card oscura con precio, "Tu misión", antagonista con cita. 6 bloques de información antes del CTA. |
| HyperInflation/PrintPress | Parcial | Objetivo: "frena la inflación". Pero hay medidores, precio del pan, asesor, carta de evento, combo badge, botones de acción. El ojo no sabe por dónde empezar. |
| Outcome | Sí | Veredicto + estrellas + puntaje. Claro. |

---

## 3. Flujo de usuario

```
App → LineSelect → EpisodeSelect → Cell → Mechanic → Outcome
```

El flujo general es limpio. Problemas:

- **Cell es un paso que puede omitirse**. El jugador ya eligió el episodio en el mapa. La celda repite info que ya vio (país, año, crisis) y agrega el antagonista + misión. Tras varias partidas, este paso se siente como fricción.
- **Del Outcome no hay un "siguiente" claro en todos los casos**. Si ganas, te deja ir al siguiente o reintentar. Si pierdes, solo reintentar o volver al mapa. Pero no hay un camino directo a "jugar otro episodio de otra línea".
- **Falta un "tutorial de bienvenida" interactivo**. El Intro.jsx es un modal de solo lectura. No enseña a jugar jugando.

---

## 4. Carga cognitiva

**Clasificación general: Alta**

Razones:
- Pantalla HyperInflation tiene **8+ elementos distintos** que compiten por atención (top bar, game progress, inflación bar, apoyo bar, combo, precio del pan card, advisor bubble, event card, 4 action buttons, coach marks).
- Los valores numéricos requieren interpretación: inflación 68%, apoyo 55%, precio 24.800 Mk, delta +38%. El jugador necesita integrar 4+ métricas para tomar una decisión informada.
- Las acciones tienen telegrafiado ("Inflación +9", "Apoyo -14") que ayuda, pero aún así es mucha información por turno.
- SequenceChoice (Ep5) es el único episodio con carga **baja** (solo 4 items para ordenar).

**Problema específico**: En HyperInflation, el precio del pan es la "cifra protagonista" visual (más grande, en card oscura), pero **no es la métrica que gobierna el juego**. Las métricas reales son inflación y apoyo. El precio del pan es un subproducto visual. Esto crea una desconexión: lo que más brilla no es lo que importa.

---

## 5. Diseño visual

- **Jerarquía**: frágil. En Cell.jsx, el título (h1, 2.1rem) compite con la card oscura del precio. En HyperInflation, el precio del pan (2.1rem) es más grande que el título del episodio (1.3rem). Lo visual no siempre corresponde a lo funcional.
- **Contraste**: las card oscuras sobre fondo crema funcionan. Preocupación: `text-ink-soft` (#8A7357 según tokens) sobre fondo crema (#F3E2C2) puede tener contraste insuficiente (ratio estimado < 4.5:1).
- **Espaciado**: consistentemente usa gap-2, gap-3, mt-4, mt-5. Buen ritmo visual.
- **Tipografía**: Fredoka (round) para titulares y Nunito para texto. Buena elección. Tamaños pequeños en labels (0.58rem ≈ 9.3px, 0.62rem ≈ 9.9px) — **potencial problema de legibilidad** en mobile.
- **Consistencia**: alta. Los patrones candy, shadow-card, accent colors se repiten en todos los componentes.
- **Colores**: paleta cálida-luminosa bien definida. Los acentos por episodio dan identidad visual.
- **Iconografía**: mezcla de emojis e iconos SVG. Los emojis funcionan en prototipo pero no son consistentes entre plataformas (Android vs iOS renderizan distinto).

---

## 6. Game Feel

- **Puntaje corrido (score)**: presente en todas las mecánicas vía `useGameLayer`. Bien.
- **Monedas (Coins)**: burst y rain. Bien implementados.
- **Flash verde / shake**: feedback visual de acierto/error. Bien.
- **Combo badge**: racha de meses buenos. Bien.
- **Delta en medidores**: no hay micro-animación de "sube/baja" en los valores. El número cambia con pop, pero no hay un indicador visual de dirección (flecha verde/roja, +N/-N flotante como describe el design handoff).
- **Sonido**: sfx('coin'), sfx('alert'), sfx('fanfare'). Bien.
- **Animación de botón candy**: translateY + colapso de sombra en active. Bien.

**Problema de Game Feel**: a pesar de todos los jugos visuales, la interacción fundamental sigue siendo **tocar un botón → ver números cambiar**. No hay物理感 (physical feel): no hay drag, swipe, hold, tilt, ni respuesta háptica. El juego se siente como un panel de control, no como un mundo que reacciona.

---

## 7. Motivación

**Lo que incentiva:**
- Estrellas (progresión entre episodios)
- Score por partida (superar tu récord)
- "Casi" (near miss: "te faltó poco para N estrellas")
- Compartir resultado (tipo Wordle)
- Reto Diario (FOMO, misma partida para todos)
- Nuevo récord personal

**Lo que hace abandonar:**
- **Saturación de texto** en Intro y Cell. El jugador quiere jugar.
- **Falta de variedad de interacción**: 13 mecánicas pero todas se juegan igual (tap → wait → tap). La fatiga llega rápido.
- **1 episodio por línea en Chile y El Norte**: entras, juegas un episodio, y la línea se acaba. Sensación de vacío.
- **No hay consecuencia entre episodios**: tu desempeño en Bolivia 1985 no afecta Argentina 2001. No hay narrativa persistente.
- **Dificultad opaca**: los telegrafiados de acciones (previewAction en HyperInflation) muestran valores previstos, pero la incertidumbre del evento aleatorio desdibuja la predictibilidad. El jugador no sabe si su decisión fue buena o mala porque el evento del próximo mes puede anularla.

---

## 8. Aprendizaje

**Fortalezas:**
- La mecánica "La Imprenta" (pressYourLuck) **realmente enseña** la trampa de imprimir dinero: más alivio inmediato = más riesgo de colapso. Ejemplo de "mecánica = lección".
- Outcome compara tu resultado con la historia real. Excelente para aprendizaje.
- EducationalTooltip da contexto económico opcional sin interrumpir.

**Debilidades:**
- **La mayoría del aprendizaje es textual**. EducationalTooltip, outcome history, event card texto. El jugador puede ignorarlo todo y seguir "jugando".
- **Los conceptos económicos no se evalúan**. No hay checks de comprensión, no hay preguntas después de la partida. No sabes si el jugador realmente entendió qué es la hiperinflación o solo aprendió a no presionar "imprimir" muchas veces.
- **La secuencia de Ep5 (Plan Real) es un puzzle de orden, no enseña economía**. El jugador aprende a memorizar 4 pasos, no a entender la lógica de la URV, el real, o la estabilización monetaria. Es un juego de memoria disfrazado de lección económica.
- **Shock Therapy (Ep7) tiene un error grave**: `EduChip conceptId="ataqueEspeculativo"` debiera ser `terapiaShock`. El concepto incorrecto aparecerá en el tooltip.

---

## 9. Heurísticas de Nielsen

| Heurística | Estado | Explicación |
|------------|--------|-------------|
| 1. Visibilidad del estado del sistema | Cumple | Medidores visibles, score, mes/total, combo. |
| 2. Relación sistema-mundo real | Cumple | Crisis reales, lenguaje cotidiano ("pan", "apoyo"). |
| 3. Control y libertad del usuario | Cumple | Botón "Mapa", "Inicio", reintento, cancelar en confirmaciones. |
| 4. Consistencia y estándares | Cumple | Candy buttons, accent system, misma estructura en todas las mecánicas. **Problema menor**: mezcla de emojis e íconos SVG. |
| 5. Prevención de errores | Cumple parcial | Confirmación en SequenceChoice. Pero no hay confirmación en HyperInflation antes de gastar "renegociar" (tiene usos limitados). **Un tap y se fue**. |
| 6. Reconocer en vez de recordar | Cumple parcial | Los telegrafiados (previewAction) ayudan. Pero el jugador debe recordar qué hace cada acción entre meses. En turno 6, "imprimir" vs "ajuste" vs "renegociar" vs "reforma" requieren memoria de sus efectos acumulativos. |
| 7. Flexibilidad y eficiencia | No cumple | No hay atajos, no hay aceleradores para jugadores avanzados. Cada turno es la misma secuencia de taps. |
| 8. Estética minimalista | No cumple | Demasiados elementos en pantalla simultáneamente (ver carga cognitiva). |
| 9. Ayuda a reconocer errores | Cumple parcial | Shake en mala jugada. Pero no hay mensaje explicativo ("Imprimir fue un error porque la inflación ya estaba al 70%"). El jugador no aprende **por qué** fue mala. |
| 10. Ayuda y documentación | Cumple parcial | Coach marks, EducationalTooltip, Intro. Pero la ayuda es textual y opcional. No hay "¿por qué perdí?" al final. |

---

## 10. Accesibilidad

- **Contraste**: riesgo en `text-ink-soft` (#8A7357 aproximadamente) sobre fondo crema. En el design handoff se especifica ratio ≥ 4.5:1, pero no puedo verificar sin render real. **Recomendación**: verificar con axe DevTools o similar.
- **Tamaño de texto**: uso de 0.58rem (≈9.3px) en labels. Esto es **ilegible** para muchos usuarios. WCAG recomienda mínimo 12px para texto pequeño.
- **Uso del color**: scores usan solo color para indicar estado (verde/ámbar/rojo en `scoreColor`). Sin icono o textura adicional, un usuario daltónico no distinguirá 48 de 92.
- **Navegación**: todas las interacciones son `<button>` con aria-labels. Correcto.
- **Reduced motion**: el design handoff menciona respetar `prefers-reduced-motion`. No veo implementación en los componentes revisados. Las animaciones `pop`, `shake`, `flash` se ejecutan sin verificar la preferencia del usuario.

---

## 11. Diseño emocional

- **Curiosidad**: generada por los nombres de episodios, las líneas temáticas, los retratos de personajes.
- **Ansiedad**: por el ticker de inflación (bien), por los medidores que se acercan al rojo (bien).
- **Aburrimiento**: riesgo tras varios episodios, porque la interacción es monótona (tap → esperar → tap).
- **Diversión**: momentánea, en los momentos de combo, récord, o burst de monedas. No sostenida.
- **Confianza**: en la marca (look profesional, candy sistema consistente). Riesgo: la estimación del percentil ("estimado") puede minar la confianza.
- **Confusión**: en las líneas con 1 episodio (¿se acabó? ¿vienen más?), en el orden del mapa (¿por qué este orden?), en SequenceChoice (¿por qué este orden es el correcto?).

---

## 12. Hallazgos

| # | Problema | Sev. | Impacto | Solución |
|---|----------|------|---------|----------|
| 1 | Un solo verbo de interacción en 13 mecánicas | 5 | El juego se siente plano. Abandono por fatiga. | Implementar archetipos nuevos: swipe (Reigns), sliders (presupuesto), timing (reacción), push-your-luck ya implementado. Prioridad del doc MECANICAS-DINAMISMO.md |
| 2 | Carga cognitiva alta por pantalla | 4 | Jugador se abruma, no sabe por dónde empezar. | Simplificar. Reducir a 3-4 elementos máximos visibles. Colapsar info secundaria detrás de acordeones o tooltips. |
| 3 | Líneas Chile y El Norte: 1 episodio = falsa promesa | 4 | Fricción en el mapa. Expectativa vs realidad. | Marcar "En construcción" con nodos candado. O rellenar con episodios antes de mostrar. |
| 4 | Aprendizaje solo textual y opcional | 4 | El jugador puede "ganar" sin entender economía. | Agregar checks de comprensión post-partida. O preguntas incrustadas en la mecánica ("¿Por qué decidiste reformar ahora?"). |
| 5 | EducationalTooltip conceptId incorrecto en ShockTherapy | 4 | Muestra concepto equivocado. | Corregir `conceptId="ataqueEspeculativo"` → `"terapiaShock"` en ShockTherapy.jsx:147. |
| 6 | SequenceChoice (Ep5): puzzle de memoria, no lección económica | 4 | No enseña nada sobre el Plan Real. | Rediseñar la mecánica para que enseñe la lógica secuencial de la estabilización (URV → real → ancla). O reemplazar con mecánica que sí enseñe. |
| 7 | Texto en 0.58rem en toda la UI | 3 | Ilegible para adultos mayores, usuarios con baja visión. | Subir mínimo a 0.7rem (~11px). O usar `clamp()` para escalar con preferencia de usuario. |
| 8 | Sin verificación de `prefers-reduced-motion` | 3 | Animaciones pueden causar malestar. | Agregar `@media (prefers-reduced-motion: reduce)` en animaciones clave o usar `usePrefersReducedMotion` hook. |
| 9 | Score usa solo color para indicar estado | 3 | Daltonismo no detecta diferencia. | Agregar icono o patrón (check/triángulo/X) además del color. |
| 10 | Sin consecuencias entre episodios | 3 | El juego se siente como niveles inconexos. | Reputación acumulativa, bonificación por racha, consecuencias narrativas entre episodios. |
| 11 | Cell (briefing) es fricción innecesaria en repeticiones | 3 | Jugador que reintenta debe pasar por briefing otra vez. | Agregar "saltar briefing" o solo mostrar en primera visita al episodio. |
| 12 | Intro.jsx es 100% texto | 3 | Onboarding aburrido. | Reemplazar con mini-tutorial interactivo donde el jugador aprende haciendo. |
| 13 | No hay castigo visual causal en errores | 3 | Jugador no conecta acción → consecuencia. | Agregar animación causal: al imprimir, mostrar gráficamente la máquina encendiéndose, el pan subiendo, la gente protestando. |
| 14 | Percentil "estimado" en Outcome | 2 | Mina confianza. | Cambiar a "Tu puntaje: X de Y" o eliminar el "estimado". |
| 15 | Emojis como iconografía | 2 | Inconsistente entre plataformas. | Reemplazar con SVG propio o set unificado. |
| 16 | Sin aceleradores para jugadores avanzados | 2 | Jugador experto se frustra con la misma cadencia. | Agregar auto-resolve rápido, skip de animaciones, o "jugar rápido". |
| 17 | SwipeEvents mencionado en HyperInflation pero flag | 2 | Feature incompleto. | Completar implementación de swipe o eliminar la flag muerta. |
| 18 | No hay pantalla de "game over" narrativa | 2 | El shake + texto de fin se siente frío. | Agregar mini-cutscene o viñeta con consecuencias narrativas cuando pierdes. |
| 19 | Mapa: sin indicador de dificultad/orden | 1 | El jugador no sabe por qué orden jugar. | Agregar número de nivel, dificultad estimada, o recomendación. |
| 20 | EducationalTooltip al alcance de un tap, pero sin discoverability | 1 | El jugador no sabe que existe. | Agregar highlight en el primer tooltip del episodio o hacer que aparezca automáticamente la primera vez. |

---

## 13. Prioridades

### Críticos
1. **Un solo verbo de interacción** → implementar variedad de archetipos (swipe, slider, timing)
2. **Carga cognitiva alta** → simplificar pantallas, reducir elementos simultáneos
3. **SequenceChoice no enseña** → rediseñar mecánica del Plan Real
4. **ShockTherapy conceptId incorrecto** → arreglar bug

### Importantes
5. Líneas Chile y El Norte de 1 episodio
6. Aprendizaje solo textual y opcional (falta evaluación)
7. Accesibilidad: tamaño de texto mínimo, prefers-reduced-motion
8. Color-only indicators para daltónicos
9. Cell como fricción en repeticiones
10. Intro 100% texto → tutorial interactivo

### Deseables
11. Consecuencias entre episodios
12. Animaciones causales (acción → consecuencia visual)
13. Aceleradores para jugadores avanzados
14. Emojis → SVG propio
15. Pantalla de game over narrativa

### Ideas futuras
16. Multijugador / ranking global
17. Editor de episodios
18. Sistema de logros y trofeos
19. Narrativa persistente entre líneas
20. Versión nativa móvil (App Store)

---

## 14. Puntuación

| Dimensión | Nota | Explicación |
|-----------|------|-------------|
| **UX** | 6.5 | Flujo general bueno, pero carga cognitiva alta y verbos repetitivos lastran la experiencia. |
| **UI** | 7.5 | Sistema de diseño consistente, paleta agradable, candy buttons funcionan. Texto pequeño y saturación visual penalizan. |
| **Aprendizaje** | 5.5 | "Mecánica = lección" es un principio sólido y bien ejecutado en La Imprenta. El resto del aprendizaje es textual, opcional, no evaluado. |
| **Gamificación** | 6.0 | Estrellas, score, combo, récord, reto diario. Presentes pero sin profundidad. Falta sistema de logros, niveles de maestría, streak. |
| **Claridad** | 5.5 | Cada pantalla individual es clara, pero en conjunto hay competencia visual. El criterio de orden del mapa es opaco. |
| **Retención** | 4.5 | Reto Diario ayuda. Pero sin consecuencias entre episodios ni variedad de interacción, el jugador se va tras 3-4 episodios. |
| **Onboarding** | 4.0 | Intro 100% textual. Coach marks son texto superpuesto. No hay tutorial interactivo. El jugador no aprende jugando. |
| **Accesibilidad** | 4.0 | Texto muy pequeño en labels. Contraste incierto. Sin reduced-motion. Solo color para scores. |
| **Diversión** | 5.0 | Momentos de diversión (combo, burst de monedas, récord) pero no sostenida. La monotonía de interacción mata la diversión. |
| **Calidad general** | **5.5/10** | Tiene las bases correctas (sistema de diseño, filosofía pedagógica, contenido histórico), pero la ejecución sufre de sobrecarga informativa, monotonía interactiva y falta de profundidad en el aprendizaje. |

---

## Preguntas especiales para PAICIO

### 1. ¿Qué está aprendiendo realmente el jugador?
Está aprendiendo que **imprimir dinero causa inflación** y que **estabilizar requiere decisiones dolorosas** (en Ep1). En los demás episodios, está aprendiendo a **optimizar números** más que conceptos económicos. En Ep5, está aprendiendo a **memorizar un orden**, no economía.

### 2. ¿Qué cree que está aprendiendo, pero no?
Cree que está aprendiendo finanzas personales, política fiscal y teoría económica. En realidad está aprendiendo a **manipular sliders numéricos** (barras de vida). No hay transferencia de conocimiento al mundo real — el jugador no sabría qué es el señoreaje después de jugar, solo sabe que imprimir mucho = malo.

### 3. ¿Qué conceptos económicos podrían reforzarse mejor?
- **Costo de oportunidad**: ChoiceBudget (sliders) está implementado pero no hay momento de "mira lo que perdiste".
- **Externalidades**: ExternalityReg implementado pero el vínculo con la teoría es textual.
- **Teoría de juegos**: PriceWar existe pero el jugador no sabe que está jugando teoría de juegos.

### 4. ¿Qué partes parecen una clase tradicional en vez de un juego?
- **Intro.jsx** — todo el onboarding es texto instructivo.
- **EducationalTooltip** — es un libro de texto en miniatura.
- **Outcome history** — párrafo de historia económica.
- **El concepto de "mes X de 8"** — es un contador, no una sensación de tiempo pasando.

### 5. ¿Dónde se pierde la diversión?
En el **turno 4-5 de cualquier mecánica**, cuando el jugador ya entendió el patrón y solo ejecuta la acción óptima repetidamente. La mecánica revela su profundidad limitada.

### 6. ¿Qué mecánica podría reemplazar texto o explicaciones?
**PressYourLuck (La Imprenta)** es el mejor ejemplo: nadie necesita leer que imprimir dinero es malo — lo sientes cuando sube el riesgo de reventón. Eso debería ser el estándar para todas las lecciones.

### 7. ¿Qué haría Nintendo?
- **Onboarding sin texto**: mostraría al jugador qué hacer con un NPC que señala, animaciones que guían la mirada, y una primera acción forzada pero sin explicación.
- **Game Feel**: agregaría retumbe háptico (vibration API), swipe gestures con inercia, y reacciones físicas de los elementos (la barra de inflación no solo cambia de ancho, sino que la llama del icono crece y tiembla).
- **Menos, pero más**: una sola métrica protagonista en cada pantalla, no cuatro.

### 8. ¿Qué haría Duolingo?
- **Streaks**: "Llevas 3 días seguidos salvando a Paicio".
- **Notificaciones**: "La inflación subió mientras dormías".
- **Unidades y lecciones**: estructura tipo árbol de habilidades, no líneas paralelas.
- **XP y ligas**: ranking semanal entre jugadores.
- **Corazones**: 5 vidas que se recuperan con el tiempo (para limitar el fracaso barato y darle peso a cada decisión).

### 9. ¿Qué haría Supercell?
- **Skin personalizable**: moneda de diferentes colores, fondos desbloqueables.
- **Pases de temporada**: "Temporada: Crisis Latinoamericanas" con recompensa por completar episodios dentro del plazo.
- **Batallas asíncronas**: comparar tu resultado del Reto Diario con amigos.
- **Misiones secundarias**: "Completa Ep1 sin usar 'Imprimir'", "Termina Ep3 con apoyo sobre 80%".

### 10. Si el objetivo fuera calidad comercial
1. **Rediseñar el core loop**: 3-5 verbos de interacción (swipe, slider, timing, drag, tap-rápido) distribuidos entre las 19 mecánicas.
2. **Sistema de aprendizaje profundo**: después de cada episodio, 2 preguntas conceptuales integradas al gameplay (no tipo quiz) que verifiquen comprensión y desbloqueen contenido bonus.
3. **Campaña narrativa con consecuencias**: tus decisiones en Bolivia 1985 te persiguen en Argentina 2001 (si imprimiste mucho en Bolivia, el FMI desconfía en Argentina).
4. **Onboarding cinematográfico**: escena jugable de 30 segundos donde aprendes los 3 verbos básicos sin una sola palabra.
5. **Sistema de producción**: arte unificado (todos los retratos al mismo estilo), música dinámica que reacciona a los medidores, voz narrada para los eventos clave.
6. **QA y pulido**: animación de transición entre pantallas, sin parpadeos ni cargas en blanco, feedback táctil.

---

> **"Si tuviera presupuesto para mejorar solo tres cosas, invertiría en: (1) diversificar los verbos de interacción para que el juego deje de sentirse como tocar botones, (2) reemplazar todo el onboarding textual por una secuencia interactiva de 30 segundos que enseñe jugando, y (3) agregar consecuencias entre episodios para que la campaña tenga peso narrativo y el jugador sienta que sus decisiones importan más allá del turno actual."**
