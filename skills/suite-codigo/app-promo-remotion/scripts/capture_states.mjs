// Captura estados de una web/prototipo real para animarlos en Remotion (Playwright).
//   node capture_states.mjs steps.json
// steps.json:
// {
//   "url": "https://misitio.com/"  |  "dir": "./sitio-estatico",        (sirve una carpeta local)
//   "out": "public/shots", "boxes": "src/data/boxes.json",
//   "viewport": [1280, 800], "dpr": 2, "mobile": false,
//   "routes": {"**/cdn.example.com/lib.js": "node_modules/lib/dist/lib.js"},   (opcional: CDN bloqueado -> archivo local)
//   "block": ["**/*.tile.openstreetmap.org/**"],                              (opcional: responder vacío)
//   "random": 0.19,                                                           (opcional: fija Math.random)
//   "steps": [
//     {"goto": "#identificacion"},
//     {"shot": "01_explorar"}, {"shot": "01_full", "full": true},
//     {"box": "dropzone", "sel": "#dropzone"},
//     {"click": "#gallery-filter-btn"}, {"fill": "#search", "text": "Suroeste"},
//     {"upload": "#file-input", "file": "./foto.jpg"},
//     {"advance": 300},                       (avanza el reloj simulado: timers y animaciones JS)
//     {"wait": 450},                          (espera real: transiciones CSS)
//     {"scroll": 0}, {"eval": "window.scrollTo(0, 900)"}
//   ]
// }
// Las cajas se guardan en px de la imagen (CSS px × dpr) y en coordenadas de documento: valen para capturas
// de página completa ("full": true). Para capturas de viewport, resta el scroll que tenías.
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }

const specPath = path.resolve(process.argv[2] || 'steps.json');
const S = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const base = path.dirname(specPath);
const out = path.resolve(base, S.out || 'shots');
fs.mkdirSync(out, { recursive: true });
const dpr = S.dpr || 2;

let server, baseUrl = S.url;
if (!baseUrl && S.dir) {
  const dir = path.resolve(base, S.dir);
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
  server = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(dir, p === '/' ? 'index.html' : p);
    if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, r));
  baseUrl = `http://localhost:${server.address().port}/`;
}

const browser = await chromium.launch();
const [w, h] = S.viewport || (S.mobile ? [390, 844] : [1280, 800]);
const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: !!S.mobile, hasTouch: !!S.mobile, locale: S.locale || 'es-CO' });
const page = await ctx.newPage();
for (const [pattern, local] of Object.entries(S.routes || {})) {
  await page.route(pattern, (route) => route.fulfill({ path: path.resolve(base, local) }));
}
for (const pattern of S.block || []) await page.route(pattern, (route) => route.fulfill({ status: 204, body: '' }));
if (S.random !== undefined) await page.addInitScript((r) => { Math.random = () => r; }, S.random);

// Reloj simulado: después de cargar se pausa, y el tiempo solo avanza con "advance" (capturas deterministas).
await page.clock.install({ time: new Date('2026-01-01T12:00:00Z') });
const boxes = fs.existsSync(path.resolve(base, S.boxes || 'boxes.json')) ? JSON.parse(fs.readFileSync(path.resolve(base, S.boxes || 'boxes.json'), 'utf8')) : {};
let loaded = false;
const ensure = async (hash = '') => {
  if (loaded) return;
  await page.goto(baseUrl + hash, { waitUntil: 'load' });
  await page.clock.pauseAt(new Date('2026-01-01T12:00:05Z'));
  await page.clock.runFor(1000);
  loaded = true;
};

for (const st of S.steps) {
  if (st.goto !== undefined) {
    if (!loaded) await ensure(st.goto);
    else { await page.evaluate((h) => { location.hash = h; window.scrollTo(0, 0); }, st.goto); await page.clock.runFor(500); }
    continue;
  }
  await ensure();
  if (st.click) { await page.click(st.click); await page.clock.runFor(st.advanceAfter ?? 100); }
  if (st.fill) { await page.fill(st.fill, st.text || ''); await page.dispatchEvent(st.fill, 'input'); }
  if (st.upload) { await page.setInputFiles(st.upload, path.resolve(base, st.file)); await page.waitForTimeout(200); }
  if (st.advance) await page.clock.runFor(st.advance);
  if (st.wait) await page.waitForTimeout(st.wait);
  if (st.scroll !== undefined) await page.evaluate((y) => window.scrollTo(0, y), st.scroll);
  if (st.eval) await page.evaluate(st.eval);
  if (st.box) {
    const b = await page.evaluate(([sel, i]) => {
      const el = document.querySelectorAll(sel)[i || 0];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    }, [st.sel, st.nth || 0]);
    if (b) boxes[st.box] = Object.fromEntries(Object.entries(b).map(([k, v]) => [k, Math.round(v * dpr)]));
    else console.warn('sin caja:', st.box, st.sel);
  }
  if (st.shot) {
    await page.evaluate(() => document.fonts.ready);
    await page.clock.runFor(300);
    await page.waitForTimeout(st.settle ?? 450); // transiciones CSS corren en tiempo real
    await page.screenshot({ path: path.join(out, `${st.shot}.png`), fullPage: !!st.full });
    boxes[`${st.shot}__h`] = await page.evaluate((d) => Math.round((st_full => (st_full ? document.documentElement.scrollHeight : innerHeight))(d.full) * d.dpr), { full: !!st.full, dpr });
    console.log('✓', st.shot);
  }
}
fs.mkdirSync(path.dirname(path.resolve(base, S.boxes || 'boxes.json')), { recursive: true });
fs.writeFileSync(path.resolve(base, S.boxes || 'boxes.json'), JSON.stringify(boxes, null, 1));
await browser.close();
server?.close();
console.log('capturas en', out);
