---
name: openverse-sfx
description: >-
  Sound design for motion graphics, app promos, explainers and edited videos using REAL recorded sound effects
  with open licences found through the Openverse API (Freesound, Wikimedia Commons, Jamendo...). Searches by
  role (click, pop, tap, whoosh, hit, riser, chime, ambience, birds), downloads and cleans the files (no leading
  silence, peak -1 dBFS), writes the credits/attribution file, places every sound on the exact frame with role-
  specific offsets (taps lead the cut, whoosh peaks land just after it), and returns a separate SFX stem WAV
  plus the mixed MP4 at web loudness. Use it whenever someone wants to add sound effects or SFX to a video,
  Remotion/After Effects/DaVinci render or screen recording, asks for free/CC0/licensed sounds, "efectos de
  sonido", "sonidos para el video", "whoosh", "clics", "ambiente de selva/pájaros", wants to replace synthesized
  beeps with real sounds, or needs attribution for sounds — even if they never mention Openverse.
---

# openverse-sfx: real, licensed sound effects placed on the frame

The goal is a film that sounds as if an editor with a good library cut it, with every sound legally usable and credited.

Three ideas carry the whole skill:

1. **Real recordings, not synthesis.** Oscillator beeps read as cheap next to professional launch films. Openverse indexes
   ~4.5 M openly licensed audio files (Freesound has the sound effects; Wikimedia Commons has nature and field
   recordings). If nothing fitting is found, leave the moment quiet and say so. A wrong sound is worse than silence.
2. **You cannot hear.** Treat sound as numbers and facts: duration, onset, peak, loudness, timing against the frame.
   Never claim you listened. Say what you measured and which moments the person should check with headphones.
3. **Licences are part of the deliverable.** Prefer CC0 (no obligations), then CC BY (credit the author), then
   CC BY-SA. Avoid NC for anything that may be commercial and ND when you will trim or process. Every downloaded file
   lands in `credits.json` and `CREDITS.md` with title, author, source and licence link.

## Tools (in `scripts/`)

```bash
# 1. look before you download: ranked candidates with duration, licence and source
python scripts/openverse_sfx.py search "whoosh" --role whoosh --n 10
# 2. download the best N for a role, cleaned (48 kHz WAV, leading silence removed, peak -1 dBFS, cut to the role's typical length)
python scripts/openverse_sfx.py fetch "whoosh" --role whoosh --n 3 --out sfx/
python scripts/openverse_sfx.py fetch "mouse click" --role click --n 4 --out sfx/
python scripts/openverse_sfx.py fetch "tropical rainforest birds" --role ambience --n 1 --out sfx/ --license cc0,by,by-sa --any-category --keep-length
# 3. a file you already have (a CC0 pack, a manual download): same cleaning, same credits
python scripts/openverse_sfx.py add downloads/click.ogg --role click --title "Click 2" --creator Kenney --license cc0 --landing https://kenney.nl --out sfx/
# 4. place the sounds on the film and mix
python scripts/sfx_mix.py cues.json --sfx-dir sfx/ --out result/film_sfx --plan   # check the plan first
python scripts/sfx_mix.py cues.json --sfx-dir sfx/ --out result/film_sfx [--duck 6]
```

Requirements: Python 3.8+, `ffmpeg`/`ffprobe` in PATH, `numpy` (only for `sfx_mix.py`). No API key is needed:
anonymous Openverse calls allow up to 20 results per page (more returns HTTP 401; the script already uses 20).

## Workflow

### 1. Find the moments
Build `cues.json`, one entry per moment that deserves a sound, with the time (`t` in seconds or `frame`) and a `role`.
Get the moments from the best source available:
- the project itself: a Remotion/HyperFrames composition already knows its frames (click at frame 52, card pops at 104...);
- an edit decision list, markers or a timeline JSON;
- the picture: extract frames (`ffmpeg -ss T -i film.mp4 -frames:v 1`) around cuts and UI actions and read them.

Be selective. Professional launch films are dense in rhythm (about 5–6 onsets per second, mostly music) but have only
about 1.2–1.7 salient hits per second, and a sound on every cut is no better than chance. Sound the moments that
matter: a reveal, the logo, a key UI action (tap, publish, validate), a card landing. Most motion needs no sound when
the music carries it. Details and the measured numbers: `references/practice.md`.

### 2. Get the sounds
For each role you used, run `search` first, read the titles and durations, then `fetch` 2–4 takes per role. Several
takes let `sfx_mix.py` rotate them (round robin), because the same sample twice in a row sounds mechanical.
Search in English: the index is mostly English. Useful words: `ui click`, `soft pop`, `mouse click`, `keyboard typing`,
`whoosh`, `swipe`, `impact`, `riser`, `notification`, `chime`, `camera shutter`, `paper`, plus nature (`birds`,
`rainforest`, `frog`, `stream`). Avoid results whose title says music, loop, pack or voice when you want a one-shot.

**When downloads fail.** Some public servers refuse requests from cloud/datacenter networks: Freesound's CDN answers
HTTP 403, and Wikimedia may answer 429. That is the server's policy, not a licence problem. Do not try to disguise the
request. Instead:
- run `fetch` from the person's own computer;
- try another source (`--source wikimedia_audio`, `--source jamendo`);
- or download by hand from the `landing` links that `search` prints, then import with `add`.

The script stops hitting a host after it refuses once and prints this advice.

### 3. Place and mix
`sfx_mix.py` aligns each sound by role. Alignment, offset and level are starting values measured on professional
launch films; tune them by looking at the result.

| role | aligned on | offset | why |
|---|---|---|---|
| tap, click, chime, bell | onset | lead by 11–60 ms | contact sounds feel right slightly before the visual hit |
| pop, key, shutter | onset | +4 to +9 ms | lands with the element |
| land | onset | +30 ms | the thump after the object arrives |
| whoosh / swipe | **peak** | +37 ms | the loudest point of the whoosh lands just after the cut |
| riser | **peak** | −23 ms | builds into the cut |
| hit, drop, impact | onset | 0 | on the cut |
| ambience, birds | onset | 0, −24 to −26 dB | a bed under everything |

It also skips a sound that comes too soon after another of the same role (minimum gaps per role), never repeats the
same take twice in a row, limits the SFX stem to −1 dBFS, and mixes it with the film's own audio. Music and voice
stay. `--duck 6` dips the original audio under heavy hits. Output: `<out>_sfx_stem.wav` (import it into DaVinci or
Premiere as its own track), `<out>.mp4` (mixed, loudness-normalised toward −14 LUFS with true peak ≤ −1 dBTP) and
`<out>_resolved.json` (where every sound went, warnings, measured loudness).

### 4. Check, then hand over
- Read `_resolved.json`: warnings (skipped moments, missing roles), the loudness, the placements.
- Look at frames at the placed times if sync matters.
- **Do not double.** If the video already has synthesized or baked-in clicks, mute that track in the editor or ask for
  a render without it. Otherwise the person hears two clicks.
- A film whose only sound is SFX will measure well below −14 LUFS. That is fine. The −14 target is for music-led films.
- Tell the person what to listen to: the 3–5 most important moments, with their timecodes.
- Deliver `CREDITS.md` and say whether attribution is required (any BY / BY-SA file means yes). Paste the lines into
  the video description or end credits.

## Output summary to give the person
- Where the stem, the mixed video and the credits are.
- A table of the moments that got a sound (time, role, file, licence).
- The moments left quiet and why.
- What was measured (loudness, true peak) and what still needs ears.

## Credits for the method
The role offsets, levels and "sparse accents over a music bed" rules adapt measurements published by **earshot**
(github.com/Leonxlnx/earshot, `docs/launch-video-sound.md`, `forge/kits/launch.json`). The "never synthesize, never
claim you heard it, keep music and voice, deliver a separate WAV, do not double" principles come from **Clipwing's
real-sfx skill** (github.com/Clipwing/skills). This skill swaps their local libraries for openly licensed sounds from
Openverse.
