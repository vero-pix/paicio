# Guía — Íconos de eventos (cartas de shock) · PAICIO rediseño

Set de íconos para las **cartas de shock/evento** del juego, en el mismo lenguaje
**soft-3D** de los retratos de asesores: ilustración cálida, redondeada y creíble,
volumen por gradientes (no por líneas), cuadrada 1:1, pensada para ir **dentro de
un disco de color** en la carta. Construidos como **SVG** (editables) y exportados
a **PNG y WEBP 512×512**.

## Principios visuales (idénticos a los retratos)
- **Formato:** cuadrado, `viewBox 0 0 512 512`, exportar 512. PNG/WEBP.
- **Fondo = disco de acento:** relleno completo con un `radialGradient` (más claro
  arriba-izquierda). Nunca dejar esquinas vacías — el disco/marco recorta en círculo.
  `cx="42%" cy="34%" r="76%"`, stop 0% claro → stop 100% acento.
- **Luz:** halo blanco suave arriba-izquierda (`<circle cx=150 cy=120 r=132 fill=#fff opacity=.08>`).
  Luz cálida arriba-izquierda; sombra abajo-derecha.
- **Objeto:** centrado (~x256), ocupa el 60% central; base ~y372. Debajo, una
  **sombra de contacto** (`<ellipse cx=256 cy=392 rx≈110 ry≈24 fill=#000 opacity=.12>`).
- **Volumen:** cada forma con gradiente de 2–3 paradas (claro→medio→sombra). Un
  **rim-light** claro (stroke fino, `opacity≈.5`) en el contorno izquierdo, y una
  franja de brillo blanca (`opacity≈.13`) en la cara superior-izquierda.
- **Prohibido:** contornos negros gruesos, texturas fotográficas, degradados
  arcoíris. Sin texto salvo el glifo de moneda **$** (marca) cuando aplique.
- **Legibilidad:** silueta bold y simple — deben leerse a **44–56px** (nodos/medidores).

## Esqueleto SVG (plantilla base)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs>
  <radialGradient id="d" cx="42%" cy="34%" r="76%">
    <stop offset="0%" stop-color="{ACENTO_CLARO}"/>
    <stop offset="100%" stop-color="{ACENTO}"/>
  </radialGradient>
  <!-- gradientes del objeto aquí -->
</defs>
<rect width="512" height="512" fill="url(#d)"/>                    <!-- disco -->
<circle cx="150" cy="120" r="132" fill="#ffffff" opacity=".08"/>  <!-- halo luz -->
<ellipse cx="256" cy="392" rx="110" ry="24" fill="#000" opacity=".12"/> <!-- sombra -->
<!-- ...formas del objeto con gradientes + rim-light... -->
</svg>
```

## Set inicial · Bolivia 1985
El **disco** de cada carta usa un acento **semántico** (no el acento del episodio):
buenas noticias en verde, presión externa en azul, especulación en violeta, crisis
interna en coral/rojo, costos en ámbar.

| Archivo | Evento | Categoría | Disco (claro → acento) | Objeto |
|---|---|---|---|---|
| `petroleo` | Shock petrolero | costos | `#F8CE86 → #ED9E38` (ámbar) | Barril de acero con aros |
| `sindicato` | Paro de la COB | sindical | `#F3987F → #DE5740` (rojo) | Megáfono + ondas de sonido |
| `fmi` | Crédito del FMI | externo | `#93BAD9 → #4E82AE` (azul) | Maletín navy con broches dorados |
| `banco-corrida` | Rumor de corrida | bancario | `#F2937C → #E4573F` (coral) | Banco con columnas + fila |
| `cosecha` | Buena cosecha | buena noticia | `#83C79A → #3E9B63` (verde) | Espigas de trigo atadas |
| `acaparamiento` | Acaparamiento | especulación | `#BC96E4 → #8A5BC4` (violeta) | Billetes + candado de latón |
| `dolar` | Presión del dólar | dolarización | `#7DC7BC → #2E9E8F` (teal) | Billete verde con medallón "$" |
| `deuda-externa` | Vence la deuda | deuda externa | `#86B7E6 → #3F92DA` (azul cielo) | Buque de carga con contenedores |

### Paleta de materiales reutilizable (objetos)
- **Piel / madera:** `#f0d3b4 · #e3bd98 · #c99e78`
- **Acero:** `#CFD7E0 · #8994A2 · #5E6B7A`
- **Navy (FMI/traje):** `#46516A · #333C51 · #232A3A`
- **Oro / latón (marca, broches, candado):** `#FFE29C · #F3C15A · #C9871F`, borde `#8A4E12`
- **Verde dinero:** `#68B98A · #3C8B5E · #2C7E50`
- **Piedra (edificios):** `#FDF7EA · #EEDFC2 · #D6C39F`
- **Rojo náutico/megáfono:** `#F28C72 · #DA4E33 · #9A3421`

## Cómo se usan en la carta
- **Recorte circular** sobre el disco (como el marco-moneda de los retratos):
  `border-radius:50%; overflow:hidden; box-shadow: inset 0 0 0 5px #fff, 0 10px 22px -10px rgba(60,40,10,.5);`
- Tamaños: **132px** (hero de la carta), **56px** (nodo/medallón), **44–52px** (medidores).
- El disco ya viene *horneado* en el SVG → basta con `<img>` recortado en círculo.

## Replicar en otros episodios
Mantén **esqueleto, luz, encuadre y la sombra de contacto**. Cambia sólo:
1. **El acento del disco** según la semántica del evento (mismas familias de color).
2. **El objeto** que representa el shock local (p. ej. Argentina 2001 → candado de
   banco/"corralito", cacerola; Chile 1982 → gráfico cayendo, casa/hipoteca UF).
3. Reutiliza la **paleta de materiales** de arriba para que todo el juego comparta
   el mismo lenguaje. Un objeto = una silueta clara + 2–3 paradas de gradiente +
   un rim-light + un brillo. Nada más.

Para un nuevo ícono: copia un `.svg` cercano, cambia los dos stops del `#d` (disco)
y sustituye el bloque del objeto. Re-exporta a PNG/WEBP 512.

## Archivos
- `*.svg` — fuente vectorial editable (colores, formas).
- `*.png` — 512×512, fondo opaco (disco incluido).
- `*.webp` — 512×512, ~7–11 KB, para producción.
- Vista de contacto + uso: `Iconos Eventos.dc.html` (raíz del proyecto).

---

# 📋 BRIEF · Íconos de eventos Ep2–Ep4 (encargo a Claude Design)

Hoy las cartas de evento de **Ep2 (corralito), Ep3 (paridad), Ep4 (inercia)** usan
**emoji de fallback**. Este brief pide reemplazarlos por íconos soft-3D (mismo
lenguaje que Bolivia). **Ep5 (Plan Real) no lleva íconos**: es un puzzle de
secuencia, no tiene cartas de evento.

**Clave del ahorro:** ~6 de los shocks se repiten entre episodios y **reutilizan
íconos existentes** de Bolivia (o uno nuevo compartido). Solo hay que dibujar
**~10 íconos nuevos**, no 24.

### Categorías de disco (reutilizar los mismos gradientes de la tabla de Bolivia)
buena noticia → verde · externo/FMI → azul · especulación → violeta · crisis
bancaria → coral · costos/commodity → ámbar · dolarización → teal · deuda/mercado
→ azul cielo · social/sindical → rojo · político/prensa → violeta apagado.

### ♻️ Reutilizables (ya existen — no redibujar)
| Ícono existente | Se reusa en |
|---|---|
| `fmi` | Ep2 `blindaje`, Ep3 `rescateFMI`, Ep4 `fmiGesto` |
| `dolar` | Ep2 `rumorPeso`, Ep3 `rumorDeval`, Ep4 `dolarParalelo` |
| `cosecha` | Ep2 `exportaciones`, Ep3 `exportaPunta` |
| `banco-corrida` | Ep2 `feriado`, Ep3 `quiebraBanco` |
| `sindicato` (megáfono) | Ep3 `paroCobre`, Ep4 `sindicatos` |
| `acaparamiento` | Ep4 `remarcaje` |

### 🆕 A producir (~10 nuevos, 512×512 SVG→PNG/WEBP)
| Archivo | Evento (ep) | Categoría · Disco | Objeto |
|---|---|---|---|
| `riesgo-pais` | Ep2 riesgoPais | mercado · azul cielo `#86B7E6→#3F92DA` | Gráfico de bonos cayendo en picada (flecha roja) |
| `cacerolazo` | Ep2 cacerolazo | social · rojo `#F3987F→#DE5740` | Cacerola/olla con cuchara de palo golpeando |
| `patacones` | Ep2 patacones | dolarización · teal `#7DC7BC→#2E9E8F` | Bono/vale provincial atado, sello impreso |
| `fuga-capitales` | Ep2 fugaCapitales + Ep3 fugaDolares | especulación · violeta `#BC96E4→#8A5BC4` | Maletín abierto con billetes que salen volando |
| `fed-tasas` | Ep3 fed | externo · azul `#93BAD9→#4E82AE` | Columna/edificio con flecha de tasa subiendo |
| `cobre` | Ep3 cobre | costos · ámbar `#F8CE86→#ED9E38` | Lingotes de cobre apilados (naranja metálico) |
| `prensa` | Ep4 filtracion | prensa · violeta apagado `#B5A0C9→#7E68A0` | Periódico doblado con titular (sin texto legible) |
| `senal-fiscal` | Ep4 senalFiscal | buena noticia · verde `#83C79A→#3E9B63` | Tijera de recorte + visto bueno / gráfico al alza |
| `congelamiento` | Ep4 reboteCongelamiento | crisis · azul frío `#9CC7E8→#5A93C4` | Copo de nieve / bloque de hielo derritiéndose |
| `congreso` | Ep4 respaldoCongreso | político · violeta apagado `#B5A0C9→#7E68A0` | Cúpula/columnas del Congreso |

### Handoff técnico (cuando lleguen los .webp)
1. Dejar los `.webp` 512×512 en `src/assets/eventos/`.
2. Importarlos en `src/assets/eventos/index.js` y agregarlos al mapa `eventIcons`
   (clave = nombre de archivo).
3. En `src/data/episodes/episode{2,3,4}.js`, agregar `iconKey: '<archivo>'` a cada
   evento (ver tablas). `EventCard` ya cae al emoji si el `iconKey` aún no existe,
   así que el orden no rompe nada.

**No bloquea el desarrollo:** mientras no lleguen, el emoji cubre.
