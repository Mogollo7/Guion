import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from 'remotion';
import { C, clamp } from '../theme';
import { Iris } from './kit';
import { Mascot, Pose, Mouth } from './Mascot';
import { PFicha, PHook, PIdentify, PLogo, PMap, POutro, PTremi, PUpload, PValidate } from './PromoScenes';

// Escenas del App Promo (duración en cuadros, color de fondo y punto de origen del iris de entrada)
export const PROMO = [
  { id: 'hook', C: PHook, dur: 120, color: C.cream100, iris: [960, 540] },
  { id: 'tremi', C: PTremi, dur: 120, color: C.leaf500, iris: [1650, 760] },
  { id: 'logo', C: PLogo, dur: 120, color: C.forest900, iris: [960, 520] },
  { id: 'upload', C: PUpload, dur: 240, color: C.cream100, iris: [960, 540] },
  { id: 'identify', C: PIdentify, dur: 180, color: C.forest900, iris: [1250, 330] },
  { id: 'ficha', C: PFicha, dur: 180, color: C.canvasAlt, iris: [960, 540] },
  { id: 'map', C: PMap, dur: 180, color: C.okBg, iris: [1310, 840] },
  { id: 'validate', C: PValidate, dur: 150, color: C.cream100, iris: [1100, 600] },
  { id: 'outro', C: POutro, dur: 180, color: C.forest900, iris: [1000, 520] },
] as const;
export const PROMO_TOTAL = PROMO.reduce((a, s) => a + s.dur, 0);

/** App Promo de PITB Antioquia (16:9, ~49 s) con música a 120 BPM y efectos */
export const Promo: React.FC<{ music?: boolean }> = ({ music = true }) => {
  let t = 0;
  const seq = PROMO.map((s) => {
    const from = t;
    t += s.dur;
    return { ...s, from };
  });
  return (
    <AbsoluteFill style={{ background: C.forest900 }}>
      {seq.map((s, i) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur}>
          <s.C />
          {seq[i + 1] && (
            <Sequence from={s.dur - 12} durationInFrames={12}>
              <Iris at={0} x={seq[i + 1].iris[0]} y={seq[i + 1].iris[1]} color={seq[i + 1].color} dur={12} />
            </Sequence>
          )}
        </Sequence>
      ))}
      {music && (
        <Audio
          src={staticFile('audio/music.mp3')}
          startFrom={91}
          volume={(f) => interpolate(f, [0, 6, PROMO_TOTAL - 45, PROMO_TOTAL], [0, 0.55, 0.55, 0], clamp)}
        />
      )}
    </AbsoluteFill>
  );
};

/** Escena suelta del promo para usar como lámina en el video de 3 min (se queda quieta al final) */
export const PromoPlate: React.FC<{ scene: string }> = ({ scene }) => {
  const s = PROMO.find((p) => p.id === scene)!;
  return <s.C />;
};

/** Intro alternativa para el video largo: Tremi saluda + logo */
export const PromoIntro: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={120}>
      <PTremi />
      <Sequence from={108} durationInFrames={12}>
        <Iris at={0} x={960} y={520} color={C.forest900} dur={12} />
      </Sequence>
    </Sequence>
    <Sequence from={120} durationInFrames={120}>
      <PLogo />
    </Sequence>
  </AbsoluteFill>
);

/** Clip de Tremi con fondo transparente para DaVinci (ProRes 4444) */
export const TremiClip: React.FC<{ pose: Pose; mouth: Mouth; jump?: boolean; flip?: boolean }> = ({ pose, mouth, jump, flip }) => (
  <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 }}>
    <Mascot size={900} pose={pose} prevPose="idle" poseAt={6} mouth={mouth} jumpAt={jump ? [8, 60] : []} flip={flip} lookX={flip ? -0.5 : 0.5} />
  </AbsoluteFill>
);
