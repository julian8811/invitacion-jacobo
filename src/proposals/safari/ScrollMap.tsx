import { useEffect, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, MapPin, Navigation } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { copyToClipboard } from '../../utils/clipboard';

interface ScrollMapProps {
  readonly config: EventConfig;
}

export function ScrollMap({ config }: ScrollMapProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [unrolled, setUnrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setUnrolled(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setUnrolled(true);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleCopyAddress = async () => {
    const fullText = `${config.venueSpace}, ${config.venueName} — ${config.address}`;
    const ok = await copyToClipboard(fullText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <section aria-labelledby="safari-location-heading" className="w-full px-3 py-6 sm:px-4" ref={ref}>
      <div className="mx-auto w-full max-w-5xl">
        <p className="font-hand text-xl text-[#1B4332]">Pergamino de la expedición</p>
        <h2
          id="safari-location-heading"
          className="font-display text-2xl font-bold text-[#3D240F] sm:text-3xl"
        >
          {config.venueSpace} · {config.venueName}
        </h2>

        <div
          className={`scroll-parchment mt-4 w-full overflow-hidden rounded-[1.75rem] border-2 border-[#8B6136] transition-all duration-700 ${
            unrolled ? 'max-h-[960px] opacity-100' : 'max-h-24 opacity-80'
          }`}
        >
          <div className="w-full bg-[linear-gradient(180deg,#f7e7c4_0%,#efd7a6_100%)] p-5 sm:p-7">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <p className="flex items-start gap-1.5 text-sm font-bold text-[#1B4332]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D98A2B]" aria-hidden="true" />
                <span>
                  {config.address} ({config.neighborhood})
                </span>
              </p>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-[#1B4332]/35 bg-white px-4 py-2.5 text-xs font-bold text-[#1B4332] sm:text-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-[#1E7E45]" aria-hidden="true" />
                    <span>¡Dirección copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>Copiar dirección</span>
                  </>
                )}
              </button>
            </div>

            <div
              className={`mt-4 w-full overflow-hidden rounded-2xl border-[3px] border-[#8B6136]/45 bg-[#EAE4D7] transition-all duration-700 ${
                unrolled ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <iframe
                title={`Mapa de ${config.venueName} en ${config.city}`}
                src={config.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-60 w-full border-0 sm:h-72"
              />
            </div>

            <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-[#0E271D] bg-[#1B4332] px-4 py-3 text-sm font-bold text-white"
              >
                <MapPin className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
                <span>Abrir en Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
              </a>
              <a
                href={config.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#2168B0]/45 border-b-4 bg-[#E5F2FC] px-4 py-3 text-sm font-bold text-[#154373]"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                <span>Ir con Waze</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
