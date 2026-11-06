# Montaje en DaVinci Resolve ({{versión}} · {{sistema}})

Tiempo estimado: {{horas}}. Las animaciones ya están hechas; aquí se arma, se mezcla y se exporta.

## 0. Antes de abrir Resolve
1. Descarga la carpeta de entregables completa.
2. Convierte los videos de celular a frecuencia constante (si no, el audio se desfasa):
   `ffmpeg -i entrada.mov -r {{fps}} -fps_mode cfr -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 48000 salida.mp4`
   (o HandBrake › Constant Framerate › {{fps}}).
3. Instala las tipografías {{fuentes}} (Google Fonts › instalar para todos los usuarios) y reinicia Resolve.

## 1. Proyecto
*Project Manager › New Project* `{{proyecto}}` › engranaje › *Master Settings*: 1920×1080, **{{fps}} fps** para la
línea de tiempo y la reproducción. **Antes de importar**: después no se puede cambiar.
*Preferences › User › Editing › Standard still duration*: 4 s.

## 2. Importar (Ctrl+I) en bins
| Bin | Qué va |
|---|---|
| 01_CAMARA | {{clips de cámara}} |
| 02_LAMINAS | {{animaciones}} |
| 03_GRAFICOS | {{png y secuencias con transparencia}} |
| 04_AUDIO | {{música y efectos}} |
| 05_REFERENCIA | {{animatic}} |

## 3. Línea de tiempo
| Pista | Contenido |
|---|---|
| V1 | cámara, intro y cierre |
| V2 | láminas animadas (tapan la cámara; la voz sigue) |
| V3 | gráficos con transparencia (tercios, mascota, sellos) |
| A1 | voz · A2 música · A3 efectos |

Sigue el mapa de cortes: cada plano empieza a cámara y la lámina entra en V2 cuando ya se vio a quien habla.
Recorta la **cola** de cada lámina, nunca el inicio. Pon el animatic en V4 apagado como guía.

## 4. Audio
- Voz (A1): clic derecho › *Normalize Audio Levels* › ITU-R BS.1770-4, −16 LUFS.
- Música (A2): unos −22 dB bajo la voz. Más alta en la intro y el cierre (keyframes). Fundido de salida al final.
- Efectos (A3): unos −12 dB, o silencia la pista si los efectos ya vienen dentro de las láminas.

## 5. Subtítulos
*File › Import › Subtitle* con el SRT de cada persona. Arrástralo a la pista de subtítulos al inicio de su bloque y
ajusta en el Inspector.

## 6. Color
En la página Color, iguala piel y brillo de los planos a cámara (Lift/Gamma/Gain) y copia el ajuste a los demás clips.
No toques las animaciones.

## 7. Exportar (Deliver)
Custom Export › MP4 · H.264 · 1920×1080 · {{fps}} fps · *Restrict to* 12000 kb/s · AAC 320 kb/s. Revisa el archivo
completo antes de subirlo.

## 8. Publicar
YouTube en Público o No listado (nunca Privado). Pega los créditos en la descripción. Abre el enlace en una ventana de
incógnito para comprobar que se ve.
