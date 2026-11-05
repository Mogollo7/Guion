# Entregables · Video PITB Antioquia (≤ 3:00)

Todo lo necesario para grabar, montar en DaVinci Resolve gratuito (Windows) y presentar el 7 de noviembre.

## Orden de trabajo
1. **Los 4 integrantes:** leer `01_GUION_TELEPROMPTER.md` y grabar según `02_GUIA_GRABACION.md`.
2. **Quien edita:** ver `animatic/PITB_animatic_referencia.mp4` (el video completo, con marcadores donde van los planos a cámara) y montar con `03_MONTAJE_DAVINCI_RESOLVE.md` + `montaje/mapa_de_montaje.md`.
3. Opcional: planos de ambiente con ArtCraft (`04_ARTCRAFT_PLANOS_DE_APOYO.md`).
4. Exportar, subir a YouTube (público o no listado) y pegar los créditos de `05_CREDITOS_Y_LICENCIAS.md`.
5. Corregir el PDF con `07_TEXTO_ESCRITO_PENDIENTES.md` y pegar el enlace.
6. Preparar la sesión en vivo con `06_REFLEXION_ETICA_Y_PREGUNTAS.md` y la presentación de Canva.
7. Opcional: plantillas de Mixkit adaptadas a PITB (tercios, llamadas, logo, transiciones) con `08_MIXKIT_PITB.md`.

## Carpetas
| Carpeta | Contenido |
|---|---|
| `promo/` | **App Promo** (~49 s) estilo UI Motion Graphics con mockups, la mascota **Tremi** y tipografía cinética; láminas del promo para el bloque de María; Tremi con fondo transparente para DaVinci |
| `laminas/` | 16 animaciones MP4 1080p30 en estilo sobrio de datos (intro, 14 planos, outro), listas para la pista V2 |
| `graficos/` | PNG transparentes: tercios inferiores, etiqueta de capítulo + logo para planos a cámara, sello "datos ilustrativos" |
| `animatic/` | Montaje de referencia completo (2:40) con música y subtítulos, ya con la intro de Tremi y el bloque del prototipo en estilo App Promo |
| `subtitulos/` | SRT por integrante y SRT completo estimado |
| `montaje/` | Mapa de montaje y marcadores (CSV) |
| `logo/` | Isologo en SVG y PNG + reglas de uso |
| `audio/` | Música (CC BY 4.0, exige atribución) |
| `../brag-output/` | Teaser de 20 s para redes (`brag.mp4`) + texto para compartir |
| `../video/` | Proyecto Remotion (código de todas las animaciones) para re-renderizar si algo cambia |

## Decisiones de dirección
- Nombre en pantalla: **PITB Antioquia**. Reto: **Territorio Sostenible**.
- Guion: dos correcciones (21.600 especies; el reordenamiento por ubicación es un paso de la plataforma).
- Prototipo: se muestra el **real** (capturas de `Mogollo7/PITB-Antioquia`, vista móvil y escritorio) dentro de mockups de teléfono y portátil. Todo dato simulado se rotula como ilustrativo.
- Dos estilos que conviven: **datos sobrios** para el problema, la propuesta y BioCLIP, y **App Promo con Tremi** para el prototipo y la intro (ver `promo/README.md`).
- Se priorizó DaVinci gratuito con montaje manual guiado: el MCP de Resolve necesita Studio para funcionar bien.

## Re-renderizar (si cambian textos o cifras)
```
cd video
npm install
npx remotion studio                              # ver y editar en el navegador
node scripts/capture-prototype.mjs --online --url https://mogollo7.github.io/PITB-Antioquia/   # recapturar el prototipo (requiere: npx playwright install chromium)
python scripts/build-timeline.py                 # recalcula animatic, SRT y marcadores desde src/data/guion.json
node scripts/render-all.mjs                      # todo, o: node scripts/render-all.mjs S2 J2
node scripts/render-promo.mjs                    # App Promo, láminas del promo y kit de Tremi
```
