import { useState } from 'react';
import { EXPLORER_THEME } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';
import { fireSafeConfetti } from '../utils/confetti';
import { playBalloonPopSound } from '../utils/soundEffects';

interface InteractiveBalloonsProps {
  readonly theme?: ProposalTheme;
  readonly isMuted?: boolean;
}

interface BalloonPosition {
  readonly id: number;
  readonly top: string;
  readonly sideClass: string;
  readonly delay: string;
  readonly mobileVisible: boolean;
}

const BALLOON_POSITIONS: readonly BalloonPosition[] = [
  { id: 1, top: '14px', sideClass: 'left-1 sm:left-5 sm:top-[14%]', delay: '0s', mobileVisible: true },
  { id: 2, top: '14px', sideClass: 'right-1 sm:right-5 sm:top-[20%]', delay: '0.6s', mobileVisible: true },
  { id: 3, top: '44%', sideClass: 'left-2 sm:left-6', delay: '1.1s', mobileVisible: false },
  { id: 4, top: '56%', sideClass: 'right-2 sm:right-6', delay: '1.7s', mobileVisible: false },
  { id: 5, top: '72%', sideClass: 'left-2 sm:left-5', delay: '0.9s', mobileVisible: false },
  { id: 6, top: '80%', sideClass: 'right-2 sm:right-5', delay: '1.4s', mobileVisible: false },
];

export function InteractiveBalloons({
  theme = EXPLORER_THEME,
  isMuted = false,
}: InteractiveBalloonsProps) {
  const [poppedIds, setPoppedIds] = useState<number[]>([]);

  const handlePop = (balloonId: number, color: string, clientX: number, clientY: number) => {
    if (poppedIds.includes(balloonId)) {
      return;
    }
    setPoppedIds((prev) => [...prev, balloonId]);
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
        colors: [color, ...theme.confettiColors.slice(0, 2)],
      });
    }
  };

  const poppedCount = poppedIds.length;
  const primaryBalloonColor = theme.balloonColors[0] ?? '#1B4332';

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {BALLOON_POSITIONS.map((balloon, idx) => {
          if (poppedIds.includes(balloon.id)) {
            return null;
          }
          const color = theme.balloonColors[idx % theme.balloonColors.length];
          return (
            <button
              key={balloon.id}
              type="button"
              aria-label={`Explotar globo ${balloon.id}`}
              onClick={(event) => handlePop(balloon.id, color, event.clientX, event.clientY)}
              style={{ top: balloon.top, animationDelay: balloon.delay }}
              className={`animate-balloon pointer-events-auto fixed ${balloon.sideClass} ${
                balloon.mobileVisible ? 'flex' : 'hidden lg:flex'
              } h-10 w-7 cursor-pointer items-center justify-center transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332] lg:h-14 lg:w-10`}
            >
              <svg viewBox="0 0 40 58" className="h-full w-full drop-shadow">
                <ellipse
                  cx="20"
                  cy="20"
                  rx="16"
                  ry="19"
                  fill={color}
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="14"
                  cy="13"
                  rx="3.5"
                  ry="6"
                  transform="rotate(-18 14 13)"
                  fill="rgba(255,255,255,0.45)"
                />
                <path d="M17 39 L23 39 L20 43 Z" fill={color} />
                <path
                  d="M20 43 Q16 49 21 53 Q24 55 19 58"
                  fill="none"
                  stroke="#8C5A30"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-full border-2 border-[#8B6136]/45 bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-[#1B4332] shadow-md backdrop-blur sm:bottom-5 sm:left-5 sm:px-3 sm:text-xs">
        <svg viewBox="0 0 20 26" className="h-4 w-3.5 shrink-0" aria-hidden="true">
          <ellipse cx="10" cy="9.5" rx="7.5" ry="9" fill={primaryBalloonColor} />
          <path d="M10 18.5 L10 25" stroke="#8C5A30" strokeWidth="1.5" />
        </svg>
        <span>
          <span className="hidden sm:inline">Globos </span>
          {poppedCount}/{BALLOON_POSITIONS.length}
        </span>
        {poppedCount > 0 && (
          <button
            type="button"
            onClick={() => setPoppedIds([])}
            className="cursor-pointer text-[#235B8C] underline underline-offset-2 hover:text-[#153C5E]"
          >
            Reiniciar
          </button>
        )}
      </div>
    </>
  );
}
