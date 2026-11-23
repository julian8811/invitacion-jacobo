import { useState } from 'react';
import { fireSafeConfetti } from '../utils/confetti';
import { playBalloonPopSound } from '../utils/soundEffects';

interface InteractiveBalloonsProps {
  readonly isMuted?: boolean;
}

interface BalloonItem {
  readonly id: number;
  readonly color: string;
  readonly top: string;
  readonly sideClass: string;
  readonly delay: string;
  readonly mobileVisible: boolean;
}

const BALLOONS: readonly BalloonItem[] = [
  { id: 1, color: '#F07167', top: '10px', sideClass: 'left-2 sm:left-5 sm:top-[12%]', delay: '0s', mobileVisible: true },
  { id: 2, color: '#6EB5DC', top: '10px', sideClass: 'right-2 sm:right-5 sm:top-[18%]', delay: '0.6s', mobileVisible: true },
  { id: 3, color: '#FCE085', top: '44%', sideClass: 'left-2 sm:left-6', delay: '1.1s', mobileVisible: false },
  { id: 4, color: '#6EC498', top: '56%', sideClass: 'right-2 sm:right-6', delay: '1.7s', mobileVisible: false },
  { id: 5, color: '#F4B942', top: '72%', sideClass: 'left-2 sm:left-5', delay: '0.9s', mobileVisible: false },
  { id: 6, color: '#F07167', top: '80%', sideClass: 'right-2 sm:right-5', delay: '1.4s', mobileVisible: false },
];

export function InteractiveBalloons({ isMuted = false }: InteractiveBalloonsProps) {
  const [poppedIds, setPoppedIds] = useState<number[]>([]);

  const handlePop = (balloon: BalloonItem, clientX: number, clientY: number) => {
    if (poppedIds.includes(balloon.id)) {
      return;
    }
    setPoppedIds((prev) => [...prev, balloon.id]);
    playBalloonPopSound(isMuted);

    if (typeof window !== 'undefined') {
      fireSafeConfetti({
        particleCount: 22,
        spread: 55,
        startVelocity: 22,
        origin: {
          x: Math.min(0.95, Math.max(0.05, clientX / window.innerWidth)),
          y: Math.min(0.95, Math.max(0.05, clientY / window.innerHeight)),
        },
        colors: [balloon.color, '#FCE085', '#FFF9EE'],
      });
    }
  };

  const poppedCount = poppedIds.length;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {BALLOONS.map((balloon) => {
          if (poppedIds.includes(balloon.id)) {
            return null;
          }
          return (
            <button
              key={balloon.id}
              type="button"
              aria-label={`Explotar globo ${balloon.id}`}
              onClick={(event) => handlePop(balloon, event.clientX, event.clientY)}
              style={{ top: balloon.top, animationDelay: balloon.delay }}
              className={`animate-balloon pointer-events-auto fixed ${balloon.sideClass} ${
                balloon.mobileVisible ? 'flex' : 'hidden lg:flex'
              } h-12 w-9 cursor-pointer items-center justify-center transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32] lg:h-14 lg:w-10`}
            >
              <svg viewBox="0 0 40 58" className="h-full w-full drop-shadow">
                <ellipse cx="20" cy="20" rx="16" ry="19" fill={balloon.color} stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
                <ellipse cx="14" cy="13" rx="3.5" ry="6" transform="rotate(-18 14 13)" fill="rgba(255,255,255,0.48)" />
                <path d="M17 39 L23 39 L20 43 Z" fill={balloon.color} />
                <path d="M20 43 Q16 49 21 53 Q24 55 19 58" fill="none" stroke="#8C5A30" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* Zero-emoji SVG mini-balloon counter badge */}
      <div className="fixed bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-full border-2 border-[#d9bf94] bg-white/95 px-3 py-1.5 text-xs font-bold text-[#244B32] shadow-md backdrop-blur sm:bottom-5 sm:left-5">
        <svg viewBox="0 0 20 26" className="h-4 w-3.5 shrink-0" aria-hidden="true">
          <ellipse cx="10" cy="9.5" rx="7.5" ry="9" fill="#F07167" />
          <path d="M10 18.5 L10 25" stroke="#8C5A30" strokeWidth="1.5" />
        </svg>
        <span>
          Globos {poppedCount}/{BALLOONS.length}
        </span>
        {poppedCount > 0 && (
          <button
            type="button"
            onClick={() => setPoppedIds([])}
            className="cursor-pointer text-[#C64E45] underline underline-offset-2 hover:text-[#96332B]"
          >
            Reiniciar
          </button>
        )}
      </div>
    </>
  );
}
