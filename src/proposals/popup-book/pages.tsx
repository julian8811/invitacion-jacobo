import { useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Navigation } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { JACOBO_MEMORIES, type SafariFrameAnimal } from '../../data/memories';
import { useCountdown } from '../../hooks/useCountdown';
import { SharedRsvpForm } from '../../components/shared/SharedRsvpForm';
import { PopUpFigure } from './PopUpFigure';

export interface PageProps {
  readonly config: EventConfig;
  readonly active: boolean;
  readonly reducedMotion: boolean;
  readonly isMuted: boolean;
}

const ANIMAL_IMAGE: Record<SafariFrameAnimal, string> = {
  lion: '/images/realistic/lion-cub.jpg',
  elephant: '/images/realistic/elephant-calf.jpg',
  giraffe: '/images/realistic/giraffe-calf.jpg',
  monkey: '/images/realistic/monkey-infant.jpg',
  toucan: '/images/realistic/zebra-foal.jpg',
};

function Heading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="mb-4 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[#2f5d3a]">{kicker}</p>
      <h2 className="mt-1 text-2xl font-bold text-[#4a3220]">{title}</h2>
      <div className="mx-auto mt-2 h-0.5 w-16 bg-[#b88f55]" aria-hidden="true" />
    </header>
  );
}

export function WelcomePage({ config, active, reducedMotion }: PageProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Heading kicker="Bienvenidos" title={config.eventTitle} />
      <p className="mb-3 text-sm italic">{config.introHeadline}</p>
      <div className="pb-kraft w-full max-w-xs rounded-lg p-2 shadow-lg">
        {active ? (
          <video
            src={config.videoSrc}
            poster={config.posterSrc}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full rounded bg-black object-cover"
          />
        ) : (
          <img src={config.posterSrc} alt={`Invitación de ${config.honoree}`} className="aspect-video w-full rounded object-cover" />
        )}
      </div>
      <PopUpFigure
        active={active}
        reducedMotion={reducedMotion}
        src="/images/realistic/elephant-calf.jpg"
        alt="Elefantito bebé"
        className="mt-6 w-32"
      />
      <p className="mt-5 text-base font-semibold">{config.subtitle}</p>
      <p className="text-sm">{config.honoree}</p>
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="pb-kraft rounded-md border border-[#8a6a3b] px-1 py-2 text-center shadow">
      <div className="text-2xl font-bold tabular-nums text-[#3b2612]">{String(value).padStart(2, '0')}</div>
      <div className="text-[10px] uppercase tracking-wider text-[#5a3d1c]">{label}</div>
    </div>
  );
}

export function DatePage({ config, active, reducedMotion }: PageProps) {
  const cd = useCountdown(config.startIso, config.endIso);
  return (
    <div className="flex flex-col items-center">
      <Heading kicker="Apunta en tu calendario" title="Fecha y hora" />
      <div className="space-y-2 text-center">
        <p className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Calendar size={20} className="text-[#2f5d3a]" aria-hidden="true" />
          {config.dateDisplay}
        </p>
        <p className="flex items-center justify-center gap-2 text-lg">
          <Clock size={20} className="text-[#2f5d3a]" aria-hidden="true" />
          {config.timeDisplay}
        </p>
      </div>
      <div className="mt-5 w-full max-w-xs" aria-live="off">
        {cd.phase === 'upcoming' ? (
          <div className="grid grid-cols-4 gap-2">
            <Unit value={cd.days} label="Días" />
            <Unit value={cd.hours} label="Horas" />
            <Unit value={cd.minutes} label="Min" />
            <Unit value={cd.seconds} label="Seg" />
          </div>
        ) : (
          <p className="pb-kraft rounded-md p-3 text-center font-bold text-[#3b2612]">
            {cd.phase === 'today' ? 'La fiesta es hoy' : 'Gracias por acompañarnos'}
          </p>
        )}
      </div>
      <PopUpFigure
        active={active}
        reducedMotion={reducedMotion}
        src="/images/realistic/safari-sunrise.jpg"
        alt="Amanecer en la sabana"
        className="mt-7 w-44"
        tilt={3}
      />
    </div>
  );
}

export function MemoriesPage({ active, reducedMotion }: PageProps) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const total = JACOBO_MEMORIES.length;
  const go = (d: number) => {
    setDir(d);
    setIdx((i) => (i + d + total) % total);
  };
  const m = JACOBO_MEMORIES[idx];
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) go(1);
    else if (info.offset.x > 50) go(-1);
  };

  return (
    <div className="flex flex-col items-center">
      <Heading kicker="Un año de aventuras" title="Jacobo mes a mes" />
      <div className="relative w-full max-w-xs">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={m.id}
            custom={dir}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={onDragEnd}
            initial={reducedMotion ? false : { opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -dir * 60 }}
            transition={{ duration: 0.25 }}
            className="relative touch-pan-y pb-24"
          >
            <PopUpFigure
              active={active}
              reducedMotion={reducedMotion}
              src={ANIMAL_IMAGE[m.animal]}
              alt={m.animalLabel}
              className="ml-auto mr-0 w-36"
              tilt={5}
            />
            <figure className="relative -mt-16 w-[78%] -rotate-3 bg-white p-2 pb-4 shadow-xl">
              <img
                src={m.imageSrc}
                alt={m.imageAlt}
                draggable={false}
                loading="lazy"
                style={{ objectPosition: m.objectPosition }}
                className="aspect-square w-full object-cover"
              />
              <figcaption className="mt-2 text-center text-sm font-semibold">{m.ageLabel}</figcaption>
            </figure>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="-mt-16 w-full max-w-xs text-center">
        <p className="text-xs uppercase tracking-widest text-[#2f5d3a]">{m.chapterLabel}</p>
        <h3 className="text-lg font-bold">{m.title}</h3>
        <p className="mt-1 text-sm leading-relaxed">{m.memoryText}</p>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button type="button" onClick={() => go(-1)} aria-label="Recuerdo anterior" className="pb-kraft rounded-full p-2 shadow">
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm tabular-nums">
          {idx + 1} / {total}
        </span>
        <button type="button" onClick={() => go(1)} aria-label="Recuerdo siguiente" className="pb-kraft rounded-full p-2 shadow">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export function PlacePage({ config, active }: PageProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Heading kicker="Cómo llegar" title="Lugar" />
      <p className="text-lg font-semibold">{config.venueName}</p>
      <p className="text-sm">{config.venueSpace}</p>
      <p className="mt-1 text-sm">
        {config.address}
        <br />
        {config.neighborhood}, {config.city}
      </p>
      <div className="pb-kraft mt-4 w-full max-w-sm rounded-lg p-2 shadow-lg">
        {active ? (
          <iframe
            title={`Mapa de ${config.venueName}`}
            src={config.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-52 w-full rounded border-0"
          />
        ) : (
          <div className="h-52 w-full rounded bg-[#e9dcbc]" />
        )}
      </div>
      <div className="mt-4 flex w-full max-w-sm gap-3">
        <a
          href={config.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2f5d3a] px-3 py-3 text-sm font-bold text-[#f6ecd6] shadow"
        >
          <MapPin size={18} aria-hidden="true" /> Google Maps
        </a>
        <a
          href={config.wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#4a3220] px-3 py-3 text-sm font-bold text-[#f6ecd6] shadow"
        >
          <Navigation size={18} aria-hidden="true" /> Waze
        </a>
      </div>
    </div>
  );
}

export function RsvpPage({ config, isMuted }: PageProps) {
  return (
    <div className="pb-rsvp">
      <Heading kicker="Sello de asistencia" title="Confirmación" />
      <div className="mb-3 flex justify-center">
        <span className="pb-stamp rounded-md px-3 py-1 text-sm font-bold uppercase tracking-widest text-[#8c2f2f]">
          Confirma aquí
        </span>
      </div>
      <SharedRsvpForm
        config={config}
        isMuted={isMuted}
        confettiColors={['#2f5d3a', '#c9a56e', '#8a6a3b', '#f6ecd6']}
        accentClassName="bg-[#2f5d3a] text-[#f6ecd6]"
      />
    </div>
  );
}
