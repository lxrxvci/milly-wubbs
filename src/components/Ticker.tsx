/* Ticker — the streetwear marquee. One accent word per loop, everything
   else monochrome. Duplicated content makes the -50% loop seamless. */
const ITEMS = [
  'Heavy wubs', 'Big smiles', 'No mercy on the low end', 'PDX',
  '140+ BPM', 'Riddim engineered for the rail', 'Direct support — Space Laces',
];

export default function Ticker() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative z-10 border-y border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden py-3">
      <div className="mw-ticker-track items-center gap-8 pr-8">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className={`font-display uppercase text-sm md:text-base tracking-wide ${i % ITEMS.length === 0 ? 'text-[var(--mw-accent)]' : 'text-[var(--mw-ink)]'}`}>
              {t}
            </span>
            <span className="text-[var(--mw-grey)] text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
