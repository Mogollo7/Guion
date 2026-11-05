// Renderiza cuadros de control: node scripts/stills.mjs <dirSalida> ID:frame [ID:frame ...]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [outDir, ...items] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
for (const it of items) {
  const [id, frame] = it.split(':');
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  const output = path.join(outDir, `${id}_${frame}.png`);
  await renderStill({ composition, serveUrl, output, frame: Number(frame), browserExecutable, imageFormat: 'png', overwrite: true });
  console.log('✓', output);
}
