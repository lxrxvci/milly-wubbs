import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { QualityTier } from '../lib/engine';

gsap.registerPlugin(ScrollTrigger);

const shots = [
  { src: '/photos/jersey-hero-crowd.jpg',  cap: "The people's champ — arms up, zero jersey" },
  { src: '/photos/laser-storm-booth.jpg',  cap: 'Behind the decks — Lost Lands laser storm' },
  { src: '/photos/led-wall-triptych.jpg',  cap: 'The name in lights — the MILLY wall' },
  { src: '/photos/b2b-green-lasers.jpg',   cap: 'Full crew on the booth — B2B nights' },
  { src: '/photos/pyro-flames-stage.jpg',  cap: 'Festival scale — pyro line, main stage' },
  { src: '/photos/theater-arms-crowd.jpg', cap: 'The family photo — every set ends like this' },
  { src: '/photos/asas-red-room.jpg',      cap: 'The home floor — ASAS 1907, PDX' },
];

/* BIO FILM — the locked-in scroll. The viewport pins and ~360vh of scroll
   force-scrubs the story as a film strip: crossfades, slow push per frame,
   live shot counter, caption overlay. Reduced/low tiers get a clean stack. */
export default function BioFilm({ tier }: { tier: QualityTier }) {
  const wrap = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);
  const caption = useRef<HTMLSpanElement>(null);
  const dashes = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cinematic = !reduced && tier !== 'low';

  useEffect(() => {
    if (!cinematic) return;
    const N = shots.length;
    let cur = -1;
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate(self) {
        const pos = self.progress * N; // 0..N
        for (let i = 0; i < N; i++) {
          const el = frames.current[i];
          if (!el) continue;
          let o = 0;
          if (pos >= i && pos <= i + 1) o = 1;                    // owns this segment
          else if (pos > i - 0.22 && pos < i) o = (pos - i + 0.22) / 0.22; // fading in on top
          el.style.opacity = o.toFixed(3);
          const local = Math.min(1, Math.max(0, pos - i));
          el.style.transform = `scale(${(1.02 + local * 0.07).toFixed(4)})`;
        }
        const idx = Math.min(N - 1, Math.floor(pos));
        if (idx !== cur) {
          cur = idx;
          if (counter.current) counter.current.textContent = `SHOT 0${idx + 1} / 0${N}`;
          if (caption.current) caption.current.textContent = shots[idx].cap;
          const kids = dashes.current?.children;
          if (kids) for (let i = 0; i < kids.length; i++) {
            (kids[i] as HTMLElement).style.background = i === idx ? 'var(--mw-accent)' : 'rgba(235,235,235,0.25)';
          }
        }
      },
    });
    return () => { st.kill(); };
  }, [cinematic]);

  if (!cinematic) {
    return (
      <div className="mt-16 grid gap-6">
        {shots.map((s, i) => (
          <figure key={i} className="mw-ledframe">
            <img src={s.src} alt={s.cap} loading="lazy" decoding="async" className="w-full max-h-[70vh] object-cover" />
            <div className="mw-cap-overlay"><span>{s.cap}</span><span className="text-white/50">SHOT 0{i + 1} / 0{shots.length}</span></div>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrap} className="relative mt-16" style={{ height: `${shots.length * 55 + 100}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* film frames — stacked, scrubbed */}
        {shots.map((s, i) => (
          <img
            key={i}
            ref={(el) => { frames.current[i] = el; }}
            src={s.src}
            alt={s.cap}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0, transform: 'scale(1.02)' }}
          />
        ))}
        {/* legibility grade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70 pointer-events-none" />

        {/* HUD */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="mw-vf mw-vf-ink left-4 top-[4.2rem] border-t border-l" />
          <span className="mw-vf mw-vf-ink right-4 top-[4.2rem] border-t border-r" />
          <span className="mw-vf mw-vf-ink left-4 bottom-4 border-b border-l" />
          <span className="mw-vf mw-vf-ink right-4 bottom-4 border-b border-r" />
          <span className="mw-hud absolute left-5 md:left-8 top-[4.6rem]">Bio film — locked scroll</span>
          <span ref={counter} className="mw-hud absolute right-5 md:right-8 top-[4.6rem] text-[var(--mw-accent)]">SHOT 01 / 0{shots.length}</span>
        </div>

        {/* caption + progress dashes */}
        <div className="absolute left-5 right-5 md:left-8 md:right-8 bottom-6 flex items-end justify-between gap-6">
          <span ref={caption} className="mw-cap text-[var(--mw-ink)] max-w-[60vw]">{shots[0].cap}</span>
          <div ref={dashes} className="flex gap-1.5 shrink-0">
            {shots.map((_, i) => (
              <span key={i} className="block w-6 h-[3px]" style={{ background: i === 0 ? 'var(--mw-accent)' : 'rgba(235,235,235,0.25)' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
