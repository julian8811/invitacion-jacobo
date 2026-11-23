import { useEffect, useState } from 'react';
import { CalendarPlus, Download } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { buildGoogleCalendarUrl, buildIcsContent } from '../domain/calendar';
import { getCountdownSnapshot, type CountdownSnapshot } from '../domain/countdown';
import { PROPOSAL_BY_ID } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';

interface CountdownSectionProps {
  readonly config: EventConfig;
  readonly theme?: ProposalTheme;
}

function padUnit(value: number): string {
  return String(value).padStart(2, '0');
}

const BLOCK_STYLES_BY_THEME: Record<ProposalTheme['id'], readonly [string, string, string, string]> = {
  explorador: [
    'bg-[#1B4332] border-[#0E271D] text-[#FFFDF7] -rotate-1',
    'bg-[#235B8C] border-[#153C5E] text-white rotate-1',
    'bg-[#D98A2B] border-[#9E5E12] text-[#281809] -rotate-1',
    'bg-[#6F4220] border-[#452710] text-[#FFFDF7] rotate-1',
  ],
  'selva-viva': [
    'bg-[#2168B0] border-[#134275] text-white -rotate-1',
    'bg-[#0E8FA3] border-[#085E6B] text-white rotate-1',
    'bg-[#1E7E45] border-[#114D2A] text-white -rotate-1',
    'bg-[#F5A623] border-[#B7770B] text-[#2B1B05] rotate-1',
  ],
  campamento: [
    'bg-[#143D30] border-[#0B241C] text-[#F6BD3A] -rotate-1',
    'bg-[#234B6E] border-[#153047] text-[#FBE192] rotate-1',
    'bg-[#8B5223] border-[#593212] text-[#FDF7E6] -rotate-1',
    'bg-[#F6BD3A] border-[#9F6F0D] text-[#112A20] rotate-1',
  ],
};

export function CountdownSection({
  config,
  theme = PROPOSAL_BY_ID.explorador,
}: CountdownSectionProps) {
  const [snapshot, setSnapshot] = useState<CountdownSnapshot>(() =>
    getCountdownSnapshot(config.startIso, config.endIso),
  );

  useEffect(() => {
    const tick = () => {
      setSnapshot(getCountdownSnapshot(config.startIso, config.endIso));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [config.startIso, config.endIso]);

  const handleDownloadIcs = () => {
    const ics = buildIcsContent(config);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'primer-anito-jacobo-pineda-jaramillo.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const units = [
    { label: 'Días', value: padUnit(snapshot.days) },
    { label: 'Horas', value: padUnit(snapshot.hours) },
    { label: 'Minutos', value: padUnit(snapshot.minutes) },
    { label: 'Segundos', value: padUnit(snapshot.seconds) },
  ];

  const cardSurface =
    theme.id === 'selva-viva'
      ? 'selva-treehouse-card'
      : theme.id === 'campamento'
        ? 'camp-parchment-card'
        : 'explorer-journal';

  const cameoRing =
    theme.id === 'selva-viva'
      ? 'border-4 border-[#2168B0] bg-[#EAF7FF]'
      : theme.id === 'campamento'
        ? 'border-4 border-[#D7A645] bg-[#14362B]'
        : 'cameo-circle';

  const blockStyles = BLOCK_STYLES_BY_THEME[theme.id];

  const primaryBtnClass =
    theme.id === 'selva-viva'
      ? 'border-b-4 border-[#134275] bg-[#2168B0] text-white hover:bg-[#1B5796]'
      : theme.id === 'campamento'
        ? 'border-b-4 border-[#0D261E] bg-[#173E31] text-[#F6BD3A] hover:bg-[#1E5040]'
        : 'border-b-4 border-[#0E271D] bg-[#1B4332] text-white hover:bg-[#245842]';

  return (
    <section aria-labelledby="countdown-heading" className="px-4 py-6">
      <div className={`${cardSurface} relative mx-auto max-w-3xl overflow-hidden rounded-[2.25rem] p-6 sm:p-8`}>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className={`h-36 w-36 shrink-0 overflow-hidden rounded-full shadow-lg sm:h-44 sm:w-44 ${cameoRing}`}>
            <img
              src={theme.assets.introMascot}
              alt={theme.assets.mascotAlt}
              className="animate-sway h-full w-full scale-[1.04] object-cover"
            />
          </div>

          <div className="min-w-0 w-full flex-1 text-center sm:text-left">
            <p
              className={`font-hand text-xl ${
                theme.id === 'selva-viva'
                  ? 'text-[#2168B0]'
                  : theme.id === 'campamento'
                    ? 'text-[#8B5223]'
                    : 'text-[#1B4332]'
              }`}
            >
              {theme.copy.countdownEyebrow}
            </p>
            <h2
              id="countdown-heading"
              className={`font-display text-2xl font-bold sm:text-3xl ${
                theme.id === 'selva-viva'
                  ? 'text-[#1E7E45]'
                  : theme.id === 'campamento'
                    ? 'text-[#112A20]'
                    : 'text-[#4E2E14]'
              }`}
            >
              {snapshot.phase === 'today'
                ? '¡Hoy celebramos el primer añito de Jacobo!'
                : snapshot.phase === 'past'
                  ? '¡Gracias por acompañarnos en este primer añito!'
                  : '¡Falta muy poco para celebrar!'}
            </h2>

            {snapshot.phase === 'upcoming' ? (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-live="off">
                {units.map((unit, idx) => (
                  <div
                    key={unit.label}
                    className={`toy-block flex flex-col items-center justify-center rounded-2xl px-1.5 py-2.5 sm:px-2 sm:py-3 ${blockStyles[idx]}`}
                  >
                    <span className="font-display text-xl font-extrabold tabular-nums sm:text-3xl">
                      {unit.value}
                    </span>
                    <span className="mt-0.5 text-[10px] font-bold tracking-wide uppercase sm:text-xs">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="stitched-panel mt-3 rounded-2xl p-3.5 text-sm font-bold text-[#1B4332]">
                {snapshot.phase === 'today'
                  ? `Te esperamos a las ${config.timeDisplay} en el ${config.venueSpace} de la ${config.venueName}.`
                  : 'Guardamos este recuerdo con muchísimo cariño.'}
              </p>
            )}

            <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
              <a
                href={buildGoogleCalendarUrl(config)}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold shadow transition sm:text-sm ${primaryBtnClass}`}
              >
                <CalendarPlus className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
                <span>Agregar a Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-[#6F4220]/35 bg-white px-4 py-2.5 text-xs font-bold text-[#3D240F] shadow-sm transition hover:bg-[#FFF9EE] sm:text-sm"
              >
                <Download className="h-4 w-4 text-[#6F4220]" aria-hidden="true" />
                <span>Guardar recordatorio (.ics)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
