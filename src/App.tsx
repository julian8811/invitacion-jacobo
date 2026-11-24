import { useState } from 'react';
import { InvitationCardProposal } from './cards/InvitationCardProposal';
import { EVENT_CONFIG } from './config/event';
import { SafariExperience } from './proposals/safari';

type ExportVariant = 'whatsapp' | 'og' | 'pre';

function readExportVariant(): ExportVariant | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  if (!params.has('exportCard')) {
    return null;
  }
  const value = params.get('exportCard');
  if (value === 'og' || value === 'pre') {
    return value;
  }
  return 'whatsapp';
}

export function App() {
  const [exportVariant] = useState(readExportVariant);
  const [isMuted, setIsMuted] = useState(false);

  if (exportVariant) {
    const isOg = exportVariant === 'og';
    return (
      <main
        className="m-0 bg-transparent p-0"
        style={
          isOg
            ? { width: 1200, height: 630, overflow: 'hidden' }
            : { width: 1080, height: 1350, overflow: 'hidden' }
        }
      >
        <InvitationCardProposal
          config={EVENT_CONFIG}
          exportMode
          variant={exportVariant}
        />
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
