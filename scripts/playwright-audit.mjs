import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.AUDIT_URL || 'http://127.0.0.1:4173';
const OUT = path.resolve('audit-out');
fs.mkdirSync(OUT, { recursive: true });

const findings = [];

function note(level, message) {
  findings.push({ level, message });
  console.log(`[${level}] ${message}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(OUT, '01-intro.png'), fullPage: true });

// No proposal picker
const picker = await page.locator('[aria-label="Selector de propuestas de diseño"]').count();
if (picker > 0) note('FAIL', 'Proposal picker still visible');
else note('PASS', 'Proposal picker removed');

await page.getByRole('button', { name: /abrir expedición/i }).click();
await page.waitForSelector('#inicio', { timeout: 5000 });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, '02-hero.png'), fullPage: false });

// Animals transparent PNG + no overlap with plaque
const animals = page.locator('[aria-label^="Tocar al"]');
const animalCount = await animals.count();
if (animalCount !== 4) note('FAIL', `Expected 4 animals, got ${animalCount}`);
else note('PASS', 'Four interactive animals present');

for (let i = 0; i < animalCount; i += 1) {
  const src = await animals.nth(i).locator('img').first().getAttribute('src');
  if (!src?.endsWith('.png')) note('FAIL', `Animal ${i} not PNG: ${src}`);
  else note('PASS', `Animal ${i} uses PNG: ${src}`);
}

const heroBoxes = await page.evaluate(() => {
  const plaque = document.querySelector('.explorer-wood-plaque');
  const stamps = [...document.querySelectorAll('.explorer-stamp')];
  const animalSection = document.querySelector('[aria-label="Amigos de la sabana"]');
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width };
  };
  return {
    plaque: rect(plaque),
    stamps: stamps.map(rect),
    animals: rect(animalSection),
    viewportW: window.innerWidth,
  };
});

if (!heroBoxes.plaque || !heroBoxes.animals) {
  note('FAIL', 'Missing plaque or animals section');
} else if (heroBoxes.animals.top < heroBoxes.plaque.bottom - 4) {
  note('FAIL', 'Animals overlap wood plaque');
} else {
  note('PASS', 'Animals sit below wood plaque (no overlap)');
}

for (const stamp of heroBoxes.stamps) {
  if (stamp && heroBoxes.animals && stamp.bottom > heroBoxes.animals.top + 8 && stamp.top < heroBoxes.animals.bottom) {
    note('FAIL', 'Stamp card overlaps animals section');
  }
}
note('PASS', 'Stamp cards checked against animals');

// Full-width-ish containers (within padding)
const widths = await page.evaluate(() => {
  const max = document.querySelector('#inicio .max-w-4xl');
  const countdown = document.querySelector('#safari-countdown-heading')?.closest('section')?.querySelector('.safari-sand-card');
  const measure = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { width: r.width, parent: el.parentElement?.clientWidth ?? 0 };
  };
  return { hero: measure(max), countdown: measure(countdown), vw: window.innerWidth };
});

if (widths.hero && widths.hero.width / Math.min(widths.vw - 32, 896) > 0.92) {
  note('PASS', `Hero content uses nearly full container width (${Math.round(widths.hero.width)}px)`);
} else {
  note('WARN', `Hero width may be narrow: ${JSON.stringify(widths.hero)}`);
}

// Countdown colors
await page.locator('#safari-countdown-heading').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const colors = await page.evaluate(() => {
  const blocks = [...document.querySelectorAll('[role="timer"] > div')];
  return blocks.map((b) => getComputedStyle(b).backgroundColor);
});
const unique = new Set(colors);
if (unique.size >= 3) note('PASS', `Countdown has colorful blocks: ${[...unique].join(' | ')}`);
else note('FAIL', `Countdown not colorful enough: ${colors.join(' | ')}`);
await page.screenshot({ path: path.join(OUT, '03-countdown.png'), fullPage: false });

// Carousel auto + full width strip
await page.locator('#safari-memories-heading').scrollIntoViewIfNeeded();
const strip = page.locator('.memories-strip');
const before = await strip.evaluate((el) => el.scrollLeft);
await page.waitForTimeout(4800);
const after = await strip.evaluate((el) => el.scrollLeft);
if (after !== before) note('PASS', `Carousel auto-advances (scrollLeft ${before} -> ${after})`);
else note('WARN', 'Carousel did not auto-scroll in 4.8s (may be paused or reduced-motion)');

const stripWidth = await strip.evaluate((el) => el.getBoundingClientRect().width);
if (stripWidth >= widths.vw * 0.95) note('PASS', `Carousel strip uses ~100% viewport (${Math.round(stripWidth)}px)`);
else note('WARN', `Carousel strip width ${Math.round(stripWidth)} vs vw ${widths.vw}`);
await page.screenshot({ path: path.join(OUT, '04-carousel.png'), fullPage: false });

// RSVP present
await page.locator('#rsvp').scrollIntoViewIfNeeded();
const rsvp = await page.getByRole('heading', { name: /confirma tu asistencia/i }).count();
if (rsvp > 0) note('PASS', 'RSVP section present');
else note('FAIL', 'RSVP heading missing');
await page.screenshot({ path: path.join(OUT, '05-rsvp.png'), fullPage: false });

// No picker / no gift / no emoji in body text
const bodyText = await page.locator('body').innerText();
if (/regalo|obsequio|lluvia de sobres/i.test(bodyText)) note('FAIL', 'Gift language found');
else note('PASS', 'No gift language');
if (/Libro pop-up|Expedición en jeep|Vista previa/i.test(bodyText)) note('FAIL', 'Other proposals still referenced in UI');
else note('PASS', 'Only Safari experience in UI');

await page.screenshot({ path: path.join(OUT, '06-full.png'), fullPage: true });

const fails = findings.filter((f) => f.level === 'FAIL');
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ findings, fails: fails.length }, null, 2));
await browser.close();

if (fails.length) {
  console.error(`\nAudit finished with ${fails.length} FAIL(s)`);
  process.exit(1);
}
console.log('\nAudit finished: all critical checks passed');
