# Retratos de PAICIO — Prompts para DALL·E / ChatGPT

Generá los **5 retratos** (4 prisioneros + el rey). Cada uno **cuadrado (1:1)**, fondo simple.
Cuando los tengas, ponelos en `src/assets/` y avisame para cablearlos en el juego (hoy son emojis).

## Estilo base (igual para los 5)

> Vintage 1920s newspaper engraving portrait, halftone etching style, sepia and aged-paper tones, dramatic high contrast, head and shoulders, serious expression, no text, square 1:1, simple background

## Por personaje (agregá esto al estilo base)

- **Don Marcos** — Ex Presidente del Banco Central
  `elderly central banker, round spectacles, formal dark suit, cold calculating look`

- **Compañera Gladys** — Líder del Sindicato (antes "Rosa")
  `determined working-class woman labor union leader, headscarf, raised chin, defiant`

- **Señor Fondo** — Representante del Fondo Monetario
  `sharp foreign banker, slick hair, briefcase, thin humorless smile`

- **El Comerciante** — Cámara de Comercio
  `tired middle-aged merchant, apron, weary pragmatic eyes`

- **El Presidente** (para Episodios futuros)
  `paranoid populist president, military-style sash, nervous grandeur`

## Notas

- Paleta del juego: sepia `#1A1208` / papel `#E8D5A3` / rojo crisis `#C0392B`. Si DALL·E
  permite, pedí que respeten esos tonos para que peguen con la interfaz.
- Acento de color asignado a cada personaje en el código (`src/data/prisoners.js`):
  Marcos oro `#C9A24B` · Gladys rojo `#C0392B` · Fondo azul `#5B8DB8` · Comerciante verde `#27AE60`.
- Para generar imágenes: **DALL·E / ChatGPT**, no Canva AI.
