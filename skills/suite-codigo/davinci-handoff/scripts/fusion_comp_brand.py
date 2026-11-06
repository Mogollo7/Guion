#!/usr/bin/env python3
"""
Rebrandea composiciones de Fusion (.comp: plantillas de títulos, tercios inferiores, llamadas) para DaVinci Resolve:
textos, tipografías, colores de los nodos Background, textos animados por keyframes y la imagen de los Loader.

  python fusion_comp_brand.py list plantilla.comp                     # qué nodos editables tiene
  python fusion_comp_brand.py apply plantilla.comp spec.json -o salida.comp

spec.json:
{
  "texts":  {"MainHeading": "Ana Gómez", "SubHeading": "Investigadora"},
  "fonts":  {"MainHeading": ["Fraunces", "Bold"], "*": ["Manrope", "Medium"]},
  "colors": {"Color": "#6cae4c", "ColorTwo": "#a5bc5b"},
  "text_colors": {"SubHeading": "#a5bc5b"},
  "animated": {"Text3StyledText": ["PASO 1", "PASO 2", "LISTO"]},
  "loaders": {"REPLACE": "C:\\\\marca\\\\logo.png"}
}
"*" en fonts aplica a todos los nodos de texto que no estén nombrados. Solo cambia valores fijos (Value = ...);
lo animado con curvas se deja igual salvo los textos de "animated". No toca nada más del archivo.
"""
import argparse
import json
import re
import sys


def blocks(s):
    out = []
    for m in re.finditer(r'\n\t\t([A-Za-z0-9_]+) = ([A-Za-z0-9_]+) \{', s):
        end = s.find('\n\t\t},', m.end())
        out.append((m.group(1), m.group(2), m.start(), end if end > 0 else len(s)))
    return out


def lua_str(t):
    return '"' + str(t).replace('\\', '\\\\').replace('"', '\\"') + '"'


def set_input(block, key, literal):
    pat = re.compile(r'(\b' + re.escape(key) + r' = Input \{ Value = )([^,]*?)(, \})')
    if pat.search(block):
        return pat.sub(lambda m: m.group(1) + literal + m.group(3), block, count=1), True
    return block, False


def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(round(int(h[i:i + 2], 16) / 255, 4) for i in (0, 2, 4))


def cmd_list(path):
    s = open(path, encoding='utf-8', errors='replace').read()
    rr = re.search(r'RenderRange = \{ (\d+), (\d+) \}', s)
    if rr:
        print(f'duración: cuadros {rr.group(1)}–{rr.group(2)}')
    for name, typ, a, b in blocks(s):
        blk = s[a:b]
        if typ == 'TextPlus':
            st = re.search(r'StyledText = Input \{ Value = "([^"]*)"', blk)
            src = re.search(r'StyledText = Input \{\s*SourceOp = "([^"]+)"', blk)
            fo = re.search(r'Font = Input \{ Value = "([^"]*)"', blk)
            sy = re.search(r'Style = Input \{ Value = "([^"]*)"', blk)
            txt = st.group(1) if st else (f'(animado por {src.group(1)})' if src else '')
            print(f'texto   {name:<20} "{txt}"  fuente={fo.group(1) if fo else "?"} {sy.group(1) if sy else ""}')
        elif typ == 'Background':
            r = re.search(r'TopLeftRed = Input \{ Value = ([\d.e-]+)', blk)
            g = re.search(r'TopLeftGreen = Input \{ Value = ([\d.e-]+)', blk)
            bb = re.search(r'TopLeftBlue = Input \{ Value = ([\d.e-]+)', blk)
            if r or g or bb:
                rgb = [float(v.group(1)) if v else 0.0 for v in (r, g, bb)]
                print(f'color   {name:<20} #{"".join(f"{int(round(c * 255)):02x}" for c in rgb)}')
            elif 'SourceOp = "' in blk and 'TopLeftRed' in blk:
                print(f'color   {name:<20} (animado)')
        elif typ == 'Loader':
            fn = re.search(r'Filename = "([^"]*)"', blk)
            print(f'imagen  {name:<20} {fn.group(1) if fn else ""}')
        elif typ == 'BezierSpline' and 'Value = Text {' in blk:
            vals = re.findall(r'Value = Text \{\s*Value = "([^"]*)"', blk)
            print(f'animado {name:<20} {vals}')


def apply(s, spec):
    changed = []
    for spline, words in (spec.get('animated') or {}).items():
        m = re.search(r'\n\t\t' + re.escape(spline) + r' = BezierSpline \{', s)
        if not m:
            print(f'aviso: no existe el texto animado {spline}', file=sys.stderr)
            continue
        end = s.find('\n\t\t},', m.end())
        blk = s[m.start():end]
        it = iter(words)
        blk = re.sub(r'(Value = Text \{\s*Value = )"[^"]*"', lambda mm: mm.group(1) + lua_str(next(it, words[-1])), blk)
        s = s[:m.start()] + blk + s[end:]
        changed.append(f'animado {spline}')
    texts, fonts, colors = spec.get('texts') or {}, spec.get('fonts') or {}, spec.get('colors') or {}
    tcolors, loaders = spec.get('text_colors') or {}, spec.get('loaders') or {}
    for name, typ, a, b in reversed(blocks(s)):
        blk = s[a:b]
        if typ == 'TextPlus':
            if name in texts:
                blk, ok = set_input(blk, 'StyledText', lua_str(texts[name]))
                changed.append(f'texto {name}' + ('' if ok else ' (NO: el texto está animado; usa "animated")'))
            fam = fonts.get(name) or fonts.get('*')
            if fam:
                blk, ok = set_input(blk, 'Font', lua_str(fam[0]))
                if ok:
                    blk2, ok2 = set_input(blk, 'Style', lua_str(fam[1]))
                    blk = blk2 if ok2 else blk.replace('Font = Input { Value = ' + lua_str(fam[0]) + ', },',
                                                       'Font = Input { Value = ' + lua_str(fam[0]) + ', },\n\t\t\t\tStyle = Input { Value = ' + lua_str(fam[1]) + ', },', 1)
                    changed.append(f'fuente {name}')
            if name in tcolors:
                r, g, bb = hex_rgb(tcolors[name])
                for k, v in (('Red1', r), ('Green1', g), ('Blue1', bb)):
                    blk2, ok = set_input(blk, k, str(v))
                    if not ok:
                        blk2 = blk.replace('StyledText = Input', f'{k} = Input {{ Value = {v}, }},\n\t\t\t\tStyledText = Input', 1)
                    blk = blk2
                changed.append(f'color de texto {name}')
        if typ == 'Background' and name in colors:
            r, g, bb = hex_rgb(colors[name])
            oks = [set_input(blk, k, str(v)) for k, v in (('TopLeftRed', r), ('TopLeftGreen', g), ('TopLeftBlue', bb))]
            for k, v in (('TopLeftRed', r), ('TopLeftGreen', g), ('TopLeftBlue', bb)):
                blk, _ = set_input(blk, k, str(v))
            changed.append(f'color {name}' + ('' if any(o[1] for o in oks) else ' (NO: color animado o sin valor fijo)'))
        if typ == 'Loader' and name in loaders:
            blk = re.sub(r'Filename = "[^"]*"', lambda m: 'Filename = ' + lua_str(loaders[name]), blk)
            changed.append(f'imagen {name}')
        s = s[:a] + blk + s[b:]
    if s.count('{') != s.count('}'):
        raise SystemExit('error: el archivo quedó con llaves desbalanceadas; no se guarda')
    return s, changed


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    p = sub.add_parser('list'); p.add_argument('comp')
    p = sub.add_parser('apply'); p.add_argument('comp'); p.add_argument('spec'); p.add_argument('-o', '--out', required=True)
    a = ap.parse_args()
    if a.cmd == 'list':
        return cmd_list(a.comp)
    s = open(a.comp, encoding='utf-8', errors='replace').read()
    spec = json.load(open(a.spec, encoding='utf-8'))
    s2, changed = apply(s, spec)
    with open(a.out, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(s2)
    print(f'✓ {a.out}: ' + ', '.join(changed))


if __name__ == '__main__':
    main()
