---
name: artcraft-video-studio
description: >-
  Makes a whole video with the ArtCraft creative suite (open-source, pure-Rust clones of Adobe apps) driven by
  an AI agent through MCP — VectorCraft (Illustrator) for logos, icons and a vector mascot; PhotoCraft
  (Photoshop) for photos, composites and device mockups; EffectCraft (After Effects) for motion graphics,
  kinetic text, green-screen keying and Lottie; SoundCraft (Audition) for voice clean-up and the mix; FilmCraft
  (Premiere Pro) for the edit, captions and the H.264 export. Covers what to install (ArtCraft Launcher + the
  `*-cli` MCP servers built with Rust), the `.mcp.json` to register them, the order of the pipeline per video
  type, and how to check every step with rendered frames. Use whenever someone wants to make a video "with
  ArtCraft", "con VectorCraft/PhotoCraft/FilmCraft/EffectCraft", "suite clon de Adobe", "sin Adobe", "gratis y
  open source", wants an agent to edit or animate inside a desktop editor via MCP, or asks what to install to
  produce a video locally without subscriptions.
---

# artcraft-video-studio: a video made inside the ArtCraft suite, driven by MCP

ArtCraft (`storytold` on GitHub, launcher at getartcraft.com) clones the Adobe workflow app by app. Each app can be
driven by an agent in two ways:
- **headless**, through its CLI or MCP server, to build projects, run commands and render;
- **bridged**, attached to the running window, so the person watches the agent work.

This skill orchestrates the apps for a video. For the deep detail of each app (every command, format and known gap),
install the per-app skills from `midasmatterhorn/artcraft-skills` (section "Install", below).

**Maturity warning.** The apps are young: around v0.1x–0.2x, early-access quality, and auto-updated. Treat every
capability as "verify on your installed version". Keep a fallback ready for the final edit (DaVinci Resolve or the
code suite in `../../suite-codigo`). Never promise the person a feature you have not seen work in their build.

## 1. What to install (once)
| Need | Install | Notes |
|---|---|---|
| The apps (GUI) | **ArtCraft Launcher** from getartcraft.com (Windows / macOS / Linux) | installs and auto-updates PhotoCraft, VectorCraft, EffectCraft, FilmCraft, SoundCraft, LightCraft… |
| MCP / CLI servers | **Rust** (`rustup`, stable) + `git`, then build each CLI from its repo: `cargo install --path apps/<app>-cli --locked` (PhotoCraft, VectorCraft) or `cargo build --release -p <app>-cli` (FilmCraft, EffectCraft, SoundCraft, LightCraft) | the launcher install **does not include** the `*-cli` binaries; some releases also ship them as separate assets |
| Per-app agent knowledge | `git clone https://github.com/midasmatterhorn/artcraft-skills` then `bash install.sh --claude` (Windows: `.\install.ps1 -Claude`) | 17 audited skills (filmcraft, effectcraft, photocraft…) |
| Media helpers | `ffmpeg` | probing, conversions, contact sheets |
| Optional AI shots | see `../ai-cinema-shots` | generated B-roll; needs an API key and credits |

Register the MCP servers in the project's `.mcp.json` (template and Windows paths: `references/mcp-config.md`), then
restart the agent so it sees the tools. Check each one with `<app>-cli --version` and with its MCP tools listing
(FilmCraft: `command_list`; EffectCraft: `info`).

PC too weak to build Rust? Use the GUI apps by hand following this pipeline, or the browser builds (self-hosted
web launchers exist). As a last resort, use the code suite.

## 2. The pipeline (who does what)
```
VectorCraft  → logo, icons, mascot (SVG)          ┐
PhotoCraft   → photos, mockups, thumbnails (PNG)   ├→ EffectCraft → motion plates (ProRes/PNG seq, Lottie)
LightCraft   → raw photo development (optional)    ┘                 │
SoundCraft   → voice clean-up, music + SFX mix (WAV) ───────────────┤
                                                                     └→ FilmCraft → edit, captions (SRT), export H.264 MP4
```
1. **Brief → assets list.** From the theme skill (e.g. `tema-personalizado/<group>`), list every asset: logo
   variants, mascot poses, screenshots, photos with licences, music, script lines.
2. **VectorCraft:** build or clean the logo and mascot as vectors. Export SVG and PNG @2x. Separate layers per body
   part if the mascot will be animated in EffectCraft.
3. **PhotoCraft:** composite the real app screenshots into device mockups, cut out photos, make the thumbnail.
   Save PSD (layers) and PNG.
4. **EffectCraft:** one composition per scene, built from the storyboard:
   - device slide-ins, kinetic text, callouts;
   - green-screen keying of stock "phone in hand" footage;
   - the mascot rigged with parenting and keyframes.

   Render each comp as ProRes 4444 or a PNG sequence when it needs alpha, otherwise H.264.
5. **SoundCraft:** clean the voice recordings (noise, levels). Place music and SFX, then bounce the stems and a mix
   at about −14 LUFS with true peak ≤ −1 dBTP.
6. **FilmCraft:**
   - import everything (`media_import`) and assemble the sequence: V1 camera, V2 plates, V3 overlays;
   - import the SRT captions and add markers;
   - render frames to check (`render_frame` at key seconds);
   - export with an H.264 preset (`file.exportMedia` with `wait:true`, or `filmcraft-cli export out.mp4 --preset …`).

## 3. Working rules with MCP
- **Inspect before you act.** List commands (`command_list`) and inspect the document/sequence before edits. Command
  ids and parameters change between versions, so never guess them.
- **Batch and verify.** Group edits with `command_batch` (each step is undoable), then confirm with a read-only
  inspect and a rendered frame. Look at the PNG: you cannot see the timeline otherwise.
- **Headless for building, bridge for showing.** Build headless (`--project file`). Use `--bridge` with the app open
  when the person wants to watch, or for UI-only actions (`ui_*` tools).
- **Paths.** Use absolute paths. On Windows, use forward slashes or escaped backslashes in JSON.
- **Save often** to the native project formats (`.fcproj`, `.ecproj`, PSD, SVG). Keep exports in a separate
  `exports/` folder.
- **When a feature is missing** in the installed build, say so. Do the step in another tool (DaVinci, ffmpeg, the
  code suite) and continue. Do not fake it.

Per video type (talking-head pitch, app promo, explainer with mascot, social vertical cut), which apps and which
order: `references/pipeline-por-tipo.md`.

## 4. Checks before delivering
- Every export probed with `ffprobe` (duration, codec, alpha where needed, audio present).
- Rendered frames at each scene's settled moment and mid-transition, inspected.
- Total length within the limit.
- Licences and credits collected (photos, music, SFX, fonts, AI-generated shots labelled as such).

## Credits
App facts (CLI flags, MCP tools, build commands) come from the audited `midasmatterhorn/artcraft-skills` (refreshed
2026-11-04 against FilmCraft v0.17.0, EffectCraft v0.21.0, VectorCraft v0.21.0, PhotoCraft v0.20.1). Re-check against
your installed versions.
