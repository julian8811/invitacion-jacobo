import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import { JACOBO_MEMORIES, type JacoboMemory } from '../data/memories';
import {
  CAROUSEL_INTERVAL_MS,
  getNextSlideIndex,
  getPrevSlideIndex,
  resolveSwipeDirection,
  shouldAutoAdvance,
} from '../domain/carousel';
import { prefersReducedMotion } from '../utils/confetti';
import { SafariPortraitFrame } from './SafariPortraitFrame';

interface MemoriesCarouselSectionProps {
  readonly memories?: readonly JacoboMemory[];
}

export function MemoriesCarouselSection({
  memories = JACOBO_MEMORIES,
}: MemoriesCarouselSectionProps) {
  const total = memories.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(() => prefersReducedMotion());
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const reducedMotion = prefersReducedMotion();
  const activeMemory = memories[activeIndex] ?? memories[0];
  const autoAdvancing = shouldAutoAdvance({
    isPaused,
    isHovered,
    isFocused,
    isLightboxOpen,
    reducedMotion,
    total,
  });

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => getNextSlideIndex(prev, total));
  }, [total]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => getPrevSlideIndex(prev, total));
  }, [total]);

  useEffect(() => {
    if (!autoAdvancing) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => getNextSlideIndex(prev, total));
    }, CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoAdvancing, total]);

  // Preload upcoming chapter photo smoothly
  useEffect(() => {
    if (typeof Image === 'undefined' || total <= 1) {
      return;
    }
    const nextMemory = memories[getNextSlideIndex(activeIndex, total)];
    if (nextMemory) {
      const img = new Image();
      img.src = nextMemory.imageSrc;
    }
  }, [activeIndex, memories, total]);

  // Keep active thumbnail centered horizontally inside the strip WITHOUT hijacking window scroll
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || typeof strip.scrollTo !== 'function') {
      return;
    }
    const activeBtn = strip.children[activeIndex] as HTMLElement | undefined;
    if (!activeBtn) {
      return;
    }
    const targetLeft = activeBtn.offsetLeft - strip.clientWidth / 2 + activeBtn.clientWidth / 2;
    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }
    const onWindowKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', onWindowKeyDown);
    return () => window.removeEventListener('keydown', onWindowKeyDown);
  }, [isLightboxOpen, goToNext, goToPrev]);

  const handleRegionKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isLightboxOpen) {
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrev();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartXRef.current = null;
    if (startX === null || typeof endX !== 'number') {
      return;
    }
    const direction = resolveSwipeDirection(endX - startX);
    if (direction === 'next') {
      goToNext();
    } else if (direction === 'prev') {
      goToPrev();
    }
  };

  if (!activeMemory) {
    return null;
  }

  return (
    <section
      id="recuerdos"
      aria-labelledby="memories-heading"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={(event) => {
        try {
          if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) {
            setIsFocused(true);
          }
        } catch {
          // Ignore selector errors in constrained environments.
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
      onKeyDown={handleRegionKeyDown}
      className="px-4 py-6"
    >
      <div className="explorer-journal mx-auto max-w-3xl overflow-hidden rounded-[2.25rem] p-5 sm:p-8">
        <div className="text-center">
          <p className="font-hand text-xl text-[#1B4332]">Álbum de recuerdos</p>
          <h2 id="memories-heading" className="font-display text-2xl font-bold text-[#4E2E14] sm:text-3xl">
            Los primeros 11 meses de Jacobo
          </h2>
          <p className="mx-auto mt-1 max-w-xl text-sm font-semibold text-[#3D240F]/85">
            Desde el día que empezó todo hasta la antesala de su primer añito, enmarcado con sus amigos de la selva.
          </p>
        </div>

        {/* Main interactive framed stage */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="mt-6 grid items-center gap-6 md:grid-cols-[minmax(0,360px)_1fr]"
        >
          <div key={activeMemory.id} className="animate-memory-enter">
            <SafariPortraitFrame
              memory={activeMemory}
              index={activeIndex}
              total={total}
              onZoom={() => setIsLightboxOpen(true)}
            />
          </div>

          <div className="min-w-0 flex flex-col justify-between gap-4 text-center md:text-left">
            <div className="stitched-panel rounded-3xl p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="rounded-full bg-[#1B4332] px-3 py-0.5 text-[11px] font-extrabold tracking-wide text-[#FCE085] uppercase">
                  {activeMemory.chapterLabel}
                </span>
                <span className="rounded-full border border-[#8B6136]/40 bg-[#FAF3DF] px-3 py-0.5 text-[11px] font-bold text-[#4E2E14]">
                  Marco: {activeMemory.animalLabel}
                </span>
              </div>

              <h3 className="font-display mt-3 text-2xl font-extrabold text-[#4E2E14] sm:text-3xl">
                {activeMemory.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed font-semibold text-[#2F2012]/90 sm:text-base">
                {activeMemory.memoryText}
              </p>

              {/* Subtle 4.5s auto-play progress indicator */}
              <div
                aria-hidden="true"
                className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#8B6136]/20"
              >
                {autoAdvancing ? (
                  <div
                    key={`progress-${activeMemory.id}`}
                    className="animate-progress-fill h-full rounded-full bg-[#1B4332]"
                  />
                ) : (
                  <div className="h-full w-1/3 rounded-full bg-[#E09F24]/70" />
                )}
              </div>
            </div>

            {/* Playback and navigation controls */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 md:justify-start">
              <button
                type="button"
                aria-label="Recuerdo anterior"
                onClick={goToPrev}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-2xl border-2 border-[#6F4220]/35 bg-white px-2.5 py-2 text-xs font-extrabold text-[#3D240F] shadow-sm transition hover:bg-[#FFF9EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] sm:px-3"
              >
                <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                aria-pressed={isPaused}
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-3 py-2 text-xs font-extrabold text-white shadow transition hover:bg-[#245842] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] sm:px-3.5"
              >
                {isPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5 shrink-0 text-[#FCE085]" aria-hidden="true" />
                    <span>Reanudar</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5 shrink-0 text-[#FCE085]" aria-hidden="true" />
                    <span>Pausar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                aria-label="Siguiente recuerdo"
                onClick={goToNext}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-2xl border-2 border-[#6F4220]/35 bg-white px-2.5 py-2 text-xs font-extrabold text-[#3D240F] shadow-sm transition hover:bg-[#FFF9EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] sm:px-3"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Chronological chapter thumbnail strip */}
        <div className="mt-6">
          <div
            ref={stripRef}
            aria-label="Capítulos de los primeros once meses"
            className="memories-strip flex gap-2.5 overflow-x-auto px-1 pt-1 pb-2.5"
          >
            {memories.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Ver recuerdo: ${item.shortLabel}`}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex w-20 shrink-0 cursor-pointer flex-col items-center rounded-2xl border-2 p-1.5 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                    isSelected
                      ? 'border-[#1B4332] bg-[#1B4332] text-[#FCE085] shadow-md'
                      : 'border-[#8B6136]/35 bg-white text-[#3D240F] hover:border-[#6F4220] hover:bg-[#FAF3DF]'
                  }`}
                >
                  <img
                    src={item.imageSrc}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    style={{ objectPosition: item.objectPosition }}
                    className="h-16 w-full rounded-xl object-cover"
                  />
                  <span className="mt-1 line-clamp-1 text-[11px] font-extrabold leading-tight">
                    {item.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox modal for full portrait view */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeMemory.ageLabel}: ${activeMemory.title}`}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F261C]/85 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border-2 border-[#C7933B] bg-[#F5EEDB] p-5 text-center shadow-2xl"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#1B4332] px-3 py-1 text-xs font-extrabold text-[#FCE085]">
                {activeMemory.chapterLabel} · {activeMemory.ageLabel}
              </span>
              <button
                type="button"
                aria-label="Cerrar foto ampliada"
                onClick={() => setIsLightboxOpen(false)}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#6F4220]/35 bg-white text-[#3D240F] shadow-sm transition hover:bg-[#FAF3DF]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <SafariPortraitFrame
              memory={activeMemory}
              index={activeIndex}
              total={total}
              isLightbox
            />

            <h3 className="font-display mt-4 text-2xl font-extrabold text-[#4E2E14]">
              {activeMemory.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#2F2012]/90">
              {activeMemory.memoryText}
            </p>

            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={goToPrev}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border-2 border-[#6F4220]/35 bg-white px-4 py-2 text-xs font-extrabold text-[#3D240F] hover:bg-[#FAF3DF]"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span>Anterior</span>
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#245842]"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
