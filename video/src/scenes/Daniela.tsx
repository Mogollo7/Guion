import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AntioquiaMap, Bg, Body, BrowserFrame, Card, Counter, Icon, Illustrative, Isologo, Kicker, Photo, Pill, Title, project, mapSize } from '../components';
import { appear, C, clamp, EASE, EASE_IN_OUT, F, pop, rise } from '../theme';
import species from '../data/species.json';
import geo from '../data/antioquia.json';

/* D1 — la propuesta */
export const D1: React.FC = () => {
  const f = useCurrentFrame();
  const chips = ['BioCLIP clasifica fauna y flora', 'Catálogo vivo', 'Actualizado', 'Comparable en el tiempo'];
  return (
    <Bg>
      <div style={{ position: 'absolute', left: 130, top: 150, width: 760 }}>
        <div style={rise(f, 0)}>
          <Kicker>La propuesta</Kicker>
        </div>
        <div style={{ marginTop: 34 }}>
          <Isologo height={104} progress={interpolate(f, [4, 70], [0, 1], clamp)} />
        </div>
        <div style={{ marginTop: 44, ...rise(f, 40) }}>
          <Title size={58}>Plataforma web con IA de visión por computador</Title>
        </div>
        <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {chips.map((c, i) => (
            <div key={c} style={rise(f, 70 + i * 12, 18, 16)}>
              <Pill tone={i === 0 ? 'dark' : 'ok'} size={28}>
                {i === 0 ? <Icon name="dna" size={28} color={C.leaf500} /> : <Icon name="check" size={26} color={C.green700} />}
                {c}
              </Pill>
            </div>
          ))}
        </div>
      </div>
      <BrowserFrame
        layers={[{ src: 'proto/00_inicio.png', from: 0 }]}
        width={940}
        x={900}
        y={210}
        enter={18}
        url="mogollo7.github.io/PITB-Antioquia"
        cam={[
          { f: 0, x: 1280, y: 800, s: 1 },
          { f: 270, x: 1000, y: 700, s: 1.12 },
        ]}
      />
    </Bg>
  );
};

/* D2 — cómo funciona: foto → BioCLIP → territorio → mapa colectivo */
const oso = species.find((s) => s.id === 'tremarctos-ornatus')!;

export const D2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardW = 390;
  const gap = 56;
  const x0 = (1920 - (cardW * 4 + gap * 3)) / 2;
  const top = 330;
  const cardH = 520;
  const t = (i: number) => 10 + i * 44;
  const steps = [
    { n: 1, icon: 'camera' as const, title: 'Sube una foto' },
    { n: 2, icon: 'dna' as const, title: 'BioCLIP identifica la especie' },
    { n: 3, icon: 'pin' as const, title: 'Se ubica en el territorio' },
    { n: 4, icon: 'map' as const, title: 'Se publica en el mapa colectivo' },
  ];
  const mini = 250;
  const miniW = mapSize(mini).width;
  const p = project(oso.lat, oso.lng);
  return (
    <Bg>
      <div style={{ position: 'absolute', left: x0, top: 120 }}>
        <div style={rise(f, 0)}>
          <Kicker>Cómo funciona</Kicker>
        </div>
        <div style={{ marginTop: 16, ...rise(f, 6) }}>
          <Title size={66}>De una foto a un dato del territorio</Title>
        </div>
      </div>
      {steps.map((s, i) => {
        const a = pop(f, fps, t(i), 16, 130);
        const x = x0 + i * (cardW + gap);
        return (
          <React.Fragment key={s.n}>
            <div style={{ position: 'absolute', left: x, top, width: cardW, height: cardH, opacity: Math.min(1, a), transform: `translateY(${(1 - Math.min(1, a)) * 40}px)` }}>
              <Card style={{ height: '100%', boxSizing: 'border-box', padding: 30, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 27, background: C.forest900, color: C.olive400, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 28 }}>{s.n}</div>
                  <Icon name={s.icon} size={44} color={C.green700} />
                </div>
                <div style={{ marginTop: 22, fontFamily: F.display, fontWeight: 700, fontSize: 34, lineHeight: 1.15, color: C.ink900, minHeight: 80 }}>{s.title}</div>
                <div style={{ marginTop: 'auto', height: 270, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i === 0 && (
                    <div style={{ width: 320, height: 230, borderRadius: 18, border: `3px dashed rgba(42,111,73,0.35)`, background: C.canvasAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <div style={{ transform: `translateY(${(1 - appear(f, t(0) + 14, 20)) * -260}px) rotate(${(1 - appear(f, t(0) + 14, 20)) * -8}deg)` }}>
                        <Photo src="species/tremarctos-ornatus.jpg" w={290} h={200} radius={14} />
                      </div>
                    </div>
                  )}
                  {i === 1 && (
                    <div style={{ width: 320 }}>
                      <div style={{ fontFamily: F.body, fontStyle: 'italic', fontWeight: 700, fontSize: 28, color: C.ink900 }}>{oso.sci}</div>
                      <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 22, color: C.ink600, marginBottom: 18 }}>{oso.common}</div>
                      {[
                        { n: 'Tremarctos ornatus', v: 88.7 },
                        { n: 'Ursus americanus', v: 6.4 },
                        { n: 'Tapirus terrestris', v: 1.1 },
                      ].map((r, j) => {
                        const g = appear(f, t(1) + 16 + j * 8, 26);
                        return (
                          <div key={r.n} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, color: j === 0 ? C.green700 : C.ink600 }}>
                              <span>{j + 1}. {r.n}</span>
                              <span>{(r.v * g).toFixed(1).replace('.', ',')} %</span>
                            </div>
                            <div style={{ height: 10, borderRadius: 5, background: C.canvasAlt, marginTop: 6 }}>
                              <div style={{ width: `${r.v * g}%`, height: '100%', borderRadius: 5, background: j === 0 ? C.green700 : C.olive400 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {i === 2 && (
                    <div style={{ position: 'relative', width: miniW, height: mini }}>
                      <AntioquiaMap height={mini} x={0} y={0} drawStart={t(2)} drawEvery={0.12} markers={[{ lat: oso.lat, lng: oso.lng, at: t(2) + 30, pulse: true }]} />
                      <div style={{ position: 'absolute', left: p.x * (mini / geo.height) + 18, top: p.y * (mini / geo.height) + 8, opacity: appear(f, t(2) + 36, 14) }}>
                        <Pill tone="dark" size={17}>Subregión Suroeste</Pill>
                      </div>
                    </div>
                  )}
                  {i === 3 && (
                    <AntioquiaMap
                      height={mini}
                      x={(cardW - 60 - miniW) / 2}
                      y={10}
                      drawStart={t(3)}
                      drawEvery={0.1}
                      markers={[
                        ...species.filter((s) => s.id !== oso.id).map((s, j) => ({ lat: s.lat, lng: s.lng, at: t(3) + 20 + j, color: C.green700 })),
                        { lat: oso.lat, lng: oso.lng, at: t(3) + 50, pulse: true },
                      ]}
                    />
                  )}
                </div>
              </Card>
            </div>
            {i < 3 && (
              <div style={{ position: 'absolute', left: x + cardW + 6, top: top + cardH / 2 - 22, opacity: appear(f, t(i + 1) - 6, 12) }}>
                <Icon name="arrow" size={44} color={C.leaf500} stroke={2.4} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </Bg>
  );
};

/* D3 — señales ecológicas a tiempo */
export const D3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardW = 520;
  const gap = 56;
  const x0 = (1920 - (cardW * 3 + gap * 2)) / 2;
  const top = 340;
  const t = (i: number) => 12 + i * 24;
  const mini = 270;
  const miniW = mapSize(mini).width;
  const s = mini / geo.height;
  const A = project(7.9, -76.6);
  const B = project(6.25, -74.62);
  const arc = `M${A.x},${A.y} Q${(A.x + B.x) / 2 + 40},${Math.min(A.y, B.y) - 160} ${B.x},${B.y}`;
  const cards = [
    { title: 'Disminución de poblaciones', icon: 'trend' as const },
    { title: 'Cambios migratorios', icon: 'arrow' as const },
    { title: 'Apariciones inesperadas', icon: 'alert' as const },
  ];
  // serie ilustrativa descendente
  const pts = [80, 76, 79, 70, 66, 61, 63, 52, 45, 38];
  const lp = appear(f, t(0) + 14, 60, EASE_IN_OUT);
  return (
    <Bg tone="dark">
      <div style={{ position: 'absolute', left: x0, top: 120 }}>
        <div style={rise(f, 0)}>
          <Kicker dark>Alertas tempranas</Kicker>
        </div>
        <div style={{ marginTop: 16, ...rise(f, 6) }}>
          <Title size={66} dark>
            Señales ecológicas, detectadas a tiempo
          </Title>
        </div>
      </div>
      {cards.map((c, i) => {
        const a = pop(f, fps, t(i), 16, 130);
        return (
          <div key={c.title} style={{ position: 'absolute', left: x0 + i * (cardW + gap), top, width: cardW, height: 520, opacity: Math.min(1, a), transform: `translateY(${(1 - Math.min(1, a)) * 40}px)` }}>
            <Card dark style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Icon name={c.icon} size={44} color={C.olive400} />
                <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 36, color: C.cream100 }}>{c.title}</div>
              </div>
              <div style={{ marginTop: 'auto', height: 320, position: 'relative' }}>
                {i === 0 && (
                  <svg width={448} height={300} viewBox="0 0 448 300">
                    {[0, 1, 2, 3].map((g) => (
                      <line key={g} x1={0} x2={448} y1={40 + g * 70} y2={40 + g * 70} stroke="rgba(255,255,255,0.1)" />
                    ))}
                    <polyline
                      points={pts.map((v, j) => `${(j / (pts.length - 1)) * 430 + 9},${300 - v * 3.2}`).join(' ')}
                      fill="none"
                      stroke={C.mapAccent}
                      strokeWidth={6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - lp}
                    />
                    <circle cx={439} cy={300 - pts[pts.length - 1] * 3.2} r={11 * appear(f, t(0) + 70, 10)} fill={C.mapAccent} />
                  </svg>
                )}
                {(i === 1 || i === 2) && (
                  <div style={{ position: 'absolute', left: (448 - miniW) / 2, top: 10 }}>
                    <AntioquiaMap
                      height={mini}
                      x={0}
                      y={0}
                      dark
                      drawStart={t(i)}
                      drawEvery={0.1}
                      markers={
                        i === 2
                          ? [
                              ...species.slice(0, 14).map((sp, j) => ({ lat: sp.lat, lng: sp.lng, at: t(i) + 20 + j, color: C.olive400 })),
                              { lat: 6.7, lng: -75.95, at: t(i) + 56, pulse: true, color: C.mapAccent },
                            ]
                          : []
                      }
                    >
                      {i === 1 && (
                        <g>
                          <path d={arc} fill="none" stroke={C.mapAccent} strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-f} opacity={appear(f, t(1) + 20, 20)} />
                          <circle cx={A.x} cy={A.y} r={12} fill={C.olive400} opacity={appear(f, t(1) + 16, 10)} />
                          <circle cx={B.x} cy={B.y} r={14} fill={C.mapAccent} opacity={appear(f, t(1) + 50, 10)} />
                        </g>
                      )}
                    </AntioquiaMap>
                    {i === 2 && (
                      <div style={{ position: 'absolute', left: project(6.7, -75.95).x * s + 22, top: project(6.7, -75.95).y * s - 18, opacity: appear(f, t(2) + 60, 12) }}>
                        <Pill tone="leaf" size={18}>Nuevo registro</Pill>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      })}
      <Illustrative text="Ejemplos ilustrativos" style={{ left: x0, top: 905 }} start={70} />
    </Bg>
  );
};

export const _d = { EASE, Body, Counter, AbsoluteFill };
