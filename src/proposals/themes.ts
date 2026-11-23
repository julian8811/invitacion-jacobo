import type { ProposalTheme } from './types';

export const EXPLORER_THEME: ProposalTheme = {
  id: 'explorador',
  name: 'Pequeño Explorador',
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
};
