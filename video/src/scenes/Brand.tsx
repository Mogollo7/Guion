import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Bg, Icon, Isologo, Kicker, Pill, Symbol, Title, Words } from '../components';
import { appear, C, clamp, F, rise } from '../theme';
import { SPEAKERS, Speaker } from '../data/script';

/* INTRO — construcción del isologo */
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [6, 84], [0, 1], clamp);
  return (
    <Bg tone="dark">
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `scale(${1.04 - 0.04 * appear(f, 0, 90)})` }}>
          <Isologo height={150} progress={p} dark tagline />
        </div>
        <div style={{ marginTop: 70, ...rise(f, 92) }}>
          <Pill tone="ghost" size={24} style={{ background: 'rgba(255,255,255,0.08)', color: C.onDark, border: `1.5px solid ${C.borderDark}` }}>
            Territorio Sostenible · Agenda Antioquia 2040
          </Pill>
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

/* OUTRO — cierre, equipo y créditos */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const team = (Object.keys(SPEAKERS) as Speaker[]).map((k) => SPEAKERS[k].name);
  const credits = [
    'Fotos de especies: autores en iNaturalist (CC BY · CC BY-NC · CC BY-SA · CC BY-NC-SA), ver créditos en el prototipo',
    'Música: “Happy Beats / Business Moves Vol. 1”, Sascha Ende · ende.app (CC BY 4.0) · Efectos: Kenney (CC0)',
    'Límites municipales: DANE · MGN 2018 · Mapa base del prototipo: © colaboradores de OpenStreetMap',
    'Cifras del tablero, fichas y zonificación: datos ilustrativos del prototipo · Modelo: BioCLIP (Stevens et al., 2024)',
  ];
  return (
    <Bg tone="dark">
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 110 }}>
        <Isologo height={104} progress={interpolate(f, [0, 50], [0.35, 1], clamp)} dark />
        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <Title size={64} dark>
            <Words text="Territorio Sostenible," start={20} every={3} />
            <span style={{ color: C.olive400 }}>
              <Words text="decisiones a tiempo." start={32} every={3} />
            </span>
          </Title>
        </div>
        <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 90, rowGap: 18 }}>
          {team.map((n, i) => (
            <div key={n} style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.cream100, textAlign: i % 2 ? 'left' : 'right', ...rise(f, 50 + i * 6) }}>
              {n}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44, ...rise(f, 80) }}>
          <Pill tone="leaf" size={28}>
            Prototipo: mogollo7.github.io/PITB-Antioquia
          </Pill>
        </div>
        <div style={{ position: 'absolute', bottom: 54, left: 0, right: 0, textAlign: 'center', opacity: appear(f, 100, 20) }}>
          {credits.map((c) => (
            <div key={c} style={{ fontFamily: F.body, fontWeight: 500, fontSize: 19, lineHeight: 1.7, color: C.onDarkMuted }}>
              {c}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

/* Tercio inferior (PNG con transparencia) */
export const LowerThird: React.FC<{ speaker: Speaker }> = ({ speaker }) => {
  const s = SPEAKERS[speaker];
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 96, bottom: 92, display: 'flex', alignItems: 'stretch', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 50px -20px rgba(0,0,0,0.45)' }}>
        <div style={{ background: C.forest900, padding: '18px 22px', display: 'flex', alignItems: 'center' }}>
          <Symbol size={64} />
        </div>
        <div style={{ background: C.cream100, padding: '18px 34px 18px 28px' }}>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 40, color: C.ink900, lineHeight: 1.15 }}>{s.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <span style={{ fontFamily: F.body, fontWeight: 800, fontSize: 20, letterSpacing: '0.1em', color: C.leaf500 }}>{s.chapter}</span>
            <span style={{ fontFamily: F.body, fontWeight: 700, fontSize: 24, color: C.green700 }}>{s.role}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* Marca de capítulo + logo para poner encima del plano a cámara (PNG con transparencia) */
export const LiveOverlay: React.FC<{ speaker: Speaker }> = ({ speaker }) => {
  const s = SPEAKERS[speaker];
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 64, top: 52 }}>
        <Pill tone="ghost" size={22} style={{ background: 'rgba(7,56,33,0.78)', color: C.cream100, border: 'none' }}>
          <span style={{ color: C.olive400, fontWeight: 800 }}>{s.chapter}</span> {s.role}
        </Pill>
      </div>
      <div style={{ position: 'absolute', right: 60, top: 46, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(7,56,33,0.78)', padding: '8px 18px 8px 10px', borderRadius: 999 }}>
        <Symbol size={40} badge={false} variant="mono-light" />
        <span style={{ fontFamily: F.body, fontWeight: 800, fontSize: 22, color: C.cream100 }}>
          PITB <span style={{ color: C.olive400 }}>Antioquia</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* Sello de datos ilustrativos (PNG) */
export const BadgeIllustrative: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', right: 64, bottom: 56 }}>
      <Pill tone="warn" size={24} style={{ boxShadow: '0 12px 30px -12px rgba(0,0,0,0.4)' }}>
        <Icon name="alert" size={26} color={C.warn} /> Datos ilustrativos del prototipo
      </Pill>
    </div>
  </AbsoluteFill>
);

/* Lámina de logo para exportar PNG transparente */
export const LogoSheet: React.FC<{ variant: 'horizontal' | 'horizontal-dark' | 'symbol' | 'symbol-negative' }> = ({ variant }) => (
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
    {variant === 'horizontal' && <Isologo height={220} />}
    {variant === 'horizontal-dark' && <Isologo height={220} dark />}
    {variant === 'symbol' && <Symbol size={720} />}
    {variant === 'symbol-negative' && <Symbol size={720} variant="negative" />}
  </AbsoluteFill>
);

/* Tarjeta de marcador de posición para el animatic: aquí va el plano a cámara */
export const LivePlaceholder: React.FC<{ speaker: Speaker }> = ({ speaker }) => {
  const s = SPEAKERS[speaker];
  return (
    <AbsoluteFill style={{ background: '#2b3a30', justifyContent: 'center', alignItems: 'center', fontFamily: F.body }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
        <rect x={640} y={140} width={640} height={800} rx={320} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="18 14" />
        <circle cx={960} cy={420} r={150} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="18 14" />
      </svg>
      <Kicker dark>Plano a cámara</Kicker>
      <div style={{ marginTop: 16, fontFamily: F.display, fontWeight: 700, fontSize: 64, color: C.cream100 }}>{s.name}</div>
      <LiveOverlay speaker={speaker} />
    </AbsoluteFill>
  );
};
