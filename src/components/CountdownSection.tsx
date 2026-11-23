import { useEffect, useState } from 'react';
import { CalendarPlus, Download } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { buildGoogleCalendarUrl, buildIcsContent } from '../domain/calendar';
import { getCountdownSnapshot, type CountdownSnapshot } from '../domain/countdown';

interface CountdownSectionProps {
  readonly config: EventConfig;
}

function padUnit(value: number): string {
  return String(value).padStart(2, '0');
}

const BLOCK_STYLES = [
  'bg-[#F07167] border-[#C64E45] text-white -rotate-1',
  'bg-[#6EB5DC] border-[#488EB6] text-white rotate-1',
  'bg-[#6EC498] border-[#45976E] text-white -rotate-1',
  'bg-[#F4B942] border-[#C28A1C] text-[#4A2B13] rotate-1',
] as const;

export function CountdownSection({ config }: CountdownSectionProps) {
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
    link.download = 'primer-anito-jacobo-pineda.ics';
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
    <section aria-labelledby="countdown-heading" className="px-4 py-6">
      <div className="storybook-card relative mx-auto max-w-3xl overflow-hidden rounded-[2.25rem] p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="cameo-circle h-36 w-36 shrink-0 overflow-hidden rounded-full sm:h-44 sm:w-44">
            <img
              src="/images/baby-monkey-vine.png"
              alt="Monito alegre colgado de una liana con flores tropicales"
              className="animate-sway h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 w-full flex-1 text-center sm:text-left">
            <p className="font-hand text-xl text-[#3F734D]">Cuenta regresiva</p>
            <h2 id="countdown-heading" className="font-display text-2xl font-bold text-[#5C371B] sm:text-3xl">
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
                    className={`toy-block flex flex-col items-center justify-center rounded-2xl px-1.5 py-2.5 sm:px-2 sm:py-3 ${BLOCK_STYLES[idx]}`}
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
              <p className="stitched-panel mt-3 rounded-2xl p-3.5 text-sm font-bold text-[#244B32]">
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
                className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-[#183522] bg-[#244B32] px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#2d5d3e] sm:text-sm"
              >
                <CalendarPlus className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
                <span>Agregar a Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-[#7D4F28]/35 bg-white px-4 py-2.5 text-xs font-bold text-[#5C371B] shadow-sm transition hover:bg-[#FFF9EE] sm:text-sm"
              >
                <Download className="h-4 w-4 text-[#7D4F28]" aria-hidden="true" />
                <span>Guardar recordatorio (.ics)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
