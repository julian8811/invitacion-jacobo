import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, MailOpen, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../config/event';

interface EnvelopeIntroProps {
  readonly config: EventConfig;
  readonly onOpen: (withSound: boolean) => void;
}

function fireIntroConfetti(): void {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  try {
    confetti({
      particleCount: 65,
      spread: 72,
      origin: { y: 0.6 },
      colors: ['#F4B942', '#F07167', '#7CC0E5', '#8FD4AE', '#FCE085'],
    });
  } catch {
    // Canvas confetti is non-critical visual flourish; ignore unsupported headless environments.
  }
}

export function EnvelopeIntro({ config, onOpen }: EnvelopeIntroProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleReveal = (withSound: boolean) => {
    if (isOpening) {
      return;
    }
    setIsOpening(true);
    fireIntroConfetti();

    window.setTimeout(() => {
      onOpen(withSound);
    }, 320);
  };

  return (
    <section
      aria-label="Portada de la invitación"
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8 ${
        isOpening ? 'animate-envelope-exit' : ''
      }`}
    >
      {/* Warm fairy string lights garland along the top */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-around px-4 pt-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <span
            key={idx}
            className="animate-twinkle h-3 w-3 rounded-full bg-[#FCE085]"
            style={{ animationDelay: `${idx * 0.28}s` }}
          />
        ))}
      </div>

      {/* Subtle corner jungle framing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 h-48 w-48 rounded-full bg-[#8BB174]/25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-[#F4B942]/20 blur-2xl"
      />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#8BB174]/40 bg-white/85 px-4 py-1.5 text-xs font-extrabold tracking-wider text-[#244B32] uppercase shadow-sm backdrop-blur">
          <span>🦁 Safari de Cumpleaños · Año 1</span>
        </div>

        <div className="parchment-card overflow-hidden rounded-[2rem] p-5 sm:p-6">
          <div className="relative mx-auto mb-4 w-full max-w-[260px] overflow-hidden rounded-3xl border-4 border-[#FFF9EE] bg-[#FFF9EE] shadow-md">
            <img
              src="/images/baby-elephant-envelope.png"
              alt="Elefantito tierno sosteniendo un sobre de invitación sellado con un corazón rojo"
              className="animate-sway mx-auto aspect-square w-full object-cover"
            />
          </div>

          <p className="text-sm font-bold tracking-wide text-[#3F734D] uppercase">
            {config.introHeadline}
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-[#5C371B] sm:text-4xl">
            {config.eventTitle}
          </h1>
          <p className="font-display text-xl font-semibold text-[#3F734D]">
            {config.honoree}
          </p>

          {/* Tactile kraft envelope seal card */}
          <div className="kraft-envelope relative mx-auto mt-5 rounded-2xl p-4 text-[#4A2B13]">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#E63946] text-white shadow-md">
              <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold">
              {config.dateDisplay} · {config.timeDisplay}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-[#5C371B]/90">
              {config.venueSpace} — {config.venueName}
            </p>

            <button
              type="button"
              onClick={() => handleReveal(true)}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#244B32] px-5 py-3.5 text-base font-extrabold text-[#FFF9EE] shadow-lg transition hover:bg-[#1b3a26] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32]"
            >
              <MailOpen className="h-5 w-5" aria-hidden="true" />
              <span>Abrir invitación</span>
              <Volume2 className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleReveal(false)}
              className="mt-2.5 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold text-[#4A2B13]/85 underline decoration-[#4A2B13]/40 underline-offset-2 transition hover:text-[#2b2118] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C371B]"
            >
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Entrar sin sonido</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
