import { useState } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { FootprintCountdown } from './FootprintCountdown';
import { PassportRsvp } from './PassportRsvp';
import { PolaroidMemories } from './PolaroidMemories';
import { SafariHero } from './SafariHero';
import { SafariIntro } from './SafariIntro';
import { ScrollMap } from './ScrollMap';

export interface SafariExperienceProps {
  readonly config: EventConfig;
  readonly isMuted: boolean;
  readonly onMutedChange: (muted: boolean) => void;
}

export function SafariExperience({
  config,
  isMuted,
  onMutedChange,
}: SafariExperienceProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [replaySignal, setReplaySignal] = useState(0);

  if (!isOpened) {
    return (
      <div className="theme-safari min-h-screen">
        <SafariIntro
          config={config}
          onOpen={(withSound) => {
            onMutedChange(!withSound);
            setIsOpened(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="theme-safari relative min-h-screen">
      <main>
        <SafariHero
          config={config}
          isMuted={isMuted}
          onToggleMute={() => onMutedChange(!isMuted)}
          replaySignal={replaySignal}
        />
        <FootprintCountdown config={config} />
        <PolaroidMemories />
        <ScrollMap config={config} />
        <PassportRsvp config={config} isMuted={isMuted} />
      </main>

      <footer className="px-4 pb-28 text-center text-xs font-bold">
        <p className="font-hand text-lg text-[#1B4332]">
          Con mucho cariño, te esperamos en el primer añito de {config.honoree}.
        </p>
      </footer>

      <div className="fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-[#6F4220]/30 bg-[#FFFDF6]/92 px-2 py-2 shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => onMutedChange(!isMuted)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#1B4332] px-3 py-2 text-xs font-bold text-white"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? (
            <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{isMuted ? 'Silencio' : 'Sonido'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setReplaySignal((prev) => prev + 1);
            document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#F5EEDB] px-3 py-2 text-xs font-bold text-[#3D240F]"
          aria-label="Repetir video"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Video</span>
        </button>
      </div>
    </div>
  );
}
