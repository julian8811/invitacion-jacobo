import type { EventConfig } from '../config/event';

export interface RsvpFormValues {
  readonly guestName: string;
  readonly attending: boolean;
  readonly adults: number;
  readonly children: number;
  readonly message: string;
}

export interface RsvpRecord extends RsvpFormValues {
  readonly submittedAt: string;
}

export interface RsvpValidationErrors {
  guestName?: string;
  adults?: string;
  children?: string;
  message?: string;
}

export const RSVP_STORAGE_KEY = 'jacobo_primer_anito_rsvp_v1';
export const MAX_ADULTS = 10;
export const MAX_CHILDREN = 10;
export const MAX_MESSAGE_LENGTH = 280;

export function normalizeColombianWhatsAppNumber(rawPhone: string, countryCode: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  if (digits.startsWith(countryCode) && digits.length >= countryCode.length + 10) {
    return digits;
  }
  return `${countryCode}${digits}`;
}

export function validateRsvpInput(input: RsvpFormValues): RsvpValidationErrors {
  const errors: RsvpValidationErrors = {};

  if (!input.guestName.trim()) {
    errors.guestName = 'Por favor escribe tu nombre o el de tu familia.';
  } else if (input.guestName.trim().length > 80) {
    errors.guestName = 'El nombre no puede superar los 80 caracteres.';
  }

  if (input.attending) {
    if (!Number.isInteger(input.adults) || input.adults < 1 || input.adults > MAX_ADULTS) {
      errors.adults = `Indica entre 1 y ${MAX_ADULTS} adultos.`;
    }
    if (!Number.isInteger(input.children) || input.children < 0 || input.children > MAX_CHILDREN) {
      errors.children = `Indica entre 0 y ${MAX_CHILDREN} niños.`;
    }
  }

  if (input.message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `El mensaje puede tener máximo ${MAX_MESSAGE_LENGTH} caracteres.`;
  }

  return errors;
}

function formatGuestCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function buildWhatsAppRsvpMessage(input: RsvpFormValues, config: EventConfig): string {
  const cleanName = input.guestName.trim();
  const cleanMessage = input.message.trim();

  if (input.attending) {
    const adultsLabel = formatGuestCountLabel(input.adults, 'adulto', 'adultos');
    const childrenPart =
      input.children > 0
        ? ` y ${formatGuestCountLabel(input.children, 'niño', 'niños')}`
        : '';

    const lines = [
      `¡Hola! Confirmo asistencia para ${config.eventTitle} de ${config.honoree} 🦁🎈`,
      `• Invitado(s): ${cleanName}`,
      `• Asistencia: Sí asistiremos (${adultsLabel}${childrenPart})`,
      `• Fecha y hora: ${config.dateDisplay} a las ${config.timeDisplay}`,
      `• Lugar: ${config.venueSpace}, ${config.venueName}`,
    ];

    if (cleanMessage) {
      lines.push(`• Mensaje para Jacobo: "${cleanMessage}"`);
    }

    return lines.join('\n');
  }

  const lines = [
    `¡Hola! Respondo a la invitación de ${config.eventTitle} de ${config.honoree} 💛`,
    `• Invitado(s): ${cleanName}`,
    `• Asistencia: No podremos asistir en esta ocasión`,
  ];

  if (cleanMessage) {
    lines.push(`• Mensaje para Jacobo: "${cleanMessage}"`);
  }

  return lines.join('\n');
}

export function buildWhatsAppRsvpUrl(input: RsvpFormValues, config: EventConfig): string {
  const phone = normalizeColombianWhatsAppNumber(
    config.whatsappRawPhone,
    config.whatsappCountryCode,
  );
  const message = buildWhatsAppRsvpMessage(input, config);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function resolveStorage(storage?: Storage): Storage | null {
  if (storage) {
    return storage;
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export function saveRsvp(record: RsvpRecord, storage?: Storage): void {
  const target = resolveStorage(storage);
  if (!target) {
    return;
  }
  try {
    target.setItem(RSVP_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Private browsing or storage quota exceeded should never crash the invitation.
  }
}

export function loadSavedRsvp(storage?: Storage): RsvpRecord | null {
  const target = resolveStorage(storage);
  if (!target) {
    return null;
  }
  try {
    const raw = target.getItem(RSVP_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const candidate = parsed as Partial<RsvpRecord>;
    if (
      typeof candidate.guestName !== 'string' ||
      typeof candidate.attending !== 'boolean' ||
      typeof candidate.adults !== 'number' ||
      typeof candidate.children !== 'number' ||
      typeof candidate.message !== 'string' ||
      typeof candidate.submittedAt !== 'string'
    ) {
      return null;
    }
    return candidate as RsvpRecord;
  } catch {
    return null;
  }
}

export function clearSavedRsvp(storage?: Storage): void {
  const target = resolveStorage(storage);
  if (!target) {
    return;
  }
  try {
    target.removeItem(RSVP_STORAGE_KEY);
  } catch {
    // Ignore storage removal restrictions cleanly.
  }
}
