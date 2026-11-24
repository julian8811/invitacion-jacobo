import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Clock, Compass, MapPin } from 'lucide-react';
import QRCode from 'qrcode';
import type { EventConfig } from '../config/event';
import { REALISTIC_ANIMALS, SAFARI_SUNRISE_SRC } from '../proposals/assets';

type CardVariant = 'whatsapp' | 'og' | 'pre';

interface InvitationCardProposalProps {
  readonly config: EventConfig;
  readonly exportMode?: boolean;
  readonly variant?: CardVariant;
}

function useQrDataUrl(url: string): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: 220,
      margin: 1,
      color: { dark: '#1B4332', light: '#FFFDF7' },
      errorCorrectionLevel: 'M',
    })
      .then((value) => {
        if (!cancelled) {
          setDataUrl(value);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDataUrl(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return dataUrl;
}

export function InvitationCardProposal({
  config,
  exportMode = false,
  variant = 'whatsapp',
}: InvitationCardProposalProps) {
  const shortUrlDisplay = config.liveUrl.replace(/^https?:\/\//, '');
  const qrDataUrl = useQrDataUrl(config.liveUrl);

  if (variant === 'pre') {
    return (
      <a
        href={config.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir invitación de Jacobo"
        className={`relative mx-auto block overflow-hidden border-[6px] border-[#1B4332] bg-[#EFE4C4] text-[#2F2012] shadow-2xl ${
          exportMode
            ? 'h-[1350px] w-[1080px] rounded-none p-6'
            : 'aspect-[1080/1350] w-full max-w-[540px] rounded-[2rem] p-3'
        }`}
      >
        <div
          className={`flex h-full flex-col rounded-[1.4rem] border-[3px] border-[#C7933B] bg-[#FAF3DF] ${
            exportMode ? 'p-7' : 'p-3.5'
          }`}
        >
          <p
            className={`text-center font-extrabold tracking-[0.2em] text-[#1B4332] uppercase ${
              exportMode ? 'text-base' : 'text-[10px]'
            }`}
          >
            Invitación de cumpleaños
          </p>
          <p
            className={`mt-1 text-center font-hand text-[#6F4220] ${
              exportMode ? 'text-3xl' : 'text-lg'
            }`}
          >
            Estás invitado a celebrar
          </p>

          <div
            className={`mt-3 rounded-2xl border-2 border-[#381E0B] bg-gradient-to-b from-[#6F4220] to-[#4A2A11] text-center text-[#FFF9EC] shadow-md ${
              exportMode ? 'px-6 py-6' : 'px-4 py-3'
            }`}
          >
            <h2
              className={`font-display leading-none font-extrabold ${
                exportMode ? 'text-6xl' : 'text-3xl'
              }`}
            >
              {config.eventTitle}
            </h2>
            <p
              className={`font-display font-bold text-[#FCE085] ${
                exportMode ? 'mt-2 text-4xl' : 'mt-1 text-xl'
              }`}
            >
              {config.honoree}
            </p>
            <p className={`font-bold ${exportMode ? 'mt-3 text-xl' : 'mt-1 text-sm'}`}>
              Su primer cumpleaños
            </p>
          </div>

          <div
            className={`relative mt-4 overflow-hidden rounded-2xl border-[3px] border-[#6F4220] shadow-md ${
              exportMode ? 'min-h-[360px]' : 'min-h-[180px]'
            }`}
          >
            <img
              src={SAFARI_SUNRISE_SRC}
              alt="Amanecer en la sabana"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/75 via-transparent to-transparent" />
            <div
              className={`absolute inset-x-0 bottom-0 flex items-end justify-center ${
                exportMode ? 'gap-2 px-4 pb-3' : 'gap-1 px-2 pb-2'
              }`}
            >
              {REALISTIC_ANIMALS.map((animal) => (
                <img
                  key={animal.id}
                  src={animal.src}
                  alt={animal.alt}
                  className={`w-auto object-contain drop-shadow-[0_12px_18px_rgba(20,12,4,0.4)] ${
                    exportMode ? 'h-40' : 'h-20'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className={`mt-4 grid grid-cols-3 ${exportMode ? 'gap-3' : 'gap-2'}`}>
            <div
              className={`rounded-2xl border-2 border-[#0E271D] bg-[#1B4332] text-center text-[#FFFDF7] ${
                exportMode ? 'px-3 py-4' : 'px-2 py-2'
              }`}
            >
              <Calendar className={`mx-auto text-[#FCE085] ${exportMode ? 'h-7 w-7' : 'h-4 w-4'}`} aria-hidden="true" />
              <p className={`mt-1 font-extrabold text-[#FCE085] uppercase ${exportMode ? 'text-sm' : 'text-[10px]'}`}>
                Fecha
              </p>
              <p className={`font-bold leading-snug ${exportMode ? 'mt-1 text-[15px]' : 'text-[10px]'}`}>
                {config.dateDisplay}
              </p>
            </div>
            <div
              className={`rounded-2xl border-2 border-[#153C5E] bg-[#235B8C] text-center text-white ${
                exportMode ? 'px-3 py-4' : 'px-2 py-2'
              }`}
            >
              <Clock className={`mx-auto text-[#B8E4FF] ${exportMode ? 'h-7 w-7' : 'h-4 w-4'}`} aria-hidden="true" />
              <p className={`mt-1 font-extrabold text-[#B8E4FF] uppercase ${exportMode ? 'text-sm' : 'text-[10px]'}`}>
                Hora
              </p>
              <p className={`font-bold leading-snug ${exportMode ? 'mt-1 text-[15px]' : 'text-[10px]'}`}>
                {config.timeDisplay}
              </p>
            </div>
            <div
              className={`rounded-2xl border-2 border-[#9E5E12] bg-[#D98A2B] text-center text-[#281809] ${
                exportMode ? 'px-3 py-4' : 'px-2 py-2'
              }`}
            >
              <MapPin className={`mx-auto text-[#3D240F] ${exportMode ? 'h-7 w-7' : 'h-4 w-4'}`} aria-hidden="true" />
              <p className={`mt-1 font-extrabold uppercase ${exportMode ? 'text-sm' : 'text-[10px]'}`}>Lugar</p>
              <p className={`font-bold leading-snug ${exportMode ? 'mt-1 text-[15px]' : 'text-[10px]'}`}>
                {config.venueSpace}
              </p>
            </div>
          </div>

          <p
            className={`mt-3 rounded-xl bg-[#6F4220]/10 text-center font-semibold text-[#5A4330] ${
              exportMode ? 'px-4 py-3 text-lg' : 'px-2 py-1.5 text-[11px]'
            }`}
          >
            {config.venueName}
            <br />
            {config.address} ({config.neighborhood})
          </p>

          <span
            className={`mt-auto inline-flex w-full items-center justify-center gap-3 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] font-extrabold text-[#FFFDF7] shadow-lg ${
              exportMode ? 'mt-6 px-6 py-5 text-2xl' : 'mt-3 px-4 py-3 text-sm'
            }`}
          >
            <Compass className={exportMode ? 'h-7 w-7 shrink-0' : 'h-4 w-4 shrink-0'} aria-hidden="true" />
            Abrir invitación
            <ArrowRight className={exportMode ? 'h-7 w-7 shrink-0' : 'h-4 w-4 shrink-0'} aria-hidden="true" />
          </span>
          <p
            className={`mt-2 text-center font-bold text-[#2C4A38] ${
              exportMode ? 'text-base' : 'text-[11px]'
            }`}
          >
            Toca aquí para ver el video, el mapa y confirmar asistencia
          </p>
          <p
            className={`text-center font-extrabold tracking-wide text-[#6F4220] ${
              exportMode ? 'mt-1 text-lg' : 'text-[11px]'
            }`}
          >
            {shortUrlDisplay}
          </p>
        </div>
      </a>
    );
  }

  if (variant === 'og') {
    return (
      <article
        aria-label="Vista previa de enlace de invitación"
        className={`relative overflow-hidden bg-[#EFE4C4] text-[#2F2012] ${
          exportMode ? 'h-[630px] w-[1200px]' : 'aspect-[1200/630] w-full max-w-[1200px]'
        }`}
      >
        <img
          src={SAFARI_SUNRISE_SRC}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/88 via-[#1B4332]/55 to-[#6F4220]/35" />
        <div className="relative z-10 flex h-full items-center gap-8 px-12 py-10">
          <div className="flex min-w-0 flex-1 flex-col justify-center text-[#FFFDF7]">
            <p className="text-sm font-extrabold tracking-[0.28em] text-[#FCE085] uppercase">
              Expedición primer añito
            </p>
            <h2 className="font-display mt-2 text-5xl leading-none font-extrabold">
              {config.eventTitle}
            </h2>
            <p className="font-display mt-2 text-3xl font-bold text-[#FCE085]">{config.honoree}</p>
            <p className="mt-4 text-lg font-bold">
              {config.dateDisplay} · {config.timeDisplay}
            </p>
            <p className="mt-1 text-base font-semibold text-[#FBE8C2]">
              {config.venueSpace} · {config.venueName}
            </p>
            <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl border-b-4 border-[#9E5E12] bg-[#E09F24] px-5 py-3 text-base font-extrabold text-[#281809]">
              <Compass className="h-5 w-5" aria-hidden="true" />
              Abrir invitación interactiva
            </p>
          </div>
          <div className="flex shrink-0 items-end gap-1 pb-2">
            {REALISTIC_ANIMALS.map((animal) => (
              <img
                key={animal.id}
                src={animal.src}
                alt={animal.alt}
                className="h-48 w-auto object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.45)]"
              />
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      aria-label="Tarjeta de invitación Safari"
      className={`relative mx-auto overflow-hidden border-4 border-[#1B4332] bg-[#EFE4C4] text-[#2F2012] shadow-2xl ${
        exportMode
          ? 'h-[1350px] w-[1080px] rounded-none p-5'
          : 'w-full max-w-[540px] rounded-[2rem] p-3 sm:p-4'
      }`}
    >
      <div
        className={`flex h-full flex-col overflow-hidden rounded-[1.6rem] border-2 border-[#C7933B] bg-[#FAF3DF] ${
          exportMode ? 'p-5' : 'p-3 sm:p-4'
        }`}
      >
        <div className="relative overflow-hidden rounded-[1.25rem] border-[3px] border-[#6F4220] shadow-md">
          <img
            src={SAFARI_SUNRISE_SRC}
            alt="Amanecer en la sabana para la expedición de Jacobo"
            className={`w-full object-cover object-center ${exportMode ? 'h-[420px]' : 'h-44 sm:h-52'}`}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1B4332]/80 to-transparent px-3 pt-10 pb-2">
            <p
              className={`text-center font-extrabold tracking-[0.22em] text-[#FCE085] uppercase ${
                exportMode ? 'text-base' : 'text-[10px]'
              }`}
            >
              Expedición primer añito
            </p>
          </div>
          <div
            className={`absolute inset-x-0 bottom-8 flex items-end justify-center ${
              exportMode ? 'gap-2 px-4' : 'gap-1 px-2'
            }`}
          >
            {REALISTIC_ANIMALS.map((animal) => (
              <img
                key={animal.id}
                src={animal.src}
                alt={animal.alt}
                className={`w-auto object-contain drop-shadow-[0_10px_14px_rgba(20,12,4,0.4)] ${
                  exportMode ? 'h-44' : 'h-24 sm:h-28'
                }`}
              />
            ))}
          </div>
        </div>

        <div
          className={`mt-3 rounded-2xl border-2 border-[#381E0B] bg-gradient-to-b from-[#6F4220] to-[#4A2A11] text-center text-[#FFF9EC] shadow-md ${
            exportMode ? 'px-6 py-5' : 'px-4 py-3'
          }`}
        >
          <h2
            className={`font-display leading-tight font-extrabold ${
              exportMode ? 'text-5xl' : 'text-2xl sm:text-[26px]'
            }`}
          >
            {config.eventTitle}
          </h2>
          <p
            className={`font-display leading-tight font-bold text-[#FCE085] ${
              exportMode ? 'mt-1 text-4xl' : 'text-xl sm:text-[22px]'
            }`}
          >
            {config.honoree}
          </p>
          <p className={`font-bold opacity-95 ${exportMode ? 'mt-2 text-lg' : 'mt-0.5 text-xs sm:text-sm'}`}>
            {config.subtitle}
          </p>
        </div>

        <div className={`mt-3 grid grid-cols-3 ${exportMode ? 'gap-3' : 'gap-2'}`}>
          <div
            className={`rounded-2xl border-2 border-[#0E271D] bg-[#1B4332] text-center text-[#FFFDF7] ${
              exportMode ? 'px-3 py-4' : 'px-2 py-2.5'
            }`}
          >
            <Calendar
              className={`mx-auto text-[#FCE085] ${exportMode ? 'h-7 w-7' : 'h-4 w-4'}`}
              aria-hidden="true"
            />
            <p className={`mt-1 font-extrabold text-[#FCE085] uppercase ${exportMode ? 'text-sm' : 'text-[10px]'}`}>
              Fecha
            </p>
            <p className={`font-bold leading-snug ${exportMode ? 'mt-1 text-base' : 'text-[11px]'}`}>
              {config.dateDisplay}
            </p>
          </div>
          <div
            className={`rounded-2xl border-2 border-[#153C5E] bg-[#235B8C] text-center text-white ${
              exportMode ? 'px-3 py-4' : 'px-2 py-2.5'
            }`}
          >
            <Clock
              className={`mx-auto text-[#B8E4FF] ${exportMode ? 'h-7 w-7' : 'h-4 w-4'}`}
              aria-hidden="true"
            />
            <p className={`mt-1 font-extrabold text-[#B8E4FF] uppercase ${exportMode ? 'text-sm' : 'text-[10px]'}`}>
              Hora
            </p>
            <p className={`font-bold leading-snug ${exportMode ? 'mt-1 text-base' : 'text-[11px]'}`}>
              {config.timeDisplay}
            </p>
          </div>
          <div
            className={`rounded-2xl border-2 border-[#9E5E12] bg-[#D98A2B] text-center text-[#281809] ${
              exportMode ? 'px-3 py-4' : 'px-2 py-2.5'
            }`}
          >
            <MapPin
              className={`mx-auto text-[#3D240F] ${exportMode ? 'h-7 w-7' : 'h-4 w-4'}`}
              aria-hidden="true"
            />
            <p className={`mt-1 font-extrabold uppercase ${exportMode ? 'text-sm' : 'text-[10px]'}`}>Lugar</p>
            <p className={`font-bold leading-snug ${exportMode ? 'mt-1 text-base' : 'text-[11px]'}`}>
              {config.venueSpace}
            </p>
          </div>
        </div>

        <p
          className={`mt-2 rounded-xl bg-[#6F4220]/10 text-center font-semibold text-[#5A4330] ${
            exportMode ? 'px-4 py-2 text-base' : 'px-2 py-1.5 text-[11px]'
          }`}
        >
          {config.venueName} · {config.address} ({config.neighborhood})
        </p>

        <div className={`mt-auto flex items-stretch ${exportMode ? 'mt-5 gap-4' : 'mt-3 gap-3'}`}>
          <div className="min-w-0 flex-1">
            <a
              href={config.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] font-extrabold text-[#FFFDF7] shadow-lg ${
                exportMode ? 'px-6 py-5 text-2xl' : 'px-4 py-3 text-sm sm:text-base'
              }`}
            >
              <Compass className={exportMode ? 'h-7 w-7 shrink-0' : 'h-4 w-4 shrink-0'} aria-hidden="true" />
              <span>Abrir invitación interactiva</span>
              <ArrowRight className={exportMode ? 'h-7 w-7 shrink-0' : 'h-4 w-4 shrink-0'} aria-hidden="true" />
            </a>
            <p
              className={`mt-2 text-center font-bold text-[#2C4A38] ${
                exportMode ? 'text-base' : 'text-[11px]'
              }`}
            >
              Toca el botón o escanea el código para ver el video, el mapa y confirmar asistencia
            </p>
            <p
              className={`text-center font-extrabold tracking-wide text-[#6F4220] ${
                exportMode ? 'mt-1 text-lg' : 'text-[11px]'
              }`}
            >
              {shortUrlDisplay}
            </p>
          </div>

          <figure
            className={`shrink-0 rounded-2xl border-2 border-[#1B4332]/25 bg-[#FFFDF7] text-center shadow-sm ${
              exportMode ? 'p-3' : 'p-1.5'
            }`}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Código QR para abrir ${shortUrlDisplay}`}
                className={exportMode ? 'h-40 w-40' : 'h-20 w-20'}
              />
            ) : (
              <div
                className={`animate-pulse rounded-lg bg-[#EFE4C4] ${exportMode ? 'h-40 w-40' : 'h-20 w-20'}`}
                aria-hidden="true"
              />
            )}
            <figcaption
              className={`font-extrabold tracking-wide text-[#1B4332] uppercase ${
                exportMode ? 'mt-1 text-xs' : 'mt-0.5 text-[9px]'
              }`}
            >
              Escanea
            </figcaption>
          </figure>
        </div>
      </div>
    </article>
  );
}
