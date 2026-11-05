import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { AntioquiaMap, Bg, BrowserFrame, Isologo, Kicker, Pill, Title, Words, mapSize } from '../components';
import { appear, C, clamp, F, rise } from '../theme';
import b from '../data/boxes.json';
import species from '../data/species.json';

// Cortes sobre la grilla de la pista (120 BPM, beats cada 0,5 s desde 3,02 s; golpe fuerte en 17,02 s)
const CUT = { reveal: 91, h1: 181, h2: 301, h3: 421, punch: 511, end: 615 };

const Caption: React.FC<{ text: string; kicker: string; start?: number }> = ({ text, kicker, start = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={rise(f, start, 14)}>
      <Kicker>{kicker}</Kicker>
      <Title size={58} style={{ marginTop: 8 }}>
        {text}
      </Title>
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const h = 900;
  const { width } = mapSize(h);
  return (
    <Bg>
      <AntioquiaMap height={h} x={1850 - width} y={90} drawStart={0} drawEvery={0.35} />
      <div style={{ position: 'absolute', left: 130, top: 330, width: 900 }}>
        <Title size={104}>
          <Words text="¿Qué especies habitan Antioquia" start={4} every={4} />
          <span style={{ color: C.leaf500 }}>
            <Words text="hoy?" start={24} every={4} />
          </span>
        </Title>
      </div>
      <div style={{ position: 'absolute', left: 130, top: 300, opacity: appear(f, 0, 10) }}>
        <Kicker>125 municipios · 21.600+ especies</Kicker>
      </div>
    </Bg>
  );
};

const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Bg tone="dark">
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Isologo height={150} progress={interpolate(f, [0, 50], [0, 1], clamp)} dark tagline />
        <div style={{ marginTop: 60, ...rise(f, 46) }}>
          <Title size={44} dark style={{ fontWeight: 500, fontStyle: 'italic', textAlign: 'center' }}>
            Un catálogo vivo de fauna y flora, construido con inteligencia artificial
          </Title>
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

const FR = { width: 1340, x: 520, y: 150 };

const H1: React.FC = () => {
  const an = { x: b.analizar_btn.x + b.analizar_btn.w / 2, y: b.analizar_btn.y + b.analizar_btn.h / 2 };
  return (
    <Bg tone="alt" contours={false}>
      <div style={{ position: 'absolute', left: 90, top: 300, width: 400 }}>
        <Caption kicker="1 · Explorar" text="Sube una foto. BioCLIP identifica la especie." />
      </div>
      <BrowserFrame
        {...FR}
        layers={[
          { src: 'proto/03_foto_subida.png', from: 0 },
          { src: 'proto/04_procesando_2.png', from: 16, h: 2230 },
          { src: 'proto/04_procesando_5.png', from: 28, h: 2374 },
          { src: 'proto/05_ficha_full.png', from: 44, h: 3304 },
        ]}
        cam={[
          { f: 0, x: 1280, y: 800, s: 1 },
          { f: 14, x: 702, y: 1300, s: 1.3 },
          { f: 40, x: 702, y: 1700, s: 1.3 },
          { f: 52, x: 1280, y: 800, s: 1 },
          { f: 80, x: 1400, y: 800, s: 1.1 },
          { f: 120, x: 820, y: 1700, s: 1.25 },
        ]}
        cursor={[
          { f: 0, x: 1400, y: 1500 },
          { f: 12, x: an.x, y: an.y, click: true },
          { f: 60, x: 2000, y: 1300 },
        ]}
        callouts={[{ from: 56, to: 120, box: b.ficha_certeza, label: 'Certeza BioCLIP', side: 'left' }]}
      />
      <Sequence from={12} durationInFrames={10}>
        <Audio src={staticFile('sfx/click.ogg')} volume={0.4} />
      </Sequence>
    </Bg>
  );
};

const H2: React.FC = () => {
  const f = useCurrentFrame();
  const h = 860;
  const { width } = mapSize(h);
  return (
    <Bg>
      <div style={{ position: 'absolute', left: 90, top: 300, width: 760 }}>
        <Caption kicker="2 · Tablero territorial" text="Cada registro, en su lugar del territorio." />
        <div style={{ marginTop: 300, ...rise(f, 30) }}>
          <Pill tone="warn" size={20}>
            Registros de demostración del prototipo
          </Pill>
        </div>
      </div>
      <AntioquiaMap
        height={h}
        x={1800 - width}
        y={110}
        drawStart={0}
        drawEvery={0.15}
        markers={species.map((s, i) => ({ lat: s.lat, lng: s.lng, at: 20 + i * 2, pulse: i % 4 === 0 }))}
      />
    </Bg>
  );
};

const H3: React.FC = () => {
  const act = { x: b.reg_accion.x + b.reg_accion.w / 2, y: b.reg_accion.y + b.reg_accion.h / 2 };
  return (
    <Bg tone="alt" contours={false}>
      <div style={{ position: 'absolute', left: 90, top: 300, width: 400 }}>
        <Caption kicker="3 · Registros de campo" text="Expertos y CAR validan cada detección." />
      </div>
      <BrowserFrame
        {...FR}
        layers={[
          { src: 'proto/09_registros_suroeste.png', from: 0 },
          { src: 'proto/10_registros_validado.png', from: 40 },
        ]}
        cam={[
          { f: 0, x: 1700, y: 820, s: 1.35 },
          { f: 90, x: 1760, y: 820, s: 1.5 },
        ]}
        cursor={[
          { f: 0, x: act.x - 200, y: act.y + 200 },
          { f: 34, x: act.x, y: act.y, click: true },
          { f: 90, x: act.x + 50, y: act.y + 100 },
        ]}
        callouts={[{ from: 44, to: 90, box: b.reg_estado, label: 'Validado', side: 'bottom', dim: false }]}
      />
      <Sequence from={34} durationInFrames={10}>
        <Audio src={staticFile('sfx/click.ogg')} volume={0.4} />
      </Sequence>
    </Bg>
  );
};

const Punch: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Bg tone="dark">
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Title size={104} dark>
          <Words text="Cada foto se convierte" start={0} every={3} />
          <br />
          <span style={{ color: C.olive400 }}>
            <Words text="en un dato." start={12} every={3} />
          </span>
        </Title>
        <div style={{ marginTop: 70, display: 'flex', alignItems: 'center', gap: 40, ...rise(f, 30) }}>
          <Isologo height={70} dark />
          <Pill tone="leaf" size={26}>
            mogollo7.github.io/PITB-Antioquia
          </Pill>
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

/** /brag — teaser de 20 s (formato landscape) */
export const Teaser: React.FC = () => {
  const total = CUT.end;
  const cuts = [CUT.reveal, CUT.h1, CUT.h2, CUT.h3, CUT.punch];
  return (
    <AbsoluteFill style={{ background: C.forest900, fontFamily: F.body }}>
      <Sequence durationInFrames={CUT.reveal}>
        <Hook />
      </Sequence>
      <Sequence from={CUT.reveal} durationInFrames={CUT.h1 - CUT.reveal}>
        <Reveal />
      </Sequence>
      <Sequence from={CUT.h1} durationInFrames={CUT.h2 - CUT.h1}>
        <H1 />
      </Sequence>
      <Sequence from={CUT.h2} durationInFrames={CUT.h3 - CUT.h2}>
        <H2 />
      </Sequence>
      <Sequence from={CUT.h3} durationInFrames={CUT.punch - CUT.h3}>
        <H3 />
      </Sequence>
      <Sequence from={CUT.punch} durationInFrames={total - CUT.punch}>
        <Punch />
      </Sequence>
      {/* transición: inmersión breve al fondo en cada corte */}
      {cuts.map((c) => (
        <Sequence key={c} from={c - 4} durationInFrames={10}>
          <Dip />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/music.mp3')} volume={(f) => interpolate(f, [0, 8, total - 36, total], [0, 0.8, 0.8, 0], clamp)} />
      {cuts.map((c) => (
        <Sequence key={`s${c}`} from={c} durationInFrames={20}>
          <Audio src={staticFile('sfx/whoosh.ogg')} volume={0.25} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Dip: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 4, 10], [0, 1, 0], clamp);
  return <AbsoluteFill style={{ background: C.forest900, opacity: o }} />;
};
