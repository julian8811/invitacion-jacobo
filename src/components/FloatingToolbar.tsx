import { CheckCircle2, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface FloatingToolbarProps {
  readonly isMuted: boolean;
  readonly onToggleMute: () => void;
  readonly onReplayVideo: () => void;
}

export function FloatingToolbar({ isMuted, onToggleMute, onReplayVideo }: FloatingToolbarProps) {
  return (
    <nav
      aria-label="Accesos rápidos de la invitación"
      className="fixed right-3 bottom-3 z-30 flex items-center gap-1.5 rounded-full border-2 border-[#8BB174]/55 bg-[#244B32]/95 p-1.5 text-white shadow-xl backdrop-blur sm:right-5 sm:bottom-5"
    >
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-[#F07167]" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        onClick={onReplayVideo}
        aria-label="Volver a ver el video"
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-white/15 px-3 text-xs font-bold transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Ver video</span>
      </button>

      <a
        href="#rsvp"
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#F4B942] px-3.5 text-xs font-bold text-[#3b240f] shadow transition hover:bg-[#fce085] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Confirmar</span>
      </a>
    </nav>
  );
}
