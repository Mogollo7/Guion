# ArtCraft · planos de apoyo (opcionales)

ArtCraft (app de escritorio para Windows/macOS y estudio web en `app.getartcraft.com`, proyecto `storytold/artcraft`) genera imagen y video con IA y deja componer la escena en 2D/3D antes de generar. No pude abrir su web oficial desde mi entorno, así que **revisa en la app los créditos o costos de cada modelo** antes de generar.

## Regla de uso (importante para el jurado)
El proyecto trata de **datos reales de biodiversidad**. Por eso:
1. **Nunca** generes animales o plantas identificables como si fueran evidencia. Las especies del video salen de fotos reales de iNaturalist (con crédito).
2. Usa ArtCraft solo para **ambiente**: paisaje, manos, celular, cámara trampa, transiciones.
3. Cada plano generado lleva el rótulo **"Imagen ilustrativa generada con IA"** (abajo a la izquierda, 3 s) y se menciona en los créditos del texto escrito.

## Dónde encajan (todos van en V2, 2–4 s, sobre la voz)
| Plano | Idea | Prompt sugerido (en inglés suele rendir mejor) | Formato |
|---|---|---|---|
| S1 (antes del mapa) | Amanecer sobre montañas antioqueñas | `aerial drone shot at sunrise over green Andean mountains and cloud forest valleys in Antioquia Colombia, mist between ridges, small rural roads, cinematic, natural colors, no text, no animals` | Video 16:9, 4 s, *image to video* desde una imagen generada |
| S2 (muestreo manual) | Libreta de campo y botas en el barro | `close-up of a biologist's field notebook with handwritten tally marks on a wooden table in a humid tropical forest station, rubber boots and binoculars blurred in background, soft daylight, no readable text, no faces` | Imagen 16:9 + zoom lento en DaVinci |
| D2 (sube una foto) | Mano tomando una foto con el celular | `hand holding a smartphone taking a photo in a tropical forest trail in Colombia, phone screen blurred, shallow depth of field, morning light, no visible brand logos, no animals` | Video 16:9, 3 s |
| D3 (alertas) | Cámara trampa amarrada a un árbol | `camera trap strapped to a mossy tree trunk in a dense Andean cloud forest at dusk, green indicator light, realistic, no animals, no text` | Imagen 16:9 |
| Transición J1 → J2 | Textura de datos sobre relieve | `abstract topographic contour lines in dark forest green with glowing small data points, minimal, elegant, flat background #073821, no text` | Imagen 16:9 |

## Flujo sugerido en ArtCraft
1. *Text to image* con el prompt → elige la mejor de 4.
2. Si quieres movimiento: *Image to video* (3–4 s), cámara lenta, sin cambios bruscos.
3. Exporta MP4 1080p o PNG 1920 × 1080 y guárdalo en el bin `06_ARTCRAFT` de DaVinci.
4. En DaVinci, añade encima el rótulo de IA (`Effects › Titles › Text+`, Manrope o Arial 28 px, blanco al 80 %).

Si no hay tiempo, **sáltate este paso**: el video funciona completo solo con las láminas.
