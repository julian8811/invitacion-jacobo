import { useState } from 'react';
import { CalendarDays, Camera, Clock, MapPin, Navigation, X } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { JACOBO_MEMORIES } from '../../data/memories';
import { SharedRsvpForm } from '../../components/shared/SharedRsvpForm';
import { useCountdown } from '../../hooks/useCountdown';
import { REALISTIC_ANIMALS, type RealisticAnimalId } from '../assets';

const CARD =
  'pointer-events-auto w-full max-w-md rounded-3xl border border-amber-200/30 bg-emerald-950/80 p-5 text-amber-50 shadow-2xl backdrop-blur-md';

export function WelcomePanel({ config }: { config: EventConfig }) {
  return (
    <div className={CARD}>
      <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{config.introHeadline}</p>
      <h1 className="mt-2 text-3xl font-black leading-tight text-amber-100">{config.eventTitle}</h1>
      <p className="mt-1 text-lg font-semibold">{config.honoree}</p>
      <p className="mt-1 text-sm text-amber-100/80">{config.subtitle}</p>
      <video
        className="mt-4 aspect-video w-full rounded-2xl bg-black object-cover"
        src={config.videoSrc}
        poster={config.posterSrc}
        controls
        playsInline
        preload="none"
      />
      <p className="mt-3 text-center text-xs text-amber-200/70">Desliza hacia abajo para iniciar la expedición</p>
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-amber-100/10 px-2 py-3 text-center">
      <div className="text-3xl font-black tabular-nums text-amber-200">{String(value).padStart(2, '0')}</div>
      <div className="text-[10px] uppercase tracking-widest text-amber-100/70">{label}</div>
    </div>
  );
}

export function CountdownPanel({ config }: { config: EventConfig }) {
  const snap = useCountdown(config.startIso, config.endIso);
  const title =
    snap.phase === 'past' ? 'La fiesta ya terminó' : snap.phase === 'today' ? '¡La fiesta es hoy!' : 'Faltan para la fiesta';
  return (
    <div className={CARD}>
      <h2 className="text-center text-xl font-extrabold text-amber-100">{title}</h2>
      <div className="mt-4 grid grid-cols-4 gap-2">
        <Unit value={snap.days} label="Días" />
        <Unit value={snap.hours} label="Horas" />
        <Unit value={snap.minutes} label="Min" />
        <Unit value={snap.seconds} label="Seg" />
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-100/80">
        <CalendarDays size={16} aria-hidden="true" /> {config.dateDisplay}
      </p>
      <p className="mt-1 flex items-center justify-center gap-2 text-sm text-amber-100/80">
        <Clock size={16} aria-hidden="true" /> {config.timeDisplay}
      </p>
    </div>
  );
}

export interface MemoriesPanelProps {
  readonly memoryIndex: number | null;
  readonly onPickAnimal: (id: RealisticAnimalId) => void;
  readonly onClose: () => void;
}

export function MemoriesPanel({ memoryIndex, onPickAnimal, onClose }: MemoriesPanelProps) {
  const memory = memoryIndex === null ? null : JACOBO_MEMORIES[memoryIndex % JACOBO_MEMORIES.length];
  return (
    <div className={CARD}>
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-amber-100">
        <Camera size={20} aria-hidden="true" /> Recuerdos de Jacobo
      </h2>
      <p className="mt-1 text-sm text-amber-100/80">Toca un animalito para descubrir una foto de Jacobo.</p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {REALISTIC_ANIMALS.map((animal) => (
          <button
            key={animal.id}
            type="button"
            onClick={() => onPickAnimal(animal.id)}
            className="shrink-0 rounded-2xl border border-amber-200/30 bg-amber-100/10 p-1 text-center text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label={`Tocar a ${animal.label}`}
          >
            <img src={animal.src} alt={animal.alt} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
            <span className="mt-1 block">{animal.label}</span>
          </button>
        ))}
      </div>
      {memory ? (
        <figure className="relative mt-4 overflow-hidden rounded-2xl bg-black/40">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar foto"
            className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white"
          >
            <X size={16} aria-hidden="true" />
          </button>
          <img
            src={memory.imageSrc}
            alt={memory.imageAlt}
            className="max-h-[40svh] w-full object-cover"
            style={{ objectPosition: memory.objectPosition }}
          />
          <figcaption className="p-3">
            <p className="text-xs uppercase tracking-widest text-amber-300">{memory.ageLabel}</p>
            <p className="font-bold text-amber-100">{memory.title}</p>
            <p className="text-sm text-amber-100/80">{memory.memoryText}</p>
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}

export function LocationPanel({ config }: { config: EventConfig }) {
  return (
    <div className={CARD}>
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-amber-100">
        <MapPin size={20} aria-hidden="true" /> {config.venueName}
      </h2>
      <p className="mt-1 text-sm text-amber-100/80">
        {config.venueSpace} - {config.address}
      </p>
      <iframe
        title={`Mapa de ${config.venueName}`}
        src={config.mapEmbedUrl}
        loading="lazy"
        className="mt-3 h-44 w-full rounded-2xl border-0"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-semibold">
        <a
          href={config.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1 rounded-xl bg-amber-300 py-2 text-emerald-950"
        >
          <Navigation size={16} aria-hidden="true" /> Google Maps
        </a>
        <a
          href={config.wazeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1 rounded-xl bg-amber-100/15 py-2 text-amber-100"
        >
          <Navigation size={16} aria-hidden="true" /> Waze
        </a>
      </div>
    </div>
  );
}

export function RsvpPanel({
  config,
  isMuted,
  onPopBalloon,
  showBalloonHint,
}: {
  config: EventConfig;
  isMuted: boolean;
  onPopBalloon?: () => void;
  showBalloonHint: boolean;
}) {
  const [open] = useState(true);
  return (
    <div className={`${CARD} bg-white/95 text-emerald-950`}>
      {showBalloonHint ? (
        <button
          type="button"
          onClick={onPopBalloon}
          className="mb-3 w-full rounded-xl bg-amber-300 py-2 text-sm font-bold text-emerald-950"
        >
          Reventar un globo
        </button>
      ) : null}
      {open ? (
        <SharedRsvpForm
          config={config}
          isMuted={isMuted}
          headingSlot={<h2 className="mb-3 text-xl font-extrabold">{config.rsvpHeading}</h2>}
        />
      ) : null}
    </div>
  );
}
