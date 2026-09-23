import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Hero v3 — asymmetric triangle: logo left-anchored, tagline bottom-left,
   SOUND ON bottom-right. Ghost name bleeds off the TOP edge (deliberate).
   Coral budget: the button border + one tagline word. That's it. */
export default function Hero({ soundOn, onToggleSound }: { soundOn: boolean; onToggleSound: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = gsap.to(wrap.current, {
      opacity: 0,
      y: -80,
      ease: 'none',
      scrollTrigger: { trigger: wrap.current, start: 'top top', end: '33% top', scrub: true },
    });
    return () => { st.scrollTrigger?.kill(); st.kill(); };
  }, []);

  return (
    <section id="top" ref={wrap} className="relative h-[100svh] overflow-hidden">
      {/* full-bleed selective-color photo — the orange survives */}
      <div className="absolute inset-0">
        <img
          src="/photos/hero-metamorphosis.jpg"
          alt="Milly Wubbs on stage at Metamorphosis, orange tee against the light"
          className="w-full h-full object-cover object-[center_70%] opacity-55"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75" />
      </div>

      {/* ghost name bleeding off the top edge */}
      <div aria-hidden="true" className="absolute -top-[3vw] left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display mw-outline uppercase leading-none text-[17vw] tracking-tight whitespace-nowrap">
          Milly&nbsp;Wubbs
        </span>
      </div>

      {/* HUD edge labels + ink viewfinder corners */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <span className="mw-hud absolute left-5 md:left-6 top-[4.5rem]">Producer \\ DJ</span>
        <span className="mw-hud absolute right-5 md:right-6 top-[4.5rem]">PDX — 45.5152° N</span>
        <span className="mw-hud mw-vtext absolute left-6 top-1/2 -translate-y-1/2 hidden md:block">Heavy wubs — big smiles</span>
        <span className="mw-hud mw-vtext absolute right-6 top-1/2 -translate-y-1/2 rotate-180 hidden md:block">EST. the rail, 2019</span>
        <span className="mw-vf mw-vf-ink left-4 top-[4.2rem] border-t border-l" />
        <span className="mw-vf mw-vf-ink right-4 top-[4.2rem] border-t border-r" />
        <span className="mw-vf mw-vf-ink left-4 bottom-4 border-b border-l" />
        <span className="mw-vf mw-vf-ink right-4 bottom-4 border-b border-r" />
      </div>

      {/* logo — centered sticker, hard offset shadow, slight tilt */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-5">
        <h1 aria-label="MILLY WUBBS" className="m-0 -mt-6 md:-mt-12">
          <img
            src="/logo.png"
            alt="MILLY WUBBS"
            className="w-[84vw] max-w-[820px] h-auto -rotate-2 mx-auto drop-shadow-[6px_6px_0_rgba(10,10,10,0.85)]"
            fetchPriority="high"
          />
        </h1>
      </div>

      {/* tagline — bottom-left block */}
      <div className="absolute z-10 left-5 md:left-[7vw] bottom-16 md:bottom-14 max-w-[70vw]">
        <p className="font-display uppercase text-[var(--mw-ink)] text-xl md:text-3xl tracking-tight leading-[1.05]">
          Heavy wubs. <span className="text-[var(--mw-accent)]">Big smiles.</span><br />
          No mercy on the low end.
        </p>
      </div>

      {/* SOUND ON — bottom-right */}
      <div className="absolute z-10 right-5 md:right-[7vw] bottom-16 md:bottom-14 flex flex-col items-end gap-2">
        <button
          onClick={onToggleSound}
          data-on={soundOn}
          data-cursor={soundOn ? 'OFF' : 'PLAY'}
          className="mw-sound-cta font-label text-[11px] uppercase tracking-[0.2em] border border-[var(--mw-accent)] text-[var(--mw-accent)] px-5 py-3 hover:bg-[var(--mw-accent)] hover:text-black transition-colors"
          aria-pressed={soundOn}
        >
          {soundOn ? '⏸ Sound off' : '▶ Sound on'}
        </button>
        <span className="mw-cap hidden md:inline">feat. Metamorphosis opening set</span>
      </div>

      {/* scroll cue — sits on the ticker seam, bottom-center */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
        <span className="mw-cap">Scroll — the set starts now</span>
      </div>
    </section>
  );
}
