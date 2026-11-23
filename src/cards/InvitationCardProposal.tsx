import { ArrowRight, Calendar, Compass, MapPin } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { EXPLORER_THEME } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';

interface InvitationCardProposalProps {
  readonly config: EventConfig;
  readonly theme?: ProposalTheme;
  readonly exportMode?: boolean;
}

export function InvitationCardProposal({
  config,
  theme = EXPLORER_THEME,
  exportMode = false,
}: InvitationCardProposalProps) {
  const shortUrlDisplay = config.liveUrl.replace(/^https?:\/\//, '');

  return (
    <article
      aria-label={`Tarjeta de invitación ${theme.name}`}
      className={`relative mx-auto overflow-hidden border-4 border-[#1B4332] bg-[#EFE4C4] text-[#2F2012] shadow-2xl ${
        exportMode
          ? 'h-[675px] w-[540px] rounded-none p-3.5'
          : 'w-full max-w-[540px] rounded-[2rem] p-3 sm:p-4'
      }`}
    >
      <div
        className={`flex h-full flex-col justify-between rounded-[1.5rem] border-2 border-[#C7933B] bg-[#FAF3DF] ${
          exportMode ? 'p-3' : 'gap-2.5 p-3 sm:gap-3 sm:p-4'
        }`}
      >
        <div>
          <div aria-hidden="true" className="pointer-events-none mb-1 flex items-center justify-between px-1">
            <span className="h-2.5 w-2.5 rounded-full border border-[#8B6136] bg-[#E09F24]" />
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#1B4332] uppercase">
              {theme.copy.cardBadgeText}
            </span>
            <span className="h-2.5 w-2.5 rounded-full border border-[#8B6136] bg-[#E09F24]" />
          </div>

          <div className="overflow-hidden rounded-2xl border-[3px] border-[#6F4220] shadow-md">
            <img
              src={theme.assets.heroScene}
              alt={theme.assets.heroAlt}
              className={`w-full object-cover object-center ${
                exportMode ? 'h-[205px]' : 'aspect-[16/10]'
              }`}
            />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#381E0B] bg-gradient-to-b from-[#6F4220] to-[#4A2A11] px-4 py-2.5 text-center text-[#FFF9EC] shadow-md">
          <h2 className="font-display text-2xl leading-tight font-extrabold sm:text-[26px]">
            {config.eventTitle}
          </h2>
          <p className="font-display text-xl leading-tight font-bold text-[#FCE085] sm:text-[22px]">
            {config.honoree}
          </p>
          <p className="mt-0.5 text-xs font-bold opacity-95 sm:text-sm">
            {config.subtitle}
          </p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-[#8B6136]/55 bg-[#FFFDF8] px-3.5 py-2.5 text-center text-[#2F2012] shadow-sm">
          <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-extrabold sm:text-[13px]">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-[#1B4332]" aria-hidden="true" />
            <span>
              {config.dateDisplay} · <span className="whitespace-nowrap">{config.timeDisplay}</span>
            </span>
          </p>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold sm:text-[13px]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D98A2B]" aria-hidden="true" />
            <span>
              {config.venueSpace} · {config.venueName}
            </span>
          </p>
          <p className="mt-0.5 text-[11px] font-semibold opacity-80">
            {config.address} ({config.neighborhood})
          </p>
        </div>

        <div className="pt-0.5 text-center">
          <a
            href={config.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-5 py-3 text-sm font-extrabold text-[#FFFDF7] shadow-lg transition hover:bg-[#235641] sm:text-base"
          >
            <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{theme.copy.cardButtonLabel}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>

          <p className="mt-1.5 text-[11px] font-bold text-[#2C4A38]">
            {theme.copy.cardHelperText}
          </p>
          <p className="text-[11px] font-extrabold tracking-wide text-[#6F4220]">
            {shortUrlDisplay}
          </p>
        </div>
      </div>
    </article>
  );
}
