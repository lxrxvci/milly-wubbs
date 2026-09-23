import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const links = [
  { id: 'sound', label: 'Sound', n: '01' },
  { id: 'visuals', label: 'Visuals', n: '02' },
  { id: 'story', label: 'Story', n: '03' },
  { id: 'proof', label: 'Shows', n: '04' },
  { id: 'vault', label: 'Vault / EPK', n: '05' },
];

/* Fixed nav: hides on scroll-down, returns on scroll-up. Mobile gets a real
   menu overlay — a section index, not a shrunken desktop bar. The Book CTA
   is magnetic: it leans toward the cursor within its pull radius. */
export default function Nav({ onBook }: { onBook: () => void }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 140);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // magnetic pull on the booking CTA (fine pointers only)
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 120;
      if (dist < radius) {
        const pull = (1 - dist / radius) * 0.45;
        xTo(dx * pull); yTo(dy * pull);
      } else { xTo(0); yTo(0); }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`mw-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 py-4 ${hidden && !open ? 'mw-hidden' : ''}`}>
        <a href="#top" onClick={jump('top')} className="flex items-center gap-3" aria-label="Back to top">
          <img src="/logo.png" alt="MILLY WUBBS" className="h-7 w-auto" />
        </a>
        <div className="hidden md:flex items-center gap-7 font-label text-[11px] uppercase">
          {links.slice(0, 4).map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={jump(l.id)} className="mw-navlink">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            ref={ctaRef}
            className="mw-book"
            onClick={() => { setOpen(false); onBook(); }}
            data-cursor="BOOK"
          >
            Book Milly
          </button>
          <button
            className="md:hidden font-label text-[11px] uppercase border border-white/25 px-3 py-2"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* mobile section index overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a]/97 backdrop-blur-md flex flex-col justify-center px-7 md:hidden">
          <p className="mw-hud mb-6">Index</p>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={jump(l.id)}
              className="group flex items-baseline gap-4 py-3 border-b border-white/10"
            >
              <span className="font-label text-[10px] text-[var(--mw-accent)]">{l.n}</span>
              <span className="font-display uppercase text-4xl group-active:text-[var(--mw-accent)]">{l.label}</span>
            </a>
          ))}
          <p className="mw-cap mt-8">Milly Wubbs · PDX bass · booking@millywubbs.com</p>
          <div className="flex gap-6 mt-4 font-label text-[12px] uppercase">
            <a href="https://www.instagram.com/milly_wubbs/" target="_blank" rel="noreferrer" className="text-[var(--mw-dim)] active:text-[var(--mw-accent)]">Instagram ↗</a>
            <a href="https://soundcloud.com/chendo-urcino-1" target="_blank" rel="noreferrer" className="text-[var(--mw-dim)] active:text-[var(--mw-accent)]">SoundCloud ↗</a>
          </div>
        </div>
      )}
    </>
  );
}
