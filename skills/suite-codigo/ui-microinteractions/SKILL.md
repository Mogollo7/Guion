---
name: ui-microinteractions
description: >-
  A tested catalogue of micro-interactions for motion graphics and product videos in Remotion/React — elastic
  pops, kinetic typography with marker highlights, step tags, finger taps with ripples, check marks that draw,
  bursts, confetti, objects flying in an arc (photo into a phone, pin onto a map), map pins with bounce, iris
  transitions, speech bubbles, floating decorative leaves — with frame timings on a 120 BPM grid and the sound
  each one should carry. Use whenever someone animates UI, buttons, clicks, taps, cards, notifications, success
  states, counters, titles or transitions for a video or promo, asks for "microinteracciones", "animaciones tipo
  app", "efecto rebote", "que el botón se hunda", "confeti", "check animado", "texto cinético", or wants a video
  to feel like Duolingo or Apple app previews — even if they do not say Remotion.
---

# ui-microinteractions: small motions that sell an action

A micro-interaction tells the viewer one thing happened: the tap registered, the card arrived, the task is done. In a
video it carries three parts that land together:
- **anticipation**: the finger or cursor arrives;
- **action**: the press, squash or pop;
- **feedback**: ripple, check, burst, sound.

Do that for the actions that matter and keep everything else calm.

## The kit
`assets/microinteractions.tsx` is self-contained (Remotion 4 + React). Edit the palette in `THEME` and import what you
need:

| Component | Use | Typical timing (30 fps) | Sound role |
|---|---|---|---|
| `elastic(f, fps, at, damping=9, stiffness=170, mass=0.6)` | the spring behind everything | settles in ~12–18 f | — |
| `Pop` | any card or UI piece arriving, with optional flight from a source point and 3D tilt | in 10–14 f, then floats ±4 px | `pop` (+4 ms) |
| `Kinetic` | headlines word by word, with overshoot and rotation; `hl` sweeps a marker behind a word; `out` exits | 4–8 f between words | none (music) |
| `StepTag` | "1 · EXPLORAR" chapter tag | pop on the scene's downbeat | — |
| `Tap` | a finger dot that travels, presses (scale 0.8) and leaves a `Ripple` | arrives 16 f before the action | `tap`/`click` (lead 11–60 ms) |
| `Ripple` | a ring expanding from a touch point | 20 f | — |
| `Check` | a circle pops, then a tick draws | pop 0–8 f, stroke 4–16 f | `ding`/`chime` |
| `Burst` | radial lines on a success or a landing | 18 f | goes with the main sound |
| `Confetti` | deterministic particles with gravity (seeded `random`) | 70 f | none, or a soft `chime` |
| `ArcFly` | an object flies along a parabola (photo into the phone, pin onto the map) | 16–28 f | `whoosh` (peak at landing +37 ms) then `drop` |
| `MapPin` | a pin with white outline and shadow; bounce it after `ArcFly` lands | bounce decays in ~28 f | `drop` / `land` (+30 ms) |
| `Iris` | a circular wipe in the next scene's colour from a chosen point | 12–14 f | `whoosh` |
| `Deco` | slow parallax leaves and dots for backgrounds | always on, low opacity | — |
| `Bubble` | a speech bubble with an elastic entrance and a tail | in 8–12 f | `pop` |

Button squish: wrap the button in `scale(f >= at-3 && f <= at+3 ? 0.92 : 1)`. It reads as a press when paired with a
`Tap` at the same frame.

## How to choreograph
1. **Put the action on a beat** (multiples of 15 frames at 120 BPM). Anticipation starts 1 beat earlier.
2. **One hero per beat.** While the hero moves, everything else holds still or floats subtly.
3. **Stagger, don't swarm.** Lists and chips enter 4–6 frames apart. Five things at once read as noise.
4. **Overshoot only on entrances.** Exits are quick ease-ins (6–8 f). Camera, scroll and zoom moves are ease-in-out
   with no overshoot.
5. **Hold for reading.** About 0.3 s per word after the last word settles. Counters stop on the final value at least
   1 s before the cut.
6. **Feedback matches meaning.**
   - A check means done and validated.
   - Confetti means a milestone; use it once or twice per film, not for every click.
   - A burst means arrival or impact.
   - A ripple means "a touch happened here".
7. **Sound only on the hero.** Each hero interaction gets one real sound with the role offset in the table. The music
   carries the rest. The `openverse-sfx` skill finds licensed real sounds and places them by role.

More recipes, with the reasoning and parameters for each: `references/recipes.md`. For a hand-drawn look (pencil, charcoal, watercolor, hatching) with p5.brush, rendered frame-exactly: `references/hand-drawn-p5brush.md`.

## Quality checks
- Render stills at `at-1`, `at+3` and `at+14` of each hero interaction. The press must be visible, the feedback must
  not cover the thing it confirms, and the settled frame must be clean.
- Confetti and bursts must not cover text the viewer needs to read.
- Highlight colour vs text colour: a word on a dark background with a half-height highlight loses the top of its
  letters.
- Use deterministic randomness only (`random('seed')` from Remotion), so re-renders match.
