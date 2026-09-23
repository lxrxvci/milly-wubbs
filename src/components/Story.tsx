import Reveal from './Reveal';

/* ACT 03 — THE STORY. The scene engine pushes the chrome knot into closeup
   here and the lasers die down — the DOM mirrors it: quieter, closer, one
   hand-drawn rupture on a machine-clean grid. */
export default function Story() {
  return (
    <section id="story" className="relative min-h-[150vh] flex items-center py-32 overflow-hidden">
      {/* ghost type backdrop — bleeds the BOTTOM-right edge, clear of the 03 index */}
      <span aria-hidden="true" className="font-display mw-outline uppercase absolute -right-[3vw] -bottom-[6vw] text-[24vw] leading-none select-none pointer-events-none">
        Milly
      </span>

      <div className="max-w-6xl mx-auto px-5 md:px-8 w-full relative">
        <p className="mw-index mb-4">03 / The Story</p>
        <div className="relative inline-block">
          <Reveal
            variant="chars"
            text="THE PEOPLE'S WUBSLINGER"
            className="font-display uppercase text-[9vw] md:text-[5.5vw] leading-[0.9]"
          />
          {/* hand-drawn scribble underline — the graffiti layer */}
          <svg aria-hidden="true" viewBox="0 0 320 14" className="w-[62%] h-3 md:h-4 mt-1 text-[var(--mw-accent)]" fill="none">
            <path d="M4 9 C 60 3, 120 12, 180 7 S 290 4, 316 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="font-hand absolute right-0 md:-right-24 -top-9 md:-top-7 rotate-6 text-[var(--mw-accent)] text-lg md:text-2xl whitespace-nowrap">
            the people's champ ↓
          </span>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-10 mt-14">
          <div className="relative">
            <span className="mw-vf mw-vf-ink -left-2 -top-2 border-t border-l" />
            <span className="mw-vf mw-vf-ink -right-2 -top-2 border-t border-r" />
            <span className="mw-vf mw-vf-ink -left-2 -bottom-2 border-b border-l" />
            <span className="mw-vf mw-vf-ink -right-2 -bottom-2 border-b border-r" />
            <figure className="mw-ledframe">
              <img
                src="/photos/press-orange-sign.jpg"
                alt="Milly Wubbs pointing at his name on the Metamorphosis artist sign"
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figcaption className="mw-cap mt-3 flex justify-between">
              <span>Name on the sign · Metamorphosis</span>
              <span className="text-[var(--mw-accent)]">FIG. 02</span>
            </figcaption>
          </div>

          <div>
            <p className="text-lg md:text-xl leading-relaxed text-[var(--mw-ink)] max-w-[56ch]">
              Milly Wubbs is a bass producer and DJ from Portland, OR, playing
              riddim-heavy dubstep. A fixture of the Pacific Northwest bass scene,
              he's gone from rail-riding fan to direct support for
              <span className="text-[var(--mw-ink)] font-semibold"> Space Laces</span>, and his
              sets are loud, precise and genuinely joyful.
            </p>
            <p className="mt-6 text-[var(--mw-dim)] leading-relaxed max-w-[56ch]">
              Billed alongside Jantsen, Slander and Champagne Drip, fresh off the
              Metamorphosis Music &amp; Arts Project, and a silent disco set at Lost
              Lands. Milly pairs careful sound design with an easygoing stage presence.
              Kandi on the wrist, orange on the chest, wubs on the system.
            </p>

            {/* stat cluster — deliberately unequal: sizes, offsets, one tilted */}
            <div className="flex flex-wrap items-start gap-4 mt-10 max-w-xl">
              <div className="border border-white/15 bg-black/60 backdrop-blur-sm p-5 md:p-6 w-[46%] md:w-auto md:min-w-[180px]">
                <p className="font-display text-4xl md:text-5xl text-[var(--mw-accent)]">PDX</p>
                <p className="mw-cap mt-2">Home base</p>
              </div>
              <div className="border border-white/15 bg-black/60 backdrop-blur-sm p-4 mt-6 md:mt-10">
                <p className="font-display text-2xl md:text-3xl text-[var(--mw-ink)]">140+</p>
                <p className="mw-cap mt-2">BPM territory</p>
              </div>
              <div className="border border-white/15 bg-black/60 backdrop-blur-sm p-4 -rotate-2 translate-y-1">
                <p className="font-display text-2xl md:text-3xl text-[var(--mw-ink)]">6K</p>
                <p className="mw-cap mt-2">Wub fam on IG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
