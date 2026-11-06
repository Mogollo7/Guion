---
name: beat-cut-editing
description: >-
  Plans the cuts of a talking-head + motion-graphics video (pitch, explainer, class project, product demo) from
  its script and its music. Estimates each line's duration from word count, splits each shot into on-camera
  (A-roll) and graphics (B-roll) with J/L cuts so the voice keeps playing under the plate, snaps cut points to
  the beats or bars of the music track, checks the maximum duration, and exports an edit map, timeline JSON,
  marker CSV and SRT subtitles (full and per speaker). Includes a dependency-light beat tracker (BPM, beat and
  bar grid in seconds and frames, confidence). Use whenever someone asks how long their video will be, where to
  cut, how to fit a script into 3 minutes, how to sync cuts or animations to music, needs subtitles or markers
  from a script, says "cortes", "montaje", "timing", "a ritmo de la música", "en el beat", or is about to edit
  in DaVinci Resolve, Premiere, CapCut or Remotion from a written script.
---

# beat-cut-editing: from script and music to a cut list

A good short video is cut to two clocks: **the voice**, whose lines take the time they take, and **the music**, whose
beats and bars make cuts feel intentional. This skill turns a script (and optionally a music track) into a timeline
that respects both, then exports what an editor needs.

## Tools (in `scripts/`)

```bash
# music grid: BPM, beats and bars (seconds and frames), confidence
python scripts/beat_grid.py music.mp3 --fps 30 --out beats.json
# script -> timeline, edit map, markers, subtitles (cuts snapped to the beat or the bar)
python scripts/plan_cuts.py plan.json --out edit/ --beats beats.json --snap bar
```
Requirements: Python 3.8+, `ffmpeg`, `numpy`. `plan_cuts.py` uses only the standard library.

`plan.json` (see the docstring of `plan_cuts.py` for every field):
```json
{"fps": 30, "wps": 2.9, "max_s": 180, "intro_s": 4, "outro_s": 8, "pause_s": 0.3,
 "segments": [{"id": "S1", "speaker": "Ana", "text": "the exact words she will say", "broll": "plates/S1.mp4"}]}
```

## Workflow

1. **Get the exact words.** Duration comes from words, so use the final script, not a summary. One segment is one
   shot or one breath (one or two sentences), with an id (`S1`, `D2`...) and a speaker.
2. **Pick the speaking rate.** 2.6 words/s is calm Spanish or English narration. 2.9 is lively presenting. 3.2 is fast
   but still clear. If the video must fit a hard limit (e.g. 3:00), compute at 2.6 to find the worst case. If it does
   not fit, recommend speaking faster or trimming lines, and say which lines carry the least.
3. **Analyse the music** with `beat_grid.py`. Read the confidence:
   - Below 0.5, the grid did not lock (ambient, rubato, speech-heavy audio). Do not snap; cut on phrases instead.
   - Check `bpm`: double or half tempo errors happen. A 60 or 240 BPM pop track is probably 120.
4. **Plan** with `plan_cuts.py`:
   - `--snap beat` for most edits.
   - `--snap bar` for big section changes when there is slack, because it adds more silence.
   - Snapping only lengthens the pause after a line. It never cuts speech.
5. **Read the result and fix by hand.** `edit_map.md` lists every cut. Typical adjustments:
   - Give a speaker more on-camera time on their first line, so the audience meets them. This is a rule the
     assignment may require, e.g. "everyone must appear on camera".
   - Make the B-roll start later when the line names something on screen.
   - A plate whose animation needs N seconds should get at least N seconds. Shorten the A-roll, not the animation.
6. **Hand over** the files: `timeline.json` (for Remotion or scripts), `markers.csv` (timecodes to place markers or
   follow along), `subs_full.srt` and `subs_<speaker>.srt`. Per-speaker files start at 0, so they can be dropped at the
   start of that person's clip and nudged.

## Editing rules worth explaining to the person
- **J/L cuts.** The voice continues from the on-camera clip while the graphic covers the picture. The audience hears a
  person and sees evidence. Cut the picture, not the sentence.
- **Cut on the beat, accent on the bar.** Section changes, reveals and the logo land on downbeats. Small cuts can land
  on any beat. A hit on every cut is too much: the music already carries rhythm.
- **Readable text.** Any line meant to be read stays fully on screen for about 0.3 s per word after it finishes
  animating in.
- **Music edits happen on bar lines.** To shorten a track, remove whole bars from the middle and keep its real ending.
  Never fade out in the middle of a phrase.
- **Start at once, land the ending.** No silent cold open. The last seconds should still have energy, with a short fade.
- **Lower thirds** go on the first appearance of each speaker for 3–4 s.

More detail and the reasoning behind the numbers: `references/editing.md`.

## What to tell the person
- Total duration at the chosen rate and the worst case at 2.6 words/s.
- Whether it fits the limit, and what to cut if not.
- The beat grid (BPM, beat length in frames) and its confidence.
- Where the files are, plus 2–3 adjustments you recommend after reading the map.
