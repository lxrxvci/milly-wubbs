import { useCallback, useEffect, useMemo, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollStore, detectQuality, audioEngine } from './lib/engine';
import Scene from './components/Scene';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Sound from './components/Sound';
import Visuals from './components/Visuals';
import Story from './components/Story';
import Proof from './components/Proof';
import Vault from './components/Vault';
import Footer from './components/Footer';
import ProgressRail from './components/ProgressRail';
import Cursor from './components/Cursor';

gsap.registerPlugin(ScrollTrigger);

const AUDIO_SRC = '/audio/metamorphosis-opening-set.mp3'; // Milly's Metamorphosis opening set

export default function App() {
  const tier = useMemo(detectQuality, []);
  const [loaded, setLoaded] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // One clock: Lenis → ScrollTrigger → shared store (read by the WebGL loop)
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', (e: any) => {
      scrollStore.progress = e.progress ?? 0;
      ScrollTrigger.update();
    });
    const raf = (t: number) => {
      lenis.raf(t * 1000);
      // smoothed |velocity| 0..~1 — consumed by CA, bloom, gallery skew
      const v = Math.min(1, Math.abs(lenis.velocity ?? 0) / 45);
      scrollStore.velocity = v;
      scrollStore.veloSm += (v - scrollStore.veloSm) * 0.09;
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); };
  }, []);

  // EPK fast-lane: ?epk drops promoters straight into the Vault
  useEffect(() => {
    if (loaded && new URLSearchParams(window.location.search).has('epk')) {
      requestAnimationFrame(() => {
        document.getElementById('vault')?.scrollIntoView({ behavior: 'auto' });
      });
    }
  }, [loaded]);

  const toggleSound = useCallback(async () => {
    const on = await audioEngine.toggle(AUDIO_SRC);
    setSoundOn(on);
  }, []);

  const goBook = useCallback(() => {
    document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative">
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      {tier !== 'low' && <Scene tier={tier} />}
      {tier === 'low' && (
        <div
          className="mw-canvas-wrap"
          style={{ background: 'url(/photos/teal-laser-booth.jpg) center/cover', opacity: 0.35 }}
          aria-hidden="true"
        />
      )}
      <div className="mw-grain" aria-hidden="true" />
      <Cursor />
      <Nav onBook={goBook} />
      <ProgressRail />
      <main className="relative z-10">
        <Hero soundOn={soundOn} onToggleSound={toggleSound} />
        <Ticker />
        <Sound soundOn={soundOn} onToggleSound={toggleSound} />
        <Visuals tier={tier} />
        <Story />
        <Proof />
        <Vault />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
