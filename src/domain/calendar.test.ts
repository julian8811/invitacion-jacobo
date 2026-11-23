import { describe, expect, it } from 'vitest';
import { EVENT_CONFIG } from '../config/event';
import { buildGoogleCalendarUrl, buildIcsContent } from './calendar';

describe('calendar helpers', () => {
  it('builds a Google Calendar URL anchored to Bogota 3:00 PM in UTC and excludes gifts', () => {
    const url = buildGoogleCalendarUrl(EVENT_CONFIG);
    const parsed = new URL(url);

    expect(parsed.origin + parsed.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(parsed.searchParams.get('action')).toBe('TEMPLATE');
    expect(parsed.searchParams.get('text')).toContain('Jacobo Pineda Jaramillo');
    // 2026-12-13T15:00-05:00 -> 20261213T200000Z; 19:00-05:00 -> 20261214T000000Z
    expect(parsed.searchParams.get('dates')).toBe('20261213T200000Z/20261214T000000Z');
    expect(parsed.searchParams.get('ctz')).toBe('America/Bogota');
    expect(parsed.searchParams.get('details')).toContain('3:00 p. m.');

    const location = parsed.searchParams.get('location') ?? '';
    expect(location).toContain('Salón Social');
    expect(location).toContain('Unidad Oporto Campestre');
    expect(location).toContain('Cra. 78 #40-25, Copacabana, Antioquia');

    const fullLower = url.toLowerCase();
    expect(fullLower).not.toContain('regalo');
    expect(fullLower).not.toContain('lluvia');
  });

  it('builds a valid RFC 5545 .ics calendar payload with CRLF line endings', () => {
    const ics = buildIcsContent(EVENT_CONFIG, new Date('2026-11-22T20:00:00-05:00'));

    expect(ics.includes('\r\n')).toBe(true);
    expect(ics).toContain('BEGIN:VCALENDAR\r\n');
    expect(ics).toContain('VERSION:2.0\r\n');
    expect(ics).toContain('BEGIN:VEVENT\r\n');
    expect(ics).toContain('DTSTART:20261213T200000Z\r\n');
    expect(ics).toContain('DTEND:20261214T000000Z\r\n');
    expect(ics).toContain('DTSTAMP:20261123T010000Z\r\n');
    expect(ics).toContain('SUMMARY:¡Mi Primer Añito! — Jacobo Pineda Jaramillo\r\n');
    expect(ics).toContain('LOCATION:Salón Social — Unidad Oporto Campestre\\, Cra. 78 #40-25\\, Copacabana\\, Antioquia\r\n');
    expect(ics).toContain('END:VEVENT\r\n');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.toLowerCase()).not.toContain('regalo');
  });
});
