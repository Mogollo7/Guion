# Micro-interaction recipes (30 fps, 120 BPM)

## Drag and drop a photo into an app
- Frame −20: the photo (polaroid style, with a white border) is in the mascot's or cursor's hand.
- Frame 0: `ArcFly` from hand to dropzone over 16 f, arc height 150–220 px, scale 1 → 0.55, spin −20°.
- Frame 16: dropzone flashes. The screen layer swaps to "photo uploaded"; add `Ripple` (260 px) and `Burst`
  (r 110). Sound: `drop`.
- Frame 20: the mascot reacts (jump, grin).

## Tap → processing → result
- Tap on the button: `Tap` from below-right. The button squishes for 6 f. Sound: `click`, leading by 11 ms.
- Processing: step chips fly out of the device one per 12 f (`Pop` with `from` = device centre), each with a soft
  keypress sound. They exit together when the result arrives.
- Result: a real UI card (`UICrop` of the result panel) pops with tilt −24°. A big circular badge with a counter pops
  20 f later with a `Burst`. Sound: `ding`.

## Exploded view of a detail card
- The device sits centred and small. 3–4 crops of real pieces (credit line, taxonomy chips, top-3, action button) pop
  out at 20 f intervals, each from the device towards its slot.
- Dashed connector lines draw over 14 f from the slot to the source point on the device.
- Uppercase labels sit above each piece. End on the primary action: a tap on the button, with a squish and a burst.

## Publish to a map
- Tap "Publish" on the phone. A `MapPin` flies in an arc (height 260–320 px) to the target point on the laptop's map
  over 22–28 f.
- Landing: bounce `|sin|` decaying over 28 f, plus confetti (seeded), a ripple in the pin colour, and pulsing rings on
  the other markers (period 26 f, staggered 2 f).
- Sounds: whoosh peaking at the landing, then drop.

## Validate in a table
- Zoom the laptop's screen to the row (scale ×1.6). `Tap` on "Validate". Swap the screen layer to the validated state
  4 f later.
- `Check` (190 px) beside the row, with a `Burst` and a 60-particle `Confetti`. The mascot switches to the celebrate
  pose and jumps twice (10 f and 40 f after).

## Kinetic headline
- Words enter 4–6 f apart (`Kinetic`), from y+50 px, scale 0 → 1 with overshoot, rotation −10° → 0.
- Highlight: a marker band 0.42 em tall sweeps in 4–12 f after its word. Use full height on dark backgrounds.
- Exit: per word, 2 f stagger, 8 f fade and rise. Start the next element only after the last word is gone.

## Iris transition
- At the end of a scene, a circle in the next scene's background colour grows from the point where the next action
  will happen, over 12 f (ease-in-out). The next scene starts on that colour.
- Sound: whoosh peaking around frame 8–10.
