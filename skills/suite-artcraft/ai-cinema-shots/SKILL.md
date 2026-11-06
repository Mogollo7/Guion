---
name: ai-cinema-shots
description: >-
  Plans and writes AI-generated cinematic shots (images and short video clips) for B-roll, establishing shots,
  mood shots or talking portraits, using a camera-language prompt grammar (camera body, lens, focal length,
  aperture, camera movement, style) learned from Open Higgsfield AI, and generates them either with Open
  Higgsfield AI (desktop app or hosted studio, 200+ models through Muapi) or any text/image-to-video tool
  (ArtCraft, Canva, Runway…). Use whenever someone wants AI B-roll, "tomas generadas con IA", "plano de dron",
  "video de ambiente", text-to-video or image-to-video clips, a cinematic shot list, lip-sync of a portrait, or
  asks how to install or use Open Higgsfield — and also when their PC is too weak to run generators and they
  need the prompts and rules only.
---

# ai-cinema-shots: AI shots that look directed, labelled honestly

Generated shots are useful for ambience, places you cannot film and transitions. They are dangerous when they
pretend to be evidence. The skill gives you a shot list in camera language, prompts that models follow, a way to
generate them, and the rules that keep the video honest.

## 1. Choose how to generate
| Option | Install | Cost | When |
|---|---|---|---|
| **Open Higgsfield AI desktop** (Windows/macOS installers in `Anil-matcha/Open-Higgsfield-AI` releases) | one installer. Windows SmartScreen: "More info › Run anyway". macOS: `xattr -cr` on the app | needs a **Muapi.ai API key** and credits per generation | a light PC is fine: generation runs in the cloud |
| **Hosted Open Higgsfield** (muapi.ai/open-higgsfield-ai) | nothing, browser only | account + credits | quickest; same four studios |
| From source (`git clone`, `npm install`, `npm run dev`) | Node 18+ | same API key | only to modify the UI |
| Other tools (Canva video, ArtCraft generators, Runway…) | per tool | per tool | use the same prompt grammar below |
| **No generation** (PC or budget too limited) | none | free | use the shot list and prompts as direction for real footage or stock (Mixkit, Pexels, Openverse) |

Open Higgsfield has four studios:
- **Image:** text-to-image and image-to-image, with up to 14 reference images.
- **Video:** text-to-video and image-to-video.
- **Lip Sync:** portrait + audio gives a talking video.
- **Cinema:** camera, lens, focal length and aperture controls.

The API key stays in the browser's local storage and is sent only to Muapi. Never paste it in chat or commit it.

## 2. Write the shot list first
One line per shot. Most models give 5–10 s per clip, so plan shots of 3–6 s and cut them shorter in the edit.
```
# | duración | propósito (qué cuenta) | sujeto | cámara/movimiento | luz/estilo | va sobre (voz/plano)
```
Prefer **image-to-video**: generate or choose the exact first frame, then animate it. It is far more controllable
than text-to-video, and it keeps colours and characters consistent between shots, especially with the same
reference images.

## 3. Prompt grammar (from Open Higgsfield's Cinema studio)
`[subject + action + place], shot on a [camera], [lens], [focal perspective], [aperture effect], [camera movement], [light], [style], [quality tags]`

- **Camera body:**
  - modular 8K digital cinema camera
  - full-frame digital cinema camera
  - grand format 70mm film camera
  - Super 35 studio digital camera
  - classic 16mm film camera
  - premium large-format digital cinema camera
- **Lens:**
  - compact or classic anamorphic
  - premium modern prime
  - warm-toned cinema prime
  - 1970s cinema prime
  - vintage prime
  - swirl bokeh portrait
  - ultra-sharp clinical prime
  - extreme macro
  - creative tilt lens
  - halation diffusion filter
- **Focal → perspective:**
  - 8 mm: ultra-wide
  - 14 mm: wide-angle
  - 24 mm: wide-angle dynamic
  - 35 mm: natural cinematic
  - 50 mm: standard portrait
  - 85 mm: classic portrait
- **Aperture:**
  - f/1.4: shallow depth of field, creamy bokeh
  - f/4: balanced
  - f/11: deep focus, sharp foreground to background
- **Movement** (one per shot):
  - locked-off static
  - slow dolly-in / dolly-out
  - crash zoom
  - orbit 360
  - arc left
  - crane up / down
  - tracking alongside
  - follow behind
  - FPV drone
  - high aerial glide
  - handheld subtle shake
  - whip pan
  - pan / tilt
  - rack focus
  - dutch angle
  - POV
  - low-angle hero push-in
  - top-down rotate
  - slow zoom-out reveal
- **Light, mood and style:**
  - light: golden hour, soft diffused, volumetric rays, dramatic studio;
  - mood: serene, epic, warm;
  - style: photorealistic; cel animation, claymation, watercolour, 16-bit pixel art, vintage 1970s film, film noir
    when the piece is stylised.

Full tables and templates: `references/prompt-grammar.md`. It is a rewritten summary: the Open Higgsfield repo declares no licence, so its code is not copied.

**Example** (field B-roll for a biodiversity project):
> Hands holding a smartphone photographing a leaf in a misty Andean cloud forest at dawn, shot on a full-frame digital
> cinema camera, premium modern prime lens, natural cinematic perspective (35 mm), shallow depth of field (f/1.4),
> slow dolly-in, soft diffused morning light, photorealistic, no text, no logos

## 4. Rules
- **Label it.** Every generated shot gets "Imagen generada con IA" on screen (2–3 s) or in the credits, and in the
  written report.
- **Never as evidence.** Do not generate the species, data, people or places the project claims are real. Real
  photos, with licences, carry the facts. AI carries mood: landscapes, hands, devices, transitions.
- **No real people's faces** without consent. Lip-sync only with portraits of people who agreed, ideally the team
  itself.
- **Consistency:** reuse the same reference images, palette words and camera body across the shot list. Generate
  2–4 takes and choose.
- **Quality control:** extract 3 frames per clip (start, middle, end). Look for warped hands, melting text and
  objects that change identity. Reject and regenerate rather than hide problems.
- **Fit the edit:** export or convert to the project fps (e.g. `ffmpeg -i in.mp4 -r 30 -c:v libx264 -crf 18 out.mp4`)
  before DaVinci or FilmCraft. Keep generated clips on their own track so they are easy to swap.

## 5. Output to the person
- The shot list as a table.
- One final prompt per shot.
- The chosen tool, with what it costs or needs.
- After generation: the clip files, their frame checks and the labels and credits to add.
