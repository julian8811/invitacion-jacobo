import { chromium } from 'playwright';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { exec } from 'node:child_process';
import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

const BASE = process.env.EXPORT_URL ?? 'http://127.0.0.1:4173';
const DESKTOP = process.env.DESKTOP_DIR ?? 'C:\\Users\\ASUS\\OneDrive\\Desktop';
const PUBLIC = join(process.cwd(), 'public');
const AUDIT = join(process.cwd(), 'audit-out');
const WHATSAPP_JPG = join(PUBLIC, 'tarjeta-whatsapp-jacobo.jpg');
const WHATSAPP_PDF = join(PUBLIC, 'tarjeta-whatsapp-jacobo.pdf');
const PRE_JPG = join(PUBLIC, 'preinvitacion-jacobo.jpg');
const PRE_PDF = join(PUBLIC, 'preinvitacion-jacobo.pdf');
const OG_JPG = join(PUBLIC, 'og-cover.jpg');
const MESSAGE_TXT = join(PUBLIC, 'mensaje-whatsapp-jacobo.txt');
const LIVE_URL = 'https://invitacion-jacobo.vercel.app';

const WHATSAPP_MESSAGE = `Tienes una invitación muy especial de Jacobo.

Ábrela aquí para ver el video, el mapa y confirmar asistencia:
${LIVE_URL}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) {
        return;
      }
    } catch {
      // retry
    }
    await wait(500);
  }
  throw new Error(`Preview server did not become ready at ${url}`);
}

async function startPreview() {
  const child = exec('pnpm preview --host 127.0.0.1 --port 4173', {
    cwd: process.cwd(),
  });
  await waitForServer(BASE);
  return child;
}

function addFullPageLink(pdfPage, url) {
  const { width, height } = pdfPage.getSize();
  const ctx = pdfPage.doc.context;
  const annot = ctx.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [0, 0, width, height],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: PDFString.of(url),
    },
  });
  pdfPage.node.set(PDFName.of('Annots'), ctx.obj([ctx.register(annot)]));
}

/** Build a WhatsApp-friendly PDF that looks exactly like the JPG and is fully clickable. */
async function jpgToClickablePdf(jpgPath, pdfPath, url, widthPt, heightPt) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([widthPt, heightPt]);
  const image = await pdfDoc.embedJpg(readFileSync(jpgPath));
  page.drawImage(image, { x: 0, y: 0, width: widthPt, height: heightPt });
  addFullPageLink(page, url);
  writeFileSync(pdfPath, await pdfDoc.save());
}

async function exportWhatsappCard(browser) {
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });
  await page.goto(`${BASE}/?exportCard`, { waitUntil: 'networkidle' });
  await page.waitForSelector('img[alt*="Código QR"], img[alt*="código QR"]', {
    timeout: 15000,
  });
  await wait(400);

  const card = page.locator('article[aria-label="Tarjeta de invitación Safari"]');
  const href = await page.getByRole('link', { name: /abrir invitación interactiva/i }).getAttribute('href');
  await card.screenshot({ path: WHATSAPP_JPG, type: 'jpeg', quality: 94 });
  await jpgToClickablePdf(WHATSAPP_JPG, WHATSAPP_PDF, href || LIVE_URL, 1080, 1350);
  await page.close();
  return { href };
}

async function exportOgCover(browser) {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto(`${BASE}/?exportCard=og`, { waitUntil: 'networkidle' });
  await wait(500);
  const card = page.locator('article[aria-label="Vista previa de enlace de invitación"]');
  await card.screenshot({ path: OG_JPG, type: 'jpeg', quality: 92 });
  await page.close();
}

async function exportPreInvitation(browser) {
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });
  await page.goto(`${BASE}/?exportCard=pre`, { waitUntil: 'networkidle' });
  await page.waitForSelector('a[aria-label="Abrir invitación de Jacobo"]', { timeout: 15000 });
  await wait(500);

  const card = page.locator('a[aria-label="Abrir invitación de Jacobo"]');
  const href = await card.getAttribute('href');
  const text = (await card.innerText()).replace(/\s+/g, ' ');

  await card.screenshot({ path: PRE_JPG, type: 'jpeg', quality: 94 });
  await page.screenshot({ path: join(AUDIT, 'preinvitacion-playwright.png'), type: 'png' });
  await jpgToClickablePdf(PRE_JPG, PRE_PDF, href || LIVE_URL, 1080, 1350);
  await page.close();
  return { href, text };
}

async function auditPrePdf() {
  const doc = await PDFDocument.load(readFileSync(PRE_PDF));
  const page = doc.getPages()[0];
  const size = page.getSize();
  const annots = page.node.lookup(PDFName.of('Annots'));
  const annotCount = annots ? annots.asArray().length : 0;
  let uri = null;
  if (annots) {
    const first = page.doc.context.lookup(annots.asArray()[0]);
    uri = first.lookup(PDFName.of('A')).lookup(PDFName.of('URI')).decodeText();
  }
  const report = {
    pageSize: size,
    annotCount,
    uri,
    matchesImageAspect: Math.abs(size.width / size.height - 1080 / 1350) < 0.01,
    fullBleed: size.width === 1080 && size.height === 1350,
  };
  writeFileSync(join(AUDIT, 'preinvitacion-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

mkdirSync(PUBLIC, { recursive: true });
mkdirSync(AUDIT, { recursive: true });
writeFileSync(MESSAGE_TXT, `${WHATSAPP_MESSAGE}\n`, 'utf8');

const preview = await startPreview();
const browser = await chromium.launch();
try {
  const result = await exportWhatsappCard(browser);
  const pre = await exportPreInvitation(browser);
  await exportOgCover(browser);
  const pdfAudit = await auditPrePdf();

  copyFileSync(WHATSAPP_JPG, join(DESKTOP, 'tarjeta-whatsapp-jacobo.jpg'));
  copyFileSync(WHATSAPP_PDF, join(DESKTOP, 'tarjeta-whatsapp-jacobo.pdf'));
  copyFileSync(PRE_JPG, join(DESKTOP, 'preinvitacion-jacobo.jpg'));
  copyFileSync(PRE_PDF, join(DESKTOP, 'preinvitacion-jacobo.pdf'));
  copyFileSync(MESSAGE_TXT, join(DESKTOP, 'mensaje-whatsapp-jacobo.txt'));

  const birthdayWords = /cumpleaños|estás invitado|primer añito|fecha|hora|lugar/i;
  console.log(
    JSON.stringify(
      {
        ok: true,
        href: result.href,
        preHref: pre.href,
        looksLikeBirthdayInvite: birthdayWords.test(pre.text),
        preTextSnippet: pre.text.slice(0, 220),
        pdfAudit,
        files: {
          preJpg: PRE_JPG,
          prePdf: PRE_PDF,
          desktop: DESKTOP,
        },
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  preview.kill('SIGTERM');
  // Ensure preview dies on Windows.
  setTimeout(() => process.exit(0), 300);
}
