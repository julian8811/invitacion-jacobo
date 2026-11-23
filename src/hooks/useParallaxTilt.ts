import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface TiltState {
  readonly x: number;
  readonly y: number;
}

const EMPTY: TiltState = { x: 0, y: 0 };

/**
 * Combines pointer/touch position with optional device orientation for subtle parallax.
 */
export function useParallaxTilt(enabled = true): TiltState {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState<TiltState>(EMPTY);

  useEffect(() => {
    if (!enabled || reducedMotion || typeof window === 'undefined') {
      setTilt(EMPTY);
      return;
    }

    const onPointer = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      setTilt({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) });
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      setTilt({
        x: Math.max(-1, Math.min(1, gamma / 30)),
        y: Math.max(-1, Math.min(1, (beta - 45) / 30)),
      });
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('deviceorientation', onOrientation);

    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onOrientation);
    };
  }, [enabled, reducedMotion]);

  return tilt;
}
