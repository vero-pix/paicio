# Música de PAICIO

Por defecto, cada episodio suena con un **ambiente procedural** (generado en el
navegador con Web Audio API) — no hace falta ningún archivo para que haya música.

Si quieres reemplazarlo por **pistas reales** (ambient, tenso, años 20-30), deja
aquí un archivo por episodio con el nombre del `id` del episodio:

- `ep1.mp3` → La Gran Quema (Weimar 1923)
- `ep2.mp3` → El Corralito (Argentina 2001)
- `ep3.mp3` → El Milagro que No Fue (Chile 1982)
- `ep4.mp3` → La Década Perdida (Brasil)
- `ep5.mp3` → El Plan Real (Brasil 1994)
- `menu.mp3` → pantalla de inicio

Formatos aceptados: `.mp3` o `.ogg`. El motor de sonido (`src/lib/sound.js`)
carga el archivo con Howler.js si existe, con loop y fade in/out; si no lo
encuentra, usa el ambiente procedural. Volumen ~0.4 para no tapar el texto.

Fuentes recomendadas de música royalty-free: freesound.org, incompetech.com
(Kevin MacLeod), o pixabay.com/music. Verifica la licencia antes de usar.
