# Guía de estilo — Retratos de asesores (PAICIO rediseño)

Estilo de personaje para el rediseño luminoso. Objetivo: **ilustración "soft-3D" cálida, redondeada y creíble — no infantil**, cuadrada (1:1), pensada para el **marco-moneda** dorado (recorte circular). Coherente entre episodios: mismo tratamiento, cambia el reparto y el acento del país.

## Principios visuales
- **Formato:** cuadrado, exportar 512×512 (y 1024 si se generan hi-fi). PNG o WEBP.
- **Encuadre:** cabeza y hombros, mirada al frente o 3/4 leve. **Composición segura para círculo:** rasgos dentro del 70% central; hombros tocan el borde inferior.
- **Fondo:** relleno completo con un **disco de color = tinte del acento del personaje** (radial, más claro arriba-izquierda). Nada de esquinas vacías (el marco recorta en círculo). Un halo blanco suave arriba-izquierda (~8% opacidad) da la luz.
- **Iluminación:** luz cálida suave arriba-izquierda; sombra del lado derecho de la cara; rim-light claro en el contorno izquierdo. Sin bordes negros duros; volumen por gradientes, no por líneas.
- **Piel:** gradiente de 3 paradas (claro→medio→sombra), tonos latinoamericanos variados y cálidos. Rubor tenue en mejillas (`#e8907a` ~35% radial).
- **Rasgos:** proporciones semi-realistas (ojos a media altura, no enormes; nariz insinuada con una línea de sombra; boca sobria). La **expresión** carga la personalidad — cejas y comisura de boca hacen casi todo el trabajo.
- **Pelo/ropa:** formas rellenas con un gradiente/sombra, sin detalle de mechón fino salvo acento. Ropa que comunique el rol (traje, delantal, banda militar…).
- **Prohibido:** ojos gigantes tipo caricatura, contornos negros gruesos, texturas fotográficas, dientes detallados, texto.

## Paleta base (piel y neutros)
- Piel claras→sombra por personaje (ver tabla). Contorno rim: `#fff*` cálido.
- Boca: `#a85b4a`/`#9c5040`. Cejas/pelo oscuro: `#2a1d14`–`#4a3524`.

## Acento por personaje (fondo + código)
Cada personaje tiene un **acento** (fondo disco + color en `src/data/prisoners.js`). Para Bolivia 1985:

- **Don Marcos** · Banco Central — oro `#C9A24B` (disco `#E6BE63`→`#F6DE9A`). Anciano calvo, canoso en los lados, **anteojos redondos**, traje azul oscuro + corbata granate. Expresión: labios apretados, fría.
- **Compañera Gladys** · Sindicato (COB) — rojo `#D9503C` (disco `#D9503C`→`#F07B5F`). **Pañuelo/paliacate** en la cabeza, camisa de trabajo terracota, mentón en alto, ceño combativo.
- **Señor Fondo** · FMI — azul `#4E82AE` (disco `#4E82AE`→`#7FB0D6`). Pelo **peinado hacia atrás con gel**, traje oscuro impecable + corbata, media sonrisa sin humor, mirada de reojo.
- **El Comerciante** · Cámara de Comercio — verde `#3E9B63` (disco `#3E9B63`→`#6FC08C`). **Bigote**, pelo castaño desordenado, **delantal** sobre camisa, ojos cansados, gesto resignado.
- **El Presidente** · Antagonista — violeta `#8A5BC4` (disco `#8A5BC4`→`#B189DF`). Pelo **rizado**, **bigote**, **banda presidencial + medalla + charreteras**, ojos muy abiertos (grandeza nerviosa), ceño.

> Nota: los acentos de personaje conviven con el **acento del episodio** (Bolivia = ámbar). En pantalla, el marco-moneda es siempre dorado; el disco de fondo del retrato usa el acento del personaje para diferenciarlos en la mesa de negociación.

## Cómo se produjeron estos archivos
Los PNG de `assets/asesores/` son **ilustraciones vectoriales** (SVG → PNG 512) construidas con gradientes y formas siguiendo esta guía; sirven como set final utilizable y como **referencia exacta de estilo**. El `.svg` de cada uno es editable (colores, expresión).

## Si quieres versiones hi-fi con IA (DALL·E / Midjourney)
Usa este **prompt base** + el bloque por personaje. Pide **fondo del color del acento** y formato cuadrado.

**Base (igual para todos):**
> Soft 3D character portrait, warm friendly casual-game art style, smooth gradient shading, rounded shapes, gentle rim light from top-left, head and shoulders, looking at camera, semi-realistic proportions (not chibi, no thick outlines), believable adult, flat solid background disc, square 1:1, no text.

**Por personaje (añade al base):**
- **Don Marcos:** `elderly bald Latin American central banker, gray hair at the sides, round thin spectacles, dark navy suit with maroon tie, cold composed expression. Warm gold #E6BE63 background.`
- **Compañera Gladys:** `determined middle-aged Latina labor-union leader, red headscarf, terracotta work shirt, chin up, defiant serious look. Warm red #E86A50 background.`
- **Señor Fondo:** `sharp foreign IMF banker, slicked-back dark hair, impeccable dark suit and tie, thin humorless half-smile, cool detached eyes. Blue #6FA0CC background.`
- **El Comerciante:** `tired pragmatic Latin American shopkeeper, mustache, messy brown hair, apron over shirt, weary resigned eyes. Green #5FB080 background.`
- **El Presidente:** `nervous populist Latin American president, curly dark hair, mustache, military presidential sash with medal and epaulettes, wide anxious eyes, grandiose. Purple #A07BD0 background.`

## Reutilizar en otros episodios
Mantén base, iluminación, encuadre y "composición segura para círculo". Cambia reparto, vestuario del rol y el **disco de fondo al acento del país** (Argentina azul, Chile coral, Brasil violeta/verde). Así todo el juego comparte un mismo lenguaje de personaje.

## Wiring en el código
- Reemplaza en `src/assets/` los `.webp` sepia por estos PNG (mismos nombres lógicos): `don-marcos`, `gladys` (antes "Rosa"), `senor-fondo`, `comerciante`, `presidente`.
- El marco-moneda ya existe en la UI: `padding:3–5px; background:radial-gradient(circle at 34% 28%,#FFE9A8,#F7C24A 55%,#D98A16); border-radius:50%; img con border:2–3px solid #fff`.
- Tamaños en uso: 112 (intro/bienvenida) · 72 (negociación) · 58 (decisión) · 50 (tira de coalición).

## Archivos
- `assets/asesores/*.png` — retratos 512×512 listos para usar.
- `assets/asesores/*.svg` — fuente vectorial editable de cada retrato.
