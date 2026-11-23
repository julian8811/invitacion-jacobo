import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface LeafProps {
  readonly index: number;
  readonly current: number;
  readonly total: number;
  readonly reducedMotion: boolean;
  readonly label: string;
  readonly children: ReactNode;
}

/**
 * One leaf of the book. Leaves before `current` are flipped to the left
 * (rotateY) with a CSS 3D perspective; leaves after remain stacked.
 */
export function Leaf({ index, current, total, reducedMotion, label, children }: LeafProps) {
  const flipped = index < current;
  const active = index === current;
  const near = Math.abs(index - current) <= 1;

  return (
    <motion.section
      aria-label={label}
      aria-hidden={!active}
      className="pb-leaf pb-leaf-edge pb-paper absolute inset-0 overflow-hidden rounded-r-xl rounded-l-sm"
      style={{ zIndex: flipped ? index : total - index, pointerEvents: active ? 'auto' : 'none' }}
      initial={false}
      animate={
        reducedMotion
          ? { opacity: flipped || !near ? 0 : 1, rotateY: 0 }
          : { rotateY: flipped ? -172 : 0, opacity: near || active ? 1 : 0 }
      }
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : { rotateY: { duration: 0.85, ease: [0.45, 0.05, 0.25, 1] }, opacity: { duration: 0.2, delay: flipped ? 0.7 : 0 } }
      }
    >
      <div className="pb-gutter pointer-events-none absolute inset-y-0 left-0 z-10 w-5" aria-hidden="true" />
      <div className="relative h-full overflow-y-auto overflow-x-hidden px-6 pb-8 pt-6 sm:px-9">
        {children}
      </div>
      <span className="absolute bottom-2 right-4 z-10 text-xs text-[#8a6a3b]">
        {index + 1} / {total}
      </span>
    </motion.section>
  );
}
