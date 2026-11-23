import type { EventConfig } from '../config/event';

function toCalendarUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function buildEventSummary(config: EventConfig): string {
  return `${config.eventTitle} — ${config.honoree}`;
}

function buildFullVenueLocation(config: EventConfig): string {
  return `${config.venueSpace} — ${config.venueName}, ${config.address}`;
}

function buildEventDescription(config: EventConfig): string {
  return `${config.subtitle} Celebramos el primer añito de ${config.honoree} a las ${config.timeDisplay} en el ${config.venueSpace} de la ${config.venueName} (${config.address}).`;
}

export function buildGoogleCalendarUrl(config: EventConfig): string {
  const startStamp = toCalendarUtcStamp(new Date(config.startIso));
  const endStamp = toCalendarUtcStamp(new Date(config.endIso));

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: buildEventSummary(config),
    dates: `${startStamp}/${endStamp}`,
    details: buildEventDescription(config),
    location: buildFullVenueLocation(config),
    ctz: config.timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(config: EventConfig, stampNow: Date = new Date()): string {
  const dtStamp = toCalendarUtcStamp(stampNow);
  const dtStart = toCalendarUtcStamp(new Date(config.startIso));
  const dtEnd = toCalendarUtcStamp(new Date(config.endIso));

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jacobo Pineda//Primer Anito//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:jacobo-primer-anito-2026@invitacion.local`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(buildEventSummary(config))}`,
    `DESCRIPTION:${escapeIcsText(buildEventDescription(config))}`,
    `LOCATION:${escapeIcsText(buildFullVenueLocation(config))}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ];

  return lines.join('\r\n');
}
