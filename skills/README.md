# Skills para hacer videos con agentes (Claude Code y compatibles)

Se dividen en **dos suites de construcción** (genéricas, para cualquier grupo y cualquier tipo de video) y un
**tema personalizado** (lo específico de cada proyecto). Instala una suite, o las dos, más **tu** tema.

```
skills/
├── suite-codigo/          ← la que se usó para los videos de PITB: todo por código (Remotion, Python, ffmpeg)
│   ├── app-promo-remotion     App Promo / mockups con la UI real, escenas, render
│   ├── ui-microinteractions   toques, rebotes, check, confeti, texto cinético (+ trazo a mano con p5.brush)
│   ├── beat-cut-editing       guion + música → cortes al beat, subtítulos, marcadores
│   ├── openverse-sfx          efectos de sonido reales con licencia (Openverse), créditos y mezcla
│   └── davinci-handoff        entrega y montaje en DaVinci Resolve (gratis), plantillas Fusion (.comp)
├── suite-artcraft/        ← la misma producción hecha en apps de escritorio clon de Adobe, manejadas por MCP
│   ├── artcraft-video-studio  VectorCraft → PhotoCraft → EffectCraft → SoundCraft → FilmCraft
│   └── ai-cinema-shots        tomas con IA (Open Higgsfield u otras): gramática de cámara y reglas
└── tema-personalizado/
    ├── grupo34-pitb-antioquia SOLO grupo 34 (PITB Antioquia): marca, equipo, guion, Tremi, cifras, rutas
    └── plantilla-tema-grupo   cópiala para crear el tema de TU grupo
```

## ¿Qué instalo según lo que quiero hacer?
| Quiero hacer… | Skills | Programas a instalar |
|---|---|---|
| Video de exposición con integrantes a cámara + animaciones, montado en DaVinci | beat-cut-editing, davinci-handoff (+ app-promo-remotion para las láminas) | DaVinci Resolve (gratis), ffmpeg, Python 3; Node 22 para Remotion |
| App Promo / video del prototipo tipo Duolingo (código) | app-promo-remotion, ui-microinteractions, openverse-sfx | Node 22, Remotion (`npm i`), Playwright (`npx playwright install chromium`), ffmpeg, Python 3 + numpy |
| Lo mismo pero en apps de escritorio, sin programar animaciones | artcraft-video-studio | ArtCraft Launcher (getartcraft.com); para MCP: Rust (`rustup`) y compilar los `*-cli` (ver la skill) |
| Tomas de ambiente generadas con IA | ai-cinema-shots | Open Higgsfield AI (instalador, o web) + clave de Muapi con créditos; o solo las guías de prompts |
| Efectos de sonido con licencia para cualquier video | openverse-sfx | Python 3, ffmpeg, numpy (descargas desde tu propio PC: algunos servidores bloquean redes de nube) |
| Plantillas de DaVinci con mi marca (tercios, llamadas, logo) | davinci-handoff | DaVinci Resolve; Python 3; tipografías de tu marca instaladas |
| Look dibujado a mano (lápiz, acuarela) | ui-microinteractions (referencia p5.brush) | p5.brush (`dist/brush.js`) en el proyecto Remotion |

**Siempre:** tu tema personalizado. El grupo 34 usa `grupo34-pitb-antioquia`. Los demás grupos copian
`plantilla-tema-grupo` y la llenan con sus propios componentes.

## Instalar
```bash
# Mac / Linux (Claude Code): elige suites y tema
bash skills/install.sh codigo artcraft tema-personalizado/grupo34-pitb-antioquia
# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File skills\install.ps1 codigo artcraft tema-personalizado\grupo34-pitb-antioquia
```
Se copian a `~/.claude/skills/` (o `%USERPROFILE%\.claude\skills\`). Reinicia Claude Code para que las vea. Para
claude.ai o Claude Desktop, comprime cada carpeta de skill en `.zip` y súbela en *Settings › Capabilities › Skills*.

Para la suite ArtCraft instala además las skills por app (detalle de cada programa):
`git clone https://github.com/midasmatterhorn/artcraft-skills && cd artcraft-skills && bash install.sh --claude`
(en Windows: `.\install.ps1 -Claude`).

## Fuentes y créditos de lo aprendido
- Sonido: earshot (Leonxlnx/earshot), real-sfx de Clipwing (Clipwing/skills), API de Openverse.
- ArtCraft: storytold (apps) y midasmatterhorn/artcraft-skills (superficies MCP/CLI auditadas).
- Gramática de cámara: Open Higgsfield AI (Autom8AI/Open-Higgsfield-AI). Sin licencia declarada, así que solo se
  resumió, no se copió código.
- Trazo a mano: p5.brush (acamposuribe/p5.brush, MIT).
- Plantillas de DaVinci: Mixkit (se descargan con script; no se redistribuyen).

## Estado de las pruebas
Cada skill trae casos de prueba en `evals/` (formato `claude plugin eval`). La primera ronda automática (con y sin
skill) se cortó por el límite de uso. Las herramientas (`scripts/`) sí se probaron a mano: capturas del prototipo,
beat grid contra referencia, mezcla de efectos, rebranding de `.comp` y búsqueda en Openverse. Para correr las pruebas:
`claude plugin eval skills/suite-codigo/<skill> --allow-tools Write,Edit,Bash --scaffold`.
