import { useState } from 'react';
import { InvitationCardProposal } from './cards/InvitationCardProposal';
import { CountdownSection } from './components/CountdownSection';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { FloatingToolbar } from './components/FloatingToolbar';
import { HeroVideoStage } from './components/HeroVideoStage';
import { InteractiveBalloons } from './components/InteractiveBalloons';
import { LocationSection } from './components/LocationSection';
import { RsvpSection } from './components/RsvpSection';
import { EVENT_CONFIG } from './config/event';
import { EXPLORER_THEME } from './proposals/themes';

function isCardExportMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const params = new URLSearchParams(window.location.search);
  return params.has('exportCard');
}

export function App() {
  const [exportMode] = useState(isCardExportMode);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replaySignal, setReplaySignal] = useState(0);

  if (exportMode) {
    return (
      <main className="m-0 bg-transparent p-0">
        <InvitationCardProposal config={EVENT_CONFIG} theme={EXPLORER_THEME} exportMode />
      </main>
    );
  }

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
      <div className="theme-explorador min-h-screen">
        <main>
          <EnvelopeIntro
            config={EVENT_CONFIG}
            theme={EXPLORER_THEME}
            onOpen={handleOpenInvitation}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="theme-explorador relative min-h-screen">
      <InteractiveBalloons theme={EXPLORER_THEME} isMuted={isMuted} />

      <main>
        <HeroVideoStage
          config={EVENT_CONFIG}
          theme={EXPLORER_THEME}
          isMuted={isMuted}
          autoPlayOnMount
          replaySignal={replaySignal}
          onToggleMute={() => setIsMuted((prev) => !prev)}
        />

        <CountdownSection config={EVENT_CONFIG} theme={EXPLORER_THEME} />
        <LocationSection config={EVENT_CONFIG} theme={EXPLORER_THEME} />
        <RsvpSection config={EVENT_CONFIG} theme={EXPLORER_THEME} isMuted={isMuted} />
      </main>

      <footer className="px-4 pb-24 text-center text-xs font-bold">
        <p className="font-hand text-lg text-[#1B4332]">
          Con mucho cariño, te esperamos en el primer añito de {EVENT_CONFIG.honoree}.
        </p>
      </footer>

      <FloatingToolbar
        theme={EXPLORER_THEME}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onReplayVideo={handleReplayVideo}
      />
    </div>
  );
}

export default App;
