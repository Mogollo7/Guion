// Renderiza todo lo que necesita el montaje en DaVinci Resolve.
//   node scripts/render-all.mjs            -> todo
//   node scripts/render-all.mjs S1 M2      -> solo esas composiciones
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(root, '..', 'entregables');
const browserExecutable = process.env.REMOTION_BROWSER || null;
const only = process.argv.slice(2);
const want = (id) => only.length === 0 || only.includes(id);

const PLATES = ['P00-Intro', 'S1', 'S2', 'S3', 'D1', 'D2', 'D3', 'J1', 'J2', 'J3', 'M1', 'M2', 'M3', 'M4', 'M5', 'P99-Outro'];
const STILLS = [
  ...['salome', 'daniela', 'juan', 'maria'].map((s) => [`LowerThird-${s}`, 'graficos/tercios']),
  ...['salome', 'daniela', 'juan', 'maria'].map((s) => [`LiveOverlay-${s}`, 'graficos/overlay-camara']),
  ['BadgeIlustrativo', 'graficos'],
  ...['horizontal', 'horizontal-dark', 'symbol', 'symbol-negative'].map((v) => [`Logo-${v}`, 'logo']),
];

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
const concurrency = Math.max(2, Math.min(8, os.cpus().length));
const t0 = Date.now();

const media = async (id, file, crf) => {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await renderMedia({ composition, serveUrl, codec: 'h264', crf, outputLocation: file, browserExecutable, concurrency, pixelFormat: 'yuv420p', audioCodec: 'aac', overwrite: true });
  console.log(`✓ ${id} -> ${path.relative(out, file)} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
};

let n = 1;
for (const id of PLATES) {
  if (want(id)) await media(id, path.join(out, 'laminas', `${String(n).padStart(2, '0')}_${id}.mp4`), 20);
  n++;
}
if (want('Animatic')) await media('Animatic', path.join(out, 'animatic', 'PITB_animatic_referencia.mp4'), 23);
if (want('Teaser')) await media('Teaser', path.resolve(root, '..', 'brag-output', 'work', 'brag_raw.mp4'), 18);
for (const [id, dir] of STILLS) {
  if (!want(id) && !(only.includes('stills'))) { if (only.length) continue; }
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const file = path.join(out, dir, `${id}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await renderStill({ composition, serveUrl, output: file, browserExecutable, imageFormat: 'png', overwrite: true, scale: id.startsWith('Logo') ? 2 : 1 });
  console.log('✓', id);
}
console.log('Listo en', ((Date.now() - t0) / 1000).toFixed(0), 's');
