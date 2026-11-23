interface AudioGraph {
  readonly ctx: AudioContext;
  readonly master: GainNode;
  readonly reverbSend: GainNode;
}

let graph: AudioGraph | null = null;

function buildImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

function getGraph(): AudioGraph | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const AudioCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) {
    return null;
  }
  if (!graph) {
    try {
      const ctx = new AudioCtor();
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.004;
      compressor.release.value = 0.2;

      const master = ctx.createGain();
      master.gain.value = 0.85;

      const reverb = ctx.createConvolver();
      reverb.buffer = buildImpulse(ctx, 1.6, 2.6);
      const reverbSend = ctx.createGain();
      reverbSend.gain.value = 0.22;

      master.connect(compressor);
      reverbSend.connect(reverb);
      reverb.connect(compressor);
      compressor.connect(ctx.destination);
      graph = { ctx, master, reverbSend };
    } catch {
      return null;
    }
  }
  if (graph.ctx.state === 'suspended') {
    graph.ctx.resume().catch(() => undefined);
  }
  return graph;
}

function connectOut(g: AudioGraph, node: AudioNode, wet = 1): void {
  node.connect(g.master);
  if (wet > 0) {
    const send = g.ctx.createGain();
    send.gain.value = wet;
    node.connect(send);
    send.connect(g.reverbSend);
  }
}

function envelope(
  param: AudioParam,
  start: number,
  peak: number,
  attack: number,
  hold: number,
  release: number,
): void {
  param.cancelScheduledValues(start);
  param.setValueAtTime(0.0001, start);
  param.exponentialRampToValueAtTime(peak, start + attack);
  param.setValueAtTime(peak, start + attack + hold);
  param.exponentialRampToValueAtTime(0.0001, start + attack + hold + release);
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let brown = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    brown = (brown + 0.02 * white) / 1.02;
    data[i] = brown * 3.5;
  }
  return buffer;
}

/** Soft bell with inharmonic partials, used for chimes and reveals. */
function bell(g: AudioGraph, freq: number, at: number, peak = 0.12, length = 1.4): void {
  const partials = [1, 2.01, 2.76, 4.07];
  partials.forEach((ratio, index) => {
    const osc = g.ctx.createOscillator();
    const gain = g.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * ratio, at);
    envelope(gain.gain, at, peak / (index + 1.4), 0.006, 0, length / (index + 1));
    osc.connect(gain);
    connectOut(g, gain, 0.8);
    osc.start(at);
    osc.stop(at + length + 0.1);
  });
}

export function playEnvelopeOpenChime(isMuted: boolean): void {
  const g = getGraph();
  if (isMuted || !g) {
    return;
  }
  const now = g.ctx.currentTime + 0.02;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => bell(g, freq, now + i * 0.11, 0.1));
}

export function playDiscoveryChime(isMuted: boolean, step = 0): void {
  const g = getGraph();
  if (isMuted || !g) {
    return;
  }
  const scale = [659.25, 783.99, 880, 1046.5];
  const now = g.ctx.currentTime + 0.02;
  bell(g, scale[step % scale.length], now, 0.09, 1.1);
  bell(g, scale[step % scale.length] * 1.5, now + 0.08, 0.05, 0.9);
}

export function playCelebrationFanfare(isMuted: boolean): void {
  const g = getGraph();
  if (isMuted || !g) {
    return;
  }
  const now = g.ctx.currentTime + 0.02;
  const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
  melody.forEach((freq, i) => bell(g, freq, now + i * 0.13, 0.1, 1.2));
  [261.63, 329.63, 392].forEach((freq) => {
    const osc = g.ctx.createOscillator();
    const filter = g.ctx.createBiquadFilter();
    const gain = g.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    envelope(gain.gain, now + 0.5, 0.03, 0.2, 0.6, 0.8);
    osc.connect(filter);
    filter.connect(gain);
    connectOut(g, gain, 0.6);
    osc.start(now + 0.5);
    osc.stop(now + 2.2);
  });
}

export function playBalloonPopSound(isMuted: boolean): void {
  const g = getGraph();
  if (isMuted || !g) {
    return;
  }
  const now = g.ctx.currentTime;
  const src = g.ctx.createBufferSource();
  src.buffer = noiseBuffer(g.ctx, 0.12);
  const filter = g.ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 900;
  const gain = g.ctx.createGain();
  envelope(gain.gain, now, 0.5, 0.002, 0, 0.09);
  src.connect(filter);
  filter.connect(gain);
  connectOut(g, gain, 0.3);
  src.start(now);
}

export function playPageTurnSound(isMuted: boolean): void {
  const g = getGraph();
  if (isMuted || !g) {
    return;
  }
  const now = g.ctx.currentTime;
  const src = g.ctx.createBufferSource();
  src.buffer = noiseBuffer(g.ctx, 0.3);
  const filter = g.ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(900, now);
  filter.frequency.exponentialRampToValueAtTime(3200, now + 0.25);
  const gain = g.ctx.createGain();
  envelope(gain.gain, now, 0.18, 0.04, 0.05, 0.18);
  src.connect(filter);
  filter.connect(gain);
  connectOut(g, gain, 0.2);
  src.start(now);
}

export function playStampSound(isMuted: boolean): void {
  const g = getGraph();
  if (isMuted || !g) {
    return;
  }
  const now = g.ctx.currentTime;
  const osc = g.ctx.createOscillator();
  const gain = g.ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.18);
  envelope(gain.gain, now, 0.45, 0.003, 0, 0.2);
  osc.connect(gain);
  connectOut(g, gain, 0.25);
  osc.start(now);
  osc.stop(now + 0.3);

  const src = g.ctx.createBufferSource();
  src.buffer = noiseBuffer(g.ctx, 0.08);
  const noiseGain = g.ctx.createGain();
  envelope(noiseGain.gain, now, 0.25, 0.001, 0, 0.06);
  src.connect(noiseGain);
  connectOut(g, noiseGain, 0.1);
  src.start(now);
}

/** Growly cub roar: pitch-swept sawtooth + brown noise through a moving low-pass with tremolo. */
function lionRoar(g: AudioGraph, at: number): void {
  const duration = 1.1;
  const osc = g.ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, at);
  osc.frequency.linearRampToValueAtTime(230, at + 0.25);
  osc.frequency.exponentialRampToValueAtTime(95, at + duration);

  const noise = g.ctx.createBufferSource();
  noise.buffer = noiseBuffer(g.ctx, duration + 0.1);

  const filter = g.ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 6;
  filter.frequency.setValueAtTime(500, at);
  filter.frequency.linearRampToValueAtTime(1400, at + 0.25);
  filter.frequency.exponentialRampToValueAtTime(350, at + duration);

  const tremolo = g.ctx.createOscillator();
  const tremoloDepth = g.ctx.createGain();
  tremolo.frequency.value = 28;
  tremoloDepth.gain.value = 0.35;

  const amp = g.ctx.createGain();
  envelope(amp.gain, at, 0.55, 0.08, 0.35, 0.65);
  tremolo.connect(tremoloDepth);
  tremoloDepth.connect(amp.gain);

  const noiseGain = g.ctx.createGain();
  noiseGain.gain.value = 0.6;

  osc.connect(filter);
  noise.connect(noiseGain);
  noiseGain.connect(filter);
  filter.connect(amp);
  connectOut(g, amp, 0.5);

  osc.start(at);
  noise.start(at);
  tremolo.start(at);
  osc.stop(at + duration + 0.1);
  noise.stop(at + duration + 0.1);
  tremolo.stop(at + duration + 0.1);
}

/** Elephant trumpet: bright sawtooth with rising glide, vibrato and nasal formant. */
function elephantTrumpet(g: AudioGraph, at: number): void {
  const duration = 0.95;
  const osc = g.ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(380, at);
  osc.frequency.exponentialRampToValueAtTime(720, at + 0.18);
  osc.frequency.setValueAtTime(720, at + 0.55);
  osc.frequency.exponentialRampToValueAtTime(520, at + duration);

  const vibrato = g.ctx.createOscillator();
  const vibratoDepth = g.ctx.createGain();
  vibrato.frequency.value = 7;
  vibratoDepth.gain.value = 18;
  vibrato.connect(vibratoDepth);
  vibratoDepth.connect(osc.frequency);

  const formant = g.ctx.createBiquadFilter();
  formant.type = 'bandpass';
  formant.frequency.value = 1500;
  formant.Q.value = 3;

  const body = g.ctx.createBiquadFilter();
  body.type = 'peaking';
  body.frequency.value = 2800;
  body.gain.value = 8;

  const amp = g.ctx.createGain();
  envelope(amp.gain, at, 0.4, 0.05, 0.5, 0.35);

  osc.connect(formant);
  formant.connect(body);
  body.connect(amp);
  connectOut(g, amp, 0.6);

  osc.start(at);
  vibrato.start(at);
  osc.stop(at + duration + 0.1);
  vibrato.stop(at + duration + 0.1);
}

/** Giraffes are nearly silent: a soft low hum plus a gentle leaf rustle. */
function giraffeHum(g: AudioGraph, at: number): void {
  const osc = g.ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(92, at);
  osc.frequency.linearRampToValueAtTime(84, at + 0.9);
  const lp = g.ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 400;
  const amp = g.ctx.createGain();
  envelope(amp.gain, at, 0.3, 0.15, 0.4, 0.45);
  osc.connect(lp);
  lp.connect(amp);
  connectOut(g, amp, 0.3);
  osc.start(at);
  osc.stop(at + 1.1);

  const rustle = g.ctx.createBufferSource();
  rustle.buffer = noiseBuffer(g.ctx, 0.7);
  const bp = g.ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 3800;
  bp.Q.value = 0.8;
  const rustleGain = g.ctx.createGain();
  envelope(rustleGain.gain, at + 0.1, 0.12, 0.1, 0.2, 0.3);
  rustle.connect(bp);
  bp.connect(rustleGain);
  connectOut(g, rustleGain, 0.4);
  rustle.start(at + 0.1);
}

/** Monkey "oo-oo-aa": vocal formant chirps with upward pitch sweeps. */
function monkeyChatter(g: AudioGraph, at: number): void {
  const calls = [
    { t: 0, from: 520, to: 780, vowel: 800 },
    { t: 0.16, from: 560, to: 840, vowel: 800 },
    { t: 0.34, from: 700, to: 1150, vowel: 1300 },
    { t: 0.52, from: 760, to: 1250, vowel: 1300 },
  ];
  calls.forEach((call) => {
    const start = at + call.t;
    const osc = g.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(call.from, start);
    osc.frequency.exponentialRampToValueAtTime(call.to, start + 0.11);
    const formant = g.ctx.createBiquadFilter();
    formant.type = 'bandpass';
    formant.frequency.value = call.vowel;
    formant.Q.value = 5;
    const amp = g.ctx.createGain();
    envelope(amp.gain, start, 0.35, 0.012, 0.04, 0.08);
    osc.connect(formant);
    formant.connect(amp);
    connectOut(g, amp, 0.4);
    osc.start(start);
    osc.stop(start + 0.18);
  });
}

export function playAnimalSound(
  kind: 'roar' | 'trumpet' | 'chew' | 'chatter',
  isMuted: boolean,
): void {
  const g = getGraph();
  if (isMuted || !g) {
    return;
  }
  const at = g.ctx.currentTime + 0.02;
  switch (kind) {
    case 'roar':
      lionRoar(g, at);
      break;
    case 'trumpet':
      elephantTrumpet(g, at);
      break;
    case 'chew':
      giraffeHum(g, at);
      break;
    case 'chatter':
      monkeyChatter(g, at);
      break;
    default:
      break;
  }
}

/** Short tropical bird call phrase for entering the savanna. */
export function playJungleAmbienceBurst(isMuted: boolean): void {
  const g = getGraph();
  if (isMuted || !g) {
    return;
  }
  const now = g.ctx.currentTime + 0.05;
  const chirps = [0, 0.14, 0.28, 0.7, 0.82];
  chirps.forEach((offset, i) => {
    const osc = g.ctx.createOscillator();
    osc.type = 'sine';
    const base = i < 3 ? 2400 : 3100;
    osc.frequency.setValueAtTime(base, now + offset);
    osc.frequency.exponentialRampToValueAtTime(base * 1.45, now + offset + 0.07);
    osc.frequency.exponentialRampToValueAtTime(base * 0.9, now + offset + 0.11);
    const amp = g.ctx.createGain();
    envelope(amp.gain, now + offset, 0.07, 0.01, 0.03, 0.07);
    osc.connect(amp);
    connectOut(g, amp, 0.9);
    osc.start(now + offset);
    osc.stop(now + offset + 0.15);
  });
}
