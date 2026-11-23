import { useState } from 'react';
import { Compass, MailOpen, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { EXPLORER_THEME } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';
import { fireSafeConfetti } from '../utils/confetti';
import { playEnvelopeOpenChime } from '../utils/soundEffects';

interface EnvelopeIntroProps {
  readonly config: EventConfig;
  readonly theme?: ProposalTheme;
  readonly onOpen: (withSound: boolean) => void;
}

export function EnvelopeIntro({
  config,
  theme = EXPLORER_THEME,
  onOpen,
}: EnvelopeIntroProps) {
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
      colors: [...theme.confettiColors],
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
      <div className="relative z-10 w-full max-w-md text-center">
        <p className="font-hand text-xl text-[#1B4332] sm:text-2xl">{theme.copy.introEyebrow}</p>

        <div
          className={`envelope-letter-rise relative mx-auto mt-3 -mb-7 w-[92%] rounded-t-[1.75rem] border-2 border-[#8B6136] bg-[#FFFDF6] px-5 pt-5 pb-10 shadow-md ${
            isOpening ? 'envelope-letter-rise-open' : ''
          }`}
        >
          <div
            aria-hidden="true"
            className="absolute top-3 right-3 rotate-6 rounded-full border-2 border-dashed border-[#235B8C]/60 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-[#235B8C]"
          >
            13 DIC · 3 PM
          </div>

          <div className="cameo-circle mx-auto mb-3 h-32 w-32 overflow-hidden rounded-full border-[#1B4332]/25 sm:h-36 sm:w-36">
            <img
              src={theme.assets.introMascot}
              alt={theme.assets.mascotAlt}
              className="animate-sway h-full w-full object-cover"
            />
          </div>

          <h1 className="font-display text-3xl font-extrabold text-[#4E2E14] sm:text-4xl">
            {config.eventTitle}
          </h1>
          <p className="font-display -mt-0.5 text-2xl font-bold text-[#1B4332]">
            {config.honoree}
          </p>
        </div>

        <div className="kraft-envelope-body relative mx-auto overflow-visible rounded-3xl px-5 pt-14 pb-6 text-[#3D240F]">
          <div
            aria-hidden="true"
            className={`envelope-flap pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden rounded-t-3xl ${
              isOpening ? 'envelope-flap-open' : ''
            }`}
          >
            <svg viewBox="0 0 400 92" className="block h-20 w-full" preserveAspectRatio="none">
              <path
                d="M0 0 H400 L212 80 Q200 86 188 80 Z"
                fill="#C99B62"
                stroke="#8A5A2C"
                strokeWidth="3"
              />
            </svg>
          </div>

          <button
            type="button"
            aria-label="Sello de brújula para abrir la invitación"
            onClick={() => handleReveal(true)}
            className="relative z-20 mx-auto -mt-12 mb-3 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-4 border-[#FCE085] bg-[#235B8C] text-[#FCE085] shadow-lg transition hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
          >
            <Compass className="h-5 w-5" aria-hidden="true" />
          </button>

          <p className="text-sm font-extrabold text-[#3D240F]">
            {config.dateDisplay} · <span className="whitespace-nowrap">{config.timeDisplay}</span>
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#4E2E14]/90">
            {config.venueSpace} — {config.venueName}
          </p>

          <button
            type="button"
            onClick={() => handleReveal(true)}
            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-5 py-3.5 text-base font-bold text-[#FFF9EE] shadow-md transition hover:bg-[#245842] active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
          >
            <MailOpen className="h-5 w-5 text-[#FCE085]" aria-hidden="true" />
            <span>{theme.copy.introCta}</span>
            <Volume2 className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleReveal(false)}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold text-[#3D240F]/85 underline decoration-[#3D240F]/45 underline-offset-2 transition hover:text-[#1B4332]"
          >
            <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Entrar sin sonido</span>
          </button>
        </div>
      </div>
    </section>
  );
}
