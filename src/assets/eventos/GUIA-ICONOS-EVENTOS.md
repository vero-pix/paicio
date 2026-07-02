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
