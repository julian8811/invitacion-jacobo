import QRCode from 'qrcode';
import type { EventConfig } from '../config/event';

/**
 * Builds an emoji-free, gift-free Spanish WhatsApp share message linking back to the live invitation.
 */
export function buildWhatsAppShareMessage(pageUrl: string, config: EventConfig): string {
  const cleanUrl = pageUrl.trim();
  return [
    `Te comparto la invitación interactiva al ${config.eventTitle} de ${config.honoree}.`,
    `${config.dateDisplay} a las ${config.timeDisplay}`,
    `${config.venueSpace}, ${config.venueName} (${config.address})`,
    `Abre la invitación y confirma tu asistencia aquí: ${cleanUrl}`,
  ].join('\n');
}

export function buildWhatsAppShareUrl(pageUrl: string, config: EventConfig): string {
  const message = buildWhatsAppShareMessage(pageUrl, config);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export async function generateQrDataUrl(targetUrl: string): Promise<string> {
  return QRCode.toDataURL(targetUrl, {
    width: 320,
    margin: 1,
    color: {
      dark: '#244B32',
      light: '#FFFDF7',
    },
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Renders a 1080x1350 vertical storybook invitation card (with scannable QR code)
 * ready to save and forward directly in WhatsApp chats.
 */
export async function renderWhatsAppCardDataUrl(
  pageUrl: string,
  config: EventConfig,
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  // Warm cream storybook paper background
  ctx.fillStyle = '#FDF6E7';
  ctx.fillRect(0, 0, 1080, 1350);

  // Decorative outer canopy border
  ctx.strokeStyle = '#3F734D';
  ctx.lineWidth = 14;
  drawRoundedRect(ctx, 28, 28, 1024, 1294, 44);
  ctx.stroke();

  ctx.strokeStyle = '#F4B942';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 48, 48, 984, 1254, 34);
  ctx.stroke();

  // Top storybook artwork
  const coverImg = await loadImage(config.posterSrc);
  ctx.save();
  drawRoundedRect(ctx, 74, 78, 932, 500, 32);
  ctx.clip();
  ctx.drawImage(coverImg, 74, 78, 932, 500);
  ctx.restore();

  // Wooden signboard title block
  ctx.fillStyle = '#7D4F28';
  drawRoundedRect(ctx, 94, 608, 892, 236, 30);
  ctx.fill();
  ctx.strokeStyle = '#4E2E14';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFF9EE';
  ctx.font = 'bold 58px "Baloo 2", "Segoe UI", sans-serif';
  ctx.fillText(config.eventTitle, 540, 684);

  ctx.fillStyle = '#FCE085';
  ctx.font = 'bold 48px "Baloo 2", "Segoe UI", sans-serif';
  ctx.fillText(config.honoree, 540, 748);

  ctx.fillStyle = '#FFE8C8';
  ctx.font = '600 30px "Quicksand", "Segoe UI", sans-serif';
  ctx.fillText(config.subtitle, 540, 804);

  // Event details strip
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, 94, 874, 892, 168, 26);
  ctx.fill();
  ctx.strokeStyle = '#D7BC96';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#244B32';
  ctx.font = 'bold 32px "Quicksand", "Segoe UI", sans-serif';
  ctx.fillText(`${config.dateDisplay} · ${config.timeDisplay}`, 540, 932);

  ctx.fillStyle = '#5C371B';
  ctx.font = 'bold 28px "Quicksand", "Segoe UI", sans-serif';
  ctx.fillText(`${config.venueSpace} · ${config.venueName}`, 540, 978);

  ctx.fillStyle = '#3F734D';
  ctx.font = '600 24px "Quicksand", "Segoe UI", sans-serif';
  ctx.fillText(config.address, 540, 1018);

  // Bottom QR invitation footer
  const qrDataUrl = await generateQrDataUrl(pageUrl);
  const qrImg = await loadImage(qrDataUrl);

  ctx.fillStyle = '#F7ECDA';
  drawRoundedRect(ctx, 94, 1070, 892, 200, 26);
  ctx.fill();
  ctx.strokeStyle = '#8BB174';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.drawImage(qrImg, 130, 1094, 152, 152);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#244B32';
  ctx.font = 'bold 34px "Baloo 2", "Segoe UI", sans-serif';
  ctx.fillText('Escanea o abre el enlace', 316, 1146);

  ctx.fillStyle = '#5C371B';
  ctx.font = '600 25px "Quicksand", "Segoe UI", sans-serif';
  ctx.fillText('Para ver el video interactivo, mapa', 316, 1188);
  ctx.fillText('y confirmar tu asistencia por WhatsApp.', 316, 1222);

  return canvas.toDataURL('image/png');
}
