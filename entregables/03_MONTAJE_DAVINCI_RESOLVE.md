# Montaje en DaVinci Resolve (versión gratuita · Windows)

Tiempo estimado: 2–3 horas. Las láminas animadas ya están hechas; aquí solo se arma, se mezcla el audio y se exporta.

## 0. Antes de abrir Resolve
1. Descarga la carpeta `entregables/` completa (GitHub → **Code › Download ZIP**, o `git clone`).
2. **Convierte los videos de celular** a frecuencia constante. Los celulares graban con frecuencia variable y en Resolve el audio se desfasa. iPhone además graba en HEVC, que la versión gratuita en Windows puede no leer.
   - Con **HandBrake** (gratis): preset *Fast 1080p30*, en *Video* marca **Constant Framerate** y 30. O con FFmpeg:
   ```
   ffmpeg -i entrada.mov -r 30 -fps_mode cfr -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 48000 -b:a 192k salida.mp4
   ```
   - Si te pesa hacerlo, súbeme los clips y te los devuelvo convertidos y con los subtítulos ya sincronizados.

## 1. Proyecto
1. *Project Manager › New Project*: `PITB_Antioquia`.
2. Engranaje abajo a la derecha (*Project Settings*) › *Master Settings*:
   - Timeline resolution **1920 × 1080 HD**, Timeline frame rate **30**, Playback frame rate **30**. **Hazlo antes de importar** (después no se puede cambiar el frame rate).
3. *DaVinci Resolve › Preferences › User › Editing*: **Standard still duration = 4 s** (para los PNG).

## 2. Importar (página Media o Edit, `Ctrl+I`)
Crea estos bins (clic derecho › *New Bin*):
| Bin | Qué va |
|---|---|
| `01_CAMARA` | Los clips de los 4 (ya convertidos) |
| `02_LAMINAS` | `laminas/01_…16_*.mp4` |
| `03_GRAFICOS` | `graficos/tercios/*.png`, `graficos/overlay-camara/*.png`, `graficos/BadgeIlustrativo.png` |
| `04_AUDIO` | `audio/musica_SaschaEnde_HappyBeats_Vol1_CC-BY-4.0.mp3` |
| `05_REFERENCIA` | `animatic/PITB_animatic_referencia.mp4` |

## 3. Línea de tiempo (página Edit)
*File › New Timeline* `PITB_v1`. Usa estas pistas:

| Pista | Contenido |
|---|---|
| **V1** | Clips a cámara (A-roll), intro y outro |
| **V2** | Láminas animadas (B-roll) |
| **V3** | PNG: tercios inferiores, overlay de cámara |
| **A1** | Voz (audio de los clips de V1) |
| **A2** | Música |
| **A3** | Clics (vienen dentro de las láminas M1, M2, M4) |

Pasos:
1. Arrastra `01_P00-Intro.mp4` al inicio de V1 (4,5 s).
2. Coloca los clips de cámara en orden **Salomé → Daniela → Juan → María**. En cada clip, con la cuchilla (`B`) corta la mejor toma de cada plano y borra el resto con *Ripple Delete* (`Shift+Supr`). Deja ~0,2 s de aire entre planos.
3. Sigue `montaje/mapa_de_montaje.md`: para cada plano pon su lámina en **V2**, empezando cuando ya se le vio la cara a quien habla (1–3 s) y terminando al final de la frase. **Recorta la cola** de la lámina, nunca el inicio (ahí están las animaciones).
   - Como guía, pon el animatic en una pista V4 apagada (ojo de la pista) y míralo cuando dudes.
   - Para María (prototipo) se ve a cámara solo ~1 s por plano. Opcional: muéstrala en miniatura sobre las láminas M1–M4 (clip de cámara en V3 › *Inspector › Transform*: Zoom 0,28, Position X ≈ 760, Y ≈ −380).
4. Tercios inferiores: `LowerThird-salome.png` (etc.) en **V3**, en los primeros 3–4 s del **primer plano** de cada persona. Fundido de entrada y salida: arrastra los tiradores blancos de las esquinas del clip (~8 cuadros).
5. Opcional: `LiveOverlay-<persona>.png` en V3 encima de todos los planos a cámara de esa persona (etiqueta de capítulo + logo).
6. Al final: `16_P99-Outro.mp4` (equipo y créditos).
7. Mira la duración arriba a la derecha del visor: **debe ser ≤ 3:00**. Si te pasas, recorta pausas y la cola del outro (los créditos deben verse al menos 3 s).

## 4. Audio
1. Selecciona todos los clips de voz en A1 › clic derecho › **Normalize Audio Levels** › *Normalization Mode: ITU-R BS.1770-4*, *Target Loudness: −16 LUFS*, *Set Level: Independent*.
2. Música (`audio/musica_…mp3`) en A2 desde 00:00. Volumen del clip a **−22 dB** aprox. (Inspector › Volume), y súbela a −10 dB en intro y outro con keyframes. Fundido de salida al final.
3. El audio de las láminas (clics) va en A3: déjalo en −12 dB o silencia la pista si molesta.
4. Escucha todo con audífonos: la voz siempre debe entenderse por encima de la música.

## 5. Subtítulos (recomendado: muchos ven sin sonido)
- `subtitulos/<persona>.srt` empieza en 0 con el texto de esa persona. *File › Import › Subtitle*, arrástralo a la pista de subtítulos al inicio del bloque de esa persona y ajusta cada línea en el *Inspector* a lo que realmente dijo.
- `subtitulos/PITB_completo_estimado.srt` sigue los tiempos del animatic (sirve de referencia, no va a calzar exacto).
- Atajo: mándame los clips montados y te devuelvo un SRT sincronizado.

## 6. Color (mínimo)
Página *Color*: en cada clip a cámara ajusta *Lift/Gamma/Gain* para que la piel se vea natural y los 4 se parezcan entre sí. Copia el ajuste a los demás clips (clic medio sobre el nodo, o `Ctrl+C` / `Ctrl+V` del grade). Las láminas **no** se tocan.

## 7. Exportar (página Deliver)
- *Custom Export* › **Format: MP4 · Codec: H.264** · Resolution 1920 × 1080 · Frame rate 30 · Quality: *Restrict to 12000 Kb/s*.
- Audio: AAC, 320 kb/s.
- Nombre: `PITB_Antioquia_video_final`. *Add to Render Queue › Render All*.
- Revisa el MP4 final de principio a fin antes de subirlo.

## 8. Subir y compartir
- YouTube: visibilidad **Pública** (o *No listado*; **nunca Privado**). Pega en la descripción el texto de `05_CREDITOS_Y_LICENCIAS.md › Texto para YouTube`.
- Abre el enlace en una **ventana de incógnito** para comprobar que se ve sin iniciar sesión.
- Pega el enlace en el PDF del trabajo escrito.

## 9. ¿Y el MCP de DaVinci?
`samuelgursky/davinci-resolve-mcp` maneja Resolve desde Claude, pero el scripting externo **solo funciona en Resolve Studio**. En la gratuita existe un puente interno (*Workspace › Scripts*) que el autor del MCP marca como frágil, y desde la versión 21.1 el scripting en Python pasó a ser solo de Studio. Con el plazo que hay, **el montaje manual de esta guía es el camino seguro**. Si quieres probarlo igual: `npx davinci-resolve-mcp setup` y luego `python scripts/install_resolve_bridge.py`.

## 10. Isologo en Fusion (opcional)
La intro ya trae el isologo animado (`01_P00-Intro.mp4`). Si quieres rehacerlo en la pestaña **Fusion**: *Fusion › Import › SVG* con `logo/pitb-simbolo.svg` → cada trazo queda como un nodo *Polygon*. Anima el parámetro **Write On › End** de 0 a 1 en ~40 cuadros sobre la hoja y la nervadura, y aparece los nodos (círculos) con *Transform › Size* de 0 a 1, uno tras otro.
