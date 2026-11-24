import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { useParallaxTilt } from '../../hooks/useParallaxTilt';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SAFARI_SUNRISE_SRC } from '../assets';
import { InteractiveAnimals } from './InteractiveAnimals';
import { ParallaxSky } from './ParallaxSky';

interface SafariHeroProps {
  readonly config: EventConfig;
  readonly isMuted: boolean;
  readonly onToggleMute: () => void;
  readonly replaySignal: number;
}

export function SafariHero({
  config,
  isMuted,
  onToggleMute,
  replaySignal,
}: SafariHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const tilt = useParallaxTilt(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.muted = isMuted;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => setIsPlaying(false));
    }
  }, []);

  useEffect(() => {
    if (replaySignal === 0) {
      return;
    }
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = 0;
    video.play()?.catch(() => setIsPlaying(false));
  }, [replaySignal]);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused || video.ended) {
      video.play()?.catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  };

  return (
    <header id="inicio" className="relative overflow-hidden">
      <div className="relative min-h-[42vh] w-full sm:min-h-[48vh]">
        <ParallaxSky
          tiltX={tilt.x}
          tiltY={tilt.y}
          scrollY={scrollY}
          reducedMotion={reducedMotion}
        />
      </div>

      <div className="relative z-10 -mt-16 w-full px-3 pb-4 sm:-mt-20 sm:px-4">
        <div className="mx-auto w-full max-w-5xl">
          <div className="relative w-full overflow-hidden rounded-[1.75rem] border-4 border-[#6F4220] bg-[#163527] shadow-xl">
            <video
              ref={videoRef}
              src={config.videoSrc}
              poster={SAFARI_SUNRISE_SRC}
              playsInline
              preload="metadata"
              aria-label={`Video de invitación de ${config.honoree}`}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={() => {
                const video = videoRef.current;
                if (!video || !video.duration || Number.isNaN(video.duration)) {
                  return;
                }
                setProgressPct((video.currentTime / video.duration) * 100);
              }}
              className="aspect-video w-full object-cover"
            />

            <div className="flex w-full flex-wrap items-center gap-2 bg-[#0F241A] px-3 py-2.5 sm:flex-nowrap">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-white/15 px-2.5 py-1.5 text-xs font-bold text-white"
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
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) {
                    return;
                  }
                  video.currentTime = 0;
                  video.play()?.catch(() => setIsPlaying(false));
                }}
                aria-label="Reiniciar video"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-white/15 px-2.5 py-1.5 text-xs font-bold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Repetir</span>
              </button>
              <div className="order-3 h-2 w-full overflow-hidden rounded-full bg-white/20 sm:order-2 sm:mx-2 sm:flex-1">
                <div
                  className="h-full rounded-full bg-[#FCE085] transition-[width] duration-150"
                  style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
                />
              </div>
              <button
                type="button"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                className="order-2 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-white/15 px-2.5 py-1.5 text-xs font-bold text-white sm:order-3"
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

          <div className="explorer-wood-plaque relative mt-4 w-full rounded-[1.75rem] px-5 py-6 text-center text-[#FFF8E8] sm:px-8 sm:py-7">
            <p className="font-hand text-xl text-[#FCE085]">Expedición primer añito de Jacobo</p>
            <h1 className="font-display mt-0.5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {config.eventTitle}
            </h1>
            <p className="font-display text-3xl font-bold text-[#FCE085] sm:text-4xl">
              {config.honoree}
            </p>
            <p className="mt-1.5 text-base font-bold text-[#FBE8C2] sm:text-lg">{config.subtitle}</p>
          </div>

          <div className="mt-4 grid w-full gap-3 sm:grid-cols-3">
            <div className="explorer-stamp w-full rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#235B8C]">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Fecha</span>
              </div>
              <p className="mt-1 text-sm font-bold text-[#3D240F]">{config.dateDisplay}</p>
            </div>
            <div className="explorer-stamp w-full rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#B4691E]">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Hora</span>
              </div>
              <p className="mt-1 text-sm font-bold text-[#3D240F]">{config.timeDisplay}</p>
            </div>
            <div className="explorer-stamp w-full rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#1B4332]">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Lugar</span>
              </div>
              <p className="mt-1 text-sm font-bold text-[#3D240F]">
                {config.venueSpace} · {config.venueName}
              </p>
            </div>
          </div>

          <InteractiveAnimals config={config} isMuted={isMuted} />
        </div>
      </div>
    </header>
  );
}
