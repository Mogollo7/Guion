import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Isologo } from '../components';
import { C, F, clamp, EASE } from '../theme';
import { Bubble, Mascot } from './Mascot';
import { ArcFly, Burst, Check, Confetti, Deco, Kinetic, Laptop, MapPin, Phone, Pop, Ripple, StepTag, Tap, UICrop, elastic } from './kit';
import mb from '../data/boxes-mobile.json';
import db from '../data/boxes.json';

const H = (k: string) => (mb as Record<string, number>)[`${k}__h`];
const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 0.5 }) => (
  <Sequence from={at} durationInFrames={30}>
    <Audio src={staticFile(`sfx/${src}`)} volume={vol} />
  </Sequence>
);
const Bg: React.FC<{ color: string; deco?: string; children?: React.ReactNode }> = ({ color, deco, children }) => (
  <AbsoluteFill style={{ background: color, overflow: 'hidden', fontFamily: F.body }}>
    {deco && <Deco color={deco} />}
    {children}
  </AbsoluteFill>
);
/** Entrada desde abajo con resorte */
const useRise = (at: number, dist = 900) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
  return (1 - s) * dist;
};
const Polaroid: React.FC<{ w?: number }> = ({ w = 150 }) => (
  <div style={{ background: '#fff', padding: w * 0.06, paddingBottom: w * 0.16, borderRadius: 8, boxShadow: '0 12px 26px -8px rgba(0,0,0,0.45)' }}>
    <Img src={staticFile('species/tremarctos-ornatus.jpg')} style={{ width: w, height: w * 0.72, objectFit: 'cover', display: 'block', borderRadius: 4 }} />
  </div>
);
const Label: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 24, letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? C.olive400 : C.green700, marginBottom: 10 }}>{children}</div>
);
const Note: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; at?: number }> = ({ children, style, at = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', opacity: interpolate(f, [at, at + 10], [0, 1], clamp), background: C.warnBg, color: C.warn, fontFamily: F.body, fontWeight: 700, fontSize: 20, padding: '8px 16px', borderRadius: 999, ...style }}>
      {children}
    </div>
  );
};

/* ===================== HOOK ===================== */
export const PHook: React.FC = () => {
  const rise = useRise(66, 700);
  return (
    <Bg color={C.cream100} deco={C.leaf500}>
      <Kinetic
        style={{ position: 'absolute', left: 140, top: 300, width: 900 }}
        size={150}
        words={[
          { t: '¿Qué', at: 0 },
          { t: 'especie', at: 7, hl: C.olive400 },
          { t: '\n', at: 0 },
          { t: 'es', at: 15 },
          { t: 'esta?', at: 22, color: C.green700 },
        ]}
      />
      <Pop at={26} x={1010} y={190} rot={4} tilt={-30}>
        <div style={{ background: '#fff', padding: 22, paddingBottom: 70, borderRadius: 14, boxShadow: '0 40px 80px -30px rgba(7,56,33,0.6)' }}>
          <Img src={staticFile('species/tremarctos-ornatus.jpg')} style={{ width: 560, height: 400, objectFit: 'cover', borderRadius: 6, display: 'block' }} />
          <div style={{ position: 'absolute', left: 22, bottom: 18, fontFamily: F.body, fontWeight: 600, fontSize: 18, color: C.ink600 }}>Foto: *snowwhite* · iNaturalist (CC BY-NC-SA)</div>
        </div>
      </Pop>
      {[
        [1000, 170, 40, -12],
        [1590, 230, 48, 14],
        [1560, 560, 56, -6],
      ].map(([x, y, at, r], i) => (
        <Pop key={i} at={at} x={x} y={y} rot={r}>
          <div style={{ width: 92, height: 92, borderRadius: 46, background: C.leaf500, color: C.forest900, fontFamily: F.display, fontWeight: 700, fontSize: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px -8px rgba(0,0,0,0.3)' }}>?</div>
        </Pop>
      ))}
      <div style={{ position: 'absolute', left: 1450, top: 520 + rise }}>
        <Mascot size={520} pose="pointLeft" prevPose="idle" poseAt={80} mouth="o" lookX={-1} lookY={-0.4} />
      </div>
      <Sfx at={0} src="pop.ogg" vol={0.4} />
      <Sfx at={26} src="card.ogg" vol={0.6} />
      <Sfx at={40} src="pop.ogg" vol={0.35} />
      <Sfx at={48} src="pop.ogg" vol={0.35} />
      <Sfx at={56} src="pop.ogg" vol={0.35} />
    </Bg>
  );
};

/* ===================== TREMI ===================== */
export const PTremi: React.FC = () => {
  return (
    <Bg color={C.leaf500} deco={C.cream100}>
      <div style={{ position: 'absolute', left: 560, top: 260 }}>
        <Mascot size={700} pose="wave" prevPose="idle" poseAt={6} mouth="grin" jumpAt={[2]} lookX={0.3} />
      </div>
      <Bubble at={16} out={58} tail="left" style={{ left: 1150, top: 300 }}>
        ¡Hola! Soy Tremi,
        <br />
        un oso de anteojos.
      </Bubble>
      <Bubble at={62} tail="left" style={{ left: 1150, top: 300 }}>
        Te muestro cómo
        <br />
        funciona <span style={{ color: C.green700 }}>PITB Antioquia</span>.
      </Bubble>
      <Pop at={30} x={120} y={940}>
        <div style={{ background: C.forest900, color: C.cream100, borderRadius: 999, padding: '12px 24px', fontFamily: F.body, fontWeight: 700, fontSize: 24 }}>
          <i>Tremarctos ornatus</i> · especie vulnerable (VU) de los Andes
        </div>
      </Pop>
      <Sfx at={2} src="jump.ogg" vol={0.5} />
      <Sfx at={16} src="pop.ogg" vol={0.5} />
      <Sfx at={62} src="pop.ogg" vol={0.5} />
    </Bg>
  );
};

/* ===================== LOGO ===================== */
export const PLogo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = elastic(f, fps, 2, 10, 140, 0.8);
  return (
    <Bg color={C.forest900} deco={C.olive400}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * s})` }}>
          <Isologo height={170} progress={interpolate(f, [2, 56], [0, 1], clamp)} dark />
        </div>
        <div style={{ marginTop: 60 }}>
          <Kinetic
            size={44}
            font="body"
            color={C.onDark}
            align="center"
            words={[
              { t: 'Catálogo', at: 60 },
              { t: 'vivo', at: 64, color: C.olive400 },
              { t: 'de', at: 68 },
              { t: 'biodiversidad', at: 72 },
              { t: 'con', at: 76 },
              { t: 'IA', at: 80, color: C.olive400 },
            ]}
          />
        </div>
      </AbsoluteFill>
      <Burst at={50} x={960} y={500} color={C.olive400} r={300} n={14} />
      <Sfx at={2} src="whoosh.ogg" vol={0.5} />
      <Sfx at={50} src="bong.ogg" vol={0.55} />
    </Bg>
  );
};

/* ===================== F1 · SUBE UNA FOTO + FILTROS ===================== */
const PW = 380;
const PK = PW / 1170;

export const PUpload: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = useRise(0, 1000);
  const px = 1040;
  const py = 70;
  const ox = px + 14;
  const oy = py + 14;
  const dz = { x: ox + (mb.m_dropzone.x + mb.m_dropzone.w / 2) * PK, y: oy + (mb.m_dropzone.y + mb.m_dropzone.h / 2 - 900) * PK };
  const chips = ['Mamíferos', 'Aves', 'Anfibios', 'Reptiles', 'Flora'];
  const active = f < 150 ? -1 : f < 185 ? 0 : 2;
  return (
    <Bg color={C.cream100} deco={C.leaf500}>
      <StepTag n={1} text="Explorar" at={0} style={{ left: 130, top: 170 }} />
      <Kinetic
        style={{ position: 'absolute', left: 130, top: 270, width: 820 }}
        size={124}
        words={[
          { t: 'Sube', at: 6 },
          { t: 'una', at: 12 },
          { t: 'foto', at: 18, hl: C.olive400 },
        ]}
      />
      <Kinetic style={{ position: 'absolute', left: 130, top: 540, width: 820 }} size={64} words={[{ t: 'y', at: 128 }, { t: 'filtra', at: 132 }, { t: 'por', at: 136 }, { t: 'grupo', at: 140, color: C.green700 }]} />
      <div style={{ position: 'absolute', left: 130, top: 650, display: 'flex', flexWrap: 'wrap', gap: 14, width: 760 }}>
        {chips.map((c, i) => (
          <div key={c} style={{ transform: `scale(${elastic(f, fps, 146 + i * 5)})` }}>
            <div
              style={{
                padding: '14px 28px',
                borderRadius: 999,
                fontFamily: F.body,
                fontWeight: 800,
                fontSize: 30,
                background: active === i ? C.forest900 : '#fff',
                color: active === i ? '#fff' : C.ink600,
                border: `2px solid ${active === i ? C.forest900 : 'rgba(18,35,24,0.12)'}`,
                transform: `scale(${active === i ? 1.08 : 1})`,
              }}
            >
              {c}
            </div>
          </div>
        ))}
      </div>
      <Phone
        x={px}
        y={py + rise}
        w={PW}
        tiltY={-10 + Math.sin(f / 40) * 3}
        screen={{
          layers: [
            { src: 'mobile/m01_explorar.png', from: 0, h: H('m01_explorar') },
            { src: 'mobile/m02_foto.png', from: 72, h: H('m02_foto') },
            { src: 'mobile/m03_filtro_mamiferos.png', from: 150, h: H('m03_filtro_mamiferos') },
            { src: 'mobile/m03_filtro_anfibios.png', from: 185, h: H('m03_filtro_anfibios') },
          ],
          scroll: [
            { f: 0, y: 900 },
            { f: 120, y: 900 },
            { f: 140, y: 3250 },
          ],
        }}
      />
      {/* Tremi lanza la foto al teléfono */}
      <div style={{ position: 'absolute', left: 1460, top: 470 + rise * 0.4 }}>
        <Mascot size={500} flip pose={f < 52 ? 'hold' : 'point'} prevPose={f < 52 ? 'idle' : 'hold'} poseAt={f < 52 ? 8 : 52} mouth={f < 70 ? 'smile' : 'grin'} lookX={1} lookY={-0.6} holding={f < 54 ? <div style={{ transform: 'translate(-40%, -20%) rotate(-8deg)' }}><Polaroid w={110} /></div> : undefined} jumpAt={[74]} />
      </div>
      <ArcFly from={{ x: 1600, y: 760 }} to={dz} at={54} dur={16} height={180} s0={1} s1={0.55} spin={-20}>
        <Polaroid w={130} />
      </ArcFly>
      <Ripple at={70} x={dz.x} y={dz.y} size={260} />
      <Burst at={70} x={dz.x} y={dz.y} r={110} />
      <Sfx at={0} src="whoosh.ogg" vol={0.4} />
      <Sfx at={54} src="whoosh.ogg" vol={0.35} />
      <Sfx at={70} src="drop.ogg" vol={0.6} />
      {[146, 151, 156, 161, 166].map((t) => (
        <Sfx key={t} at={t} src="pop.ogg" vol={0.3} />
      ))}
      <Sfx at={150} src="click.ogg" vol={0.5} />
      <Sfx at={185} src="click.ogg" vol={0.5} />
    </Bg>
  );
};

/* ===================== F2 · BIOCLIP IDENTIFICA ===================== */
export const PIdentify: React.FC = () => {
  const f = useCurrentFrame();
  const px = 760;
  const py = 110;
  const ox = px + 14;
  const oy = py + 14;
  const an = { x: ox + (mb.m_analizar.x + mb.m_analizar.w / 2) * PK, y: oy + (mb.m_analizar.y + mb.m_analizar.h / 2 - 1500) * PK };
  const steps = ['Normaliza la imagen', 'Embeddings visuales (BioCLIP)', 'Árbol de la vida · TreeOfLife-10M', 'Top-3 de coincidencias'];
  const cardScale = 0.52;
  return (
    <Bg color={C.forest900} deco={C.olive400}>
      <StepTag n={2} text="BioCLIP" at={0} dark style={{ left: 130, top: 150 }} />
      <Kinetic
        style={{ position: 'absolute', left: 130, top: 250, width: 600 }}
        size={96}
        color={C.cream100}
        words={[
          { t: 'La', at: 4 },
          { t: 'IA', at: 8, color: C.olive400 },
          { t: '\n', at: 0 },
          { t: 'identifica', at: 14 },
          { t: '\n', at: 0 },
          { t: 'la', at: 20 },
          { t: 'especie', at: 24 },
        ]}
      />
      <Phone
        x={px}
        y={py}
        w={PW}
        tiltY={8}
        screen={{
          layers: [
            { src: 'mobile/m02_foto.png', from: 0, h: H('m02_foto') },
            { src: 'mobile/m04_procesando.png', from: 26, h: H('m04_procesando') },
            { src: 'mobile/m05_ficha.png', from: 100, h: H('m05_ficha') },
          ],
          scroll: [
            { f: 0, y: 1500 },
            { f: 24, y: 1500 },
            { f: 40, y: 2350 },
            { f: 96, y: 2350 },
            { f: 102, y: 1400 },
          ],
        }}
      />
      <Tap at={20} x={an.x} y={an.y} from={{ x: an.x + 120, y: an.y + 200 }} />
      {steps.map((s, i) => (
        <Pop key={s} at={40 + i * 12} x={1250} y={250 + i * 110} from={{ x: 960, y: 520 }} out={96}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.08)', border: `2px solid ${C.borderDark}`, borderRadius: 18, padding: '18px 26px', color: C.cream100, fontWeight: 800, fontSize: 30, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.leaf500 }}>✓</span> {s}
          </div>
        </Pop>
      ))}
      <Pop at={104} x={1240} y={210} from={{ x: 960, y: 520 }} tilt={-24}>
        <UICrop src="mobile/m05_ficha.png" imgW={1170} box={mb.m_top3} scale={cardScale} pad={6} />
      </Pop>
      <Pop at={124} x={1650} y={130} rot={8}>
        <div style={{ width: 200, height: 200, borderRadius: 100, background: C.leaf500, color: C.forest900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.45)' }}>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 64, lineHeight: 1 }}>{interpolate(f, [124, 150], [0, 88.7], { ...clamp, easing: EASE }).toFixed(1).replace('.', ',')}</div>
          <div style={{ fontWeight: 800, fontSize: 24 }}>% certeza</div>
        </div>
      </Pop>
      <Burst at={124} x={1750} y={230} color={C.olive400} r={140} />
      <div style={{ position: 'absolute', left: 150, top: 600 }}>
        <Mascot size={420} pose="present" prevPose="idle" poseAt={104} mouth={f < 104 ? 'o' : 'open'} lookX={0.9} lookY={-0.3} jumpAt={[126]} />
      </div>
      <Note at={130} style={{ left: 1240, top: 980 }}>
        Resultado simulado en el prototipo
      </Note>
      <Sfx at={20} src="click.ogg" vol={0.6} />
      {steps.map((_, i) => (
        <Sfx key={i} at={40 + i * 12} src="type.wav" vol={0.35} />
      ))}
      <Sfx at={104} src="card.ogg" vol={0.6} />
      <Sfx at={124} src="bong.ogg" vol={0.55} />
    </Bg>
  );
};

/* ===================== F3 · FICHA VERIFICABLE ===================== */
export const PFicha: React.FC = () => {
  const f = useCurrentFrame();
  const pw = 330;
  const k = pw / 1170;
  const px = 960 - (pw + 28) / 2;
  const py = 250;
  const ox = px + 14;
  const oy = py + 14;
  const scrollY = 300;
  const toScreen = (b: { x: number; y: number; w: number; h: number }) => ({ x: ox + (b.x + b.w / 2) * k, y: oy + (b.y + b.h / 2 - scrollY) * k });
  const pub = { x: 1300, y: 800 };
  const press = f >= 118 && f <= 124 ? 0.92 : 1;
  const cards = [
    { at: 18, x: 120, y: 300, label: 'Foto con autoría y licencia', box: { x: 72, y: 1190, w: 1026, h: 80 }, scale: 0.6, anchor: toScreen(mb.m_credito) },
    { at: 38, x: 120, y: 620, label: 'Taxonomía completa', box: mb.m_taxonomia, scale: 0.6, anchor: toScreen(mb.m_taxonomia) },
    { at: 58, x: 1300, y: 230, label: 'Top-3 con porcentaje', box: mb.m_top3, scale: 0.44, anchor: { x: ox + pw - 20, y: oy + 300 } },
  ];
  const line = (from: { x: number; y: number }, to: { x: number; y: number }, at: number) => {
    const p = interpolate(f, [at, at + 14], [0, 1], { ...clamp, easing: EASE });
    return <line x1={from.x} y1={from.y} x2={from.x + (to.x - from.x) * p} y2={from.y + (to.y - from.y) * p} stroke={C.leaf500} strokeWidth={4} strokeDasharray="10 8" />;
  };
  return (
    <Bg color={C.canvasAlt} deco={C.leaf500}>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 64 }}>
        <Kinetic size={84} align="center" words={[{ t: 'Cada', at: 0 }, { t: 'observación,', at: 5 }, { t: 'una', at: 10 }, { t: 'ficha', at: 14, hl: C.olive400 }, { t: 'verificable', at: 18 }]} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {line({ x: 120 + 616, y: 330 }, cards[0].anchor, 18)}
        {line({ x: 120 + 616, y: 680 }, cards[1].anchor, 38)}
        {line({ x: 1300, y: 400 }, cards[2].anchor, 58)}
        {line({ x: 1300, y: 840 }, { x: ox + pw / 2, y: oy + 620 }, 80)}
      </svg>
      <Phone
        x={px}
        y={py}
        w={pw}
        screen={{
          layers: [{ src: 'mobile/m05_ficha.png', from: 0, h: H('m05_ficha') }],
          scroll: [{ f: 0, y: scrollY }],
        }}
      />
      {cards.map((c) => (
        <Pop key={c.label} at={c.at} x={c.x} y={c.y} from={{ x: c.anchor.x - 200, y: c.anchor.y - 60 }} tilt={c.x > 960 ? -20 : 20}>
          <Label>{c.label}</Label>
          <UICrop src="mobile/m05_ficha.png" imgW={1170} box={c.box} scale={c.scale} pad={8} />
        </Pop>
      ))}
      <Pop at={80} x={pub.x} y={pub.y - 40} from={{ x: 960, y: 800 }}>
        <Label>Acciones</Label>
        <div style={{ transform: `scale(${press})` }}>
          <UICrop src="mobile/m05_ficha.png" imgW={1170} box={mb.m_publicar} scale={0.5} pad={6} radius={40} />
        </div>
      </Pop>
      <Tap at={120} x={pub.x + 256} y={pub.y + 42} from={{ x: pub.x + 400, y: pub.y + 200 }} />
      <Burst at={122} x={pub.x + 256} y={pub.y + 42} r={150} />
      <Sfx at={18} src="card.ogg" vol={0.5} />
      <Sfx at={38} src="card.ogg" vol={0.5} />
      <Sfx at={58} src="card.ogg" vol={0.5} />
      <Sfx at={80} src="card.ogg" vol={0.5} />
      <Sfx at={120} src="click.ogg" vol={0.6} />
    </Bg>
  );
};

/* ===================== F4 · AL MAPA ===================== */
const MARKERS = [[293, 633], [455, 635], [437, 648], [288, 651], [420, 658], [460, 701], [440, 712], [359, 758], [473, 783], [387, 783], [445, 795], [435, 801], [361, 816], [378, 813]];

export const PMap: React.FC = () => {
  const f = useCurrentFrame();
  const pw = 300;
  const k = pw / 1170;
  const px = 160;
  const py = 300;
  const ox = px + 14;
  const oy = py + 14;
  const sy = 5100;
  const pub = { x: ox + (mb.m_publicar.x + mb.m_publicar.w / 2) * k, y: oy + (mb.m_publicar.y + mb.m_publicar.h / 2 - sy) * k };
  const lw = 1060;
  const lk = lw / 1280;
  const lx = 790;
  const ly = 230;
  const lox = lx + 18;
  const loy = ly + 28;
  const lsy = 100;
  const target = { x: lox + 370 * lk, y: loy + (815 - lsy) * lk };
  const land = 50;
  const bounce = f >= land ? Math.abs(Math.sin(((f - land) / 14) * Math.PI)) * Math.max(0, 1 - (f - land) / 28) * 40 : 0;
  return (
    <Bg color={C.okBg} deco={C.green700}>
      <StepTag n={4} text="Tablero territorial" at={0} style={{ left: 130, top: 90 }} />
      <Kinetic style={{ position: 'absolute', left: 130, top: 170, width: 720 }} size={72} words={[{ t: 'Directo', at: 4 }, { t: 'al', at: 9 }, { t: 'mapa', at: 14, hl: C.olive400 }]} />
      <Laptop
        x={lx}
        y={ly}
        w={lw}
        screen={{
          imgW: 1280,
          layers: [{ src: 'ext/tablero.jpg', from: 0, h: 900 }],
          scroll: [{ f: 0, y: lsy }],
          extras: () => (
            <>
              {MARKERS.map(([x, y], i) => {
                const t = (f - land - i * 2) / 26;
                if (t < 0) return null;
                const p = t % 1;
                return <div key={i} style={{ position: 'absolute', left: x - 6 - p * 16, top: y - 6 - p * 16, width: 12 + p * 32, height: 12 + p * 32, borderRadius: '50%', border: `3px solid ${C.mapAccent}`, opacity: 1 - p }} />;
              })}
            </>
          ),
        }}
      >
        <Note at={70} style={{ right: 30, bottom: 30 }}>
          Datos ilustrativos · © OpenStreetMap
        </Note>
      </Laptop>
      <Phone
        x={px}
        y={py}
        w={pw}
        tiltY={14}
        screen={{
          layers: [
            { src: 'mobile/m05_ficha.png', from: 0, h: H('m05_ficha') },
            { src: 'mobile/m06_publicada.png', from: 18, h: H('m06_publicada') },
          ],
          scroll: [{ f: 0, y: sy }],
        }}
      />
      <Tap at={14} x={pub.x} y={pub.y} from={{ x: pub.x + 80, y: pub.y + 160 }} />
      <ArcFly from={pub} to={{ x: target.x, y: target.y - 40 }} at={22} dur={28} height={320} s0={0.6} s1={1} hideAfter={false}>
        <div style={{ transform: `translateY(${-bounce}px)` }}>
          <MapPin size={64} />
        </div>
      </ArcFly>
      <Confetti at={land} x={target.x} y={target.y - 40} seed="map" />
      <Ripple at={land} x={target.x} y={target.y} size={220} color={C.mapAccent} />
      <Sfx at={14} src="click.ogg" vol={0.6} />
      <Sfx at={22} src="whoosh.ogg" vol={0.45} />
      <Sfx at={land} src="drop.ogg" vol={0.6} />
      <Sfx at={land + 2} src="bong.ogg" vol={0.45} />
    </Bg>
  );
};

/* ===================== F5 · VALIDACIÓN ===================== */
export const PValidate: React.FC = () => {
  const f = useCurrentFrame();
  const lw = 1120;
  const lx = 640;
  const ly = 110;
  const base = lw / 2560;
  const s = 1.6;
  const k = base * s;
  const sx = 900;
  const sy = 560;
  const lox = lx + 18;
  const loy = ly + 28;
  const act = { x: lox + (db.reg_accion.x + db.reg_accion.w / 2 - sx) * k, y: loy + (db.reg_accion.y + db.reg_accion.h / 2 - sy) * k };
  const click = 40;
  return (
    <Bg color={C.cream100} deco={C.leaf500}>
      <StepTag n={5} text="Registros de campo" at={0} style={{ left: 130, top: 120 }} />
      <Kinetic style={{ position: 'absolute', left: 130, top: 210, width: 520 }} size={84} words={[{ t: 'Expertos', at: 4 }, { t: 'y', at: 8 }, { t: 'CAR', at: 12, color: C.green700 }, { t: 'validan', at: 18, hl: C.olive400 }]} />
      <Laptop
        x={lx}
        y={ly}
        w={lw}
        screen={{
          imgW: 2560,
          layers: [
            { src: 'proto/09_registros_suroeste.png', from: 0, h: 1600 },
            { src: 'proto/10_registros_validado.png', from: click + 4, h: 1600 },
          ],
          scroll: [{ f: 0, y: sy, x: sx, s }],
        }}
      />
      <Tap at={click} x={act.x} y={act.y} from={{ x: act.x - 160, y: act.y + 220 }} />
      <Check at={click + 8} x={act.x - 260} y={act.y + 270} size={190} />
      <Burst at={click + 8} x={act.x - 260} y={act.y + 270} r={170} />
      <Confetti at={click + 10} x={act.x - 260} y={act.y + 200} seed="val" n={60} />
      <div style={{ position: 'absolute', left: 150, top: 560 }}>
        <Mascot size={480} pose={f < click + 8 ? 'idle' : 'celebrate'} prevPose="idle" poseAt={click + 8} mouth={f < click + 8 ? 'smile' : 'open'} lookX={0.8} jumpAt={[click + 10, click + 40]} />
      </div>
      <Sfx at={click} src="click.ogg" vol={0.6} />
      <Sfx at={click + 8} src="bong.ogg" vol={0.6} />
      <Sfx at={click + 10} src="jump.ogg" vol={0.4} />
    </Bg>
  );
};

/* ===================== OUTRO ===================== */
export const POutro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = elastic(f, fps, 104, 10, 150, 0.7);
  return (
    <Bg color={C.forest900} deco={C.olive400}>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 220 }}>
        <Kinetic
          size={128}
          align="center"
          color={C.cream100}
          out={76}
          words={[
            { t: 'Cada', at: 4 },
            { t: 'foto', at: 10 },
            { t: '\n', at: 0 },
            { t: 'se', at: 19 },
            { t: 'convierte', at: 23 },
            { t: '\n', at: 0 },
            { t: 'en', at: 34 },
            { t: 'un', at: 38 },
            { t: 'dato.', at: 44, color: C.olive400 },
          ]}
        />
      </AbsoluteFill>
      {f >= 104 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 80 }}>
          <div style={{ transform: `scale(${logo})` }}>
            <Isologo height={130} dark tagline />
          </div>
          <div style={{ marginTop: 48, transform: `scale(${elastic(f, fps, 116)})`, background: C.leaf500, color: C.forest900, fontWeight: 800, fontSize: 32, padding: '14px 32px', borderRadius: 999 }}>mogollo7.github.io/PITB-Antioquia</div>
          <div style={{ marginTop: 26, opacity: interpolate(f, [126, 138], [0, 1], clamp), color: C.onDarkMuted, fontWeight: 600, fontSize: 24 }}>Territorio Sostenible · Agenda Antioquia 2040</div>
        </AbsoluteFill>
      )}
      <div style={{ position: 'absolute', left: 1500, top: 640 }}>
        <Mascot size={420} pose="wave" prevPose="idle" poseAt={100} mouth="grin" lookX={-0.6} jumpAt={[100]} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', color: C.onDarkMuted, fontSize: 17, fontWeight: 500, opacity: interpolate(f, [110, 124], [0, 1], clamp) }}>
        Prototipo académico con datos de demostración · Fotos: autores en iNaturalist (CC) · Música: Sascha Ende, ende.app (CC BY 4.0) · Efectos: Kenney (CC0)
      </div>
      {[4, 10, 19, 23, 34, 38].map((t) => (
        <Sfx key={t} at={t} src="pop.ogg" vol={0.3} />
      ))}
      <Sfx at={44} src="bong.ogg" vol={0.5} />
      <Sfx at={104} src="whoosh.ogg" vol={0.45} />
    </Bg>
  );
};
