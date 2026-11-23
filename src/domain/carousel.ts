export const CAROUSEL_INTERVAL_MS = 4500;
export const SWIPE_THRESHOLD_PX = 40;

export interface AutoAdvanceState {
  readonly isPaused: boolean;
  readonly isHovered: boolean;
  readonly isFocused: boolean;
  readonly isLightboxOpen: boolean;
  readonly reducedMotion: boolean;
  readonly total: number;
}

export function clampSlideIndex(index: number, total: number): number {
  if (!Number.isFinite(total) || total <= 0) {
    return 0;
  }
  const safeIndex = Math.trunc(index);
  return Math.min(total - 1, Math.max(0, safeIndex));
}

export function getNextSlideIndex(current: number, total: number): number {
  if (!Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return (clampSlideIndex(current, total) + 1) % total;
}

export function getPrevSlideIndex(current: number, total: number): number {
  if (!Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return (clampSlideIndex(current, total) - 1 + total) % total;
}

export function resolveSwipeDirection(
  deltaX: number,
  threshold = SWIPE_THRESHOLD_PX,
): 'next' | 'prev' | null {
  if (!Number.isFinite(deltaX)) {
    return null;
  }
  if (deltaX <= -threshold) {
    return 'next';
  }
  if (deltaX >= threshold) {
    return 'prev';
  }
  return null;
}

export function shouldAutoAdvance(state: AutoAdvanceState): boolean {
  if (!Number.isFinite(state.total) || state.total <= 1) {
    return false;
  }
  return (
    !state.isPaused &&
    !state.isHovered &&
    !state.isFocused &&
    !state.isLightboxOpen &&
    !state.reducedMotion
  );
}
