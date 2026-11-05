"""Convierte los límites DANE MGN 2018 (via caticoa3/colombia_mapa) en rutas SVG para Remotion.
Uso: python3 scripts/build-antioquia.py <mpio.geojson> <dpto.geojson> > src/data/antioquia.json"""
import json, math, sys
mp = json.load(open(sys.argv[1]))
dp = json.load(open(sys.argv[2]))
LON0, LON1, LAT0, LAT1 = -77.2, -73.8, 5.35, 8.95
K = math.cos(math.radians(7.1))
W = 1000.0
sx = W / ((LON1 - LON0) * K)
H = (LAT1 - LAT0) * sx
def proj(lon, lat):
    return ((lon - LON0) * K * sx, (LAT1 - lat) * sx)
def rings(geom):
    if geom['type'] == 'Polygon':
        return geom['coordinates']
    return [r for poly in geom['coordinates'] for r in poly]
def path(geom):
    out = []
    for ring in rings(geom):
        pts = [proj(*p[:2]) for p in ring]
        simp = [pts[0]]
        for p in pts[1:]:
            if abs(p[0]-simp[-1][0]) + abs(p[1]-simp[-1][1]) > 1.2:
                simp.append(p)
        if len(simp) < 3: continue
        out.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in simp) + 'Z')
    return ''.join(out)
def centroid(geom):
    best = max(rings(geom), key=len)
    a = cx = cy = 0.0
    pts = [proj(*p[:2]) for p in best]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]):
        c = x0*y1 - x1*y0; a += c; cx += (x0+x1)*c; cy += (y0+y1)*c
    if abs(a) < 1e-9:
        return pts[0]
    return (cx/(3*a), cy/(3*a))
munis = []
for f in mp['features']:
    p = f['properties']
    if p['DPTO_CCDGO'] != '05': continue
    c = centroid(f['geometry'])
    munis.append({'id': p['MPIO_CCNCT'], 'name': p['MPIO_CNMBR'].title(), 'd': path(f['geometry']), 'cx': round(c[0], 1), 'cy': round(c[1], 1)})
munis.sort(key=lambda m: (m['cy'], m['cx']))
dept = [f for f in dp['features'] if f['properties'].get('DPTO_CCDGO') == '05'][0]
print(json.dumps({'source': 'DANE MGN 2018 (geoportal.dane.gov.co) vía github.com/caticoa3/colombia_mapa',
                  'proj': {'lon0': LON0, 'lat1': LAT1, 'k': K, 's': sx}, 'width': W, 'height': round(H, 1),
                  'outline': path(dept['geometry']), 'municipios': munis}, ensure_ascii=False, separators=(',', ':')))
