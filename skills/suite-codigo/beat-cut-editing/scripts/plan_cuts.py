#!/usr/bin/env python3
"""
Del guion a la línea de tiempo: duración de cada plano por número de palabras, reparto cámara (A-roll) /
lámina (B-roll), cortes ajustados a los beats o compases de la música, subtítulos y marcadores.

  python plan_cuts.py plan.json --out edit/
  python plan_cuts.py plan.json --out edit/ --beats beats.json --snap bar

plan.json:
{
  "fps": 30, "wps": 2.9, "max_s": 180,
  "intro_s": 4, "outro_s": 8, "pause_s": 0.3,
  "live": {"first_share": 0.45, "other_share": 0.25, "min_s": 1.2, "max_s": 3.0},
  "segments": [
    {"id": "S1", "speaker": "Salomé", "text": "¿Cómo puede Antioquia ...?", "broll": "laminas/S1.mp4"},
    {"id": "S2", "speaker": "Salomé", "text": "...", "broll": "laminas/S2.mp4", "live_s": 2.0}
  ]
}
Salidas en --out: timeline.json, edit_map.md, markers.csv, subs_full.srt, subs_<speaker>.srt
"""
import argparse
import json
import math
import os
import re
import unicodedata


def words(t):
    return len(re.findall(r"\S+", t))


def chunks(text, maxw=8):
    w = text.split()
    n = max(1, math.ceil(len(w) / maxw))
    size = math.ceil(len(w) / n)
    return [' '.join(w[i:i + size]) for i in range(0, len(w), size)]


def tc(sec, fps, sep=':'):
    f = int(round(sec * fps))
    return f"{f // int(fps * 3600):02d}:{f // int(fps * 60) % 60:02d}:{f // int(fps) % 60:02d}{sep}{f % int(fps):02d}"


def srt_tc(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_') or 'x'


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('plan')
    ap.add_argument('--out', default='edit')
    ap.add_argument('--beats', help='salida de beat_grid.py para ajustar los cortes a la música')
    ap.add_argument('--snap', choices=['none', 'beat', 'bar'], default='beat')
    a = ap.parse_args()

    P = json.load(open(a.plan, encoding='utf-8'))
    fps = float(P.get('fps', 30))
    wps = float(P.get('wps', 2.9))
    pause = float(P.get('pause_s', 0.3))
    L = {'first_share': 0.45, 'other_share': 0.25, 'min_s': 1.2, 'max_s': 3.0, **P.get('live', {})}
    grid = []
    if a.beats and a.snap != 'none':
        B = json.load(open(a.beats))
        grid = B['bars_s'] if a.snap == 'bar' else B['beats_s']
        if not B.get('usable', True):
            print('aviso: la grilla de beats tiene baja confianza; los cortes se ajustan igual, pero revísalos')

    def snap_up(t):
        """Primer punto de la grilla >= t (solo se alarga la pausa, nunca se recorta el habla)."""
        if not grid:
            return t
        for g in grid:
            if g >= t - 1e-6:
                return g if g - t <= (grid[1] - grid[0]) * 1.01 else t
        return t

    t = float(P.get('intro_s', 0))
    segs, subs, prev, warn = [], [], None, []
    if t:
        segs.append({'type': 'intro', 'start': 0.0, 'dur': t})
    t = snap_up(t)
    for s in P['segments']:
        n = words(s['text'])
        speech = n / wps
        first = s['speaker'] != prev
        live = s.get('live_s') or min(L['max_s'] if not first else L['max_s'] * 2, max(L['min_s'], speech * (L['first_share'] if first else L['other_share'])))
        live = min(live, speech)
        start = t
        broll_start = start + live
        end = start + speech + pause
        nxt = snap_up(end)
        segs.append({'type': 'live', 'id': s['id'], 'speaker': s['speaker'], 'start': round(start, 3), 'dur': round(live, 3), 'lower_third': first})
        if s.get('broll') and speech - live > 0.4:
            segs.append({'type': 'broll', 'id': s['id'], 'file': s['broll'], 'start': round(broll_start, 3), 'dur': round(nxt - broll_start, 3)})
        else:
            segs[-1]['dur'] = round(nxt - start, 3)
        # subtítulos repartidos por palabras
        cs = chunks(s['text'])
        acc = start
        for c in cs:
            d = speech * words(c) / n
            subs.append({'start': acc, 'end': acc + d - 0.06, 'text': c, 'speaker': s['speaker'], 'id': s['id']})
            acc += d
        s['_speech'] = speech
        t, prev = nxt, s['speaker']
    out_s = float(P.get('outro_s', 0))
    if out_s:
        segs.append({'type': 'outro', 'start': round(t, 3), 'dur': out_s})
    total = t + out_s
    if P.get('max_s') and total > P['max_s']:
        warn.append(f"dura {total:.1f} s y el máximo es {P['max_s']} s: habla más rápido (wps), acorta pausas o recorta la cola del outro")

    os.makedirs(a.out, exist_ok=True)
    json.dump({'fps': fps, 'total_s': round(total, 3), 'total_frames': int(round(total * fps)), 'segments': segs,
               'subtitles': [{**x, 'start': round(x['start'], 3), 'end': round(x['end'], 3)} for x in subs], 'warnings': warn},
              open(os.path.join(a.out, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    with open(os.path.join(a.out, 'markers.csv'), 'w', encoding='utf-8') as fh:
        fh.write('timecode,seconds,frame,name,note\n')
        for g in segs:
            name = g.get('id', g['type']).upper() if g['type'] != 'broll' else g['id'] + ' B-roll'
            note = {'intro': 'intro', 'outro': 'outro', 'live': f"{g.get('speaker','')} a cámara" + (' + tercio inferior' if g.get('lower_third') else ''),
                    'broll': f"lámina {g.get('file','')}"}[g['type']]
            fh.write(f"{tc(g['start'], fps)},{g['start']:.3f},{int(round(g['start'] * fps))},{name},\"{note}\"\n")
    with open(os.path.join(a.out, 'subs_full.srt'), 'w', encoding='utf-8') as fh:
        for i, x in enumerate(subs, 1):
            fh.write(f"{i}\n{srt_tc(x['start'])} --> {srt_tc(x['end'])}\n{x['text']}\n\n")
    for sp in dict.fromkeys(x['speaker'] for x in subs):
        mine = [x for x in subs if x['speaker'] == sp]
        acc = 0.0
        with open(os.path.join(a.out, f'subs_{slug(sp)}.srt'), 'w', encoding='utf-8') as fh:
            for i, x in enumerate(mine, 1):
                d = x['end'] - x['start'] + 0.06
                fh.write(f"{i}\n{srt_tc(acc)} --> {srt_tc(acc + d - 0.06)}\n{x['text']}\n\n")
                acc += d
    with open(os.path.join(a.out, 'edit_map.md'), 'w', encoding='utf-8') as fh:
        fh.write(f"# Mapa de cortes ({total:.1f} s · {int(total // 60)}:{int(total % 60):02d})\n\n")
        fh.write('V1 = cámara (A-roll), V2 = lámina (B-roll). La voz sigue sonando desde V1 bajo la lámina (corte en J/L).\n')
        if grid:
            fh.write(f"Cortes ajustados al {'compás' if a.snap == 'bar' else 'beat'} de la música.\n")
        fh.write('\n| inicio | tipo | plano | quién / archivo | duración |\n|---|---|---|---|---|\n')
        for g in segs:
            who = g.get('speaker') or g.get('file') or ''
            fh.write(f"| {tc(g['start'], fps)} | {g['type']} | {g.get('id','')} | {who} | {g['dur']:.2f} s |\n")
        for w in warn:
            fh.write(f"\n**Aviso:** {w}\n")
    print(f"✓ {len([g for g in segs if g['type']=='live'])} planos · total {total:.1f} s ({int(total // 60)}:{int(total % 60):02d}) → {a.out}/")
    for w in warn:
        print('aviso:', w)


if __name__ == '__main__':
    main()
