# Pack Mixkit × PITB para DaVinci Resolve

Mixkit tiene **32 plantillas gratuitas para DaVinci Resolve**: tercios inferiores, llamadas, títulos de logo, transiciones, pantallas divididas e historias verticales. **No tiene plantillas de "app promo" con teléfono para DaVinci**; esa parte ya la cubre nuestro App Promo (`promo/`).

Elegí las que sirven para PITB y las **adapté a la marca**: textos del proyecto, tipografías Fraunces y Manrope, verde `#6cae4c` y el logo PITB.

## Cómo obtener el pack
Las plantillas no se suben al repositorio público: no pude leer el texto exacto de la licencia de Mixkit para *video templates*, así que por prudencia no las redistribuyo. Hay dos caminos:
1. **Ya adaptado:** usa `Mixkit_PITB_pack.zip`, que te mandé por el chat. Descomprímelo en `C:\PITB\mixkit` y **copia la carpeta `entregables/logo` a `C:\PITB\logo`**. Los títulos de logo buscan el PNG en esa ruta.
2. **Generarlo tú** (descarga directo de Mixkit y adapta). Necesita Python 3:
   ```
   python skills\tema-personalizado\grupo34-pitb-antioquia\mixkit_pitb.py --out C:\PITB\mixkit
   ```
   Así el logo queda enlazado a `entregables\logo` del repositorio, sin copiar nada.

## Qué trae
| Archivo | Plantilla Mixkit | Para qué |
|---|---|---|
| `TerciosInferiores/LT_linea_<persona>.comp` (×4) | #677 Animated Line Lower Third | Nombre y rol de cada integrante, con línea verde animada |
| `Titulos/Capitulo_Territorio_Sostenible.comp` | #678 Line Drop Lower Third | Rótulo "TERRITORIO SOSTENIBLE · AGENDA ANTIOQUIA 2040" |
| `Titulos/Marca_PITB_Foto_Especie_Dato.comp` | #681 Animated Text Split | "PITB │ FOTO → ESPECIE → DATO" (la palabra va cambiando) |
| `Llamadas/BioCLIP_identifica.comp` | #688 Simple Dot Callout | Señalar algo en pantalla: "BIOCLIP · IDENTIFICA LA ESPECIE" |
| `Llamadas/Revision_humana.comp` | #690 Spin Reverse Callout | "REVISIÓN HUMANA" (bloque de Juan, P3) |
| `Llamadas/Tu_foto_un_dato.comp` | #691 Dual Line Arrow Callout | "TU FOTO · SE CONVIERTE EN UN DATO" |
| `Llamadas/Aqui.comp` | #692 Dot Pointer Callout | Puntero "AQUÍ" para marcar un botón o zona |
| `Llamadas/Oso_de_anteojos_VU.comp` | #693 Three Heading Callout | "OSO DE ANTEOJOS · TREMARCTOS ORNATUS · VULNERABLE (VU) → COORDENADAS PROTEGIDAS" |
| `Logo/Logo_*.comp` (×3) | #685, #686, #687 Logo Titles | Animaciones del logo PITB (fondo claro y oscuro) |
| `Transiciones/*.drp` (×3) | #742 Circle split, #744 Spiral, #746 Swipe | Transiciones entre bloques de integrantes (sin cambios) |
| `PantallaDividida/*.drp` (×2) | #745 Split, #747 Vertical Split | Pantalla dividida: por ejemplo María a la izquierda y el App Promo a la derecha (sin cambios) |

## Antes de abrir DaVinci: tipografías
Instala **Fraunces** y **Manrope** desde Google Fonts (fonts.google.com › Fraunces / Manrope › *Get font* › *Download all*). Descomprime, selecciona los `.ttf`, clic derecho › **Instalar para todos los usuarios** y reinicia DaVinci. Sin ellas, DaVinci pone otra fuente.

## Usar una plantilla `.comp` (gratuita y Studio)
1. Página **Edit** › *Effects* › *Toolbox* › *Effects* › arrastra **Fusion Composition** a la pista **V3**, encima del plano.
2. Con el clip seleccionado, ve a la página **Fusion** › menú *File* › **Import Fusion Composition…** › elige el `.comp`.
3. Vuelve a Edit: el tercio o la llamada aparece encima del video, con fondo transparente. Dura 5 s; recórtalo o estíralo.
4. Para cambiar un texto: en Fusion selecciona el nodo de texto (MainHeading, Heading, EditText…) › *Inspector* › *Text*.
5. Para mover una llamada a otra parte de la pantalla: en Fusion selecciona el nodo **Controller** o **MoveSize** (según la plantilla) › *Center*.
6. **Logo:** si sale vacío, selecciona el nodo **REPLACE** (Loader) y en *Filename* busca `Logo-horizontal.png` (fondo claro) o `Logo-horizontal-dark.png` (fondo oscuro).

## Usar una plantilla `.drp` (transiciones y pantalla dividida)
1. *Project Manager* › clic derecho › **Import Project…** › elige el `.drp` y ábrelo.
2. En su línea de tiempo, copia el clip de transición o Fusion (`Ctrl+C`).
3. Vuelve al proyecto `PITB_Antioquia` y pégalo (`Ctrl+V`) entre los dos planos.
4. Para la pantalla dividida, cambia los medios de ejemplo por tus clips desde el nodo de entrada (MediaIn) en Fusion.

## Dónde usarlas en el video de 3 min (sugerencias)
- **Nombres:** `LT_linea_<persona>` en vez de los PNG de `graficos/tercios`. Tienen animación de entrada y salida.
- **Juan, P1:** `BioCLIP_identifica` señalando la tarjeta de BioCLIP.
- **Juan, P3:** `Revision_humana` y `Oso_de_anteojos_VU` cuando dice "las coordenadas de especies amenazadas se ocultan".
- **Entre bloques de integrantes:** `Swipe` o `Circle split`.
- **María:** `PantallaDividida` vertical con María a cámara a un lado y el App Promo al otro.
- **Cierre:** `Marca_PITB_Foto_Especie_Dato` o un `Logo_*`.

## Créditos
Plantillas: Mixkit (mixkit.co), licencia gratuita para video templates. No hace falta atribución, pero se puede poner "Plantillas: Mixkit" en los créditos de YouTube. Adaptación a PITB: `skills/tema-personalizado/grupo34-pitb-antioquia/mixkit_pitb.py`.
