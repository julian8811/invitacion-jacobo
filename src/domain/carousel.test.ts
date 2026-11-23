import { describe, expect, it } from 'vitest';
import {
  CAROUSEL_INTERVAL_MS,
  clampSlideIndex,
  getNextSlideIndex,
  getPrevSlideIndex,
  resolveSwipeDirection,
  shouldAutoAdvance,
} from './carousel';

describe('carousel pure helpers', () => {
  it('wraps next and previous slide indices across 13 chapters safely', () => {
    expect(CAROUSEL_INTERVAL_MS).toBe(4500);
    expect(getNextSlideIndex(0, 13)).toBe(1);
    expect(getNextSlideIndex(12, 13)).toBe(0);
    expect(getNextSlideIndex(0, 0)).toBe(0);

    expect(getPrevSlideIndex(5, 13)).toBe(4);
    expect(getPrevSlideIndex(0, 13)).toBe(12);
    expect(getPrevSlideIndex(0, 0)).toBe(0);
  });

  it('clamps arbitrary indices within valid slide bounds', () => {
    expect(clampSlideIndex(-3, 13)).toBe(0);
    expect(clampSlideIndex(4, 13)).toBe(4);
    expect(clampSlideIndex(99, 13)).toBe(12);
    expect(clampSlideIndex(5, 0)).toBe(0);
  });

  it('resolves horizontal swipe gestures past the threshold', () => {
    expect(resolveSwipeDirection(-45)).toBe('next');
    expect(resolveSwipeDirection(60)).toBe('prev');
    expect(resolveSwipeDirection(-15)).toBeNull();
    expect(resolveSwipeDirection(20)).toBeNull();
  });

  it('only auto-advances when unpaused, unfocused, unhovered, lightbox closed, and motion allowed', () => {
    expect(
      shouldAutoAdvance({
        isPaused: false,
        isHovered: false,
        isFocused: false,
        isLightboxOpen: false,
        reducedMotion: false,
        total: 13,
      }),
    ).toBe(true);

    expect(
      shouldAutoAdvance({
        isPaused: true,
        isHovered: false,
        isFocused: false,
        isLightboxOpen: false,
        reducedMotion: false,
        total: 13,
      }),
    ).toBe(false);

    expect(
      shouldAutoAdvance({
        isPaused: false,
        isHovered: true,
        isFocused: false,
        isLightboxOpen: false,
        reducedMotion: false,
        total: 13,
      }),
    ).toBe(false);

    expect(
      shouldAutoAdvance({
        isPaused: false,
        isHovered: false,
        isFocused: true,
        isLightboxOpen: false,
        reducedMotion: false,
        total: 13,
      }),
    ).toBe(false);

    expect(
      shouldAutoAdvance({
        isPaused: false,
        isHovered: false,
        isFocused: false,
        isLightboxOpen: true,
        reducedMotion: false,
        total: 13,
      }),
    ).toBe(false);

    expect(
      shouldAutoAdvance({
        isPaused: false,
        isHovered: false,
        isFocused: false,
        isLightboxOpen: false,
        reducedMotion: true,
        total: 13,
      }),
    ).toBe(false);

    expect(
      shouldAutoAdvance({
        isPaused: false,
        isHovered: false,
        isFocused: false,
        isLightboxOpen: false,
        reducedMotion: false,
        total: 1,
      }),
    ).toBe(false);
  });
});
