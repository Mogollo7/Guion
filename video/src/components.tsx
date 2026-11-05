import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { appear, C, clamp, EASE, EASE_IN_OUT, F, fmt } from './theme';
import geo from './data/antioquia.json';

/* ------------------------------------------------------------------ */
/* Fondos                                                              */
/* ------------------------------------------------------------------ */

/** Curvas de nivel suaves que se desplazan lentamente (textura topográfica). */
const Contours: React.FC<{ color: string; opacity: number }> = ({ color, opacity }) => {
  const f = useCurrentFrame();
  const lines = Array.from({ length: 9 }, (_, i) => {
    const base = 120 + i * 115;
    const pts: string[] = [];
    for (let x = -40; x <= 1960; x += 40) {
      const y = base + Math.sin(x / 260 + i * 0.9 + f / 140) * 34 + Math.sin(x / 97 + i * 2.1) * 10;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return <polyline key={i} points={pts.join(' ')} fill="none" stroke={color} strokeWidth={1.4} />;
  });
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity }}>
      {lines}
    </svg>
  );
};

export const Bg: React.FC<{ tone?: 'cream' | 'alt' | 'dark'; contours?: boolean; children?: React.ReactNode }> = ({
  tone = 'cream',
  contours = true,
  children,
}) => {
  const bg = tone === 'dark' ? C.forest900 : tone === 'alt' ? C.canvasAlt : C.cream100;
  const line = tone === 'dark' ? C.olive400 : C.green700;
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: F.body, color: tone === 'dark' ? C.onDark : C.ink900 }}>
      {contours && <Contours color={line} opacity={tone === 'dark' ? 0.09 : 0.06} />}
      {tone === 'dark' && (
        <AbsoluteFill style={{ background: 'radial-gradient(120% 90% at 20% 10%, rgba(108,174,76,0.16), transparent 60%)' }} />
      )}
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Tipografía                                                          */
/* ------------------------------------------------------------------ */

export const Kicker: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ children, dark, style }) => (
  <div
    style={{
      fontFamily: F.body,
      fontWeight: 800,
      fontSize: 24,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: dark ? C.olive400 : C.green700,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<{ children: React.ReactNode; size?: number; dark?: boolean; style?: React.CSSProperties }> = ({
  children,
  size = 84,
  dark,
  style,
}) => (
  <div
    style={{
      fontFamily: F.display,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: '-0.015em',
      color: dark ? C.cream100 : C.ink900,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{ children: React.ReactNode; size?: number; dark?: boolean; style?: React.CSSProperties }> = ({
  children,
  size = 32,
  dark,
  style,
}) => (
  <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: size, lineHeight: 1.4, color: dark ? C.onDarkMuted : C.ink600, ...style }}>
    {children}
  </div>
);

/** Revela palabra por palabra (para frases que el espectador debe leer). */
export const Words: React.FC<{ text: string; start: number; every?: number; style?: React.CSSProperties }> = ({ text, start, every = 3, style }) => {
  const f = useCurrentFrame();
  return (
    <span style={style}>
      {text.split(' ').map((w, i) => {
        const p = appear(f, start + i * every, 14);
        return (
          <span key={i} style={{ display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 18}px)`, marginRight: '0.26em' }}>
            {w}
          </span>
        );
      })}
    </span>
  );
};

export const Counter: React.FC<{ from?: number; to: number; start: number; dur: number; decimals?: number; suffix?: string; prefix?: string }> = ({
  from = 0,
  to,
  start,
  dur,
  decimals = 0,
  suffix = '',
  prefix = '',
}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [start, start + dur], [from, to], { ...clamp, easing: EASE });
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {fmt(v, decimals)}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Piezas UI                                                           */
/* ------------------------------------------------------------------ */

export const Pill: React.FC<{ children: React.ReactNode; tone?: 'ok' | 'dark' | 'warn' | 'danger' | 'ghost' | 'leaf'; size?: number; style?: React.CSSProperties }> = ({
  children,
  tone = 'ok',
  size = 26,
  style,
}) => {
  const tones = {
    ok: { bg: C.okBg, fg: C.green700, bd: 'transparent' },
    dark: { bg: C.forest900, fg: C.cream100, bd: 'transparent' },
    warn: { bg: C.warnBg, fg: C.warn, bd: 'transparent' },
    danger: { bg: C.dangerBg, fg: C.danger, bd: 'transparent' },
    ghost: { bg: 'rgba(255,255,255,0.7)', fg: C.ink900, bd: C.border },
    leaf: { bg: C.leaf500, fg: C.forest900, bd: 'transparent' },
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `${size * 0.42}px ${size * 0.85}px`,
        borderRadius: 999,
        background: tones.bg,
        color: tones.fg,
        border: `1.5px solid ${tones.bd}`,
        fontFamily: F.body,
        fontWeight: 700,
        fontSize: size,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export const Card: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ children, dark, style }) => (
  <div
    style={{
      background: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
      border: `1.5px solid ${dark ? C.borderDark : C.border}`,
      borderRadius: 22,
      boxShadow: dark ? 'none' : '0 24px 48px -28px rgba(7,56,33,0.38)',
      padding: 36,
      ...style,
    }}
  >
    {children}
  </div>
);

/* Iconos (mismos trazos que el sprite del prototipo) */
type IconName = 'leaf' | 'camera' | 'dna' | 'pin' | 'map' | 'clipboard' | 'check' | 'x' | 'search' | 'filter' | 'user' | 'shield' | 'alert' | 'trend' | 'arrow';
export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({ name, size = 40, color = 'currentColor', stroke = 1.7 }) => {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<IconName, React.ReactNode> = {
    leaf: (
      <>
        <path d="M4 20C4 20 3 12 8 7C13 2 21 3 21 3C21 3 22 11 17 16C12 21 4 20 4 20Z" {...p} />
        <path d="M4 20C8 16 12 12 21 3" {...p} />
      </>
    ),
    camera: (
      <>
        <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" {...p} />
        <circle cx="12" cy="13" r="3.4" {...p} />
      </>
    ),
    dna: (
      <>
        <path d="M6 3c0 5 12 5 12 10s-12 5-12 10M18 3c0 5-12 5-12 10s12 5 12 10" {...p} />
        <path d="M7.5 8h9M6.7 12h10.6M7.5 16h9" {...p} strokeWidth={stroke * 0.8} />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-6.2 7-11.5C19 5.4 15.9 3 12 3S5 5.4 5 9.5C5 14.8 12 21 12 21Z" {...p} />
        <circle cx="12" cy="9.5" r="2.4" {...p} />
      </>
    ),
    map: (
      <>
        <path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" {...p} />
        <path d="M9 4v14M15 6v14" {...p} />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4.5" width="14" height="17" rx="2" {...p} />
        <rect x="9" y="3" width="6" height="3.2" rx="1" {...p} />
        <path d="M8.5 12h7M8.5 16h7M8.5 8.5h4" {...p} />
      </>
    ),
    check: <path d="M5 12.5l4.5 4.5L19 7" {...p} strokeWidth={stroke * 1.2} />,
    x: <path d="M6 6l12 12M18 6L6 18" {...p} />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.25" {...p} />
        <path d="M15.3 15.3L20 20" {...p} />
      </>
    ),
    filter: <path d="M4 6h16M7 12h10M10 18h4" {...p} />,
    user: (
      <>
        <circle cx="12" cy="8" r="3.6" {...p} />
        <path d="M4.5 20c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6" {...p} />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v5.5c0 4.4-3 7.8-7 9.5-4-1.7-7-5.1-7-9.5V6l7-3Z" {...p} />
        <path d="M9 12l2.2 2.2L15.5 10" {...p} />
      </>
    ),
    alert: (
      <>
        <path d="M12 4l9 16H3L12 4Z" {...p} />
        <path d="M12 10v4.5M12 17.2v.3" {...p} />
      </>
    ),
    trend: <path d="M3 7l6 6 4-4 8 8M15 17h6v-6" {...p} />,
    arrow: <path d="M4 12h15M14 6l6 6-6 6" {...p} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flex: 'none' }}>
      {paths[name]}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Isologo PITB Antioquia                                              */
/* ------------------------------------------------------------------ */

const LEAF = 'M4 20C4 20 3 12 8 7C13 2 21 3 21 3C21 3 22 11 17 16C12 21 4 20 4 20Z';
const VEIN = 'M4 20C8 16 12 12 21 3';
// nodos de "dato" sobre la nervadura
const NODES = [
  [8.6, 15.4],
  [12.5, 11.5],
  [16.4, 7.6],
];

/** Símbolo: hoja (identidad del sitio) cuya nervadura es una línea de datos con tres nodos. progress 0→1 anima el trazo. */
export const Symbol: React.FC<{ size?: number; progress?: number; variant?: 'color' | 'negative' | 'mono-dark' | 'mono-light'; badge?: boolean }> = ({
  size = 120,
  progress = 1,
  variant = 'color',
  badge = true,
}) => {
  const pal = {
    color: { bg: C.forest900, leaf: C.leaf500, fill: 'rgba(108,174,76,0.22)', vein: C.olive400, node: C.cream100 },
    negative: { bg: C.cream100, leaf: C.green700, fill: 'rgba(42,111,73,0.14)', vein: C.green700, node: C.forest900 },
    'mono-dark': { bg: 'transparent', leaf: C.forest900, fill: 'transparent', vein: C.forest900, node: C.forest900 },
    'mono-light': { bg: 'transparent', leaf: C.cream100, fill: 'transparent', vein: C.cream100, node: C.cream100 },
  }[variant];
  const draw = interpolate(progress, [0, 0.55], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const fill = interpolate(progress, [0.45, 0.75], [0, 1], clamp);
  const nodes = NODES.map((_, i) => interpolate(progress, [0.6 + i * 0.1, 0.75 + i * 0.1], [0, 1], { ...clamp, easing: EASE }));
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block', flex: 'none' }}>
      {badge && variant !== 'mono-dark' && variant !== 'mono-light' && (
        <rect x="0" y="0" width="32" height="32" rx="8" fill={pal.bg} opacity={interpolate(progress, [0, 0.2], [0, 1], clamp)} />
      )}
      <g transform="translate(3.5 3.5)">
        <path d={LEAF} fill={pal.fill} opacity={fill} />
        <path d={LEAF} fill="none" stroke={pal.leaf} strokeWidth={1.7} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={VEIN} fill="none" stroke={pal.vein} strokeWidth={1.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.35 * nodes[i]} fill={pal.node} stroke={pal.vein} strokeWidth={0.7 * nodes[i]} />
        ))}
      </g>
    </svg>
  );
};

/** Isologo horizontal: símbolo + "PITB Antioquia" */
export const Isologo: React.FC<{ height?: number; progress?: number; dark?: boolean; tagline?: boolean }> = ({ height = 120, progress = 1, dark, tagline }) => {
  const word = interpolate(progress, [0.55, 0.95], [0, 1], { ...clamp, easing: EASE });
  const tag = interpolate(progress, [0.8, 1], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: height * 0.28 }}>
      <Symbol size={height} progress={progress} variant={dark ? 'color' : 'color'} />
      <div style={{ opacity: word, transform: `translateX(${(1 - word) * -18}px)` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: height * 0.14, lineHeight: 1 }}>
          <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: height * 0.62, color: dark ? C.cream100 : C.forest900, letterSpacing: '-0.01em' }}>PITB</span>
          <span style={{ fontFamily: F.body, fontWeight: 700, fontSize: height * 0.5, color: C.leaf500 }}>Antioquia</span>
        </div>
        {tagline && (
          <div
            style={{
              marginTop: height * 0.12,
              opacity: tag,
              fontFamily: F.body,
              fontWeight: 600,
              fontSize: height * 0.17,
              letterSpacing: '0.04em',
              color: dark ? C.onDarkMuted : C.ink600,
            }}
          >
            Plataforma de Inteligencia Territorial y Biodiversidad
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Marco de navegador con cámara, capas, cursor y llamadas             */
/* ------------------------------------------------------------------ */

export type Layer = { src: string; from: number; h?: number };
export type Cam = { f: number; x: number; y: number; s: number }; // foco (px de imagen) y zoom
export type CursorKey = { f: number; x: number; y: number; click?: boolean };
export type CalloutDef = { from: number; to: number; box: { x: number; y: number; w: number; h: number }; label?: string; side?: 'top' | 'bottom' | 'left' | 'right'; dim?: boolean };

const lerpKeys = <T extends { f: number }>(keys: T[], f: number, field: keyof T): number => {
  if (f <= keys[0].f) return keys[0][field] as number;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f <= b.f) {
      const t = EASE_IN_OUT((f - a.f) / Math.max(1, b.f - a.f));
      return (a[field] as number) + ((b[field] as number) - (a[field] as number)) * t;
    }
  }
  return keys[keys.length - 1][field] as number;
};

export const BrowserFrame: React.FC<{
  layers: Layer[];
  imgW?: number;
  viewH?: number; // alto del viewport en px de imagen
  width: number;
  x: number;
  y: number;
  cam?: Cam[];
  cursor?: CursorKey[];
  callouts?: CalloutDef[];
  url?: string;
  enter?: number;
  overlay?: React.ReactNode;
  badge?: string;
  extras?: (k: number) => React.ReactNode; // elementos en coordenadas de imagen
  drag?: { src: string; until: number };
}> = ({ extras, drag, layers, imgW = 2560, viewH = 1600, width, x, y, cam = [{ f: 0, x: 1280, y: 800, s: 1 }], cursor, callouts = [], url = 'mogollo7.github.io/PITB-Antioquia', enter = 0, overlay, badge }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const viewW = imgW;
  const height = (width * viewH) / viewW;
  const bar = 52;
  const e = appear(f, enter, 24);

  const s = lerpKeys(cam, f, 's');
  const base = width / viewW;
  const k = base * s;
  // foco centrado y acotado al documento visible actual
  const active = [...layers].reverse().find((l) => f >= l.from) ?? layers[0];
  const docH = active.h ?? viewH;
  let cx = lerpKeys(cam, f, 'x');
  let cy = lerpKeys(cam, f, 'y');
  const halfW = width / 2 / k;
  const halfH = height / 2 / k;
  cx = Math.min(Math.max(cx, halfW), viewW - halfW);
  cy = Math.min(Math.max(cy, halfH), Math.max(halfH, docH - halfH));
  const tx = width / 2 - cx * k;
  const ty = height / 2 - cy * k;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height: height + bar,
        borderRadius: 22,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 40px 80px -30px rgba(7,56,33,0.55), 0 0 0 1.5px rgba(18,35,24,0.10)',
        opacity: e,
        transform: `translateY(${(1 - e) * 40}px) scale(${0.97 + 0.03 * e})`,
      }}
    >
      <div style={{ height: bar, background: C.canvasAlt, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', borderBottom: `1.5px solid ${C.border}` }}>
        {['#e8703a', '#a5bc5b', '#6cae4c'].map((c) => (
          <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.85 }} />
        ))}
        <div
          style={{
            marginLeft: 18,
            flex: 1,
            maxWidth: 720,
            height: 32,
            borderRadius: 16,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 16px',
            fontFamily: F.body,
            fontSize: 18,
            fontWeight: 600,
            color: C.ink600,
          }}
        >
          <Icon name="search" size={18} color={C.ink600} />
          {url}
        </div>
        {badge && (
          <div style={{ marginLeft: 'auto' }}>
            <Pill tone="warn" size={17}>
              {badge}
            </Pill>
          </div>
        )}
      </div>
      <div style={{ position: 'relative', width, height, overflow: 'hidden', background: C.cream100 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${k})` }}>
          {layers.map((l, i) => {
            const next = layers[i + 1];
            const o = i === 0 ? 1 : appear(f, l.from, 6, EASE_IN_OUT);
            const gone = next && f >= next.from + 6;
            if (f < l.from || gone) return null;
            return <Img key={l.src + i} src={staticFile(l.src)} style={{ position: 'absolute', left: 0, top: 0, width: viewW, opacity: o, display: 'block' }} />;
          })}
          {callouts.map((c, i) => {
            const pin = appear(f, c.from, 14) * (1 - appear(f, c.to, 10));
            if (pin <= 0) return null;
            const pad = 14 / k;
            const side = c.side ?? 'top';
            const lx = side === 'left' ? c.box.x - pad : side === 'right' ? c.box.x + c.box.w + pad : c.box.x - pad;
            const ly = side === 'bottom' ? c.box.y + c.box.h + pad * 1.6 : side === 'top' ? c.box.y - pad * 1.6 : c.box.y;
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: 'absolute',
                    left: c.box.x - pad,
                    top: c.box.y - pad,
                    width: c.box.w + pad * 2,
                    height: c.box.h + pad * 2,
                    border: `${4 / k}px solid ${C.leaf500}`,
                    borderRadius: 18 / k,
                    boxShadow: c.dim === false ? 'none' : `0 0 0 ${9999}px rgba(7,56,33,${0.28 * pin})`,
                    opacity: pin,
                  }}
                />
                {c.label && (
                  <div
                    style={{
                      position: 'absolute',
                      left: lx,
                      top: ly,
                      transform: `translate(${side === 'left' ? '-100%' : '0'}, ${side === 'top' ? '-100%' : '0'}) scale(${1 / k})`,
                      transformOrigin: `${side === 'left' ? '100%' : '0'} ${side === 'top' ? '100%' : '0'}`,
                      opacity: pin,
                    }}
                  >
                    <Pill tone="dark" size={28} style={{ boxShadow: '0 12px 30px -10px rgba(7,56,33,0.6)' }}>
                      <Icon name="leaf" size={26} color={C.leaf500} /> {c.label}
                    </Pill>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {extras?.(k)}
          {cursor && <Cursor keys={cursor} scale={k} fps={fps} drag={drag} />}
        </div>
        {overlay}
      </div>
    </div>
  );
};

const Cursor: React.FC<{ keys: CursorKey[]; scale: number; fps: number; drag?: { src: string; until: number } }> = ({ keys, scale, drag }) => {
  const f = useCurrentFrame();
  const x = lerpKeys(keys, f, 'x');
  const y = lerpKeys(keys, f, 'y');
  const visible = appear(f, keys[0].f, 8);
  const clicks = keys.filter((k) => k.click);
  const pressing = clicks.some((c) => f >= c.f - 3 && f <= c.f + 3);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${1 / scale})`, transformOrigin: '0 0', opacity: visible }}>
      {clicks.map((c, i) => {
        const r = interpolate(f, [c.f, c.f + 16], [0, 1], clamp);
        if (f < c.f || r >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -40 * r,
              top: -40 * r,
              width: 80 * r,
              height: 80 * r,
              borderRadius: '50%',
              border: `4px solid ${C.leaf500}`,
              opacity: 1 - r,
            }}
          />
        );
      })}
      {drag && f < drag.until + 8 && (
        <div style={{ position: 'absolute', left: 18, top: 22, opacity: 0.92 * (1 - appear(f, drag.until, 8)), transform: 'rotate(-4deg)' }}>
          <Img src={staticFile(drag.src)} style={{ width: 230, height: 160, objectFit: 'cover', borderRadius: 14, boxShadow: '0 18px 40px -12px rgba(0,0,0,0.5)', border: '4px solid #fff' }} />
        </div>
      )}
      <svg width={44} height={44} viewBox="0 0 24 24" style={{ position: 'relative', transform: `scale(${pressing ? 0.86 : 1})`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))' }}>
        <path d="M4 2.5l15 9.2-6.6 1.4 3.9 6.9-2.6 1.5-3.9-6.9L5 19.4 4 2.5Z" fill={C.ink900} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Mapa de Antioquia (DANE MGN 2018)                                   */
/* ------------------------------------------------------------------ */

export const project = (lat: number, lng: number) => ({
  x: (lng - geo.proj.lon0) * geo.proj.k * geo.proj.s,
  y: (geo.proj.lat1 - lat) * geo.proj.s,
});

export type Marker = { lat: number; lng: number; at: number; color?: string; pulse?: boolean; label?: string };

export const AntioquiaMap: React.FC<{
  height: number;
  x: number;
  y: number;
  drawStart?: number;
  drawEvery?: number; // cuadros entre municipios
  fill?: string;
  stroke?: string;
  outline?: string;
  muniFill?: (id: string, i: number) => string | undefined;
  markers?: Marker[];
  dark?: boolean;
  children?: React.ReactNode;
}> = ({ height, x, y, drawStart = 0, drawEvery = 0.8, fill, stroke, outline, muniFill, markers = [], dark, children }) => {
  const f = useCurrentFrame();
  const sc = height / geo.height;
  const width = geo.width * sc;
  const baseFill = fill ?? (dark ? 'rgba(255,255,255,0.05)' : C.okBg);
  const baseStroke = stroke ?? (dark ? 'rgba(165,188,91,0.55)' : 'rgba(42,111,73,0.45)');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${geo.width} ${geo.height}`} style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
      {geo.municipios.map((m, i) => {
        const t0 = drawStart + i * drawEvery;
        const d = appear(f, t0, 22, EASE_IN_OUT);
        const fo = appear(f, t0 + 10, 16);
        const tint = muniFill?.(m.id, i);
        return (
          <g key={m.id}>
            <path d={m.d} fill={tint ?? baseFill} fillOpacity={fo} stroke="none" />
            <path d={m.d} fill="none" stroke={baseStroke} strokeWidth={1.3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} strokeLinejoin="round" />
          </g>
        );
      })}
      <path
        d={geo.outline}
        fill="none"
        stroke={outline ?? (dark ? C.olive400 : C.green700)}
        strokeWidth={3.2}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - appear(f, drawStart, 60, EASE_IN_OUT)}
      />
      {markers.map((mk, i) => {
        const p = project(mk.lat, mk.lng);
        const a = appear(f, mk.at, 12, EASE);
        const pulse = mk.pulse ? ((f - mk.at) % 40) / 40 : 0;
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`} opacity={a}>
            {mk.pulse && f > mk.at && <circle r={10 + pulse * 34} fill="none" stroke={mk.color ?? C.mapAccent} strokeWidth={3} opacity={1 - pulse} />}
            <rect x={-9} y={-9} width={18} height={18} transform={`rotate(45) scale(${0.4 + 0.6 * a})`} fill={mk.color ?? C.mapAccent} stroke="#fff" strokeWidth={3} rx={3} />
            {mk.label && (
              <text x={18} y={7} fontFamily="Manrope" fontWeight={700} fontSize={22} fill={dark ? C.cream100 : C.ink900}>
                {mk.label}
              </text>
            )}
          </g>
        );
      })}
      {children}
    </svg>
  );
};

export const mapSize = (height: number) => ({ width: (geo.width * height) / geo.height, height });

/* ------------------------------------------------------------------ */
/* Sello "datos ilustrativos"                                          */
/* ------------------------------------------------------------------ */

export const Illustrative: React.FC<{ text?: string; style?: React.CSSProperties; start?: number }> = ({ text = 'Datos ilustrativos del prototipo', style, start = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', opacity: appear(f, start, 16), ...style }}>
      <Pill tone="warn" size={20}>
        <Icon name="alert" size={22} color={C.warn} /> {text}
      </Pill>
    </div>
  );
};

export const Photo: React.FC<{ src: string; w: number; h: number; radius?: number; style?: React.CSSProperties; credit?: string }> = ({ src, w, h, radius = 22, style, credit }) => (
  <div style={{ position: 'relative', width: w, height: h, borderRadius: radius, overflow: 'hidden', boxShadow: '0 24px 48px -26px rgba(7,56,33,0.6)', ...style }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    {credit && (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '18px 14px 8px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
          color: '#fff',
          fontFamily: F.body,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {credit}
      </div>
    )}
  </div>
);
