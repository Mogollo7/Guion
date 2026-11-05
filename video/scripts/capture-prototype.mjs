// Captura el prototipo PITB Antioquia en estados clave (PNG @2x) para el video.
//
// Uso (en esta máquina, sin internet para el mapa):
//   node scripts/capture-prototype.mjs --dir ../../mogollo7/pitb-antioquia
// Uso (en Windows con internet, para capturar el Tablero con el mapa real):
//   npx playwright install chromium
//   node scripts/capture-prototype.mjs --online --url https://mogollo7.github.io/PITB-Antioquia/
//
// Salida: public/proto/*.png  (2560x1600, viewport 1280x800 @2x)
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
const out = path.join(root, 'public', 'proto');
fs.mkdirSync(out, { recursive: true });

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const online = flag('--online');
const siteDir = path.resolve(root, opt('--dir', '../../mogollo7/pitb-antioquia'));
let baseUrl = opt('--url', null);

// --- servidor estático local -------------------------------------------------
let server;
if (!baseUrl) {
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml' };
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
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, locale: 'es-CO' });
const page = await ctx.newPage();

if (!online) {
  // Leaflet desde node_modules (el CDN no es alcanzable en el entorno de render)
  const leafletDir = path.join(root, 'node_modules', 'leaflet', 'dist');
  await page.route('**/cdnjs.cloudflare.com/ajax/libs/leaflet/**', (route) => {
    const name = route.request().url().endsWith('.css') ? 'leaflet.css' : 'leaflet.js';
    route.fulfill({ path: path.join(leafletDir, name) });
  });
  await page.route('**/*.tile.openstreetmap.org/**', (route) => route.fulfill({ status: 204, body: '' }));
}

// Resultado determinista: el "análisis" de una foto subida devuelve el oso de anteojos (índice 4).
await page.addInitScript(() => { const r = Math.random; Math.random = () => 0.19; window.__realRandom = r; });
await page.clock.install({ time: new Date('2026-11-05T14:00:00-05:00') });

const shot = async (name, opts = {}) => {
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(400);
  await page.waitForTimeout(450); // deja terminar las transiciones CSS (usan tiempo real)
  await page.screenshot({ path: path.join(out, `${name}.png`), ...opts });
  console.log('✓', name);
};
// Cajas (en px de la imagen @2x, coordenadas de documento) para animar cursor y llamadas en Remotion
const boxes = {};
const box = async (key, selector, nth = 0) => {
  const b = await page.evaluate(([sel, i]) => {
    const el = document.querySelectorAll(sel)[i];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: (r.left + scrollX) * 2, y: (r.top + scrollY) * 2, w: r.width * 2, h: r.height * 2 };
  }, [selector, nth]);
  if (b) boxes[key] = Object.fromEntries(Object.entries(b).map(([k, v]) => [k, Math.round(v)]));
  else console.warn('sin caja', key, selector);
};
const go = async (hash) => { await page.evaluate((h) => { location.hash = h; }, hash); await page.clock.runFor(500); };

await page.goto(baseUrl + '#inicio', { waitUntil: 'load' });
await page.clock.pauseAt(new Date('2026-11-05T14:00:05-05:00')); // el tiempo solo avanza con runFor
await page.clock.runFor(1500);
await shot('00_inicio');
await box('inicio_h1', '#inicio-title');

// --- Explorar -----------------------------------------------------------------
await go('identificacion');
await shot('01_explorar');
await box('dropzone', '#dropzone');
await box('filtros_btn', '#gallery-filter-btn');
await box('galeria', '#sample-gallery');
await box('galeria_panel', '#gallery-accordion-body');
// Subir foto (oso de anteojos) -> vista previa
await page.setInputFiles('#file-input', path.join(siteDir, 'assets/species/tremarctos-ornatus.jpg'));
await page.waitForFunction(() => !document.getElementById('preview-img').hidden);
await shot('03_foto_subida');
await box('analizar_btn', '#analyze-btn');
await box('preview', '#preview-img');

await page.click('#gallery-filter-btn');
await page.clock.runFor(300);
await shot('02_filtros_abiertos');
for (let i = 0; i < 6; i++) await box(`chip_${i}`, '#class-filters .filter-chip', i);
await box('filtros_panel', '#gallery-filter-panel');
const chips = page.locator('#class-filters .filter-chip');
const chipNames = ['mamiferos', 'aves', 'anfibios', 'reptiles', 'flora'];
for (let i = 0; i < chipNames.length; i++) {
  await chips.nth(i + 1).click();
  await shot(`02_filtro_${chipNames[i]}`);
}
await chips.nth(0).click();
await page.click('#gallery-filter-btn');
await page.clock.runFor(200);

// Analizar -> log de procesamiento paso a paso
await page.click('#analyze-btn');
for (let i = 1; i <= 5; i++) {
  await page.clock.runFor(i === 1 ? 50 : 300);
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(out, `04_procesando_${i}.png`), fullPage: true });
  console.log('✓', `04_procesando_${i}`);
  if (i === 4) { await box('proc_log', '#processing-log'); await box('proc_panel', '#id-processing'); }
}
await page.clock.runFor(800);

// --- Ficha de observación -------------------------------------------------------
await page.waitForSelector('.obs-title');
await page.evaluate(() => window.scrollTo(0, 0));
await shot('05_ficha');
await shot('05_ficha_full', { fullPage: true });
await box('ficha_foto', '.obs-photo-frame');
await box('ficha_credito', '.photo-credit');
await box('ficha_titulo', '.obs-title');
await box('ficha_taxonomia', '.taxonomy-breadcrumb');
await box('ficha_top3', '.obs-card', 0);
await box('ficha_certeza', '.obs-side-card', 0);
await box('ficha_licencia', '.obs-side-card', 1);
await box('ficha_publicar', '#obs-publish-btn');
await box('ficha_badge', '.species-badge');

// Geolocalizar y publicar
await page.click('#obs-publish-btn');
await shot('06_ficha_publicada');
await box('ficha_estado', '#obs-publish-status');

// --- Tablero territorial -------------------------------------------------------
await go('tablero');
await page.clock.runFor(1500);
await shot('07_tablero');
await shot('07_tablero_full', { fullPage: true });

// --- Registros de campo --------------------------------------------------------
await go('registros');
await page.evaluate(() => window.scrollTo(0, 0));
await shot('08_registros');
// Buscar la subregión del registro recién publicado
await page.click('#records-search-btn').catch(() => {});
await page.fill('#records-search', 'Suroeste');
await page.dispatchEvent('#records-search', 'input');
await shot('09_registros_suroeste');
await box('reg_fila', '#records-tbody tr', 0);
await box('reg_accion', '#records-tbody .row-action', 0);
await box('reg_estado', '#records-tbody .status-pill', 0);
await box('reg_busqueda', '#records-search');
// Validar el registro recién publicado (fila LIVE- del oso)
await page.locator('#records-tbody .row-action').first().click();
await shot('10_registros_validado');

fs.writeFileSync(path.join(root, 'src', 'data', 'boxes.json'), JSON.stringify(boxes, null, 1));
await browser.close();
server?.close();
console.log('Capturas en', out);
