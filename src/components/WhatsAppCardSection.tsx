import { useEffect, useState } from 'react';
import { Download, QrCode, Share2 } from 'lucide-react';
import type { EventConfig } from '../config/event';
import {
  buildWhatsAppShareUrl,
  generateQrDataUrl,
  renderWhatsAppCardDataUrl,
} from '../domain/shareCard';

interface WhatsAppCardSectionProps {
  readonly config: EventConfig;
}

export function WhatsAppCardSection({ config }: WhatsAppCardSectionProps) {
  const [pageUrl, setPageUrl] = useState('https://invitacion-jacobo.vercel.app/');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const resolved =
      typeof window !== 'undefined' && window.location?.href
        ? window.location.href.split('#')[0]
        : 'https://invitacion-jacobo.vercel.app/';
    setPageUrl(resolved);

    let active = true;
    generateQrDataUrl(resolved)
      .then((dataUrl) => {
        if (active) {
          setQrUrl(dataUrl);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const handleDownloadCard = async () => {
    if (isGenerating) {
      return;
    }
    setIsGenerating(true);
    try {
      const dataUrl = await renderWhatsAppCardDataUrl(pageUrl, config);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'tarjeta-whatsapp-jacobo.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Fallback to pre-rendered static card if canvas rendering is restricted.
      const link = document.createElement('a');
      link.href = '/tarjeta-whatsapp-jacobo.jpg';
      link.download = 'tarjeta-whatsapp-jacobo.jpg';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section aria-labelledby="share-card-heading" className="px-4 pt-2 pb-10">
      <div className="storybook-card mx-auto max-w-3xl rounded-[2.25rem] p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Live mini vertical WhatsApp card preview */}
          <div className="w-56 shrink-0 overflow-hidden rounded-3xl border-3 border-[#3F734D] bg-[#FDF6E7] p-3 text-center shadow-lg">
            <div className="overflow-hidden rounded-2xl border-2 border-[#d9bf94]">
              <img
                src="/og-cover.jpg"
                alt={`Tarjeta compartible de ${config.eventTitle} de ${config.honoree}`}
                className="aspect-video w-full object-cover"
              />
            </div>
            <p className="font-display mt-2.5 text-lg font-bold text-[#5C371B]">
              {config.eventTitle}
            </p>
            <p className="font-display -mt-1 text-base font-bold text-[#3F734D]">
              {config.honoree}
            </p>
            <p className="mt-1 text-[11px] font-bold text-[#5C371B]">
              {config.dateDisplay} · {config.timeDisplay}
            </p>
            <p className="text-[10px] font-semibold text-[#3F734D]">
              {config.venueSpace} · {config.venueName}
            </p>

            <div className="mt-2.5 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#8BB174] bg-white p-2">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="Código QR para abrir la invitación interactiva"
                  className="h-14 w-14 rounded-lg"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#FDF6E7] text-[#244B32]">
                  <QrCode className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
              <span className="text-left text-[10px] leading-tight font-bold text-[#362516]">
                Escanea para abrir la invitación
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="font-hand text-xl text-[#3F734D]">Para enviar a familiares y amigos</p>
            <h2 id="share-card-heading" className="font-display text-2xl font-bold text-[#5C371B] sm:text-3xl">
              Comparte esta tarjeta por WhatsApp
            </h2>
            <p className="mt-1.5 text-sm font-semibold text-[#5C371B]/85">
              Envía el enlace con la vista previa lista para abrir la página o descarga la tarjeta
              imagen con su código QR.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
              <a
                href={buildWhatsAppShareUrl(pageUrl, config)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-[#15692c] bg-[#1E8E3E] px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-[#177030] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E8E3E]"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                <span>Enviar tarjeta por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={isGenerating}
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-[#7D4F28]/35 bg-white px-4 py-3 text-sm font-bold text-[#5C371B] shadow-sm transition hover:bg-[#FFF9EE] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C371B]"
              >
                <Download className="h-4 w-4 text-[#7D4F28]" aria-hidden="true" />
                <span>{isGenerating ? 'Generando tarjeta...' : 'Descargar tarjeta imagen'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
