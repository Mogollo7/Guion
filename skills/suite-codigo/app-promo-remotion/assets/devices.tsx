/**
 * Mockups de dispositivo para App Promo (Remotion 4): Screen (capturas reales con capas y desplazamiento),
 * Phone y Laptop genéricos (sin marca) e UICrop (recorte de una pieza real de la interfaz que "sale" de la pantalla).
 * Úsalo con microinteractions.tsx (skill ui-microinteractions) para Pop, Kinetic, Tap, etc.
 */
import React from 'react';
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const PAPER = '#fffff6';

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
    <div style={{ position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: radius, background: PAPER }}>
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

