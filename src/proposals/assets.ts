export type RealisticAnimalId = 'lion' | 'elephant' | 'giraffe' | 'monkey' | 'zebra';

export interface RealisticAnimalAsset {
  readonly id: RealisticAnimalId;
  readonly label: string;
  readonly src: string;
  readonly alt: string;
  readonly sound: 'roar' | 'trumpet' | 'chew' | 'chatter' | 'snort';
}

export const REALISTIC_ANIMALS: readonly RealisticAnimalAsset[] = [
  {
    id: 'lion',
    label: 'Leoncito',
    src: '/images/realistic/lion-cub.jpg',
    alt: 'Cachorro de león realista mirando de frente',
    sound: 'roar',
  },
  {
    id: 'elephant',
    label: 'Elefantito',
    src: '/images/realistic/elephant-calf.jpg',
    alt: 'Cría de elefante realista con trompa curvada',
    sound: 'trumpet',
  },
  {
    id: 'giraffe',
    label: 'Jirafita',
    src: '/images/realistic/giraffe-calf.jpg',
    alt: 'Cría de jirafa realista de pie',
    sound: 'chew',
  },
  {
    id: 'monkey',
    label: 'Monito',
    src: '/images/realistic/monkey-infant.jpg',
    alt: 'Bebé mono realista sentado con expresión curiosa',
    sound: 'chatter',
  },
  {
    id: 'zebra',
    label: 'Cebrita',
    src: '/images/realistic/zebra-foal.jpg',
    alt: 'Potro de cebra realista de pie',
    sound: 'snort',
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
