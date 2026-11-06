---
name: grupo34-pitb-antioquia
description: >-
  Tema personalizado del GRUPO 34 (reto Territorio Sostenible, Agenda Antioquia 2040) para su proyecto PITB
  Antioquia — Plataforma de Inteligencia Territorial y Biodiversidad. Contiene la identidad (colores,
  tipografías, isologo), el equipo, el guion final, la mascota Tremi, el prototipo, las cifras verificadas o
  ilustrativas, las reglas de honestidad y dónde está cada recurso en el repositorio Guion. Úsalo junto con las
  skills de construcción (suite-codigo o suite-artcraft) cada vez que se trabaje en el video, el promo, la
  presentación o cualquier pieza de PITB Antioquia, o se mencione a Tremi, BioCLIP en Antioquia, el grupo 34,
  Salomé, Daniela, Juan Sebastián o Maria Estefany. ESTE TEMA ES SOLO DEL GRUPO 34: otro grupo NO debe usarlo y
  debe crear su propio tema a partir de `plantilla-tema-grupo`.
---

# Tema personalizado · Grupo 34 · PITB Antioquia

> **Solo para el grupo 34.** Las skills de las suites (`suite-codigo`, `suite-artcraft`) son genéricas. Este archivo
> es lo único específico del proyecto. Otro grupo debe copiar `../plantilla-tema-grupo/`, llenarla con sus
> componentes (nombre, marca, equipo, guion, prototipo, mascota) y usar esa en lugar de esta.

## Proyecto
- **Nombre en pantalla:** PITB Antioquia. Nombre largo: Plataforma de Inteligencia Territorial y Biodiversidad.
- **Reto:** Territorio Sostenible · Agenda Antioquia 2040. Estrategia: Ordenamiento Territorial.
- **Idea en una frase:** el usuario sube una foto, BioCLIP sugiere la especie, se ubica en el territorio y se publica
  en el mapa colectivo; investigadores y CAR validan. "Así, cada foto se convierte en un dato."
- **Prototipo:** https://mogollo7.github.io/PITB-Antioquia/ (repo `Mogollo7/PITB-Antioquia`, MIT). Vistas:
  `#inicio`, `#identificacion`, `#observacion/<id>`, `#tablero`, `#registros`.
- **Entregas:** video de máximo 3:00 en el que aparecen los 4 integrantes, publicado por enlace (YouTube público o
  no listado). Texto escrito en PDF con APA y el enlace. Reflexión ética sincrónica el 7 de noviembre de 2026,
  8:00 a. m.

## Equipo (orden del video)
| # | Integrante | Bloque | Rol en pantalla |
|---|---|---|---|
| 01 | Salomé Mariaca Sánchez | S1–S3 | El problema |
| 02 | Daniela Estefanía Posada Hernández | D1–D3 | La propuesta |
| 03 | Juan Sebastián Martínez Galeano | J1–J3 | La tecnología · BioCLIP |
| 04 | Maria Estefany Serna Guerra | M1–M5 | El prototipo |

Guion final (fuente única): `video/src/data/guion.json`. Teleprompter: `entregables/01_GUION_TELEPROMPTER.md`.

## Identidad
- **Colores** (del CSS del prototipo):
  - verde bosque `#073821` / `#0d4a2c`
  - verde `#2a6f49`
  - verde hoja `#6cae4c`
  - oliva `#a5bc5b`
  - crema `#fffff6`
  - tinta `#122318`
  - acento de mapa `#e8703a` (solo en mapas)
- **Tipografías:** Fraunces (títulos) y Manrope (texto).
- **Isologo:** una hoja cuya nervadura es una línea de datos con tres nodos. Archivos y reglas de uso en
  `entregables/logo/`.
- **Mascota Tremi:** oso de anteojos (*Tremarctos ornatus*, especie vulnerable, VU) con pañoleta verde. Es un
  diseño original del grupo.
  - Código: `video/src/promo/Mascot.tsx`.
  - Hoja de poses: `entregables/promo/Tremi_hoja_de_personaje.png`.
  - Clips con transparencia: `entregables/promo/kit_tremi_alpha/`.
  - Tremi reacciona al producto; no lo protagoniza.
- **Música:** "Happy Beats / Business Moves Vol. 1", Sascha Ende (CC BY 4.0), a 120 BPM. 1 beat = 15 cuadros a
  30 fps.

## Cifras y cómo decirlas
| Dato | Uso |
|---|---|
| 125 municipios; más de 21.600 especies | verificadas en el texto escrito |
| BioCLIP: Imageomics Institute (Ohio State), Mejor Artículo Estudiantil CVPR 2024, 10 M+ imágenes, 450 K+ taxones | citar a Stevens et al. (2024) |
| 56 ranas: 62,9 % top-1, 86,1 % top-3, +24,9 pts al reordenar por ubicación | **preliminar y solo ranas**. El reordenamiento lo hace **la plataforma** (BioCLIP no usa GPS). Falta documentar el método en el PDF |
| Cifras del tablero (142 polígonos, 72,4/100, 28 licencias), certezas de las fichas, observadores, zonificación POT/EOT | **datos ilustrativos**: rotularlos así en pantalla |

## Reglas de honestidad (para cualquier pieza)
- Fotos de especies: solo reales, de iNaturalist, con crédito (lista en `entregables/05_CREDITOS_Y_LICENCIAS.md`).
  Nunca fauna generada con IA presentada como real.
- Lo generado con IA lleva el rótulo "Imagen generada con IA".
- Las especies amenazadas aparecen con la ubicación generalizada, no con coordenadas exactas.
- La categoría UICN del jaguar en el prototipo ("EN") está por verificar: preferir el oso de anteojos (VU) en las
  piezas.

## Dónde está cada cosa (repo Guion)
| Recurso | Ruta |
|---|---|
| Guías de grabación y montaje (DaVinci gratis, Windows) | `entregables/01…08_*.md` |
| Láminas animadas (estilo sobrio) | `entregables/laminas/` |
| App Promo, láminas del promo y Tremi | `entregables/promo/` |
| Animatic de referencia | `entregables/animatic/` |
| Subtítulos y mapa de montaje | `entregables/subtitulos/`, `entregables/montaje/` |
| Proyecto Remotion (código de todo) | `video/` |
| Capturas del prototipo | `video/public/proto/` (escritorio), `video/public/mobile/` (móvil) |
| Plantillas Mixkit adaptadas a PITB | `mixkit_pitb.py` (en esta carpeta) + `entregables/08_MIXKIT_PITB.md` |
| Presentación de Canva | diseño `DAHaFKsNcS4` (12 diapositivas) |

## Cómo usar este tema con cada suite
- **Suite de código:** para cambiar textos o cifras, edita `video/src/data/guion.json` y luego:
  - `python video/scripts/build-timeline.py`;
  - `node video/scripts/render-all.mjs`;
  - `node video/scripts/render-promo.mjs`.
- **Suite ArtCraft:**
  - VectorCraft parte de `entregables/logo/*.svg` y de las poses de Tremi.
  - PhotoCraft hace los mockups desde `video/public/mobile/*.png`.
  - EffectCraft rehace las escenas del promo siguiendo `entregables/promo/README.md`.
  - FilmCraft arma el corte con `entregables/montaje/mapa_de_montaje.md` y los SRT.
- **Tomas con IA (ai-cinema-shots):** solo ambiente: bosque andino, manos con celular, cámara trampa. Nunca especies.
