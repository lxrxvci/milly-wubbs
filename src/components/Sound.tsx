import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './Reveal';
import { audioEngine } from '../lib/engine';

gsap.registerPlugin(ScrollTrigger);

const BARS = 48;

const TRACKS = [
  { title: 'Money Right', kind: 'Original', url: 'https://soundcloud.com/chendo-urcino-1/money-right' },
  { title: 'Hands On The Wheel (Sticky Icky Edit)', kind: 'Edit', url: 'https://soundcloud.com/chendo-urcino-1/hands-on-the-wheel-sticky-icky' },
  { title: 'David Guetta — BAD (Milly Flip)', kind: 'Flip', url: 'https://soundcloud.com/chendo-urcino-1/david-guetta-bad-milly-flip' },
  { title: 'Metallica — Unforgiven (Milly Wubbs Flip)', kind: 'Flip', url: 'https://soundcloud.com/chendo-urcino-1/metallica-unforgiven-milly-wubbs-flip' },
];

function fmt(t: number) {
  if (!isFinite(t) || t < 0) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ACT 01 — THE SOUND. A real player: title, time, seek. The meter reads the
   live analyser through per-bar ballistics (fast attack, slow release) so it
   breathes like hardware instead of strobing raw FFT. */
export default function Sound({ soundOn, onToggleSound }: { soundOn: boolean; onToggleSound: () => void }) {
  const meterRef = useRef<HTMLDivElement>(null);
  const barVals = useRef<Float32Array>(new Float32Array(BARS).fill(0.08));
  const seekRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    let raf = 0;
    const els = meterRef.current?.children;
    const vals = barVals.current;
    const loop = () => {
      // meter ballistics — attack fast, release slow
      if (els && audioEngine.freq && audioEngine.playing) {
        const step = Math.floor(audioEngine.freq.length / BARS);
        for (let i = 0; i < BARS; i++) {
          const target = 0.08 + audioEngine.freq[i * step] / 255;
          const v = vals[i];
          vals[i] = v + (target - v) * (target > v ? 0.55 : 0.09);
          (els[i] as HTMLElement).style.transform = `scaleY(${vals[i].toFixed(3)})`;
        }
      } else if (els) {
        for (let i = 0; i < BARS; i++) {
          vals[i] += (0.08 - vals[i]) * 0.08;
          (els[i] as HTMLElement).style.transform = `scaleY(${vals[i].toFixed(3)})`;
        }
      }
      // transport
      const el = audioEngine.el;
      if (el && el.duration) setTime((prev) => {
        const ct = el.currentTime, d = el.duration;
        return Math.abs(prev[0] - ct) > 0.24 || prev[1] !== d ? [ct, d] : prev;
      });
      if (seekRef.current && el && el.duration) {
        seekRef.current.style.transform = `scaleX(${(el.currentTime / el.duration).toFixed(4)})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioEngine.el;
    if (!el || !el.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - r.left) / r.width) * el.duration;
  };

  return (
    <section id="sound" className="relative min-h-[160vh] flex items-center py-32">
      <div className="w-full max-w-6xl mx-auto px-5 md:px-8">
        <p className="mw-index mb-4">01 / The Sound</p>
        <Reveal
          variant="clip"
          text="DUBSTEP, RIDDIM & HEAVY WUBS"
          className="font-display uppercase text-[9vw] md:text-[5.5vw] leading-[0.9] text-[var(--mw-ink)]"
        />
        <div className="grid md:grid-cols-[1fr_320px] gap-10 mt-14 items-end">
          <div>
            <p className="text-[var(--mw-dim)] max-w-[52ch] leading-relaxed">
              Dubstep, riddim and everything that wobbles in between — heavy low
              end and precise sound design, out of Portland, OR.
            </p>
            <div className="mt-8 border border-white/15 p-5 bg-black/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label text-[10px] uppercase text-[var(--mw-ink)]">Now spinning</span>
                <span className="mw-cap">Metamorphosis — opening set</span>
              </div>
              <div ref={meterRef} className="flex items-end gap-[3px] h-16" aria-hidden="true">
                {Array.from({ length: BARS }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 origin-bottom"
                    style={{
                      height: '100%',
                      transform: 'scaleY(0.08)',
                      background: i % 9 === 0 ? 'var(--mw-accent)' : 'rgba(235,235,235,0.75)',
                      opacity: 0.85,
                    }}
                  />
                ))}
              </div>
              {/* transport: progress + seek */}
              <div
                className="relative h-1 mt-5 bg-white/12 cursor-pointer group"
                onClick={seek}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(time[1])}
                aria-valuenow={Math.round(time[0])}
                data-cursor="SEEK"
              >
                <div
                  ref={seekRef}
                  className="absolute inset-0 origin-left bg-[var(--mw-accent)] group-hover:bg-[var(--mw-ink)] transition-colors"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={onToggleSound}
                  className="mw-book"
                  aria-pressed={soundOn}
                  data-cursor={soundOn ? 'PAUSE' : 'PLAY'}
                >
                  {soundOn ? '⏸ Pause' : '▶ Play the wubs'}
                </button>
                <span className="mw-cap tabular-nums">{fmt(time[0])} / {fmt(time[1])}</span>
              </div>
            </div>
            {/* stream the set on SoundCloud */}
            <div className="mt-6 border border-white/15 p-5 bg-black/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label text-[10px] uppercase text-[var(--mw-ink)]">Stream / follow</span>
                <a
                  href="https://soundcloud.com/chendo-urcino-1"
                  target="_blank"
                  rel="noreferrer"
                  className="mw-cap hover:text-[var(--mw-accent)] transition-colors"
                  data-cursor="LISTEN"
                >
                  SoundCloud ↗
                </a>
              </div>
              <iframe
                title="Metamorphosis Opening Set — Milly Wubbs on SoundCloud"
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                loading="lazy"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2391999510&color=%23ff6d1b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
                className="w-full"
              />
            </div>
            {/* latest tracks — newest first */}
            <div className="mt-10">
              <p className="mw-hud mb-4">Latest tracks</p>
              {TRACKS.map((t, i) => (
                <div key={i} className="group border-t border-white/12 py-4 flex items-center gap-4 px-2 -mx-2 hover:bg-white/[0.03] transition-colors">
                  <span className="font-label text-[11px] text-[var(--mw-dim)] w-6">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="font-display uppercase text-lg md:text-xl tracking-tight text-[var(--mw-ink)] leading-tight">{t.title}</p>
                    <p className="mw-cap mt-1">{t.kind}</p>
                  </div>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto shrink-0 font-label text-[10px] uppercase tracking-widest border border-white/25 text-[var(--mw-ink)] px-3 py-2 hover:border-[var(--mw-accent)] hover:text-[var(--mw-accent)] transition-colors"
                    data-cursor="PLAY"
                  >
                    ▶ SC
                  </a>
                </div>
              ))}
              <div className="border-t border-white/12" />
            </div>
          </div>
          <div className="relative">
            <span className="mw-vf mw-vf-ink -left-2 -top-2 border-t border-l" />
            <span className="mw-vf mw-vf-ink -right-2 -top-2 border-t border-r" />
            <span className="mw-vf mw-vf-ink -left-2 -bottom-2 border-b border-l" />
            <span className="mw-vf mw-vf-ink -right-2 -bottom-2 border-b border-r" />
            <div className="mw-ledframe">
              <img src="/photos/decks-closeup.jpg" alt="Milly Wubbs on CDJs mid-set" className="w-full h-auto" loading="lazy" decoding="async" />
            </div>
            <p className="mw-cap mt-3 flex justify-between"><span>On the decks — PDX</span><span className="text-[var(--mw-accent)]">FIG. 01</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
