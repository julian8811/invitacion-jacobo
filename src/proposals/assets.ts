export type RealisticAnimalId = 'lion' | 'elephant' | 'giraffe' | 'monkey';

export interface RealisticAnimalAsset {
  readonly id: RealisticAnimalId;
  readonly label: string;
  readonly src: string;
  readonly alt: string;
  readonly sound: 'roar' | 'trumpet' | 'chew' | 'chatter';
}

export const REALISTIC_ANIMALS: readonly RealisticAnimalAsset[] = [
  {
    id: 'lion',
    label: 'Leoncito',
    src: '/images/realistic/lion-cub.png',
    alt: 'Cachorro de león realista con fondo transparente',
    sound: 'roar',
  },
  {
    id: 'elephant',
    label: 'Elefantito',
    src: '/images/realistic/elephant-calf.png',
    alt: 'Cría de elefante realista con fondo transparente',
    sound: 'trumpet',
  },
  {
    id: 'giraffe',
    label: 'Jirafita',
    src: '/images/realistic/giraffe-calf.png',
    alt: 'Cría de jirafa realista con fondo transparente',
    sound: 'chew',
  },
  {
    id: 'monkey',
    label: 'Monito',
    src: '/images/realistic/monkey-infant.png',
    alt: 'Bebé mono realista con fondo transparente',
    sound: 'chatter',
  },
] as const;

export const SAFARI_SUNRISE_SRC = '/images/realistic/safari-sunrise.jpg';

export function animalById(id: RealisticAnimalId): RealisticAnimalAsset {
  const found = REALISTIC_ANIMALS.find((animal) => animal.id === id);
  if (!found) {
    return REALISTIC_ANIMALS[0];
  }
  return found;
}
