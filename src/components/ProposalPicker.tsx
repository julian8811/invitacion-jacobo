import type { ProposalId } from '../proposals/proposalId';
import { PROPOSALS, getProposalMeta } from '../proposals/proposalId';

interface ProposalPickerProps {
  readonly activeId: ProposalId;
  readonly onSelect: (id: ProposalId) => void;
}

export function ProposalPicker({ activeId, onSelect }: ProposalPickerProps) {
  const active = getProposalMeta(activeId);

  return (
    <aside
      aria-label="Selector de propuestas de diseño"
      className="proposal-picker fixed right-3 bottom-24 z-[80] w-[min(92vw,20rem)] rounded-2xl border-2 border-[#6F4220]/40 bg-[#FFFDF6]/95 p-3 shadow-2xl backdrop-blur-md sm:right-4"
    >
      <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#6F4220] uppercase">
        Vista previa · elige una propuesta
      </p>
      <p className="font-display mt-0.5 text-sm font-bold text-[#3D240F]">{active.name}</p>
      <p className="text-[11px] font-semibold text-[#5A4330]">{active.tagline}</p>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5" role="tablist" aria-label="Propuestas">
        {PROPOSALS.map((proposal) => {
          const isActive = proposal.id === activeId;
          return (
            <button
              key={proposal.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(proposal.id)}
              className={`cursor-pointer rounded-xl px-2 py-2 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] ${
                isActive
                  ? 'bg-[#1B4332] text-[#FFF9EE] shadow'
                  : 'bg-[#F5EEDB] text-[#3D240F] hover:bg-[#E9DFC4]'
              }`}
            >
              <span className="font-display block text-lg font-extrabold leading-none">
                {proposal.id}
              </span>
              <span className="mt-0.5 block text-[9px] font-bold leading-tight">
                {proposal.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
