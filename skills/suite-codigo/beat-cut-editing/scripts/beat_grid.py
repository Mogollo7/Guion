#!/usr/bin/env python3
"""
Grilla de beats de una pista de música (o del audio de un video), sin librerías de audio especiales.

  python beat_grid.py music.mp3 --fps 30 --out beats.json
  python beat_grid.py film.mp4 --fps 30 --out beats.json --bpm-range 90 150

Salida: BPM, fase del primer beat, beats (s y cuadros), compases (cada 4 beats, el "1" es el beat con más golpe grave),
y cuántos beats coinciden con un golpe real (confianza). Requiere ffmpeg y numpy.
Método: envolvente de "spectral flux" en bandas, autocorrelación para el tempo, peine de fase para el primer beat,
y el grave (< 150 Hz) para elegir el tiempo fuerte del compás.
"""
import argparse
import json
import subprocess

import numpy as np

SR = 22050
HOP = 256


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def stft_mag(x, n=1024):
    win = np.hanning(n).astype(np.float32)
    frames = 1 + (len(x) - n) // HOP
    idx = np.arange(n)[None, :] + HOP * np.arange(frames)[:, None]
    return np.abs(np.fft.rfft(x[idx] * win, axis=1))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('audio')
    ap.add_argument('--fps', type=float, default=30)
    ap.add_argument('--out')
    ap.add_argument('--bpm-range', type=float, nargs=2, default=(80, 160))
    ap.add_argument('--start', type=float, default=0, help='analizar desde este segundo')
    ap.add_argument('--dur', type=float, default=90, help='segundos a analizar para el tempo (la grilla se extiende a toda la pista)')
    a = ap.parse_args()

    x = decode(a.audio)
    total = len(x) / SR
    seg = x[int(a.start * SR): int((a.start + a.dur) * SR)]
    S = np.log1p(stft_mag(seg) * 10)
    freqs = np.fft.rfftfreq(1024, 1 / SR)
    flux = np.maximum(0, np.diff(S, axis=0))
    onset = flux.sum(axis=1)
    low = flux[:, freqs < 150].sum(axis=1)
    onset = (onset - onset.mean()) / (onset.std() + 1e-9)
    fr = SR / HOP  # cuadros de envolvente por segundo

    # tempo por autocorrelación, con preferencia suave alrededor de 120 BPM
    ac = np.correlate(onset, onset, mode='full')[len(onset) - 1:]
    lo, hi = a.bpm_range
    lags = np.arange(int(fr * 60 / hi), int(fr * 60 / lo) + 1)
    bpms = 60 * fr / lags
    weight = np.exp(-0.5 * (np.log2(bpms / 120) / 0.9) ** 2)
    best = lags[np.argmax(ac[lags] * weight)]
    # refinar con interpolación parabólica
    y0, y1, y2 = ac[best - 1], ac[best], ac[best + 1]
    delta = 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2 + 1e-9)
    period = (best + delta) / fr
    bpm = 60 / period

    # fase: peine de impulsos sobre la envolvente
    phases = np.linspace(0, period, 120, endpoint=False)
    t_env = np.arange(len(onset)) / fr
    def comb(ph):
        ts = np.arange(ph, t_env[-1], period)
        return onset[np.clip((ts * fr).astype(int), 0, len(onset) - 1)].mean()
    scores = [comb(p) for p in phases]
    # +n/2: cada cuadro de la STFT está centrado media ventana después de su inicio
    phase = phases[int(np.argmax(scores))] + a.start + 512 / SR

    beats = np.arange(phase, total, period)
    beats = beats[beats >= 0]
    # tiempo fuerte (1 del compás): el desfase 0..3 con más energía grave
    lowz = (low - low.mean()) / (low.std() + 1e-9)
    def low_at(ts):
        i = ((ts - a.start) * fr).astype(int)
        i = i[(i >= 0) & (i < len(lowz))]
        return lowz[i].mean() if len(i) else -9
    down = int(np.argmax([low_at(beats[k::4]) for k in range(4)]))
    bars = beats[down::4]
    # confianza: proporción de beats con un pico de onset cerca (±40 ms)
    hits = 0
    for b in beats[(beats > a.start) & (beats < a.start + len(onset) / fr)]:
        i = int((b - a.start) * fr)
        w = onset[max(0, i - 3): i + 4]
        hits += int(len(w) and w.max() > 0.5)
    n_checked = int(((beats > a.start) & (beats < a.start + len(onset) / fr)).sum())
    conf = hits / max(1, n_checked)

    res = {'audio': a.audio, 'duration_s': round(total, 3), 'bpm': round(bpm, 2), 'beat_s': round(period, 4),
           'beat_frames': round(period * a.fps, 3), 'bar_frames': round(4 * period * a.fps, 3), 'fps': a.fps,
           'first_beat_s': round(float(beats[0]), 3), 'first_downbeat_s': round(float(bars[0]), 3),
           'confidence': round(conf, 2), 'usable': conf >= 0.5,
           'beats_s': [round(float(b), 3) for b in beats], 'bars_s': [round(float(b), 3) for b in bars],
           'beats_frame': [int(round(b * a.fps)) for b in beats], 'bars_frame': [int(round(b * a.fps)) for b in bars]}
    print(f"BPM {res['bpm']}  ·  beat = {res['beat_s']} s = {res['beat_frames']} cuadros  ·  compás = {res['bar_frames']} cuadros")
    print(f"primer beat {res['first_beat_s']} s · primer tiempo fuerte {res['first_downbeat_s']} s · confianza {res['confidence']} ({'usable' if res['usable'] else 'NO confiable: revisa a mano'})")
    if a.out:
        json.dump(res, open(a.out, 'w'), indent=1)
        print('→', a.out)


if __name__ == '__main__':
    main()
