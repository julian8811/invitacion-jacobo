import { describe, expect, it } from 'vitest';
import { getCountdownSnapshot } from './countdown';

const START_ISO = '2026-12-13T15:00:00-05:00';
const END_ISO = '2026-12-13T19:00:00-05:00';

describe('getCountdownSnapshot', () => {
  it('computes exact days, hours, minutes, and seconds before the 3 PM celebration in America/Bogota', () => {
    const now = new Date('2026-11-23T11:44:18-05:00');
    expect(getCountdownSnapshot(START_ISO, END_ISO, now)).toEqual({
      phase: 'upcoming',
      days: 20,
      hours: 3,
      minutes: 15,
      seconds: 42,
    });
  });

  it('keeps phase upcoming on the event morning before 3:00 PM Bogota time', () => {
    const now = new Date('2026-12-13T10:00:00-05:00');
    expect(getCountdownSnapshot(START_ISO, END_ISO, now)).toEqual({
      phase: 'upcoming',
      days: 0,
      hours: 5,
      minutes: 0,
      seconds: 0,
    });
  });

  it('returns today phase with zeroed counters during the celebration window', () => {
    const now = new Date('2026-12-13T16:30:00-05:00');
    expect(getCountdownSnapshot(START_ISO, END_ISO, now)).toEqual({
      phase: 'today',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('returns past phase with zeroed counters after the celebration ends', () => {
    const now = new Date('2026-12-13T20:00:00-05:00');
    expect(getCountdownSnapshot(START_ISO, END_ISO, now)).toEqual({
      phase: 'past',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});
