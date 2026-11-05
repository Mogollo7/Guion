import React from 'react';
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, EASE, EASE_IN_OUT, F, clamp } from '../theme';

/* ------------------------------------------------------------------ */
/* Tiempo musical: 120 BPM a 30 fps → 1 beat = 15 cuadros, 1 compás = 60 */
/* ------------------------------------------------------------------ */
export const BEAT = 15;
export const BAR = 60;

export const elastic = (f: number, fps: number, at: number, damping = 9, stiffness = 170, mass = 0.6) =>
  spring({ frame: f - at, fps, config: { damping, stiffness, mass } });

export const lerpKeys = (keys: { f: number; v: number }[], f: number) => {
  if (f <= keys[0].f) return keys[0].v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f <= b.f) return a.v + (b.v - a.v) * EASE_IN_OUT((f - a.f) / Math.max(1, b.f - a.f));
  }
  return keys[keys.length - 1].v;
};

/* ------------------------------------------------------------------ */
/* Pantalla con capas (capturas reales) y desplazamiento                */
/* ------------------------------------------------------------------ */
export type ScreenLayer = { src: string; from: number; h: number };
export type ScrollKey = { f: number; y: number; s?: number; x?: number };

export const Screen: React.FC<{
  layers: ScreenLayer[];
  imgW: number;
  w: number;
  h: number;
  scroll?: ScrollKey[];
  extras?: (k: number) => React.ReactNode;
  radius?: number;
}> = ({ layers, imgW, w, h, scroll = [{ f: 0, y: 0 }], extras, radius = 0 }) => {
  const f = useCurrentFrame();
  const base = w / imgW;
  const s = lerpKeys(scroll.map((k) => ({ f: k.f, v: k.s ?? 1 })), f);
  const k = base * s;
  const active = [...layers].reverse().find((l) => f >= l.from) ?? layers[0];
  let y = lerpKeys(scroll.map((kk) => ({ f: kk.f, v: kk.y })), f);
  let x = lerpKeys(scroll.map((kk) => ({ f: kk.f, v: kk.x ?? 0 })), f);
  y = Math.max(0, Math.min(y, active.h - h / k));
  x = Math.max(0, Math.min(x, imgW - w / k));
  return (
    <div style={{ position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: radius, background: C.cream100 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `scale(${k}) translate(${-x}px, ${-y}px)` }}>
        {layers.map((l, i) => {
          const next = layers[i + 1];
          if (f < l.from || (next && f >= next.from + 6)) return null;
          const o = i === 0 ? 1 : interpolate(f, [l.from, l.from + 6], [0, 1], clamp);
          return <Img key={l.src + i} src={staticFile(l.src)} style={{ position: 'absolute', left: 0, top: 0, width: imgW, opacity: o }} />;
        })}
        {extras?.(k)}
      </div>
    </div>
  );
};

/* Teléfono genérico (sin marca) */
export const Phone: React.FC<{
  x: number;
  y: number;
  w?: number; // ancho de pantalla
  screen: Omit<React.ComponentProps<typeof Screen>, 'w' | 'h' | 'imgW'> & { imgW?: number };
  tiltY?: number;
  tiltX?: number;
  rot?: number;
  scale?: number;
  float?: boolean;
  children?: React.ReactNode;
}> = ({ x, y, w = 380, screen, tiltY = 0, tiltX = 0, rot = 0, scale = 1, float = true, children }) => {
  const f = useCurrentFrame();
  const h = (w * 844) / 390;
  const bz = 14;
  const fy = float ? Math.sin(f / 20) * 6 : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y + fy, perspective: 1800 }}>
      <div
        style={{
          width: w + bz * 2,
          height: h + bz * 2,
          borderRadius: 58,
          background: 'linear-gradient(145deg, #1d2a22, #0b120e)',
          padding: bz,
          boxSizing: 'border-box',
          boxShadow: '0 50px 90px -30px rgba(7,56,33,0.55), inset 0 0 0 2px rgba(255,255,255,0.08)',
          transform: `rotateY(${tiltY}deg) rotateX(${tiltX}deg) rotate(${rot}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        <Screen imgW={screen.imgW ?? 1170} w={w} h={h} radius={44} {...screen} />
        <div style={{ position: 'absolute', top: bz + 12, left: '50%', width: 16, height: 16, marginLeft: -8, borderRadius: 8, background: '#05080a' }} />
        {children}
      </div>
    </div>
  );
};

/* Portátil genérico */
export const Laptop: React.FC<{
  x: number;
  y: number;
  w?: number;
  screen: Omit<React.ComponentProps<typeof Screen>, 'w' | 'h'>;
  tiltX?: number;
  scale?: number;
  children?: React.ReactNode;
}> = ({ x, y, w = 1000, screen, tiltX = 0, scale = 1, children }) => {
  const h = (w * 10) / 16;
  const bz = 18;
  return (
    <div style={{ position: 'absolute', left: x, top: y, perspective: 2200, transform: `scale(${scale})`, transformOrigin: '50% 100%' }}>
      <div style={{ transform: `rotateX(${tiltX}deg)`, transformOrigin: '50% 100%' }}>
        <div style={{ width: w + bz * 2, height: h + bz * 2 + 10, background: '#141b17', borderRadius: '26px 26px 8px 8px', padding: bz, paddingTop: bz + 10, boxSizing: 'border-box', position: 'relative', boxShadow: '0 40px 80px -30px rgba(7,56,33,0.55)' }}>
          <div style={{ position: 'absolute', top: 10, left: '50%', width: 10, height: 10, marginLeft: -5, borderRadius: 5, background: '#2d3a33' }} />
          <Screen w={w} h={h} radius={6} {...screen} />
          {children}
        </div>
      </div>
      <div style={{ width: w + bz * 2 + 120, marginLeft: -60, height: 26, background: 'linear-gradient(#cfd6d1, #9aa69f)', borderRadius: '0 0 30px 30px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, width: 160, height: 10, marginLeft: -80, background: '#8a958f', borderRadius: '0 0 10px 10px' }} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Recorte de UI real que "sale" del dispositivo                        */
/* ------------------------------------------------------------------ */
export const UICrop: React.FC<{ src: string; imgW: number; box: { x: number; y: number; w: number; h: number }; scale: number; radius?: number; pad?: number; style?: React.CSSProperties }> = ({
  src,
  imgW,
  box,
  scale,
  radius = 22,
  pad = 0,
  style,
}) => (
  <div
    style={{
      width: (box.w + pad * 2) * scale,
      height: (box.h + pad * 2) * scale,
      overflow: 'hidden',
      borderRadius: radius,
      position: 'relative',
      background: '#fff',
      boxShadow: '0 30px 60px -24px rgba(7,56,33,0.55), 0 0 0 1.5px rgba(18,35,24,0.08)',
      ...style,
    }}
  >
    <Img src={staticFile(src)} style={{ position: 'absolute', width: imgW * scale, left: -(box.x - pad) * scale, top: -(box.y - pad) * scale, maxWidth: 'none' }} />
  </div>
);

/** Envoltura de "pop" elástico con inclinación 3D */
export const Pop: React.FC<{ at: number; x: number; y: number; from?: { x: number; y: number }; rot?: number; tilt?: number; out?: number; children: React.ReactNode; origin?: string }> = ({
  at,
  x,
  y,
  from,
  rot = 0,
  tilt = 0,
  out,
  children,
  origin = '50% 50%',
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = elastic(f, fps, at);
  const sx = from ? from.x + (x - from.x) * Math.min(1.08, s) : x;
  const sy = from ? from.y + (y - from.y) * Math.min(1.08, s) : y;
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], clamp) : 1;
  const bob = Math.sin((f - at) / 18) * 4;
  return (
    <div
      style={{
        position: 'absolute',
        left: sx,
        top: sy + bob,
        transform: `perspective(1400px) rotateY(${tilt * (1 - Math.min(1, s)) + tilt * 0.25}deg) rotate(${rot * Math.min(1, s)}deg) scale(${s})`,
        transformOrigin: origin,
        opacity: o,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Tipografía cinética                                                 */
/* ------------------------------------------------------------------ */
export const Kinetic: React.FC<{
  words: { t: string; at: number; hl?: string; color?: string }[];
  size?: number;
  color?: string;
  out?: number;
  align?: 'left' | 'center';
  style?: React.CSSProperties;
  font?: 'display' | 'body';
}> = ({ words, size = 110, color = C.ink900, out, align = 'left', style, font = 'display' }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: font === 'display' ? F.display : F.body, fontWeight: font === 'display' ? 700 : 800, fontSize: size, lineHeight: 1.05, letterSpacing: '-0.02em', color, textAlign: align, ...style }}>
      {words.map((w, i) => {
        if (w.t === '\n') return <br key={i} />;
        const s = elastic(f, fps, w.at, 8, 190, 0.55);
        const gone = out !== undefined ? interpolate(f, [out + i * 2, out + i * 2 + 8], [1, 0], clamp) : 1;
        const hl = w.hl ? interpolate(f, [w.at + 4, w.at + 12], [0, 1], { ...clamp, easing: EASE }) : 0;
        return (
          <span key={i} style={{ display: 'inline-block', position: 'relative', marginRight: '0.22em', transform: `translateY(${(1 - Math.min(1, s)) * 50 + (1 - gone) * -40}px) scale(${Math.max(0, s) * (0.6 + 0.4 * gone)}) rotate(${(1 - Math.min(1, s)) * -10}deg)`, opacity: Math.min(1, s * 3) * gone, transformOrigin: '50% 80%' }}>
            {w.hl && <span style={{ position: 'absolute', left: '-0.08em', right: '-0.08em', bottom: '0.06em', height: '0.42em', background: w.hl, borderRadius: '0.12em', transform: `scaleX(${hl})`, transformOrigin: '0 50%', zIndex: -1 }} />}
            <span style={{ position: 'relative', color: w.color ?? color }}>{w.t}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Etiqueta de paso "1 · Sube una foto" */
export const StepTag: React.FC<{ n: number; text: string; at: number; dark?: boolean; style?: React.CSSProperties }> = ({ n, text, at, dark, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = elastic(f, fps, at);
  return (
    <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: 18, transform: `scale(${s})`, transformOrigin: '0 50%', ...style }}>
      <div style={{ width: 74, height: 74, borderRadius: 37, background: dark ? C.leaf500 : C.forest900, color: dark ? C.forest900 : C.olive400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 40 }}>{n}</div>
      <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 30, letterSpacing: '0.1em', textTransform: 'uppercase', color: dark ? C.olive400 : C.green700 }}>{text}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Efectos                                                             */
/* ------------------------------------------------------------------ */
export const Confetti: React.FC<{ at: number; x: number; y: number; n?: number; seed?: string; spread?: number }> = ({ at, x, y, n = 46, seed = 'c', spread = 1 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 70) return null;
  const cols = [C.leaf500, C.olive400, C.mapAccent, '#f6c344', C.cream100, C.green700];
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const v = (8 + random(`${seed}v${i}`) * 14) * spread;
        const px = x + Math.cos(a) * v * t;
        const py = y + Math.sin(a) * v * t * 0.8 + 0.55 * t * t;
        const r = random(`${seed}r${i}`) * 360 + t * 12;
        const sz = 10 + random(`${seed}s${i}`) * 12;
        return <div key={i} style={{ position: 'absolute', left: px, top: py, width: sz, height: sz * 0.55, background: cols[i % cols.length], transform: `rotate(${r}deg)`, borderRadius: 3, opacity: interpolate(t, [50, 70], [1, 0], clamp) }} />;
      })}
    </>
  );
};

export const Burst: React.FC<{ at: number; x: number; y: number; color?: string; r?: number; n?: number }> = ({ at, x, y, color = C.leaf500, r = 120, n = 10 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 18) return null;
  const p = EASE(t / 18);
  return (
    <svg style={{ position: 'absolute', left: x - r * 1.5, top: y - r * 1.5, overflow: 'visible' }} width={r * 3} height={r * 3}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const r0 = r * (0.45 + 0.5 * p);
        const r1 = r * (0.6 + 0.8 * p);
        const cx = r * 1.5;
        return <line key={i} x1={cx + Math.cos(a) * r0} y1={cx + Math.sin(a) * r0} x2={cx + Math.cos(a) * r1} y2={cx + Math.sin(a) * r1} stroke={color} strokeWidth={9 * (1 - p) + 2} strokeLinecap="round" />;
      })}
    </svg>
  );
};

export const Ripple: React.FC<{ at: number; x: number; y: number; color?: string; size?: number }> = ({ at, x, y, color = C.leaf500, size = 120 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 20) return null;
  const p = t / 20;
  return <div style={{ position: 'absolute', left: x - (size * p) / 2, top: y - (size * p) / 2, width: size * p, height: size * p, borderRadius: '50%', border: `${6 * (1 - p) + 1}px solid ${color}`, opacity: 1 - p }} />;
};

/** Dedo / toque */
export const Tap: React.FC<{ at: number; x: number; y: number; from?: { x: number; y: number }; size?: number }> = ({ at, x, y, from, size = 70 }) => {
  const f = useCurrentFrame();
  const appearAt = at - 16;
  if (f < appearAt || f > at + 26) return null;
  const mv = interpolate(f, [appearAt, at - 3], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const fx = from ? from.x + (x - from.x) * mv : x;
  const fy = from ? from.y + (y - from.y) * mv : y;
  const press = f >= at - 3 && f <= at + 3 ? 0.8 : 1;
  const o = interpolate(f, [appearAt, appearAt + 5, at + 18, at + 26], [0, 1, 1, 0], clamp);
  return (
    <>
      <Ripple at={at} x={x} y={y} size={size * 2.2} />
      <div style={{ position: 'absolute', left: fx - size / 2, top: fy - size / 2, width: size, height: size, borderRadius: '50%', background: 'rgba(255,255,255,0.55)', border: '4px solid rgba(7,56,33,0.55)', transform: `scale(${press})`, opacity: o, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }} />
    </>
  );
};

/** Check que se dibuja dentro de un círculo */
export const Check: React.FC<{ at: number; x: number; y: number; size?: number; color?: string }> = ({ at, x, y, size = 150, color = C.leaf500 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = elastic(f, fps, at, 8, 200, 0.5);
  const d = interpolate(f, [at + 4, at + 16], [0, 1], { ...clamp, easing: EASE });
  return (
    <svg style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `scale(${s})`, overflow: 'visible' }} width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={48} fill={color} />
      <path d="M28 52 L44 67 L73 36" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
    </svg>
  );
};

/** Elemento que viaja en arco (foto, pin) */
export const ArcFly: React.FC<{ from: { x: number; y: number }; to: { x: number; y: number }; at: number; dur: number; height?: number; s0?: number; s1?: number; spin?: number; children: React.ReactNode; hideAfter?: boolean }> = ({
  from,
  to,
  at,
  dur,
  height = 220,
  s0 = 1,
  s1 = 1,
  spin = 0,
  children,
  hideAfter = true,
}) => {
  const f = useCurrentFrame();
  if (f < at || (hideAfter && f > at + dur + 2)) return null;
  const p = EASE_IN_OUT(Math.min(1, (f - at) / dur));
  const x = from.x + (to.x - from.x) * p;
  const y = from.y + (to.y - from.y) * p - Math.sin(p * Math.PI) * height;
  const s = s0 + (s1 - s0) * p;
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s}) rotate(${spin * p}deg)` }}>{children}</div>;
};

/** Pin de mapa (mismo estilo del prototipo) */
export const MapPin: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = C.mapAccent }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 24 30" style={{ display: 'block', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))' }}>
    <path d="M12 29s9-8.6 9-16.2C21 7 17 3 12 3S3 7 3 12.8C3 20.4 12 29 12 29Z" fill={color} stroke="#fff" strokeWidth={2} />
    <circle cx={12} cy={12.5} r={3.6} fill="#fff" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Fondos y transiciones                                               */
/* ------------------------------------------------------------------ */
/** Formas decorativas flotantes (hojas y puntos) con parallax */
export const Deco: React.FC<{ color?: string; seed?: string; n?: number; opacity?: number }> = ({ color = C.leaf500, seed = 'd', n = 12, opacity = 0.18 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity }}>
      {Array.from({ length: n }, (_, i) => {
        const x = random(`${seed}x${i}`) * width;
        const y = random(`${seed}y${i}`) * height;
        const sz = 24 + random(`${seed}s${i}`) * 60;
        const sp = 0.3 + random(`${seed}p${i}`) * 0.8;
        const leaf = i % 3 === 0;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y + Math.sin(f / 30 + i) * 14 - f * sp * 0.3, transform: `rotate(${f * sp + i * 40}deg)` }}>
            {leaf ? (
              <svg width={sz} height={sz} viewBox="0 0 24 24">
                <path d="M4 20C4 20 3 12 8 7C13 2 21 3 21 3C21 3 22 11 17 16C12 21 4 20 4 20Z" fill={color} />
              </svg>
            ) : (
              <div style={{ width: sz * 0.35, height: sz * 0.35, borderRadius: '50%', background: color }} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Cortinilla circular (iris) del color de la siguiente escena */
export const Iris: React.FC<{ at: number; x: number; y: number; color: string; dur?: number }> = ({ at, x, y, color, dur = 14 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (f < at) return null;
  const p = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const r = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * p;
  return <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: color }} />;
};
