"""
Pack Mixkit × PITB Antioquia para DaVinci Resolve.

Descarga plantillas gratuitas de Mixkit (https://mixkit.co/free-davinci-resolve-templates/) directamente
desde su servidor y las adapta a la marca PITB: textos del proyecto, tipografías Fraunces/Manrope,
color verde de marca y el logo PITB en los títulos de logo.

No se redistribuyen las plantillas: cada persona las descarga de Mixkit al ejecutar este script.
Uso (Windows/macOS/Linux, Python 3.8+ sin dependencias):
    python mixkit_pitb.py                 # crea ./mixkit_pitb/ junto a la carpeta entregables
    python mixkit_pitb.py --out C:\\PITB\\mixkit --logo-dir C:\\PITB\\logo
"""
import argparse
import io
import ntpath
import os
import re
import urllib.request
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))  # raíz del repo Guion

LEAF = (0.4235, 0.6824, 0.2980)   # #6cae4c
OLIVE = (0.6471, 0.7373, 0.3569)  # #a5bc5b
FOREST = (0.0275, 0.2196, 0.1294)  # #073821
CREAM = (1.0, 1.0, 0.9647)        # #fffff6

TEAM = [
    ('salome', 'Salomé Mariaca Sánchez', '01 · El problema'),
    ('daniela', 'Daniela Estefanía Posada Hernández', '02 · La propuesta'),
    ('juan', 'Juan Sebastián Martínez Galeano', '03 · La tecnología: BioCLIP'),
    ('maria', 'Maria Estefany Serna Guerra', '04 · El prototipo'),
]

# id de Mixkit -> (nombre de salida, {nodo: texto}, fuentes {nodo: (familia, estilo)}, colores {nodo: rgb}, logo)
HEAD = ('Fraunces', 'Bold')
BODY = ('Manrope', 'Medium')
BODY_LIGHT = ('Manrope', 'Light')

def lower_thirds():
    out = []
    for key, name, role in TEAM:
        out.append(('677', f'TerciosInferiores/LT_linea_{key}', {'MainHeading': name, 'SubHeading': role}, {'MainHeading': HEAD, 'SubHeading': BODY}, {'Color': LEAF}, None))
    return out

PACK = lower_thirds() + [
    ('678', 'Titulos/Capitulo_Territorio_Sostenible', {'Heading': 'TERRITORIO SOSTENIBLE', 'SubHeading': 'AGENDA ANTIOQUIA 2040'}, {'Heading': ('Manrope', 'ExtraBold'), 'SubHeading': BODY_LIGHT}, {'Color': LEAF}, None),
    ('681', 'Titulos/Marca_PITB_Foto_Especie_Dato', {'Heading': 'PITB'}, {'Heading': HEAD, 'SubHeading': ('Manrope', 'ExtraLight')}, {}, None, {'SubHeadingStyledText': ['FOTO', 'FOTO', 'ESPECIE', 'DATO']}),
    ('688', 'Llamadas/BioCLIP_identifica', {'Heading': 'BIOCLIP', 'SubHeading': 'IDENTIFICA LA ESPECIE'}, {'Heading': ('Manrope', 'Bold'), 'SubHeading': BODY_LIGHT}, {'PointColor': LEAF, 'LineColor': LEAF}, None),
    ('690', 'Llamadas/Revision_humana', {'Heading': 'REVISIÓN HUMANA'}, {'Heading': ('Manrope', 'Bold')}, {'ColorOne': LEAF, 'ColorTwo': LEAF, 'ColorThree': LEAF}, None),
    ('691', 'Llamadas/Tu_foto_un_dato', {'Heading': 'TU FOTO', 'SubHeading': 'SE CONVIERTE EN UN DATO'}, {'Heading': ('Manrope', 'Bold'), 'SubHeading': BODY_LIGHT}, {'ColorOne': LEAF, 'ColorTwo': LEAF, 'ArrowColor': LEAF}, None),
    ('692', 'Llamadas/Aqui', {'EditText': 'AQUÍ'}, {'EditText': ('Manrope', 'SemiBold')}, {'ColorOne': LEAF, 'ColorTwo': LEAF, 'ColorThree': OLIVE, 'ColorFour': LEAF}, None),
    ('693', 'Llamadas/Oso_de_anteojos_VU', {'HeadingOne': 'OSO DE ANTEOJOS', 'HeadingTwo': 'TREMARCTOS ORNATUS', 'SubHeading': 'VULNERABLE (VU) · COORDENADAS PROTEGIDAS'}, {'HeadingOne': ('Manrope', 'Bold'), 'HeadingTwo': ('Manrope', 'Medium'), 'SubHeading': BODY_LIGHT}, {'Color': LEAF, 'ColorTwo': LEAF}, None, {'Text3StyledText': ['VULNERABLE (VU)', 'VULNERABLE (VU)', 'COORDENADAS PROTEGIDAS']}),
    ('686', 'Logo/Logo_drop_and_catch_fondo_claro', {}, {}, {}, 'Logo-horizontal.png'),
    ('685', 'Logo/Logo_twist_and_drop_fondo_oscuro', {}, {}, {}, 'Logo-horizontal-dark.png'),
    ('687', 'Logo/Logo_fast_intro_fondo_oscuro', {}, {}, {'SolidBackground': FOREST}, 'Logo-horizontal-dark.png'),
]
# Proyectos .drp (transiciones y pantallas divididas): se descargan tal cual
DRP = [('742', 'Transiciones'), ('744', 'Transiciones'), ('746', 'Transiciones'), ('745', 'PantallaDividida'), ('747', 'PantallaDividida')]


def fetch(tid):
    url = f'https://assets.mixkit.co/video-templates/{tid}/mixkit-{tid}.zip'
    req = urllib.request.Request(url, headers={'User-Agent': 'pitb-antioquia-template-setup'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return zipfile.ZipFile(io.BytesIO(r.read()))


def tool_blocks(s):
    """Devuelve (nombre, inicio, fin) de cada herramienta de nivel superior en la .comp."""
    out = []
    for m in re.finditer(r'\n\t\t([A-Za-z0-9_]+) = [A-Za-z0-9_]+ \{', s):
        end = s.find('\n\t\t},', m.end())
        out.append((m.group(1), m.start(), end if end > 0 else len(s)))
    return out


def set_input(block, key, value_literal):
    pat = re.compile(r'(\b' + re.escape(key) + r' = Input \{ Value = )([^,]*?)(, \})')
    if pat.search(block):
        return pat.sub(lambda m: m.group(1) + value_literal + m.group(3), block, count=1)
    return block


def lua_str(t):
    return '"' + t.replace('\\', '\\\\').replace('"', '\\"') + '"'


def animated(s, spline, words):
    """Reemplaza, en orden, los textos de un BezierSpline de texto animado."""
    m = re.search(r'\n\t\t' + re.escape(spline) + r' = BezierSpline \{', s)
    if not m:
        return s
    end = s.find('\n\t\t},', m.end())
    block = s[m.start():end]
    it = iter(words)
    block = re.sub(r'(Value = Text \{\s*Value = )"[^"]*"', lambda mm: mm.group(1) + lua_str(next(it, words[-1])), block)
    return s[:m.start()] + block + s[end:]


def customize(s, texts, fonts, colors, logo_path, anim=None):
    for spline, words in (anim or {}).items():
        s = animated(s, spline, words)
    blocks = tool_blocks(s)
    for name, a, b in reversed(blocks):
        block = s[a:b]
        if name in texts:
            block = set_input(block, 'StyledText', lua_str(texts[name]))
        if name in fonts:
            fam, sty = fonts[name]
            block = set_input(block, 'Font', lua_str(fam))
            if re.search(r'\bStyle = Input \{ Value = ', block):
                block = set_input(block, 'Style', lua_str(sty))
            else:
                block = block.replace('Font = Input { Value = ' + lua_str(fam) + ', },', 'Font = Input { Value = ' + lua_str(fam) + ', },\n\t\t\t\tStyle = Input { Value = ' + lua_str(sty) + ', },', 1)
        if name in colors:
            r, g, bb = colors[name]
            block = set_input(block, 'TopLeftRed', f'{r}')
            block = set_input(block, 'TopLeftGreen', f'{g}')
            block = set_input(block, 'TopLeftBlue', f'{bb}')
        if logo_path and name == 'REPLACE':
            block = re.sub(r'Filename = "[^"]*"', lambda m: 'Filename = ' + lua_str(logo_path), block)
        s = s[:a] + block + s[b:]
    return s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join(REPO, 'mixkit_pitb'))
    ap.add_argument('--logo-dir', default=os.path.join(REPO, 'entregables', 'logo'))
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    report = []
    for item in PACK:
        tid, name, texts, fonts, colors, logo = item[:6]
        anim = item[6] if len(item) > 6 else None
        z = fetch(tid)
        comp = [n for n in z.namelist() if n.endswith('.comp')][0]
        s = z.read(comp).decode('utf-8', errors='replace')
        if logo and '\\' in args.logo_dir:
            logo_path = ntpath.join(args.logo_dir, logo)  # ruta de Windows dada a mano
        else:
            logo_path = os.path.join(os.path.abspath(args.logo_dir), logo) if logo else None
        s2 = customize(s, texts, fonts, colors, logo_path, anim)
        dest = os.path.join(args.out, name + '.comp')
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(s2)
        report.append(f'✓ {name}.comp  (Mixkit #{tid})')
    for tid, folder in DRP:
        z = fetch(tid)
        for n in z.namelist():
            if n.endswith('.drp'):
                dest = os.path.join(args.out, folder, f'mixkit-{tid}_' + os.path.basename(n))
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                with open(dest, 'wb') as fh:
                    fh.write(z.read(n))
                report.append(f'✓ {folder}/{os.path.basename(dest)}  (Mixkit #{tid}, sin cambios)')
    print('\n'.join(report))
    print(f'\nListo: {args.out}\nPlantillas de Mixkit (mixkit.co) bajo su licencia gratuita para video templates.')


if __name__ == '__main__':
    main()
