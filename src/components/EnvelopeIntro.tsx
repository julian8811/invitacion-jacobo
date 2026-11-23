import { useState } from 'react';
import { Heart, MailOpen, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { fireSafeConfetti } from '../utils/confetti';
import { playEnvelopeOpenChime } from '../utils/soundEffects';

interface EnvelopeIntroProps {
  readonly config: EventConfig;
  readonly onOpen: (withSound: boolean) => void;
}

export function EnvelopeIntro({ config, onOpen }: EnvelopeIntroProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleReveal = (withSound: boolean) => {
    if (isOpening) {
      return;
    }
    setIsOpening(true);
    playEnvelopeOpenChime(!withSound);
    fireSafeConfetti({
      particleCount: 70,
      spread: 76,
      origin: { y: 0.58 },
      colors: ['#F4B942', '#F07167', '#6EB5DC', '#6EC498', '#FCE085'],
    });

    window.setTimeout(() => {
      onOpen(withSound);
    }, 460);
  };

  return (
    <section
      aria-label="Portada de la invitación"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8"
    >
      {/* Soft clouds in sunlit sky */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 flex justify-between px-6 opacity-80">
        <svg className="animate-cloud h-12 w-28 text-white drop-shadow-sm" viewBox="0 0 120 52" fill="currentColor">
          <path d="M24 44h68a14 14 0 0 0 2-27.8A20 20 0 0 0 56 8a18 18 0 0 0-32 9.4A13 13 0 0 0 24 44Z" />
        </svg>
        <svg className="animate-cloud h-10 w-24 text-white drop-shadow-sm" style={{ animationDelay: '1.8s' }} viewBox="0 0 120 52" fill="currentColor">
          <path d="M24 44h68a14 14 0 0 0 2-27.8A20 20 0 0 0 56 8a18 18 0 0 0-32 9.4A13 13 0 0 0 24 44Z" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <p className="font-hand text-xl text-[#3F734D] sm:text-2xl">
          {config.introHeadline}
        </p>

        {/* Peeking storybook elephant + sliding inner invitation letter */}
        <div
          className={`envelope-letter-rise relative mx-auto mt-3 -mb-7 w-[90%] rounded-t-[1.75rem] border-2 border-[#dfc79e] bg-[#FFFDF8] px-5 pt-5 pb-10 shadow-md ${
            isOpening ? 'envelope-letter-rise-open' : ''
          }`}
        >
          {/* Decorative postmark stamp */}
          <div
            aria-hidden="true"
            className="absolute top-3 right-3 rotate-6 rounded-full border-2 border-dashed border-[#C77D4E]/55 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#965A34]"
          >
            13 DIC · 3 PM
          </div>

          <div className="cameo-circle mx-auto mb-3 h-32 w-32 overflow-hidden rounded-full sm:h-36 sm:w-36">
            <img
              src="/images/baby-elephant-envelope.png"
              alt="Elefantito sonriente sosteniendo la carta de invitación de Jacobo"
              className="animate-sway h-full w-full object-cover"
            />
          </div>

          <h1 className="font-display text-3xl font-extrabold text-[#5C371B] sm:text-4xl">
            {config.eventTitle}
          </h1>
          <p className="font-display -mt-0.5 text-2xl font-bold text-[#3F734D]">
            {config.honoree}
          </p>
        </div>

        {/* Folded Kraft Envelope Body with 3D SVG Flap & Wax Heart Seal */}
        <div className="kraft-envelope-body relative mx-auto overflow-visible rounded-3xl px-5 pt-14 pb-6 text-[#4A2B13]">
          {/* Hinged triangular envelope flap */}
          <div
            aria-hidden="true"
            className={`envelope-flap pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden rounded-t-3xl ${
              isOpening ? 'envelope-flap-open' : ''
            }`}
          >
            <svg viewBox="0 0 400 92" className="block h-20 w-full" preserveAspectRatio="none">
              <path
                d="M0 0 H400 L212 80 Q200 86 188 80 Z"
                fill="#CE9D64"
                stroke="#966334"
                strokeWidth="3"
              />
            </svg>
          </div>

          {/* Interactive red wax seal right at flap tip */}
          <button
            type="button"
            aria-label="Sello de corazón para abrir el sobre"
            onClick={() => handleReveal(true)}
            className="relative z-20 mx-auto -mt-12 mb-3 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-4 border-[#F9D5D3] bg-[#D94A44] text-white shadow-lg transition hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32]"
          >
            <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
          </button>

          <p className="text-sm font-bold text-[#4A2B13]">
            {config.dateDisplay} · {config.timeDisplay}
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#5C371B]/90">
            {config.venueSpace} — {config.venueName}
          </p>

          <button
            type="button"
            onClick={() => handleReveal(true)}
            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-b-4 border-[#183522] bg-[#244B32] px-5 py-3.5 text-base font-bold text-[#FFF9EE] shadow-md transition hover:bg-[#2d5d3e] active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32]"
          >
            <MailOpen className="h-5 w-5 text-[#FCE085]" aria-hidden="true" />
            <span>Abrir invitación</span>
            <Volume2 className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleReveal(false)}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold text-[#4A2B13]/85 underline decoration-[#4A2B13]/40 underline-offset-2 transition hover:text-[#2b2118] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C371B]"
          >
            <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Entrar sin sonido</span>
          </button>
        </div>
      </div>
    </section>
  );
}
