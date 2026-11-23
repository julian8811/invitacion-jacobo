import type { ProposalId, ProposalTheme, StudioView } from './types';

export const PROPOSALS: readonly ProposalTheme[] = [
  {
    id: 'explorador',
    number: 1,
    name: 'Propuesta 1 · Pequeño Explorador',
    shortLabel: '1. Explorador',
    tagline: 'Cuaderno de expedición, verde bosque y brújula safari',
    description:
      'Estilo libro de aventuras infantil para nene: papel kraft, sello de brújula, verde bosque profundo, azul cobalto y dorado ocre.',
    assets: {
      heroScene: '/images/p1-explorer-hero.png',
      introMascot: '/images/p1-explorer-badge.png',
      rsvpMascot: '/images/p1-explorer-badge.png',
      heroAlt:
        'Leoncito explorador, elefantito con pañoleta azul y monito en jeep de madera rodeados de selva verde',
      mascotAlt:
        'Elefantito explorador con sombrero safari y pañoleta azul sosteniendo brújula y mapa de selva',
    },
    copy: {
      introEyebrow: 'Pasaporte de expedición en la selva',
      introCta: 'Abrir expedición',
      heroEyebrow: 'Expedición primer añito de Jacobo',
      countdownEyebrow: 'Bitácora de viaje',
      locationEyebrow: 'Coordenadas de la selva',
      rsvpEyebrow: 'Puesto de campamento',
      rsvpBadgeText: '¡Te esperamos, explorador!',
      cardButtonLabel: 'Abrir invitación interactiva',
      cardHelperText: 'Toca el botón para ver el video, el mapa y confirmar asistencia',
      cardBadgeText: 'EXPEDICIÓN PRIMER AÑITO',
    },
    confettiColors: ['#1B4332', '#235B8C', '#E09F24', '#4D8B55', '#0F766E', '#B4691E'],
    balloonColors: ['#1B4332', '#235B8C', '#E09F24', '#4D8B55', '#0F766E', '#B4691E'],
    exportFiles: {
      pdf: '/cards/tarjeta-propuesta-1.pdf',
      jpg: '/cards/tarjeta-propuesta-1.jpg',
    },
  },
  {
    id: 'selva-viva',
    number: 2,
    name: 'Propuesta 2 · Selva Viva',
    shortLabel: '2. Selva Viva',
    tagline: 'Casa del árbol, cielo azul soleado y colores alegres',
    description:
      'Propuesta luminosa y juguetona de día en la selva: azul rey, turquesa tropical, verde esmeralda, amarillo mango y madera cálida.',
    assets: {
      heroScene: '/images/p2-selva-viva-hero.png',
      introMascot: '/images/p2-selva-viva-lion.png',
      rsvpMascot: '/images/p2-selva-viva-lion.png',
      heroAlt:
        'Leoncito con gorra azul y amarilla, jirafa, monito y tucán en casa del árbol bajo un cielo azul soleado',
      mascotAlt:
        'Leoncito sonriente con gorra azul y amarilla saludando entre hojas de palma y globos azules y dorados',
    },
    copy: {
      introEyebrow: 'Una gran fiesta entre palmeras y risas',
      introCta: 'Entrar a la selva',
      heroEyebrow: 'Fiesta tropical en la casa del árbol',
      countdownEyebrow: 'Cuenta regresiva',
      locationEyebrow: 'Ruta de la aventura',
      rsvpEyebrow: 'Lista de invitados',
      rsvpBadgeText: '¡A jugar en la selva!',
      cardButtonLabel: 'Ver invitación y confirmar',
      cardHelperText: 'Toca el botón para ver el video, el mapa y confirmar asistencia',
      cardBadgeText: 'AVENTURA EN LA SELVA',
    },
    confettiColors: ['#2168B0', '#0E8FA3', '#1E7E45', '#F5A623', '#52B788', '#3B82F6'],
    balloonColors: ['#2168B0', '#0E8FA3', '#1E7E45', '#F5A623', '#52B788', '#3B82F6'],
    exportFiles: {
      pdf: '/cards/tarjeta-propuesta-2.pdf',
      jpg: '/cards/tarjeta-propuesta-2.jpg',
    },
  },
  {
    id: 'campamento',
    number: 3,
    name: 'Propuesta 3 · Campamento en la Selva',
    shortLabel: '3. Campamento',
    tagline: 'Atardecer de luciérnagas, carpa safari y faroles dorados',
    description:
      'Atmósfera mágica de campamento en la selva al caer la tarde: verde pino profundo, azul nocturno, faroles dorados y tarjetas de pergamino.',
    assets: {
      heroScene: '/images/p3-campamento-hero.png',
      introMascot: '/images/p3-campamento-tent.png',
      rsvpMascot: '/images/p3-campamento-tent.png',
      heroAlt:
        'Leoncito, elefantito con pañoleta turquesa y monito junto a una carpa safari iluminada con faroles dorados',
      mascotAlt:
        'Monito sonriente sosteniendo un farol dorado frente a una carpa safari en la selva al atardecer',
    },
    copy: {
      introEyebrow: 'Noche de faroles y fogata en la selva',
      introCta: 'Encender la invitación',
      heroEyebrow: 'Campamento bajo las luciérnagas',
      countdownEyebrow: 'Reloj del campamento',
      locationEyebrow: 'Mapa hasta la carpa',
      rsvpEyebrow: 'Registro de aventureros',
      rsvpBadgeText: '¡Te esperamos junto al farol!',
      cardButtonLabel: 'Entrar a la aventura',
      cardHelperText: 'Toca el botón para ver el video, el mapa y confirmar asistencia',
      cardBadgeText: 'CAMPAMENTO DE JACOBO',
    },
    confettiColors: ['#F6BD3A', '#2D8A68', '#2B6CB0', '#D98A2B', '#38A169', '#FBE192'],
    balloonColors: ['#F6BD3A', '#2D8A68', '#2B6CB0', '#D98A2B', '#38A169', '#FBE192'],
    exportFiles: {
      pdf: '/cards/tarjeta-propuesta-3.pdf',
      jpg: '/cards/tarjeta-propuesta-3.jpg',
    },
  },
] as const;

export const PROPOSAL_BY_ID: Record<ProposalId, ProposalTheme> = {
  explorador: PROPOSALS[0],
  'selva-viva': PROPOSALS[1],
  campamento: PROPOSALS[2],
};

export function resolveProposalFromParam(raw: string | null | undefined): ProposalId {
  const normalized = raw?.trim().toLowerCase();
  if (normalized === '2' || normalized === 'selva-viva' || normalized === 'selva') {
    return 'selva-viva';
  }
  if (normalized === '3' || normalized === 'campamento' || normalized === 'nocturna') {
    return 'campamento';
  }
  return 'explorador';
}

export function resolveViewFromParam(raw: string | null | undefined): StudioView {
  return raw?.trim().toLowerCase() === 'tarjeta' ? 'tarjeta' : 'pagina';
}
