import { Easing, interpolate, spring } from 'remotion';

// Tokens tomados de css/styles.css del prototipo PITB Antioquia
export const C = {
  forest900: '#073821',
  forest800: '#0d4a2c',
  green700: '#2a6f49',
  leaf500: '#6cae4c',
  olive400: '#a5bc5b',
  cream100: '#fffff6',
  cream50: '#fdfcf1',
  canvasAlt: '#f2f1e5',
  ink900: '#122318',
  ink600: '#3c4f43',
  mapAccent: '#e8703a',
  danger: '#c1442e',
  dangerBg: '#fbeae6',
  warn: '#a5760f',
  warnBg: '#faf1dc',
  okBg: '#e6f0e8',
  onDark: '#eef7ee',
  onDarkMuted: '#c3d8c8',
  border: 'rgba(18,35,24,0.10)',
  borderDark: 'rgba(255,255,255,0.16)',
};

export const F = {
  display: '"Fraunces", Georgia, serif',
  body: '"Manrope", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Menlo", "Consolas", monospace',
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// --ease-out del sitio: cubic-bezier(.16,1,.3,1)
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** 0→1 entre start y start+dur con la curva del sitio */
export const appear = (f: number, start: number, dur = 18, easing = EASE) =>
  interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing });

/** 1→0 */
export const vanish = (f: number, start: number, dur = 12) =>
  interpolate(f, [start, start + dur], [1, 0], { ...clamp, easing: EASE_IN_OUT });

export const pop = (f: number, fps: number, delay = 0, damping = 14, stiffness = 140) =>
  spring({ frame: f - delay, fps, config: { damping, stiffness, mass: 0.8 } });

export const soft = (f: number, fps: number, delay = 0) =>
  spring({ frame: f - delay, fps, config: { damping: 200 } });

/** Entrada típica: sube 24px y aparece */
export const rise = (f: number, start: number, dur = 20, dist = 24) => {
  const p = appear(f, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

export const fmt = (n: number, decimals = 0) =>
  n.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export const sec = (s: number) => Math.round(s * FPS);
