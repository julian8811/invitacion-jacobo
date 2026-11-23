import { useState } from 'react';
import { fireSafeConfetti } from '../utils/confetti';
import { playAnimalChime } from '../utils/soundEffects';

interface SafariFriendsPlaygroundProps {
  readonly isMuted: boolean;
}

interface SafariFriend {
  readonly id: 'lion' | 'elephant' | 'monkey';
  readonly name: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly quote: string;
  readonly ringColor: string;
}

const FRIENDS: readonly SafariFriend[] = [
  {
    id: 'lion',
    name: 'Leoncito',
    imageSrc: '/images/baby-lion-rsvp.png',
    imageAlt: 'Leoncito con gorro de fiesta saludando',
    quote: '¡Te espero con muchos globos y abrazos!',
    ringColor: 'border-[#F4B942]',
  },
  {
    id: 'elephant',
    name: 'Elefantito',
    imageSrc: '/images/baby-elephant-envelope.png',
    imageAlt: 'Elefantito tierno con sobre de corazón',
    quote: '¡Qué alegría celebrar el primer año de Jacobo!',
    ringColor: 'border-[#6EB5DC]',
  },
  {
    id: 'monkey',
    name: 'Monito',
    imageSrc: '/images/baby-monkey-vine.png',
    imageAlt: 'Monito jugando en una liana con flores',
    quote: '¡Vamos a jugar y reír en el Salón Social!',
    ringColor: 'border-[#6EC498]',
  },
];

export function SafariFriendsPlayground({ isMuted }: SafariFriendsPlaygroundProps) {
  const [greetedIds, setGreetedIds] = useState<string[]>([]);
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState<string>(
    'Toca cada animalito para escuchar su saludo para la fiesta.',
  );

  const handleGreetFriend = (friend: SafariFriend) => {
    setBouncingId(friend.id);
    setActiveQuote(`${friend.name}: "${friend.quote}"`);
    playAnimalChime(friend.id, isMuted);

    window.setTimeout(() => {
      setBouncingId((prev) => (prev === friend.id ? null : prev));
    }, 560);

    if (!greetedIds.includes(friend.id)) {
      const next = [...greetedIds, friend.id];
      setGreetedIds(next);
      if (next.length === FRIENDS.length) {
        fireSafeConfetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#F4B942', '#6EC498', '#6EB5DC', '#F07167'],
        });
      }
    }
  };

  return (
    <section aria-labelledby="friends-heading" className="px-4 py-6">
      <div className="storybook-card mx-auto max-w-3xl rounded-[2.25rem] p-6 text-center sm:p-8">
        <h2 id="friends-heading" className="font-display text-2xl font-bold text-[#5C371B] sm:text-3xl">
          Toca a los amigos de Jacobo
        </h2>
        <p className="font-hand mt-1 text-lg text-[#3F734D]">
          {greetedIds.length === FRIENDS.length
            ? '¡Saludaste a los 3 amigos! Todos te esperan en la selva.'
            : `Saludaste a ${greetedIds.length} de ${FRIENDS.length} amigos`}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-6">
          {FRIENDS.map((friend) => {
            const isGreeted = greetedIds.includes(friend.id);
            const isBouncing = bouncingId === friend.id;
            return (
              <button
                key={friend.id}
                type="button"
                onClick={() => handleGreetFriend(friend)}
                aria-label={`Saludar a ${friend.name}`}
                className="group flex cursor-pointer flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#244B32]"
              >
                <div
                  className={`cameo-circle relative h-24 w-24 overflow-hidden rounded-full border-4 transition sm:h-32 sm:w-32 ${friend.ringColor} ${
                    isBouncing ? 'animate-hop' : 'group-hover:scale-105'
                  }`}
                >
                  <img
                    src={friend.imageSrc}
                    alt={friend.imageAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-display mt-2 text-sm font-bold text-[#5C371B] sm:text-base">
                  {friend.name}
                </span>
                <span
                  className={`mt-0.5 text-xs font-bold ${
                    isGreeted ? 'text-[#244B32]' : 'text-[#8C6A4A]'
                  }`}
                >
                  {isGreeted ? 'Saludado' : 'Tócame'}
                </span>
              </button>
            );
          })}
        </div>

        <div
          aria-live="polite"
          className="stitched-panel mx-auto mt-5 max-w-xl rounded-2xl px-4 py-3"
        >
          <p className="font-hand text-lg text-[#4E2E14] sm:text-xl">{activeQuote}</p>
        </div>
      </div>
    </section>
  );
}
