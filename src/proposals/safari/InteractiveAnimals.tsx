import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { REALISTIC_ANIMALS, type RealisticAnimalAsset } from '../assets';
import { playAnimalSound } from '../../utils/soundEffects';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface InteractiveAnimalsProps {
  readonly isMuted: boolean;
}

interface SplashDrop {
  readonly id: number;
  readonly x: number;
  readonly y: number;
}

export function InteractiveAnimals({ isMuted }: InteractiveAnimalsProps) {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [splashes, setSplashes] = useState<SplashDrop[]>([]);
  const [giraffeBent, setGiraffeBent] = useState(false);

  const handleAnimalTap = (animal: RealisticAnimalAsset, target: HTMLElement) => {
    playAnimalSound(animal.sound, isMuted);
    setActiveId(animal.id);

    if (animal.id === 'elephant') {
      const rect = target.getBoundingClientRect();
      const drops: SplashDrop[] = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: rect.left + rect.width * 0.55 + (Math.random() - 0.5) * 40,
        y: rect.top + rect.height * 0.35,
      }));
      setSplashes((prev) => [...prev, ...drops]);
      window.setTimeout(() => {
        setSplashes((prev) => prev.filter((d) => !drops.some((nd) => nd.id === d.id)));
      }, 900);
    }

    if (animal.id === 'giraffe') {
      setGiraffeBent(true);
      window.setTimeout(() => setGiraffeBent(false), 900);
    }

    window.setTimeout(() => setActiveId(null), 700);
  };

  return (
    <section aria-label="Amigos de la sabana" className="mt-6 w-full py-2">
      <p className="font-hand text-center text-lg text-[#1B4332] sm:text-xl">
        Toca a los amigos de Jacobo
      </p>
      <div className="mt-2 grid w-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {REALISTIC_ANIMALS.map((animal) => {
          const isActive = activeId === animal.id;
          const isGiraffe = animal.id === 'giraffe';

          return (
            <motion.button
              key={animal.id}
              type="button"
              aria-label={`Tocar al ${animal.label}`}
              className="flex w-full cursor-pointer flex-col items-center bg-transparent p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
              whileTap={reducedMotion ? undefined : { scale: 0.96 }}
              animate={
                reducedMotion
                  ? undefined
                  : {
                      y: isActive ? -8 : [0, -5, 0],
                      rotate: isGiraffe && giraffeBent ? 10 : 0,
                      scale: isActive ? 1.05 : 1,
                    }
              }
              transition={
                reducedMotion
                  ? undefined
                  : isActive
                    ? { duration: 0.3 }
                    : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
              }
              onClick={(event) => handleAnimalTap(animal, event.currentTarget)}
            >
              <img
                src={animal.src}
                alt={animal.alt}
                loading="lazy"
                className="h-32 w-auto max-w-full object-contain drop-shadow-[0_14px_20px_rgba(20,12,4,0.32)] sm:h-36"
                draggable={false}
              />
              <span className="mt-1 rounded-full bg-[#1B4332] px-2.5 py-0.5 text-[11px] font-bold text-[#FCE085]">
                {animal.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {splashes.map((drop) => (
          <motion.span
            key={drop.id}
            aria-hidden="true"
            className="pointer-events-none fixed z-[60] h-2.5 w-2.5 rounded-full bg-[#7EC8E3]"
            style={{ left: drop.x, top: drop.y }}
            initial={{ opacity: 0.9, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              y: 70 + Math.random() * 40,
              x: (Math.random() - 0.5) * 50,
              scale: 0.4,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </section>
  );
}
