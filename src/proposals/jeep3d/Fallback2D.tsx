import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import { JACOBO_MEMORIES } from '../../data/memories';
import { animalById, type RealisticAnimalId } from '../assets';
import { playAnimalSound } from '../../utils/soundEffects';
import { CountdownPanel, LocationPanel, MemoriesPanel, RsvpPanel, WelcomePanel } from './Panels';

export interface Fallback2DProps {
  readonly config: EventConfig;
  readonly isMuted: boolean;
  readonly onToggleMute: () => void;
}

/** Plain scroll version with a CSS jungle theme; no WebGL, no heavy motion. */
export function Fallback2D({ config, isMuted, onToggleMute }: Fallback2DProps) {
  const [memoryIndex, setMemoryIndex] = useState<number | null>(null);
  const [counter, setCounter] = useState(0);

  const pick = (id: RealisticAnimalId) => {
    playAnimalSound(animalById(id).sound, isMuted);
    setMemoryIndex(counter % JACOBO_MEMORIES.length);
    setCounter((c) => c + 1);
  };

  return (
    <div
      className="relative min-h-screen text-amber-50"
      style={{
        background:
          'radial-gradient(circle at 20% 0%, #f59e0b55, transparent 40%), linear-gradient(180deg, #14532d 0%, #064e3b 45%, #022c22 100%)',
      }}
    >
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        className="fixed right-3 top-3 z-20 rounded-full bg-black/50 p-2.5 text-amber-100"
      >
        {isMuted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
      </button>
      <main className="mx-auto flex max-w-md flex-col items-center gap-8 px-4 py-14">
        <WelcomePanel config={config} />
        <CountdownPanel config={config} />
        <MemoriesPanel memoryIndex={memoryIndex} onPickAnimal={pick} onClose={() => setMemoryIndex(null)} />
        <LocationPanel config={config} />
        <RsvpPanel config={config} isMuted={isMuted} showBalloonHint={false} />
      </main>
    </div>
  );
}
