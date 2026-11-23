import { lazy, Suspense, useCallback, useState } from 'react';
import { InvitationCardProposal } from './cards/InvitationCardProposal';
import { ProposalPicker } from './components/ProposalPicker';
import { EVENT_CONFIG } from './config/event';
import { EXPLORER_THEME } from './proposals/themes';
import {
  DEFAULT_PROPOSAL_ID,
  readProposalFromLocation,
  writeProposalToLocation,
  type ProposalId,
} from './proposals/proposalId';
import { SafariExperience } from './proposals/safari';

const PopupBookExperience = lazy(async () => {
  const mod = await import('./proposals/popup-book');
  return { default: mod.PopupBookExperience };
});

const JeepExpeditionExperience = lazy(async () => {
  const mod = await import('./proposals/jeep3d');
  return { default: mod.JeepExpeditionExperience };
});

function isCardExportMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const params = new URLSearchParams(window.location.search);
  return params.has('exportCard');
}

function ProposalFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5EEDB] px-4 text-center">
      <p className="font-display text-xl font-bold text-[#3D240F]">Preparando la expedición...</p>
    </div>
  );
}

export function App() {
  const [exportMode] = useState(isCardExportMode);
  const [proposalId, setProposalId] = useState<ProposalId>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_PROPOSAL_ID;
    }
    return readProposalFromLocation();
  });
  const [isMuted, setIsMuted] = useState(false);

  const handleSelectProposal = useCallback((id: ProposalId) => {
    setProposalId(id);
    writeProposalToLocation(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (exportMode) {
    return (
      <main className="m-0 bg-transparent p-0">
        <InvitationCardProposal config={EVENT_CONFIG} theme={EXPLORER_THEME} exportMode />
      </main>
    );
  }

  return (
    <>
      {proposalId === 1 && (
        <SafariExperience
          config={EVENT_CONFIG}
          isMuted={isMuted}
          onMutedChange={setIsMuted}
        />
      )}

      {proposalId === 2 && (
        <Suspense fallback={<ProposalFallback />}>
          <PopupBookExperience
            config={EVENT_CONFIG}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
          />
        </Suspense>
      )}

      {proposalId === 3 && (
        <Suspense fallback={<ProposalFallback />}>
          <JeepExpeditionExperience
            config={EVENT_CONFIG}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
          />
        </Suspense>
      )}

      <ProposalPicker activeId={proposalId} onSelect={handleSelectProposal} />
    </>
  );
}

export default App;
