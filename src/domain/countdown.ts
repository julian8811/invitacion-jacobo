export type CountdownPhase = 'upcoming' | 'today' | 'past';

export interface CountdownSnapshot {
  readonly phase: CountdownPhase;
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

/**
 * Computes remaining time until an ISO-8601 instant (including fixed Bogota UTC-5 offset)
 * without drifting due to the guest browser's local timezone.
 */
export function getCountdownSnapshot(
  targetIso: string,
  endIso: string,
  now: Date = new Date(),
): CountdownSnapshot {
  const startMs = Date.parse(targetIso);
  const endMs = Date.parse(endIso);
  const currentMs = now.getTime();

  if (Number.isNaN(startMs) || Number.isNaN(endMs) || currentMs >= endMs) {
    return { phase: 'past', days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  if (currentMs >= startMs) {
    return { phase: 'today', days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diffMs = startMs - currentMs;
  const days = Math.floor(diffMs / MS_PER_DAY);
  const hours = Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((diffMs % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((diffMs % MS_PER_MINUTE) / MS_PER_SECOND);

  return { phase: 'upcoming', days, hours, minutes, seconds };
}
