// Background music. Uses an mp3 when one is configured; otherwise synthesises
// a slow, romantic harp + pad + bell piece in D major with Web Audio.

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

type Bar = { bass: number; pad: number[]; arp: number[]; mel: [number, number, number][] };

// I – vi – IV – V – I/3 – ii – IV – Vsus
const BARS: Bar[] = [
  { bass: 38, pad: [62, 66, 69, 73], arp: [50, 57, 62, 66, 69, 66, 62, 57], mel: [[0, 78, 2], [2, 76, 1], [3, 74, 1]] },
  { bass: 35, pad: [59, 62, 66, 69], arp: [47, 54, 59, 62, 66, 62, 59, 54], mel: [[0, 74, 1.5], [1.5, 73, 0.5], [2, 71, 2]] },
  { bass: 43, pad: [59, 62, 66, 67], arp: [43, 50, 55, 59, 62, 66, 62, 59], mel: [[0, 71, 1], [1, 74, 1], [2, 79, 2]] },
  { bass: 45, pad: [57, 61, 64, 69], arp: [45, 52, 57, 61, 64, 61, 57, 52], mel: [[0, 78, 2], [2, 76, 2]] },
  { bass: 42, pad: [57, 62, 66, 69], arp: [42, 50, 54, 57, 62, 57, 54, 50], mel: [[0, 78, 1], [1, 81, 1], [2, 78, 1], [3, 76, 1]] },
  { bass: 40, pad: [59, 62, 64, 67], arp: [40, 47, 52, 55, 59, 55, 52, 47], mel: [[0, 74, 2], [2, 71, 1], [3, 74, 1]] },
  { bass: 43, pad: [59, 62, 66, 67], arp: [43, 50, 55, 59, 62, 66, 62, 59], mel: [[0, 76, 1.5], [1.5, 74, 0.5], [2, 71, 2]] },
  { bass: 45, pad: [57, 62, 64, 69], arp: [45, 52, 57, 62, 64, 61, 57, 52], mel: [[0, 73, 2], [2, 69, 2]] },
];

const BPM = 66;
const BEAT = 60 / BPM;

class Synth {
  ctx: AudioContext;
  master: GainNode;
  dry: GainNode;
  wet: GainNode;
  private timer: number | null = null;
  private nextBar = 0;
  private barIndex = 0;

  constructor() {
    // iOS mutes Web Audio on the silent switch unless the session is "playback".
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) nav.audioSession.type = "playback";
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master.connect(comp).connect(this.ctx.destination);

    this.dry = this.ctx.createGain();
    this.dry.gain.value = 0.8;
    this.wet = this.ctx.createGain();
    this.wet.gain.value = 0.55;
    const verb = this.ctx.createConvolver();
    verb.buffer = this.impulse(3.8);
    this.dry.connect(this.master);
    this.wet.connect(verb).connect(this.master);
  }

  private impulse(seconds: number) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return buf;
  }

  private out(g: GainNode, wet = 1) {
    g.connect(this.dry);
    const s = this.ctx.createGain();
    s.gain.value = wet;
    g.connect(s).connect(this.wet);
  }

  pluck(m: number, t: number, vel = 0.12, decay = 1.8) {
    const c = this.ctx;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    const o1 = c.createOscillator();
    o1.type = "sine";
    o1.frequency.value = mtof(m);
    const o2 = c.createOscillator();
    o2.type = "triangle";
    o2.frequency.value = mtof(m) * 2;
    const g2 = c.createGain();
    g2.gain.value = 0.18;
    o1.connect(g);
    o2.connect(g2).connect(g);
    this.out(g, 0.8);
    o1.start(t);
    o2.start(t);
    o1.stop(t + decay + 0.1);
    o2.stop(t + decay + 0.1);
  }

  bell(m: number, t: number, vel = 0.07, decay = 3.2) {
    const c = this.ctx;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    [1, 2.76, 5.4].forEach((ratio, i) => {
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = mtof(m) * ratio;
      const pg = c.createGain();
      pg.gain.value = [1, 0.16, 0.05][i];
      o.connect(pg).connect(g);
      o.start(t);
      o.stop(t + decay + 0.1);
    });
    this.out(g, 1.2);
  }

  pad(notes: number[], t: number, dur: number) {
    const c = this.ctx;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 1.4);
    g.gain.setValueAtTime(0.05, t + dur - 0.3);
    g.gain.linearRampToValueAtTime(0, t + dur + 1.2);
    lp.connect(g);
    this.out(g, 1);
    notes.forEach((m) => {
      [-6, 6].forEach((det) => {
        const o = c.createOscillator();
        o.type = "triangle";
        o.frequency.value = mtof(m);
        o.detune.value = det;
        o.connect(lp);
        o.start(t);
        o.stop(t + dur + 1.4);
      });
    });
  }

  bass(m: number, t: number) {
    const c = this.ctx;
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = mtof(m);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + BEAT * 4);
    o.connect(g);
    this.out(g, 0.3);
    o.start(t);
    o.stop(t + BEAT * 4 + 0.1);
  }

  private scheduleBar(t: number, n: number) {
    const bar = BARS[n % BARS.length];
    const loop = Math.floor(n / BARS.length);
    this.bass(bar.bass, t);
    this.pad(bar.pad, t, BEAT * 4);
    bar.arp.forEach((m, i) => this.pluck(m, t + i * BEAT * 0.5, i === 0 ? 0.11 : 0.075));
    if (loop >= 1 || n >= 4) bar.mel.forEach(([beat, m]) => this.bell(m, t + beat * BEAT, 0.075));
  }

  private tick = () => {
    while (this.nextBar < this.ctx.currentTime + 0.4) {
      this.scheduleBar(this.nextBar, this.barIndex++);
      this.nextBar += BEAT * 4;
    }
  };

  chime() {
    const t = this.ctx.currentTime + 0.05;
    if (this.timer == null) {
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(0.9, t);
    }
    const notes = [69, 71, 74, 76, 78, 81, 83, 86, 88, 90, 93];
    notes.forEach((m, i) => this.bell(m, t + i * 0.085, 0.05, 2.6));
  }

  async play() {
    await this.ctx.resume();
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0.9, now + 2.5);
    if (this.timer == null) {
      if (this.nextBar < now) this.nextBar = now + 0.1;
      this.tick();
      this.timer = window.setInterval(this.tick, 120);
    }
  }

  pause() {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 0.6);
    if (this.timer != null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    window.setTimeout(() => {
      if (this.timer == null) this.ctx.suspend();
    }, 700);
  }
}

export class Music {
  private synth: Synth | null = null;
  private audio: HTMLAudioElement | null = null;
  playing = false;

  constructor(private src: string | null) {}

  /** Must be called from a user gesture the first time. */
  async play(withChime = false) {
    if (this.src) {
      if (!this.audio) {
        this.audio = new Audio(this.src);
        this.audio.loop = true;
        this.audio.volume = 0.7;
      }
      this.playing = true;
      await this.audio.play().catch(() => (this.playing = false));
      if (withChime) this.ensureSynth()?.chime();
      return;
    }
    const s = this.ensureSynth();
    if (!s) return;
    this.playing = true;
    await s.play();
    if (withChime) s.chime();
  }

  chime() {
    if (this.playing) this.ensureSynth()?.chime();
  }

  pause() {
    this.playing = false;
    this.audio?.pause();
    this.synth?.pause();
  }

  private ensureSynth() {
    if (!this.synth) {
      try {
        this.synth = new Synth();
      } catch {
        return null;
      }
    }
    if (this.synth.ctx.state === "suspended") this.synth.ctx.resume();
    return this.synth;
  }
}
