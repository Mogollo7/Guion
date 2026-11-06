#!/usr/bin/env python3
"""Califica las corridas de una iteración (con y sin skill) para los 3 casos medibles.
Escribe grading.json (campos text/passed/evidence) en cada carpeta de corrida.
  python grade_iteration.py <N>"""
import glob, json, os, re, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = sys.argv[1] if len(sys.argv) > 1 else '1'


def read_all_text(d, exts=('.md', '.txt', '.srt', '.csv', '.json')):
    out = ''
    for p in glob.glob(os.path.join(d, '**', '*'), recursive=True):
        if os.path.isfile(p) and p.lower().endswith(exts) and os.path.getsize(p) < 2_000_000:
            out += '\n' + open(p, encoding='utf-8', errors='replace').read()
    return out


def answer(d):
    p = os.path.join(d, 'final_answer.md')
    return open(p, encoding='utf-8', errors='replace').read() if os.path.exists(p) else ''


def decode(path, sr=48000):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def onsets(x, sr=48000):
    env = np.convolve(np.abs(x), np.ones(96) / 96, mode='same')
    thr = max(1e-4, env.max() * 0.03)
    above = env > thr
    starts = np.nonzero(above & ~np.r_[False, above[:-1]])[0]
    return [round(s / sr, 3) for s in starts]


def ex(text, passed, evidence):
    return {'text': text, 'passed': bool(passed), 'evidence': evidence}


def grade_beat(d, beats):
    a = answer(d); allt = a + read_all_text(d)
    res = []
    bpm = [float(x) for x in re.findall(r'(\d{2,3}(?:[.,]\d+)?)\s*BPM', allt, re.I)]
    res.append(ex('The answer states the music tempo between 115 and 125 BPM', any(115 <= b <= 125 for b in bpm), f'BPM mencionados: {bpm[:5]}'))
    durs = re.findall(r'\b([0-2]):([0-5]\d)\b', a)
    secs = sorted({int(m) * 60 + int(s) for m, s in durs})
    worst = re.search(r'peor|worst|lento|2[.,]6', a, re.I)
    res.append(ex('The answer states a total duration at a normal rate and a worst-case duration at a slower rate, both under 3:00', len(secs) >= 2 and worst and all(s <= 180 for s in secs[:4]), f'duraciones m:ss en la respuesta: {secs[:6]}; menciona peor caso: {bool(worst)}'))
    srts = [os.path.basename(p).lower() for p in glob.glob(os.path.join(d, '**', '*.srt'), recursive=True)]
    names = ['laura', 'andres', 'camila']
    have = [n for n in names if any(n in s.replace('é', 'e') for s in srts)]
    res.append(ex('The edit folder contains one SRT subtitle file for each speaker (Laura, Andrés, Camila)', len(have) == 3, f'SRT: {srts}'))
    plan = read_all_text(d, ('.md', '.csv', '.json'))
    lines = ['Cada año perdemos', 'Cuando por fin llegan', 'Por eso creamos', 'Un modelo de inteligencia', 'Así cada foto se suma', 'En el prototipo', 'Las alcaldías', 'Nuestra meta']
    cov = sum(1 for l in lines if l.lower() in plan.lower())
    tl = glob.glob(os.path.join(d, '**', 'timeline.json'), recursive=True)
    nseg = 0
    if tl:
        try:
            nseg = len([s for s in json.load(open(tl[0]))['segments'] if s.get('type') == 'live'])
        except Exception:
            pass
    res.append(ex('The edit plan lists all nine script lines with a start time and whether it is on camera or an animation', nseg >= 9 or cov >= 8, f'segmentos a cámara en timeline.json: {nseg}; frases del guion encontradas en el plan: {cov}/8'))
    # cortes en la grilla
    starts = []
    for p in glob.glob(os.path.join(d, '**', '*.json'), recursive=True):
        try:
            j = json.load(open(p))
        except Exception:
            continue
        segs = j.get('segments') if isinstance(j, dict) else None
        if isinstance(segs, list):
            for s in segs:
                if isinstance(s, dict):
                    for k in ('start', 'start_s', 'inicio', 'in'):
                        if isinstance(s.get(k), (int, float)):
                            starts.append(float(s[k]))
    if not starts:
        for p in glob.glob(os.path.join(d, '**', '*.csv'), recursive=True):
            for row in open(p, encoding='utf-8', errors='replace').read().splitlines()[1:]:
                m = re.search(r'(\d+:\d{2}:\d{2}[:;.]\d{2})', row)
                if m:
                    h, mi, se, fr = re.split(r'[:;.]', m.group(1))
                    starts.append(int(h) * 3600 + int(mi) * 60 + int(se) + int(fr) / 30)
    starts = sorted(set(round(s, 3) for s in starts if s > 0.5))
    if starts:
        dist = [min(abs(s - b) for b in beats) for s in starts]
        ok = sum(1 for x in dist if x <= 0.04)
        res.append(ex('Cut points after the intro fall within 40 ms of a beat of musica.mp3', ok / len(dist) >= 0.8, f'{ok}/{len(dist)} cortes a ≤40 ms de un beat (beats cada ~0.5 s)'))
    else:
        res.append(ex('Cut points after the intro fall within 40 ms of a beat of musica.mp3', False, 'no se encontraron tiempos de corte legibles (timeline JSON o CSV con timecodes)'))
    return res


def grade_sfx(d):
    a = answer(d); res = []
    mp4s = [p for p in glob.glob(os.path.join(d, '**', '*.mp4'), recursive=True) if os.path.basename(p) != 'clip.mp4']
    with_audio = []
    for p in mp4s:
        o = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout
        if 'video' in o and 'audio' in o:
            with_audio.append(p)
    res.append(ex('A mixed MP4 with a video stream and an audio stream exists', bool(with_audio), f'{[os.path.basename(p) for p in with_audio]}'))
    wavs = [p for p in glob.glob(os.path.join(d, '**', '*.wav'), recursive=True) if 'sfx_raw' not in p]
    stems = [p for p in wavs if 4.0 <= float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout or 0) <= 8.0]
    res.append(ex('A separate WAV file containing only the sound effects exists', bool(stems), f'WAV de 4–8 s: {[os.path.relpath(p, d) for p in stems]}'))
    cred = [p for p in glob.glob(os.path.join(d, '**', '*'), recursive=True) if re.search(r'cr[eé]dit|credit|attribution|licen', os.path.basename(p), re.I) and 'sfx_raw' not in p and os.path.isfile(p)]
    ctext = ''.join(open(p, encoding='utf-8', errors='replace').read() for p in cred)
    res.append(ex('A credits file lists every sound used with its author and licence', bool(cred) and re.search(r'kenney', ctext, re.I) and re.search(r'cc0|dominio p', ctext, re.I), f'archivos: {[os.path.relpath(p, d) for p in cred]}'))
    on = onsets(decode(stems[0])) if stems else []
    for txt, lo, hi in [('A sound starts between 0.92 s and 1.02 s (the tap, slightly before 1.0 s)', 0.92, 1.02), ('A sound starts between 2.40 s and 2.60 s (the card)', 2.40, 2.60), ('A sound starts between 3.90 s and 4.08 s (the check)', 3.90, 4.08)]:
        hit = [t for t in on if lo <= t <= hi]
        res.append(ex(txt, bool(hit), f'inicios detectados en la pista de efectos: {on[:12]}'))
    claim = re.search(r'\b(escuch[ée]|lo o[ií]|suena (muy )?bien|i listened|sounds great)\b', a, re.I)
    res.append(ex('The answer does not claim to have listened to or heard the result', not claim, f'frase encontrada: {claim.group(0) if claim else "ninguna"}'))
    return res


def grade_comp(d):
    a = answer(d); res = []
    p = os.path.join(d, 'ana_lower_third.comp')
    s = open(p, encoding='utf-8', errors='replace').read() if os.path.exists(p) else ''
    def node(name):
        m = re.search(r'\n\t\t' + name + r' = \w+ \{', s)
        if not m:
            return ''
        e = s.find('\n\t\t},', m.end())
        return s[m.start():e]
    name, role, bar = node('Name'), node('Role'), node('Bar')
    res.append(ex('ana_lower_third.comp contains the text Ana Gómez in the name node', 'Ana Gómez' in name, 'nodo Name: ' + (re.search(r'StyledText = Input \{ Value = "([^"]*)"', name).group(1) if re.search(r'StyledText = Input \{ Value = "([^"]*)"', name) else 'no encontrado')))
    rt = re.search(r'StyledText = Input \{ Value = "([^"]*)"', role)
    res.append(ex('ana_lower_third.comp contains the text Investigadora · Universidad de Antioquia in the role node', bool(rt) and 'Investigadora' in rt.group(1) and 'Antioquia' in rt.group(1), 'nodo Role: ' + (rt.group(1) if rt else 'no encontrado')))
    fonts = re.findall(r'Font = Input \{ Value = "([^"]*)"', name + role)
    res.append(ex('Both text nodes use the font Manrope', len(fonts) == 2 and all(f == 'Manrope' for f in fonts), f'fuentes: {fonts}'))
    vals = [re.search(k + r' = Input \{ Value = ([\d.e-]+)', bar) for k in ('TopLeftRed', 'TopLeftGreen', 'TopLeftBlue')]
    rgb = [float(v.group(1)) if v else -1 for v in vals]
    res.append(ex('The bar colour is #6cae4c (RGB about 0.4235, 0.6824, 0.2980)', all(abs(x - y) < 0.01 for x, y in zip(rgb, (0.4235, 0.6824, 0.2980))), f'RGB: {rgb}'))
    res.append(ex('The composition is otherwise intact: balanced braces and the Merge and MediaOut nodes still present', bool(s) and s.count('{') == s.count('}') and 'Merge1 = Merge' in s and 'MediaOut1 = MediaOut' in s, f'llaves {s.count("{")}/{s.count("}")}'))
    res.append(ex('The answer explains adding a Fusion Composition clip and importing the .comp from the Fusion page', bool(re.search(r'Fusion Composition', a)) and bool(re.search(r'Import', a, re.I)), 'menciona "Fusion Composition" e "Import" en la respuesta' if re.search(r'Fusion Composition', a) else 'no lo menciona'))
    return res


def main():
    sys.path.insert(0, os.path.join(ROOT, 'beat-cut-editing', 'scripts'))
    music = os.path.join(ROOT, 'beat-cut-editing', 'evals', 'fits-three-minutes-with-music', 'files', 'musica.mp3')
    bj = '/tmp/_beats_eval.json'
    subprocess.run([sys.executable, os.path.join(ROOT, 'beat-cut-editing', 'scripts', 'beat_grid.py'), music, '--out', bj], capture_output=True)
    beats = json.load(open(bj))['beats_s']
    jobs = [('beat-cut-editing', 'fits-three-minutes-with-music', lambda d: grade_beat(d, beats)),
            ('openverse-sfx', 'place-ui-sounds-on-clip', grade_sfx),
            ('davinci-handoff', 'brand-lower-third-comp', grade_comp)]
    for sk, case, fn in jobs:
        for cfg in ('with_skill', 'without_skill'):
            run = os.path.join(ROOT, f'{sk}-workspace', f'iteration-{N}', case, cfg)
            out = os.path.join(run, 'outputs')
            if not os.path.isdir(out):
                continue
            exps = fn(out)
            passed = sum(e['passed'] for e in exps)
            g = {'expectations': exps, 'summary': {'passed': passed, 'failed': len(exps) - passed, 'total': len(exps), 'pass_rate': round(passed / len(exps), 3)}}
            json.dump(g, open(os.path.join(run, 'grading.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            print(f'{sk:<18} {case:<32} {cfg:<14} {passed}/{len(exps)}')
            for e in exps:
                print(f"   {'✓' if e['passed'] else '✗'} {e['text'][:70]} — {e['evidence'][:110]}")


if __name__ == '__main__':
    main()
