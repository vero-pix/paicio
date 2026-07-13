# Changelog PAICIO — UX Review (Jul 2026)

**Producción:** https://paicio.vercel.app

---

## Fase 0 — Quick fixes

### Score icons accesibles
- **Archivo:** `Outcome.jsx`
- **Qué cambió:** Los scores ahora tienen íconos `✓` / `~` / `✗` además del color, para daltónicos.
- **Cómo probar:** Completar cualquier episodio → ver chips de Estabilidad/Empleo/Confianza.

### "estimado" → "referencia"
- **Archivo:** `Outcome.jsx`
- **Qué cambió:** Texto del percentil cambió de "estimado" a "referencia".

### Font size bump (0.52–0.58rem → 0.68rem)
- **Archivos:** `SequenceChoice.jsx`, `candyKit.jsx`, `HyperInflation.jsx`, `FeedbackButton.jsx`, `Buzon.jsx`, `ChoiceBudget.jsx`, `ExternalityReg.jsx`, `PensionReform.jsx`, `VolatilityDance.jsx`, `SoundToggle.jsx`
- **Qué cambió:** Texto secundario subió de tamaño para mejor legibilidad en mobile (~380px).

---

## Fase 1 — Onboarding

### Intro rediseñado (3-step carousel)
- **Archivo:** `Intro.jsx`
- **Qué cambió:** Reemplazo completo. Ahora es un carrusel visual con 3 pasos, pager (dots), botón saltar.
- **Cómo probar:** Abrir la app → ver onboarding. Tap "Saltar" para cerrar. Botón ? en partida para reabrir.

### Briefing saltable en repeticiones
- **Archivo:** `Cell.jsx`, `useGameState.js`
- **Qué cambió:** `Cell.jsx` guarda en localStorage qué briefings ya viste. En repeticiones salta directo a la mecánica.
- **Cómo probar:** Jugar episodio, perder, reintentar → no muestra la celda de briefing. Limpiar localStorage para resetear.

### Celda compacta (8 → 4 bloques)
- **Archivo:** `Cell.jsx`
- **Qué cambió:** Briefing reducido: chip de crisis + título, data card + misión fusionados, antagonista compacto, CTA.
- **Cómo probar:** Iniciar episodio nuevo → ver celda más corta.

---

## Fase 2 — Carga cognitiva

### GameProgress simplificado
- **Archivo:** `GameProgress.jsx`
- **Qué cambió:** Solo muestra puntaje + timeline (meses), sin métricas redundantes.
- **Cómo probar:** Jugar Ep1 → barra superior más limpia.

### Jerarquía visual HyperInflation
- **Archivo:** `HyperInflation.jsx`
- **Qué cambió:** Título 1.6rem > precio 1.5rem, icono precio 36px, label "hoy" eliminado.
- **Cómo probar:** Jugar Ep1 → precio del pan más claro, título destaca.

### Advisor feedback → toast auto-dismiss
- **Archivo:** `HyperInflation.jsx`
- **Qué cambió:** La réplica del asesor aparece como toast flotante sobre las acciones, auto-dismiss 3s.
- **Cómo probar:** Jugar Ep1, tomar acción → ver burbuja del asesor que desaparece sola.

### Badge "usos restantes"
- **Archivo:** `HyperInflation.jsx`
- **Qué cambió:** Acciones con usos limitados muestran badge "N usos restantes" solo cuando ≤2.
- **Cómo probar:** Jugar Ep1, usar renegociación 3 veces → ver badge "2 usos restantes".

---

## Fase 3 — Líneas huérfanas

### Badge "En construcción" en Chile / El Norte
- **Archivo:** `lines.js`, `LineSelect.jsx`, `EpisodeSelect.jsx`
- **Qué cambió:** `enConstruccion: true` en las líneas. Badge amarillo en cards del mapa y en header del select de episodios.
- **Cómo probar:** Ir al mapa → ver badge "En construcción" en Chile y El Norte. Entrar a una → ver badge arriba.

### Orden de líneas
- **Archivo:** `lines.js`, `EpisodeSelect.jsx`
- **Qué cambió:** Propiedad `orden` ("Por dificultad", "Por tema") en cada línea. Se muestra en EpisodeSelect.
- **Cómo probar:** Seleccionar línea → ver texto "Por dificultad" en el subtítulo.

---

## Fase 4 — Evaluación de aprendizaje

### SequenceChoice con feedback causal
- **Archivo:** `SequenceChoice.jsx`
- **Qué cambió:** Cada paso de la secuencia ahora muestra feedback inmediato (✓/✗ + explicación económica).
- **Cómo probar:** Jugar Ep5 (Plan Real) → ordenar eventos → ver feedback por paso.

### ConceptCheck (post-game MCQ)
- **Archivo:** `ConceptCheck.jsx` (nuevo)
- **Qué cambió:** Collapsible MCQ después del Outcome en episodios clave (ep1/ep2/ep3/ep5). Explicación al responder.
- **Cómo probar:** Completar episodio → ver "¿Qué aprendiste?" abajo del desenlace.

### EducationalTooltip auto-show
- **Archivo:** `EducationalTooltip.jsx`, `candyKit.jsx`
- **Qué cambió:** Los tooltips educativos se abren solos la primera vez que se encuentra el concepto en la sesión (Set a nivel módulo, se resetea al recargar página).
- **Cómo probar:** Jugar Ep1 → al ver "Señoreaje" tooltip, se abre automáticamente. Recargar página → se abre de nuevo.

### CausalChain (animación imprimir→inflación→protesta)
- **Archivo:** `CausalChain.jsx` (nuevo), `HyperInflation.jsx`
- **Qué cambió:** Secuencia animada de 6 pasos que se reproduce al terminar Ep1. Cada paso aparece cada 1s con fade-up y highlight.
  - 1: Gobierno imprime billetes
  - 2: Más dinero en circulación
  - 3: Cada billete vale menos
  - 4: Los precios se disparan
  - 5: El pan ya no alcanza
  - 6: El pueblo protesta
- **Cómo probar:** Jugar Ep1 → al terminar la mecánica, ver animación automática. Al terminar aparece botón "Ver el desenlace".

---

## Fase 6 — Consecuencias cross-episodio

### Reputación acumulada
- **Archivo:** `useProgression.js`, `Outcome.jsx`, `App.jsx`
- **Qué cambió:** `reputation` se computa de todos los outcomes previos. Se muestra como barra + porcentaje en Outcome. Pasa como prop desde App.
- **Pesos:** perfect = +10, partial = +3, wrong = -5. Base 50, clamped 0–100.
- **Cómo probar:** Jugar varios episodios → ver barra de reputación en el desenlace.

---

## Fase 7 — Features adicionales

### Delta indicators (+N/-N)
- **Archivo:** `Outcome.jsx`
- **Qué cambió:** Junto a la reputación aparece el delta `+10` (perfect), `+3` (partial) o `-5` (wrong) con animación rise y color semántico.
- **Cómo probar:** Completar episodio → ver "+10" o "-5" animado junto a la barra de reputación.

### Logros (5)
- **Archivo:** `useAchievements.js` (nuevo), `AchievementToast.jsx` (nuevo), `App.jsx`
- **Qué cambió:** 5 logros chequeados al completar episodio. Notificación toast con fade-in/fade-out y auto-dismiss 3s.
  - 🌱 Primer Paso: completar primer episodio
  - ⭐ Reformista: salvar Paicio con resultado perfecto
  - 🔄 Persistente: completar episodio al reintentar
  - 🗺️ Explorador: jugar episodios de 2 líneas distintas
  - 🏆 Experta: conseguir 3 estrellas
- **Cómo probar:** Jugar → al completar condiciones, ver toast "Logro desbloqueado". Persiste en localStorage.

---

## Archivos nuevos (4)
| Archivo | Propósito |
|---|---|
| `src/components/ConceptCheck.jsx` | MCQ post-game |
| `src/components/CausalChain.jsx` | Animación causal 6 pasos |
| `src/components/AchievementToast.jsx` | Notificación de logros |
| `src/hooks/useAchievements.js` | Definición + lógica de logros |

---

## Archivos modificados (22)
`App.jsx`, `Buzon.jsx`, `Cell.jsx`, `EducationalTooltip.jsx`, `EpisodeSelect.jsx`, `FeedbackButton.jsx`, `Intro.jsx`, `LineSelect.jsx`, `Outcome.jsx`, `SequenceChoice.jsx`, `SoundToggle.jsx`, `ChoiceBudget.jsx`, `ExternalityReg.jsx`, `GameProgress.jsx`, `HyperInflation.jsx`, `PensionReform.jsx`, `VolatilityDance.jsx`, `candyKit.jsx`, `lines.js`, `useGameState.js`, `useProgression.js`, `index.css`

---

## Testing checklist
- [ ] Onboarding: 3 pasos, pager, skip, reabrir con ?
- [ ] Briefing saltable en repeticiones
- [ ] Celda compacta (4 bloques)
- [ ] GameProgress simplificado
- [ ] HyperInflation: jerarquía, toast advisor, badge usos
- [ ] Chile / El Norte: badge "En construcción", orden
- [ ] SequenceChoice: feedback por paso
- [ ] ConceptCheck: MCQ post-game
- [ ] EducationalTooltip: auto-show 1ra vez
- [ ] CausalChain: 6 pasos animados en Ep1
- [ ] Reputación: barra + % en Outcome
- [ ] Delta indicators: +10/+3/-5 animado
- [ ] Logros: toast al desbloquear
- [ ] Score icons: ✓/~/✗ para daltónicos
