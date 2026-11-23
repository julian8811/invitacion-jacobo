import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../config/event';

interface HeroVideoStageProps {
  readonly config: EventConfig;
  readonly isMuted: boolean;
  readonly autoPlayOnMount: boolean;
  readonly replaySignal: number;
  readonly onToggleMute: () => void;
}

const BUNTING_COLORS = ['#F07167', '#FCE085', '#6EB5DC', '#6EC498', '#F4B942', '#F07167', '#6EB5DC', '#FCE085'];

export function HeroVideoStage({
  config,
  isMuted,
  autoPlayOnMount,
  replaySignal,
  onToggleMute,
}: HeroVideoStageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlayOnMount) {
      return;
    }
    video.muted = isMuted;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        setIsPlaying(false);
      });
    }
  }, [autoPlayOnMount]);

  useEffect(() => {
    if (replaySignal === 0) {
      return;
    }
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => setIsPlaying(false));
    }
  }, [replaySignal]);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused || video.ended) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      video.pause();
    }
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) {
      return;
    }
    setProgressPct((video.currentTime / video.duration) * 100);
  };

  return (
    <header id="inicio" className="relative overflow-hidden px-4 pt-6 pb-8 sm:pt-9">
      {/* Sunlit storybook clouds */}
      <div aria-hidden="true" className="pointer-events-none mx-auto flex max-w-4xl justify-between opacity-75">
        <svg className="animate-cloud h-9 w-24 text-white" viewBox="0 0 120 52" fill="currentColor">
          <path d="M24 44h68a14 14 0 0 0 2-27.8A20 20 0 0 0 56 8a18 18 0 0 0-32 9.4A13 13 0 0 0 24 44Z" />
        </svg>
        <svg className="animate-cloud h-10 w-24 text-white" style={{ animationDelay: '1.5s' }} viewBox="0 0 120 52" fill="currentColor">
          <path d="M24 44h68a14 14 0 0 0 2-27.8A20 20 0 0 0 56 8a18 18 0 0 0-32 9.4A13 13 0 0 0 24 44Z" />
        </svg>
      </div>

      {/* Festive bunting flags on a hand-drawn garland curve */}
      <div aria-hidden="true" className="pointer-events-none mx-auto -mt-3 mb-4 flex max-w-3xl items-start justify-center gap-2.5 sm:gap-3.5">
        {BUNTING_COLORS.map((color, idx) => (
          <span
            key={idx}
            className="block h-0 w-0 border-x-[11px] border-t-[17px] border-x-transparent drop-shadow-sm"
            style={{
              borderTopColor: color,
              transform: `translateY(${Math.round(Math.sin((idx / (BUNTING_COLORS.length - 1)) * Math.PI) * 6)}px)`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Puppet-theater jungle video frame */}
        <div className="relative overflow-hidden rounded-[2rem] border-4 border-[#3F734D] bg-[#1e3d28] shadow-xl">
          <video
            ref={videoRef}
            src={config.videoSrc}
            poster={config.posterSrc}
            playsInline
            preload="metadata"
            aria-label={`Video de invitación de ${config.honoree}`}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setProgressPct(100);
            }}
            onTimeUpdate={handleTimeUpdate}
            className="aspect-video w-full bg-[#1e3d28] object-cover"
          >
            Tu navegador no soporta la reproducción de video HTML5.
          </video>

          {/* Warm tactile controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#244B32] px-3 py-2.5 text-[#FFF9EE] sm:px-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-b-2 border-[#b7831e] bg-[#F4B942] px-3 py-1.5 text-xs font-bold text-[#3b240f] transition hover:bg-[#fce085] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>

              <button
                type="button"
                onClick={handleReplay}
                aria-label="Reiniciar video"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-white/15 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Repetir</span>
              </button>
            </div>

            <div className="order-3 h-2 w-full overflow-hidden rounded-full bg-white/20 sm:order-2 sm:mx-2 sm:flex-1">
              <div
                className="h-full rounded-full bg-[#FCE085] transition-[width] duration-150"
                style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
              />
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar video'}
              className="order-2 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-white/15 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:order-3"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-[#F07167]" aria-hidden="true" /> : <Volume2 className="h-3.5 w-3.5 text-[#FCE085]" aria-hidden="true" />}
              <span>{isMuted ? 'Silenciado' : 'Con sonido'}</span>
            </button>
          </div>
        </div>

        {/* Hanging ropes connecting theater frame to wooden signboard */}
        <div aria-hidden="true" className="mx-auto flex max-w-md justify-between px-10">
          <div className="h-5 w-1.5 rounded-full bg-[#8c5a30]" />
          <div className="h-5 w-1.5 rounded-full bg-[#8c5a30]" />
        </div>

        {/* Painted wooden storybook signboard */}
        <div className="wooden-sign relative mx-auto max-w-2xl rounded-[2rem] px-5 py-7 text-center text-[#FFF8E8] sm:px-8 sm:py-8">
          <span aria-hidden="true" className="absolute top-3.5 left-4 h-3.5 w-3.5 rounded-full border border-[#FCE085]/35 bg-[#3A210D]" />
          <span aria-hidden="true" className="absolute top-3.5 right-4 h-3.5 w-3.5 rounded-full border border-[#FCE085]/35 bg-[#3A210D]" />
          <span aria-hidden="true" className="absolute bottom-3.5 left-4 h-3.5 w-3.5 rounded-full border border-[#FCE085]/35 bg-[#3A210D]" />
          <span aria-hidden="true" className="absolute right-4 bottom-3.5 h-3.5 w-3.5 rounded-full border border-[#FCE085]/35 bg-[#3A210D]" />

          <p className="font-hand text-xl text-[#FCE085]">
            Acompaña a nuestro pequeño explorador
          </p>
          <h1 className="font-display mt-0.5 text-4xl font-extrabold tracking-tight text-[#FFF8E8] drop-shadow sm:text-5xl">
            {config.eventTitle}
          </h1>
          <p className="font-display text-3xl font-bold text-[#FCE085] drop-shadow sm:text-4xl">
            {config.honoree}
          </p>
          <p className="mt-1.5 text-base font-bold text-[#FFE8C8] sm:text-lg">
            {config.subtitle}
          </p>
        </div>

        {/* Gently tilted scrapbook paper tickets instead of boxy dark grids */}
        <div className="mx-auto mt-5 grid max-w-2xl gap-3.5 text-left sm:grid-cols-3">
          <div className="scrapbook-tag rounded-2xl p-4 sm:-rotate-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[#3F734D]">
              <Calendar className="h-4 w-4 shrink-0 text-[#F07167]" aria-hidden="true" />
              <span>Fecha</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#4e2e14]">{config.dateDisplay}</p>
          </div>

          <div className="scrapbook-tag rounded-2xl p-4 sm:translate-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[#3F734D]">
              <Clock className="h-4 w-4 shrink-0 text-[#F4B942]" aria-hidden="true" />
              <span>Hora</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#4e2e14]">{config.timeDisplay}</p>
          </div>

          <div className="scrapbook-tag rounded-2xl p-4 sm:rotate-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[#3F734D]">
              <MapPin className="h-4 w-4 shrink-0 text-[#6EB5DC]" aria-hidden="true" />
              <span>Lugar</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#4e2e14]">
              {config.venueSpace} · {config.venueName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
