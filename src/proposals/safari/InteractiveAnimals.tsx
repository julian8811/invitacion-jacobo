import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Check, Clock, Heart, MapPin, PartyPopper, RotateCcw } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { JACOBO_MEMORIES } from '../../data/memories';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { fireSafeConfetti } from '../../utils/confetti';
import {
  playAnimalSound,
  playCelebrationFanfare,
  playDiscoveryChime,
} from '../../utils/soundEffects';
import { REALISTIC_ANIMALS, type RealisticAnimalAsset, type RealisticAnimalId } from '../assets';

interface InteractiveAnimalsProps {
  readonly config: EventConfig;
  readonly isMuted: boolean;
}

interface AnimalClue {
  readonly title: string;
  readonly body: string;
  readonly Icon: typeof Calendar;
  readonly accent: string;
  readonly photo?: string;
  readonly photoAlt?: string;
}

const LAST_MEMORY = JACOBO_MEMORIES[JACOBO_MEMORIES.length - 1];

function buildClues(config: EventConfig): Record<RealisticAnimalId, AnimalClue> {
  return {
    lion: {
      title: 'El Leoncito guarda la fecha',
      body: config.dateDisplay,
      Icon: Calendar,
      accent: 'bg-[#1B4332]',
    },
    elephant: {
      title: 'El Elefantito nunca olvida la hora',
      body: `Te esperamos a las ${config.timeDisplay}`,
      Icon: Clock,
      accent: 'bg-[#235B8C]',
    },
    giraffe: {
      title: 'La Jirafita ve el lugar desde lo alto',
      body: `${config.venueSpace} · ${config.venueName}, ${config.city}`,
      Icon: MapPin,
      accent: 'bg-[#D98A2B]',
    },
    monkey: {
      title: 'El Monito trae un recuerdo',
      body: LAST_MEMORY.memoryText,
      Icon: Heart,
      accent: 'bg-[#6F4220]',
      photo: LAST_MEMORY.imageSrc,
      photoAlt: LAST_MEMORY.imageAlt,
    },
  };
}

export function InteractiveAnimals({ config, isMuted }: InteractiveAnimalsProps) {
  const reducedMotion = useReducedMotion();
  const clues = buildClues(config);
  const [found, setFound] = useState<readonly RealisticAnimalId[]>([]);
  const [openId, setOpenId] = useState<RealisticAnimalId | null>(null);
  const [bouncingId, setBouncingId] = useState<RealisticAnimalId | null>(null);
  const allFound = found.length === REALISTIC_ANIMALS.length;

  const handleTap = (animal: RealisticAnimalAsset) => {
    playAnimalSound(animal.sound, isMuted);
    setBouncingId(animal.id);
    window.setTimeout(() => setBouncingId(null), 600);
    setOpenId(animal.id);

    if (found.includes(animal.id)) {
      return;
    }
    const next = [...found, animal.id];
    setFound(next);
    window.setTimeout(() => playDiscoveryChime(isMuted, next.length - 1), 650);

    if (next.length === REALISTIC_ANIMALS.length) {
      window.setTimeout(() => {
        playCelebrationFanfare(isMuted);
        fireSafeConfetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#1B4332', '#235B8C', '#E09F24', '#D98A2B', '#FCE085'],
        });
      }, 1200);
    }
  };

  const openClue = openId ? clues[openId] : null;
  const openAnimal = openId ? REALISTIC_ANIMALS.find((a) => a.id === openId) : null;

  return (
    <section aria-labelledby="safari-friends-heading" className="mt-6 w-full">
      <div className="flex w-full flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-hand text-lg text-[#6F4220]">Misión de explorador</p>
          <h2 id="safari-friends-heading" className="font-display text-xl font-bold text-[#3D240F] sm:text-2xl">
            Encuentra a los 4 amigos de Jacobo
          </h2>
          <p className="text-sm font-semibold text-[#5A4330]">
            Cada uno te revela un secreto de la fiesta.
          </p>
        </div>
        <p
          className="rounded-full bg-[#1B4332] px-3 py-1 text-sm font-extrabold text-[#FCE085] tabular-nums"
          aria-live="polite"
        >
          {found.length} / {REALISTIC_ANIMALS.length}
        </p>
      </div>

      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#6F4220]/15"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={REALISTIC_ANIMALS.length}
        aria-valuenow={found.length}
        aria-label="Amigos encontrados"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1B4332] via-[#D98A2B] to-[#235B8C] transition-[width] duration-500"
          style={{ width: `${(found.length / REALISTIC_ANIMALS.length) * 100}%` }}
        />
      </div>

      <div className="mt-3 grid w-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {REALISTIC_ANIMALS.map((animal) => {
          const isFound = found.includes(animal.id);
          const isBouncing = bouncingId === animal.id;
          return (
            <motion.button
              key={animal.id}
              type="button"
              aria-label={`Tocar al ${animal.label}${isFound ? ' (encontrado)' : ''}`}
              aria-pressed={openId === animal.id}
              onClick={() => handleTap(animal)}
              className="relative flex w-full cursor-pointer flex-col items-center p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
              whileTap={reducedMotion ? undefined : { scale: 0.94 }}
              animate={
                reducedMotion
                  ? undefined
                  : isBouncing
                    ? { y: [0, -22, 0, -8, 0], rotate: [0, -4, 4, 0] }
                    : isFound
                      ? { y: 0 }
                      : { y: [0, -5, 0] }
              }
              transition={
                reducedMotion
                  ? undefined
                  : isBouncing
                    ? { duration: 0.6 }
                    : { duration: 3.6, repeat: isFound ? 0 : Infinity, ease: 'easeInOut' }
              }
            >
              {isFound && (
                <span className="absolute top-1 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1E8E3E] text-white shadow">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}
              <img
                src={animal.src}
                alt={animal.alt}
                loading="lazy"
                draggable={false}
                className={`h-32 w-auto max-w-full object-contain drop-shadow-[0_14px_20px_rgba(20,12,4,0.32)] transition sm:h-36 ${
                  isFound ? '' : 'saturate-[0.85]'
                }`}
              />
              <span
                className={`mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  isFound ? 'bg-[#1E8E3E] text-white' : 'bg-[#1B4332] text-[#FCE085]'
                }`}
              >
                {animal.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {openClue && openAnimal && (
          <motion.div
            key={openAnimal.id}
            role="status"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl border-2 border-[#8B6136]/30 bg-[#FFFDF6] p-3 shadow-lg sm:p-4"
          >
            <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#FCE085] ${openClue.accent}`}>
              <openClue.Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold tracking-wide text-[#6F4220] uppercase">{openClue.title}</p>
              <p className="font-display text-base font-bold text-[#3D240F] sm:text-lg">{openClue.body}</p>
            </div>
            {openClue.photo && (
              <img
                src={openClue.photo}
                alt={openClue.photoAlt ?? ''}
                className="h-16 w-14 shrink-0 rounded-lg object-cover shadow"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="mt-3 w-full rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#235B8C] p-4 text-center text-[#FFF8E8] shadow-xl sm:p-5"
          >
            <PartyPopper className="mx-auto h-8 w-8 text-[#FCE085]" aria-hidden="true" />
            <p className="font-display mt-1 text-xl font-extrabold sm:text-2xl">
              ¡Encontraste a todos los amigos!
            </p>
            <p className="mt-1 text-sm font-semibold text-[#FBE8C2]">
              Ya eres parte de la expedición. Ahora confirma tu asistencia para celebrar con Jacobo.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <a
                href="#rsvp"
                className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-[#9E5E12] bg-[#E09F24] px-4 py-2.5 text-sm font-bold text-[#281809]"
              >
                Confirmar asistencia
              </a>
              <button
                type="button"
                onClick={() => {
                  setFound([]);
                  setOpenId(null);
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-bold text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Jugar de nuevo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
