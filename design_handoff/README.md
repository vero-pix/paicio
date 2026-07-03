# Handoff: Rediseño visual PAICIO (juego casual de economía)

## Resumen
Rediseño de la dirección visual de **PAICIO**, juego educativo móvil donde eres Ministro de Economía y juegas crisis económicas reales de América Latina. El objetivo es pasar de un look oscuro/editorial/con mucho texto a una estética de **juego casual, luminoso y táctil** (referencia Cashflow / Candy Crush) con identidad propia. Incluye: sistema de marca (logo + moneda-$), tokens, y 4 pantallas mobile (~380px) + espec. de micro-interacciones.

## Sobre los archivos de este paquete
Los archivos incluidos son **referencias de diseño hechas en HTML** (un prototipo que muestra el look y comportamiento buscados), **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños dentro del codebase existente** de PAICIO — **React + Tailwind, mobile-first ~380px** — reutilizando sus patrones (componentes en `src/components`, datos de episodios en `src/data/episodes`, hooks en `src/hooks`, tema en `src/index.css`).

- Archivo de referencia principal: `Paicio Rediseño.dc.html` (ábrelo en un navegador para ver todo: marca, tokens, pantallas, micro-interacciones).
- Es un "Design Component" (usa un runtime propio); **léelo como referencia visual**, no lo importes al proyecto.

## Fidelidad
**Alta fidelidad (hifi).** Colores, tipografía, espaciados, radios y sombras son definitivos. Recrear la UI de forma fiel a píxel con las librerías/patrones del codebase.

---

## Design tokens → Tailwind (`src/index.css @theme`)

Sustituir el bloque `@theme` actual (paleta sepia) por esta paleta cálida-luminosa. Nombres sugeridos:

```css
@theme {
  /* Base cálida */
  --color-cream:      #F3E2C2;  /* fondo de tablero / app */
  --color-cream-hi:   #FFF3D8;  /* degradado superior de pantalla */
  --color-cream-lo:   #FCE7C0;  /* degradado inferior de pantalla */
  --color-panel:      #FFFBF3;  /* tarjetas / paneles claros */
  --color-surface:    #FFFFFF;  /* chips, tarjetas sobre pantalla */
  --color-ink:        #3B2A17;  /* texto principal (marrón, NO negro) */
  --color-ink-soft:   #8A7357;  /* texto secundario */
  --color-ink-mute:   #B79A63;  /* labels / captions */

  /* Oro de marca (la moneda-$) */
  --color-gold:       #F5B331;
  --color-gold-deep:  #E0912A;
  --color-gold-edge:  #C77C1B;  /* borde inferior sólido del botón oro */

  /* Acento por episodio (face + edge = borde inferior 3D del botón) */
  --color-bolivia:        #F5A524;  --color-bolivia-edge:   #D6871A;
  --color-argentina:      #4FA3E3;  --color-argentina-edge: #2F82C4;
  --color-chile:          #F06A54;  --color-chile-edge:     #D24C39;
  --color-brasil-inercia: #A579E0;  --color-brasil-inercia-edge: #8657C4;
  --color-brasil-real:    #35B98A;  --color-brasil-real-edge:    #1F9A6E;

  /* Semánticos */
  --color-good:   #2FB37E;   /* bien / apoyo alto */
  --color-warn:   #F5A524;   /* alerta */
  --color-crisis: #E8604F;   /* crisis / inflación alta */

  --font-display: 'Fredoka', ui-rounded, system-ui, sans-serif; /* títulos, números, botones */
  --font-body:    'Nunito', system-ui, sans-serif;              /* texto, labels, chips */
}
```

**Fuentes (Google Fonts):** `Fredoka` (400/500/600/700) y `Nunito` (400/600/700/800/900). Reemplazan a Playfair/Lora/IBM Plex Mono.

**Escala tipográfica (px):** hero número 46–62 · display 30–52 · título 17–24 · cuerpo 14–15 · label 11–12 (800, letter-spacing ~1px, mayúsculas). `font-variant-numeric: tabular-nums` en cifras.

**Radios (px):** chip/icono 8–12 · botón/tarjeta 14–18 · panel 20–26 · pantalla 36 · marco teléfono 46 · pill 999.

**Sombras:**
- Panel claro: `0 10px 30px -14px rgba(150,100,30,.35)` + `inset 0 0 0 1px rgba(200,160,80,.18)`.
- Tarjeta sobre pantalla: `0 6px 14px -8px rgba(150,100,30,.4)`.
- Card oscura (hero/veredicto): `0 12px 22px -12px rgba(40,25,5,.7)`.

**Mapeo por episodio:** cada episodio expone un `accent` (face) + `accentEdge` (borde inferior). Sugerencia: añadir `accent`/`accentEdge` a cada objeto en `src/data/episodes/episodeN.js` y leerlos por `data-episode` o vía CSS var `--accent`. Orden LatAm: Bolivia 1985 (ámbar) · Argentina 2001 (azul) · Chile 1982 (coral) · Brasil inercia (violeta) · Brasil 1994 Plan Real (verde).

---

## Componente base: Botón táctil ("candy")
Patrón reutilizable en todo el juego.
- Estructura: `background: <accent>; color:#fff; border-radius:14–20px; padding:14–17px; font-family:Fredoka; font-weight:600–700;`
- Efecto 3D: `box-shadow: 0 5–6px 0 <accentEdge>` (labio inferior sólido, NO blur).
- **Estado `:active`** (hundido): `transform: translateY(4px); box-shadow: 0 1px 0 <accentEdge>;` transición ~80ms.
- Variante suave: face `#F0DFB8`, texto `#5A4327`, edge `#D9C08A`.

---

## Marca / Logo
- **Wordmark** "PAICIO" en Fredoka 700, `letter-spacing ~1px`, color `--color-ink` (o `#FBEFD8` sobre oscuro).
- **Moneda-$** a la izquierda: círculo con `radial-gradient(circle at 34% 28%, #FFE9A8 0%, #F7C24A 42%, #E29A24 78%, #C77C1B 100%)`, borde `2–4px solid #EDAE3E`, sombra `inset 0 -4px 7px rgba(140,80,10,.45), inset 0 3px 5px rgba(255,255,255,.6), 0 8px 16px rgba(199,124,27,.35)`. Anillo interior `inset:7px; border:1.5px solid rgba(255,255,255,.4)`. Signo `$` en Fredoka 700, color `#8A4E12`, `text-shadow:0 1px 0 rgba(255,255,255,.55)`.
- **Versiones entregadas:** horizontal, compacta, **monocromática** (moneda `#3B2A17` con `$` crema, o inversa), e **ícono de app** = moneda-$ centrada sobre cuadrado redondeado oscuro `linear-gradient(155deg,#3A2A16,#241708)`, radio 30px, con halo dorado radial suave.

---

## Pantallas

### 01 · Bienvenida / Onboarding
- **Propósito:** entrada y promesa del juego; pager de 3 pasos.
- **Layout:** columna centrada. Fondo `linear-gradient(180deg,#FFF3D8,#FCE7C0)`. Status bar simulada arriba (`9:41` + `● ● ●`, color `#7C6236`).
- **Componentes:**
  - Moneda-$ grande (112px) con brillo diagonal y `animation: bob 3.4s` (flotación ±5px).
  - Wordmark PAICIO 52px + tagline "economía que se juega, no se estudia" (`--color-ink-mute`, 15px 700).
  - Título "Eres el nuevo Ministro de Economía." (Fredoka 600, 23px, `text-wrap:balance`) + subcopy 15px `--color-ink-soft`.
  - 3 chips de pasos (Decides / Medidores / Desenlace): tarjeta blanca 88px, ícono 34px en cuadrado de color tenue, label 11.5px 800.
  - Pager: 3 puntos, activo = pill 22×7 `--color-gold`, inactivos 7×7 `#E4CE9E`.
  - CTA primario oro "Empezar a jugar" (botón candy, radio 20). Enlace secundario "Ya tengo progreso →" (`--color-ink-mute` 13.5px 800).

### 02 · Mapa de crisis (selector de episodios)
- **Propósito:** progreso visible tipo mapa de niveles.
- **Layout:** fondo `linear-gradient(180deg,#EAF6EC,#FBEFD2 55%,#FCE3C4)`. Header con título "Mapa de crisis" 24px + pill de progreso blanco con moneda mini + "2 / 5".
- **Camino:** SVG `viewBox 0 0 360 620`, `<path>` curvo (Q) con `stroke:#E8CE9A; stroke-width:12; stroke-dasharray:2 20; linecap:round` (efecto de puntos-huella), detrás de los nodos (posicionados en absolute).
- **Nodos (de abajo hacia arriba):**
  1. Bolivia 1985 · Hiperinflación — **completado**, círculo `--color-bolivia` 68px, borde blanco 4px, ícono 🔥, estrellas `★★☆` (oro `#F5B331`, letra pequeña).
  2. Argentina 2001 · El corralito — **completado**, `--color-argentina`, ícono 🏦, `★★★`.
  3. Chile 1982 · La paridad — **actual/jugable**, `--color-chile` 84px, borde blanco 5px, número "3" Fredoka, badge "JUGAR", **anillo pulsante** (`ring` 1.8s: scale 1→1.5, opacity .55→0).
  4. Brasil · La inercia — **bloqueado**, gris `#EBDCC0`, 🔒.
  5. Brasil 1994 · Plan Real — **bloqueado**, gris, 🔒.
  - Cada nodo con etiqueta al lado: país+año (Fredoka 700, `--color-ink`) y crisis (600, color del acento).
- **Barra inferior:** 2 botones ("Mapa" suave / "Jugar Chile →" oro candy) sobre degradado hacia crema.

### 03 · Decisión (ej. Bolivia 1985)
- **Propósito:** núcleo del loop — leer medidores y elegir una de 4 acciones cada "mes".
- **Layout:** columna. Fondo `linear-gradient(180deg,#FFF3DA,#FBE6C2)`.
- **Top bar:** botón atrás `‹` (cuadro blanco 34px, radio 12) · título "Bolivia 1985" + "HIPERINFLACIÓN" (11px 800, color acento) · pill "Mes 3 / 8" (botón candy pequeño color acento).
- **Medidores (barras de vida):** 3 filas, cada una: icono 26px en cuadrado tenue + label 11px 800 + valor coloreado + barra. Barra: track `#F3E2C2` radio pill, `inset 0 1px 2px rgba(140,90,30,.25)`, relleno con degradado:
  - Inflación 68% → `linear-gradient(90deg,#F5A524,#E8604F)` (alto = malo, valor en `--color-crisis`).
  - Apoyo popular 55% → `linear-gradient(90deg,#7FD3A6,#2FB37E)` (`--color-good`).
  - Reservas 40% → `linear-gradient(90deg,#8FC4EF,#4FA3E3)` (`--color-argentina`).
- **Cifra protagonista (hero):** card oscura `linear-gradient(160deg,#3B2A17,#26190B)`, radio 24, halo dorado radial. Ícono 🍞 56px en cuadro crema. Label "PRECIO DEL PAN · HOY" (11px `#E8C67F`). Número "24 800" Fredoka 700 **46px** color `#FFE9A8` con `animation: pop .5s` **cada vez que cambia** (re-montar por `key`). Unidad "Bs". Pill delta "▲ 38% / EN 1 MES" en `--color-crisis` con edge `#C43D2C`.
- **Asesor:** retrato circular (58px) en marco-moneda (padding 3px con el mismo `radial-gradient` dorado, borde blanco 2px) + burbuja blanca (radio 18, esquina sup-izq 5px) con nombre "Don Marcos · Banco Central" (Fredoka 700 12px, color acento) y cita 12.5px `--color-ink-soft`. Retratos en `assets/` (reutilizados del juego actual).
- **4 acciones (grid 2×2, gap 11):** botones candy grandes, cada uno: emoji 24px + título Fredoka 700 14.5px + hint 10.5px 800. Colores: Imprimir dinero 🖨️ (`--color-bolivia`) · Ajuste fiscal ✂️ (`--color-chile`) · Renegociar deuda 🤝 (`--color-argentina`) · Reforma monetaria ⚓ (`--color-brasil-real`). Todos con `:active` hundido.

### 04 · Desenlace / Veredicto
- **Propósito:** resultado, comparación con la historia real, compartible.
- **Layout:** columna centrada, fondo `linear-gradient(180deg,#E9F7EE,#FBEFD4 60%,#FCE7C6)`.
- **Componentes:**
  - Kicker "VEREDICTO · BOLIVIA 1985" (12px 800, `--color-good`).
  - 3 estrellas (34/46/34px, oro); la central con `animation: pop 1s`.
  - Título "¡Frenaste la hiperinflación!" (Fredoka 700 30px) + subcopy 14px `--color-ink-soft`.
  - 3 chips de score (tarjeta blanca): número grande Fredoka 700 26px (color por dimensión) + label 10px 800: Estabilidad 92 (`--color-good`) · Apoyo 55 (`--color-warn`) · Confianza 88 (`--color-argentina`).
  - **Card "Lo que pasó de verdad 🇧🇴"** (oscura, radio 20): 2 columnas comparativas — "INFLACIÓN REAL 1985" `×23.000%` (`--color-crisis`) vs "TU PARTIDA" `controlada` (`--color-brasil-real`) — + párrafo histórico 11.5px `#D9C7A2`.
  - Barra inferior: botón compartir cuadrado "↗" (suave) + "Siguiente crisis →" (candy verde `--color-brasil-real`).

---

### 05 · Intro de episodio (briefing / "celda")
- **Propósito:** presentar la crisis del nivel antes de jugar; sustituye la pantalla "periódico" oscura por un briefing luminoso.
- **Layout:** fondo acento tenue `linear-gradient(180deg,#FFEFD2,#FBE2BE)`. Top bar: back `‹` + pill país "Bolivia · 1985" (candy ámbar, `white-space:nowrap`).
- **Componentes:**
  - Chip "HIPERINFLACIÓN · NIVEL 1" (pill `#FBDAD3`, texto `--color-chile` 10.5px 800).
  - Título "La Gran Quema" (Fredoka 700, 38px) + setup 2–3 líneas 14.5px `--color-ink-soft` (menos texto).
  - Card oscura del dato clave (misma que hero): 🔥 + "EL PAN, HOY" + "4 800 Bs ▲ y subiendo".
  - Callout "TU MISIÓN" (card blanca, icono objetivo azul) con la meta del nivel (Fredoka 700 13.5px).
  - Fila de asesor/antagonista: retrato en marco-moneda (`presidente.webp`) + burbuja con provocación del Presidente.
  - CTA candy ámbar "Asumir el cargo →".
- **Datos:** de `episodeN.js` → `titulo`, `resumen`/`opening`, `ticker`, `hyperinflation.meses` (misión), y voz del antagonista.

### 06 · Negociación (dilema del prisionero)
- **Propósito:** construir coalición; cada mesa es un dilema COOPERAR / TRAICIONAR. Reemplaza la matriz-tabla por una tarjeta táctil de personaje.
- **Layout:** fondo `linear-gradient(180deg,#F3E5CC,#E7D3AE)`. Header "Las negociaciones" (Fredoka 700 19px, `nowrap`) + pill "Coalición 1 / 4".
- **Componentes:**
  - Tira de coalición: 4 avatares (50px) en marco circular; aliado = anillo `--color-good` + check; disponibles en gris `#D9C7A2` con `grayscale(.4); opacity:.75`.
  - Banda de urgencia del ticker (pill `#FBDAD3`): 🍞 "Pan 5 200 Bs ▲ · el ticker no se detiene".
  - **Tarjeta de personaje** (blanca, radio 28, sombra fuerte): retrato en marco-moneda 72px (gradiente por acento del personaje) + nombre (Fredoka 700 18px, `nowrap`) + rol · chip "QUIERE · <utilidad>" · barra "Confianza 50%" · cita del personaje.
  - Dos botones grandes: **COOPERAR** (🤝, verde `--color-brasil-real`, "construye confianza") / **TRAICIONAR** (🎭, `--color-crisis`, "ventaja inmediata"), ambos candy con `:active`.
  - Chip pie "🎲 DILEMA DEL PRISIONERO".
- **Datos:** de `episodeN.js` → `prisoners[]` (`name`, `role`, `utility`, `accent`, `initialTrust`, `voice`), lógica del payoff en `useGameState`/utils existentes.

## Interacciones & animaciones (respetar `prefers-reduced-motion`)
- **Botón candy `:active`:** `translateY(4px)` + colapso de la sombra a `0 1px 0`. ~80ms.
- **Contador arcade (hero):** al cambiar el valor, `pop` (scale .9→1.06→1, .5s). Implementar re-montando el nodo del número (cambiar `key`) para re-disparar la animación.
- **Nodo actual (mapa):** anillo pulsante infinito `ring` (scale 1→1.5, opacity .55→0, 1.8s).
- **Moneda bienvenida:** `bob` flotación ±5px, 3.4s infinite.
- **Barra de vida:** al montar, rellenar de 0 al valor (`fill`, ~.8s ease).
- **Feedback de decisión:** al elegir, el medidor afectado salta y hace micro-shake (`shake2`, ±4px) con un `+N`/`−N` que sube y se desvanece (`rise`). Ej.: Imprimir → inflación +9 (rojo, shake); Reforma a tiempo → flash verde.
- **Desbloqueo de nodo:** cruce de opacidad bloqueado→desbloqueado con `pop` de escala y burst del anillo.

Keyframes de referencia (ver `<helmet>` del HTML): `pc-pop`, `pc-ring`, `pc-bob`, `pc-fill`, `pc-press`, `pc-lockout`, `pc-lockin`, `pc-rise`, `pc-shake2`.

## Estado / datos
- Reutilizar `useGameState` / fases existentes (`select` → `cell/intro` → `negotiation/mechanic` → `policy` → `outcome`). El rediseño **no cambia la lógica**, solo la capa visual.
- Medidores por episodio: derivan del estado de la mecánica (inflación, apoyo, reservas). El "hero number" (precio del pan) viene del ticker de inflación (`useInflation`).
- Progreso del mapa (completado / actual / bloqueado + estrellas) desde el progreso guardado del jugador.
- Añadir `accent`/`accentEdge` por episodio en `src/data/episodes/*`.

## Assets
- Retratos de asesores: `assets/*.webp` (reutilizados del juego actual). **Nota:** hoy son grabados sepia; funcionan enmarcados en el "marco-moneda" dorado. Si más adelante se quiere el estilo "3D suave / mascota" del brief, reemplazar solo los archivos manteniendo el marco.
- Íconos de acción/nodo: emojis en el mock por rapidez (🖨️ ✂️ 🤝 ⚓ 🔥 🏦 🍞 🔒). Para un tono "creíble, no infantil" se recomienda sustituirlos por un set de íconos dibujados a medida.
- Bandera: solo un guiño sutil (emoji 🇧🇴 en la card de historia); evitar clichés.

## Restricciones
Mobile-first ~380px · React + Tailwind · alto contraste y legibilidad · accesible (`prefers-reduced-motion`, focus visible `outline:2px solid` coherente con la paleta) · hit targets ≥44px.

## Capturas (`screenshots/`)
Renders de referencia de cada pantalla (mobile ~380px). No son código; son la meta visual.
- `01-bienvenida.png`
- `02-mapa-de-crisis.png`
- `03-decision.png`
- `04-desenlace.png`
- `05-intro-episodio.png`
- `06-negociacion.png`

## Archivos en este paquete
- `Paicio Rediseño.dc.html` — referencia visual completa (marca, tokens, **6 pantallas**, micro-interacciones). Ábrelo en un navegador.
- `screenshots/*.png` — captura de cada pantalla.
- `assets/*.webp` — retratos de asesores.
