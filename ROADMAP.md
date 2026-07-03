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

## 🎮 En curso — "PAICIO más juego" (70/30)

Los testers lo encontraban aburrido/difícil/sin gancho. Capa de juego encima de
la mecánica. Prototipada y **validada en Bolivia**, ahora **replicada** a las
otras crisis por turnos.

### ✅ Capa replicada a Ep2/Ep3/Ep4 (v0.11.0)
Orquestación extraída a piezas compartidas para no copiar-pegar (Bolivia quedó
intacto): `utils/gameLayer.js` + `hooks/useGameLayer.js` (eventos, momentum,
puntaje, jugo) + `hooks/useTutorial.js` (onboarding), parametrizado por los
medidores de cada episodio.
- **Cartas de evento / shocks aleatorios** (tipo Reigns): ~8 por episodio,
  pasivas o de decisión, con copy histórico (corralito, paridad, inercia).
- **Telegrafiado** del efecto de cada acción + **combo/momentum** + **puntaje
  corrido** (va al desenlace) + **jugo de recompensa** (monedas/flashes).
- **Onboarding**: coach-marks, chip de meta y primer turno guiado en Ep2–4;
  coach ligero + monedas en Ep5 (Plan Real, que es puzzle de secuencia).

### 🔜 Pendiente del lote
- **Íconos de eventos** ilustrados para Ep2–5 (hoy usan emoji de fallback).
  Pedir a Design ~8 por episodio (guía en `GUIA-ICONOS-EVENTOS.md`).
- **Fracaso barato**: reintento instantáneo ("un intento más"). No existe aún
  en ningún episodio; construir de cero (wrapper o dentro de las mecánicas).
- **Reto Diario** (semilla por fecha, resultado compartible tipo Wordle) +
  tarjeta de resultado. La agenda de eventos ya es seedable (base lista).

---

## 🔜 Futuro (V2)

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
- Limpieza del subsistema muerto del dilema del prisionero
  (`prisonersDilemma.js`, `NegotiationMatrix`, `Prisoner`, `PolicyChoice`).

---

## Flujo de trabajo
- **3 Claudes:** Cowork (estrategia, diseño de juego, QA, briefs) · Claude Code
  (implementación + git + deploy) · Claude Design (dirección visual, mockups,
  arte). Git lo maneja solo Claude Code para no chocar locks. Push permitido.
- Prototipar en un episodio → validar → replicar. Cada feature sube versión en
  `src/data/version.js`.
