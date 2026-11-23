import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.AUDIT_URL ?? 'http://127.0.0.1:4173/';
mkdirSync('audit-out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto(BASE);
await page.getByRole('button', { name: /Abrir expedición/i }).click();
await page.waitForTimeout(1200);

const section = page.locator('section[aria-labelledby="safari-friends-heading"]');
await section.scrollIntoViewIfNeeded();
const clues = [];
for (const label of ['Leoncito', 'Elefantito', 'Jirafita', 'Monito']) {
  await section.getByRole('button', { name: new RegExp(label) }).first().click({ force: true });
  await page.waitForTimeout(500);
  clues.push(await section.getByRole('status').innerText());
}
await page.waitForTimeout(1800);
const progress = await section.getByRole('progressbar').getAttribute('aria-valuenow');
const unlocked = await section.getByText('¡Encontraste a todos los amigos!').isVisible();
const sectionBox = await section.boundingBox();
await section.screenshot({ path: 'audit-out/animals-game-mobile.png' });

console.log(JSON.stringify({ clues, progress, unlocked, width: sectionBox?.width, errors }, null, 2));
await browser.close();
