#!/usr/bin/env python3
"""
Busca y descarga efectos de sonido REALES con licencia abierta desde la API de Openverse
(https://api.openverse.org/v1/audio/), los deja listos para editar y escribe los créditos.

  python openverse_sfx.py search "whoosh" --license cc0 --max-dur 3
  python openverse_sfx.py fetch  "whoosh" --role whoosh --n 3 --out sfx/
  python openverse_sfx.py fetch  "mouse click" --role click --n 4 --out sfx/ --license cc0,by
  python openverse_sfx.py add mi_click.ogg --role click --title "Click 2" --creator Kenney --license cc0 --landing https://kenney.nl --out sfx/

Sin dependencias fuera de la biblioteca estándar + ffmpeg en el PATH.
Salida de fetch: sfx/<role>_<n>.wav (48 kHz, sin silencio inicial, pico -1 dBFS),
sfx/credits.json y sfx/CREDITS.md (atribución lista para pegar).
"""
import argparse
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.error
import urllib.request

API = 'https://api.openverse.org/v1/audio/'
# Wikimedia pide un User-Agent que identifique la herramienta con un contacto (URL); cámbialo por el de tu proyecto.
UA = os.environ.get('OPENVERSE_SFX_UA', 'openverse-sfx-skill/1.0 (+https://github.com/Mogollo7/Guion)')

# Duraciones típicas (s) por rol, tomadas de práctica de motion design (earshot docs, kits de lanzamiento)
ROLE_DUR = {
    'click': (0.02, 0.4), 'tap': (0.03, 0.5), 'tick': (0.02, 0.3), 'pop': (0.08, 0.6), 'key': (0.03, 0.4),
    'whoosh': (0.25, 1.6), 'swoosh': (0.25, 1.6), 'swipe': (0.2, 1.2), 'hit': (0.15, 1.5), 'impact': (0.2, 2.0),
    'riser': (0.6, 4.0), 'chime': (0.2, 2.5), 'ding': (0.15, 1.5), 'notification': (0.2, 2.0), 'bell': (0.2, 2.5),
    'drop': (0.1, 1.2), 'thud': (0.1, 1.0), 'shutter': (0.05, 0.8), 'paper': (0.1, 2.0), 'ambience': (8.0, 120.0),
    'birds': (3.0, 120.0), 'forest': (8.0, 300.0), 'rain': (8.0, 300.0),
}
# Licencias por preferencia: CC0 primero (sin obligación), luego BY (atribución), luego BY-SA
LICENSE_RANK = {'cc0': 0, 'pdm': 0, 'by': 1, 'by-sa': 2, 'by-nc': 3, 'by-nc-sa': 4, 'by-nd': 9, 'by-nc-nd': 9, 'sampling+': 9, 'nc-sampling+': 9}


def http_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode('utf-8'))


def download(url, path, tries=3):
    """Descarga respetando el ritmo del servidor: ante 429 espera lo que pide Retry-After (máx. 20 s) y reintenta."""
    import time
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r, open(path, 'wb') as fh:
                fh.write(r.read())
            time.sleep(1.0)  # una descarga por segundo: uso educado de servidores públicos
            return
        except urllib.error.HTTPError as e:
            if e.code == 429 and i < tries - 1:
                wait = min(20.0, float(e.headers.get('Retry-After') or 5 * (i + 1)))
                time.sleep(wait)
                continue
            raise


def search(q, license='cc0', max_dur=None, min_dur=None, page_size=20, category='sound_effect', source=None):
    # Sin clave de API, Openverse permite como máximo page_size=20 (con más devuelve 401).
    params = {'q': q, 'page_size': str(page_size), 'license': license, 'mature': 'false'}
    if category:
        params['category'] = category
    if source:
        params['source'] = source
    url = API + '?' + urllib.parse.urlencode(params)
    try:
        d = http_json(url)
    except Exception as e:  # sin categoría el índice tiene más resultados
        print(f'aviso: {e}', file=sys.stderr)
        d = {'results': []}
    res = d.get('results', [])
    if len(res) < 5 and category:
        params.pop('category', None)
        try:
            res += http_json(API + '?' + urllib.parse.urlencode(params)).get('results', [])
        except Exception as e:
            print(f'aviso: {e}', file=sys.stderr)
    out, seen = [], set()
    for r in res:
        if r['id'] in seen:
            continue
        seen.add(r['id'])
        dur = (r.get('duration') or 0) / 1000.0
        if max_dur and dur and dur > max_dur:
            continue
        if min_dur and dur and dur < min_dur:
            continue
        out.append({
            'id': r['id'], 'title': r.get('title') or '', 'creator': r.get('creator') or '',
            'license': (r.get('license') or '').lower(), 'license_version': r.get('license_version') or '',
            'license_url': r.get('license_url') or '', 'provider': r.get('provider') or '', 'source': r.get('source') or '',
            'duration_s': round(dur, 3), 'filetype': r.get('filetype') or '', 'url': r.get('url') or '',
            'landing': r.get('foreign_landing_url') or '', 'tags': [t.get('name') for t in (r.get('tags') or [])][:12],
            'attribution': r.get('attribution') or '', 'mature': r.get('mature', False),
        })
    return out


def score(item, q, role):
    """Mayor es mejor: coincidencia de palabras, duración dentro del rango del rol, licencia preferida."""
    words = [w for w in re.findall(r'[a-záéíóúñ0-9]+', q.lower()) if len(w) > 2]
    hay = (item['title'] + ' ' + ' '.join(item['tags'])).lower()
    s = sum(2.0 for w in words if w in item['title'].lower()) + sum(1.0 for w in words if w in hay)
    lo, hi = ROLE_DUR.get(role, (0.05, 10.0))
    d = item['duration_s']
    if d:
        s += 2.0 if lo <= d <= hi else -min(3.0, abs(d - (lo if d < lo else hi)) / max(hi, 0.1) * 3)
    s -= LICENSE_RANK.get(item['license'], 9) * 0.8
    bad = ['music', 'song', 'loop', 'beat', 'voice', 'speech', 'pack', 'compilation', 'collection']
    if role not in ('ambience', 'birds', 'forest', 'rain'):
        s -= sum(1.5 for b in bad if b in hay)
    return round(s, 2)


def ffmpeg_prepare(src, dst, max_len=None, mono=False):
    """Convierte a WAV 48 kHz, quita el silencio inicial, recorta y normaliza el pico a -1 dBFS (sin comprimir)."""
    af = ['silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.002']
    if max_len:
        af.append(f'atrim=0:{max_len}')
        af.append(f'afade=t=out:st={max(0.0, max_len - 0.04)}:d=0.04')
    cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', ','.join([a for a in af if a]), '-ar', '48000']
    if mono:
        cmd += ['-ac', '1']
    tmp = dst + '.tmp.wav'
    subprocess.run(cmd + [tmp], check=True)
    # pico a -1 dBFS
    vol = subprocess.run(['ffmpeg', '-v', 'info', '-i', tmp, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.search(r'max_volume: (-?[\d.]+) dB', vol)
    gain = (-1.0 - float(m.group(1))) if m else 0.0
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'volume={gain:.2f}dB', dst], check=True)
    os.remove(tmp)
    return gain


def credit_line(it):
    lic = it['license'].upper()
    if lic in ('CC0', 'PDM'):
        lic_txt = 'CC0 1.0 (dominio público)'
    else:
        lic_txt = f"CC {lic} {it['license_version']}".strip()
    return f"\"{it['title']}\" por {it['creator'] or 'autor desconocido'} ({it['source']}), {lic_txt}: {it['landing'] or it['url']}"


def cmd_search(a):
    res = search(a.query, a.license, a.max_dur, a.min_dur, category=None if a.any_category else 'sound_effect', source=a.source)
    for it in res:
        it['score'] = score(it, a.query, a.role or a.query.split()[0])
    res.sort(key=lambda x: -x['score'])
    if a.json:
        print(json.dumps(res[: a.n], ensure_ascii=False, indent=1))
        return
    for it in res[: a.n]:
        print(f"{it['score']:5.1f}  {it['duration_s']:6.2f}s  {it['license']:<6} {it['source']:<10} {it['title'][:48]:<48}  {it['url']}")


def cmd_fetch(a):
    role = a.role or a.query.split()[0].lower()
    res = search(a.query, a.license, a.max_dur or ROLE_DUR.get(role, (0, 10))[1] * 4, a.min_dur, category=None if a.any_category else 'sound_effect', source=a.source)
    for it in res:
        it['score'] = score(it, a.query, role)
    res.sort(key=lambda x: -x['score'])
    os.makedirs(a.out, exist_ok=True)
    cred_path = os.path.join(a.out, 'credits.json')
    credits = json.load(open(cred_path, encoding='utf-8')) if os.path.exists(cred_path) else []
    have = {c['id'] for c in credits}
    taken = 0
    blocked = {}  # host -> código HTTP que rechazó la descarga
    max_len = ROLE_DUR.get(role, (0, None))[1] if not a.keep_length else None
    for it in res:
        if taken >= a.n:
            break
        if it['id'] in have or not it['url']:
            continue
        host = urllib.parse.urlparse(it['url']).netloc
        if host in blocked:
            continue
        ext = os.path.splitext(urllib.parse.urlparse(it['url']).path)[1] or '.' + (it['filetype'] or 'mp3')
        raw = os.path.join(a.out, f'.raw_{it["id"]}{ext}')
        try:
            download(it['url'], raw)
            n = sum(1 for c in credits if c['role'] == role) + 1
            dst = os.path.join(a.out, f'{role}_{n:02d}.wav')
            gain = ffmpeg_prepare(raw, dst, max_len=max_len, mono=a.mono)
        except urllib.error.HTTPError as e:
            if e.code in (401, 403, 429):
                blocked[host] = e.code  # el servidor rechaza esta red: no insistir con el mismo host
            print(f'  saltado {it["title"][:40]}: {e}', file=sys.stderr)
            continue
        except Exception as e:
            print(f'  saltado {it["title"][:40]}: {e}', file=sys.stderr)
            continue
        finally:
            if os.path.exists(raw):
                os.remove(raw)
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout or 0)
        rec = dict(it, role=role, file=os.path.basename(dst), prepared_duration_s=round(dur, 3), peak_gain_db=round(gain, 2), query=a.query, credit=credit_line(it))
        credits.append(rec)
        taken += 1
        print(f"✓ {rec['file']:<16} {dur:5.2f}s  {it['license']:<5} {it['title'][:50]}")
    json.dump(credits, open(cred_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    write_credits_md(a.out, credits)
    for host, code in blocked.items():
        print(f'aviso: {host} rechazó las descargas desde esta red (HTTP {code}). No es un problema de licencia: '
              f'corre el script desde otra red (tu computador) o usa otra fuente, p. ej. --source wikimedia_audio.', file=sys.stderr)
    if taken < a.n:
        print(f'aviso: solo {taken} de {a.n} sonidos para "{a.query}". Prueba otra palabra (en inglés rinde más), --license cc0,by,by-sa o --any-category', file=sys.stderr)


def cmd_add(a):
    """Importa un archivo local (ya descargado o de un pack CC0) al mismo formato y a los mismos créditos."""
    os.makedirs(a.out, exist_ok=True)
    cred_path = os.path.join(a.out, 'credits.json')
    credits = json.load(open(cred_path, encoding='utf-8')) if os.path.exists(cred_path) else []
    role = a.role
    n = sum(1 for c in credits if c['role'] == role) + 1
    dst = os.path.join(a.out, f'{role}_{n:02d}.wav')
    max_len = ROLE_DUR.get(role, (0, None))[1] if not a.keep_length else None
    gain = ffmpeg_prepare(a.file, dst, max_len=max_len, mono=a.mono)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout or 0)
    it = {'id': 'local:' + os.path.basename(a.file), 'title': a.title or os.path.basename(a.file), 'creator': a.creator or '', 'license': a.license.lower(),
          'license_version': a.license_version or ('1.0' if a.license.lower() == 'cc0' else '4.0'), 'license_url': '', 'provider': 'local', 'source': a.source_name or 'local',
          'duration_s': round(dur, 3), 'filetype': os.path.splitext(a.file)[1][1:], 'url': '', 'landing': a.landing or '', 'tags': [], 'attribution': ''}
    rec = dict(it, role=role, file=os.path.basename(dst), prepared_duration_s=round(dur, 3), peak_gain_db=round(gain, 2), query='(archivo local)', credit=credit_line(it))
    credits.append(rec)
    json.dump(credits, open(cred_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    write_credits_md(a.out, credits)
    print(f"✓ {rec['file']:<16} {dur:5.2f}s  {it['license']:<5} {it['title'][:50]}")


def write_credits_md(out, credits):
    with open(os.path.join(out, 'CREDITS.md'), 'w', encoding='utf-8') as fh:
        fh.write('# Créditos de efectos de sonido\n\n')
        need = [c for c in credits if c['license'] not in ('cc0', 'pdm')]
        fh.write('Atribución obligatoria: ' + ('sí, ver lista' if need else 'no (todo CC0), se incluye por cortesía') + '\n\n')
        for c in credits:
            fh.write(f"- `{c['file']}` — {c['credit']}\n")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    for name in ('search', 'fetch'):
        p = sub.add_parser(name)
        p.add_argument('query')
        p.add_argument('--license', default='cc0', help='cc0 | cc0,by | by,by-sa ... (Openverse license codes)')
        p.add_argument('--role', help='rol de la tabla ROLE_DUR (click, pop, whoosh, hit, riser, chime, ambience...)')
        p.add_argument('--max-dur', type=float)
        p.add_argument('--min-dur', type=float)
        p.add_argument('--any-category', action='store_true', help='no filtrar por category=sound_effect')
        p.add_argument('--source', help='freesound | wikimedia_audio | jamendo | ccmixter ... (varias separadas por coma)')
        p.add_argument('--n', type=int, default=10 if name == 'search' else 3)
        if name == 'search':
            p.add_argument('--json', action='store_true')
        else:
            p.add_argument('--out', default='sfx')
            p.add_argument('--mono', action='store_true')
            p.add_argument('--keep-length', action='store_true', help='no recortar al largo típico del rol')
    p = sub.add_parser('add', help='importar un archivo local con su licencia')
    p.add_argument('file')
    p.add_argument('--role', required=True)
    p.add_argument('--title')
    p.add_argument('--creator')
    p.add_argument('--license', required=True, help='cc0 | by | by-sa ...')
    p.add_argument('--license-version')
    p.add_argument('--landing', help='URL de la página de origen')
    p.add_argument('--source-name', help='p. ej. kenney, freesound')
    p.add_argument('--out', default='sfx')
    p.add_argument('--mono', action='store_true')
    p.add_argument('--keep-length', action='store_true')
    a = ap.parse_args()
    {'search': cmd_search, 'fetch': cmd_fetch, 'add': cmd_add}[a.cmd](a)


if __name__ == '__main__':
    main()
