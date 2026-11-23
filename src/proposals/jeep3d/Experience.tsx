import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { JACOBO_MEMORIES } from '../../data/memories';
import { animalById, type RealisticAnimalId } from '../assets';
import { playAnimalSound, playBalloonPopSound, playEnvelopeOpenChime } from '../../utils/soundEffects';
import { Fallback2D } from './Fallback2D';
import { CountdownPanel, LocationPanel, MemoriesPanel, RsvpPanel, WelcomePanel } from './Panels';
import { useWebGLSupport } from './useWebGLSupport';

const Scene = lazy(() => import('./Scene'));

const CHAPTERS = ['Bienvenida', 'Cuenta regresiva', 'Recuerdos', 'Ubicación', 'Fiesta'] as const;

export interface JeepExpeditionExperienceProps {
  config: EventConfig;
  isMuted: boolean;
  onToggleMute: () => void;
}

function Experience3D({ config, isMuted, onToggleMute }: JeepExpeditionExperienceProps) {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const progressRef = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [memoryIndex, setMemoryIndex] = useState<number | null>(null);
  const [popRequest, setPopRequest] = useState(0);
  const counter = useRef(0);

  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight / 2;
      const centers = sectionRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      // centers are relative to the viewport; a chapter is "reached" when its center crosses mid.
      let f = 0;
      for (let i = 0; i < centers.length; i += 1) {
        if (centers[i] <= mid) {
          const next = centers[i + 1];
          f = next === undefined ? i : i + (mid - centers[i]) / (next - centers[i]);
        }
      }
      progressRef.current = Math.min(Math.max(f, 0), CHAPTERS.length - 1);
      setChapter(Math.round(progressRef.current));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const touchAnimal = useCallback(
    (id: RealisticAnimalId) => {
      playAnimalSound(animalById(id).sound, isMuted);
      setMemoryIndex(counter.current % JACOBO_MEMORIES.length);
      counter.current += 1;
    },
    [isMuted],
  );

  const popBalloon = useCallback(() => playBalloonPopSound(isMuted), [isMuted]);

  const lastChapter = useRef(0);
  useEffect(() => {
    if (chapter === CHAPTERS.length - 1 && lastChapter.current !== chapter) {
      playEnvelopeOpenChime(isMuted);
    }
    lastChapter.current = chapter;
  }, [chapter, isMuted]);

  const goTo = (i: number) => sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const section = (i: number, node: React.ReactNode, align = 'justify-end') => (
    <section
      key={i}
      ref={(el) => {
        sectionRefs.current[i] = el;
      }}
      aria-label={CHAPTERS[i]}
      className={`pointer-events-none flex min-h-[100svh] flex-col items-center ${align} px-4 py-6`}
    >
      {node}
    </section>
  );

  return (
    <div className="relative bg-emerald-950">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Suspense fallback={null}>
          <Scene
            progressRef={progressRef}
            onAnimalTouch={touchAnimal}
            onBalloonPop={popBalloon}
            popRequest={popRequest}
          />
        </Suspense>
      </div>

      <div className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between p-3">
        <nav aria-label="Capítulos" className="flex gap-2 rounded-full bg-black/40 px-3 py-2">
          {CHAPTERS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a ${label}`}
              aria-current={chapter === i ? 'step' : undefined}
              className={`h-2.5 rounded-full transition-all ${chapter === i ? 'w-6 bg-amber-300' : 'w-2.5 bg-amber-100/50'}`}
            />
          ))}
        </nav>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          className="rounded-full bg-black/50 p-2.5 text-amber-100"
        >
          {isMuted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
        </button>
      </div>

      <main className="pointer-events-none relative z-10">
        {section(0, <WelcomePanel config={config} />)}
        {section(1, <CountdownPanel config={config} />)}
        {section(
          2,
          <MemoriesPanel
            memoryIndex={memoryIndex}
            onPickAnimal={touchAnimal}
            onClose={() => setMemoryIndex(null)}
          />,
        )}
        {section(3, <LocationPanel config={config} />)}
        {section(
          4,
          <RsvpPanel
            config={config}
            isMuted={isMuted}
            showBalloonHint
            onPopBalloon={() => {
              playBalloonPopSound(isMuted);
              setPopRequest((n) => n + 1);
            }}
          />,
          'justify-start pt-20',
        )}
      </main>
    </div>
  );
}

export function JeepExpeditionExperience(props: JeepExpeditionExperienceProps) {
  const { useFallback } = useWebGLSupport();
  if (useFallback) {
    return <Fallback2D {...props} />;
  }
  return <Experience3D {...props} />;
}

