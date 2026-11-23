let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const AudioCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) {
    return null;
  }
  if (!sharedAudioCtx) {
    try {
      sharedAudioCtx = new AudioCtor();
    } catch {
      return null;
    }
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => undefined);
  }
  return sharedAudioCtx;
}

function playToneSequence(
  notes: readonly { freq: number; duration: number; delay: number; type?: OscillatorType }[],
  gainPeak = 0.08,
): void {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }
  const now = ctx.currentTime;

  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = note.type ?? 'triangle';
    osc.frequency.setValueAtTime(note.freq, now + note.delay);

    gain.gain.setValueAtTime(0.0001, now + note.delay);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + note.delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.delay + note.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + note.delay);
    osc.stop(now + note.delay + note.duration + 0.02);
  }
}

export function playEnvelopeOpenChime(isMuted: boolean): void {
  if (isMuted) {
    return;
  }
  playToneSequence([
    { freq: 523.25, duration: 0.14, delay: 0 },
    { freq: 659.25, duration: 0.14, delay: 0.08 },
    { freq: 783.99, duration: 0.18, delay: 0.16 },
    { freq: 1046.5, duration: 0.28, delay: 0.25 },
  ]);
}

export function playBalloonPopSound(isMuted: boolean): void {
  if (isMuted) {
    return;
  }
  playToneSequence(
    [
      { freq: 620, duration: 0.06, delay: 0, type: 'sine' },
      { freq: 920, duration: 0.08, delay: 0.03, type: 'triangle' },
    ],
    0.09,
  );
}
