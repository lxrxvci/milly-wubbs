import { useEffect, useRef } from 'react';

/* Custom cursor — dot + trailing ring with context labels.
   Elements opt in via data-cursor="PLAY" (or any short label);
   plain links/buttons get the ring without a label. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => { pos.x = e.clientX; pos.y = e.clientY; };
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('[data-cursor], a, button');
      if (!ring.current || !label.current) return;
      if (t) {
        ring.current.dataset.active = 'true';
        label.current.textContent = (t as HTMLElement).dataset.cursor ?? '';
      } else {
        ring.current.dataset.active = 'false';
        label.current.textContent = '';
      }
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="mw-cursor-dot" aria-hidden="true" />
      <div ref={ring} className="mw-cursor-ring" data-active="false" aria-hidden="true"><span ref={label} /></div>
    </>
  );
}
