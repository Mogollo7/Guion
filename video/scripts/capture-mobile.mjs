// Captura el prototipo en vista móvil (390x844 @3x) para el mockup de teléfono del App Promo.
// Uso: node scripts/capture-mobile.mjs [--online --url https://mogollo7.github.io/PITB-Antioquia/]
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const out = path.join(root, 'public', 'mobile');
fs.mkdirSync(out, { recursive: true });
const args = process.argv.slice(2);
const online = args.includes('--online');
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const siteDir = path.resolve(root, opt('--dir', '../../mogollo7/pitb-antioquia'));
let baseUrl = opt('--url', null);
let server;
if (!baseUrl) {
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
  server = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(siteDir, p === '/' ? 'index.html' : p);
    if (!f.startsWith(siteDir) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, r));
  baseUrl = `http://localhost:${server.address().port}/`;
}
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'es-CO' });
const page = await ctx.newPage();
if (!online) {
  const leafletDir = path.join(root, 'node_modules', 'leaflet', 'dist');
  await page.route('**/cdnjs.cloudflare.com/ajax/libs/leaflet/**', (route) => route.fulfill({ path: path.join(leafletDir, route.request().url().endsWith('.css') ? 'leaflet.css' : 'leaflet.js') }));
  await page.route('**/*.tile.openstreetmap.org/**', (route) => route.fulfill({ status: 204, body: '' }));
}
await page.addInitScript(() => { Math.random = () => 0.19; });
await page.clock.install({ time: new Date('2026-11-05T14:00:00-05:00') });
const boxes = {};
const box = async (key, sel, nth = 0) => {
  const b = await page.evaluate(([s, i]) => { const el = document.querySelectorAll(s)[i]; if (!el) return null; const r = el.getBoundingClientRect(); return { x: (r.left + scrollX) * 3, y: (r.top + scrollY) * 3, w: r.width * 3, h: r.height * 3 }; }, [sel, nth]);
  if (b) boxes[key] = Object.fromEntries(Object.entries(b).map(([k, v]) => [k, Math.round(v)])); else console.warn('sin caja', key);
};
const shot = async (name, full = true) => {
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(400);
  await page.waitForTimeout(450);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: full });
  const h = await page.evaluate(() => document.documentElement.scrollHeight * 3);
  boxes[`${name}__h`] = h;
  console.log('✓', name);
};
const go = async (h) => { await page.evaluate((x) => { location.hash = x; window.scrollTo(0, 0); }, h); await page.clock.runFor(500); };

await page.goto(baseUrl + '#inicio', { waitUntil: 'load' });
await page.clock.pauseAt(new Date('2026-11-05T14:00:05-05:00'));
await page.clock.runFor(1500);
await shot('m00_inicio', false);
await go('identificacion');
await shot('m01_explorar');
await box('m_dropzone', '#dropzone');
await box('m_galeria', '#sample-gallery');
await box('m_filtros_btn', '#gallery-filter-btn');
await page.setInputFiles('#file-input', path.join(siteDir, 'assets/species/tremarctos-ornatus.jpg'));
await page.waitForFunction(() => !document.getElementById('preview-img').hidden);
await shot('m02_foto');
await box('m_analizar', '#analyze-btn');
await page.click('#gallery-filter-btn');
await page.clock.runFor(300);
const chips = page.locator('#class-filters .filter-chip');
await chips.nth(1).click();
await shot('m03_filtro_mamiferos');
await box('m_filtros_panel', '#gallery-filter-panel');
await chips.nth(3).click();
await shot('m03_filtro_anfibios');
await chips.nth(0).click();
await page.click('#gallery-filter-btn');
await page.clock.runFor(300);
await page.click('#analyze-btn');
for (let i = 1; i <= 5; i++) { await page.clock.runFor(i === 1 ? 50 : 300); await page.waitForTimeout(200); if (i === 4) { await shot('m04_procesando'); await box('m_proc', '#id-processing'); } }
await page.clock.runFor(800);
await page.waitForSelector('.obs-title');
await page.evaluate(() => window.scrollTo(0, 0));
await shot('m05_ficha');
for (const [k, s] of [['m_foto', '.obs-photo-frame'], ['m_credito', '.photo-credit'], ['m_titulo', '.obs-title'], ['m_taxonomia', '.taxonomy-breadcrumb'], ['m_top3', '.obs-card'], ['m_certeza', '.obs-side-card'], ['m_publicar', '#obs-publish-btn']]) await box(k, s);
await page.click('#obs-publish-btn');
await shot('m06_publicada');
await box('m_estado', '#obs-publish-status');
await go('registros');
await page.click('#records-search-btn').catch(() => {});
await page.fill('#records-search', 'Suroeste');
await page.dispatchEvent('#records-search', 'input');
await shot('m07_registros');
await box('m_reg_fila', '#records-tbody tr', 0);
await box('m_reg_accion', '#records-tbody .row-action', 0);
await page.locator('#records-tbody .row-action').first().click();
await shot('m08_validado');
fs.writeFileSync(path.join(root, 'src', 'data', 'boxes-mobile.json'), JSON.stringify(boxes, null, 1));
await browser.close();
server?.close();
