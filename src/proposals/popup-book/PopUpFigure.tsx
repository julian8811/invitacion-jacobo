import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PopUpFigureProps {
  readonly active: boolean;
  readonly reducedMotion: boolean;
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly tilt?: number;
  readonly children?: ReactNode;
}

/** Cardstock animal cut-out that folds up from the page when it becomes active. */
export function PopUpFigure({
  active,
  reducedMotion,
  src,
  alt,
  className = '',
  tilt = -4,
  children,
}: PopUpFigureProps) {
  return (
    <div className={`relative ${className}`} style={{ perspective: 800, transformStyle: 'preserve-3d' }}>
      <motion.div
        className="pb-cut relative origin-bottom"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={
          reducedMotion
            ? { opacity: 1 }
            : {
                rotateX: active ? 0 : -75,
                translateZ: active ? 30 : 0,
                rotate: active ? tilt : 0,
                opacity: active ? 1 : 0.6,
              }
        }
        transition={{ type: 'spring', stiffness: 90, damping: 14, delay: active ? 0.45 : 0 }}
      >
        <div className="rounded-[45%_55%_40%_60%/55%_45%_55%_45%] border-4 border-[#fbf5e4] bg-[#fbf5e4] p-1">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="aspect-square w-full rounded-[45%_55%_40%_60%/55%_45%_55%_45%] object-cover"
          />
        </div>
        {children}
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute -bottom-1 left-[12%] right-[12%] h-2 rounded-full bg-[#3b2612]/30 blur-[3px]"
      />
    </div>
  );
}
