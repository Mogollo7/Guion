# Guía de dirección — Video de unorootpi (máx. 3:00)

> Fase 1: investigación + guía de producción. La fase pesada (render, montaje, Opus) arranca cuando se aprueben las decisiones de la sección 9.

## v2 — Cambios tras recibir el trabajo escrito y el prototipo (5 nov)

**Lo que se resolvió**
- **Reto asignado: Territorio Sostenible.** Proyecto: **PITB Antioquia** (Plataforma de Inteligencia Territorial y Biodiversidad). Equipo: Salomé Mariaca Sánchez, Daniela Estefanía Posada Hernández, Juan Sebastián Martínez Galeano, Maria Estefany Serna Guerra.
- **Prototipo real ya existe** ([`Mogollo7/PITB-Antioquia`](https://github.com/Mogollo7/PITB-Antioquia), sitio estático con Leaflet; vistas `#inicio`, `#identificacion`, `#observacion/<id>`, `#tablero`, `#registros`). **Se descarta hacer mockups en Figma/Canva (§4): se graba el prototipo real.** Lo clonamos y verificamos que corre a 1920×1080; el 5 nov quedaron capturas de prueba de *Registros de Campo*.
- **Velocidad de voz:** el guion es solo lo que se dice y pueden hablar más rápido. A ~3,0 pal/s los 391 palabras duran ~2:10 → **no se recorta nada**; el video queda en **~2:45–2:55** con los gráficos. (La tabla de §2 con 2,6 pal/s queda como el peor caso.)
- **Quién edita:** una sola persona hace el montaje; los cuatro solo graban su clip. (Confirmar, ver pendientes.)
- **DaVinci Resolve gratuito.** Implicaciones: (1) **el MCP de Resolve necesita Studio** para scripting externo; en gratuita solo el *bridge* interno, frágil → el plan base es **montaje manual guiado**: yo genero timeline importable (FCPXML/EDL), SRT de subtítulos, lista de marcadores y receta paso a paso; el MCP es opcional si el bridge funciona. (2) El **isologo se diseña en la pestaña Fusion** (incluida en la gratuita). (3) Exportar H.264 a 1080p30 en Windows/macOS; en Linux la gratuita no exporta H.264/AAC → exportar DNxHR y convertir con FFmpeg. (4) Para las capas con transparencia de Remotion, usar **secuencia PNG** (lo más seguro en la gratuita) o ProRes 4444 en Windows/macOS.

**Isologo (Fusion, buenas prácticas)** — partir de la identidad que ya tiene el sitio, no inventar otra:
- Símbolo: hoja del sitio (`#i-leaf`) + elemento de "dato" (punto/pin de localización en la nervadura). Tipografía **Fraunces 700** ("PITB") + **Manrope** para "Antioquia" en `--leaf-500`.
- Paleta real del sitio: `--forest-900 #073821`, `--forest-800 #0d4a2c`, `--green-700 #2a6f49`, `--leaf-500 #6cae4c`, `--olive-400 #a5bc5b`, `--cream-100 #fffff6`, acento mapa `--map-accent #e8703a`, tinta `#122318`. **Esta paleta reemplaza la propuesta de §5.**
- Buenas prácticas: legible a 16 px, versión 1 tinta y versión negativa sobre `forest-900`, zona de respeto = altura de la "P", contraste AA, exportar PNG 4× con alfa + SVG, animación de entrada de ≤1,5 s (trazo de la hoja → relleno → nombre).

**ArtCraft** ([`storytold/artcraft`](https://github.com/storytold/artcraft); la web oficial `getartcraft.com` está bloqueada en mi red, la información viene de fuentes de terceros): app de escritorio open source (Windows/macOS) y estudio web (`app.getartcraft.com`) para imagen/video con IA, con composición 2D/3D, imagen→video, imagen→malla 3D, posado de personajes y cámara. Uso propuesto, **limitado y rotulado**:
1. Planos de ambientación **sin especies reales identificables** (montaña antioqueña al amanecer, manos con celular, cámara trampa en el bosque) para S1/S2/D1.
2. Transiciones/fondos abstractos (red de puntos sobre relieve) para D2/D3.
3. **No** usarlo para mostrar fauna/flora como si fuera evidencia: el proyecto trata de datos reales. Las especies salen de las fotos iNaturalist ya incluidas en el prototipo, con su crédito.
4. Todo plano generado lleva el rótulo "Imagen ilustrativa generada con IA" en pantalla o créditos. Revisar costos/créditos y licencias de los modelos antes de generar (no pude verificarlos).

**Inconsistencias a corregir (importantes para el jurado)**
| # | Hallazgo | Acción |
|---|---|---|
| 1 | El guion dice **"más de 21.000 especies"**; el texto escrito dice **"21.600"** | Unificar en **21.600** (en voz de Salomé P2 y en pantalla) o citar la fuente de ambos |
| 2 | Cifras de ranas (56 especies, 62,9 %, 86,1 %, +24,9) **no están en el texto escrito** | Agregar una sección breve de metodología/resultados preliminares con fuente y fecha, o el jurado no podrá rastrearlas |
| 3 | El texto dice que BioCLIP "**no incorpora coordenadas GPS**"; el guion dice que la ubicación "**reordena las candidatas** (+24,9)" | Aclarar en voz/pantalla y en Q&A: el modelo no usa GPS; el **reordenamiento por ubicación lo hace la plataforma** después |
| 4 | El prototipo muestra **142 polígonos en conflicto, 72,4/100, 28 licencias, 99,2 %** | Son datos simulados: rotular **"Datos ilustrativos del prototipo"** en todas las tomas del tablero y las fichas |
| 5 | Fotos con **CC BY-NC / CC BY-SA** (jaguar, guacamaya, perezoso…) | Mostrar crédito (ya aparece en la ficha) y listar autores en los créditos finales (`assets/species/_meta.json` los trae) |
| 6 | La ficha del jaguar muestra categoría UICN "**EN**" | Verificar la categoría real (global y Colombia) antes de mostrarla |
| 7 | Nombre: el texto/sitio dicen **PITB Antioquia**; yo había usado "unorootpi" | Usar **PITB Antioquia** en título y créditos salvo que "unorootpi" sea un nombre oficial |
| 8 | "+17-20 % frente a otros modelos" (texto) | Citar solo si el paper lo respalda con esa cifra exacta; si no, quitarlo del texto escrito |

**Plan de captura del prototipo (reemplaza §4)**
- Playwright graba el sitio real a 1920×1080 (video webm + PNG) con guion de clics: subir foto → analizar → ficha del jaguar (top-3) → *Registros de Campo* (pasar un registro de *Pendiente* a *Validado*) → filtros por grupo.
- El **mapa** del *Tablero* depende de Leaflet (CDN) y mosaicos OSM, que mi red bloquea: esa toma se graba **en el computador del equipo** (o se usa `assets/screenshots/tablero.jpg` como respaldo) y se anima encima con Remotion.
- Los planos M1–M4 de §3 se mapean así: M1 `#identificacion`, M2 `#observacion/panthera-onca`, M3 `#tablero`, M4 `#registros`.

**Pendientes reales (solo 4)**
1. ¿Confirmas que una sola persona edita y los 4 solo graban?
2. ¿Windows, macOS o Linux (Resolve y ArtCraft cambian)?
3. ¿"unorootpi" es nombre oficial o usamos PITB Antioquia?
4. ¿Aprobado grabar el prototipo real en vez de mockups?

> Las secciones 0–11 de abajo siguen vigentes salvo lo que v2 reemplaza (§4 capturas, §5 paleta, §6.2 MCP, tabla de decisiones §9).

## 0. Contexto y plazos (¡urgente!)

| Dato | Valor |
|---|---|
| Cierre de entrega | **sábado 7 nov 2026, 08:00** (en la plataforma) |
| Reflexión final (ética/social) | **Sincrónica, 7 nov 8:00 a. m.** — no va en el video |
| Hoy | jueves 5 nov → quedan ~2 días |
| Video | ≤ 3:00, **todos los integrantes aparecen** y explican cómo funciona la plataforma/prototipo |
| Subida | NO se sube el video a la plataforma: va como **enlace** (YouTube sin restricción de privacidad, WeTransfer o Drive) dentro del texto escrito |
| Texto escrito | PDF con nombres de integrantes, sustento teórico con citas APA (2.ª entrega + correcciones) y el enlace al video |
| Prototipo | No tiene que ser 100 % funcional; puede representarse con imágenes creadas por ustedes |
| Tema asignado | Territorio de Paz / Multicultural / Educada → **falta confirmar cuál les tocó** (ver §9) |

## 1. Hallazgos de la búsqueda

### 1.1 Repo `Mogollo7/Guion` — está vacío
`git log` sin commits y la API de GitHub responde `409 Git Repository is empty` (sin ramas). **No hay "suite" que usar todavía.** Este archivo es el primer commit. Si la suite está en otro repo/rama/computador, hay que subirla o pasarme el enlace.

### 1.2 `latent-spaces/brag` (≈20 k ⭐, MIT)
- Skill de agente que convierte un proyecto en un **video de lanzamiento de ~20 s** (música + motion + copy). Usa **Hyperframes** (HeyGen) para construir/renderizar.
- Instalación en Claude Code: `/plugin marketplace add latent-spaces/brag` → `/plugin install brag@brag`.
- Requiere Node ≥ 22 (✅ presente: v22.23), **FFmpeg** (✅ presente) y `npx hyperframes doctor`.
- Flags: `--tone "…"`, `--voice` (narración Kokoro), `--full`. En Opus 5.5 usa por defecto `/brag-slim` (un solo archivo, sin Hyperframes).
- Salida: `brag-output/` con plan, brief, copy y `brag.mp4`.
- Música incluida: *Happy Beats / Business Moves* (ende.app, **CC BY 4.0 → exige atribución**); efectos: Kenney.
- **Veredicto:** está pensado para teasers de 20 s con tono "startup", no para un video explicativo de 3 min con 4 voces. Lo usaremos para (a) **apertura/cierre de ~5–8 s** (título unorootpi) y (b) **teaser de redes** opcional. Cuidado con el tono "fake Series A": usar `--tone` sobrio/científico.

### 1.3 DaVinci Resolve + MCP (líder del montaje)
- Mejor candidato: [`samuelgursky/davinci-resolve-mcp`](https://github.com/samuelgursky/davinci-resolve-mcp) (alternativa: `tooflex/davinci-resolve-mcp`).
- Instalar: `npx davinci-resolve-mcp setup` (o `python install.py`); Python 3.10–3.12 recomendado.
- Servidor compuesto de 37 herramientas (media pool, timeline, marcadores, color, Fusion, Fairlight, render) o granular de 390 (`--full`).
- ⚠️ **Resolve Studio** (de pago) permite scripting externo (*Preferences → General → External scripting using → Local*). En la **versión gratuita** solo funciona el *bridge* interno (Workspace → Scripts) y es inestable (en 21.1 Python pasó a Studio). **Confirmar qué licencia tienen.**
- Limitación: arma ensamblajes de primera pasada; no elige la mejor toma. No toca los archivos fuente.
- **Este entorno cloud no tiene Resolve** (ni GUI). El MCP debe correr en el computador del equipo; yo preparo todo el material, EDL/timeline y scripts para que Resolve lo ensamble.

### 1.4 Motion graphics: Remotion vs anime.js
- **Remotion** = renderizador (React → MP4). **anime.js** = solo librería de animación, no exporta video; en Remotion se usa creando el timeline **pausado** y manejándolo con `useCurrentFrame()` (ojo: anime.js v4 usa ms, Remotion frames).
- **Decisión:** **Remotion como motor de motion graphics**, usando `interpolate`/`spring` nativos; anime.js solo si hace falta algo muy específico (morph SVG, stagger de rutas del mapa).
- Hyperframes (el motor de brag) es alternativa a Remotion; no pude leer su comparativa (host bloqueado en la red de esta sesión).
- ⚠️ Licencia de Remotion: revisar si un grupo de 4 estudiantes califica como uso gratuito antes de publicar.

### 1.5 Herramientas ya disponibles en esta sesión
Canva (generar imágenes/video, exportar), Figma (mockups de pantallas del prototipo, `export_video`), Notion (tablero de producción), FFmpeg y Node 22 locales, Playwright/Chromium (capturas del prototipo). Se pueden usar para las **pantallas del prototipo** (§4) sin programar la plataforma.

## 2. Presupuesto de tiempo (guion del PDF)

Conteo de palabras del guion actual: **391 palabras** → a 2,6 pal/s ≈ **2:30 de voz pura** (Salomé 28 s · Daniela 32 s · Juan 47 s · María Estefany 44 s). Con pausas y transiciones se roza el límite de 3:00.

| Bloque | Tiempo | Duración |
|---|---|---|
| Título animado unorootpi (brag/Remotion) | 0:00–0:04 | 4 s |
| Salomé — el problema | 0:04–0:33 | 29 s |
| Daniela — la propuesta | 0:33–1:05 | 32 s |
| Juan Sebastián — BioCLIP y límites | 1:05–1:51 | 46 s |
| María Estefany — recorrido | 1:51–2:37 | 46 s |
| Cierre + créditos (logo, Agenda Antioquia 2040, atribución música) | 2:37–2:50 | 13 s |
| **Total** | | **2:50** (10 s de margen) |

**Si al grabar se pasa de 2:55:** recortar en este orden — (1) Juan P2: quitar "una prueba exigente"; (2) María P1: "puede ver observaciones filtradas por grupo taxonómico"; (3) Salomé P2: quitar "pero cuyo inventario depende de muestreos manuales" → "cuyo inventario tarda años en actualizarse".

## 3. Plano a plano (17 planos)

Convenciones: **LIVE** = integrante a cámara · **MG** = motion graphic (Remotion) · **UI** = pantalla del prototipo · **Cám** = encuadre.

### SALOMÉ (0:04–0:33) — tono: pregunta directa, seria
| # | Texto | Imagen | Motion / texto en pantalla | s |
|---|---|---|---|---|
| S1 | ¿Cómo puede Antioquia planificar… 125 municipios…? | LIVE, plano medio, mirando a cámara | Mapa de Antioquia line-art detrás, **125 puntos** que se encienden en stagger; contador "125" | ~9 |
| S2 | …más de 21.000 especies registradas… muestreos manuales | LIVE → corte a B-roll (libreta de campo, mano anotando) | Contador 0→21.000 (spring); icono libreta + reloj "años" | ~10 |
| S3 | …una especie ya desapareció… siempre actuará tarde | LIVE, cierre | Línea de tiempo: punto "especie" se apaga antes de que llegue el marcador "inventario"; texto *"Sin línea base, se llega tarde"* | ~10 |

### DANIELA (0:33–1:05) — tono: claro, propositivo
| # | Texto | Imagen | Motion | s |
|---|---|---|---|---|
| D1 | Plataforma web con IA de visión… BioCLIP… catálogo vivo | LIVE + logo unorootpi | Logo se construye (trazo→relleno); chips "Fauna · Flora · Catálogo vivo" | ~11 |
| D2 | Sube una foto → identifica → ubica → publica | LIVE a la izquierda, **flujo de 4 íconos** a la derecha | Pipeline animado: 📷 → 🧠 BioCLIP → 📍 territorio → 🗺 mapa colectivo (ruta SVG se dibuja) | ~11 |
| D3 | Señales ecológicas: disminución, migración, apariciones | LIVE, cierre | Tres mini-gráficas (línea baja, flecha migratoria, punto nuevo con destello) | ~10 |

### JUAN SEBASTIÁN (1:05–1:51) — tono: técnico pero honesto
| # | Texto | Imagen | Motion | s |
|---|---|---|---|---|
| J1 | BioCLIP, Imageomics Institute (Ohio State), Best Student Paper CVPR 2024, 10 M imágenes, 450 k taxones | LIVE + tarjeta | Tarjeta "BioCLIP · CVPR 2024 · Best Student Paper" ; contadores **10 M** y **450 k** ; árbol taxonómico que se ramifica | ~16 |
| J2 | 56 ranas de Colombia: 62,9 % top-1, 86,1 % top-3, +24,9 pts con ubicación | LIVE → pantalla de datos | **Gráfica de barras animada**: 62,9 → 86,1; flecha "+24,9 pts" con ubicación. Eje y rótulo "56 especies de ranas (preliminar)". Ver nota de datos abajo | ~16 |
| J3 | Preliminar y solo ranas → IA propone, persona revisa; "no concluyente"; coordenadas de amenazadas se ocultan | LIVE serio | Sello "PRELIMINAR"; 3 escudos: 👤 revisión humana · "No concluyente" · 📍 coordenada generalizada (punto → hexágono grande) | ~14 |

> **Nota de datos:** el +24,9 puntos no se aclara si es sobre top-1 o top-3. Antes de grabar, **Juan debe confirmar a qué métrica se refiere** y rotular exactamente eso en pantalla (un jurado lo preguntará).

### MARIA ESTEFANY (1:51–2:37) — tono: guía de recorrido (screen-recording)
| # | Texto | Imagen | Motion | s |
|---|---|---|---|---|
| M1 | Arrastra/selecciona foto; comunidad filtrada por mamíferos, aves, anfibios, reptiles, flora | UI: pantalla de subida + galería | Drag&drop animado de una foto; chips de filtro con ícono por grupo | ~10 |
| M2 | Ficha: foto con autoría, taxonomía, 3 sugerencias con %, acciones | UI: ficha de observación | Zoom a la ficha; las 3 barras de % crecen; botones "Geolocalizar", "Publicar" con pulso | ~11 |
| M3 | Tablero Territorial: mapa + POT/EOT, filtros subregión/grupo | UI: mapa | Puntos aparecen sobre mapa; capa POT/EOT con polígonos que se superponen; filtros activan/desactivan | ~10 |
| M4 | Registros de Campo: investigadores y CAR validan y auditan | UI: tabla de registros | Fila pasa de "pendiente" → "validada ✔" ; insignia CAR | ~8 |
| M5 | Así, cada foto se convierte en un dato. | LIVE de **los 4 juntos** (cierre grupal) o foto→dato | Foto 📷 se transforma en ficha de datos {especie, lat, lon, fecha}; **corte a logo** | ~7 |

**Regla de los 4 en cámara:** todos aparecen en su bloque. Plus M5 reúne a los cuatro en un plano (cumple "se pueda ver a cada uno").

## 4. Cómo "mostrar" el prototipo sin programarlo
El enunciado permite imágenes creadas por ustedes. Recomendado:
1. **Figma** → 4 pantallas (Subir, Ficha, Tablero Territorial, Registros de Campo) con datos plausibles. O Canva si no hay tiempo.
2. Exportar PNG @2× → Remotion los anima (zoom, cursor, clics) → clip MP4 por pantalla.
3. Las **fotos de especies** deben tener autoría real/licencia (iNaturalist CC, GBIF) o ser generadas y rotuladas. La ficha M2 dice "foto con su autoría": **usar créditos reales** en la animación.
4. Dejar claro en pantalla (pie pequeño) "Prototipo ilustrativo".

## 5. Dirección audiovisual
- **Formato:** 1920×1080, 30 fps, MP4 H.264. Subtítulos incrustados en español (accesibilidad y sonido malo).
- **Paleta (propuesta, ajustar al logo):** verde selva `#1F5F3A`, verde claro `#7BC47F`, ámbar `#F2A93B`, azul río `#2C6E91`, fondo `#F5F3EC`, texto `#1B1B1B`. Tipografía: Inter / Poppins (alinear con las usadas en el documento).
- **Cámara en LIVE:** misma luz y fondo para los 4 (ventana lateral, fondo liso o verde). Horizontal 16:9, plano medio, regla de tercios, mirada al lente, micrófono lavalier/celular a 20 cm. **Audio > imagen**: grabar en cuarto sin eco.
- **Música:** instrumental baja (–22 LUFS bajo la voz), solo del 0:00–0:04 y 2:37–2:50 + cama sutil. Si se usa la de brag → atribución CC BY 4.0 en créditos.
- **Transiciones entre voces:** wipe vegetal/hoja o desplazamiento horizontal de 8 frames, siempre igual.

## 6. Pipeline técnico

```
guion (PDF) ─► grabación LIVE (4 clips) ──────────────┐
Figma/Canva ─► pantallas PNG ─► Remotion (MG) ─► MP4 ─┤─► DaVinci Resolve (MCP) ─► render ─► YouTube/Drive
brag-slim ──► intro/cierre 5–8 s ─────────────────────┘          ▲ subtítulos / audio / color
```

### 6.1 Remotion (`/video`)
```
video/
  src/Root.tsx            # <Composition> por bloque
  src/comps/Intro.tsx  S1.tsx … S3.tsx  D1.tsx … M5.tsx  Outro.tsx
  src/data/ranas.json     # 62.9, 86.1, 24.9 (fuente única de cifras)
  public/ui/*.png         # pantallas del prototipo
  public/live/*.mp4       # clips grabados
```
- Cifras en JSON único para que el video, el texto escrito y la sustentación coincidan.
- Fondos transparentes: `npx remotion render … --codec=prores --prores-profile=4444` → importar a Resolve y superponer sobre LIVE (capas alfa).
- anime.js solo para: trazo del mapa de Antioquia, stagger de los 125 puntos (timeline pausado + `useCurrentFrame`).

### 6.2 DaVinci Resolve vía MCP (líder del montaje)
Orden de operaciones que le pediré a Resolve MCP:
1. Crear proyecto `unorootpi_1080p30`, importar bins: `LIVE`, `MG`, `UI`, `AUDIO`.
2. Timeline en este orden: Intro → S → D → J → M → Outro, con **marcadores por plano** (S1…M5) y colores por integrante.
3. Superponer MG (V2) sobre LIVE (V1) según §3; ajustar duración a la voz.
4. Audio (Fairlight): normalizar voces a –16 LUFS, de-noise, música a –22 LUFS con ducking.
5. Subtítulos desde el guion (Whisper opcional, o importar SRT).
6. Color: un LUT/ajuste común a los 4 clips LIVE.
7. Render: H.264 1080p30 → subir a YouTube como **Público** (el enunciado pide "sin restricción de privacidad"; "No listado" también abre con enlace, pero Público es lo más seguro). Nunca "Privado".

### 6.3 brag
Instalar solo para intro/cierre: `npx skills add https://github.com/latent-spaces/brag --skill brag-slim`, tono sobrio (`--tone "científico, esperanzador"`), sin `--voice`. Sacar 5 s de título + 8 s de cierre; **no** usar su video completo.

## 7. Plan de producción hasta el 7 nov 08:00

| Cuándo | Qué | Quién |
|---|---|---|
| **Jue 5 (hoy)** | Aprobar esta guía y decisiones §9; confirmar tema; Juan confirma métrica 24,9; Figma/Canva con 4 pantallas | Equipo + yo |
| **Jue 5 noche** | Grabar los 4 clips LIVE (2–3 tomas c/u, leyendo del teleprompter del §8) | Cada integrante |
| **Vie 6 mañana** | Remotion: 17 MG + intro/cierre; entrega de MP4/ProRes | Yo (fase pesada) |
| **Vie 6 tarde** | Montaje en Resolve + audio + subtítulos; revisión | Equipo + Resolve MCP |
| **Vie 6 noche** | Render final, subir a YouTube, **verificar enlace en ventana de incógnito**; completar PDF con enlace y APA | Equipo |
| **Sáb 7, 06:00** | Subir PDF a la plataforma (cierre 08:00) y ensayar reflexión | Equipo |
| **Sáb 7, 08:00** | Reflexión final sincrónica + preguntas del jurado | Equipo |

## 8. Teleprompter (texto exacto del PDF)
Texto oficial = el del PDF (`Guion_de_video.pdf`). Marcar por plano en la grabación (hacer una pausa de 1 s entre planos para cortar limpio). Ritmo objetivo: 2,6 palabras/s. Cada persona graba además un **plano de respaldo de 5 s en silencio** mirando a cámara (para cubrir cortes).

## 9. Decisiones pendientes (necesito respuesta para iniciar la fase pesada)
1. ¿Qué reto les asignaron: Territorio de Paz, Multicultural o Educada? (cambia el cierre y la reflexión ética: p. ej. Educada → ciencia ciudadana en colegios; Paz → datos territoriales para conflictos socioambientales).
2. ¿Tienen **DaVinci Resolve Studio** o la gratuita? ¿En qué SO?
3. ¿Hay logo y nombre oficial ("unorootpi" tal cual)? ¿Hay ya pantallas diseñadas?
4. ¿La suite de `Mogollo7/Guion` está en otro lado? El repo está vacío.
5. ¿Aprueban recortar ~10 s del guion o preferimos hablar más rápido?
6. ¿Licencia Remotion OK o usamos Hyperframes?

## 10. Banco de preguntas del jurado (preparar respuestas)
- ¿Por qué BioCLIP y no iNaturalist/Seek? ¿Qué aporta unorootpi frente a ellos? (territorio + POT/EOT + validación CAR)
- ¿Qué pasa con especies que BioCLIP no conoce? → "no concluyente" + revisión humana.
- ¿Cómo evitan que la ubicación de especies amenazadas facilite el tráfico? → ocultar/generalizar coordenadas.
- ¿86,1 % es suficiente? ¿Cómo se valida en otros grupos? → preliminar, solo ranas; plan de validación por grupo.
- ¿Quién es dueño de los datos y las fotos? ¿Consentimiento, autoría, licencias?
- ¿Cómo se conecta con Agenda Antioquia 2040 y con el ordenamiento territorial de los 125 municipios?
- ¿Sesgo geográfico/de datos (más fotos en zonas urbanas)? ¿Brecha digital rural?

## 11. Texto escrito (checklist)
- [ ] Nombres de los integrantes · [ ] enlace al video (probado) · [ ] sustento teórico con APA 7 · [ ] correcciones de la 2.ª entrega.
- Cita base sugerida (verificar páginas): Stevens, S., Wu, J., Thompson, M. J., Campolongo, E. G., Song, C. H., Carlyn, D. E., Dong, L., Dahdul, W. M., Stewart, C., Berger-Wolf, T., Chao, W.-L., & Su, Y. (2024). BioCLIP: A vision foundation model for the tree of life. *Proceedings of the IEEE/CVF CVPR 2024*.
- Citar también Agenda Antioquia 2040, fuente del dato de 21.000 especies y de las zonificaciones POT/EOT, y las fuentes del registro de las 56 ranas.

## Fuentes
- [latent-spaces/brag](https://github.com/latent-spaces/brag)
- [samuelgursky/davinci-resolve-mcp](https://github.com/samuelgursky/davinci-resolve-mcp) · [tooflex/davinci-resolve-mcp](https://github.com/tooflex/davinci-resolve-mcp)
- [Remotion Lab — anime.js v4](https://remotionlab.pages.dev/tutorials/animejs-v4-integration) · [Hyperframes vs Remotion](https://hyperframes.heygen.com/guides/hyperframes-vs-remotion)
