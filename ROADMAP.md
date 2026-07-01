# PAICIO — Roadmap

Juego web educativo de economía. Eres el Ministro de Economía de Paicio (país
ficticio) y cada episodio recrea una crisis histórica que aprendes **jugándola**:
la mecánica ES la lección. No hay respuestas fáciles; ves las consecuencias y la
comparación con lo que pasó de verdad.

- **En vivo:** https://paicio.vercel.app · **Versión:** v0.7.0
- **Stack:** React 18 + Vite 6 + Tailwind v4, estado en localStorage.
- **Deploy:** Vercel (`vercel --prod --yes` tras cada push; el auto-deploy de git
  a veces no mueve el alias).

---

## ✅ Hecho

### Contenido / mecánicas
- **5 episodios, una mecánica distinta por crisis** (`episode.mechanic` →
  `MechanicHost`; lógica en `src/utils/`, UI en `src/components/mechanics/`):
  - Ep1 · Weimar 1923 — **La Imprenta** (hiperinflación: imprimir = espiral vs. Rentenmark a tiempo)
  - Ep2 · Argentina 2001 — **Corrida bancaria** (juego de coordinación)
  - Ep3 · Chile 1982 — **Defender la paridad** (guerra de desgaste)
  - Ep4 · Brasil — **Expectativas e inercia**
  - Ep5 · Plan Real — **Secuencia (URV)**
- Desenlaces por niveles (`outcomes`: perfect/partial/wrong) con veredicto,
  scores y **gráfico de tendencia con cifras históricas reales**.
- Intro "misión/curiosidad" + conceptos económicos con tooltips.

### Sistema
- **Sonido** (`src/lib/sound.js`, Howler + Web Audio): música ambiente por
  episodio, SFX, sting del desenlace según resultado, mute + volumen persistente.
- **Dinamismo visual** (`src/lib/animations.js`, CSS): KPIs animados, feedback de
  decisión (shake/flash/cascade), typewriter + caída del periódico, transiciones.
- **Mensajero de feedback** para testers (💬) + **buzón privado** en `/#buzon`
  (Supabase + funciones `/api/feedback`).
- Botón home, badge de versión/novedades, imágenes WebP, carga rápida.

---

## 🔜 Pendiente / ideas

### Corto plazo
- [ ] **Música de época real por país** — conseguir royalty-free (Pixabay,
      Incompetech, YouTube Audio Library) y soltar `ep1.mp3`…`ep5.mp3`,
      `menu.mp3` en `public/audio/music/`. NO usar canciones con derechos.
- [ ] **Copy:** el botón de la celda dice "Empezar a negociar" (quedó de la
      mecánica vieja del dilema); ya no hay negociación. Ajustar por episodio.
- [ ] Recoger y actuar sobre el feedback de los primeros testers.

### Más adelante (V2)
- [ ] Reputación / consecuencias que se arrastran entre episodios.
- [ ] Ranking o puntaje comparativo.
- [ ] Multijugador.
- [ ] Limpieza: eliminar el subsistema muerto del dilema del prisionero
      (`prisonersDilemma.js`, `NegotiationMatrix`, `Prisoner`, `PolicyChoice`,
      bloque PD de `App.jsx`) — ya ningún episodio lo usa.
- [ ] Destrabar GitHub Actions (cuenta bloqueada por billing flag) si se quiere
      auto-deploy sin `vercel --prod`.

---

## Flujo de trabajo
- Features grandes → branch `feature/*`, verificar, y mergear a `main` +
  `vercel --prod` **solo con OK explícito**.
- Cada feature sube la versión en `src/data/version.js` con su nota de novedades.
