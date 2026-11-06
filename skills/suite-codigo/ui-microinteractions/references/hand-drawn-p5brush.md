# Optional hand-drawn look: p5.brush in a video

[p5.brush](https://github.com/acamposuribe/p5.brush) (v3, MIT) adds natural media to p5.js: pencil, charcoal, marker,
watercolor fills, hatching, and flow fields that bend strokes. Use it when a promo should feel handmade, e.g. a field
notebook, a watercolor map or a scribbled underline, instead of flat vector.

## How to use it in a frame-exact video (Remotion)
- Use the **standalone build** (`dist/brush.js`). It needs only a WebGL2 canvas: `brush.createCanvas(w, h)`.
- A video frame must be a pure function of time. On every frame:
  1. `brush.seed('fixed')` and `brush.noiseSeed('fixed')`;
  2. clear;
  3. draw everything up to the current frame;
  4. `brush.render()`.

  Never accumulate strokes across frames: Remotion renders frames out of order and in parallel.
- Animate a stroke drawing in by drawing a partial path: the first `p · length` of the points, where
  `p = interpolate(frame, [start, end], [0, 1])`.
- Wrap it in a component that draws into a `<canvas>` in `useEffect` keyed on the frame, and hold the frame with
  `delayRender` / `continueRender` until `brush.render()` returns.
- Watercolor fills are expensive. Pre-render static textures once to PNG and only animate strokes live.
- Use the [Brush Maker](https://acamposuribe.github.io/p5.brush/tools/brush-maker.html) and the
  [Flow Field Generator](https://acamposuribe.github.io/p5.brush/tools/flowfield-maker.html) to design brushes, then
  paste the generated `brush.add()` / `brush.addField()` code.

## Good uses in product videos
- Circle or underline a UI element (`charcoal`, 1–2 px jitter) instead of a perfect rectangle callout.
- Watercolor wash behind a map or a species photo.
- Hatching that fills a region as a "loading" or "analysing" state.
- Handwritten-style annotations on a field-notebook background.

Keep the UI itself crisp. The brush is decoration around the real product, not a replacement for it.
