import confetti, { type Options } from 'canvas-confetti';

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Triggers non-blocking canvas confetti unless the user prefers reduced motion.
 */
export function fireSafeConfetti(options: Options): void {
  if (prefersReducedMotion()) {
    return;
  }
  try {
    confetti(options);
  } catch {
    // Canvas confetti is purely decorative; ignore headless/unsupported contexts.
  }
}
