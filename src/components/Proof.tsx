import Reveal from './Reveal';

const receipts = [
  { artist: 'SPACE LACES', role: 'Direct support', where: 'Portland, OR', badge: 'Direct support', hot: true },
  { artist: 'JANTSEN', role: 'Billed w/ Mykaya + Riddimine', where: 'Realm — Portland, OR', badge: 'Billed', hot: false },
  { artist: 'METAMORPHOSIS', role: 'Music & Arts Project — festival set', where: 'Name on the booth', badge: 'Festival set', hot: false },
  { artist: 'LOST LANDS', role: 'In the trenches — front row regular', where: 'Legend Valley, OH', badge: 'In the trenches', hot: false },
];

const tilts = [-3, 2, -1, 4];

const floors = ['SPACE LACES', 'JANTSEN', 'REALM PDX', 'LOST LANDS', 'METAMORPHOSIS', 'ASAS 1907'];

/* ACT 04 — RECENT SHOWS. The track record, row by row. */
export default function Proof() {
  return (
    <section id="proof" className="relative min-h-[120vh] flex items-center py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8 w-full">
        <p className="mw-index mb-4">04 / Recent Shows</p>
        <Reveal
          variant="scramble"
          text="RECENT SHOWS"
          className="font-display uppercase text-[9vw] md:text-[5.5vw] leading-[0.9]"
        />

        <div className="mt-14">
          {receipts.map((r, i) => (
            <div key={i} className="group border-t border-white/12 py-7 flex flex-col md:flex-row md:items-center gap-3 md:gap-8 hover:bg-white/[0.03] transition-colors px-2 -mx-2">
              <span className="font-label text-[11px] text-[var(--mw-dim)] w-10">{String(i + 1).padStart(2, '0')}</span>
              <h3 className={`font-display uppercase text-2xl md:text-4xl tracking-tight ${r.hot ? 'text-[var(--mw-accent)]' : 'text-[var(--mw-ink)]'}`}>
                {r.artist}
              </h3>
              <p className="text-[var(--mw-dim)]">{r.role}</p>
              {/* sticker pins to the row's right edge — rotation varies per row */}
              <span
                className={`mw-sticker ${r.hot ? '' : 'mw-sticker-ghost'} self-start md:self-center md:ml-auto`}
                style={{ transform: `rotate(${tilts[i % tilts.length]}deg)` }}
              >
                {r.badge}
              </span>
              <p className="mw-cap md:w-40 md:text-right">{r.where}</p>
            </div>
          ))}
          <div className="border-t border-white/12" />
        </div>

        {/* logo wall — shared stages & floors, stark text tiles */}
        <p className="mw-hud mt-16 mb-5">Shared stages &amp; floors</p>
        <div className="grid grid-cols-2 md:grid-cols-3 border-l border-t border-white/12">
          {floors.map((f) => (
            <div key={f} className="border-r border-b border-white/12 px-4 py-6 md:py-8 flex items-center justify-center hover:bg-white/[0.04] transition-colors">
              <span className="font-display uppercase text-center text-sm md:text-xl tracking-wide text-[var(--mw-chrome)]">{f}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="relative">
            <span className="mw-vf mw-vf-ink -left-2 -top-2 border-t border-l" />
            <span className="mw-vf mw-vf-ink -right-2 -top-2 border-t border-r" />
            {/* the flyer is a document, not a photo — full color, uncropped, on a matte */}
            <figure className="mw-ledframe bg-[#111113] p-3 md:p-4">
              <img
                src="/photos/jantsen-realm-flyer.jpg"
                alt="Show flyer: Jantsen at Realm Portland with Milly and Mykaya billed"
                className="w-full max-h-[66vh] object-contain"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figcaption className="mw-cap mt-3 flex justify-between"><span>Official flyer — Jantsen @ Realm PDX, June 26</span><span className="text-[var(--mw-accent)]">FIG. 03</span></figcaption>
          </div>
          <div className="relative">
            <span className="mw-vf mw-vf-ink -left-2 -top-2 border-t border-l" />
            <span className="mw-vf mw-vf-ink -right-2 -top-2 border-t border-r" />
            <figure className="mw-ledframe">
              <img src="/photos/lostlands-duo.jpg" alt="Milly Wubbs front row at Lost Lands under the LED panels" className="w-full max-h-[66vh] object-cover" loading="lazy" decoding="async" />
            </figure>
            <figcaption className="mw-cap mt-3 flex justify-between"><span>Lost Lands — under the panels</span><span className="text-[var(--mw-accent)]">FIG. 04</span></figcaption>
          </div>
        </div>
      </div>
    </section>
  );
}
