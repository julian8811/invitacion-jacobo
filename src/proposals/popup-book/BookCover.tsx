import { BookOpen, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import type { EventConfig } from '../../config/event';

interface BookCoverProps {
  readonly config: EventConfig;
  readonly reducedMotion: boolean;
  readonly onOpen: (silent: boolean) => void;
}

export function BookCover({ config, reducedMotion, onOpen }: BookCoverProps) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center px-5 py-8">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 30, rotateX: 25 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ perspective: 1200 }}
        className="w-full max-w-sm"
      >
        <div className="pb-cover pb-leaf-edge relative aspect-[3/4] w-full overflow-hidden rounded-r-2xl rounded-l-md border-l-[14px] border-[#12301b] p-6 text-center shadow-2xl">
          <div className="pb-gutter absolute inset-y-0 left-0 w-6" aria-hidden="true" />
          <div className="absolute inset-3 rounded-xl border-2 border-dashed border-[#e3c98f]/60" aria-hidden="true" />
          <div className="relative flex h-full flex-col items-center justify-between">
            <p className="pb-deboss text-xs uppercase tracking-[0.35em] text-[#e3c98f]">
              Un cuento pop-up
            </p>
            <div className="pb-kraft w-full max-w-[14rem] -rotate-1 rounded-lg p-1.5 shadow-lg">
              <img
                src="/images/realistic/lion-cub.jpg"
                alt="Leoncito de la selva"
                className="aspect-square w-full rounded object-cover"
                loading="eager"
              />
            </div>
            <div>
              <h1 className="pb-deboss text-3xl font-bold leading-tight text-[#f3dfb0]">
                {config.eventTitle}
              </h1>
              <p className="pb-deboss mt-2 text-base text-[#e3c98f]">{config.honoree}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex w-full max-w-sm flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => onOpen(false)}
          className="pb-kraft flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#6b4a22] px-6 py-3.5 text-lg font-bold text-[#3b2612] shadow-lg transition active:scale-95"
        >
          <BookOpen size={22} aria-hidden="true" />
          Abrir el libro
        </button>
        <button
          type="button"
          onClick={() => onOpen(true)}
          className="flex items-center gap-1.5 text-sm text-[#f0dcb0] underline-offset-4 hover:underline"
        >
          <VolumeX size={16} aria-hidden="true" />
          Entrar en silencio
        </button>
      </div>
    </div>
  );
}
