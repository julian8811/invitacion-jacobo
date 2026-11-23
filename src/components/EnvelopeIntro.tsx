import { useState } from 'react';
import { Compass, Flame, MailOpen, Sparkles, Tent, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { PROPOSAL_BY_ID } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';
import { fireSafeConfetti } from '../utils/confetti';
import { playEnvelopeOpenChime } from '../utils/soundEffects';

interface EnvelopeIntroProps {
  readonly config: EventConfig;
  readonly theme?: ProposalTheme;
  readonly onOpen: (withSound: boolean) => void;
}

const SELVA_FLAGS = ['#2168B0', '#F5A623', '#0E8FA3', '#1E7E45', '#2168B0', '#F5A623', '#0E8FA3'];

export function EnvelopeIntro({
  config,
  theme = PROPOSAL_BY_ID.explorador,
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

  if (theme.id === 'selva-viva') {
    return (
      <section
        aria-label="Portada de la invitación"
        className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center overflow-hidden px-4 py-8"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-5 flex justify-between px-6 opacity-85">
          <svg className="animate-cloud h-12 w-28 text-white drop-shadow-sm" viewBox="0 0 120 52" fill="currentColor">
            <path d="M24 44h68a14 14 0 0 0 2-27.8A20 20 0 0 0 56 8a18 18 0 0 0-32 9.4A13 13 0 0 0 24 44Z" />
          </svg>
          <svg
            className="animate-cloud h-10 w-24 text-white drop-shadow-sm"
            style={{ animationDelay: '1.6s' }}
            viewBox="0 0 120 52"
            fill="currentColor"
          >
            <path d="M24 44h68a14 14 0 0 0 2-27.8A20 20 0 0 0 56 8a18 18 0 0 0-32 9.4A13 13 0 0 0 24 44Z" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          {/* Playful boy-jungle pennant garland */}
          <div aria-hidden="true" className="mb-3 flex justify-center gap-2">
            {SELVA_FLAGS.map((color, idx) => (
              <span
                key={idx}
                className="block h-0 w-0 border-x-[10px] border-t-[16px] border-x-transparent drop-shadow-sm"
                style={{
                  borderTopColor: color,
                  transform: `translateY(${Math.round(Math.sin((idx / (SELVA_FLAGS.length - 1)) * Math.PI) * 5)}px)`,
                }}
              />
            ))}
          </div>

          <div
            className={`selva-treehouse-card relative overflow-hidden rounded-[2rem] px-5 pt-6 pb-6 transition duration-500 ${
              isOpening ? 'scale-[1.02] -translate-y-2' : ''
            }`}
          >
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-[#2168B0] px-3.5 py-1 text-xs font-extrabold tracking-wide text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#FFE066]" aria-hidden="true" />
              <span>{theme.copy.introEyebrow}</span>
            </div>

            <div className="mx-auto mt-4 h-36 w-36 overflow-hidden rounded-full border-4 border-[#2168B0] bg-[#EAF7FF] shadow-lg sm:h-40 sm:w-40">
              <img
                src={theme.assets.introMascot}
                alt={theme.assets.mascotAlt}
                className="animate-sway h-full w-full scale-[1.04] object-cover"
              />
            </div>

            <h1 className="font-display mt-3 text-3xl font-extrabold text-[#1E7E45] sm:text-4xl">
              {config.eventTitle}
            </h1>
            <p className="font-display -mt-0.5 text-2xl font-bold text-[#2168B0]">
              {config.honoree}
            </p>
            <p className="mt-1 text-sm font-bold text-[#163322]/85">{config.introHeadline}</p>

            <div className="mt-4 rounded-2xl border-2 border-[#7C4A21]/25 bg-[#F7FBF3] px-4 py-3 text-[#163322]">
              <p className="text-sm font-extrabold text-[#1E7E45]">
                {config.dateDisplay} · <span className="whitespace-nowrap">{config.timeDisplay}</span>
              </p>
              <p className="mt-0.5 text-xs font-bold text-[#7C4A21]">
                {config.venueSpace} — {config.venueName}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleReveal(true)}
              className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-b-4 border-[#114D2A] bg-[#1E7E45] px-5 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:bg-[#249251] active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2168B0]"
            >
              <MailOpen className="h-5 w-5 text-[#FFE066]" aria-hidden="true" />
              <span>{theme.copy.introCta}</span>
              <Volume2 className="h-4 w-4 text-[#FFE066]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleReveal(false)}
              className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold text-[#2168B0] underline decoration-[#2168B0]/45 underline-offset-2 transition hover:text-[#154578]"
            >
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Entrar sin sonido</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (theme.id === 'campamento') {
    return (
      <section
        aria-label="Portada de la invitación"
        className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center overflow-hidden px-4 py-8"
      >
        <div className="relative z-10 w-full max-w-md text-center">
          {/* Glowing golden string lanterns above the camp portal */}
          <svg aria-hidden="true" viewBox="0 0 320 42" className="mx-auto mb-1 h-10 w-full max-w-xs" fill="none">
            <path d="M8 8 Q160 36 312 8" stroke="#D7A645" strokeWidth="2" strokeOpacity="0.7" />
            {[28, 72, 116, 160, 204, 248, 292].map((cx, i) => (
              <g key={cx} className="animate-firefly" style={{ animationDelay: `${i * 0.3}s` }}>
                <circle cx={cx} cy={i === 3 ? 22 : i === 2 || i === 4 ? 20 : 16} r="6.5" fill="#F6BD3A" />
                <circle cx={cx} cy={i === 3 ? 22 : i === 2 || i === 4 ? 20 : 16} r="12" fill="#F6BD3A" fillOpacity="0.22" />
              </g>
            ))}
          </svg>

          <div
            className={`relative overflow-hidden rounded-[2rem] border-[3px] border-[#D7A645] bg-gradient-to-b from-[#174032] via-[#133529] to-[#0D261E] px-5 pt-6 pb-6 text-[#FDF7E6] shadow-2xl transition duration-500 ${
              isOpening ? 'scale-[1.02] -translate-y-2' : ''
            }`}
          >
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[#D7A645]/60 bg-[#0D261E]/85 px-3.5 py-1 text-xs font-extrabold tracking-wide text-[#F6BD3A]">
              <Tent className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{theme.copy.introEyebrow}</span>
            </p>

            <div className="mx-auto mt-4 h-36 w-36 overflow-hidden rounded-full border-4 border-[#F6BD3A] bg-[#14362B] shadow-[0_0_25px_rgba(246,189,58,0.28)] sm:h-40 sm:w-40">
              <img
                src={theme.assets.introMascot}
                alt={theme.assets.mascotAlt}
                className="animate-sway h-full w-full scale-[1.06] object-cover"
              />
            </div>

            <h1 className="font-display mt-3 text-3xl font-extrabold text-[#F6BD3A] sm:text-4xl">
              {config.eventTitle}
            </h1>
            <p className="font-display -mt-0.5 text-2xl font-bold text-[#FFFDF6]">
              {config.honoree}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#D6EADF]">{config.introHeadline}</p>

            <div className="mt-4 rounded-2xl border border-[#D7A645]/60 bg-[#FCF6E8] px-4 py-3 text-[#143125] shadow-inner">
              <p className="text-sm font-extrabold">
                {config.dateDisplay} · <span className="whitespace-nowrap">{config.timeDisplay}</span>
              </p>
              <p className="mt-0.5 text-xs font-bold text-[#8B5223]">
                {config.venueSpace} — {config.venueName}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleReveal(true)}
              className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-b-4 border-[#9F6F0D] bg-[#F6BD3A] px-5 py-3.5 text-base font-extrabold text-[#112A20] shadow-lg transition hover:bg-[#f9cb5b] active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6BD3A]"
            >
              <Flame className="h-5 w-5 text-[#112A20]" aria-hidden="true" />
              <span>{theme.copy.introCta}</span>
              <Volume2 className="h-4 w-4 text-[#112A20]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => handleReveal(false)}
              className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold text-[#F5E6C4]/90 underline decoration-[#D7A645]/50 underline-offset-2 transition hover:text-[#F6BD3A]"
            >
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Entrar sin sonido</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Default: Proposal 1 — Pequeño Explorador (Kraft Expedition Passport + Brass Compass Seal)
  return (
    <section
      aria-label="Portada de la invitación"
      className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center overflow-hidden px-4 py-8"
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

          {/* Brass explorer compass seal instead of red/pink heart */}
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
