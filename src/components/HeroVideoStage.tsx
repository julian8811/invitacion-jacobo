import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../config/event';

interface HeroVideoStageProps {
  readonly config: EventConfig;
  readonly isMuted: boolean;
  readonly autoPlayOnMount: boolean;
  readonly replaySignal: number;
  readonly onToggleMute: () => void;
}

const BUNTING_COLORS = ['#F07167', '#FCE085', '#7CC0E5', '#8FD4AE', '#F4B942', '#F07167', '#7CC0E5', '#FCE085'];

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
        // Browsers may block sound autoplay in automated/strict tabs; keep controls accessible.
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
    <header id="inicio" className="relative overflow-hidden px-4 pt-6 pb-8 sm:pt-10">
      {/* Festive bunting flags & warm fairy lights */}
      <div aria-hidden="true" className="pointer-events-none mx-auto mb-4 flex max-w-3xl items-center justify-center gap-3">
        {BUNTING_COLORS.map((color, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span
              className="animate-twinkle mb-1 h-2.5 w-2.5 rounded-full bg-[#FCE085]"
              style={{ animationDelay: `${idx * 0.22}s` }}
            />
            <span
              className="block h-0 w-0 border-x-[11px] border-t-[16px] border-x-transparent drop-shadow-sm"
              style={{ borderTopColor: color }}
            />
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Canopy-framed original video */}
        <div className="relative overflow-hidden rounded-[1.75rem] border-4 border-[#244B32] bg-[#173020] shadow-2xl">
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
            className="aspect-video w-full bg-[#173020] object-cover"
          >
            Tu navegador no soporta la reproducción de video HTML5.
          </video>

          {/* Accessible custom control bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1a3724]/95 px-3 py-2.5 text-[#FFF9EE] sm:px-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#F4B942] px-3 py-1.5 text-xs font-extrabold text-[#3b240f] transition hover:bg-[#fce085] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>

              <button
                type="button"
                onClick={handleReplay}
                aria-label="Reiniciar video"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Repetir</span>
              </button>
            </div>

            <div className="order-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20 sm:order-2 sm:mx-2 sm:flex-1">
              <div
                className="h-full rounded-full bg-[#FCE085] transition-[width] duration-150"
                style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
              />
            </div>

            <button
              type="button"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar video'}
              className="order-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:order-3"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 text-[#F07167]" aria-hidden="true" /> : <Volume2 className="h-3.5 w-3.5 text-[#FCE085]" aria-hidden="true" />}
              <span>{isMuted ? 'Silenciado' : 'Con sonido'}</span>
            </button>
          </div>
        </div>

        {/* Rustic wooden signboard faithful to the video's central sign */}
        <div className="wood-signboard relative mx-auto mt-4 max-w-2xl rounded-[1.75rem] px-5 py-7 text-center text-[#FFF8E8] sm:px-8 sm:py-9">
          <span aria-hidden="true" className="absolute top-3.5 left-4 h-3 w-3 rounded-full bg-[#3A210D] shadow-inner" />
          <span aria-hidden="true" className="absolute top-3.5 right-4 h-3 w-3 rounded-full bg-[#3A210D] shadow-inner" />
          <span aria-hidden="true" className="absolute bottom-3.5 left-4 h-3 w-3 rounded-full bg-[#3A210D] shadow-inner" />
          <span aria-hidden="true" className="absolute right-4 bottom-3.5 h-3 w-3 rounded-full bg-[#3A210D] shadow-inner" />

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#4E2E14]/75 px-3.5 py-1 text-xs font-extrabold tracking-wider text-[#FCE085] uppercase">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Celebración de Cumpleaños</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-[#FFF8E8] drop-shadow sm:text-5xl">
            {config.eventTitle}
          </h1>
          <p className="font-display mt-1 text-3xl font-bold text-[#FCE085] drop-shadow sm:text-4xl">
            {config.honoree}
          </p>
          <p className="mt-2 text-base font-bold text-[#FFE8C8] sm:text-lg">
            {config.subtitle}
          </p>

          <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-[#FCE085]/30 bg-[#4A2B13]/65 p-3.5">
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-[#FCE085] uppercase">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Fecha</span>
              </div>
              <p className="mt-1 text-sm font-bold text-white">{config.dateDisplay}</p>
            </div>

            <div className="rounded-2xl border border-[#FCE085]/30 bg-[#4A2B13]/65 p-3.5">
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-[#FCE085] uppercase">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Hora</span>
              </div>
              <p className="mt-1 text-sm font-bold text-white">{config.timeDisplay}</p>
            </div>

            <div className="rounded-2xl border border-[#FCE085]/30 bg-[#4A2B13]/65 p-3.5">
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-[#FCE085] uppercase">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Lugar</span>
              </div>
              <p className="mt-1 text-sm font-bold text-white">
                {config.venueSpace} · {config.venueName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
