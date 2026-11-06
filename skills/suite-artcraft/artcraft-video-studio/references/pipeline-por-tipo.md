# Which apps for which video

| Video type | Apps (in order) | Key steps |
|---|---|---|
| **Talking-head pitch / class video** (people on camera + graphics) | PhotoCraft → EffectCraft → SoundCraft → FilmCraft | phone clips to CFR first (ffmpeg); lower thirds and plates in EffectCraft; voice clean-up in SoundCraft; edit with J/L cuts and SRT captions in FilmCraft |
| **App promo / product demo** | PhotoCraft (mockups) → EffectCraft (device moves, UI pop-outs, kinetic text) → SoundCraft (music + UI SFX) → FilmCraft (assemble, export) | real screenshots captured from the product; key green-screen stock phones in EffectCraft for realistic hands |
| **Explainer with a mascot** | VectorCraft (mascot in layers) → EffectCraft (rig: parenting + keyframes, poses) → SoundCraft → FilmCraft | design the mascot with separate arm/head/eye layers; keep it original |
| **Logo sting / intro** | VectorCraft → EffectCraft (+ Lottie export for the web) | stroke draw-on, fill, burst on the downbeat |
| **Vertical social cut (9:16)** | FilmCraft (Vertical workspace, reframe) | re-cut from the master; captions burned in; 15–30 s |
| **Photo-led documentary** | LightCraft (develop) → PhotoCraft (retouch) → EffectCraft (pan/zoom, maps) → FilmCraft | licences for every photo; slow Ken Burns moves, no more than 1 move per shot |

## Hand-offs between apps
- VectorCraft → EffectCraft: SVG or PNG @2x per layer. Layered PSD also works through PhotoCraft.
- PhotoCraft → EffectCraft: PNG (mockups) or PSD (layers preserved).
- EffectCraft → FilmCraft: ProRes 4444 or a PNG sequence for alpha, H.264 for full-frame plates.
- SoundCraft → FilmCraft: WAV 48 kHz stems (voice, music, SFX) plus a reference mix.
- FilmCraft → the world: H.264 MP4 1080p (web), SRT sidecar, thumbnail PNG from PhotoCraft.

## Mixing with the code suite
Use the parts that work best where they are. The code suite (`suite-codigo`):
- generates frame-exact motion graphics and app promos (Remotion);
- finds licensed real SFX (Openverse);
- plans the cuts on the music grid.

The ArtCraft suite does design, compositing and the final edit inside desktop apps. A typical hybrid: capture and
animate in Remotion, finish (titles, captions, mix, export) in FilmCraft.
