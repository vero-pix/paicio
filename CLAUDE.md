# PAICIO — Guía para Claude

Juego educativo de política económica. **En producción** en https://paicio.economics.cl

## Stack — corrige al global

El CLAUDE.md global menciona Next 16: **aquí no**. Este proyecto es **React 18 + Vite 6 + Tailwind v4**,
sin Next y sin backend. Todo el estado vive en el cliente.

## Estructura

```
src/components/   componentes de juego
src/data/         episodios y contenido
src/hooks/        estado y lógica de partida
src/lib/  src/utils/  src/theme/
```

## Dónde está el estado del proyecto

Antes de proponer trabajo nuevo, leer `STATUS.md`: lleva la tabla de fases con lo que ya está
en producción. `ROADMAP.md`, `PENDIENTES-v0.26.md` y `CHANGELOG-PAICIO.md` completan el cuadro.
`CONCEPTO-LINEA-MICRO.md` y `MECANICAS-DINAMISMO.md` documentan las decisiones de diseño del juego
— leerlos antes de cambiar mecánicas, no improvisar sobre ellas.

## Convenciones

- Las fases se numeran y se cierran en `STATUS.md` al llegar a producción. Mantener esa tabla.
- Los episodios en construcción se marcan con badge "En construcción" (Chile y El Norte, a la fecha).
- La reputación es cross-episodio: se persiste entre partidas y se muestra con delta (+N/-N).
