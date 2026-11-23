import { useState } from 'react';
import { Check, Copy, ExternalLink, MapPin, Navigation } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { EXPLORER_THEME } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';
import { copyToClipboard } from '../utils/clipboard';

interface LocationSectionProps {
  readonly config: EventConfig;
  readonly theme?: ProposalTheme;
}

export function LocationSection({
  config,
  theme = EXPLORER_THEME,
}: LocationSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const fullText = `${config.venueSpace}, ${config.venueName} — ${config.address}`;
    const ok = await copyToClipboard(fullText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <section aria-labelledby="location-heading" className="px-4 py-6">
      <div className="explorer-journal mx-auto max-w-3xl rounded-[2.25rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-hand text-xl text-[#1B4332]">{theme.copy.locationEyebrow}</p>
              <h2 id="location-heading" className="font-display text-2xl font-bold text-[#4E2E14] sm:text-3xl">
                {config.venueSpace} · {config.venueName}
              </h2>
              <p className="mt-1 flex items-start gap-1.5 text-sm font-bold text-[#1B4332]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D98A2B]" aria-hidden="true" />
                <span>
                  {config.address} ({config.neighborhood})
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-[#1B4332]/35 bg-white px-4 py-2.5 text-xs font-bold text-[#1B4332] shadow-sm transition hover:bg-[#FFF9EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] sm:text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[#1E7E45]" aria-hidden="true" />
                  <span>¡Dirección copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#1B4332]" aria-hidden="true" />
                  <span>Copiar dirección</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border-[3px] border-[#8B6136]/45 bg-[#EAE4D7] shadow-inner">
            <iframe
              title={`Mapa de ${config.venueName} en ${config.city}`}
              src={config.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-60 w-full border-0 sm:h-72"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={config.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-[#245842] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            >
              <MapPin className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
              <span>Abrir en Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
            </a>

            <a
              href={config.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#2168B0]/45 border-b-4 bg-[#E5F2FC] px-4 py-3 text-sm font-bold text-[#154373] transition hover:bg-[#d4e9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#154373]"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              <span>Ir con Waze</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
