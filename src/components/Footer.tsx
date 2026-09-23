/* Footer — coral wordmark closer. Only links that actually go somewhere. */
export default function Footer() {
  return (
    <footer className="relative" style={{ background: 'var(--mw-accent)' }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 text-black">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="font-label text-[11px] uppercase tracking-[0.25em] mb-4">Wub fam HQ</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-label text-[12px] uppercase">
              <a href="https://www.instagram.com/milly_wubbs/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://soundcloud.com/chendo-urcino-1" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">SoundCloud</a>
              <a href="mailto:booking@millywubbs.com" className="hover:text-white transition-colors">Booking</a>
              <a href="/press-kit.zip" download className="hover:text-white transition-colors">Press kit</a>
            </div>
          </div>
          <p className="text-black/70 text-[12px] font-label uppercase tracking-wider">© {new Date().getFullYear()} Milly Wubbs · Portland, OR · Built loud.</p>
        </div>
        <img src="/logo.png" alt="" aria-hidden="true" className="w-full h-auto mt-12" />
      </div>
    </footer>
  );
}
