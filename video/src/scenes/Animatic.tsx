import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import timeline from '../data/timeline.json';
import { F, C, clamp } from '../theme';
import { Intro, LivePlaceholder, LowerThird, Outro } from './Brand';
import { S1, S2, S3 } from './Salome';
import { D1, D2, D3 } from './Daniela';
import { J1, J2, J3 } from './Juan';
import { M1, M2, M3, M4, M5 } from './Maria';
import { Speaker } from '../data/script';

export const PLATE_MAP: Record<string, React.FC> = { S1, S2, S3, D1, D2, D3, J1, J2, J3, M1, M2, M3, M4, M5 };

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const cur = timeline.subtitles.find((s) => f >= s.from && f <= s.to);
  if (!cur) return null;
  const o = interpolate(f, [cur.from, cur.from + 4, cur.to - 3, cur.to], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 46 }}>
      <div
        style={{
          opacity: o,
          maxWidth: 1500,
          textAlign: 'center',
          background: 'rgba(7,56,33,0.82)',
          color: C.cream100,
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 36,
          lineHeight: 1.35,
          padding: '10px 26px',
          borderRadius: 14,
        }}
      >
        {cur.text}
      </div>
    </AbsoluteFill>
  );
};

/** Animatic: muestra el montaje completo con marcadores de posición para los planos a cámara. */
export const Animatic: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  const total = timeline.total;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {timeline.segments.map((s, i) => {
        const key = `${s.type}-${i}`;
        if (s.type === 'intro')
          return (
            <Sequence key={key} from={s.from} durationInFrames={s.dur}>
              <Intro />
            </Sequence>
          );
        if (s.type === 'outro')
          return (
            <Sequence key={key} from={s.from} durationInFrames={s.dur}>
              <Outro />
            </Sequence>
          );
        if (s.type === 'live')
          return (
            <Sequence key={key} from={s.from} durationInFrames={s.dur}>
              <LivePlaceholder speaker={s.speaker as Speaker} />
              {s.lowerThird && <LowerThird speaker={s.speaker as Speaker} />}
            </Sequence>
          );
        const P = PLATE_MAP[s.id as string];
        return (
          <Sequence key={key} from={s.from} durationInFrames={s.dur}>
            <P />
          </Sequence>
        );
      })}
      {subtitles && <Subtitles />}
      <Audio
        src={staticFile('audio/music.mp3')}
        volume={(f) => interpolate(f, [0, 20, total - 60, total], [0, 0.32, 0.32, 0], clamp)}
      />
    </AbsoluteFill>
  );
};
