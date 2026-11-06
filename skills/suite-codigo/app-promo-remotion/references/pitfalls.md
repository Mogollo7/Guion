# Pitfalls already paid for (Remotion + Playwright promos)

Each item cost a failed render once. Read before building.

## Capture (Playwright)
- **`page.clock.install()` does not stop time.** It keeps running until you call `page.clock.pauseAt(...)`. Without
  the pause, a 1.5 s "analysing…" state is gone before your screenshot.
- **CSS transitions run on real time**, not the fake clock. A screenshot right after a click catches a half-coloured
  button, e.g. an active chip with invisible text. Add a real `waitForTimeout(300–450)` before each shot.
- **Viewport vs full-page coordinates.** Element boxes taken with `getBoundingClientRect() + scrollY` are document
  coordinates. They match full-page shots, not viewport shots of a scrolled page. Prefer full-page shots for anything
  you will pan across.
- **Order states so layers stay consistent.** If the photo is uploaded after the filter shots, crossfading from
  "photo uploaded" to "filter open" makes the photo vanish. Capture in the order the video shows them.
- **Blocked CDNs or map tiles in the render box.** Route the library to a local copy (npm package). Map tiles may be
  unavailable: use a screenshot captured elsewhere, or draw the map from open data (e.g. official boundaries as SVG).
- **Deterministic randomness.** Pin `Math.random` when the app picks a random result.

## Remotion
- **HTML inside SVG breaks.** An `<Img>` or `<div>` passed into an SVG `<g>` is created in the SVG namespace, and
  `Img` then crashes with `current.decode is not a function`. Wrap HTML in `<foreignObject>`.
- **Composition ids** allow only letters, digits, CJK and `-`. `P00_Intro` fails; use `P00-Intro`.
- **Fonts:** import `@fontsource/<family>/<weight>.css`, then hold rendering with `delayRender` until
  `document.fonts.load(...)` resolves. Otherwise the first frames render in a fallback font.
- **Browser in cloud boxes:** pass the preinstalled headless shell (`--browser-executable` or `REMOTION_BROWSER`) instead
  of downloading one.
- **Render many stills from one bundle** (`@remotion/bundler` + `renderStill` in a loop). Each `npx remotion still`
  re-bundles (~15 s).
- **Stale renders:** a killed render script can leave a Node process alive that later overwrites your outputs. Check
  `pgrep -fa render` before trusting file timestamps.
- **Alpha:** ProRes 4444 needs `codec: 'prores'`, `proResProfile: '4444'`, `imageFormat: 'png'`,
  `pixelFormat: 'yuva444p10le'`. A 4 s 1080×1080 clip is about 30 MB. A PNG sequence of the same clip zips to about
  9 MB.
- **Highlight behind text:** if a highlighted word uses the same colour as the background above the highlight band,
  its top half disappears. Use a full-height highlight or a contrasting text colour.
- **Exit and entrance overlap:** staggered word exits (`out + i*2`) can still be visible when the next element
  enters. Leave about 8 frames of clearance.

## Delivery
- Plates longer than their slot, with a static tail. The editor trims the tail, never the start.
- Probe every deliverable (`ffprobe`): duration, codec, `pix_fmt` (alpha), audio stream.
- Never redistribute third-party templates or stock unless the licence allows it. Link them or script the download
  instead.
