import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { EXPLORER_THEME } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';

interface HeroVideoStageProps {
  readonly config: EventConfig;
  readonly theme?: ProposalTheme;
  readonly isMuted: boolean;
  readonly autoPlayOnMount: boolean;
  readonly replaySignal: number;
  readonly onToggleMute: () => void;
}

export function HeroVideoStage({
  config,
  theme = EXPLORER_THEME,
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
    <header id="inicio" className="relative overflow-hidden px-4 pt-6 pb-8 sm:pt-8">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[2rem] border-4 border-[#6F4220] bg-[#163527] shadow-xl">
          <video
            ref={videoRef}
            src={config.videoSrc}
            poster={theme.assets.heroScene}
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
            className="aspect-video w-full bg-[#10291D] object-cover"
          >
            Tu navegador no soporta la reproducción de video HTML5.
          </video>

          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1B4332] px-3 py-2.5 text-[#FFF9EE] sm:px-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-b-2 border-[#AD7713] bg-[#E09F24] px-3 py-1.5 text-xs font-extrabold text-[#281809] transition hover:bg-[#f1b640] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                )}
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
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-[#F6BD3A]" aria-hidden="true" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#8BE0A4]" aria-hidden="true" />
              )}
              <span>{isMuted ? 'Silenciado' : 'Con sonido'}</span>
            </button>
          </div>
        </div>

        <div aria-hidden="true" className="mx-auto flex max-w-md justify-between px-10">
          <div className="h-5 w-1.5 rounded-full bg-[#7C4A21]" />
          <div className="h-5 w-1.5 rounded-full bg-[#7C4A21]" />
        </div>

        <div className="explorer-wood-plaque relative mx-auto max-w-2xl rounded-[2rem] px-5 py-7 text-center text-[#FFF8E8] sm:px-8 sm:py-8">
          <span aria-hidden="true" className="absolute top-3.5 left-4 h-3.5 w-3.5 rounded-full border border-[#FCE085]/45 bg-[#2A1708]" />
          <span aria-hidden="true" className="absolute top-3.5 right-4 h-3.5 w-3.5 rounded-full border border-[#FCE085]/45 bg-[#2A1708]" />
          <span aria-hidden="true" className="absolute bottom-3.5 left-4 h-3.5 w-3.5 rounded-full border border-[#FCE085]/45 bg-[#2A1708]" />
          <span aria-hidden="true" className="absolute right-4 bottom-3.5 h-3.5 w-3.5 rounded-full border border-[#FCE085]/45 bg-[#2A1708]" />

          <p className="font-hand text-xl text-[#FCE085]">{theme.copy.heroEyebrow}</p>
          <h1 className="font-display mt-0.5 text-4xl font-extrabold tracking-tight text-[#FFF8E8] drop-shadow sm:text-5xl">
            {config.eventTitle}
          </h1>
          <p className="font-display text-3xl font-bold text-[#FCE085] drop-shadow sm:text-4xl">
            {config.honoree}
          </p>
          <p className="mt-1.5 text-base font-bold text-[#FBE8C2] sm:text-lg">{config.subtitle}</p>
        </div>

        <div className="mx-auto mt-5 grid max-w-2xl gap-3.5 text-left sm:grid-cols-3">
          <div className="explorer-stamp rounded-2xl p-4 sm:-rotate-1">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#235B8C]">
              <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Fecha</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#3D240F]">{config.dateDisplay}</p>
          </div>

          <div className="explorer-stamp rounded-2xl p-4 sm:translate-y-1">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#B4691E]">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Hora</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#3D240F]">{config.timeDisplay}</p>
          </div>

          <div className="explorer-stamp rounded-2xl p-4 sm:rotate-1">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#1B4332]">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Lugar</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#3D240F]">
              {config.venueSpace} · {config.venueName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
