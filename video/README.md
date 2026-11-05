# Proyecto Remotion · PITB Antioquia

Todas las animaciones del video son código (React + Remotion). Los colores y las tipografías salen del CSS del prototipo y las capturas del prototipo son reales.

## Estructura
| Ruta | Qué es |
|---|---|
| `src/theme.ts` | Tokens del sitio (colores, curvas de animación) |
| `src/components.tsx` | Fondo topográfico, isologo animado, marco de navegador con cámara/cursor/llamadas, mapa de Antioquia (DANE) |
| `src/scenes/*.tsx` | Láminas por integrante (Salome, Daniela, Juan, Maria), marca (intro, outro, tercios), animatic y teaser |
| `src/data/guion.json` | **Guion final** (fuente única para el animatic, los SRT y los marcadores) |
| `src/data/antioquia.json` | 125 municipios en SVG (DANE MGN 2018, `scripts/build-antioquia.py`) |
| `src/data/species.json`, `boxes.json` | Datos del prototipo y posiciones de sus botones (para el cursor) |
| `public/proto/` | Capturas del prototipo @2x (`scripts/capture-prototype.mjs`) |
| `scripts/render-all.mjs` | Renderiza láminas, animatic, teaser y PNG a `../entregables` |

## Animación
Se usa Remotion con `interpolate`/`spring`. anime.js no hizo falta: su línea de tiempo trabaja en milisegundos con su propio reloj, y en Remotion habría que pausarla y manejarla cuadro a cuadro, sin ganar nada sobre las curvas nativas.

## Comandos
```
npm install
npx remotion studio              # previsualizar y ajustar
python scripts/build-timeline.py # tras cambiar guion.json
node scripts/render-all.mjs      # renderizar todo
```
En Linux sin Chrome descargable: `REMOTION_BROWSER=/ruta/a/chrome-headless-shell node scripts/render-all.mjs`.

Licencia de Remotion: es gratuita para personas y equipos pequeños (consulta remotion.dev/license). Este uso es académico.
