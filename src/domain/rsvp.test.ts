import { describe, expect, it } from 'vitest';
import { EVENT_CONFIG } from '../config/event';
import {
  buildWhatsAppRsvpMessage,
  buildWhatsAppRsvpUrl,
  clearSavedRsvp,
  loadSavedRsvp,
  normalizeColombianWhatsAppNumber,
  saveRsvp,
  validateRsvpInput,
  type RsvpRecord,
} from './rsvp';

describe('normalizeColombianWhatsAppNumber', () => {
  it('prepends country code 57 to 10-digit Colombian mobile numbers', () => {
    expect(normalizeColombianWhatsAppNumber('3005944356', '57')).toBe('573005944356');
    expect(normalizeColombianWhatsAppNumber('300 594-4356', '57')).toBe('573005944356');
  });

  it('keeps existing country code when already present', () => {
    expect(normalizeColombianWhatsAppNumber('+57 3005944356', '57')).toBe('573005944356');
  });
});

describe('validateRsvpInput', () => {
  it('rejects empty guest name', () => {
    const errors = validateRsvpInput({
      guestName: '   ',
      attending: true,
      adults: 2,
      children: 1,
      message: '',
    });
    expect(errors.guestName).toBeDefined();
  });

  it('rejects out-of-range adult or child counts when attending', () => {
    const errors = validateRsvpInput({
      guestName: 'Familia Pérez',
      attending: true,
      adults: 0,
      children: 11,
      message: '',
    });
    expect(errors.adults).toBeDefined();
    expect(errors.children).toBeDefined();
  });

  it('rejects messages longer than 280 characters', () => {
    const errors = validateRsvpInput({
      guestName: 'Tía Carolina',
      attending: true,
      adults: 1,
      children: 0,
      message: 'a'.repeat(281),
    });
    expect(errors.message).toBeDefined();
  });

  it('accepts valid declined RSVP even with zero guests', () => {
    const errors = validateRsvpInput({
      guestName: 'Carlos Gómez',
      attending: false,
      adults: 0,
      children: 0,
      message: 'Un abrazo enorme para Jacobo.',
    });
    expect(errors).toEqual({});
  });
});

describe('WhatsApp RSVP message and URL builders', () => {
  it('builds a richly formatted Spanish WhatsApp message and wa.me URL for attending guests', () => {
    const values = {
      guestName: 'Familia Martínez',
      attending: true,
      adults: 2,
      children: 1,
      message: '¡Feliz primer añito Jacobo!',
    };

    const text = buildWhatsAppRsvpMessage(values, EVENT_CONFIG);
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(text).toContain('*CONFIRMACIÓN DE ASISTENCIA*');
    expect(text).toContain('Jacobo Pineda Jaramillo');
    expect(text).toContain('*Invitado / Familia:* Familia Martínez');
    expect(text).toContain('*Total de asistentes:* 3 personas (2 adultos y 1 niño)');
    expect(text).toContain('3:00 p. m.');
    expect(text).toContain('Sector Machado');
    expect(text).toContain('_"¡Feliz primer añito Jacobo!"_');
    expect(text.toLowerCase()).not.toContain('regalo');

    const url = buildWhatsAppRsvpUrl(values, EVENT_CONFIG);
    expect(url.startsWith('https://wa.me/573005944356?text=')).toBe(true);
    const decoded = decodeURIComponent(url.split('?text=')[1]);
    expect(decoded).toBe(text);
  });

  it('builds a richly formatted declined RSVP message without guest counts or emojis', () => {
    const text = buildWhatsAppRsvpMessage(
      {
        guestName: 'Laura Ríos',
        attending: false,
        adults: 1,
        children: 0,
        message: 'Lo celebramos de corazón.',
      },
      EVENT_CONFIG,
    );
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(text).toContain('*RESPUESTA A LA INVITACIÓN*');
    expect(text).toContain('Jacobo Pineda Jaramillo');
    expect(text).toContain('Laura Ríos');
    expect(text).toContain('No podremos asistir en esta ocasión');
    expect(text).not.toContain('adulto');
    expect(text).not.toContain('Total de asistentes');
  });
});

describe('RSVP persistence helpers', () => {
  it('saves, loads, and clears RSVP records safely', () => {
    const record: RsvpRecord = {
      guestName: 'Familia López',
      attending: true,
      adults: 2,
      children: 2,
      message: '¡Ahí estaremos!',
      submittedAt: '2026-11-22T20:00:00.000Z',
    };

    saveRsvp(record);
    expect(loadSavedRsvp()).toEqual(record);

    clearSavedRsvp();
    expect(loadSavedRsvp()).toBeNull();
  });

  it('returns null gracefully when stored JSON is corrupt or storage throws', () => {
    const brokenStorage: Storage = {
      length: 0,
      clear: () => {},
      key: () => null,
      removeItem: () => {
        throw new Error('denied');
      },
      getItem: () => '{bad-json',
      setItem: () => {
        throw new Error('quota');
      },
    };

    expect(loadSavedRsvp(brokenStorage)).toBeNull();
    expect(() =>
      saveRsvp(
        {
          guestName: 'Test',
          attending: true,
          adults: 1,
          children: 0,
          message: '',
          submittedAt: '2026-11-22T20:00:00.000Z',
        },
        brokenStorage,
      ),
    ).not.toThrow();
    expect(() => clearSavedRsvp(brokenStorage)).not.toThrow();
  });
});
