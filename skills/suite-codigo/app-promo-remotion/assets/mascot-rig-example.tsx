/**
 * EJEMPLO de mascota con rig 2D (oso de anteojos "Tremi" de PITB Antioquia). Úsalo como patrón:
 * brazos con pivote en el hombro y transición de pose por resorte, parpadeo determinista, pupilas que miran,
 * salto con squash & stretch, objeto en la mano vía foreignObject (HTML dentro de SVG necesita foreignObject).
 * Diseña una mascota propia para cada marca; no reutilices esta fuera de PITB.
 */
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Tremi — mascota de PITB Antioquia: un oso de anteojos (Tremarctos ornatus), especie andina vulnerable.
 * Ilustración vectorial 2D original, armada como "rig": brazos con pivote en el hombro, ojos que parpadean,
 * pupilas que miran, boca con expresiones y saltos con squash & stretch.
 */
export type Pose = 'idle' | 'wave' | 'point' | 'pointLeft' | 'celebrate' | 'hold' | 'present';
export type Mouth = 'smile' | 'open' | 'o' | 'grin';

// ángulos de brazo (grados). Izquierda: + hacia afuera. Derecha: - hacia afuera.
const POSES: Record<Pose, [number, number]> = {
  idle: [14, -14],
  wave: [16, -148],
  point: [14, -96],
  pointLeft: [96, -14],
  celebrate: [148, -148],
  hold: [14, -52],
  present: [62, -62],
};

const C = {
  fur: '#2c221d',
  furLight: '#46372f',
  arm: '#382b24',
  outline: '#1a1311',
  ear: '#5b463a',
  cream: '#f1dcb0',
  muzzle: '#f7e8c8',
  nose: '#171110',
  cheek: '#e9a07a',
  scarf: '#6cae4c',
  scarfDark: '#2a6f49',
  white: '#ffffff',
  pupil: '#141010',
};

export type MascotProps = {
  size?: number; // alto en px
  pose?: Pose;
  prevPose?: Pose;
  poseAt?: number; // cuadro en que empieza la transición a `pose`
  mouth?: Mouth;
  lookX?: number; // -1..1
  lookY?: number; // -1..1
  jumpAt?: number[]; // cuadros en los que salta
  flip?: boolean;
  holding?: React.ReactNode; // objeto en la mano derecha (coordenadas del rig)
  style?: React.CSSProperties;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Mascot: React.FC<MascotProps> = ({
  size = 420,
  pose = 'idle',
  prevPose = 'idle',
  poseAt = 0,
  mouth = 'smile',
  lookX = 0,
  lookY = 0,
  jumpAt = [],
  flip = false,
  holding,
  style,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // transición de pose con resorte elástico
  const pt = spring({ frame: f - poseAt, fps, config: { damping: 11, stiffness: 140, mass: 0.7 } });
  const [l0, r0] = POSES[prevPose];
  const [l1, r1] = POSES[pose];
  let armL = lerp(l0, l1, pt);
  let armR = lerp(r0, r1, pt);
  if (pose === 'wave') armR += Math.sin((f - poseAt) / 3.2) * 20 * Math.min(1, pt);
  if (pose === 'celebrate') {
    armL += Math.sin((f - poseAt) / 3) * 10;
    armR -= Math.sin((f - poseAt) / 3) * 10;
  }

  // respiración
  const breathe = Math.sin(f / 14) * 0.012;
  // saltos: arco + squash al aterrizar
  let jy = 0;
  let sx = 1 + breathe;
  let sy = 1 - breathe;
  for (const j of jumpAt) {
    const t = f - j;
    if (t >= 0 && t < 22) {
      const p = t / 22;
      jy += -Math.sin(p * Math.PI) * 70;
      const stretch = Math.sin(p * Math.PI) * 0.08;
      sx -= stretch;
      sy += stretch;
    }
    if (t >= 22 && t < 32) {
      const q = Math.sin(((t - 22) / 10) * Math.PI) * 0.1;
      sx += q;
      sy -= q;
    }
    if (t >= -6 && t < 0) {
      const q = Math.sin(((t + 6) / 6) * Math.PI) * 0.08;
      sx += q;
      sy -= q;
    }
  }

  // parpadeo determinista
  const cyc = (f + 23) % 87;
  const blink = cyc < 5 ? interpolate(cyc, [0, 2, 5], [1, 0.08, 1]) : 1;
  const px = Math.max(-1, Math.min(1, lookX)) * 8;
  const py = Math.max(-1, Math.min(1, lookY)) * 7;
  const headTilt = Math.sin(f / 22) * 2 + (pose === 'point' ? 5 : pose === 'pointLeft' ? -5 : 0);

  const mouthPath = {
    smile: <path d="M184 222 Q200 238 216 222" fill="none" stroke={C.nose} strokeWidth={5} strokeLinecap="round" />,
    grin: (
      <>
        <path d="M180 218 Q200 248 220 218 Z" fill={C.nose} />
        <path d="M190 232 Q200 240 210 232 Q200 236 190 232Z" fill="#e2675c" />
      </>
    ),
    open: (
      <>
        <path d="M180 216 Q200 258 220 216 Z" fill={C.nose} />
        <path d="M188 236 Q200 252 212 236 Q200 242 188 236Z" fill="#e2675c" />
      </>
    ),
    o: <ellipse cx={200} cy={228} rx={9} ry={12} fill={C.nose} />,
  }[mouth];

  const arm = (side: 'L' | 'R', angle: number) => {
    const px0 = side === 'L' ? 132 : 268;
    return (
      <g transform={`rotate(${angle} ${px0} 318)`}>
        <rect x={px0 - 22} y={300} width={44} height={112} rx={22} fill={C.arm} stroke={C.outline} strokeWidth={3} />
        <ellipse cx={px0} cy={404} rx={24} ry={20} fill={C.furLight} stroke={C.outline} strokeWidth={3} />
        {side === 'R' && holding && (
          <g transform={`translate(${px0} 418) rotate(${-angle})`}>
            <foreignObject x={-150} y={-150} width={300} height={300} style={{ overflow: 'visible' }}>
              <div style={{ width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{holding}</div>
            </foreignObject>
          </g>
        )}
      </g>
    );
  };

  return (
    <svg
      width={(size * 400) / 480}
      height={size}
      viewBox="0 0 400 480"
      style={{ overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }}
    >
      {/* sombra */}
      <ellipse cx={200} cy={462} rx={120 * (1 + jy / 300)} ry={14} fill="rgba(0,0,0,0.18)" />
      <g transform={`translate(0 ${jy}) translate(200 460) scale(${sx} ${sy}) translate(-200 -460)`}>
        {/* piernas */}
        <ellipse cx={160} cy={444} rx={40} ry={22} fill={C.fur} />
        <ellipse cx={240} cy={444} rx={40} ry={22} fill={C.fur} />
        {/* brazo izquierdo detrás */}
        {arm('L', armL)}
        {/* cuerpo */}
        <path d="M200 268 C118 268 96 352 104 404 C110 446 150 458 200 458 C250 458 290 446 296 404 C304 352 282 268 200 268Z" fill={C.fur} />
        <path d="M200 300 C164 300 152 352 160 392 C166 420 182 430 200 430 C218 430 234 420 240 392 C248 352 236 300 200 300Z" fill={C.cream} opacity={0.9} />
        {/* pañoleta PITB */}
        <path d="M128 280 Q200 318 272 280 L268 300 Q200 338 132 300Z" fill={C.scarf} />
        <path d="M182 302 L218 302 L200 346 Z" fill={C.scarfDark} stroke={C.scarfDark} strokeWidth={8} strokeLinejoin="round" />
        <circle cx={200} cy={304} r={10} fill={C.scarfDark} />
        {/* cabeza */}
        <g transform={`rotate(${headTilt} 200 250)`}>
          <circle cx={104} cy={84} r={38} fill={C.fur} />
          <circle cx={296} cy={84} r={38} fill={C.fur} />
          <circle cx={104} cy={86} r={20} fill={C.ear} />
          <circle cx={296} cy={86} r={20} fill={C.ear} />
          <ellipse cx={200} cy={168} rx={126} ry={118} fill={C.fur} />
          {/* "anteojos" crema característicos */}
          <path d="M96 150 C96 104 140 92 168 118 C180 130 182 150 176 168 C168 196 128 204 108 188 C100 180 96 166 96 150Z" fill={C.cream} />
          <path d="M304 150 C304 104 260 92 232 118 C220 130 218 150 224 168 C232 196 272 204 292 188 C300 180 304 166 304 150Z" fill={C.cream} />
          <path d="M168 118 Q200 100 232 118" fill="none" stroke={C.cream} strokeWidth={12} strokeLinecap="round" />
          {/* ojos */}
          <g transform={`translate(0 150) scale(1 ${blink}) translate(0 -150)`}>
            <ellipse cx={142} cy={150} rx={27} ry={31} fill={C.white} />
            <ellipse cx={258} cy={150} rx={27} ry={31} fill={C.white} />
            <circle cx={142 + px} cy={154 + py} r={14} fill={C.pupil} />
            <circle cx={258 + px} cy={154 + py} r={14} fill={C.pupil} />
            <circle cx={147 + px} cy={148 + py} r={5} fill={C.white} />
            <circle cx={263 + px} cy={148 + py} r={5} fill={C.white} />
          </g>
          {/* hocico */}
          <ellipse cx={200} cy={214} rx={58} ry={44} fill={C.muzzle} />
          <path d="M182 192 Q200 184 218 192 Q218 206 200 212 Q182 206 182 192Z" fill={C.nose} />
          <ellipse cx={194} cy={192} rx={5} ry={3} fill="#4a3b36" />
          {mouthPath}
          <ellipse cx={116} cy={210} rx={16} ry={10} fill={C.cheek} opacity={0.45} />
          <ellipse cx={284} cy={210} rx={16} ry={10} fill={C.cheek} opacity={0.45} />
        </g>
        {/* brazo derecho delante */}
        {arm('R', armR)}
      </g>
    </svg>
  );
};

/** Burbuja de diálogo con entrada elástica */
export const Bubble: React.FC<{ children: React.ReactNode; at: number; out?: number; tail?: 'left' | 'right' | 'bottom'; style?: React.CSSProperties; dark?: boolean }> = ({
  children,
  at,
  out,
  tail = 'left',
  style,
  dark,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  if (f < at) return null;
  const bg = dark ? '#073821' : '#ffffff';
  const fg = dark ? '#fffff6' : '#122318';
  const tailStyle: React.CSSProperties =
    tail === 'left'
      ? { left: -18, bottom: 26, borderRight: `22px solid ${bg}`, borderTop: '14px solid transparent', borderBottom: '14px solid transparent' }
      : tail === 'right'
        ? { right: -18, bottom: 26, borderLeft: `22px solid ${bg}`, borderTop: '14px solid transparent', borderBottom: '14px solid transparent' }
        : { left: '50%', bottom: -18, marginLeft: -14, borderTop: `22px solid ${bg}`, borderLeft: '14px solid transparent', borderRight: '14px solid transparent' };
  return (
    <div
      style={{
        position: 'absolute',
        background: bg,
        color: fg,
        padding: '22px 30px',
        borderRadius: 28,
        fontFamily: '"Manrope", sans-serif',
        fontWeight: 800,
        fontSize: 38,
        lineHeight: 1.2,
        boxShadow: '0 18px 40px -16px rgba(0,0,0,0.35)',
        transform: `scale(${s})`,
        transformOrigin: tail === 'left' ? '0% 100%' : tail === 'right' ? '100% 100%' : '50% 100%',
        opacity: o,
        ...style,
      }}
    >
      {children}
      <div style={{ position: 'absolute', width: 0, height: 0, ...tailStyle }} />
    </div>
  );
};
