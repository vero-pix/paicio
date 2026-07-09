# PAICIO — Pendientes tras v0.26.0 (handoff para Claude)

**Fecha:** 2026-07-09
**Estado del repo:** rama `main` en `v0.26.0`, desplegado en producción (`https://paicio.vercel.app`).
**Contexto:** se desbloquearon los **14 episodios** (antes solo 5 jugables) y se arreglaron
dos crashes + el layout del mapa. Todo lo de este archivo es **mejora/pulido, no arreglo**:
el juego está completo y estable en prod. Verificado en navegador de punta a punta.

> Nota de deploy (importante): el `git push` a `main` a veces NO actualiza el alias
> `paicio.vercel.app`. Tras cada push a prod, correr `vercel --prod --yes` desde la raíz.

> Preferencias de Vero a respetar: español **chileno con tuteo** (jamás voseo argentino),
> sin jerga corporativa. Para generar imágenes: ChatGPT/DALL-E, **no** Canva AI.

---

## Qué ya quedó bien (no tocar)

- Los 14 episodios están en `bloqueado: false` y son jugables.
- Mecánicas nuevas verificadas OK: pinFactory (ep8), assemblyLine (ep9), surplusValue (ep10),
  aggregateDemand (ep11), monetaryRule (ep12), shockTherapy (ep7), volatilityDance (ep13),
  pensionReform (ep14), y ep6 reusa speculativeAttack.
- Mapa: `EpisodeSelect.positionsFor` ahora usa offset triangular; `App` ordena por `numero`.
  Ninguna línea excede 7 nodos (Crisis está justo en 7).
- Cartas de evento de ep13/ep14/ep10: contrato de `EventCard` arreglado
  (`evento=` + `onResolve`), efectos se aplican, sin crashes.

---

## Pendientes priorizados

### 1. Íconos ilustrados de las cartas de evento (mayor impacto visual)
**Problema:** los 5 episodios base usan íconos ilustrados soft-3D (webp) para sus cartas de
evento, vía `src/assets/eventos/index.js` (`eventIcons`, buscados por `evento.iconKey ?? evento.id`).
Los episodios nuevos usan **emoji dentro de un disco de acento** (fallback de `EventIcon` en
`src/components/mechanics/EventCard.jsx:95-102`). Funciona, pero hay inconsistencia visual
episodios viejos vs nuevos.
**Eventos que hoy usan emoji** (ids ya puestos, listos para mapear a webp):
- ep6 (`src/data/episodes/episode6.js`): usa `icon` emoji.
- ep10 (`episode10.js`): `ludismo` 🔨, `manifiesto` 📜.
- ep13 (`episode13.js`): `china` 🐉, `huelga` ⛏️, `sustituto` 🔌.
- ep14 (`episode14.js`): `retiroAnticipado` 💸, `crisisMercado` 📉, `envejecimiento` 👴.
**Acción:** generar los webp (ChatGPT/DALL-E, estilo soft-3D como los de ep1-5), sumarlos a
`src/assets/eventos/` + registrarlos en `src/assets/eventos/index.js`, y darle a cada evento un
`iconKey` que matchee. Ver cómo lo hacen ep1-5 como referencia.

### 2. Copy: voseo argentino → tuteo chileno + typos (rápido, alto valor)
**Voseo a corregir** (contra la preferencia de Vero; ep13 es ¡un episodio de Chile!):
- `src/data/episodes/episode13.js` — intro y outcomes ("tenés", "vendé", "aguantá", "invertí",
  "vos", "la próxima mejor punteo").
- `src/data/episodes/episode14.js` — "Sos ministro", "heredás", "aplicás", "Descubrí", "construí",
  "Llegás", "Tenés 8 reformas".
- `src/components/mechanics/PensionReform.jsx` — EndPanel "vos lo demostraste" (~línea 112),
  "Elegí una reforma para aplicar" (~línea 122).
**Typos:**
- `episode13.js`: "SEDE BIEN" (headline del outcome `partial`, ~línea 105 → debería ser algo como
  "CEDE" / "SE DEFIENDE"); "Noruea" → "Noruega" (~línea 57); "commoditie" → "commodity" (~línea 120).
- `episode9.js`: headlines de outcomes dicen "FORDS" / "DE FORDS" (~líneas 318, 329).
- `src/components/mechanics/ShockTherapy.jsx:147`: `EduChip conceptId="ataqueEspeculativo"`
  está mal etiquetado; debería ser `terapiaShock`.

### 3. Retratos reales de los personajes nuevos
**Problema:** `src/assets/portraits.js` usa **placeholders** (reusa retratos de ep3/ep4/ep5):
- ep6 (México): `tesobono`, `comerciante_mex`, `politico_mex`, `fmi_mex`.
- ep7 (Perú): `tecnico_peru`, `social_peru`, `empresario_peru`, `militar_peru`.
- ep9 (Ford): `ford`, `ingeniero`, `obrero`, `proveedor`.
- ep10-14: `marx`, `keynes`, `friedman`, `precioCobre`, `diseniador`.
**Acción:** generar retratos propios (estilo mascota + disco de color, como ep1 Bolivia),
optimizar a WebP ~512px, importarlos y reemplazar los placeholders en `portraits.js`.

### 4. Migrar Pensiones (ep14) a la capa de juego compartida
**Problema:** `PensionReform.jsx` es la única mecánica nueva por rondas con medidores que **no**
usa `src/hooks/useGameLayer.js` / `src/utils/gameLayer.js`. Por eso no tiene score real, momentum,
combo ni "jugo" (monedas/flash/sonidos) como sus hermanas (surplusValue, aggregateDemand, etc.).
**Acción:** refactor siguiendo el patrón de `SurplusValue.jsx` (referencia limpia): `useGameLayer`
con `meters=METERS`, `onTurn`/`onEventResolved`, `GameProgress`, `ComboBadge`, `GoldFlash`, `Coins`.

### 5. Mostrar la narrativa de las cartas de evento
**Problema:** `EventCard` en modo **pasivo** (`EventCard.jsx:110-133`) solo muestra `titulo` +
pills de efecto + "Seguir"; **nunca renderiza `texto`** (el `texto` solo se ve en el modo
"decisión" con `opciones`). Por eso el flavor de los eventos de ep10/13/14 queda invisible.
**Acción (elegir una):** (a) agregar el `texto` a la tarjeta pasiva; o (b) convertir esos eventos
a tipo "decisión"; o (c) rediseñar la tarjeta. Decisión de diseño — consultar con Vero.

### 6. Layout del mapa: borde y escalado a N>7 (menor)
- Nodos en `left:74%` rozan el borde derecho del marco en las líneas de 6-7 nodos
  (`positionsFor` en `src/components/EpisodeSelect.jsx`). Ajuste fino de coordenadas.
- Hoy el mapa topa en 7 nodos (`Math.min(count, 7)`); un 8º nodo se apilaría al centro.
  Si alguna línea va a crecer, hacer el layout generativo (zig-zag paramétrico + path derivado).

---

## Sugerencia de orden
1 (íconos) → 2 (copy) → 3 (retratos) → 4 (pensiones a game layer) → 5 (narrativa cartas) → 6 (mapa).

Recordar: subir la versión en `src/data/version.js` con nota de novedades por cada cambio, y
verificar en navegador antes de mandar a prod (con OK de Vero + `vercel --prod --yes`).
