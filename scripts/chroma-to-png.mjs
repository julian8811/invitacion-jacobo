import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ASSETS = 'C:/Users/ASUS/.cursor/projects/d-Jacobo-invitacion-jacobo/assets';
const OUT = path.resolve('public/images/realistic');

const jobs = [
  { in: 'lion-green.jpg', out: 'lion-cub.png' },
  { in: 'elephant-green.jpg', out: 'elephant-calf.png' },
  { in: 'giraffe-green.jpg', out: 'giraffe-calf.png' },
  { in: 'monkey-green.jpg', out: 'monkey-infant.png' },
];

function sampleKey(rgba, width, height) {
  const pts = [
    [4, 4],
    [width - 5, 4],
    [4, height - 5],
    [width - 5, height - 5],
    [Math.floor(width / 2), 4],
    [4, Math.floor(height / 2)],
    [width - 5, Math.floor(height / 2)],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of pts) {
    const o = (y * width + x) * 4;
    r += rgba[o];
    g += rgba[o + 1];
    b += rgba[o + 2];
  }
  const n = pts.length;
  return { r: r / n, g: g / n, b: b / n };
}

function dist(a, b) {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function makeTransparent(rgba, width, height) {
  const key = sampleKey(rgba, width, height);
  for (let i = 0; i < width * height; i += 1) {
    const o = i * 4;
    const pixel = { r: rgba[o], g: rgba[o + 1], b: rgba[o + 2] };
    const d = dist(pixel, key);
    const greenLead = pixel.g - Math.max(pixel.r, pixel.b);
    const sat = Math.max(pixel.r, pixel.g, pixel.b) - Math.min(pixel.r, pixel.g, pixel.b);

    let alpha = 255;
    // Strong green / close to key → fully transparent
    if (d < 55 || (greenLead > 35 && pixel.g > 70) || (pixel.g > 140 && sat > 40 && greenLead > 15)) {
      alpha = 0;
    } else if (d < 110 || (greenLead > 12 && pixel.g > 60)) {
      const t = Math.min(1, Math.max(d / 110, 1 - greenLead / 50));
      alpha = Math.round(255 * Math.max(0, Math.min(1, t)));
    }

    rgba[o + 3] = alpha;
    if (alpha > 0 && alpha < 245) {
      // Despill: pull green toward red/blue average
      const rb = (pixel.r + pixel.b) / 2;
      if (pixel.g > rb) {
        rgba[o + 1] = Math.round(rb + (pixel.g - rb) * (alpha / 255) * 0.35);
      }
    }
  }
}

fs.mkdirSync(OUT, { recursive: true });

for (const job of jobs) {
  const input = path.join(ASSETS, job.in);
  const output = path.join(OUT, job.out);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = new Uint8ClampedArray(data);
  makeTransparent(pixels, info.width, info.height);

  await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 12 })
    .png()
    .toFile(output);

  const check = await sharp(output).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  for (let i = 3; i < check.data.length; i += 4) {
    if (check.data[i] < 16) transparent += 1;
  }
  const pct = ((transparent / (check.info.width * check.info.height)) * 100).toFixed(1);
  console.log(`wrote ${job.out} · ${check.info.width}x${check.info.height} · transparent ${pct}%`);
}
