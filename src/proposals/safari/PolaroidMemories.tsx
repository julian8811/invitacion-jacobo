import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import { JACOBO_MEMORIES } from '../../data/memories';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { animalById, type RealisticAnimalId } from '../assets';

const MEMORY_ANIMAL: Record<string, RealisticAnimalId> = {
  lion: 'lion',
  elephant: 'elephant',
  monkey: 'monkey',
  giraffe: 'giraffe',
  toucan: 'lion',
};

const AUTO_MS = 4200;

export function PolaroidMemories() {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const active = useMemo(
    () => JACOBO_MEMORIES.find((memory) => memory.id === lightboxId) ?? null,
    [lightboxId],
  );

  useEffect(() => {
    if (paused || reducedMotion || lightboxId) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % JACOBO_MEMORIES.length);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, lightboxId]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) {
      return;
    }
    const card = strip.querySelector<HTMLElement>(`[data-memory-index="${index}"]`);
    if (!card) {
      return;
    }
    const left = Math.max(0, card.offsetLeft - (strip.clientWidth - card.clientWidth) / 2);
    if (typeof strip.scrollTo === 'function') {
      strip.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
    } else {
      strip.scrollLeft = left;
    }
  }, [index, reducedMotion]);

  const go = (delta: number) => {
    setIndex((prev) => (prev + delta + JACOBO_MEMORIES.length) % JACOBO_MEMORIES.length);
  };

  return (
    <section aria-labelledby="safari-memories-heading" className="w-full py-6">
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
        <p className="font-hand text-center text-xl text-[#1B4332]">Cuerda entre acacias</p>
        <h2
          id="safari-memories-heading"
          className="font-display text-center text-2xl font-bold text-[#3D240F] sm:text-3xl"
        >
          Los primeros 11 meses de Jacobo
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-center text-sm font-semibold text-[#5A4330]">
          El carrusel avanza solo. Toca una foto para verla grande.
        </p>

        <div className="mt-4 flex w-full items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Recuerdo anterior"
            onClick={() => go(-1)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#1B4332] text-white"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'}
            onClick={() => setPaused((prev) => !prev)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#F5EEDB] px-3 py-2 text-xs font-bold text-[#3D240F]"
          >
            {paused ? (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{paused ? 'Reanudar' : 'Pausar'}</span>
          </button>
          <button
            type="button"
            aria-label="Recuerdo siguiente"
            onClick={() => go(1)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#1B4332] text-white"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative mt-5 w-full">
        <div
          aria-hidden="true"
          className="absolute top-10 right-0 left-0 h-1 bg-[#6F4220]/45"
        />
        <div
          ref={stripRef}
          className="memories-strip flex w-full gap-3 overflow-x-auto scroll-smooth px-3 pb-5 pt-3 sm:gap-4 sm:px-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {JACOBO_MEMORIES.map((memory, memoryIndex) => {
            const animal = animalById(MEMORY_ANIMAL[memory.animal] ?? 'lion');
            const isCurrent = memoryIndex === index;
            return (
              <motion.button
                key={memory.id}
                type="button"
                data-memory-index={memoryIndex}
                onClick={() => {
                  setIndex(memoryIndex);
                  setLightboxId(memory.id);
                }}
                className={`relative w-[78vw] max-w-sm shrink-0 cursor-pointer rounded-sm bg-[#FFFDF8] p-3 pb-8 text-left shadow-xl transition sm:w-64 ${
                  isCurrent ? 'ring-4 ring-[#D98A2B]' : 'opacity-90'
                }`}
                style={{ rotate: memoryIndex % 2 === 0 ? -2 : 2 }}
                aria-label={`Abrir recuerdo: ${memory.title}`}
                aria-current={isCurrent ? 'true' : undefined}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-[#D98A2B] shadow"
                />
                <span className="block overflow-hidden rounded-sm bg-[#E8DFC8]">
                  <img
                    src={memory.imageSrc}
                    alt={memory.imageAlt}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                    style={{ objectPosition: memory.objectPosition }}
                  />
                </span>
                <span className="mt-2 block font-hand text-base text-[#3D240F]">
                  {memory.shortLabel}
                </span>
                <span className="mt-1 flex items-center gap-1.5">
                  <img
                    src={animal.src}
                    alt=""
                    className="h-7 w-7 object-contain"
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-bold text-[#6F4220]">{animal.label}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-1 flex w-full max-w-4xl justify-center gap-1.5 px-4">
        {JACOBO_MEMORIES.map((memory, memoryIndex) => (
          <button
            key={memory.id}
            type="button"
            aria-label={`Ir a ${memory.shortLabel}`}
            onClick={() => setIndex(memoryIndex)}
            className={`h-2 rounded-full transition-all ${
              memoryIndex === index ? 'w-6 bg-[#1B4332]' : 'w-2 bg-[#1B4332]/30'
            }`}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1A1208]/72 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxId(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
              className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-3xl bg-[#FFFDF8] p-4 shadow-2xl"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Cerrar recuerdo"
                onClick={() => setLightboxId(null)}
                className="absolute top-3 right-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F5EEDB] text-[#3D240F]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <img
                src={active.imageSrc}
                alt={active.imageAlt}
                className="aspect-[4/5] w-full rounded-2xl object-cover"
                style={{ objectPosition: active.objectPosition }}
              />
              <p className="mt-3 text-xs font-extrabold tracking-wide text-[#6F4220] uppercase">
                {active.chapterLabel} · {active.ageLabel}
              </p>
              <h3 className="font-display text-2xl font-bold text-[#3D240F]">{active.title}</h3>
              <p className="mt-1 text-sm font-semibold text-[#5A4330]">{active.memoryText}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
