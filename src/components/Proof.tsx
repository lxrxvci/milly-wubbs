import Reveal from './Reveal';

const receipts = [
  { artist: 'SPACE LACES', role: 'Direct support', where: 'Realm · Portland, OR', badge: 'Direct support', hot: true },
  { artist: 'SLANDER', role: 'Support w/ Nejvex + Redline', where: 'Treefort Music Hall · Boise, ID', badge: 'Support', hot: false },
  { artist: 'CHAMPAGNE DRIP', role: 'Support w/ Mitch Please', where: 'The Den · Portland, OR', badge: 'Support', hot: false },
  { artist: 'AYY GEE', role: 'Billed w/ Onslo, Nightpass + JSTDerek', where: 'Treefort Music Hall · Boise, ID', badge: 'Billed', hot: false },
  { artist: 'JANTSEN', role: 'Billed w/ Mykaya + Riddimine', where: 'Realm · Portland, OR', badge: 'Billed', hot: false },
  { artist: 'METAMORPHOSIS', role: 'Music & Arts Project · festival set', where: 'Orlando, FL', badge: 'Festival set', hot: false },
  { artist: 'LOST LANDS', role: 'Played the silent disco', where: 'Legend Valley, OH', badge: 'Silent disco', hot: false },
];

const flyers = [
  { src: '/photos/flyer-spacelaces.jpg', label: 'Space Laces · Realm PDX' },
  { src: '/photos/flyer-slander.jpg', label: 'Slander · Treefort Music Hall' },
  { src: '/photos/flyer-champagne-drip.jpg', label: 'Champagne Drip · The Den PDX' },
  { src: '/photos/flyer-ayygee.jpg', label: 'Ayy Gee · Treefort Music Hall' },
  { src: '/photos/jantsen-realm-flyer.jpg', label: 'Jantsen · Realm PDX' },
  { src: '/photos/flyer-metamorphosis.jpg', label: 'Metamorphosis · Orlando, FL' },
  { src: '/photos/flyer-lostlands-silent-disco.jpg', label: 'Lost Lands · silent disco lineup' },
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

        {/* flyer wall — documents get respect: full color, uncropped, on a matte */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12">
          {flyers.map((f, i) => (
            <figure key={i}>
              <div className="mw-ledframe bg-[#111113] p-2 md:p-3">
                <img
                  src={f.src}
                  alt={`Show flyer: ${f.label}`}
                  className="w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mw-cap mt-2 flex justify-between">
                <span>{f.label}</span>
                <span className="text-[var(--mw-accent)]">FIG. {String(i + 3).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <figure className="mt-10 max-w-2xl">
          <div className="mw-ledframe">
            <img
              src="/photos/lostlands-duo.jpg"
              alt="Milly Wubbs front row at Lost Lands under the LED panels"
              className="w-full max-h-[66vh] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="mw-cap mt-3 flex justify-between">
            <span>Lost Lands · under the panels</span>
            <span className="text-[var(--mw-accent)]">FIG. 10</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
