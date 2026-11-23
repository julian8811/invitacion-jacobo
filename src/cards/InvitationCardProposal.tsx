import { ArrowRight, Calendar, Compass, MapPin, Play, Tent } from 'lucide-react';
import type { EventConfig } from '../config/event';
import type { ProposalTheme } from '../proposals/types';

interface InvitationCardProposalProps {
  readonly config: EventConfig;
  readonly theme: ProposalTheme;
  readonly exportMode?: boolean;
}

function renderCardDecorations(theme: ProposalTheme) {
  if (theme.id === 'selva-viva') {
    const flags = ['#2168B0', '#F5A623', '#0E8FA3', '#1E7E45', '#2168B0', '#F5A623', '#0E8FA3', '#1E7E45'];
    return (
      <div aria-hidden="true" className="pointer-events-none flex justify-center gap-2 pb-1">
        {flags.map((color, idx) => (
          <span
            key={idx}
            className="block h-0 w-0 border-x-[8px] border-t-[12px] border-x-transparent"
            style={{ borderTopColor: color }}
          />
        ))}
      </div>
    );
  }

  if (theme.id === 'campamento') {
    const lanterns = [18, 42, 68, 94, 120, 146, 172];
    return (
      <div aria-hidden="true" className="pointer-events-none w-full pb-1">
        <svg viewBox="0 0 190 18" className="mx-auto h-3.5 w-48" fill="none">
          <path d="M4 3 Q95 16 186 3" stroke="#D7A645" strokeWidth="1.4" strokeOpacity="0.7" />
          {lanterns.map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy={i === 3 ? 10 : i === 2 || i === 4 ? 9 : 7} r="4.2" fill="#F6BD3A" fillOpacity="0.9" />
              <circle cx={cx} cy={i === 3 ? 10 : i === 2 || i === 4 ? 9 : 7} r="7" fill="#F6BD3A" fillOpacity="0.22" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none mb-1 flex items-center justify-between px-1">
      <span className="h-2.5 w-2.5 rounded-full border border-[#8B6136] bg-[#E09F24]" />
      <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#1B4332] uppercase">
        {theme.copy.cardBadgeText}
      </span>
      <span className="h-2.5 w-2.5 rounded-full border border-[#8B6136] bg-[#E09F24]" />
    </div>
  );
}

export function InvitationCardProposal({
  config,
  theme,
  exportMode = false,
}: InvitationCardProposalProps) {
  const shortUrlDisplay = config.liveUrl.replace(/^https?:\/\//, '');

  const outerStyle =
    theme.id === 'explorador'
      ? 'border-4 border-[#1B4332] bg-[#EFE4C4] text-[#2F2012]'
      : theme.id === 'selva-viva'
        ? 'border-4 border-[#2168B0] bg-gradient-to-b from-[#D4EEFF] via-[#EBF8EA] to-[#DFF3D8] text-[#163322]'
        : 'border-4 border-[#D7A645] bg-gradient-to-b from-[#0E2B22] via-[#153D2F] to-[#0E2920] text-[#FDF7E6]';

  const innerFrameStyle =
    theme.id === 'explorador'
      ? 'border-2 border-[#C7933B] bg-[#FAF3DF]'
      : theme.id === 'selva-viva'
        ? 'border-2 border-[#54AF71] bg-white/90'
        : 'border border-[#D7A645]/60 bg-[#123529]/90';

  const heroFrameStyle =
    theme.id === 'explorador'
      ? 'border-[3px] border-[#6F4220]'
      : theme.id === 'selva-viva'
        ? 'border-[3px] border-[#1E7E45]'
        : 'border-[3px] border-[#D7A645]';

  const plaqueStyle =
    theme.id === 'explorador'
      ? 'bg-gradient-to-b from-[#6F4220] to-[#4A2A11] text-[#FFF9EC] border-2 border-[#381E0B]'
      : theme.id === 'selva-viva'
        ? 'bg-gradient-to-r from-[#1E7E45] to-[#176638] text-white border-2 border-[#114D2A]'
        : 'bg-gradient-to-b from-[#1D4B3A] to-[#113126] text-[#FDF7E6] border-2 border-[#D7A645]';

  const nameAccentColor =
    theme.id === 'explorador'
      ? 'text-[#FCE085]'
      : theme.id === 'selva-viva'
        ? 'text-[#FFE066]'
        : 'text-[#F6BD3A]';

  const detailsBoxStyle =
    theme.id === 'explorador'
      ? 'border-2 border-dashed border-[#8B6136]/55 bg-[#FFFDF8] text-[#2F2012]'
      : theme.id === 'selva-viva'
        ? 'border-2 border-[#8AD19D] bg-white text-[#163322]'
        : 'border-2 border-[#D7A645]/75 bg-[#FDF7E6] text-[#173326]';

  const buttonStyle =
    theme.id === 'explorador'
      ? 'border-b-4 border-[#0E271D] bg-[#1B4332] text-[#FFFDF7] hover:bg-[#235641]'
      : theme.id === 'selva-viva'
        ? 'border-b-4 border-[#134275] bg-[#2168B0] text-white hover:bg-[#1B5796]'
        : 'border-b-4 border-[#9F6F0D] bg-[#F6BD3A] text-[#112A20] hover:bg-[#f9cb5b]';

  const helperColor =
    theme.id === 'campamento' ? 'text-[#F5E6C4]' : 'text-[#2C4A38]';

  const urlColor =
    theme.id === 'campamento'
      ? 'text-[#F6BD3A]'
      : theme.id === 'selva-viva'
        ? 'text-[#2168B0]'
        : 'text-[#6F4220]';

  const ButtonIcon =
    theme.id === 'explorador' ? Compass : theme.id === 'selva-viva' ? Play : Tent;

  return (
    <article
      aria-label={`Tarjeta de invitación ${theme.name}`}
      className={`relative mx-auto overflow-hidden shadow-2xl ${outerStyle} ${
        exportMode
          ? 'h-[675px] w-[540px] rounded-none p-3.5'
          : 'w-full max-w-[540px] rounded-[2rem] p-3 sm:p-4'
      }`}
    >
      <div
        className={`flex h-full flex-col justify-between rounded-[1.5rem] ${innerFrameStyle} ${
          exportMode ? 'p-3' : 'gap-2.5 p-3 sm:gap-3 sm:p-4'
        }`}
      >
        <div>
          {renderCardDecorations(theme)}

          {theme.id !== 'explorador' && (
            <p
              className={`mb-1.5 text-center text-[10px] font-extrabold tracking-[0.2em] uppercase ${
                theme.id === 'campamento' ? 'text-[#F6BD3A]' : 'text-[#2168B0]'
              }`}
            >
              {theme.copy.cardBadgeText}
            </p>
          )}

          {/* Crisp boy-jungle hero scene */}
          <div className={`overflow-hidden rounded-2xl shadow-md ${heroFrameStyle}`}>
            <img
              src={theme.assets.heroScene}
              alt={theme.assets.heroAlt}
              className={`w-full object-cover object-center ${
                exportMode ? 'h-[205px]' : 'aspect-[16/10]'
              }`}
            />
          </div>
        </div>

        {/* Title plaque */}
        <div className={`rounded-2xl px-4 py-2.5 text-center shadow-md ${plaqueStyle}`}>
          <h2 className="font-display text-2xl leading-tight font-extrabold sm:text-[26px]">
            {config.eventTitle}
          </h2>
          <p className={`font-display text-xl leading-tight font-bold sm:text-[22px] ${nameAccentColor}`}>
            {config.honoree}
          </p>
          <p className="mt-0.5 text-xs font-bold opacity-95 sm:text-sm">
            {config.subtitle}
          </p>
        </div>

        {/* Verified date, time, and venue summary */}
        <div className={`rounded-2xl px-3.5 py-2.5 text-center shadow-sm ${detailsBoxStyle}`}>
          <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-extrabold sm:text-[13px]">
            <Calendar
              className={`h-3.5 w-3.5 shrink-0 ${
                theme.id === 'selva-viva' ? 'text-[#2168B0]' : 'text-[#1B4332]'
              }`}
              aria-hidden="true"
            />
            <span>
              {config.dateDisplay} · <span className="whitespace-nowrap">{config.timeDisplay}</span>
            </span>
          </p>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold sm:text-[13px]">
            <MapPin
              className={`h-3.5 w-3.5 shrink-0 ${
                theme.id === 'selva-viva' ? 'text-[#1E7E45]' : 'text-[#D98A2B]'
              }`}
              aria-hidden="true"
            />
            <span>
              {config.venueSpace} · {config.venueName}
            </span>
          </p>
          <p className="mt-0.5 text-[11px] font-semibold opacity-80">
            {config.address} ({config.neighborhood})
          </p>
        </div>

        {/* Direct CTA button replacing the QR code */}
        <div className="pt-0.5 text-center">
          <a
            href={config.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold shadow-lg transition sm:text-base ${buttonStyle}`}
          >
            <ButtonIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{theme.copy.cardButtonLabel}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>

          <p className={`mt-1.5 text-[11px] font-bold ${helperColor}`}>
            {theme.copy.cardHelperText}
          </p>
          <p className={`text-[11px] font-extrabold tracking-wide ${urlColor}`}>
            {shortUrlDisplay}
          </p>
        </div>
      </div>
    </article>
  );
}
