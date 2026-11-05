# Reflexión ética y social + banco de preguntas (sesión sincrónica · sáb 7 nov, 8:00 a. m.)

Úsenlo junto con la presentación de Canva (diapositivas "IA responsable" e "Impacto social"). Cada integrante debería poder responder al menos dos preguntas.

## Reflexión final (~2 minutos, sugerido: la dice Salomé o Daniela)
1. **La IA propone, las personas deciden.** BioCLIP sugiere y quien valida es una persona experta (CAR, investigadores). La plataforma puede decir "no concluyente" en vez de inventar una especie.
2. **Proteger a las especies amenazadas.** Publicar la ubicación exacta de un oso de anteojos o de un paujil de pico azul puede facilitar la caza o el tráfico. Por eso esas coordenadas se ocultan o se generalizan (en Darwin Core: `dataGeneralizations`, `informationWithheld`).
3. **Respetar a quien observa.** Cada foto conserva su autoría y su licencia. Los datos personales de quienes observan no se publican.
4. **Sesgos.** Habrá más registros cerca de ciudades y carreteras y menos en zonas rurales o con conflicto, y la brecha digital pesa. Un mapa con pocos puntos no significa que haya pocas especies. Por eso se proponen pilotos con cámaras trampa y alianzas con comunidades.
5. **Transparencia.** Las cifras del prototipo son ilustrativas y los resultados con ranas son preliminares. Lo decimos en el video y en el documento.
6. **Impacto social.** Ciencia ciudadana como entrada y decisiones territoriales como salida: municipios que actualizan sus POT/EOT con evidencia, CAR con información auditable y alertas que llegan en semanas, no en años.

## Banco de preguntas
| Pregunta probable | Respuesta corta | Quién |
|---|---|---|
| ¿Qué aporta frente a iNaturalist o Seek? | Ellos identifican especies; PITB cruza el registro con la zonificación POT/EOT y lo hace auditable para CAR y municipios. Es soporte a la decisión territorial, no solo identificación. | Daniela |
| ¿Por qué BioCLIP? | Es abierto, se entrenó con 10 M+ imágenes y 450 K+ taxones (TreeOfLife-10M), reconoce con pocos o ningún ejemplo y fue Mejor Artículo Estudiantil en CVPR 2024. | Juan |
| ¿86,1 % es suficiente? | Para decidir solo, no. Por eso hay validación humana y la opción "no concluyente". Es una prueba preliminar con 56 ranas; falta validar aves, mamíferos y flora. | Juan |
| ¿Los +24,9 puntos son del modelo? | No. BioCLIP no usa GPS. La plataforma reordena las candidatas según dónde se tomó la foto (qué especies son plausibles en esa zona). | Juan |
| ¿Cómo evitan que se use para cazar o traficar? | Coordenadas generalizadas u ocultas para especies amenazadas, acceso a la ubicación exacta solo para validadores y registro de auditoría. | Salomé |
| ¿Quién es dueño de las fotos y los datos? | Quien toma la foto conserva la autoría y elige la licencia (CC). Los registros validados se publican como datos abiertos en estándar Darwin Core. | María |
| ¿Cómo se conecta con la Agenda Antioquia 2040? | Es el pilar de Ordenamiento Territorial (función de anticiparse) y lo respalda la Ordenanza 57 de 2023 (macrorregiones y subregiones). | Salomé |
| ¿Qué pasa en zonas sin internet? | Captura sin conexión y sincronización después; cámaras trampa cuyas tarjetas se procesan por lotes. | María |
| ¿Cuánto cuesta y quién lo sostiene? | Piloto en 2 subregiones durante 6 meses, validación con una CAR y postulación al Banco de Proyectos de la Agenda 2040. | Daniela |
| ¿Qué es real en el prototipo? | La interfaz, el flujo, las fotos (iNaturalist) y el mapa base. Son simulados el análisis, las cifras del tablero, los observadores y la zonificación. Se puede contrastar con la demo pública de BioCLIP. | María |
| ¿Y si la IA se equivoca con una especie invasora o amenazada? | Toda alerta pasa por validación humana antes de llegar a un dictamen y el sistema guarda la traza (quién validó y cuándo). | Juan |
