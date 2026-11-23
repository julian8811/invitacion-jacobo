import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { PROPOSAL_BY_ID } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';

interface HeroVideoStageProps {
  readonly config: EventConfig;
  readonly theme?: ProposalTheme;
  readonly isMuted: boolean;
  readonly autoPlayOnMount: boolean;
  readonly replaySignal: number;
  readonly onToggleMute: () => void;
}

const SELVA_BUNTING = ['#2168B0', '#F5A623', '#0E8FA3', '#1E7E45', '#2168B0', '#F5A623', '#0E8FA3', '#1E7E45'];

export function HeroVideoStage({
  config,
  theme = PROPOSAL_BY_ID.explorador,
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

  const frameClass =
    theme.id === 'selva-viva'
      ? 'selva-bamboo-frame rounded-[2rem] bg-[#163826]'
      : theme.id === 'campamento'
        ? 'camp-lantern-frame rounded-[2rem] bg-[#0B2019]'
        : 'rounded-[2rem] border-4 border-[#6F4220] bg-[#163527] shadow-xl';

  const controlBarClass =
    theme.id === 'selva-viva'
      ? 'bg-[#2168B0] text-white'
      : theme.id === 'campamento'
        ? 'bg-[#0E281F] text-[#FDF7E6]'
        : 'bg-[#1B4332] text-[#FFF9EE]';

  const playButtonClass =
    theme.id === 'selva-viva'
      ? 'border-b-2 border-[#C27D0E] bg-[#F5A623] text-[#1D1508] hover:bg-[#fbbf4c]'
      : theme.id === 'campamento'
        ? 'border-b-2 border-[#A47212] bg-[#F6BD3A] text-[#112A20] hover:bg-[#f9cb5b]'
        : 'border-b-2 border-[#AD7713] bg-[#E09F24] text-[#281809] hover:bg-[#f1b640]';

  return (
    <header id="inicio" className="relative overflow-hidden px-4 pt-6 pb-8 sm:pt-8">
      {/* Proposal-specific top atmosphere ornament */}
      {theme.id === 'selva-viva' && (
        <>
          <div aria-hidden="true" className="pointer-events-none mx-auto flex max-w-4xl justify-between opacity-85">
            <svg className="animate-cloud h-9 w-24 text-white" viewBox="0 0 120 52" fill="currentColor">
              <path d="M24 44h68a14 14 0 0 0 2-27.8A20 20 0 0 0 56 8a18 18 0 0 0-32 9.4A13 13 0 0 0 24 44Z" />
            </svg>
            <svg
              className="animate-cloud h-10 w-24 text-white"
              style={{ animationDelay: '1.5s' }}
              viewBox="0 0 120 52"
              fill="currentColor"
            >
              <path d="M24 44h68a14 14 0 0 0 2-27.8A20 20 0 0 0 56 8a18 18 0 0 0-32 9.4A13 13 0 0 0 24 44Z" />
            </svg>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none mx-auto -mt-3 mb-4 flex max-w-3xl items-start justify-center gap-2.5 sm:gap-3.5"
          >
            {SELVA_BUNTING.map((color, idx) => (
              <span
                key={idx}
                className="block h-0 w-0 border-x-[11px] border-t-[17px] border-x-transparent drop-shadow-sm"
                style={{
                  borderTopColor: color,
                  transform: `translateY(${Math.round(Math.sin((idx / (SELVA_BUNTING.length - 1)) * Math.PI) * 6)}px)`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {theme.id === 'campamento' && (
        <div aria-hidden="true" className="pointer-events-none mx-auto mb-3 max-w-3xl">
          <svg viewBox="0 0 600 38" className="h-8 w-full" fill="none">
            <path d="M10 6 Q300 34 590 6" stroke="#D7A645" strokeWidth="2" strokeOpacity="0.65" />
            {[60, 140, 220, 300, 380, 460, 540].map((cx, i) => (
              <g key={cx} className="animate-firefly" style={{ animationDelay: `${i * 0.25}s` }}>
                <circle cx={cx} cy={i === 3 ? 20 : i === 2 || i === 4 ? 18 : 13} r="5.5" fill="#F6BD3A" />
                <circle cx={cx} cy={i === 3 ? 20 : i === 2 || i === 4 ? 18 : 13} r="10" fill="#F6BD3A" fillOpacity="0.22" />
              </g>
            ))}
          </svg>
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        {/* Video theater stage */}
        <div className={`relative overflow-hidden ${frameClass}`}>
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

          <div className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-4 ${controlBarClass}`}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${playButtonClass}`}
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

        {/* Connector ropes / timber struts */}
        <div aria-hidden="true" className="mx-auto flex max-w-md justify-between px-10">
          <div
            className={`h-5 w-1.5 rounded-full ${
              theme.id === 'campamento' ? 'bg-[#D7A645]' : 'bg-[#7C4A21]'
            }`}
          />
          <div
            className={`h-5 w-1.5 rounded-full ${
              theme.id === 'campamento' ? 'bg-[#D7A645]' : 'bg-[#7C4A21]'
            }`}
          />
        </div>

        {/* Proposal-specific main invitation plaque */}
        {theme.id === 'selva-viva' ? (
          <div className="relative mx-auto max-w-2xl rounded-[2rem] border-4 border-[#155C32] bg-gradient-to-b from-[#1E7E45] to-[#176437] px-5 py-7 text-center text-white shadow-xl sm:px-8 sm:py-8">
            <p className="inline-block rounded-full bg-[#2168B0] px-4 py-1 text-xs font-extrabold tracking-wide text-[#FFE066] shadow">
              {theme.copy.heroEyebrow}
            </p>
            <h1 className="font-display mt-2.5 text-4xl font-extrabold tracking-tight text-white drop-shadow sm:text-5xl">
              {config.eventTitle}
            </h1>
            <p className="font-display text-3xl font-bold text-[#FFE066] drop-shadow sm:text-4xl">
              {config.honoree}
            </p>
            <p className="mt-1.5 text-base font-bold text-[#DCFCE7] sm:text-lg">{config.subtitle}</p>
          </div>
        ) : theme.id === 'campamento' ? (
          <div className="relative mx-auto max-w-2xl rounded-[2rem] border-[3px] border-[#D7A645] bg-gradient-to-b from-[#1A4737] to-[#113126] px-5 py-7 text-center text-[#FDF7E6] shadow-2xl sm:px-8 sm:py-8">
            <p className="font-hand text-xl text-[#F6BD3A]">{theme.copy.heroEyebrow}</p>
            <h1 className="font-display mt-1 text-4xl font-extrabold tracking-tight text-[#FFFDF6] drop-shadow sm:text-5xl">
              {config.eventTitle}
            </h1>
            <p className="font-display text-3xl font-bold text-[#F6BD3A] drop-shadow sm:text-4xl">
              {config.honoree}
            </p>
            <p className="mt-1.5 text-base font-bold text-[#D9EFE2] sm:text-lg">{config.subtitle}</p>
          </div>
        ) : (
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
        )}

        {/* Quick-info cards */}
        <div className="mx-auto mt-5 grid max-w-2xl gap-3.5 text-left sm:grid-cols-3">
          {theme.id === 'campamento' ? (
            <>
              <div className="camp-parchment-card rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#173E31]">
                  <Calendar className="h-4 w-4 shrink-0 text-[#2B6CB0]" aria-hidden="true" />
                  <span>Fecha</span>
                </div>
                <p className="mt-1 text-sm font-extrabold text-[#112A20]">{config.dateDisplay}</p>
              </div>
              <div className="camp-parchment-card rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#173E31]">
                  <Clock className="h-4 w-4 shrink-0 text-[#D98A2B]" aria-hidden="true" />
                  <span>Hora</span>
                </div>
                <p className="mt-1 text-sm font-extrabold text-[#112A20]">{config.timeDisplay}</p>
              </div>
              <div className="camp-parchment-card rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#173E31]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#1E7E45]" aria-hidden="true" />
                  <span>Lugar</span>
                </div>
                <p className="mt-1 text-sm font-extrabold text-[#112A20]">
                  {config.venueSpace} · {config.venueName}
                </p>
              </div>
            </>
          ) : theme.id === 'selva-viva' ? (
            <>
              <div className="rounded-2xl border-2 border-[#93C5FD] border-b-4 bg-white p-4 shadow-md">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#2168B0]">
                  <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Fecha</span>
                </div>
                <p className="mt-1 text-sm font-extrabold text-[#163322]">{config.dateDisplay}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#FCD34D] border-b-4 bg-white p-4 shadow-md">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#B45309]">
                  <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Hora</span>
                </div>
                <p className="mt-1 text-sm font-extrabold text-[#163322]">{config.timeDisplay}</p>
              </div>
              <div className="rounded-2xl border-2 border-[#6EE7B7] border-b-4 bg-white p-4 shadow-md">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#1E7E45]">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Lugar</span>
                </div>
                <p className="mt-1 text-sm font-extrabold text-[#163322]">
                  {config.venueSpace} · {config.venueName}
                </p>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
