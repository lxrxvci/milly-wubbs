// Shared mutable engine state — read in render loops, never via React state.
// One module, one clock, zero per-frame allocation.

export const scrollStore = {
  progress: 0,     // 0..1 total page scroll progress
  velocity: 0,     // lenis velocity (raw)
  veloSm: 0,       // smoothed |velocity| 0..~1, for reactive effects
  section: 0,      // rough act index (set by sections via IntersectionObserver)
};

export type QualityTier = 'high' | 'medium' | 'low';

export function detectQuality(): QualityTier {
  if (typeof window === 'undefined') return 'high';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (reduced || !gl) return 'low';
  const dpr = window.devicePixelRatio || 1;
  const mobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  if (mobile || dpr > 2) return 'medium';
  return 'high';
}

// ---------------- Act energy map ----------------
// The film's lighting board: each act gets a distinct scene state.
// p is total page progress (hero=0, footer=1). Tune zones to section heights.
// energy: overall particle activity. lasers: beam gain. knot: chrome object presence.
// calm: how much the scene should hold still (Proof/Vault readability).

export interface ActState { energy: number; lasers: number; knot: number; fog: number }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ss = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// bell envelope: ramps in a→b, out c→d
const bell = (p: number, a: number, b: number, c: number, d: number) => ss(p, a, b) * (1 - ss(p, c, d));

const _act: ActState = { energy: 0.6, lasers: 0.4, knot: 0, fog: 0.05 };

export function actState(p: number): ActState {
  // INTRO (0–0.06): foggy void, sparse field
  // SOUND (0.06–0.3): storm builds, lasers arrive
  // VISUALS (0.25–0.55): peak storm — the drop
  // STORY (0.5–0.68): breakdown — lasers die, chrome knot takes the frame
  // PROOF→VAULT (0.66–0.94): calm documentation — fog + sparse drift
  // OUTRO (0.94–1): settle to near-stillness
  const storm = bell(p, 0.05, 0.14, 0.46, 0.58);
  const knotZ = bell(p, 0.5, 0.58, 0.66, 0.74);
  const calm = ss(p, 0.66, 0.78);
  _act.energy = 0.35 + storm * 0.65 - calm * 0.25;
  _act.lasers = storm * (1 - knotZ);
  _act.knot = knotZ;
  _act.fog = 0.055 - storm * 0.02 + calm * 0.02;
  return _act;
}

// the accent surge zone (color arrives only here)
export function pushAmount(p: number) {
  return ss(p, 0.16, 0.26) * (1 - ss(p, 0.42, 0.54));
}

// ---------------- Audio engine ----------------
// Gated behind a user gesture (autoplay policy). Bands are smoothed here so
// shaders receive buttery values: bass → displacement/bloom, mids → hue, highs → sparkle.

class AudioEngine {
  ctx: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  gain: GainNode | null = null;
  el: HTMLAudioElement | null = null;
  freq: Uint8Array<ArrayBuffer> | null = null;
  playing = false;
  // smoothed output bands (0..1)
  bass = 0; mids = 0; highs = 0; level = 0;

  init(src: string) {
    if (this.el) return;
    this.el = new Audio(src);
    this.el.loop = true;
    this.el.crossOrigin = 'anonymous';
    this.el.preload = 'auto';
  }

  async toggle(src: string): Promise<boolean> {
    this.init(src);
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AC();
      const node = this.ctx.createMediaElementSource(this.el!);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.82;
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 1;
      node.connect(this.analyser);
      this.analyser.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
    }
    const t = this.ctx.currentTime;
    this.gain!.gain.cancelScheduledValues(t);
    if (this.playing) {
      // fade out, then pause — no hard cuts
      this.gain!.gain.setValueAtTime(this.gain!.gain.value, t);
      this.gain!.gain.linearRampToValueAtTime(0, t + 0.35);
      const el = this.el!;
      setTimeout(() => { if (!this.playing) el.pause(); }, 380);
      this.playing = false;
      return false;
    }
    await this.ctx.resume();
    this.gain!.gain.setValueAtTime(0, t);
    this.gain!.gain.linearRampToValueAtTime(1, t + 0.6); // fade in
    await this.el!.play();
    this.playing = true;
    return true;
  }

  // call once per frame
  update() {
    if (!this.analyser || !this.freq || !this.playing) {
      this.bass += (0 - this.bass) * 0.06;
      this.mids += (0 - this.mids) * 0.06;
      this.highs += (0 - this.highs) * 0.06;
      this.level += (0 - this.level) * 0.06;
      return;
    }
    this.analyser.getByteFrequencyData(this.freq);
    const avg = (a: number, b: number) => {
      let s = 0; for (let i = a; i < b; i++) s += this.freq![i];
      return s / ((b - a) * 255);
    };
    const b = avg(0, 24), m = avg(24, 128), h = avg(128, 256);
    this.bass += (b - this.bass) * 0.35;
    this.mids += (m - this.mids) * 0.3;
    this.highs += (h - this.highs) * 0.3;
    const lv = (b * 0.6 + m * 0.3 + h * 0.1);
    this.level += (lv - this.level) * 0.3;
  }
}

export const audioEngine = new AudioEngine();
