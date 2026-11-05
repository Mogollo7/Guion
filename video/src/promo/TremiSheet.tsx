import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Mascot, Pose, Mouth } from './Mascot';

/** Hoja de personaje: poses y expresiones de Tremi */
export const TremiSheet: React.FC = () => {
  const poses: [Pose, Mouth][] = [['idle', 'smile'], ['wave', 'grin'], ['point', 'open'], ['celebrate', 'open'], ['hold', 'smile'], ['present', 'o']];
  return (
    <AbsoluteFill style={{ background: '#fffff6', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', padding: 40 }}>
      {poses.map(([p, m], i) => (
        <div key={p} style={{ width: 560, height: 480, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Mascot size={420} pose={p} prevPose={p} mouth={m} lookX={i % 2 ? 0.8 : -0.4} />
          <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 26, color: '#2a6f49' }}>{p} · {m}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
