import { CalendarPlus, Download } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { buildGoogleCalendarUrl, buildIcsContent } from '../../domain/calendar';
import { useCountdown } from '../../hooks/useCountdown';

interface FootprintCountdownProps {
  readonly config: EventConfig;
}

function padUnit(value: number): string {
  return String(value).padStart(2, '0');
}

const UNIT_STYLES = [
  'bg-[#1B4332] border-[#0E271D] text-[#FFFDF7]',
  'bg-[#235B8C] border-[#153C5E] text-white',
  'bg-[#D98A2B] border-[#9E5E12] text-[#281809]',
  'bg-[#6F4220] border-[#452710] text-[#FFFDF7]',
] as const;

const UNIT_LABEL_STYLES = [
  'text-[#FCE085]',
  'text-[#B8E4FF]',
  'text-[#3D240F]',
  'text-[#FCE085]',
] as const;

export function FootprintCountdown({ config }: FootprintCountdownProps) {
  const snapshot = useCountdown(config.startIso, config.endIso);

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

  return (
    <section aria-labelledby="safari-countdown-heading" className="w-full px-3 py-6 sm:px-4">
      <div className="safari-sand-card mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] p-5 sm:p-7">
        <p className="font-hand text-xl text-[#6F4220]">Huellas en la arena</p>
        <h2
          id="safari-countdown-heading"
          className="font-display text-2xl font-bold text-[#3D240F] sm:text-3xl"
        >
          {snapshot.phase === 'today'
            ? '¡Hoy celebramos el primer añito de Jacobo!'
            : snapshot.phase === 'past'
              ? '¡Gracias por acompañarnos en este primer añito!'
              : '¡Falta muy poco para celebrar!'}
        </h2>

        {snapshot.phase === 'upcoming' ? (
          <div className="mt-5 grid w-full grid-cols-4 gap-2 sm:gap-3" role="timer" aria-live="off">
            {units.map((unit, index) => (
              <div
                key={unit.label}
                className={`toy-block flex w-full flex-col items-center justify-center rounded-2xl border-b-4 px-1.5 py-3 sm:py-4 ${UNIT_STYLES[index]}`}
              >
                <span className="font-display text-xl font-extrabold tabular-nums sm:text-3xl">
                  {unit.value}
                </span>
                <span
                  className={`mt-0.5 text-[10px] font-bold tracking-wide uppercase sm:text-xs ${UNIT_LABEL_STYLES[index]}`}
                >
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 w-full rounded-2xl border border-[#6F4220]/25 bg-white/70 p-3.5 text-sm font-bold text-[#1B4332]">
            {snapshot.phase === 'today'
              ? `Te esperamos a las ${config.timeDisplay} en el ${config.venueSpace} de la ${config.venueName}.`
              : 'Guardamos este recuerdo con muchísimo cariño.'}
          </p>
        )}

        <div className="mt-5 flex w-full flex-wrap gap-3">
          <a
            href={buildGoogleCalendarUrl(config)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-4 py-2.5 text-xs font-bold text-white shadow sm:flex-none sm:text-sm"
          >
            <CalendarPlus className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
            <span>Agregar a Google Calendar</span>
          </a>
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-[#6F4220]/35 bg-white px-4 py-2.5 text-xs font-bold text-[#3D240F] shadow-sm sm:flex-none sm:text-sm"
          >
            <Download className="h-4 w-4 text-[#6F4220]" aria-hidden="true" />
            <span>Guardar recordatorio (.ics)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
