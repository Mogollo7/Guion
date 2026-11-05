// Renderiza el App Promo, sus láminas para el video de 3 min y el kit de Tremi con transparencia.
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(root, '..', 'entregables');
const browserExecutable = process.env.REMOTION_BROWSER || null;
const only = process.argv.slice(2);
const want = (id) => only.length === 0 || only.includes(id);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
const concurrency = Math.max(2, Math.min(8, os.cpus().length));
const t0 = Date.now();
const log = (m) => console.log(`✓ ${m} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);

const h264 = async (id, file, crf = 19) => {
  if (!want(id)) return;
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await renderMedia({ composition, serveUrl, codec: 'h264', crf, outputLocation: file, browserExecutable, concurrency, pixelFormat: 'yuv420p', audioCodec: 'aac', overwrite: true });
  log(path.relative(out, file));
};
const prores = async (id, file) => {
  if (!want(id)) return;
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await renderMedia({ composition, serveUrl, codec: 'prores', proResProfile: '4444', imageFormat: 'png', pixelFormat: 'yuva444p10le', outputLocation: file, browserExecutable, concurrency, muted: true, overwrite: true });
  log(path.relative(out, file));
};

await h264('Promo', path.join(out, 'promo', 'PITB_App_Promo_16x9.mp4'), 18);
await h264('PromoIntro', path.join(out, 'promo', 'laminas_promo', '00_Intro_Tremi_logo.mp4'));
const plates = [['upload', 'M1_explorar_subir_foto'], ['identify', 'extra_bioclip_identifica'], ['ficha', 'M2_ficha'], ['map', 'M3_tablero_mapa'], ['validate', 'M4_validacion'], ['outro', 'M5_cada_foto_un_dato']];
for (const [scene, name] of plates) await h264(`PromoPlate-${scene}`, path.join(out, 'promo', 'laminas_promo', `${name}.mp4`));
await prores('Tremi-saluda', path.join(out, 'promo', 'kit_tremi_alpha', 'Tremi_saluda.mov'));
// Las demás poses como secuencia PNG con transparencia (4 veces más livianas que ProRes)
for (const id of ['saluda', 'celebra', 'senala-derecha', 'senala-izquierda', 'presenta']) {
  if (!want(`Tremi-${id}`)) continue;
  const dir = path.join(out, 'promo', 'kit_tremi_alpha', `Tremi_${id}`);
  const be = browserExecutable ? ` --browser-executable="${browserExecutable}"` : '';
  execSync(`npx remotion render src/index.ts Tremi-${id} "${dir}" --sequence --image-format=png${be}`, { cwd: root, stdio: 'ignore' });
  log(`kit_tremi_alpha/Tremi_${id}/ (secuencia PNG; comprímela en .zip para compartir)`);
}
if (want('TremiSheet')) {
  const composition = await selectComposition({ serveUrl, id: 'TremiSheet', browserExecutable });
  await renderStill({ composition, serveUrl, output: path.join(out, 'promo', 'Tremi_hoja_de_personaje.png'), browserExecutable, imageFormat: 'png', overwrite: true });
  log('Tremi_hoja_de_personaje.png');
}
console.log('Listo en', ((Date.now() - t0) / 1000).toFixed(0), 's');
