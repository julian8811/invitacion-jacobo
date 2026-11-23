import { useState } from 'react';
import { Compass, MailOpen, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { fireSafeConfetti } from '../../utils/confetti';
import { playEnvelopeOpenChime, playJungleAmbienceBurst } from '../../utils/soundEffects';
import { REALISTIC_ANIMALS, SAFARI_SUNRISE_SRC } from '../assets';

interface SafariIntroProps {
  readonly config: EventConfig;
  readonly onOpen: (withSound: boolean) => void;
}

export function SafariIntro({ config, onOpen }: SafariIntroProps) {
  const [isOpening, setIsOpening] = useState(false);
  const mascot = REALISTIC_ANIMALS[0];

  const handleReveal = (withSound: boolean) => {
    if (isOpening) {
      return;
    }
    setIsOpening(true);
    playEnvelopeOpenChime(!withSound);
    if (withSound) {
      playJungleAmbienceBurst(false);
    }
    fireSafeConfetti({
      particleCount: 70,
      spread: 76,
      origin: { y: 0.58 },
      colors: ['#1B4332', '#235B8C', '#E09F24', '#4D8B55', '#0F766E', '#B4691E'],
    });
    window.setTimeout(() => onOpen(withSound), 480);
  };

  return (
    <section
      aria-label="Portada de la invitación safari"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,30,18,0.35), rgba(245,238,219,0.92)), url(${SAFARI_SUNRISE_SRC})`,
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        <p className="font-hand text-xl text-[#FFF8E8] drop-shadow sm:text-2xl">
          Amanecer en la sabana de Jacobo
        </p>

        <div
          className={`relative mx-auto mt-4 rounded-[2rem] border-2 border-[#8B6136] bg-[#FFFDF6]/95 px-5 pt-6 pb-6 shadow-2xl transition ${
            isOpening ? 'translate-y-[-8px] scale-[1.02]' : ''
          }`}
        >
          <div className="mx-auto mb-3 flex h-32 w-32 items-end justify-center overflow-hidden rounded-full border-4 border-[#1B4332]/20 bg-[#F5EEDB] shadow-lg sm:h-36 sm:w-36">
            <img src={mascot.src} alt={mascot.alt} className="h-[92%] w-auto object-contain" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#4E2E14] sm:text-4xl">
            {config.eventTitle}
          </h1>
          <p className="font-display text-2xl font-bold text-[#1B4332]">{config.honoree}</p>
          <p className="mt-2 text-sm font-bold text-[#3D240F]">
            {config.dateDisplay} · <span className="whitespace-nowrap">{config.timeDisplay}</span>
          </p>
          <p className="text-xs font-bold text-[#4E2E14]/90">
            {config.venueSpace} — {config.venueName}
          </p>

          <button
            type="button"
            aria-label="Abrir expedición con sonido"
            onClick={() => handleReveal(true)}
            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-5 py-3.5 text-base font-bold text-[#FFF9EE] shadow-md transition hover:bg-[#245842] active:translate-y-0.5"
          >
            <MailOpen className="h-5 w-5 text-[#FCE085]" aria-hidden="true" />
            <span>Abrir expedición</span>
            <Volume2 className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handleReveal(false)}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold text-[#3D240F]/85 underline decoration-[#3D240F]/45 underline-offset-2"
          >
            <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Entrar sin sonido</span>
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-[#6F4220]">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Toca a los animales al entrar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
