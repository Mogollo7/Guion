import React from 'react';
import { Composition, Still } from 'remotion';
import { FontGate } from './fonts';
import { FPS, H, W } from './theme';
import { S1, S2, S3 } from './scenes/Salome';
import { D1, D2, D3 } from './scenes/Daniela';
import { J1, J2, J3 } from './scenes/Juan';
import { M1, M2, M3, M4, M5 } from './scenes/Maria';
import { BadgeIllustrative, Intro, LiveOverlay, LogoSheet, LowerThird, Outro } from './scenes/Brand';
import { Animatic } from './scenes/Animatic';
import { Teaser } from './scenes/Teaser';
import { TremiSheet } from './promo/TremiSheet';
import { Promo, PROMO, PROMO_TOTAL, PromoIntro, PromoPlate, TremiClip } from './promo/Promo';
import timeline from './data/timeline.json';
import { Speaker } from './data/script';

const gate = (C: React.FC<any>) => (props: any) => (
  <FontGate>
    <C {...props} />
  </FontGate>
);

// Duración de cada lámina para DaVinci (incluye cola estática para recortar)
export const PLATES: { id: string; c: React.FC; sec: number }[] = [
  { id: 'P00-Intro', c: Intro, sec: 4.5 },
  { id: 'S1', c: S1, sec: 7 },
  { id: 'S2', c: S2, sec: 9 },
  { id: 'S3', c: S3, sec: 10 },
  { id: 'D1', c: D1, sec: 9 },
  { id: 'D2', c: D2, sec: 10 },
  { id: 'D3', c: D3, sec: 8 },
  { id: 'J1', c: J1, sec: 11 },
  { id: 'J2', c: J2, sec: 15 },
  { id: 'J3', c: J3, sec: 11 },
  { id: 'M1', c: M1, sec: 10 },
  { id: 'M2', c: M2, sec: 11 },
  { id: 'M3', c: M3, sec: 10 },
  { id: 'M4', c: M4, sec: 8 },
  { id: 'M5', c: M5, sec: 6 },
  { id: 'P99-Outro', c: Outro, sec: 9 },
];

const SPK: Speaker[] = ['salome', 'daniela', 'juan', 'maria'];

export const RemotionRoot: React.FC = () => (
  <>
    {PLATES.map((p) => (
      <Composition key={p.id} id={p.id} component={gate(p.c)} durationInFrames={Math.round(p.sec * FPS)} fps={FPS} width={W} height={H} />
    ))}
    <Composition id="Animatic" component={gate(Animatic)} durationInFrames={timeline.total} fps={FPS} width={W} height={H} defaultProps={{ subtitles: true }} />
    <Composition id="Promo" component={gate(Promo)} durationInFrames={PROMO_TOTAL} fps={FPS} width={W} height={H} defaultProps={{ music: true }} />
    <Composition id="PromoIntro" component={gate(PromoIntro)} durationInFrames={240} fps={FPS} width={W} height={H} />
    {PROMO.map((p) => (
      <Composition key={p.id} id={`PromoPlate-${p.id}`} component={gate(PromoPlate)} durationInFrames={p.dur + 120} fps={FPS} width={W} height={H} defaultProps={{ scene: p.id }} />
    ))}
    {([['saluda', 'wave', 'grin', false], ['celebra', 'celebrate', 'open', true], ['senala-derecha', 'point', 'open', false], ['senala-izquierda', 'pointLeft', 'open', false], ['presenta', 'present', 'smile', false]] as const).map(([id, pose, mouth, jump]) => (
      <Composition key={id} id={`Tremi-${id}`} component={gate(TremiClip)} durationInFrames={120} fps={FPS} width={1080} height={1080} defaultProps={{ pose, mouth, jump }} />
    ))}
    <Still id="TremiSheet" component={gate(TremiSheet)} width={1920} height={1080} />
    <Composition id="Teaser" component={gate(Teaser)} durationInFrames={615} fps={FPS} width={W} height={H} />
    {SPK.map((s) => (
      <Still key={`lt-${s}`} id={`LowerThird-${s}`} component={gate(LowerThird)} width={W} height={H} defaultProps={{ speaker: s }} />
    ))}
    {SPK.map((s) => (
      <Still key={`ov-${s}`} id={`LiveOverlay-${s}`} component={gate(LiveOverlay)} width={W} height={H} defaultProps={{ speaker: s }} />
    ))}
    <Still id="BadgeIlustrativo" component={gate(BadgeIllustrative)} width={W} height={H} />
    {(['horizontal', 'horizontal-dark', 'symbol', 'symbol-negative'] as const).map((v) => (
      <Still key={v} id={`Logo-${v}`} component={gate(LogoSheet)} width={v.startsWith('symbol') ? 1000 : 2000} height={v.startsWith('symbol') ? 1000 : 600} defaultProps={{ variant: v }} />
    ))}
  </>
);
