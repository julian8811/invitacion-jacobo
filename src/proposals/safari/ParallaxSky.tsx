import { SAFARI_SUNRISE_SRC } from '../assets';

interface ParallaxSkyProps {
  readonly tiltX: number;
  readonly tiltY: number;
  readonly scrollY: number;
  readonly reducedMotion: boolean;
}

export function ParallaxSky({ tiltX, tiltY, scrollY, reducedMotion }: ParallaxSkyProps) {
  const layer = (depth: number) =>
    reducedMotion
      ? undefined
      : {
          transform: `translate3d(${tiltX * depth}px, ${tiltY * depth * 0.35 + scrollY * depth * 0.04}px, 0)`,
        };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-[-8%] bg-cover bg-center"
        style={{
          ...layer(6),
          backgroundImage: `linear-gradient(180deg, rgba(255,170,90,0.35), rgba(20,40,28,0.45)), url(${SAFARI_SUNRISE_SRC})`,
        }}
      />
      <div
        className="absolute inset-x-[-10%] top-[28%] h-[45%]"
        style={layer(12)}
      >
        <svg viewBox="0 0 1200 320" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M0 220 C120 160 180 200 280 170 C380 140 420 90 520 120 C620 150 700 80 820 110 C940 140 1020 90 1200 130 L1200 320 L0 320 Z"
            fill="#2F4A38"
            opacity="0.85"
          />
          <path
            d="M0 250 C150 210 260 240 360 220 C480 195 560 150 680 180 C820 215 940 160 1200 200 L1200 320 L0 320 Z"
            fill="#1B4332"
          />
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[38%]" style={layer(22)}>
        <div className="h-full w-full bg-gradient-to-t from-[#C4A46A] via-[#D7B87A] to-transparent" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 40%, rgba(90,60,20,0.25) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(90,60,20,0.2) 0 1px, transparent 2px)',
            backgroundSize: '18px 18px, 26px 26px',
          }}
        />
      </div>
      <div className="safari-dust absolute inset-0 opacity-50" style={layer(30)} />
    </div>
  );
}
