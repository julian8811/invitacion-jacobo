import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { JACOBO_MEMORIES } from '../../data/memories';
import { animalById, type RealisticAnimalId } from '../assets';

const MEMORY_ANIMAL: Record<string, RealisticAnimalId> = {
  lion: 'lion',
  elephant: 'elephant',
  monkey: 'monkey',
  giraffe: 'giraffe',
  toucan: 'zebra',
};

export function PolaroidMemories() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(
    () => JACOBO_MEMORIES.find((memory) => memory.id === activeId) ?? null,
    [activeId],
  );

  return (
    <section aria-labelledby="safari-memories-heading" className="px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <p className="font-hand text-center text-xl text-[#1B4332]">Cuerda entre acacias</p>
        <h2
          id="safari-memories-heading"
          className="font-display text-center text-2xl font-bold text-[#3D240F] sm:text-3xl"
        >
          Los primeros 11 meses de Jacobo
        </h2>
        <p className="mx-auto mt-1 max-w-xl text-center text-sm font-semibold text-[#5A4330]">
          Arrastra o toca cada polaroid para abrir el recuerdo completo.
        </p>

        <div className="relative mt-8">
          <div
            aria-hidden="true"
            className="absolute top-8 right-4 left-4 h-1 rounded-full bg-[#6F4220]/55 shadow"
          />
          <div className="memories-strip flex gap-4 overflow-x-auto px-2 pb-4 pt-2">
            {JACOBO_MEMORIES.map((memory, index) => {
              const animal = animalById(MEMORY_ANIMAL[memory.animal] ?? 'lion');
              const rotation = index % 2 === 0 ? -3 : 4;
              return (
                <motion.button
                  key={memory.id}
                  type="button"
                  drag="x"
                  dragConstraints={{ left: -40, right: 40 }}
                  dragElastic={0.2}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveId(memory.id)}
                  className="relative w-44 shrink-0 cursor-grab rounded-sm bg-[#FFFDF8] p-2.5 pb-8 text-left shadow-xl active:cursor-grabbing sm:w-48"
                  style={{ rotate: rotation }}
                  aria-label={`Abrir recuerdo: ${memory.title}`}
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
                  <span className="mt-2 block font-hand text-sm text-[#3D240F]">{memory.shortLabel}</span>
                  <span className="mt-1 flex items-center gap-1.5">
                    <img
                      src={animal.src}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover"
                      aria-hidden="true"
                    />
                    <span className="text-[10px] font-bold text-[#6F4220]">{animal.label}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1A1208]/72 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
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
                onClick={() => setActiveId(null)}
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
