---
name: app-promo-remotion
description: >-
  Builds an App Promo / Product Explainer video (UI motion graphics in the style of Duolingo or Apple-style app
  previews) in Remotion from a REAL web app or prototype — captures the actual interface states with Playwright
  (desktop and mobile, deterministic clock, element boxes), puts them in generic phone and laptop mockups, makes
  pieces of the real UI pop out of the screen, adds kinetic typography, an optional 2D mascot rig, iris
  transitions and beat-synced sound, and renders the promo, per-scene plates for a longer edit and transparent
  overlays. Use whenever someone wants a promo, launch video, app preview, demo video, product explainer, "video
  mockup", "video del prototipo", "mostrar la app en un celular", "animación tipo Duolingo", motion graphics of
  a website or app, or a teaser for social media — even when they don't mention Remotion or Playwright.
---

# app-promo-remotion: a promo made from the real product

The strongest promo shows the **real** interface doing its job, not a redrawn imitation. The recipe:
1. capture real states;
2. put them in devices;
3. make the important pieces jump out;
4. say one short thing per beat;
5. land every action with a small, real sound.

## Ingredients (copy into the project)
| File | What it gives you |
|---|---|
| `scripts/capture_states.mjs` | Playwright capture from a steps file: clicks, uploads, fills, a paused clock, CSS-transition waits, PNG @2x and element boxes |
| `assets/devices.tsx` | `Screen` (layers of captures with crossfades and scroll/zoom keys), generic `Phone` and `Laptop`, `UICrop` (one real piece of the UI as a floating card) |
| `ui-microinteractions` skill, `assets/microinteractions.tsx` | `Pop`, `Kinetic`, `StepTag`, `Tap`, `Ripple`, `Check`, `Burst`, `Confetti`, `ArcFly`, `MapPin`, `Iris`, `Deco`, `Bubble` |
| `assets/mascot-rig-example.tsx` | a complete 2D mascot rig to learn from: pose springs, blink, look, jump with squash and stretch, held object |
| `scripts/contact_sheet.py` | frames at chosen seconds in one image, to review a render without watching it |
| `references/storyboard.md` | the promo structure, timings in bars, layout and copy rules |
| `references/pitfalls.md` | errors already paid for (read before rendering) |

Setup: `npm i remotion @remotion/cli @fontsource/<display> @fontsource/<body>`. Playwright and Chromium for captures:
in a cloud box use the preinstalled browser; on a laptop run `npx playwright install chromium`.

## Workflow

### 1. Find the story in the product (before any code)
Read the product: its pages, CSS (exact colours and fonts), copy and main flow. Name the 3–5 actions that show its
value, for example *upload a photo → AI identifies → appears on a map → an expert validates*. Each action becomes one
scene of 2–4 bars. Write the storyboard first (`references/storyboard.md`).

### 2. Capture real states
Write `steps.json` for `capture_states.mjs`. Capture each state you will animate: before the click, after it, and the
intermediate frames of a process (advance the paused clock 300 ms at a time). Capture **mobile** (390×844 @3x) for the
phone and **desktop** (1280×800 @2x) for the laptop. Save element boxes for everything a cursor, tap or callout must
touch. Then make a contact sheet of the PNGs and look at them. Things to look for:
- half-finished CSS transitions (fix: `wait`);
- overlays that block the view;
- broken map tiles or fonts.

Data hygiene: if the UI shows real personal data, swap it for fictional stand-ins. Label simulated numbers on screen
as illustrative.

### 3. Build scenes
One component per scene, each with local frame 0, sequenced in a `Promo` composition with iris transitions. Per
scene: a kinetic headline of 1–4 words (+ a step tag), the device with the real capture, one or two UI pieces popping
out (`UICrop` in a `Pop` with tilt), one interaction (`Tap`, `ArcFly` of a photo or pin, `Check`) and its sound. Time
everything in beats (30 fps, 120 BPM → 15 frames per beat, 60 per bar). An optional mascot reacts to the action:
it points, presents, celebrates.

### 4. Check stills, then render
Render stills at the settled moment of every scene **and** in the middle of transitions (`npx remotion still ... --frame=N`
or a small bundle-once script). Look for:
- text overlapping devices;
- callouts cut by the frame edge;
- words still animating where they should be readable;
- empty frames.

Fix, then render. Deliver:
- the promo (H.264 with music and SFX);
- **plates**: each scene alone, longer, without music, for a talking-head edit;
- **overlays with alpha** (mascot clips as a PNG sequence or ProRes 4444).

### 5. Sound
Music at 108–136 BPM leads. Accents go only on the key actions (tap, drop, check, logo), aligned per role: a tap
leads the frame by tens of ms, a whoosh peaks just after the cut. Use real recorded or CC0 sounds; the
`openverse-sfx` skill finds, credits and places them. Do not double sounds already baked into plates.

## Rules that make it look professional
- **Real UI, honestly labelled.** "Datos ilustrativos" or "simulated result" on anything fake. Credit photos.
- **One idea per scene, one hero motion per beat.** If two things move at once, one of them is decoration.
- **Readability.** A headline stays still for at least ~0.3 s per word. Exits never start before the reader is done.
- **Elastic, not bouncy everywhere.** Springs with damping 9–14 for entrances; ease-in-out for camera and scroll moves.
- **Depth from layout, not effects.** Tilted device (6–14°), a big accent shape behind it, soft long shadows. The
  device alternates sides between scenes.
- **Mascots are original.** Never copy an existing character. Keep it secondary: it reacts to the product, and the
  product is the star.
