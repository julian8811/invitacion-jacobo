import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { REALISTIC_ANIMALS, type RealisticAnimalAsset } from '../assets';
import { playAnimalSound } from '../../utils/soundEffects';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface InteractiveAnimalsProps {
  readonly isMuted: boolean;
  readonly tiltX?: number;
  readonly tiltY?: number;
}

interface SplashDrop {
  readonly id: number;
  readonly x: number;
  readonly y: number;
}

export function InteractiveAnimals({
  isMuted,
  tiltX = 0,
  tiltY = 0,
}: InteractiveAnimalsProps) {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [splashes, setSplashes] = useState<SplashDrop[]>([]);
  const [giraffeBent, setGiraffeBent] = useState(false);

  const handleAnimalTap = (animal: RealisticAnimalAsset, target: EventTarget & Element) => {
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

  const positions = [
    { animal: REALISTIC_ANIMALS[0], className: 'left-[4%] bottom-[8%] w-[28%] sm:w-[22%]', depth: 18 },
    { animal: REALISTIC_ANIMALS[1], className: 'left-[32%] bottom-[2%] w-[30%] sm:w-[24%]', depth: 28 },
    { animal: REALISTIC_ANIMALS[2], className: 'right-[28%] bottom-[10%] w-[26%] sm:w-[20%]', depth: 14 },
    { animal: REALISTIC_ANIMALS[3], className: 'right-[6%] bottom-[4%] w-[24%] sm:w-[18%]', depth: 22 },
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] sm:h-[46%]">
      {positions.map(({ animal, className, depth }) => {
        const isActive = activeId === animal.id;
        const isGiraffe = animal.id === 'giraffe';
        const offsetX = tiltX * depth;
        const offsetY = tiltY * (depth * 0.4);

        return (
          <motion.button
            key={animal.id}
            type="button"
            aria-label={`Tocar al ${animal.label}`}
            className={`pointer-events-auto absolute cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE085] ${className}`}
            style={{
              transform: reducedMotion
                ? undefined
                : `translate3d(${offsetX}px, ${offsetY}px, 0)`,
            }}
            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
            animate={
              reducedMotion
                ? undefined
                : {
                    y: isActive ? -10 : [0, -6, 0],
                    rotate: isGiraffe && giraffeBent ? 12 : isActive ? [-2, 2, -2] : 0,
                    scale: isActive ? 1.06 : 1,
                  }
            }
            transition={
              reducedMotion
                ? undefined
                : isActive
                  ? { duration: 0.35 }
                  : { duration: 4 + depth * 0.05, repeat: Infinity, ease: 'easeInOut' }
            }
            onClick={(event) => handleAnimalTap(animal, event.currentTarget as HTMLElement)}
          >
            <span className="block overflow-hidden rounded-[42%] shadow-[0_18px_30px_rgba(20,12,4,0.35)] ring-2 ring-[#FFF8E8]/55">
              <img
                src={animal.src}
                alt={animal.alt}
                loading="lazy"
                className="aspect-square h-auto w-full object-cover object-top"
                draggable={false}
              />
            </span>
            <span className="mt-1 block rounded-full bg-[#2A1708]/75 px-2 py-0.5 text-center text-[10px] font-bold text-[#FCE085] backdrop-blur-sm sm:text-xs">
              {animal.label}
            </span>
          </motion.button>
        );
      })}

      <AnimatePresence>
        {splashes.map((drop) => (
          <motion.span
            key={drop.id}
            aria-hidden="true"
            className="pointer-events-none fixed z-[60] h-2.5 w-2.5 rounded-full bg-[#7EC8E3]"
            style={{ left: drop.x, top: drop.y }}
            initial={{ opacity: 0.9, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: 70 + Math.random() * 40, x: (Math.random() - 0.5) * 50, scale: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
