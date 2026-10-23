// Screenshot every beat, plus moments inside transitions, into lab/<name>/,
// and tile them into a contact sheet. Usage:
//   node scripts/shoot.mjs [--width 1440 --height 900] [--out lab/desktop] [--url http://localhost:5173]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : d; };
const W = +arg('--width', 1440), H = +arg('--height', 900);
const OUT = path.resolve(arg('--out', 'lab/desktop'));
const URL = arg('--url', 'http://localhost:5173/');
const REDUCED = process.argv.includes('--reduced-motion');
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__story && document.body.classList.contains('is-ready'), null, { timeout: 30000 });
const count = await page.evaluate(() => window.__story.count);

const files = [];
// 1. every beat, reached by stepping forward with the keyboard, the way a reader would
for (let b = 1; b <= count; b++) {
  if (b > 1) {
    await page.waitForFunction(() => !window.__story.state().busy, null, { timeout: 15000 });
    await page.keyboard.press('ArrowDown');
    // catch the middle of a transition or camera move once, early
    await page.waitForTimeout(700);
    if (b <= count) { const f = `${OUT}/${String(b).padStart(2, '0')}a.png`; await page.screenshot({ path: f }); files.push(f); }
  }
  await page.waitForTimeout(2600);
  const f = `${OUT}/${String(b).padStart(2, '0')}b.png`;
  await page.screenshot({ path: f }); files.push(f);
  const st = await page.evaluate(() => window.__story.state());
  if (st.beat !== b) errors.push(`expected beat ${b}, on beat ${st.beat}`);
}
// 2. a fast trackpad-style flick must advance exactly one beat
await page.evaluate(() => window.__story.go(3));
await page.waitForTimeout(1500);
const before = (await page.evaluate(() => window.__story.state())).beat;
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(16); }
await page.waitForTimeout(2500);
const after = (await page.evaluate(() => window.__story.state())).beat;
console.log(`flick test: one flick moved ${after - before} beat(s) (from ${before} to ${after})`);

// contact sheet
const tw = 360, th = Math.round(tw * H / W), cols = 6;
const rows = Math.ceil(files.length / cols);
const tiles = await Promise.all(files.map(async (f, i) => ({ input: await sharp(f).resize(tw, th).toBuffer(), left: (i % cols) * tw, top: Math.floor(i / cols) * th })));
await sharp({ create: { width: tw * cols, height: th * rows, channels: 3, background: '#000' } }).composite(tiles).png().toFile(`${OUT}/sheet.png`);
console.log(`${count} beats, ${files.length} shots, sheet: ${OUT}/sheet.png`);
console.log(errors.length ? 'ERRORS:\n  ' + errors.join('\n  ') : 'no console errors');
await browser.close();
