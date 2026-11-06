---
name: davinci-handoff
description: >-
  Prepares and hands over video material so a person can finish the edit in DaVinci Resolve, especially the FREE
  version: exports motion-graphics plates (H.264), overlays with transparency (PNG sequence or ProRes 4444),
  stills for lower thirds, music/SFX stems and SRT subtitles, writes a step-by-step Resolve guide (project
  settings, bins, track layout V1 camera / V2 plates / V3 overlays, audio normalisation, Deliver settings),
  fixes phone footage problems (variable frame rate, HEVC) before import, and rebrands Fusion .comp templates
  (Mixkit or others: texts, fonts, colours, animated words, logo) with a tested script. Use it whenever the
  final edit happens in DaVinci Resolve or someone mentions Resolve, Fusion, .comp, .drp, .setting, "plantillas
  de DaVinci", lower thirds or callouts for Resolve, alpha/transparent overlays for an editor, or asks how to
  import, assemble or export a video in Resolve — and also when choosing between the Resolve MCP/scripting route
  and a manual guided edit.
---

# davinci-handoff: from generated material to a finished Resolve edit

The person will finish the edit in DaVinci Resolve, often the free version on Windows, under deadline. Your job is
to give them material that imports cleanly, a layout that makes assembly obvious, and a guide written for someone
who is not a professional editor.

## First, check which Resolve they have
This decides the route, so ask or infer it early:
- **Studio (paid):** external scripting works (*Preferences › General › External scripting using › Local*), so the
  DaVinci Resolve MCP server (`samuelgursky/davinci-resolve-mcp`, `npx davinci-resolve-mcp setup`) can build
  timelines, add markers and render.
- **Free:** external scripting is off. The MCP only has an in-app bridge (*Workspace › Scripts*) that its author calls
  fragile, and Python scripting moved to Studio in 21.1. **Plan a manual, guided edit.** It is faster and safer than
  fighting the bridge under deadline. Also on free: no "Voice Isolation"; on Linux, no H.264/AAC export (export
  DNxHR, then convert with ffmpeg).

## What to deliver (and in which format)
| Material | Format | Why |
|---|---|---|
| Full-frame animations (plates, intro, outro) | H.264 MP4, 1080p, the project fps, yuv420p, CRF 18–20 | imports everywhere, small |
| Overlays with transparency (mascot, lower third, badge) | **PNG sequence** (zip it) or **ProRes 4444** `.mov` with alpha | Resolve reads both. PNG sequences are ~4× smaller for flat art; ProRes is drag-and-drop |
| Static overlays | PNG with alpha, 1920×1080 canvas, element in position | drop on V3, add fades |
| Music, SFX | WAV 48 kHz (stems separate from the mix) | mixing control |
| Subtitles | SRT per speaker (starting at 0) + full SRT | per-speaker files align easily |
| Edit plan | edit map (markdown table) + markers CSV + an **animatic** (full-length reference video) | the person follows it shot by shot |

Make every plate longer than its slot, with a static tail, and tell the person to **trim the tail, never the start**,
because the animations live at the start.

## Phone footage (most common failure)
Phones record variable frame rate (VFR), and in Resolve the audio drifts out of sync. iPhones also record HEVC, which
the free version on Windows may not decode. Convert before importing:
```bash
ffmpeg -i in.mov -r 30 -fps_mode cfr -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -ar 48000 -b:a 192k out.mp4
```
HandBrake (Constant Framerate, 30) is the no-terminal option. Ask the person to set the phone to 1080p 30 fps with HDR
off before recording.

## Fusion templates (.comp): rebrand instead of rebuilding
Many free Resolve templates (Mixkit's lower thirds, callouts, logo titles) are Fusion compositions saved as plain text.
`scripts/fusion_comp_brand.py` edits only what you ask:
```bash
python scripts/fusion_comp_brand.py list template.comp                 # editable texts, fonts, colours, animated words, image loaders
python scripts/fusion_comp_brand.py apply template.comp spec.json -o branded.comp
```
`spec.json` sets `texts`, `fonts` (`"*"` for all), `colors` (Background nodes, hex), `text_colors`, `animated` (words
that change by keyframe) and `loaders` (logo image path, Windows paths as `C:\\...`). It refuses to save if braces end
up unbalanced.

Before you redistribute a third-party template, even a modified one, check its licence. When unsure, ship the script
that downloads and brands it on the person's machine instead of the template files.

To use a `.comp` in Resolve (free and Studio):
1. In the Edit page, drag *Effects › Toolbox › Effects › Fusion Composition* to V3.
2. In the Fusion page, use *File › Import Fusion Composition…*.
3. Install the fonts first (Google Fonts › *Install for all users*), then restart Resolve.

`.drp` files are whole projects: *Project Manager › Import Project*, then copy the clip into the real project.

## The guide you write for the person
Use `references/resolve-guide-template.md` as the skeleton. Fill in real file names and timings, and keep the
language plain. It covers:
1. project settings (resolution and fps **before** importing);
2. bins;
3. track layout;
4. assembly following the edit map;
5. audio: *Normalize Audio Levels* at −16 LUFS on the voice, music at about −22 dB under voice;
6. subtitles;
7. light colour matching;
8. Deliver (H.264 MP4, 1080p, about 12 Mb/s, AAC 320 kb/s);
9. upload and link check (open it in a private window).

## Checks before handing over
- Probe every file you deliver (`ffprobe`): duration, fps, codec, alpha (`pix_fmt` contains `a`), audio present.
- Pull 1–2 frames from each animation and look at them, including mid-transition frames.
- Total runtime of the animatic is under the limit (e.g. ≤ 3:00).
- Licences and credits file included (music, SFX, photos, templates, map data).
- Nothing important lives only in a temporary folder: everything is in the delivered tree or the repository.
