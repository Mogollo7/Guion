# Sound for motion graphics: what professionals do (numbers to aim at)

Read this when you plan which moments get a sound, how loud, and how to check the result.

## Measured on 7 professional launch films (earshot, docs/launch-video-sound.md)
- **Music leads.** Music runs under 89–100 % of the film in 6 of 7 films. Tempo 108–136 BPM (median 123). Pick the
  track first and cut the picture to it.
- **Loud, steady body.** Median −14.8 LUFS integrated. The loudest 3 s sit only ~2.3 LU above the integrated level.
- **Start at once.** First sound within 0.04–0.48 s. No silent cold open.
- **Land the ending.** The last 3 s reach body level, with short fades (median 0.27 s) and almost no dead air.
- **Dense rhythm, few accents.** 2.5–8.2 onsets/s, but only ~1.2–1.7 salient hits/s.
- **Not a hit on every cut.** Sound on visual events is no better than chance in most references. Accents go on the
  moments that matter: reveal, logo, key UI action.
- **Master for the web.** −14 LUFS integrated, true peak ≤ −1 dBTP. Six of seven references clip after AAC decoding.
  Do not copy that.

## Design rules for each sound (earshot docs/motion-sfx-techniques.md)
- A pro effect is 2–4 layers peaking together (transient, body, sub, tail). With recordings, pick sounds that already
  have weight, or stack a short click on a soft thump.
- The file starts on the first sample of the transient: no leading silence. `openverse_sfx.py` trims it.
- Pops last 0.19–0.41 s, with little below 150 Hz or above 4 kHz. UI ticks are short and airy.
- Durations follow the move: a quick UI swipe 0.25–0.5 s, a title reveal ~0.48 s, a general whoosh ~0.8 s.
- Bigger means lower and slower. Pitching down makes a sound heavier.
- One palette: UI sounds from one family. Repeated sounds need 2–4 takes. Typing never repeats a take twice in a row.
- Tonal sounds (chimes, bells) should sit in the music's key when there is music.

## Placement (earshot `launch` kit, measured offsets)
| role | align | offset | level vs bed | min gap |
|---|---|---|---|---|
| tick | onset | 0 ms | +3 dB | 66 ms |
| tap (light land) | onset | −60 ms | +3 dB | 115 ms |
| click | onset | −11 ms | +6.5 dB | 85 ms |
| pop | onset | +4 ms | +8.5 dB | 114 ms |
| land | onset | +30 ms | +8 dB | 159 ms |
| whoosh short | peak | +37 ms | +9 dB | — |
| whoosh long | peak | +3 ms | +8.5 dB | — |
| riser | peak | −23 ms | +8 dB | — |
| reverse swell | peak | +42 ms | +9.5 dB | at most one per film |
| hit / drop | onset | 0 | +7–7.5 dB | — |
| key | onset | +8 ms | +6.5 dB | 87 ms |
| bell / chime | onset | −20 ms | +7.5 dB | 110 ms |
| shutter (snap zoom) | onset | +9 ms | +4 dB | 66 ms |

Before a big hit, the music often steps down 6–12 dB for 0.3–0.5 s and comes back on the hit. `sfx_mix.py --duck`
does a simple version of this.

## Principles from Clipwing real-sfx
- Never synthesize. If nothing fits, leave the moment quiet and report it.
- You cannot hear. Report what was measured and what the person must listen to.
- Keep the film's music and voice. Always deliver a separate SFX WAV as well as the mixed video.
- Do not double. Remove synthesized sound baked into the render before adding real sounds.
- Do not modify the person's project files. Write to your own `work/` and `result/` folders.

## Licences (Openverse codes)
| code | meaning | use in a video |
|---|---|---|
| `cc0`, `pdm` | public domain | free, credit optional |
| `by` | attribution | credit author + licence + link |
| `by-sa` | attribution, share-alike | credit; the video should carry a compatible licence (e.g. CC BY-SA / BY-NC-SA) |
| `by-nc*` | non-commercial | only non-commercial projects |
| `*-nd` | no derivatives | avoid when trimming or processing |
| `sampling+` | legacy sampling licence | read the terms first |
