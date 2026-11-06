---
name: plantilla-tema-grupo
description: >-
  PLANTILLA para que cada grupo cree su propio tema personalizado (marca, equipo, guion, prototipo, mascota,
  cifras y reglas) y lo use con las suites de construcción de video. Copia esta carpeta, renómbrala como
  grupoNN-nombre-del-proyecto, cambia el name y esta descripción (qué proyecto, qué grupo, cuándo usarla) y llena cada
  sección. No la uses tal cual para producir un video.
---

# Tema personalizado · Grupo {{NN}} · {{Nombre del proyecto}}

> Este tema es **solo del grupo {{NN}}**. Las suites (`suite-codigo`, `suite-artcraft`) son genéricas. Aquí van los
> componentes propios del grupo.

## Cómo llenarla (pasos)
1. Copia la carpeta: `cp -r plantilla-tema-grupo grupo{{NN}}-{{proyecto}}`.
2. Cambia `name:` y `description:` arriba. La descripción debe decir el nombre del proyecto, el grupo, los nombres
   de los integrantes y "úsalo cuando se trabaje en el video o las piezas de {{proyecto}}". Así el agente la activa
   sola.
3. Llena las secciones de abajo y borra los `{{…}}`.
4. Instálala junto con la suite que vayas a usar (ver `skills/README.md`).

## Proyecto
- **Nombre en pantalla:** {{…}}. Nombre largo: {{…}}.
- **Reto o tema asignado:** {{…}}.
- **Idea en una frase:** {{qué hace, para quién, por qué importa}}.
- **Prototipo o producto:** {{URL}} · repositorio {{…}} · vistas o pantallas clave {{…}}.
- **Entregas y límites:** {{duración máxima, quién debe aparecer, formato, fecha}}.

## Equipo
| # | Integrante | Bloque | Rol en pantalla |
|---|---|---|---|
| 01 | {{…}} | {{…}} | {{…}} |

Guion final (fuente única): {{ruta del archivo con el texto exacto que se dice}}.

## Identidad
- **Colores** (hex, idealmente tomados del CSS o del logo real): {{…}}.
- **Tipografías:** {{títulos}} / {{texto}}.
- **Logo:** {{archivos SVG/PNG y reglas}}.
- **Mascota (opcional):** {{especie u objeto, por qué representa el proyecto, poses}}. Debe ser **original**.
- **Música:** {{título, autor, licencia, BPM}}.

## Cifras y cómo decirlas
| Dato | Uso |
|---|---|
| {{…}} | verificada (fuente: {{…}}) / preliminar / ilustrativa |

## Reglas de honestidad
- {{qué es real y qué es simulado; cómo se rotula}}.
- {{licencias de fotos, música y sonidos; créditos}}.
- {{uso de IA: qué se puede generar y qué no}}.

## Dónde está cada cosa
| Recurso | Ruta |
|---|---|
| {{…}} | {{…}} |

## Cómo usarlo con cada suite
- **Suite de código (Remotion):** {{dónde cambiar textos y cómo renderizar}}.
- **Suite ArtCraft (MCP):** {{qué hace cada app con los recursos del grupo}}.
