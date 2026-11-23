import { useState } from 'react';
import { BirthdayCakeGame } from './components/BirthdayCakeGame';
import { CountdownSection } from './components/CountdownSection';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { FloatingToolbar } from './components/FloatingToolbar';
import { HeroVideoStage } from './components/HeroVideoStage';
import { InteractiveBalloons } from './components/InteractiveBalloons';
import { LocationSection } from './components/LocationSection';
import { RsvpSection } from './components/RsvpSection';
import { SafariFriendsPlayground } from './components/SafariFriendsPlayground';
import { WhatsAppCardSection } from './components/WhatsAppCardSection';
import { EVENT_CONFIG } from './config/event';

export function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replaySignal, setReplaySignal] = useState(0);

  const handleOpenInvitation = (withSound: boolean) => {
    setIsMuted(!withSound);
    setIsOpened(true);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReplayVideo = () => {
    setReplaySignal((prev) => prev + 1);
    const topEl = document.getElementById('inicio');
    if (topEl && typeof topEl.scrollIntoView === 'function') {
      topEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpened) {
    return (
      <main>
        <EnvelopeIntro config={EVENT_CONFIG} onOpen={handleOpenInvitation} />
      </main>
    );
  }

  return (
    <div className="relative min-h-screen">
      <InteractiveBalloons isMuted={isMuted} />

      <main>
        <HeroVideoStage
          config={EVENT_CONFIG}
          isMuted={isMuted}
          autoPlayOnMount
          replaySignal={replaySignal}
          onToggleMute={() => setIsMuted((prev) => !prev)}
        />

        {/* Soft rolling meadow band for interactive storybook sections */}
        <div className="relative bg-gradient-to-b from-transparent via-[#EAF2E2]/55 to-transparent py-2">
          <SafariFriendsPlayground isMuted={isMuted} />
          <BirthdayCakeGame isMuted={isMuted} />
        </div>

        <CountdownSection config={EVENT_CONFIG} />
        <LocationSection config={EVENT_CONFIG} />
        <RsvpSection config={EVENT_CONFIG} isMuted={isMuted} />
        <WhatsAppCardSection config={EVENT_CONFIG} />
      </main>

      <footer className="px-4 pb-24 text-center text-xs font-bold text-[#5C371B]/80">
        <p className="font-hand text-lg text-[#3F734D]">
          Con mucho cariño, te esperamos en el primer añito de {EVENT_CONFIG.honoree}.
        </p>
      </footer>

      <FloatingToolbar
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onReplayVideo={handleReplayVideo}
      />
    </div>
  );
}

export default App;
