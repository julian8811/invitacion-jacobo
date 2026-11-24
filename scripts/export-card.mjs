import { chromium } from 'playwright';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { exec } from 'node:child_process';
import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

const BASE = process.env.EXPORT_URL ?? 'http://127.0.0.1:4173';
const DESKTOP = process.env.DESKTOP_DIR ?? 'C:\\Users\\ASUS\\OneDrive\\Desktop';
const PUBLIC = join(process.cwd(), 'public');
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

function addUriLink(pdfPage, box, pageHeight, url) {
  if (!box) {
    return;
  }
  // Chromium PDF maps CSS pixels to PDF points at 72/96.
  const pxToPt = 72 / 96;
  const x = box.x * pxToPt;
  const y = pageHeight - (box.y + box.height) * pxToPt;
  const w = box.width * pxToPt;
  const h = box.height * pxToPt;
  const ctx = pdfPage.doc.context;
  const action = ctx.obj({
    Type: 'Action',
    S: 'URI',
    URI: PDFString.of(url),
  });
  const annot = ctx.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [x, y, x + w, y + h],
    Border: [0, 0, 0],
    C: [0.1, 0.26, 0.2],
    A: action,
  });
  const annotRef = ctx.register(annot);
  const existing = pdfPage.node.lookup(PDFName.of('Annots'));
  if (existing) {
    existing.push(annotRef);
  } else {
    pdfPage.node.set(PDFName.of('Annots'), ctx.obj([annotRef]));
  }
}

async function makeClickablePdf(pdfPath, linkBoxes, url) {
  const pdfDoc = await PDFDocument.load(readFileSync(pdfPath));
  const pdfPage = pdfDoc.getPages()[0];
  const { height } = pdfPage.getSize();
  for (const box of linkBoxes) {
    addUriLink(pdfPage, box, height, url);
  }
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
  const ctaBox = await page.getByRole('link', { name: /abrir invitación interactiva/i }).boundingBox();
  const qrBox = await page.getByRole('img', { name: /código qr/i }).boundingBox();
  const href = await page.getByRole('link', { name: /abrir invitación interactiva/i }).getAttribute('href');

  await card.screenshot({ path: WHATSAPP_JPG, type: 'jpeg', quality: 92 });
  await page.pdf({
    path: WHATSAPP_PDF,
    width: '1080px',
    height: '1350px',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await makeClickablePdf(WHATSAPP_PDF, [ctaBox, qrBox], href || LIVE_URL);
  await page.close();
  return { href, ctaBox, qrBox };
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
  await wait(400);

  const card = page.locator('a[aria-label="Abrir invitación de Jacobo"]');
  const fullBox = await card.boundingBox();
  const href = await card.getAttribute('href');

  await card.screenshot({ path: PRE_JPG, type: 'jpeg', quality: 92 });
  await page.pdf({
    path: PRE_PDF,
    width: '1080px',
    height: '1350px',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  // Whole surface is one tap target.
  await makeClickablePdf(PRE_PDF, [fullBox], href || LIVE_URL);
  await page.close();
  return { href, fullBox };
}

mkdirSync(PUBLIC, { recursive: true });
writeFileSync(MESSAGE_TXT, `${WHATSAPP_MESSAGE}\n`, 'utf8');

const preview = await startPreview();
const browser = await chromium.launch();
try {
  const result = await exportWhatsappCard(browser);
  const pre = await exportPreInvitation(browser);
  await exportOgCover(browser);

  copyFileSync(WHATSAPP_JPG, join(DESKTOP, 'tarjeta-whatsapp-jacobo.jpg'));
  copyFileSync(WHATSAPP_PDF, join(DESKTOP, 'tarjeta-whatsapp-jacobo.pdf'));
  copyFileSync(PRE_JPG, join(DESKTOP, 'preinvitacion-jacobo.jpg'));
  copyFileSync(PRE_PDF, join(DESKTOP, 'preinvitacion-jacobo.pdf'));
  copyFileSync(MESSAGE_TXT, join(DESKTOP, 'mensaje-whatsapp-jacobo.txt'));

  console.log(
    JSON.stringify(
      {
        ok: true,
        href: result.href,
        preHref: pre.href,
        ctaBox: result.ctaBox,
        qrBox: result.qrBox,
        preBox: pre.fullBox,
        files: {
          jpg: WHATSAPP_JPG,
          pdf: WHATSAPP_PDF,
          preJpg: PRE_JPG,
          prePdf: PRE_PDF,
          og: OG_JPG,
          message: MESSAGE_TXT,
          desktop: DESKTOP,
        },
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  preview.kill();
}
