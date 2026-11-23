import { describe, expect, it } from 'vitest';
import { EVENT_CONFIG } from '../config/event';
import { buildWhatsAppShareMessage, buildWhatsAppShareUrl } from './shareCard';

describe('WhatsApp share card helpers', () => {
  it('builds a warm Spanish WhatsApp share message with page URL, zero emojis, and zero gift words', () => {
    const pageUrl = 'https://invitacion-jacobo.vercel.app/';
    const message = buildWhatsAppShareMessage(pageUrl, EVENT_CONFIG);

    expect(message).toContain(EVENT_CONFIG.honoree);
    expect(message).toContain(EVENT_CONFIG.dateDisplay);
    expect(message).toContain(EVENT_CONFIG.timeDisplay);
    expect(message).toContain(EVENT_CONFIG.venueSpace);
    expect(message).toContain(EVENT_CONFIG.venueName);
    expect(message).toContain(pageUrl);
    expect(message).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(message.toLowerCase()).not.toContain('regalo');
    expect(message.toLowerCase()).not.toContain('lluvia');
  });

  it('builds a valid https://wa.me/?text= share link encoding the message and URL', () => {
    const pageUrl = 'https://invitacion-jacobo.vercel.app/';
    const shareUrl = buildWhatsAppShareUrl(pageUrl, EVENT_CONFIG);

    expect(shareUrl.startsWith('https://wa.me/?text=')).toBe(true);
    const decoded = decodeURIComponent(shareUrl.split('?text=')[1]);
    expect(decoded).toContain(pageUrl);
    expect(decoded).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
