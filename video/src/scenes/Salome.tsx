import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { AntioquiaMap, Bg, Counter, Icon, Kicker, Photo, Pill, Title, Words, Body, mapSize } from '../components';
import { appear, C, clamp, EASE_IN_OUT, F, pop, rise } from '../theme';
import geo from '../data/antioquia.json';

/* S1 — 125 municipios / ¿qué especies lo habitan hoy? */
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapH = 940;
  const { width: mapW } = mapSize(mapH);
  const shown = Math.min(125, Math.max(0, Math.floor((f - 4) / 0.5)));
  // signos de interrogación en municipios (muestra fija)
  const qIdx = [3, 11, 19, 27, 38, 46, 57, 66, 74, 83, 91, 102, 111, 119];
  return (
    <Bg>
      <AbsoluteFill style={{ padding: '150px 0 0 140px' }}>
        <div style={rise(f, 0)}>
          <Kicker>El problema · Ordenamiento territorial</Kicker>
        </div>
        <div style={{ marginTop: 28, fontFamily: F.display, fontWeight: 700, fontSize: 260, lineHeight: 0.9, color: C.forest900, letterSpacing: '-0.03em' }}>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{shown}</span>
        </div>
        <div style={{ ...rise(f, 12), marginTop: 14 }}>
          <Body size={40} style={{ color: C.ink900, fontWeight: 600 }}>
            municipios por planificar
          </Body>
        </div>
        <div style={{ marginTop: 110, width: 820 }}>
          <Title size={72}>
            <Words text="¿Qué especies lo habitan" start={44} every={4} />
            <span style={{ color: C.leaf500 }}>
              <Words text="hoy?" start={64} every={4} />
            </span>
          </Title>
        </div>
      </AbsoluteFill>
      <AntioquiaMap height={mapH} x={1880 - mapW} y={70} drawStart={2} drawEvery={0.5}>
        {qIdx.map((qi, i) => {
          const m = geo.municipios[qi];
          const p = pop(f, fps, 72 + i * 3, 10, 160);
          return (
            <text key={qi} x={m.cx} y={m.cy + 12} textAnchor="middle" fontFamily="Fraunces" fontWeight={700} fontSize={40} fill={C.green700} opacity={Math.min(1, p)} transform={`translate(0 ${(1 - p) * 20})`}>
              ?
            </text>
          );
        })}
      </AntioquiaMap>
      <div style={{ position: 'absolute', right: 70, bottom: 40, opacity: appear(f, 30, 20), fontFamily: F.body, fontSize: 18, color: C.ink600 }}>
        Límites municipales: DANE · MGN 2018
      </div>
    </Bg>
  );
};

/* S2 — 21.600+ especies / inventario manual que tarda años */
const MOSAIC = ['tremarctos-ornatus', 'ara-macao', 'pristimantis-penelopus', 'panthera-onca', 'crax-alberti', 'dendrobates-truncatus', 'harpia-harpyja', 'agalychnis-callidryas', 'cattleya-trianae', 'tapirus-terrestris'];

export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yearsProgress = interpolate(f, [100, 210], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  return (
    <Bg>
      <AbsoluteFill style={{ padding: '140px 0 0 140px' }}>
        <div style={rise(f, 0)}>
          <Kicker>El departamento más biodiverso de Colombia</Kicker>
        </div>
        <div style={{ marginTop: 20, fontFamily: F.display, fontWeight: 700, fontSize: 220, lineHeight: 0.95, color: C.forest900, letterSpacing: '-0.03em' }}>
          <Counter to={21600} start={6} dur={60} />
          <span style={{ color: C.leaf500 }}>+</span>
        </div>
        <div style={{ ...rise(f, 20), marginTop: 6 }}>
          <Body size={40} style={{ color: C.ink900, fontWeight: 600 }}>
            especies registradas
          </Body>
        </div>
      </AbsoluteFill>

      {/* mosaico de fauna y flora */}
      <div style={{ position: 'absolute', left: 1080, top: 110, width: 720, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {MOSAIC.slice(0, 9).map((id, i) => {
          const p = pop(f, fps, 10 + i * 5, 16, 120);
          return (
            <div key={id} style={{ transform: `scale(${0.6 + 0.4 * Math.min(1, p)})`, opacity: Math.min(1, p) }}>
              <Photo src={`species/${id}.jpg`} w={226} h={168} radius={18} />
            </div>
          );
        })}
      </div>

      {/* inventario manual */}
      <div style={{ position: 'absolute', left: 140, top: 800, width: 1640, ...rise(f, 84, 22) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Icon name="clipboard" size={48} color={C.green700} />
          <Body size={36} style={{ color: C.ink900, fontWeight: 700 }}>
            Inventario actual: muestreos manuales
          </Body>
          <div style={{ marginLeft: 'auto' }}>
            <Pill tone="warn" size={26}>
              Tarda años en actualizarse
            </Pill>
          </div>
        </div>
        <div style={{ marginTop: 30, position: 'relative', height: 18, borderRadius: 9, background: C.canvasAlt, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${3 + yearsProgress * 22}%`, borderRadius: 9, background: C.olive400 }} />
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', fontFamily: F.body, fontWeight: 700, fontSize: 22, color: C.ink600 }}>
          <span>Actualización del inventario</span>
          <span style={{ opacity: 0.55 }}>meses… años…</span>
        </div>
      </div>
    </Bg>
  );
};

/* S3 — los eventos ocurren antes que el inventario: actuar tarde */
const EVENTS = [
  { at: 16, x: 0.14, stem: 60, label: 'Una especie desaparece', icon: 'x' as const },
  { at: 34, x: 0.44, stem: 170, label: 'Ocurre una invasión', icon: 'alert' as const },
  { at: 52, x: 0.72, stem: 60, label: 'Cambia un patrón migratorio', icon: 'trend' as const },
];

export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = 160;
  const R = 1760;
  const lineY = 600;
  const inv = interpolate(f, [8, 100], [0, 0.93], { ...clamp, easing: EASE_IN_OUT });
  const arrived = f >= 100;
  const dim = 1 - appear(f, 124, 18);
  return (
    <Bg tone="dark">
      <div style={{ position: 'absolute', left: 140, top: 110, ...rise(f, 0) }}>
        <Kicker dark>Cuando el inventario llega…</Kicker>
      </div>
      <div style={{ opacity: dim }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <line x1={L} x2={L + (R - L) * appear(f, 0, 30)} y1={lineY} y2={lineY} stroke={C.olive400} strokeWidth={4} strokeLinecap="round" />
          <text x={R} y={lineY - 22} textAnchor="end" fontFamily="Manrope" fontWeight={700} fontSize={24} fill={C.onDarkMuted}>
            tiempo →
          </text>
        </svg>
        {EVENTS.map((e) => {
          const p = pop(f, fps, e.at, 12, 150);
          const x = L + (R - L) * e.x;
          return (
            <div key={e.label} style={{ position: 'absolute', left: x, top: lineY, transform: 'translate(-50%, -100%)', opacity: Math.min(1, p) }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `translateY(${(1 - Math.min(1, p)) * 20}px)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.08)', border: `1.5px solid ${C.borderDark}`, padding: '14px 22px', borderRadius: 16, fontSize: 28, fontWeight: 700, color: C.cream100, whiteSpace: 'nowrap' }}>
                  <Icon name={e.icon} size={30} color={C.olive400} />
                  {e.label}
                </div>
                <div style={{ width: 3, height: e.stem, background: C.olive400 }} />
                <div style={{ width: 22, height: 22, borderRadius: 11, background: C.olive400, marginBottom: -11 }} />
              </div>
            </div>
          );
        })}
        {/* marcador del inventario */}
        <div style={{ position: 'absolute', left: L + (R - L) * inv, top: lineY + 40, transform: 'translateX(-50%)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: `18px solid ${arrived ? C.mapAccent : C.cream100}` }} />
            <Pill tone={arrived ? 'danger' : 'ghost'} size={28} style={{ background: arrived ? C.mapAccent : C.cream100, color: arrived ? '#fff' : C.forest900 }}>
              <Icon name="clipboard" size={28} color={arrived ? '#fff' : C.forest900} />
              {arrived ? 'Inventario actualizado: llega tarde' : 'Inventario manual…'}
            </Pill>
          </div>
        </div>
      </div>
      {/* cita */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: appear(f, 132, 20) }}>
        <div style={{ width: 1400, borderLeft: `8px solid ${C.leaf500}`, paddingLeft: 56 }}>
          <div style={{ fontFamily: F.display, fontStyle: 'italic', fontWeight: 500, fontSize: 76, lineHeight: 1.18, color: C.cream100 }}>
            <Words text="“Sin una línea base, el ordenamiento territorial" start={134} every={3} />
            <span style={{ color: C.olive400 }}>
              <Words text="siempre actuará tarde.”" start={134 + 21} every={3} />
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

