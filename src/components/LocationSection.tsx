import { useState } from 'react';
import { Check, Copy, ExternalLink, MapPin, Navigation } from 'lucide-react';
import type { EventConfig } from '../config/event';

interface LocationSectionProps {
  readonly config: EventConfig;
}

async function copyAddressText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below handles restricted contexts cleanly.
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

export function LocationSection({ config }: LocationSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const fullText = `${config.venueSpace}, ${config.venueName} — ${config.address}`;
    const ok = await copyAddressText(fullText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <section aria-labelledby="location-heading" className="px-4 py-6">
      <div className="parchment-card mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="inline-block rounded-full bg-[#F4B942]/25 px-3 py-1 text-xs font-extrabold tracking-wider text-[#5C371B] uppercase">
                Cómo llegar
              </span>
              <h2 id="location-heading" className="font-display mt-2 text-2xl font-bold text-[#5C371B] sm:text-3xl">
                {config.venueSpace} · {config.venueName}
              </h2>
              <p className="mt-1 flex items-start gap-1.5 text-sm font-bold text-[#3F734D]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F07167]" aria-hidden="true" />
                <span>
                  {config.address} ({config.neighborhood})
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-[#3F734D]/30 bg-white px-4 py-2.5 text-xs font-extrabold text-[#244B32] shadow-sm transition hover:bg-[#FFF9EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32] sm:text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[#244B32]" aria-hidden="true" />
                  <span>¡Dirección copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#3F734D]" aria-hidden="true" />
                  <span>Copiar dirección</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border-2 border-[#8BB174]/35 bg-[#EAE4D7] shadow-inner">
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#244B32] px-4 py-3 text-sm font-extrabold text-white shadow transition hover:bg-[#1b3a26] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32]"
            >
              <MapPin className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
              <span>Abrir en Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
            </a>

            <a
              href={config.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#33CCFF]/20 px-4 py-3 text-sm font-extrabold text-[#164E63] ring-2 ring-[#33CCFF]/50 transition hover:bg-[#33CCFF]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#164E63]"
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
