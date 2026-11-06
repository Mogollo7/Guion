#!/usr/bin/env python3
"""
Coloca efectos de sonido en los momentos del video y entrega:
  <out>_sfx_stem.wav    pista SOLO de efectos (48 kHz estéreo), para importar al editor
  <out>.mp4             el video con la mezcla (audio original + efectos), a -14 LUFS y pico real <= -1 dBTP
  <out>_resolved.json   dónde quedó cada sonido (inicio, pico, archivo, nivel) y avisos

  python sfx_mix.py cues.json --sfx-dir sfx/ --out result/film_sfx
  python sfx_mix.py cues.json --sfx-dir sfx/ --out result/film_sfx --plan     # solo muestra el plan

cues.json:
  {"video": "film.mp4", "fps": 30,
   "cues": [{"t": 1.20, "role": "pop"}, {"frame": 96, "role": "whoosh", "gain_db": -2},
            {"t": 4.0, "role": "ding", "file": "ding_01.wav"}]}

Alineación por rol (valores de partida tomados de películas de lanzamiento profesionales, earshot `launch` kit):
los toques/clics se adelantan unos ms al evento, el PICO del whoosh cae ~37 ms después del corte, etc.
Requiere ffmpeg y numpy.
"""
import argparse
import json
import os
import re
import subprocess
import sys

import numpy as np

SR = 48000
# rol: (alinear 'onset'|'peak', desfase_ms, nivel_db relativo a pico -1 dBFS, separación mínima ms)
ROLES = {
    'tick': ('onset', 0, -14, 66), 'click': ('onset', -11, -8, 85), 'tap': ('onset', -60, -12, 115),
    'key': ('onset', 8, -10, 87), 'pop': ('onset', 4, -9, 114), 'land': ('onset', 30, -7, 159),
    'whoosh': ('peak', 37, -8, 200), 'swoosh': ('peak', 37, -8, 200), 'swipe': ('peak', 37, -9, 200),
    'whoosh_long': ('peak', 3, -8, 400), 'hit': ('onset', 0, -7, 250), 'impact': ('onset', 0, -7, 250),
    'drop': ('onset', 0, -8, 250), 'riser': ('peak', -23, -6, 800), 'swell': ('peak', 42, -8, 800),
    'chime': ('onset', -20, -11, 110), 'bell': ('onset', -20, -11, 110), 'ding': ('onset', 0, -10, 110),
    'notification': ('onset', 0, -10, 200), 'shutter': ('onset', 9, -9, 66), 'thud': ('onset', 0, -8, 150),
    'ambience': ('onset', 0, -26, 0), 'birds': ('onset', 0, -24, 0),
}


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()


def env_peak(x):
    mono = np.abs(x).mean(axis=1)
    win = max(1, int(0.01 * SR))
    env = np.convolve(mono, np.ones(win) / win, mode='same')
    return int(np.argmax(env))


def onset(x, thr_db=-40):
    mono = np.abs(x).mean(axis=1)
    thr = (10 ** (thr_db / 20)) * max(1e-9, mono.max())
    idx = np.nonzero(mono > thr)[0]
    return int(idx[0]) if len(idx) else 0


def media_duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout
    return float(out.strip() or 0)


def has_audio(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout
    return bool(out.strip())


def loudness(path):
    err = subprocess.run(['ffmpeg', '-v', 'info', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    i = re.findall(r'I:\s+(-?[\d.]+) LUFS', err)
    tp = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', err)
    return (float(i[-1]) if i else None), (float(tp[-1]) if tp else None)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cues')
    ap.add_argument('--sfx-dir', default='sfx')
    ap.add_argument('--out', default='result/film_sfx')
    ap.add_argument('--plan', action='store_true')
    ap.add_argument('--target-lufs', type=float, default=-14.0)
    ap.add_argument('--sfx-gain', type=float, default=0.0, help='dB extra para toda la pista de efectos')
    ap.add_argument('--duck', type=float, default=0.0, help='dB que baja el audio original bajo cada golpe fuerte (hit/drop/whoosh_long)')
    a = ap.parse_args()

    spec = json.load(open(a.cues, encoding='utf-8'))
    base = os.path.dirname(os.path.abspath(a.cues))
    video = spec.get('video')
    if video and not os.path.isabs(video):
        video = os.path.join(base, video)
    fps = float(spec.get('fps', 30))
    dur = media_duration(video) if video else max(c.get('t', c.get('frame', 0) / fps) for c in spec['cues']) + 3
    pool = {}
    for f in sorted(os.listdir(a.sfx_dir)):
        if f.lower().endswith('.wav'):
            pool.setdefault(f.rsplit('_', 1)[0], []).append(f)

    stem = np.zeros((int(dur * SR) + SR, 2), dtype=np.float32)
    resolved, warnings, last_at, last_file, rr = [], [], {}, {}, {}
    cache = {}
    for i, c in enumerate(sorted(spec['cues'], key=lambda c: c.get('t', c.get('frame', 0) / fps))):
        t = c['t'] if 't' in c else c['frame'] / fps
        role = c.get('role', 'pop')
        align, off_ms, lvl, gap = ROLES.get(role, ('onset', 0, -9, 100))
        if 'offset_ms' in c:
            off_ms = c['offset_ms']
        if last_at.get(role) is not None and (t - last_at[role]) * 1000 < gap:
            warnings.append(f'{t:.2f}s {role}: a {int((t - last_at[role]) * 1000)} ms del anterior (mín. {gap} ms); se omite para no amontonar')
            continue
        f = c.get('file')
        if not f:
            cands = pool.get(role) or pool.get(role.split('_')[0]) or []
            if not cands:
                warnings.append(f'{t:.2f}s {role}: no hay archivos {role}_NN.wav en {a.sfx_dir}; el momento queda en silencio')
                continue
            k = rr.get(role, 0)
            f = cands[k % len(cands)]
            if len(cands) > 1 and f == last_file.get(role):
                f = cands[(k + 1) % len(cands)]
            rr[role] = k + 1
        path = f if os.path.isabs(f) else os.path.join(a.sfx_dir, f)
        if path not in cache:
            cache[path] = decode(path)
        x = cache[path]
        anchor = env_peak(x) if align == 'peak' else onset(x)
        start = int(round((t + off_ms / 1000.0) * SR)) - anchor
        gain_db = lvl + c.get('gain_db', 0.0) + a.sfx_gain
        g = 10 ** (gain_db / 20)
        if start < 0:
            x = x[-start:]
            start = 0
        end = min(len(stem), start + len(x))
        stem[start:end] += x[: end - start] * g
        last_at[role], last_file[role] = t, f
        resolved.append({'t': round(t, 3), 'frame': round(t * fps), 'role': role, 'file': os.path.basename(path), 'align': align,
                         'offset_ms': off_ms, 'placed_start_s': round(start / SR, 3), 'anchor_s': round((start + anchor) / SR, 3), 'gain_db': round(gain_db, 1)})

    os.makedirs(os.path.dirname(os.path.abspath(a.out)) or '.', exist_ok=True)
    if a.plan:
        for r in resolved:
            print(f"{r['t']:7.2f}s f{r['frame']:<5} {r['role']:<10} {r['file']:<18} {r['align']:<5} {r['offset_ms']:+4d} ms  {r['gain_db']:+5.1f} dB")
        for w in warnings:
            print('aviso:', w)
        return

    peak = float(np.abs(stem).max()) if len(stem) else 0.0
    if peak > 0.89:  # limitador sencillo: el stem no debe pasar de -1 dBFS
        stem *= 0.89 / peak
        warnings.append(f'la pista de efectos se bajó {20 * np.log10(0.89 / peak):.1f} dB para no saturar')
    stem = stem[: int(dur * SR)]
    stem_path = a.out + '_sfx_stem.wav'
    pcm = (np.clip(stem, -1, 1) * 32767).astype('<i2')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', stem_path], input=pcm.tobytes(), check=True)

    mp4 = None
    if video:
        mp4 = a.out + '.mp4'
        if has_audio(video):
            duck = ''
            if a.duck > 0:
                hits = [r for r in resolved if r['role'] in ('hit', 'drop', 'whoosh_long', 'impact')]
                if hits:
                    expr = '+'.join(f"between(t,{max(0, r['anchor_s'] - 0.05):.3f},{r['anchor_s'] + 0.35:.3f})" for r in hits)
                    duck = f",volume='if({expr},{10 ** (-a.duck / 20):.3f},1)':eval=frame"
            fc = f'[0:a]aresample={SR}{duck}[o];[1:a]aresample={SR}[s];[o][s]amix=inputs=2:normalize=0:duration=first[m];[m]loudnorm=I={a.target_lufs}:TP=-1:LRA=11[a]'
        else:
            fc = f'[1:a]aresample={SR},loudnorm=I={a.target_lufs}:TP=-1:LRA=11[a]'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-i', stem_path, '-filter_complex', fc, '-map', '0:v', '-map', '[a]',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', str(SR), mp4], check=True)
    lufs, tp = loudness(mp4) if mp4 else loudness(stem_path)
    report = {'video': video, 'stem': stem_path, 'mix': mp4, 'loudness_lufs': lufs, 'true_peak_dbfs': tp, 'placed': resolved, 'warnings': warnings,
              'listen_check': 'No se puede escuchar desde aquí: revisa con audífonos los momentos de la lista y que la voz se entienda.'}
    json.dump(report, open(a.out + '_resolved.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'✓ {len(resolved)} efectos colocados · {len(warnings)} avisos')
    print(f'  pista de efectos: {stem_path}')
    if mp4:
        print(f'  video mezclado:   {mp4}  ({lufs} LUFS, pico {tp} dBFS)')
    for w in warnings:
        print('  aviso:', w)


if __name__ == '__main__':
    main()
