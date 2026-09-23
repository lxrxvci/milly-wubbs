import { useEffect, useRef, useState } from 'react';

/* Preloader = first frame of the film. Brand mark + %, then blur→sharp reveal.
   Waits on real readiness (window load + fonts) so Anton never FOUT-swaps. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const ready = useRef({ load: false, fonts: false });
  const pctRef = useRef(0);

  useEffect(() => {
    const tryFinish = () => {
      if (!ready.current.load || !ready.current.fonts || pctRef.current < 100) return;
      setLeaving(true);
      setTimeout(onDone, 650);
    };
    const onLoad = () => { ready.current.load = true; tryFinish(); };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    document.fonts.ready.then(() => { ready.current.fonts = true; tryFinish(); });

    const tick = setInterval(() => {
      pctRef.current = Math.min(100, pctRef.current + Math.random() * 14 + 4);
      setPct(Math.floor(pctRef.current));
      if (pctRef.current >= 100) { clearInterval(tick); tryFinish(); }
    }, 110);
    return () => { clearInterval(tick); window.removeEventListener('load', onLoad); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-600"
      style={{
        background: 'var(--mw-bg)',
        opacity: leaving ? 0 : 1,
        filter: leaving ? 'blur(14px)' : 'blur(0px)',
        pointerEvents: leaving ? 'none' : 'auto',
        transition: 'opacity .6s ease, filter .6s ease',
      }}
      aria-hidden={leaving}
    >
      <img src="/logo.png" alt="MILLY WUBBS" className="w-[60vw] max-w-[420px] h-auto" />
      <p className="font-label text-[11px] text-[var(--mw-accent)] mt-8 tracking-[0.3em]">
        LOADING THE WUBBS · {pct}%
      </p>
    </div>
  );
}
