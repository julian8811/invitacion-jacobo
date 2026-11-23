import { useState } from 'react';
import { fireSafeConfetti } from '../utils/confetti';

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
  { id: 2, color: '#7CC0E5', top: '10px', sideClass: 'right-2 sm:right-5 sm:top-[18%]', delay: '0.6s', mobileVisible: true },
  { id: 3, color: '#FCE085', top: '44%', sideClass: 'left-2 sm:left-6', delay: '1.1s', mobileVisible: false },
  { id: 4, color: '#8FD4AE', top: '56%', sideClass: 'right-2 sm:right-6', delay: '1.7s', mobileVisible: false },
  { id: 5, color: '#F4B942', top: '72%', sideClass: 'left-2 sm:left-5', delay: '0.9s', mobileVisible: false },
  { id: 6, color: '#F07167', top: '80%', sideClass: 'right-2 sm:right-5', delay: '1.4s', mobileVisible: false },
];

export function InteractiveBalloons() {
  const [poppedIds, setPoppedIds] = useState<number[]>([]);

  const handlePop = (balloon: BalloonItem, clientX: number, clientY: number) => {
    if (poppedIds.includes(balloon.id)) {
      return;
    }
    setPoppedIds((prev) => [...prev, balloon.id]);

    if (typeof window !== 'undefined') {
      fireSafeConfetti({
        particleCount: 20,
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
              } h-10 w-8 cursor-pointer items-center justify-center rounded-full opacity-90 shadow-md transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32] lg:h-12 lg:w-9`}
            >
              <span
                className="block h-9 w-7 rounded-[50%_50%_48%_48%] border border-white/60 shadow-inner lg:h-11 lg:w-9"
                style={{ backgroundColor: balloon.color }}
              />
              <span className="absolute -bottom-3 h-4 w-[1.5px] bg-[#7D4F28]/45" />
            </button>
          );
        })}
      </div>

      {/* Unobtrusive counter badge opposite the floating action toolbar */}
      <div className="fixed bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-full border border-[#8BB174]/40 bg-white/92 px-2.5 py-1.5 text-[11px] font-extrabold text-[#244B32] shadow-md backdrop-blur sm:bottom-5 sm:left-5 sm:gap-2 sm:px-3 sm:text-xs">
        <span>🎈 {poppedCount}/{BALLOONS.length}</span>
        {poppedCount > 0 && (
          <button
            type="button"
            onClick={() => setPoppedIds([])}
            className="cursor-pointer text-[#F07167] underline underline-offset-2 hover:text-[#c94c42]"
          >
            Reiniciar
          </button>
        )}
      </div>
    </>
  );
}
