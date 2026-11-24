import { useEffect, useState } from 'react';
import { getCountdownSnapshot, type CountdownSnapshot } from '../domain/countdown';

export function useCountdown(startIso: string, endIso: string): CountdownSnapshot {
  const [snapshot, setSnapshot] = useState<CountdownSnapshot>(() =>
    getCountdownSnapshot(startIso, endIso),
  );

  useEffect(() => {
    const tick = () => setSnapshot(getCountdownSnapshot(startIso, endIso));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [startIso, endIso]);

  return snapshot;
}
