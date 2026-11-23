import { useState } from 'react';
import { Flame, RotateCcw, Wind } from 'lucide-react';
import { fireSafeConfetti } from '../utils/confetti';
import { playCandleCelebrationChime } from '../utils/soundEffects';

interface BirthdayCakeGameProps {
  readonly isMuted: boolean;
}

export function BirthdayCakeGame({ isMuted }: BirthdayCakeGameProps) {
  const [candleLit, setCandleLit] = useState(true);

  const handleBlowCandle = () => {
    if (!candleLit) {
      return;
    }
    setCandleLit(false);
    playCandleCelebrationChime(isMuted);
    fireSafeConfetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.68 },
      colors: ['#F4B942', '#F07167', '#6EB5DC', '#6EC498', '#FCE085'],
    });
  };

  return (
    <section aria-labelledby="cake-heading" className="px-4 py-6">
      <div className="storybook-card mx-auto max-w-3xl rounded-[2.25rem] p-6 text-center sm:p-8">
        <h2 id="cake-heading" className="font-display text-2xl font-bold text-[#5C371B] sm:text-3xl">
          Pide un deseo por Jacobo
        </h2>
        <p className="font-hand mt-1 text-lg text-[#3F734D]">
          {candleLit
            ? 'Toca la velita del añito 1 para soplarla juntos'
            : '¡Deseo pedido! Qué alegría celebrar contigo el primer añito de Jacobo.'}
        </p>

        {/* Handcrafted SVG Jungle Birthday Cake */}
        <div className="mx-auto mt-4 flex flex-col items-center">
          <button
            type="button"
            onClick={handleBlowCandle}
            aria-label={candleLit ? 'Soplar la velita del pastel' : 'Velita apagada'}
            className="group relative cursor-pointer rounded-3xl p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32]"
          >
            <svg viewBox="0 0 260 220" className="h-52 w-60 sm:h-56 sm:w-64">
              {/* Plate */}
              <ellipse cx="130" cy="196" rx="108" ry="14" fill="#E8D8BE" stroke="#C5AD89" strokeWidth="2" />

              {/* Bottom cake tier */}
              <rect x="44" y="130" width="172" height="62" rx="18" fill="#F8D29B" stroke="#C78A4A" strokeWidth="3" />
              <path
                d="M46 144 Q64 158 82 144 Q100 158 118 144 Q136 158 154 144 Q172 158 190 144 Q202 154 214 144 V136 Q214 130 206 130 H54 Q46 130 46 136 Z"
                fill="#FFFDF8"
              />
              <circle cx="75" cy="172" r="5" fill="#F07167" />
              <circle cx="110" cy="168" r="5" fill="#6EB5DC" />
              <circle cx="150" cy="174" r="5" fill="#6EC498" />
              <circle cx="185" cy="167" r="5" fill="#F4B942" />

              {/* Top cake tier */}
              <rect x="74" y="80" width="112" height="52" rx="16" fill="#F4A59B" stroke="#C86A60" strokeWidth="3" />
              <path
                d="M76 92 Q90 105 104 92 Q118 105 132 92 Q146 105 160 92 Q172 103 184 92 V86 Q184 80 176 80 H84 Q76 80 76 86 Z"
                fill="#FFFDF8"
              />

              {/* Leaf accents */}
              <ellipse cx="52" cy="186" rx="14" ry="7" transform="rotate(-22 52 186)" fill="#6EC498" stroke="#3F734D" strokeWidth="2" />
              <ellipse cx="208" cy="186" rx="14" ry="7" transform="rotate(22 208 186)" fill="#6EC498" stroke="#3F734D" strokeWidth="2" />

              {/* Golden number 1 candle */}
              <rect x="122" y="42" width="16" height="40" rx="5" fill="#FCE085" stroke="#C2881D" strokeWidth="2.5" />
              <path d="M126 52 L134 48 M126 64 L134 60 M126 74 L134 70" stroke="#D99829" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="129" y="34" width="2.5" height="9" rx="1" fill="#4E2E14" />

              {candleLit ? (
                <g className="animate-flame">
                  <path
                    d="M130 12 C139 22 140 32 130 35 C120 32 121 22 130 12 Z"
                    fill="#FF9F1C"
                  />
                  <path
                    d="M130 19 C134 25 135 31 130 33 C125 31 126 25 130 19 Z"
                    fill="#FFF3B0"
                  />
                </g>
              ) : (
                <g className="animate-smoke">
                  <circle cx="130" cy="24" r="5" fill="#B8B0A4" opacity="0.6" />
                  <circle cx="136" cy="14" r="7" fill="#CBC3B7" opacity="0.45" />
                </g>
              )}
            </svg>
          </button>

          <div className="mt-2">
            {candleLit ? (
              <button
                type="button"
                onClick={handleBlowCandle}
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-b-4 border-[#c04c43] bg-[#F07167] px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-[#e56358] active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c04c43]"
              >
                <Wind className="h-4 w-4" aria-hidden="true" />
                <span>Soplar la velita</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCandleLit(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-[#3F734D]/35 bg-white px-4 py-2.5 text-sm font-bold text-[#244B32] shadow-sm transition hover:bg-[#FFF9EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244B32]"
              >
                <Flame className="h-4 w-4 text-[#F4B942]" aria-hidden="true" />
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Volver a encender</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
