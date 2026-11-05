import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Audio, staticFile } from 'remotion';
import { AntioquiaMap, Bg, BrowserFrame, Icon, Illustrative, Kicker, Photo, Pill, Title, Words, mapSize } from '../components';
import { appear, C, EASE_IN_OUT, F, pop, rise } from '../theme';
import b from '../data/boxes.json';
import species from '../data/species.json';
import geo from '../data/antioquia.json';

const center = (k: keyof typeof b) => ({ x: b[k].x + b[k].w / 2, y: b[k].y + b[k].h / 2 });

/** Etiqueta superior de sección del prototipo */
const ProtoTag: React.FC<{ module: string; start?: number }> = ({ module, start = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 96, top: 44, display: 'flex', alignItems: 'center', gap: 16, ...rise(f, start) }}>
      <Kicker>Prototipo</Kicker>
      <Pill tone="dark" size={22}>
        {module}
      </Pill>
    </div>
  );
};

const Click: React.FC<{ at: number[]; vol?: number }> = ({ at, vol = 0.35 }) => (
  <>
    {at.map((t) => (
      <Sequence key={t} from={t} durationInFrames={10}>
        <Audio src={staticFile('sfx/click.ogg')} volume={vol} />
      </Sequence>
    ))}
  </>
);

const FRAME = { width: 1424, x: 248, y: 104 };

/* M1 — arrastrar foto + filtros de la comunidad */
export const M1: React.FC = () => {
  const dz = center('dropzone');
  const fb = center('filtros_btn');
  const chips = [1, 2, 3, 4, 5].map((i) => center(`chip_${i}` as keyof typeof b));
  const chipAt = [122, 142, 162, 182, 202];
  return (
    <Bg tone="alt" contours={false}>
      <ProtoTag module="Explorar · Identificación taxonómica" />
      <BrowserFrame
        {...FRAME}
        layers={[
          { src: 'proto/01_explorar.png', from: 0 },
          { src: 'proto/03_foto_subida.png', from: 58 },
          { src: 'proto/02_filtros_abiertos.png', from: 100 },
          { src: 'proto/02_filtro_mamiferos.png', from: chipAt[0] + 4 },
          { src: 'proto/02_filtro_aves.png', from: chipAt[1] + 4 },
          { src: 'proto/02_filtro_anfibios.png', from: chipAt[2] + 4 },
          { src: 'proto/02_filtro_reptiles.png', from: chipAt[3] + 4 },
          { src: 'proto/02_filtro_flora.png', from: chipAt[4] + 4 },
        ]}
        cam={[
          { f: 0, x: 1280, y: 800, s: 1 },
          { f: 10, x: 1280, y: 800, s: 1 },
          { f: 44, x: dz.x + 120, y: dz.y + 60, s: 1.5 },
          { f: 70, x: dz.x + 120, y: dz.y + 60, s: 1.5 },
          { f: 100, x: 1860, y: 1010, s: 1.45 },
          { f: 300, x: 1860, y: 1010, s: 1.5 },
        ]}
        cursor={[
          { f: 6, x: 2480, y: 1500 },
          { f: 52, x: dz.x, y: dz.y, click: true },
          { f: 76, x: dz.x + 300, y: dz.y + 200 },
          { f: 96, x: fb.x, y: fb.y, click: true },
          ...chips.flatMap((c, i) => [{ f: chipAt[i] - 10, x: c.x, y: c.y }, { f: chipAt[i], x: c.x, y: c.y, click: true }]),
          { f: 300, x: chips[4].x + 40, y: chips[4].y + 60 },
        ]}
        drag={{ src: 'species/tremarctos-ornatus.jpg', until: 52 }}
        callouts={[
          { from: 16, to: 84, box: b.dropzone, label: 'Arrastra o selecciona una foto', side: 'bottom' },
          { from: 106, to: 300, box: b.filtros_panel, label: 'Filtra por grupo', side: 'right', dim: false },
        ]}
      />
      <Click at={[52, 96, ...chipAt]} />
    </Bg>
  );
};

/* M2 — análisis + ficha de observación + publicar */
export const M2: React.FC = () => {
  const an = center('analizar_btn');
  const pub = center('ficha_publicar');
  return (
    <Bg tone="alt" contours={false}>
      <ProtoTag module="Ficha de observación" />
      <BrowserFrame
        {...FRAME}
        url="mogollo7.github.io/PITB-Antioquia/#observacion"
        layers={[
          { src: 'proto/03_foto_subida.png', from: 0 },
          { src: 'proto/04_procesando_1.png', from: 20, h: 2188 },
          { src: 'proto/04_procesando_2.png', from: 28, h: 2230 },
          { src: 'proto/04_procesando_3.png', from: 36, h: 2280 },
          { src: 'proto/04_procesando_4.png', from: 44, h: 2330 },
          { src: 'proto/04_procesando_5.png', from: 52, h: 2374 },
          { src: 'proto/05_ficha_full.png', from: 68, h: 3304 },
          { src: 'proto/06_ficha_publicada.png', from: 230 },
        ]}
        cam={[
          { f: 0, x: 1280, y: 800, s: 1 },
          { f: 10, x: an.x, y: an.y + 100, s: 1.3 },
          { f: 26, x: 702, y: 1700, s: 1.45 },
          { f: 62, x: 702, y: 1720, s: 1.45 },
          { f: 74, x: 1280, y: 800, s: 1 },
          { f: 84, x: 1280, y: 800, s: 1 },
          { f: 98, x: 900, y: 1060, s: 1.35 },
          { f: 120, x: 900, y: 1060, s: 1.35 },
          { f: 134, x: 900, y: 1400, s: 1.35 },
          { f: 152, x: 900, y: 1440, s: 1.35 },
          { f: 166, x: 820, y: 1735, s: 1.3 },
          { f: 196, x: 820, y: 1735, s: 1.3 },
          { f: 214, x: 1700, y: 900, s: 1.25 },
          { f: 300, x: 1700, y: 950, s: 1.25 },
        ]}
        cursor={[
          { f: 0, x: 1500, y: 1500 },
          { f: 16, x: an.x, y: an.y, click: true },
          { f: 74, x: 1900, y: 1350 },
          { f: 200, x: 2000, y: 1250 },
          { f: 222, x: pub.x, y: pub.y, click: true },
          { f: 300, x: pub.x + 120, y: pub.y + 140 },
        ]}
        callouts={[
          { from: 22, to: 66, box: b.proc_panel, label: 'BioCLIP analiza la evidencia', side: 'right', dim: false },
          { from: 90, to: 128, box: { x: 148, y: 1150, w: 1320, h: 60 }, label: 'Foto con autoría y licencia', side: 'top' },
          { from: 132, to: 160, box: { x: 148, y: 1240, w: 1320, h: 252 }, label: 'Taxonomía completa', side: 'right' },
          { from: 164, to: 208, box: b.ficha_top3, label: 'Top-3 sugerencias con %', side: 'bottom' },
          { from: 232, to: 300, box: { x: b.ficha_publicar.x, y: b.ficha_publicar.y, w: b.ficha_publicar.w, h: b.ficha_estado.y + b.ficha_estado.h - b.ficha_publicar.y }, label: 'Geolocalizar y publicar', side: 'left' },
        ]}
      />
      <Click at={[16, 222]} />
    </Bg>
  );
};

/* M3 — Tablero territorial (captura real) + cruce POT/EOT (ilustrativo) */
const MARKERS = [
  [293, 633], [455, 635], [437, 648], [288, 651], [420, 658], [460, 701], [440, 712], [359, 758], [473, 783], [387, 783], [445, 795], [435, 801], [361, 816], [378, 813],
];

// Zonificación ilustrativa: patrón determinista por código DANE (no es la zonificación oficial)
const zoneOf = (id: string) => {
  const n = parseInt(id, 10);
  const r = (n * 37 + 11) % 9;
  return r < 3 ? 'proteccion' : r < 6 ? 'rural' : r < 7 ? 'expansion' : 'otro';
};
const ZONE = {
  proteccion: { fill: 'rgba(42,111,73,0.42)', label: 'Suelo de protección' },
  rural: { fill: 'rgba(165,188,91,0.40)', label: 'Suelo rural productivo' },
  expansion: { fill: 'rgba(232,112,58,0.42)', label: 'Suelo de expansión' },
  otro: { fill: 'rgba(230,240,232,0.9)', label: '' },
} as const;
const nearestMuni = (lat: number, lng: number) => {
  const sx = (lng - geo.proj.lon0) * geo.proj.k * geo.proj.s;
  const sy = (geo.proj.lat1 - lat) * geo.proj.s;
  let best = geo.municipios[0];
  let bd = Infinity;
  for (const m of geo.municipios) {
    const d = (m.cx - sx) ** 2 + (m.cy - sy) ** 2;
    if (d < bd) {
      bd = d;
      best = m;
    }
  }
  return best;
};

export const M3: React.FC = () => {
  const f = useCurrentFrame();
  const switchAt = 124;
  const partA = 1 - appear(f, switchAt, 16, EASE_IN_OUT);
  const partB = appear(f, switchAt + 6, 18);
  const mapH = 900;
  const { width: mapW } = mapSize(mapH);
  const recs = species.map((s) => ({ ...s, zone: zoneOf(nearestMuni(s.lat, s.lng).id) }));
  const conflicts = recs.filter((r) => r.zone === 'expansion');
  return (
    <Bg tone="alt" contours={false}>
      <AbsoluteFill style={{ opacity: partA }}>
        <ProtoTag module="Tablero territorial" />
        <BrowserFrame
          {...FRAME}
          imgW={1280}
          viewH={800}
          url="mogollo7.github.io/PITB-Antioquia/#tablero"
          badge="Datos ilustrativos del prototipo"
          layers={[{ src: 'ext/tablero.jpg', from: 0, h: 900 }]}
          cam={[
            { f: 0, x: 640, y: 420, s: 1 },
            { f: 10, x: 640, y: 420, s: 1 },
            { f: 40, x: 390, y: 720, s: 1.7 },
            { f: 70, x: 390, y: 720, s: 1.7 },
            { f: 90, x: 420, y: 440, s: 1.55 },
            { f: 140, x: 420, y: 440, s: 1.55 },
          ]}
          callouts={[{ from: 86, to: 160, box: { x: 74, y: 404, w: 650, h: 66 }, label: 'Filtros por subregión y grupo taxonómico', side: 'bottom', dim: false }]}
          extras={() => (
            <>
              {MARKERS.map(([x, y], i) => {
                const t = (f - 26 - i * 3) / 30;
                if (t < 0) return null;
                const p = t % 1;
                return <div key={i} style={{ position: 'absolute', left: x - 6 - p * 14, top: y - 6 - p * 14, width: 12 + p * 28, height: 12 + p * 28, borderRadius: '50%', border: `2px solid ${C.mapAccent}`, opacity: 1 - p }} />;
              })}
            </>
          )}
        />
        <div style={{ position: 'absolute', right: 110, bottom: 26, fontFamily: F.body, fontSize: 17, color: C.ink600 }}>Mapa base: © colaboradores de OpenStreetMap</div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: partB }}>
        {f >= switchAt && (
          <>
            <div style={{ position: 'absolute', left: 130, top: 150, width: 820 }}>
              <Kicker>Tablero territorial</Kicker>
              <div style={{ marginTop: 16 }}>
                <Title size={68}>Registros × zonificación POT/EOT</Title>
              </div>
              <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {(['proteccion', 'rural', 'expansion'] as const).map((z, i) => (
                  <div key={z} style={{ display: 'flex', alignItems: 'center', gap: 18, ...rise(f, switchAt + 20 + i * 8) }}>
                    <div style={{ width: 44, height: 30, borderRadius: 8, background: ZONE[z].fill, border: '1.5px solid rgba(18,35,24,0.15)' }} />
                    <span style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.ink900 }}>{ZONE[z].label}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, ...rise(f, switchAt + 44) }}>
                  <svg width={44} height={30} viewBox="-22 -15 44 30">
                    <rect x={-8} y={-8} width={16} height={16} transform="rotate(45)" fill={C.forest800} stroke="#fff" strokeWidth={3} />
                  </svg>
                  <span style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.ink900 }}>Registro de especie</span>
                </div>
              </div>
              <div style={{ marginTop: 50, ...rise(f, switchAt + 70) }}>
                <Pill tone="danger" size={30}>
                  <Icon name="alert" size={30} color={C.danger} />
                  {conflicts.length} registros en suelo de expansión → alerta
                </Pill>
              </div>
            </div>
            <AntioquiaMap
              height={mapH}
              x={1840 - mapW}
              y={90}
              drawStart={switchAt}
              drawEvery={0.2}
              muniFill={(id) => ZONE[zoneOf(id)].fill}
              markers={recs.map((r, i) => ({ lat: r.lat, lng: r.lng, at: switchAt + 34 + i * 2, color: r.zone === 'expansion' ? C.danger : C.forest800, pulse: r.zone === 'expansion' }))}
            />
            <Illustrative text="Ilustración: zonificación simulada y registros de demostración" style={{ left: 130, bottom: 60 }} start={switchAt + 30} />
            <div style={{ position: 'absolute', right: 80, bottom: 30, fontFamily: F.body, fontSize: 17, color: C.ink600 }}>Límites: DANE · MGN 2018</div>
          </>
        )}
      </AbsoluteFill>
    </Bg>
  );
};

/* M4 — Registros de campo: validar */
export const M4: React.FC = () => {
  const act = center('reg_accion');
  return (
    <Bg tone="alt" contours={false}>
      <ProtoTag module="Registros de campo" />
      <BrowserFrame
        {...FRAME}
        url="mogollo7.github.io/PITB-Antioquia/#registros"
        layers={[
          { src: 'proto/09_registros_suroeste.png', from: 0 },
          { src: 'proto/10_registros_validado.png', from: 94 },
        ]}
        cam={[
          { f: 0, x: 1280, y: 800, s: 1 },
          { f: 8, x: 1280, y: 800, s: 1 },
          { f: 36, x: 1700, y: 820, s: 1.45 },
          { f: 240, x: 1720, y: 830, s: 1.5 },
        ]}
        cursor={[
          { f: 6, x: 1600, y: 1350 },
          { f: 70, x: act.x - 60, y: act.y + 40 },
          { f: 90, x: act.x, y: act.y, click: true },
          { f: 240, x: act.x + 60, y: act.y + 120 },
        ]}
        callouts={[
          { from: 24, to: 86, box: b.reg_estado, label: 'Recién publicado: pendiente', side: 'bottom', dim: false },
          { from: 100, to: 240, box: b.reg_fila, label: 'Validado por CAR e investigadores', side: 'bottom' },
        ]}
      />
      <Click at={[90]} />
    </Bg>
  );
};

/* M5 — cada foto se convierte en un dato */
const DWC: [string, string][] = [
  ['scientificName', 'Tremarctos ornatus'],
  ['vernacularName', 'oso de anteojos'],
  ['basisOfRecord', 'HumanObservation'],
  ['stateProvince', 'Antioquia'],
  ['locality', 'Subregión Suroeste'],
  ['dataGeneralizations', 'coordenadas generalizadas (VU)'],
  ['identifiedBy', 'BioCLIP + revisión humana'],
  ['identificationVerificationStatus', 'validado'],
];

export const M5: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ph = pop(f, fps, 4, 16, 120);
  return (
    <Bg tone="dark">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center' }}>
        <Title size={84} dark>
          <Words text="Así, cada foto se convierte" start={4} every={3} />
          <span style={{ color: C.olive400 }}>
            <Words text="en un dato." start={22} every={3} />
          </span>
        </Title>
      </div>
      <div style={{ position: 'absolute', left: 150, top: 330, opacity: Math.min(1, ph), transform: `scale(${0.9 + 0.1 * Math.min(1, ph)}) rotate(${(1 - Math.min(1, ph)) * -4}deg)` }}>
        <Photo src="species/tremarctos-ornatus.jpg" w={620} h={440} credit="Foto: *snowwhite* · iNaturalist (CC BY-NC-SA)" />
      </div>
      <div style={{ position: 'absolute', left: 808, top: 520, opacity: appear(f, 30, 12) }}>
        <Icon name="arrow" size={84} color={C.olive400} stroke={2.2} />
      </div>
      <div style={{ position: 'absolute', left: 930, top: 330, width: 840, ...rise(f, 34) }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${C.borderDark}`, borderRadius: 22, padding: '30px 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontFamily: F.body, fontWeight: 800, letterSpacing: '0.1em', fontSize: 20, color: C.olive400 }}>REGISTRO · DARWIN CORE</span>
            <Pill tone="leaf" size={18}>
              <Icon name="check" size={18} color={C.forest900} /> Validado
            </Pill>
          </div>
          {DWC.map(([k, v], i) => {
            const a = appear(f, 44 + i * 7, 10);
            return (
              <div key={k} style={{ display: 'flex', gap: 14, fontFamily: F.mono, fontSize: 25, lineHeight: 1.75, opacity: a, transform: `translateX(${(1 - a) * 16}px)` }}>
                <span style={{ color: C.onDarkMuted, minWidth: 0 }}>{k}:</span>
                <span style={{ color: C.cream100, fontWeight: 600 }}>{v}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Bg>
  );
};
