import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type RevealVariant = 'chars' | 'clip' | 'slide' | 'scramble' | 'focus';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$';

/* Kinetic reveals — one grammar per act, never the same trick twice.
   chars:    classic char-split rise (hero-grade moments)
   clip:     hard clip-path wipe, left→right
   slide:    mask-slide up with slight rotate
   scramble: decode from random glyphs (data/proof energy)
   focus:    blur→sharp settle (calm acts) */
export default function Reveal({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
  variant = 'chars',
}: {
  text: string;
  className?: string;
  as?: any;
  delay?: number;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];
    const start = 'top 82%';

    if (variant === 'chars') {
      const chars = el.querySelectorAll('.mw-char');
      const tw = gsap.to(chars, {
        y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.028, delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
      tweens.push(tw);
    } else if (variant === 'clip') {
      gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
      const tw = gsap.to(el, {
        clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut', delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
      tweens.push(tw);
    } else if (variant === 'slide') {
      gsap.set(el, { yPercent: 60, rotate: 2, opacity: 0 });
      const tw = gsap.to(el, {
        yPercent: 0, rotate: 0, opacity: 1, duration: 1.0, ease: 'power4.out', delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
      tweens.push(tw);
    } else if (variant === 'scramble') {
      const target = text;
      const proxy = { n: 0 };
      el.textContent = '';
      const tw = gsap.to(proxy, {
        n: target.length, duration: 1.1, ease: 'power2.out', delay,
        scrollTrigger: { trigger: el, start, once: true },
        onUpdate() {
          const n = Math.floor(proxy.n);
          let out = target.slice(0, n);
          for (let i = n; i < Math.min(target.length, n + 6); i++) {
            out += target[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          el.textContent = out;
        },
        onComplete() { el.textContent = target; },
      });
      tweens.push(tw);
    } else if (variant === 'focus') {
      gsap.set(el, { opacity: 0, filter: 'blur(10px)', scale: 0.985 });
      const tw = gsap.to(el, {
        opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.2, ease: 'power2.out', delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
      tweens.push(tw);
    }

    tweens.forEach((t) => { if (t.scrollTrigger) triggers.push(t.scrollTrigger); });
    return () => { triggers.forEach((s) => s.kill()); tweens.forEach((t) => t.kill()); };
  }, [text, delay, variant]);

  if (variant === 'chars') {
    const words = text.split(' ');
    return (
      <Tag ref={ref} className={className} aria-label={text}>
        {words.map((w, wi) => (
          <span key={wi} className="mw-line" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {w.split('').map((c, ci) => (
              <span key={ci} className="mw-char" aria-hidden="true">{c}</span>
            ))}
            {wi < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </Tag>
    );
  }
  return <Tag ref={ref} className={className} aria-label={text}>{text}</Tag>;
}
