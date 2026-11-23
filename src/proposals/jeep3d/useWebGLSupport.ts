import { useEffect, useState } from 'react';

export interface WebGLSupportInfo {
  readonly webgl: boolean;
  readonly reducedMotion: boolean;
  readonly lowMemory: boolean;
  readonly useFallback: boolean;
}

export function detectWebGL(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

function detectReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function detectLowMemory(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return typeof memory === 'number' && memory <= 2;
}

function compute(): WebGLSupportInfo {
  const webgl = detectWebGL();
  const reducedMotion = detectReducedMotion();
  const lowMemory = detectLowMemory();
  return { webgl, reducedMotion, lowMemory, useFallback: !webgl || reducedMotion || lowMemory };
}

export function useWebGLSupport(): WebGLSupportInfo {
  const [info, setInfo] = useState<WebGLSupportInfo>(compute);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setInfo(compute());
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return info;
}
