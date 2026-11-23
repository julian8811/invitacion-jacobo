import { useEffect, useState } from 'react';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';
import { InvitationCardProposal } from './cards/InvitationCardProposal';
import { CountdownSection } from './components/CountdownSection';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { FloatingToolbar } from './components/FloatingToolbar';
import { HeroVideoStage } from './components/HeroVideoStage';
import { InteractiveBalloons } from './components/InteractiveBalloons';
import { LocationSection } from './components/LocationSection';
import { RsvpSection } from './components/RsvpSection';
import { EVENT_CONFIG } from './config/event';
import {
  PROPOSAL_BY_ID,
  resolveProposalFromParam,
  resolveViewFromParam,
} from './proposals/themes';
import type { ProposalId, StudioView } from './proposals/types';
import { ProposalStudioBar } from './studio/ProposalStudioBar';

function readInitialStudioState(): {
  exportCard: ProposalId | null;
  proposal: ProposalId;
  view: StudioView;
  opened: boolean;
} {
  if (typeof window === 'undefined') {
    return { exportCard: null, proposal: 'explorador', view: 'pagina', opened: false };
  }
  const params = new URLSearchParams(window.location.search);
  const rawExport = params.get('exportCard');
  return {
    exportCard: rawExport ? resolveProposalFromParam(rawExport) : null,
    proposal: resolveProposalFromParam(params.get('propuesta')),
    view: resolveViewFromParam(params.get('vista')),
    opened: params.get('abierta') === '1',
  };
}

export function App() {
  const [initial] = useState(readInitialStudioState);
  const [activeProposal, setActiveProposal] = useState<ProposalId>(initial.proposal);
  const [activeView, setActiveView] = useState<StudioView>(initial.view);
  const [isOpened, setIsOpened] = useState<boolean>(initial.opened);
  const [isMuted, setIsMuted] = useState(false);
  const [replaySignal, setReplaySignal] = useState(0);

  const theme = PROPOSAL_BY_ID[activeProposal];

  useEffect(() => {
    if (initial.exportCard || typeof window === 'undefined') {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('propuesta', String(theme.number));
    url.searchParams.set('vista', activeView);
    url.searchParams.set('abierta', isOpened ? '1' : '0');
    window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
  }, [initial.exportCard, theme.number, activeView, isOpened]);

  if (initial.exportCard) {
    const exportTheme = PROPOSAL_BY_ID[initial.exportCard];
    return (
      <main className="m-0 bg-transparent p-0">
        <InvitationCardProposal config={EVENT_CONFIG} theme={exportTheme} exportMode />
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

  const handleSelectProposal = (nextId: ProposalId) => {
    setActiveProposal(nextId);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const themeWrapperClass = `theme-${theme.id} min-h-screen`;
  const footerTextClass =
    theme.id === 'campamento' ? 'text-[#F5E6C4]/90' : 'text-[#1B4332]';

  return (
    <div className={themeWrapperClass}>
      <ProposalStudioBar
        activeProposal={activeProposal}
        activeView={activeView}
        isOpened={isOpened}
        onSelectProposal={handleSelectProposal}
        onSelectView={setActiveView}
        onToggleOpened={() => setIsOpened((prev) => !prev)}
      />

      {activeView === 'tarjeta' ? (
        <main className="px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1
              className={`font-display text-2xl font-extrabold sm:text-3xl ${
                theme.id === 'campamento' ? 'text-[#F6BD3A]' : 'text-[#1B4332]'
              }`}
            >
              {theme.name} — Tarjeta para WhatsApp
            </h1>
            <p
              className={`mt-1 text-sm font-bold ${
                theme.id === 'campamento' ? 'text-[#D6EADF]' : 'text-[#3D240F]/85'
              }`}
            >
              {theme.tagline}
            </p>
          </div>

          <div className="mt-6">
            <InvitationCardProposal config={EVENT_CONFIG} theme={theme} />
          </div>

          <div className="mx-auto mt-6 max-w-xl rounded-3xl border-2 border-[#8B6136]/40 bg-[#FFFDF8] p-5 text-center text-[#261B10] shadow-lg">
            <p className="text-sm font-extrabold text-[#1B4332]">
              Opciones de envío por WhatsApp (botón directo a la invitación)
            </p>
            <p className="mt-1 text-xs font-semibold text-[#4E2E14]/90">
              En WhatsApp, el archivo PDF conserva el botón clicable para abrir la página directamente al tocarlo. La imagen JPG se envía junto al enlace de la invitación.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a
                href={theme.exportFiles.pdf}
                download
                className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#245842] sm:text-sm"
              >
                <FileText className="h-4 w-4 text-[#F6BD3A]" aria-hidden="true" />
                <span>Descargar PDF clicable</span>
                <Download className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
              </a>

              <a
                href={theme.exportFiles.jpg}
                download
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#2168B0]/45 bg-[#EAF4FC] px-4 py-2.5 text-xs font-bold text-[#154373] transition hover:bg-[#d8ecfb] sm:text-sm"
              >
                <ImageIcon className="h-4 w-4" aria-hidden="true" />
                <span>Descargar imagen JPG</span>
                <Download className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
              </a>
            </div>
          </div>
        </main>
      ) : !isOpened ? (
        <main>
          <EnvelopeIntro config={EVENT_CONFIG} theme={theme} onOpen={handleOpenInvitation} />
        </main>
      ) : (
        <div className="relative">
          <InteractiveBalloons theme={theme} isMuted={isMuted} />

          <main>
            <HeroVideoStage
              config={EVENT_CONFIG}
              theme={theme}
              isMuted={isMuted}
              autoPlayOnMount
              replaySignal={replaySignal}
              onToggleMute={() => setIsMuted((prev) => !prev)}
            />

            <CountdownSection config={EVENT_CONFIG} theme={theme} />
            <LocationSection config={EVENT_CONFIG} theme={theme} />
            <RsvpSection config={EVENT_CONFIG} theme={theme} isMuted={isMuted} />
          </main>

          <footer className="px-4 pb-24 text-center text-xs font-bold">
            <p className={`font-hand text-lg ${footerTextClass}`}>
              Con mucho cariño, te esperamos en el primer añito de {EVENT_CONFIG.honoree}.
            </p>
          </footer>

          <FloatingToolbar
            theme={theme}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
            onReplayVideo={handleReplayVideo}
          />
        </div>
      )}
    </div>
  );
}

export default App;
