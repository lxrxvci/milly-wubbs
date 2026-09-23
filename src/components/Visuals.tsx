import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './Reveal';
import { scrollStore } from '../lib/engine';

gsap.registerPlugin(ScrollTrigger);

const shots = [
  { src: '/photos/crowd-theater-wide.jpg', cap: 'The theater — every seat, every hand', big: true },
  { src: '/photos/milly-led-blue.jpg', cap: 'The MILLY wall — PDX' },
  { src: '/photos/teal-laser-booth.jpg', cap: 'Laser booth — sold out' },
  { src: '/photos/booth-green-lasers.jpg', cap: 'Behind the decks — Lost Lands weekend' },
  { src: '/photos/phone-flash-crowd.jpg', cap: 'Phones up — the wub anthem moment' },
  { src: '/photos/rail-crowd-purple.jpg', cap: 'Rail riders — Utah Jazz jersey era' },
  { src: '/photos/golden-led-duo.jpg', cap: 'Golden hour LED wall' },
  { src: '/photos/all-souls-red.jpg', cap: 'All Sounds All Souls — 1907' },
  { src: '/photos/zero-jersey-crowd.jpg', cap: 'Home crowd — PDX' },
  { src: '/photos/skulls-billboard-crowd.jpg', cap: 'Festival-scale production' },
  { src: '/photos/pyro-stage.jpg', cap: 'Pyro line — main stage' },
  { src: '/photos/red-santa-b2b.jpg', cap: 'B2B season — no mercy' },
];

/* ACT 02 — THE VISUALS. Sticky horizontal gallery: 500vh of scroll becomes
   a lateral tracking shot. Captions live inside the frame as a broadcast
   overlay, images parallax against the track, and scroll velocity skews
   the whole strip like film being dragged through the gate. */
export default function Visuals() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current!;
    const imgs = Array.from(track.querySelectorAll<HTMLElement>('[data-parallax]'));
    const getDist = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -getDist(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapRef.current,
        start: 'top top',
        end: () => `+=${getDist()}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: () => {
          // inner-image parallax: each frame's image counters the track
          // at its own depth, ±4% of the image width
          const p = tween.progress() - 0.5;
          for (let i = 0; i < imgs.length; i++) {
            const depth = 0.5 + (i % 3) * 0.5;
            imgs[i].style.transform = `translateX(${(p * 8 * depth).toFixed(2)}%) scale(1.14)`;
          }
        },
      },
    });

    // velocity skew — scroll speed drags the strip like film in a gate
    let skew = 0;
    const tick = () => {
      const target = -scrollStore.veloSm * 5;
      skew += (target - skew) * 0.08;
      track.style.transform = `translateX(${gsap.getProperty(track, 'x')}px) skewX(${skew.toFixed(3)}deg)`;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="visuals" ref={wrapRef} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center">
        <div className="px-5 md:px-8 mb-8 flex items-end justify-between max-w-none">
          <div>
            <p className="mw-index mb-3">02 / The Visuals</p>
            <Reveal
              as="h2"
              variant="slide"
              text="Shot from the rail up"
              className="font-display uppercase text-[7vw] md:text-[4vw] leading-[0.9]"
            />
          </div>
          <span className="mw-cap hidden md:block">The night, in frames →</span>
        </div>
        <div ref={trackRef} className="flex gap-10 md:gap-14 px-5 md:px-8 w-max items-center">
          {shots.map((s, i) => (
            <figure key={i} className={`relative shrink-0 ${s.big ? 'w-[80vw] md:w-[56vw]' : 'w-[70vw] md:w-[34vw]'}`}>
              {/* viewfinder brackets — the HUD frame */}
              <span className="mw-vf mw-vf-ink -left-2 -top-2 border-t border-l" />
              <span className="mw-vf mw-vf-ink -right-2 -top-2 border-t border-r" />
              <span className="mw-vf mw-vf-ink -left-2 -bottom-2 border-b border-l" />
              <span className="mw-vf mw-vf-ink -right-2 -bottom-2 border-b border-r" />
              <div className="mw-ledframe overflow-hidden">
                <img
                  src={s.src}
                  alt={s.cap}
                  loading="lazy"
                  decoding="async"
                  data-parallax
                  className={`w-full object-cover will-change-transform ${s.big ? 'max-h-[62vh]' : 'max-h-[52vh]'}`}
                  style={{ transform: 'scale(1.14)' }}
                />
                {/* caption overlay — inside the frame, broadcast-style */}
                <div className="mw-cap-overlay">
                  <span>{s.cap}</span>
                  <span className={i === 0 ? 'text-[var(--mw-accent)]' : 'text-white/50'}>
                    FRAME {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
