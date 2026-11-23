export interface EventConfig {
  readonly honoree: string;
  readonly eventTitle: string;
  readonly subtitle: string;
  readonly introHeadline: string;
  readonly dateDisplay: string;
  readonly timeDisplay: string;
  readonly startIso: string;
  readonly endIso: string;
  readonly timezone: string;
  readonly venueName: string;
  readonly venueSpace: string;
  readonly address: string;
  readonly neighborhood: string;
  readonly city: string;
  readonly googleMapsUrl: string;
  readonly wazeUrl: string;
  readonly mapEmbedUrl: string;
  readonly whatsappRawPhone: string;
  readonly whatsappCountryCode: string;
  readonly rsvpHeading: string;
  readonly videoSrc: string;
  readonly posterSrc: string;
}

/**
 * Single source of truth for Jacobo Pineda's 1st birthday celebration.
 * Intentionally excludes any gift or rain-of-envelopes metadata per user instruction.
 */
export const EVENT_CONFIG: EventConfig = {
  honoree: 'Jacobo Pineda Jaramillo',
  eventTitle: '¡Mi Primer Añito!',
  subtitle: '¡Te invito a celebrarlo!',
  introHeadline: 'Tienes una invitación muy especial de Jacobo',
  dateDisplay: 'Domingo, 13 de diciembre de 2026',
  timeDisplay: '3:00 p. m.',
  startIso: '2026-12-13T15:00:00-05:00',
  endIso: '2026-12-13T19:00:00-05:00',
  timezone: 'America/Bogota',
  venueName: 'Unidad Oporto Campestre',
  venueSpace: 'Salón Social',
  address: 'Cra. 78 #40-25, Copacabana, Antioquia',
  neighborhood: 'Sector Machado',
  city: 'Copacabana, Antioquia',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Unidad+Oporto+Campestre+Cra+78+40-25+Copacabana+Antioquia',
  wazeUrl:
    'https://waze.com/ul?q=Unidad%20Oporto%20Campestre%20Cra%2078%2040-25%20Copacabana%20Antioquia&navigate=yes',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Unidad+Oporto+Campestre,+Cra.+78+%2340-25,+Copacabana,+Antioquia&t=&z=16&ie=UTF8&iwloc=&output=embed',
  whatsappRawPhone: '3005944356',
  whatsappCountryCode: '57',
  rsvpHeading: '¡Confirma tu asistencia aquí abajo!',
  videoSrc: '/media/invitacion-jacobo.mp4',
  posterSrc: '/og-cover.png',
};
