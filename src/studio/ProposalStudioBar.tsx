import { Eye, Layout, MailOpen, CreditCard } from 'lucide-react';
import { PROPOSALS } from '../proposals/themes';
import type { ProposalId, StudioView } from '../proposals/types';

interface ProposalStudioBarProps {
  readonly activeProposal: ProposalId;
  readonly activeView: StudioView;
  readonly isOpened: boolean;
  readonly onSelectProposal: (id: ProposalId) => void;
  readonly onSelectView: (view: StudioView) => void;
  readonly onToggleOpened: () => void;
}

export function ProposalStudioBar({
  activeProposal,
  activeView,
  isOpened,
  onSelectProposal,
  onSelectView,
  onToggleOpened,
}: ProposalStudioBarProps) {
  return (
    <aside
      aria-label="Selector local de propuestas de diseño"
      className="sticky top-0 z-40 border-b border-[#1B4332]/20 bg-[#0F2A1F]/95 px-3 py-2.5 text-white shadow-lg backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide text-[#F6BD3A] uppercase">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Vista local</span>
          </span>

          {PROPOSALS.map((proposal) => {
            const isSelected = proposal.id === activeProposal;
            return (
              <button
                key={proposal.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectProposal(proposal.id)}
                className={`cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6BD3A] ${
                  isSelected
                    ? 'bg-[#F6BD3A] text-[#0F2A1F] shadow'
                    : 'bg-white/12 text-white/90 hover:bg-white/22'
                }`}
              >
                {proposal.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="inline-flex rounded-xl bg-white/10 p-0.5">
            <button
              type="button"
              aria-pressed={activeView === 'pagina'}
              onClick={() => onSelectView('pagina')}
              className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                activeView === 'pagina'
                  ? 'bg-white text-[#0F2A1F] shadow-sm'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <Layout className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Página</span>
            </button>

            <button
              type="button"
              aria-pressed={activeView === 'tarjeta'}
              onClick={() => onSelectView('tarjeta')}
              className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                activeView === 'tarjeta'
                  ? 'bg-white text-[#0F2A1F] shadow-sm'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tarjeta WhatsApp</span>
            </button>
          </div>

          {activeView === 'pagina' && (
            <button
              type="button"
              onClick={onToggleOpened}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-[#F6BD3A]/55 bg-[#1B4332] px-2.5 py-1.5 text-xs font-bold text-[#FCE085] transition hover:bg-[#245943]"
            >
              <MailOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isOpened ? 'Ver portada' : 'Ver página completa'}</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
