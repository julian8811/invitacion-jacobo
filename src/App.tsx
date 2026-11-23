import { useState } from 'react';
import { InvitationCardProposal } from './cards/InvitationCardProposal';
import { EVENT_CONFIG } from './config/event';
import { EXPLORER_THEME } from './proposals/themes';
import { SafariExperience } from './proposals/safari';

function isCardExportMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const params = new URLSearchParams(window.location.search);
  return params.has('exportCard');
}

export function App() {
  const [exportMode] = useState(isCardExportMode);
  const [isMuted, setIsMuted] = useState(false);

  if (exportMode) {
    return (
      <main className="m-0 bg-transparent p-0">
        <InvitationCardProposal config={EVENT_CONFIG} theme={EXPLORER_THEME} exportMode />
      </main>
    );
  }

  return (
    <SafariExperience
      config={EVENT_CONFIG}
      isMuted={isMuted}
      onMutedChange={setIsMuted}
    />
  );
}

export default App;
