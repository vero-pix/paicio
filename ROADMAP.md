# PAICIO — Roadmap

Juego web educativo de economía. Eres el Ministro de Economía de Paicio (país
ficticio latinoamericano) y cada episodio recrea una crisis histórica real que
aprendes **jugándola**: la mecánica ES la lección. Balance de diseño acordado:
**70% juego / 30% lección**.

- **En vivo:** https://paicio.vercel.app · **Rediseño LatAm en producción.**
- **Stack:** React 18 + Vite 6 + Tailwind v4, estado en localStorage.
- **Deploy:** Vercel (`vercel --prod --yes`).

---

## ✅ Hecho

### Contenido / mecánicas (5 episodios, una mecánica por crisis)
- Ep1 · **Bolivia 1985** — La Imprenta (hiperinflación, Decreto 21060)
- Ep2 · Argentina 2001 — Corrida bancaria (corralito)
- Ep3 · Chile 1982 — Defender la paridad
- Ep4 · Brasil — Expectativas e inercia
- Ep5 · Brasil 1994 — Secuencia (Plan Real / URV)

### Rediseño "LatAm casual" (SHIPPED, en producción)
- Estilo juego luminoso (ref. Cashflow / Candy Crush): mapa de crisis tipo
  niveles, pantalla de decisión candy, medidores "barra de vida", intro-briefing
  y desenlace-veredicto, bienvenida/onboarding.
- Marca: logo wordmark + moneda-$ (ícono de app oscuro), Fredoka + Nunito.
- Retratos ilustrados soft-3D de los asesores de **Bolivia** (Ep1).
- Audio: música por episodio + menú + **pista tensa en la decisión** + SFX de
  éxito/fracaso más claros.
- Fix de viewport iOS (100dvh) y pantalla de decisión compactada.

---

### ✅ "PAICIO más juego" — lote cerrado (v0.16.0, en producción)
Los testers lo encontraban aburrido/difícil/sin gancho. Se metió una capa de
juego encima de la mecánica, prototipada en Bolivia y replicada a piezas
compartidas (`utils/gameLayer.js` + `hooks/useGameLayer.js` + `useTutorial.js`).
- **Cartas de evento / shocks** (tipo Reigns) en los 5 episodios, telegrafiado
  del efecto, **combo/momentum**, puntaje corrido y jugo de recompensa.
- **Onboarding** guiado (coach-marks, chip de meta, primer turno) Ep2–5.
- **Fracaso barato**: reintento instantáneo ("un intento más") sin volver al mapa.
- **Reto Diario**: semilla por fecha (misma partida para todos) + tarjeta
  compartible tipo Wordle.
- **VersionBadge global** visible en todas las pantallas (antes enterrado).
- **Paleta clara**: controles (sonido, feedback, tooltips) retuneados a la
  dirección LatAm luminosa. Las 3 cards focales oscuras se mantienen a propósito.
- **Íconos de eventos ilustrados** (soft-3D) integrados en los 5 episodios
  (v0.14.0). Único sin ícono propio: `respaldoCongreso` (Ep4), con emoji.
- **Audio**: música desacoplada de los SFX (silenciable aparte); pista de la
  partida cambiada a una lounge suave (v0.15.0); música por episodio asignada
  por país/época — Bolivia andino, Argentina tango, Chile andino, Brasil bossa,
  Plan Real piano, menú vintage (v0.16.0).
- **Código muerto** del dilema del prisionero eliminado (PR #13, mergeado):
  −21KB JS / −6KB CSS.

---

## 🎯 Ahora — VALIDAR antes de expandir
El lote existía para arreglar el gancho. Antes de construir más contenido, medir
con testers si el loop ya engancha/retiene (completan el loop, usan combos,
reintentan, vuelven al Reto Diario). Esta señal es el gate a V2.

### 🎨 Pendientes menores (no bloqueantes)
- **Ícono de `respaldoCongreso`** (Ep4): falta el de "congreso"; hoy usa emoji.
- **Música**: escuchar la lounge de la partida y las pistas por episodio; ajustar
  o reemplazar archivos en `public/audio/music/` si alguna no convence.

## 🔜 Futuro (V2) — solo tras pasar el gate de validación

### Nuevos episodios LatAm (solo tras validar que el loop es divertido)

**México 1994 — Efecto Tequila**
- Crisis: fuga de capitales y devaluación del peso (el "error de diciembre").
- Mecánica: **defender la paridad** (reusa speculativeAttack) — aguantar reservas
  vs. devaluar a tiempo.
- Eventos: alza de tasas de la Fed, magnicidio de Colosio, Tesobonos, rescate
  de EE.UU./FMI.
- Lección: crisis de balanza de pagos / *sudden stop*; el costo de sostener una
  paridad insostenible.

**Perú 1990 — Fujishock**
- Crisis: hiperinflación (~7.650% en 1990) frenada por estabilización de shock
  (agosto 1990).
- Mecánica: NO repetir "La Imprenta" de Bolivia — ángulo de **terapia de shock**:
  velocidad del ajuste vs. costo social (variante nueva o sobre expectativas).
- Eventos: Sendero Luminoso, brote de cólera, fin de subsidios, dolarización,
  reinserción financiera.
- Lección: estabilización heterodoxa fallida vs. shock ortodoxo; el trade-off social.

### Otros
- Retratos ilustrados de los 4 episodios restantes (siguen sepia).
- Reputación / consecuencias entre episodios; ranking; multijugador.

---

## Flujo de trabajo
- **3 Claudes:** Cowork (estrategia, diseño de juego, QA, briefs) · Claude Code
  (implementación + git + deploy) · Claude Design (dirección visual, mockups,
  arte). Git lo maneja solo Claude Code para no chocar locks. Push permitido.
- Prototipar en un episodio → validar → replicar. Cada feature sube versión en
  `src/data/version.js`.
