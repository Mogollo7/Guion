import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AntioquiaMap, Bg, Body, Card, Counter, Icon, Kicker, Photo, Pill, Title, project, mapSize } from '../components';
import { appear, C, clamp, EASE, EASE_IN_OUT, F, pop, rise } from '../theme';
import geo from '../data/antioquia.json';

/* J1 — qué es BioCLIP */
const TAXA = [
  ['Reino', 'Animalia'],
  ['Filo', 'Chordata'],
  ['Clase', 'Mammalia'],
  ['Orden', 'Carnivora'],
  ['Familia', 'Ursidae'],
  ['Género', 'Tremarctos'],
  ['Especie', 'Tremarctos ornatus'],
];

export const J1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Bg>
      <div style={{ position: 'absolute', left: 130, top: 120, width: 1000 }}>
        <div style={rise(f, 0)}>
          <Kicker>La tecnología</Kicker>
        </div>
        <div style={{ marginTop: 14, ...rise(f, 4) }}>
          <Title size={150} style={{ color: C.forest900 }}>
            BioCLIP
          </Title>
        </div>
        <div style={{ marginTop: 8, ...rise(f, 14) }}>
          <Body size={34}>Modelo de visión del Imageomics Institute · Universidad Estatal de Ohio</Body>
        </div>
        <div style={{ marginTop: 34, ...rise(f, 34) }}>
          <Pill tone="dark" size={30}>
            <svg width={34} height={34} viewBox="0 0 24 24">
              <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.1 6-.7L12 3Z" fill={C.olive400} />
            </svg>
            Mejor Artículo Estudiantil · CVPR 2024
          </Pill>
        </div>
        <div style={{ marginTop: 64, display: 'flex', gap: 80 }}>
          {[
            { v: 10, suf: 'M+', label: 'imágenes de entrenamiento', sub: 'TreeOfLife-10M', at: 60 },
            { v: 450, suf: 'K+', label: 'taxones', sub: 'animales, plantas, hongos', at: 80 },
          ].map((s) => (
            <div key={s.label} style={rise(f, s.at)}>
              <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 120, lineHeight: 1, color: C.green700 }}>
                <Counter to={s.v} start={s.at} dur={40} />
                {s.suf}
              </div>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.ink900, marginTop: 6 }}>{s.label}</div>
              <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 22, color: C.ink600 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 16, ...rise(f, 186) }}>
          <Icon name="check" size={34} color={C.leaf500} />
          <Body size={30} style={{ color: C.ink900, fontWeight: 700 }}>
            Reconoce especies con pocos o ningún ejemplo previo (zero/few-shot)
          </Body>
        </div>
      </div>
      {/* árbol taxonómico */}
      <div style={{ position: 'absolute', left: 1180, top: 120, width: 700 }}>
        <div style={{ ...rise(f, 100), marginBottom: 22, display: 'flex', alignItems: 'center', gap: 18 }}>
          <Photo src="species/tremarctos-ornatus.jpg" w={110} h={110} radius={55} />
          <Body size={24}>Clasifica siguiendo el árbol de la vida</Body>
        </div>
        {TAXA.map(([rank, name], i) => {
          const a = pop(f, fps, 110 + i * 12, 16, 150);
          const last = i === TAXA.length - 1;
          return (
            <div key={rank} style={{ display: 'flex', alignItems: 'center', marginLeft: i * 34, marginBottom: 12, opacity: Math.min(1, a), transform: `translateX(${(1 - Math.min(1, a)) * -30}px)` }}>
              <div style={{ width: 22, height: 2, background: C.olive400, marginRight: 10 }} />
              <span style={{ fontFamily: F.body, fontSize: 18, fontWeight: 700, color: C.ink600, width: 84, flex: 'none' }}>{rank}</span>
              <Pill tone={last ? 'dark' : 'ok'} size={24} style={{ fontStyle: last || i === 5 ? 'italic' : 'normal' }}>
                {name}
              </Pill>
            </div>
          );
        })}
      </div>
    </Bg>
  );
};

/* J2 — prueba preliminar: 56 ranas */
export const J2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bars = [
    { label: 'Acierta a la primera', sub: 'top-1', v: 62.9, at: 60, color: C.olive400 },
    { label: 'Entre 3 candidatas', sub: 'top-3', v: 86.1, at: 100, color: C.green700 },
  ];
  const barW = 1000;
  const frogs = ['pristimantis-penelopus', 'dendrobates-truncatus', 'agalychnis-callidryas'];
  const big = pop(f, fps, 200, 12, 140);
  return (
    <Bg>
      <div style={{ position: 'absolute', left: 130, top: 110 }}>
        <div style={rise(f, 0)}>
          <Kicker>Prueba preliminar</Kicker>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 30, ...rise(f, 6) }}>
          <Title size={70}>56 especies de ranas de Colombia</Title>
          <div style={{ display: 'flex' }}>
            {frogs.map((fr, i) => (
              <div key={fr} style={{ marginLeft: i ? -26 : 0, transform: `scale(${Math.min(1, pop(f, fps, 14 + i * 6))})`, border: `5px solid ${C.cream100}`, borderRadius: 60 }}>
                <Photo src={`species/${fr}.jpg`} w={100} h={100} radius={50} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 130, top: 380, width: barW + 300 }}>
        {bars.map((b) => {
          const g = appear(f, b.at, 40, EASE);
          return (
            <div key={b.label} style={{ marginBottom: 56, ...rise(f, b.at - 10) }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
                <span style={{ fontFamily: F.body, fontWeight: 800, fontSize: 36, color: C.ink900 }}>{b.label}</span>
                <span style={{ fontFamily: F.body, fontWeight: 700, fontSize: 24, color: C.ink600 }}>({b.sub})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <div style={{ width: barW, height: 64, borderRadius: 14, background: C.canvasAlt, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${b.v * g}%`, background: b.color, borderRadius: 14 }} />
                  {[25, 50, 75].map((t) => (
                    <div key={t} style={{ position: 'absolute', left: `${t}%`, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.6)' }} />
                  ))}
                </div>
                <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 76, color: b.color === C.olive400 ? C.green700 : C.forest900, width: 260 }}>
                  <Counter to={b.v} start={b.at} dur={40} decimals={1} suffix=" %" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* +24,9 puntos */}
      <div style={{ position: 'absolute', left: 130, top: 800, opacity: Math.min(1, big), transform: `translateY(${(1 - Math.min(1, big)) * 30}px)` }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '28px 44px', background: C.forest900, border: 'none' }}>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 96, color: C.olive400, lineHeight: 1 }}>
            +<Counter to={24.9} start={200} dur={36} decimals={1} />
            <span style={{ fontSize: 48 }}> pts</span>
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: C.cream100 }}>al reordenar las candidatas con la ubicación</div>
            <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 22, color: C.onDarkMuted, marginTop: 6 }}>Paso de la plataforma: BioCLIP no usa coordenadas GPS</div>
          </div>
        </Card>
      </div>
      <div style={{ position: 'absolute', right: 70, bottom: 44, opacity: appear(f, 120, 20) }}>
        <Pill tone="warn" size={20}>
          Resultados preliminares · solo anfibios (ranas)
        </Pill>
      </div>
    </Bg>
  );
};

/* J3 — salvaguardas */
export const J3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = pop(f, fps, 6, 9, 180);
  const cardW = 520;
  const gap = 56;
  const x0 = (1920 - (cardW * 3 + gap * 2)) / 2;
  const t = (i: number) => 50 + i * 40;
  const mini = 250;
  const miniW = mapSize(mini).width;
  const s = mini / geo.height;
  const bear = project(5.9, -75.9);
  const blur = appear(f, t(2) + 50, 30, EASE_IN_OUT);
  return (
    <Bg>
      <div style={{ position: 'absolute', left: x0, top: 110, display: 'flex', alignItems: 'center', gap: 40 }}>
        <div>
          <div style={rise(f, 0)}>
            <Kicker>Uso responsable de la IA</Kicker>
          </div>
          <div style={{ marginTop: 14, ...rise(f, 4) }}>
            <Title size={66}>La IA propone, una persona decide</Title>
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 110,
          transform: `rotate(-8deg) scale(${1.6 - 0.6 * Math.min(1, stamp)})`,
          opacity: Math.min(1, stamp),
          border: `5px solid ${C.danger}`,
          color: C.danger,
          borderRadius: 14,
          padding: '12px 26px',
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: '0.12em',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        PRELIMINAR
        <div style={{ fontSize: 20, letterSpacing: '0.08em' }}>SOLO RANAS</div>
      </div>
      {[0, 1, 2].map((i) => {
        const a = pop(f, fps, t(i), 16, 130);
        const title = ['Una persona revisa lo dudoso', 'Puede responder “no concluyente”', 'Coordenadas sensibles protegidas'][i];
        const icon = (['user', 'alert', 'shield'] as const)[i];
        return (
          <div key={i} style={{ position: 'absolute', left: x0 + i * (cardW + gap), top: 330, width: cardW, height: 560, opacity: Math.min(1, a), transform: `translateY(${(1 - Math.min(1, a)) * 40}px)` }}>
            <Card style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <Icon name={icon} size={52} color={C.green700} />
              <div style={{ marginTop: 18, fontFamily: F.display, fontWeight: 700, fontSize: 38, lineHeight: 1.15, color: C.ink900 }}>{title}</div>
              <div style={{ marginTop: 'auto', height: 290, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i === 0 && (
                  <div style={{ width: 440 }}>
                    {[
                      { n: 'Pristimantis penelopus', v: 48.2, st: 'En revisión' },
                      { n: 'Pristimantis palmeri', v: 41.5, st: '' },
                    ].map((r, j) => (
                      <div key={r.n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 14, background: C.canvasAlt, marginBottom: 12, opacity: appear(f, t(0) + 20 + j * 8, 14) }}>
                        <span style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 22 }}>{r.n}</span>
                        <span style={{ fontWeight: 800, fontSize: 22, color: C.ink600 }}>{r.v.toFixed(1).replace('.', ',')} %</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, opacity: appear(f, t(0) + 44, 14) }}>
                      <div style={{ width: 52, height: 52, borderRadius: 26, background: C.leaf500, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontWeight: 700, color: C.forest900, fontSize: 22 }}>LZ</div>
                      <Pill tone="warn" size={20}>Validación humana pendiente</Pill>
                    </div>
                  </div>
                )}
                {i === 1 && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 84, fontFamily: F.display, fontWeight: 700, color: C.warn, lineHeight: 1, opacity: appear(f, t(1) + 20, 12) }}>?</div>
                    <div style={{ marginTop: 16, transform: `scale(${Math.min(1, pop(f, fps, t(1) + 30, 12, 150))})` }}>
                      <Pill tone="warn" size={30}>No concluyente</Pill>
                    </div>
                    <div style={{ marginTop: 20, fontSize: 22, fontWeight: 600, color: C.ink600, opacity: appear(f, t(1) + 44, 14) }}>Certeza insuficiente → no se publica como especie</div>
                  </div>
                )}
                {i === 2 && (
                  <div style={{ position: 'relative', width: miniW, height: mini }}>
                    <AntioquiaMap height={mini} x={0} y={0} drawStart={t(2)} drawEvery={0.1}>
                      <circle cx={bear.x} cy={bear.y} r={10 + blur * 90} fill={C.mapAccent} fillOpacity={0.12 + 0.18 * blur} stroke={C.mapAccent} strokeWidth={3} strokeDasharray={blur > 0.1 ? '10 8' : undefined} opacity={appear(f, t(2) + 24, 10)} />
                      <rect x={-9} y={-9} width={18} height={18} transform={`translate(${bear.x} ${bear.y}) rotate(45)`} fill={C.mapAccent} stroke="#fff" strokeWidth={3} opacity={(1 - blur) * appear(f, t(2) + 24, 10)} />
                    </AntioquiaMap>
                    <div style={{ position: 'absolute', left: bear.x * s + 50, top: bear.y * s - 70, opacity: appear(f, t(2) + 70, 12) }}>
                      <Pill tone="dark" size={18}>Ubicación generalizada</Pill>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      })}
    </Bg>
  );
};

export const _j = { interpolate, clamp };
