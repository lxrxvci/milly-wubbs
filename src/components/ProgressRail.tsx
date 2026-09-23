import { useEffect, useRef } from 'react';

/* Waveform scroll progress — thin rail, accent fill, hover to scrub. */
export default function ProgressRail() {
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = (e.clientY - rect.top) / rect.height;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: p * max, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed right-3 top-0 bottom-0 z-50 w-[6px] py-6 cursor-pointer group"
      onClick={scrub}
      role="progressbar"
      aria-label="Scroll progress"
    >
      <div className="relative h-full w-[2px] mx-auto bg-white/10 group-hover:w-[6px] transition-all">
        <div
          ref={fill}
          className="absolute inset-0 origin-top"
          style={{ background: 'var(--mw-accent)', transform: 'scaleY(0)' }}
        />
      </div>
    </div>
  );
}
