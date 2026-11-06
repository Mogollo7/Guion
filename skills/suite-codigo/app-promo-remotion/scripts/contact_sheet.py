#!/usr/bin/env python3
"""Hoja de contacto para revisar un render sin verlo entero: cuadros en los segundos pedidos.
  python contact_sheet.py video.mp4 1 3.5 7 12 --out sheet.jpg [--cols 4 --width 480]
  python contact_sheet.py video.mp4 --every 2 --out sheet.jpg
"""
import argparse, os, subprocess, tempfile
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument('video'); ap.add_argument('times', nargs='*', type=float)
ap.add_argument('--every', type=float); ap.add_argument('--out', default='sheet.jpg')
ap.add_argument('--cols', type=int, default=4); ap.add_argument('--width', type=int, default=480)
a = ap.parse_args()
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.video], capture_output=True, text=True).stdout)
ts = a.times or [round(t * a.every, 2) for t in range(int(dur / (a.every or 2)) + 1)]
tmp = tempfile.mkdtemp()
ims = []
for t in ts:
    p = os.path.join(tmp, f'{t:08.2f}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(min(t, dur - 0.05)), '-i', a.video, '-frames:v', '1', '-vf', f'scale={a.width}:-2', p])
    if os.path.exists(p):
        im = Image.open(p).convert('RGB'); ImageDraw.Draw(im).text((6, 4), f'{t:.2f}s', fill='white', stroke_width=2, stroke_fill='black'); ims.append(im)
w, h = ims[0].size
rows = (len(ims) + a.cols - 1) // a.cols
sheet = Image.new('RGB', (w * min(a.cols, len(ims)), h * rows), 'white')
for i, im in enumerate(ims):
    sheet.paste(im, ((i % a.cols) * w, (i // a.cols) * h))
sheet.save(a.out, quality=85)
print('→', a.out, f'({len(ims)} cuadros)')
