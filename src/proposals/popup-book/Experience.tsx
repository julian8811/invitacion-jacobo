import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { playEnvelopeOpenChime, playPageTurnSound } from '../../utils/soundEffects';
import { BookCover } from './BookCover';
import { Leaf } from './PageTurn';
import { DatePage, MemoriesPage, PlacePage, RsvpPage, WelcomePage, type PageProps } from './pages';
import './popup-book.css';

interface PopupBookExperienceProps {
  readonly config: EventConfig;
  readonly isMuted: boolean;
  readonly onToggleMute: () => void;
}

const CHAPTERS: readonly {
  readonly id: string;
  readonly tab: string;
  readonly Page: (p: PageProps) => ReactElement;
}[] = [
  { id: 'bienvenida', tab: 'Inicio', Page: WelcomePage },
  { id: 'fecha', tab: 'Fecha', Page: DatePage },
  { id: 'recuerdos', tab: 'Mes a mes', Page: MemoriesPage },
  { id: 'lugar', tab: 'Lugar', Page: PlacePage },
  { id: 'confirmacion', tab: 'Confirmar', Page: RsvpPage },
];

const AUTO_READ_MS = 6000;

export function PopupBookExperience({ config, isMuted, onToggleMute }: PopupBookExperienceProps) {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [silent, setSilent] = useState(false);
  const [current, setCurrent] = useState(0);
  const [autoRead, setAutoRead] = useState(false);
  const total = CHAPTERS.length;
  const effectiveMuted = isMuted || silent;

  const goTo = useCallback(
    (next: number) => {
      const target = Math.max(0, Math.min(total - 1, next));
      if (target === current) return;
      playPageTurnSound(effectiveMuted);
      setCurrent(target);
    },
    [current, total, effectiveMuted],
  );

  const handleOpen = (quiet: boolean) => {
    setSilent(quiet);
    playEnvelopeOpenChime(isMuted || quiet);
    setOpened(true);
  };

  useEffect(() => {
    if (!autoRead || !opened) return;
    if (current >= total - 1) {
      setAutoRead(false);
      return;
    }
    const timer = window.setTimeout(() => goTo(current + 1), AUTO_READ_MS);
    return () => window.clearTimeout(timer);
  }, [autoRead, opened, current, total, goTo]);

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowLeft') goTo(current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [opened, current, goTo]);

  const muteBtn = (
    <button
      type="button"
      onClick={() => {
        setSilent(false);
        onToggleMute();
      }}
      aria-label={effectiveMuted ? 'Activar sonido' : 'Silenciar sonido'}
      className="pb-kraft rounded-full border border-[#6b4a22] p-2.5 text-[#3b2612] shadow-lg"
    >
      {effectiveMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );

  return (
    <div className="pb-root pb-table relative min-h-dvh w-full overflow-hidden">
      <div className="pb-vignette absolute inset-0" aria-hidden="true" />

      {!opened ? (
        <BookCover config={config} reducedMotion={reduced} onOpen={handleOpen} />
      ) : (
        <motion.main
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center px-3 py-4"
        >
          <div className="mb-3 flex w-full items-center justify-between">
            <p className="pb-deboss truncate text-sm font-bold text-[#f3dfb0]">{config.honoree}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAutoRead((v) => !v)}
                aria-pressed={autoRead}
                aria-label={autoRead ? 'Pausar lectura automática' : 'Iniciar lectura automática'}
                className="pb-kraft flex items-center gap-1.5 rounded-full border border-[#6b4a22] px-3 py-2 text-xs font-bold text-[#3b2612] shadow-lg"
              >
                {autoRead ? <Pause size={16} /> : <Play size={16} />}
                {autoRead ? 'Pausar' : 'Lectura automática'}
              </button>
              {muteBtn}
            </div>
          </div>

          <div className="relative w-full pr-9">
            <div
              className="pb-kraft relative h-[min(72dvh,640px)] w-full rounded-r-2xl rounded-l-md p-2 shadow-2xl"
              style={{ perspective: 1800 }}
            >
              <div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
                {CHAPTERS.map(({ id, Page }, i) => (
                  <Leaf
                    key={id}
                    index={i}
                    current={current}
                    total={total}
                    reducedMotion={reduced}
                    label={CHAPTERS[i].tab}
                  >
                    <Page config={config} active={i === current} reducedMotion={reduced} isMuted={effectiveMuted} />
                  </Leaf>
                ))}
              </div>
            </div>

            <nav aria-label="Capítulos" className="absolute right-0 top-6 flex flex-col gap-2">
              {CHAPTERS.map(({ id, tab }, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === current ? 'page' : undefined}
                  className={`pb-kraft w-9 rounded-r-md border border-l-0 border-[#6b4a22] py-3 text-[10px] font-bold uppercase tracking-wider shadow transition-transform ${
                    i === current ? 'translate-x-1 bg-[#2f5d3a] text-[#f6ecd6]' : 'text-[#3b2612]'
                  }`}
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4 flex items-center gap-5">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              aria-label="Página anterior"
              className="pb-kraft rounded-full border border-[#6b4a22] p-3 shadow-lg disabled:opacity-40"
            >
              <ChevronLeft size={22} />
            </button>
            <span className="pb-deboss text-sm text-[#f3dfb0]">
              {current + 1} de {total}
            </span>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              disabled={current === total - 1}
              aria-label="Página siguiente"
              className="pb-kraft rounded-full border border-[#6b4a22] p-3 shadow-lg disabled:opacity-40"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </motion.main>
      )}
    </div>
  );
}

