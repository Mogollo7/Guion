"""Construye la línea de tiempo del animatic, los subtítulos SRT y los marcadores para DaVinci Resolve.
Uso: python3 scripts/build-timeline.py   (lee src/data/guion.json)
Salidas: src/data/timeline.json, ../entregables/subtitulos/*.srt, ../entregables/montaje/marcadores.csv, edl"""
import json, math, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(os.path.dirname(ROOT), 'entregables')
FPS = 30
g = json.load(open(os.path.join(ROOT, 'src/data/guion.json'), encoding='utf-8'))
WPS = g['wordsPerSec']
INTRO, OUTRO, PAUSE = 240, 270, 9  # intro = Tremi saluda + logo (App Promo)
PLATE_MIN = {'M5': 120}

def chunks(text, maxw=8):
    w = text.split()
    n = math.ceil(len(w) / maxw)
    size = math.ceil(len(w) / n)
    return [' '.join(w[i:i + size]) for i in range(0, len(w), size)]

segs, subs, markers = [], [], []
t = 0
segs.append({'type': 'intro', 'from': t, 'dur': INTRO}); markers.append((t, 'INTRO', 'Tremi saluda + isologo')); t += INTRO
prev = None
for p in g['planos']:
    words = len(p['text'].split())
    speech = round(words / WPS * FPS)
    first = p['speaker'] != prev
    if p['speaker'] == 'maria':
        live = 48 if first else 36
    else:
        live = max(66, round(speech * 0.45)) if first else min(90, max(36, round(speech * 0.25)))
    plate = max(speech - live, PLATE_MIN.get(p['id'], 0))
    segs.append({'type': 'live', 'speaker': p['speaker'], 'plano': p['id'], 'from': t, 'dur': live, 'lowerThird': first})
    segs.append({'type': 'plate', 'id': p['plate'], 'speaker': p['speaker'], 'from': t + live, 'dur': plate + PAUSE})
    markers.append((t, p['id'], f"{g['speakers'][p['speaker']]['name']} · cámara → {p['plate']} en {live/FPS:.1f}s"))
    # subtítulos repartidos por número de palabras
    cs = chunks(p['text'])
    total = sum(len(c.split()) for c in cs)
    acc = t
    for c in cs:
        d = round(speech * len(c.split()) / total)
        subs.append({'from': acc, 'to': acc + d - 2, 'text': c, 'speaker': p['speaker'], 'plano': p['id']})
        acc += d
    t += live + plate + PAUSE
    prev = p['speaker']
segs.append({'type': 'outro', 'from': t, 'dur': OUTRO}); markers.append((t, 'OUTRO', 'Cierre y créditos')); t += OUTRO
json.dump({'fps': FPS, 'total': t, 'segments': segs, 'subtitles': subs}, open(os.path.join(ROOT, 'src/data/timeline.json'), 'w'), ensure_ascii=False, indent=1)

def tc(fr, sep=','):
    s = fr / FPS
    return f"{int(s//3600):02d}:{int(s%3600//60):02d}:{int(s%60):02d}{sep}{int(round((s-int(s))*1000)):03d}"
def tcf(fr):
    return f"{fr//(FPS*3600):02d}:{fr//(FPS*60)%60:02d}:{fr//FPS%60:02d}:{fr%FPS:02d}"

os.makedirs(os.path.join(OUT, 'subtitulos'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'montaje'), exist_ok=True)
# SRT completo (referencia del animatic) y uno por integrante que arranca en 0 (para alinear con su clip)
with open(os.path.join(OUT, 'subtitulos', 'PITB_completo_estimado.srt'), 'w', encoding='utf-8') as fh:
    for i, s in enumerate(subs, 1):
        fh.write(f"{i}\n{tc(s['from'])} --> {tc(s['to'])}\n{s['text']}\n\n")
for sp in g['speakers']:
    mine = [s for s in subs if s['speaker'] == sp]
    # tiempos relativos al habla (sin las pausas de la plantilla), empezando en 0
    with open(os.path.join(OUT, 'subtitulos', f'{sp}.srt'), 'w', encoding='utf-8') as fh:
        acc = 0
        for i, s in enumerate(mine, 1):
            d = s['to'] - s['from'] + 2
            fh.write(f"{i}\n{tc(acc)} --> {tc(acc + d - 2)}\n{s['text']}\n\n")
            acc += d
with open(os.path.join(OUT, 'montaje', 'marcadores.csv'), 'w', encoding='utf-8') as fh:
    fh.write('timecode,segundos,plano,nota\n')
    for fr, name, note in markers:
        fh.write(f'{tcf(fr)},{fr/FPS:.2f},{name},"{note}"\n')
print(f'Total animatic: {t} cuadros = {t/FPS:.1f} s ({int(t/FPS//60)}:{int(t/FPS%60):02d})')
for s in segs:
    if s['type'] == 'plate':
        print(s['id'], round(s['dur']/FPS, 1), 's')
