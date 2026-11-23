export type SafariFrameAnimal = 'lion' | 'elephant' | 'monkey' | 'giraffe' | 'toucan';

export interface JacoboMemory {
  readonly id: string;
  readonly chapterLabel: string;
  readonly ageLabel: string;
  readonly shortLabel: string;
  readonly title: string;
  readonly memoryText: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly objectPosition: string;
  readonly animal: SafariFrameAnimal;
  readonly animalLabel: string;
}

export const JACOBO_MEMORIES: readonly JacoboMemory[] = [
  {
    id: '00-bienvenido',
    chapterLabel: 'Capítulo 00',
    ageLabel: 'Recién nacido',
    shortLabel: 'Bienvenido',
    title: 'El día que empezó todo',
    memoryText:
      'El comienzo de una historia que se escribe con amor, abrazos y pequeños instantes.',
    imageSrc: '/images/memories/00-bienvenido.jpg',
    imageAlt: 'Jacobo recién nacido dormido plácidamente junto a su osito de peluche',
    objectPosition: 'center 25%',
    animal: 'lion',
    animalLabel: 'Leoncito explorador',
  },
  {
    id: '00-primeros-dias',
    chapterLabel: 'Capítulo 00',
    ageLabel: 'Recién nacido',
    shortLabel: 'Primeros días',
    title: 'Nuestro pequeño milagro',
    memoryText:
      'Tan pequeñito en nuestros brazos, y ya ocupando el lugar más grande de nuestro corazón.',
    imageSrc: '/images/memories/00-primeros-dias.jpg',
    imageAlt: 'Jacobo en sus primeros días abrigado con gorrito blanco entre nubes de peluche',
    objectPosition: 'center 25%',
    animal: 'elephant',
    animalLabel: 'Elefantito aventurero',
  },
  {
    id: '01-mes',
    chapterLabel: 'Capítulo 01',
    ageLabel: '1 mes',
    shortLabel: '1 mes',
    title: 'Un mes de amor infinito',
    memoryText:
      'Un mes para descubrir que el tiempo vuela y que el amor puede crecer cada día.',
    imageSrc: '/images/memories/01-mes.jpg',
    imageAlt: 'Jacobo al cumplir 1 mes vestido de crema junto al disco de madera 1 mes',
    objectPosition: 'center 22%',
    animal: 'monkey',
    animalLabel: 'Monito curioso',
  },
  {
    id: '02-meses',
    chapterLabel: 'Capítulo 02',
    ageLabel: '2 meses',
    shortLabel: '2 meses',
    title: 'Dos meses de ternura',
    memoryText:
      'Una mirada, un gesto, un instante: todo contigo se vuelve un recuerdo especial.',
    imageSrc: '/images/memories/02-meses.jpg',
    imageAlt: 'Jacobo con 2 meses mirando curioso sobre manta azul con luna y estrellas',
    objectPosition: 'center 25%',
    animal: 'giraffe',
    animalLabel: 'Jirafita de la selva',
  },
  {
    id: '03-meses',
    chapterLabel: 'Capítulo 03',
    ageLabel: '3 meses',
    shortLabel: '3 meses',
    title: 'Tres meses, mil miradas',
    memoryText:
      'Cada día hay algo nuevo por descubrir en esta aventura que apenas comienza.',
    imageSrc: '/images/memories/03-meses.jpg',
    imageAlt: 'Jacobo a los 3 meses despierto con pijama de animalitos y disco de 3 meses',
    objectPosition: 'center 18%',
    animal: 'toucan',
    animalLabel: 'Tucán tropical',
  },
  {
    id: '04-meses',
    chapterLabel: 'Capítulo 04',
    ageLabel: '4 meses',
    shortLabel: '4 meses',
    title: 'Cuatro meses de sonrisas',
    memoryText:
      'Hay momentos que iluminan el día entero y se guardan para siempre en la memoria.',
    imageSrc: '/images/memories/04-meses.jpg',
    imageAlt: 'Jacobo a los 4 meses sonriendo con overol azul junto al número 4 en madera',
    objectPosition: 'center 22%',
    animal: 'lion',
    animalLabel: 'Leoncito explorador',
  },
  {
    id: '05-meses',
    chapterLabel: 'Capítulo 05',
    ageLabel: '5 meses',
    shortLabel: '5 meses',
    title: 'Cinco meses de magia',
    memoryText:
      'Cinco meses llenando nuestros días de una ternura imposible de poner en palabras.',
    imageSrc: '/images/memories/05-meses.jpg',
    imageAlt: 'Jacobo a los 5 meses con overol arena jugando con su sonajero de madera',
    objectPosition: 'center 30%',
    animal: 'elephant',
    animalLabel: 'Elefantito aventurero',
  },
  {
    id: '06-meses',
    chapterLabel: 'Capítulo 06',
    ageLabel: '6 meses',
    shortLabel: '6 meses',
    title: 'Medio año contigo',
    memoryText:
      'La mitad de tu primer año, y un universo de momentos hermosos por recordar.',
    imageSrc: '/images/memories/06-meses.jpg',
    imageAlt: 'Jacobo al cumplir 6 meses con conjunto blanco entre cojines de estrellas',
    objectPosition: 'center 22%',
    animal: 'monkey',
    animalLabel: 'Monito curioso',
  },
  {
    id: '07-meses',
    chapterLabel: 'Capítulo 07',
    ageLabel: '7 meses',
    shortLabel: '7 meses',
    title: 'Siete meses de aventuras',
    memoryText:
      'La vida contigo se llena de curiosidad, cariño y nuevas razones para sonreír.',
    imageSrc: '/images/memories/07-meses.jpg',
    imageAlt: 'Jacobo sentado a los 7 meses con overol azul claro junto a caballito de madera',
    objectPosition: 'center 22%',
    animal: 'giraffe',
    animalLabel: 'Jirafita de la selva',
  },
  {
    id: '08-meses',
    chapterLabel: 'Capítulo 08',
    ageLabel: '8 meses',
    shortLabel: '8 meses',
    title: 'Ocho meses de asombro',
    memoryText:
      'El mundo es inmenso, pero nuestros momentos favoritos caben en una fotografía.',
    imageSrc: '/images/memories/08-meses.jpg',
    imageAlt: 'Jacobo al aire libre a los 8 meses sosteniendo el número 8 de madera',
    objectPosition: 'center 22%',
    animal: 'toucan',
    animalLabel: 'Tucán tropical',
  },
  {
    id: '09-meses',
    chapterLabel: 'Capítulo 09',
    ageLabel: '9 meses',
    shortLabel: '9 meses',
    title: 'Nueve meses de alegría',
    memoryText:
      'Las pequeñas cosas son las que terminan contando las historias más grandes.',
    imageSrc: '/images/memories/09-meses.jpg',
    imageAlt: 'Jacobo a los 9 meses sonriendo feliz con overol verde oliva en el jardín',
    objectPosition: 'center 22%',
    animal: 'lion',
    animalLabel: 'Leoncito explorador',
  },
  {
    id: '10-meses',
    chapterLabel: 'Capítulo 10',
    ageLabel: '10 meses',
    shortLabel: '10 meses',
    title: 'Diez meses de recuerdos',
    memoryText:
      'Diez meses de crecer juntos, de celebrar lo cotidiano y atesorar cada segundo.',
    imageSrc: '/images/memories/10-meses.jpg',
    imageAlt: 'Jacobo a los 10 meses abrazando su osito con letras luminosas 10 detrás',
    objectPosition: 'center 22%',
    animal: 'elephant',
    animalLabel: 'Elefantito aventurero',
  },
  {
    id: '11-meses',
    chapterLabel: 'Capítulo 11',
    ageLabel: '11 meses',
    shortLabel: '11 meses',
    title: 'Once meses de ilusión',
    memoryText:
      'Once meses de miradas curiosas, nuevas aventuras y momentos que guardaremos para siempre.',
    imageSrc: '/images/memories/11-meses.jpg',
    imageAlt: 'Jacobo a los 11 meses sentado con buzo arena y pizarra de 11 meses detrás',
    objectPosition: 'center 22%',
    animal: 'monkey',
    animalLabel: 'Monito curioso',
  },
];
