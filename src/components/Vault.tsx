import { useState } from 'react';
import Reveal from './Reveal';

const pressShots = [
  { src: '/photos/press-orange-sign.jpg', label: 'Portrait — orange tee (web-res)' },
  { src: '/photos/golden-hour-duo.jpg', label: 'Lifestyle — golden light (web-res)' },
  { src: '/photos/zero-jersey-crowd.jpg', label: 'Crowd — front of house (web-res)' },
  { src: '/photos/crowd-family-lasers.jpg', label: 'Crowd — family under lasers (web-res)' },
];

function CopyBlock({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };
  return (
    <div className="border border-white/15 p-5 bg-black/40">
      <div className="flex items-center justify-between mb-3">
        <span className="font-label text-[10px] uppercase text-[var(--mw-ink)]">{title}</span>
        <button
          onClick={copy}
          data-cursor="COPY"
          className={`font-label text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
            copied
              ? 'border-[var(--mw-accent)] bg-[var(--mw-accent)] text-black'
              : 'border-white/30 text-[var(--mw-ink)] hover:bg-[var(--mw-ink)] hover:text-black'
          }`}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-[var(--mw-dim)] leading-relaxed">{text}</p>
    </div>
  );
}

/* ACT 05 — THE VAULT. The promoter fast-lane: everything bookable in 60 seconds.
   Rule: nothing on this page pretends. No fake embeds, no dead countdowns. */
export default function Vault() {
  return (
    <section id="vault" className="relative min-h-screen py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <p className="mw-index mb-4">05 / The Vault — EPK</p>
        <Reveal
          variant="focus"
          text="EVERYTHING A PROMOTER NEEDS"
          className="font-display uppercase text-[8vw] md:text-[4.5vw] leading-[0.9]"
        />
        <p className="mt-6 text-[var(--mw-dim)] max-w-[56ch]">
          One page, one click, no logins. Grab assets, copy the bio, check the specs, send the offer.
        </p>

        {/* NEXT SET — honest TBA. Dashes stay dim; the action is the CTA. */}
        <div className="mt-12 border border-white/15 bg-black/50 backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div>
            <p className="font-label text-[10px] uppercase text-[var(--mw-accent)]">Next set</p>
            <p className="font-display uppercase text-2xl md:text-4xl mt-2">
              <span className="text-[var(--mw-dim)]">–– / ––</span> TBA
            </p>
            <p className="mw-cap mt-2">Announced on Instagram first</p>
          </div>
          <a
            href="mailto:booking@millywubbs.com?subject=Next%20date%20%E2%80%94%20Milly%20Wubbs"
            className="md:ml-auto font-label text-[11px] uppercase tracking-widest border border-[var(--mw-accent)]/60 text-[var(--mw-accent)] px-5 py-3 hover:bg-[var(--mw-accent)] hover:text-black transition-colors"
            data-cursor="ASK"
          >
            Get the date first →
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <CopyBlock
            title="Short bio — 60 words"
            text="Milly Wubbs is a Portland, OR bass producer and DJ serving riddim-heavy dubstep with house-party energy. A PNW scene fixture turned direct support for Space Laces, his sets pair studio-grade wubs with pure joy — kandi on the wrist, orange on the chest, and a crowd that leaves as family."
          />
          <CopyBlock
            title="Extended bio — 120 words"
            text="Milly Wubbs is a bass producer and DJ out of Portland, Oregon, carving his name into the Pacific Northwest riddim scene one sold-out rail at a time. Known for filthy low-end engineering and an infectiously joyful stage presence, he's moved from the front row of Lost Lands to direct support for Space Laces, with billings alongside Jantsen at Realm PDX and a festival set at the Metamorphosis Music & Arts Project. His sound lives at 140+ BPM: heavy wubs, precise sound design, and zero filler. His shows feel like the whole room winning together — phones up, heads over the rail, everybody in the family photo at the end. Bookings: festivals, club takeovers, and direct support slots across the bass circuit."
          />
        </div>

        {/* video — honest single row instead of a fake embed grid */}
        <div className="mt-12 border border-white/15 px-5 py-4 flex flex-col md:flex-row md:items-center gap-3">
          <span className="font-label text-[10px] uppercase text-[var(--mw-ink)]">Video — live proof</span>
          <span className="text-sm text-[var(--mw-dim)]">Full-set footage and festival recaps don't live on the page — they go straight to promoters.</span>
          <a
            href="mailto:booking@millywubbs.com?subject=Live%20set%20video%20%E2%80%94%20Milly%20Wubbs"
            className="md:ml-auto font-label text-[10px] uppercase tracking-widest text-[var(--mw-accent)] hover:text-[var(--mw-ink)] transition-colors"
            data-cursor="ASK"
          >
            Live set video on request →
          </a>
        </div>

        <div className="mt-12">
          <p className="mw-hud mb-5">Press photos — click to download</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pressShots.map((p, i) => (
              <a key={i} href={p.src} download className="group block" data-cursor="SAVE">
                <span className="mw-ledframe block">
                  <img src={p.src} alt={p.label} loading="lazy" decoding="async" className="w-full aspect-[4/5] object-cover group-hover:opacity-80 transition-opacity" />
                </span>
                <span className="mw-cap block mt-2">{p.label}</span>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-5">
            <a href="/press-kit.zip" download className="mw-cap text-[var(--mw-accent)] hover:text-[var(--mw-ink)] transition-colors" data-cursor="SAVE">
              ↓ Full press kit — photos + logo (zip)
            </a>
            <a href="/logo.png" download className="mw-cap text-[var(--mw-accent)] hover:text-[var(--mw-ink)] transition-colors" data-cursor="SAVE">
              ↓ Logo pack — MILLY WUBBS white throwie (PNG, transparent)
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="border border-white/15 p-5 flex flex-col">
            <p className="font-label text-[10px] uppercase text-[var(--mw-accent)] mb-2">Tech rider</p>
            <p className="text-sm text-[var(--mw-dim)] leading-relaxed">4× CDJ-3000 + DJM-A9 preferred (2× CDJ + DJM-900NXS2 minimum). Booth monitors mandatory.</p>
            <a href="mailto:booking@millywubbs.com?subject=Tech%20rider%20PDF%20%E2%80%94%20Milly%20Wubbs" className="mw-cap mt-auto pt-3 text-[var(--mw-ink)] hover:text-[var(--mw-accent)] transition-colors" data-cursor="ASK">
              Full rider PDF on request →
            </a>
          </div>
          <div className="border border-white/15 p-5">
            <p className="font-label text-[10px] uppercase text-[var(--mw-accent)] mb-2">Set specs</p>
            <p className="text-sm text-[var(--mw-dim)] leading-relaxed">Dubstep / riddim / bass. 60–90 min headline, 45–60 min support. No pyro required — but encouraged.</p>
          </div>
          <div className="border border-white/15 p-5">
            <p className="font-label text-[10px] uppercase text-[var(--mw-accent)] mb-2">Routing</p>
            <p className="text-sm text-[var(--mw-dim)] leading-relaxed">Based in Portland, OR (PDX). West Coast routing friendly; fly-out ready with advance.</p>
          </div>
        </div>

        <div className="mt-14 border border-[var(--mw-accent)]/40 bg-[var(--mw-accent)]/[0.06] p-8 md:p-10 text-center">
          <p className="font-display uppercase text-3xl md:text-5xl">Bring the wubs to your city</p>
          <p className="mt-3 text-[var(--mw-dim)]">Booking, collabs &amp; press — one inbox, fast replies.</p>
          <a href="mailto:booking@millywubbs.com" className="mw-book inline-block mt-6 text-sm px-8 py-4" data-cursor="BOOK">
            booking@millywubbs.com
          </a>
        </div>
      </div>
    </section>
  );
}
