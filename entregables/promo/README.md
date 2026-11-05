# App Promo · PITB Antioquia (UI Motion Graphics + Character Explainer)

El prototipo en formato **App Promo / Product Explainer**, en la línea de los videos de producto de apps como Duolingo y de las plantillas de Mixkit para DaVinci:

- **UI Motion Graphics:** la interfaz real del prototipo, vista móvil y de escritorio, dentro de mockups de teléfono y portátil. Las piezas de la UI salen de la pantalla con resortes elásticos, inclinación 3D y zooms.
- **Character Explainer:** **Tremi**, un oso de anteojos (*Tremarctos ornatus*, especie andina vulnerable) en vector 2D. Lanza la foto al teléfono, señala, presenta resultados y celebra la validación.
- **Kinetic Typography:** frases cortas que entran palabra por palabra con rebote y subrayado, sobre la grilla de la música (120 BPM: 1 beat = 15 cuadros).
- **Microinteracciones y efectos de sonido:**
  - Visuales: toques con onda expansiva, botón que se hunde, pin que vuela y rebota en el mapa, check animado, confeti, transiciones de iris entre escenas.
  - Sonidos: pops, clics, "bong" y swooshes (Kenney, CC0).

## Archivos
| Archivo | Qué es | Uso |
|---|---|---|
| `PITB_App_Promo_16x9.mp4` | Promo completo de ~49 s con música y efectos | Redes, YouTube, abrir o cerrar la presentación del 7 nov |
| `laminas_promo/00_Intro_Tremi_logo.mp4` | Tremi saluda + isologo (8 s) | Intro del video de 3 min |
| `laminas_promo/M1_…M5_*.mp4` | Escenas del promo como láminas para el bloque de María | V2 del video de 3 min (ver `../montaje/mapa_de_montaje.md`) |
| `laminas_promo/extra_bioclip_identifica.mp4` | Escena "La IA identifica la especie" | Opcional: bloque de Juan (J1) o presentación |
| `kit_tremi_alpha/Tremi_*_secuencia_PNG.zip` | Tremi con **fondo transparente** (secuencias PNG, 4 s a 30 fps): saluda, celebra, señala derecha/izquierda, presenta | Descomprimir y poner en V3 encima de cualquier plano en DaVinci |
| `kit_tremi_alpha/Tremi_saluda.mov` | El mismo saludo en ProRes 4444 con alfa (arrastrar y soltar) | V3 en DaVinci |
| `Tremi_hoja_de_personaje.png` | Poses y expresiones | Referencia de marca |

## Estructura del promo (49 s)
| # | Escena | Qué pasa |
|---|---|---|
| 1 | Hook | "¿Qué especie es esta?" con la foto del oso; Tremi asoma y señala: es él mismo |
| 2 | Tremi | Salta y saluda: "¡Hola! Soy Tremi, un oso de anteojos", "Te muestro cómo funciona PITB Antioquia" |
| 3 | Logo | El isologo se construye con un destello: "Catálogo vivo de biodiversidad con IA" |
| 4 | Explorar | Tremi lanza la foto al teléfono, cae en la zona de carga y aparecen los filtros por grupo |
| 5 | BioCLIP | Toque en "Analizar"; los pasos del análisis salen volando y luego sale el top-3 con 88,7 % (rotulado como simulado) |
| 6 | Ficha | La ficha "explota" en piezas: autoría y licencia, taxonomía, top-3, botón publicar |
| 7 | Mapa | El pin vuela del teléfono al tablero real en el portátil y cae en el Suroeste con confeti |
| 8 | Validación | Clic en "Validar", check animado y Tremi celebra |
| 9 | Cierre | "Cada foto se convierte en un dato.", isologo y URL |

## Tremi en DaVinci Resolve (clips con transparencia)
1. `Tremi_saluda.mov` se arrastra directo. Las demás poses vienen como **secuencia PNG** (pesan 4 veces menos): descomprime el `.zip`, y en el *Media Pool* usa *Import Media* sobre la carpeta. DaVinci reconoce la secuencia como un solo clip; si salen cuadros sueltos, desactiva en el menú del Media Pool *Show Individual Frames*. Ponlo en **V3**, encima del plano.
2. Si el borde se ve oscuro: clic derecho en el clip › *Clip Attributes* › *Video* › **Alpha Mode: Straight** (o *Premultiplied*, el que se vea limpio).
3. Ajusta tamaño y posición en *Inspector › Transform* (por ejemplo Zoom 0,45, en la esquina inferior derecha).
4. Ideas:
   - Tremi saluda en los primeros 2 s del video.
   - Señala la lámina de BioCLIP mientras habla Juan.
   - Celebra al final, junto a los créditos.

## Tremi · reglas de marca
- **Quién es:** un oso de anteojos curioso y optimista. Lleva la pañoleta verde de PITB. Explica sin palabras difíciles y celebra cuando un dato queda validado.
- **Por qué un oso de anteojos:** es la única especie de oso de Sudamérica, vive en los Andes de Antioquia y está catalogada como **vulnerable** en la Lista Roja de la UICN. Es justo el tipo de especie cuya ubicación la plataforma protege (coordenadas generalizadas).
- **Colores:** pelaje `#2c221d`, "anteojos" crema `#f1dcb0`, pañoleta `#6cae4c` / `#2a6f49`.
- **No:** ponerlo a decir datos que no estén verificados, ni mostrarlo como si fuera una foto real de la especie.
- Personaje original creado para el proyecto (vector en `video/src/promo/Mascot.tsx`), no copia a ninguna mascota existente.

## Editar textos o tiempos
Todo es código Remotion: `video/src/promo/PromoScenes.tsx` (escenas), `kit.tsx` (mockups y efectos), `Mascot.tsx` (Tremi).
```
cd video
npx remotion studio            # ver y ajustar en el navegador
node scripts/render-promo.mjs  # volver a renderizar el promo, las láminas y el kit
```
Para recapturar el prototipo en vista móvil: `node scripts/capture-mobile.mjs --online --url https://mogollo7.github.io/PITB-Antioquia/`.

## Referencias de Mixkit (búsqueda "mockup")
Mixkit no tiene plantillas de mockup para DaVinci. Las referencias útiles están en otros formatos:

**Plantillas (After Effects / Premiere, solo como referencia de estilo):**
- [Smartphone Promo #596](https://mixkit.co/free-after-effects-templates/smartphone-promo-596/): teléfono en 3D inclinado, círculo grande de color detrás, fondo plano saturado, titular de 1 palabra + 2 líneas de apoyo y el teléfono alternando de lado en cada escena.
- [Phone Interface Text #602](https://mixkit.co/free-after-effects-templates/phone-interface-text-602/) y [Message Interface #543](https://mixkit.co/free-after-effects-templates/message-interface-543/): conversación que aparece burbuja por burbuja dentro de una pantalla de teléfono.
- [Text Message Animation #605](https://mixkit.co/free-after-effects-templates/text-message-animation-605/), [Promo Logo Reveal #775](https://mixkit.co/free-after-effects-templates/promo-logo-reveal-775/) y [Phone Support Title #852](https://mixkit.co/free-premiere-pro-templates/phone-support-title-852/) (Premiere).

**Video de stock con pantalla verde (sirve para mockups realistas con manos reales):**
- Teléfono en la mano: [#9083](https://mixkit.co/free-stock-video/hands-hold-greenscreen-mobile-phone-9083/), [#9078](https://mixkit.co/free-stock-video/woman-holding-greenscreen-mobile-phone-taps-screen-9078/), [#45345](https://mixkit.co/free-stock-video/holding-a-phone-with-a-green-screen-and-swiping-45345/), [#42636](https://mixkit.co/free-stock-video/chroma-on-a-smartphone-with-a-green-screen-background-42636/) (pantalla azul).
- Teléfono sobre el escritorio: [#100069](https://mixkit.co/free-stock-video/smartphone-with-a-green-screen-on-a-desk-setup-100069/), [#100080](https://mixkit.co/free-stock-video/the-hands-place-a-mobile-phone-featuring-a-green-screen-100080/), [#100084](https://mixkit.co/free-stock-video/a-mobile-phone-featuring-a-green-screen-sits-over-a-100084/) (con marcador de seguimiento), [#100086](https://mixkit.co/free-stock-video/the-hand-reaches-the-mobile-phone-featuring-a-green-screen-100086/).
- Portátil: [#45343](https://mixkit.co/free-stock-video/laptop-on-a-table-with-a-green-screen-45343/) (frontal, fijo), [#46041](https://mixkit.co/free-stock-video/close-up-of-a-laptop-with-green-screen-sitting-on-46041/) (4 marcadores), [#45677](https://mixkit.co/free-stock-video/close-up-of-a-green-screen-on-a-laptop-45677/), [#46743](https://mixkit.co/free-stock-video/hands-typing-with-a-green-screen-laptop-46743/), [#100321](https://mixkit.co/free-stock-video/hands-typing-on-a-laptop-with-a-green-screen-display-100321/), [#48285](https://mixkit.co/free-stock-video/laptop-with-a-green-screen-slide-in-48285/).
- Tableta: [#100088](https://mixkit.co/free-stock-video/a-sleek-tablet-featuring-a-green-screen-device-sits-on-100088/) (4 marcadores), [#13214](https://mixkit.co/free-stock-video/back-view-of-couple-holding-green-screen-tablet-13214/).

En DaVinci gratuito, poner el prototipo en esas pantallas:
1. Pon el clip verde en V2 y la grabación del prototipo debajo.
2. En la página Fusion, añade un **Delta Keyer** para quitar el verde y un **Corner Pin** para encajar la pantalla en las 4 esquinas.
3. Si la cámara se mueve, usa el **Tracker** con los marcadores.
