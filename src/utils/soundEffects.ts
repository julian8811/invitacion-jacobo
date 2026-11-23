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

function playNoiseBurst(duration: number, gainPeak: number, filterFreq: number): void {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(gainPeak, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration + 0.02);
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

export function playPageTurnSound(isMuted: boolean): void {
  if (isMuted) {
    return;
  }
  playNoiseBurst(0.18, 0.05, 1800);
}

export function playStampSound(isMuted: boolean): void {
  if (isMuted) {
    return;
  }
  playToneSequence(
    [
      { freq: 140, duration: 0.08, delay: 0, type: 'square' },
      { freq: 90, duration: 0.12, delay: 0.04, type: 'sine' },
    ],
    0.1,
  );
}

export function playAnimalSound(
  kind: 'roar' | 'trumpet' | 'chew' | 'chatter' | 'snort',
  isMuted: boolean,
): void {
  if (isMuted) {
    return;
  }
  switch (kind) {
    case 'roar':
      playToneSequence(
        [
          { freq: 110, duration: 0.35, delay: 0, type: 'sawtooth' },
          { freq: 85, duration: 0.4, delay: 0.12, type: 'sine' },
        ],
        0.07,
      );
      playNoiseBurst(0.25, 0.04, 400);
      break;
    case 'trumpet':
      playToneSequence(
        [
          { freq: 320, duration: 0.18, delay: 0, type: 'sawtooth' },
          { freq: 480, duration: 0.22, delay: 0.1, type: 'triangle' },
          { freq: 260, duration: 0.2, delay: 0.28, type: 'sine' },
        ],
        0.08,
      );
      break;
    case 'chew':
      playToneSequence(
        [
          { freq: 220, duration: 0.08, delay: 0, type: 'triangle' },
          { freq: 180, duration: 0.08, delay: 0.1, type: 'triangle' },
          { freq: 200, duration: 0.1, delay: 0.2, type: 'sine' },
        ],
        0.05,
      );
      break;
    case 'chatter':
      playToneSequence(
        [
          { freq: 620, duration: 0.05, delay: 0, type: 'square' },
          { freq: 740, duration: 0.05, delay: 0.07, type: 'square' },
          { freq: 580, duration: 0.05, delay: 0.14, type: 'square' },
          { freq: 800, duration: 0.06, delay: 0.21, type: 'triangle' },
        ],
        0.05,
      );
      break;
    case 'snort':
      playNoiseBurst(0.14, 0.06, 700);
      playToneSequence([{ freq: 160, duration: 0.12, delay: 0, type: 'sine' }], 0.05);
      break;
    default:
      break;
  }
}

export function playJungleAmbienceBurst(isMuted: boolean): void {
  if (isMuted) {
    return;
  }
  playToneSequence(
    [
      { freq: 880, duration: 0.05, delay: 0, type: 'sine' },
      { freq: 990, duration: 0.05, delay: 0.2, type: 'sine' },
      { freq: 760, duration: 0.06, delay: 0.45, type: 'triangle' },
    ],
    0.025,
  );
}
