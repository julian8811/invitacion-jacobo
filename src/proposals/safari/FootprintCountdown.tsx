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
    <section aria-labelledby="safari-countdown-heading" className="relative px-4 py-8">
      <div className="safari-sand-card relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] p-6 sm:p-8">
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
          <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-live="off">
            {units.map((unit, index) => (
              <div key={unit.label} className="flex flex-col items-center">
                <div
                  className="footprint-pill flex h-20 w-full flex-col items-center justify-center rounded-[2.2rem] sm:h-24"
                  style={{ transform: `rotate(${index % 2 === 0 ? -6 : 6}deg)` }}
                >
                  <span className="font-display text-xl font-extrabold text-[#FFF8E8] tabular-nums sm:text-3xl">
                    {unit.value}
                  </span>
                  <span className="text-[10px] font-bold tracking-wide text-[#FCE085] uppercase sm:text-xs">
                    {unit.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-[#6F4220]/25 bg-white/70 p-3.5 text-sm font-bold text-[#1B4332]">
            {snapshot.phase === 'today'
              ? `Te esperamos a las ${config.timeDisplay} en el ${config.venueSpace} de la ${config.venueName}.`
              : 'Guardamos este recuerdo con muchísimo cariño.'}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={buildGoogleCalendarUrl(config)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-4 py-2.5 text-xs font-bold text-white shadow sm:text-sm"
          >
            <CalendarPlus className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
            <span>Agregar a Google Calendar</span>
          </a>
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-[#6F4220]/35 bg-white px-4 py-2.5 text-xs font-bold text-[#3D240F] shadow-sm sm:text-sm"
          >
            <Download className="h-4 w-4 text-[#6F4220]" aria-hidden="true" />
            <span>Guardar recordatorio (.ics)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
