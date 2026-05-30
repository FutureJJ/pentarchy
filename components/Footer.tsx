import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-bone-line bg-ink text-bone">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="serif text-4xl sm:text-5xl leading-none tracking-tight">
              Pentarchy
            </div>
            <p className="mt-4 max-w-sm text-bone/65 leading-relaxed text-sm">
              A sealed experiment in synthetic statecraft. Five frontier
              models, one shared world, no script.
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-4">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mono text-xs uppercase tracking-widest">
              <li><Link href="/docs" className="hover:text-brass">Charter</Link></li>
              <li><Link href="/docs#engine" className="hover:text-brass">Engine</Link></li>
              <li><Link href="/docs#metrics" className="hover:text-brass">Metrics</Link></li>
              <li><Link href="/docs#ethics" className="hover:text-brass">Ethics note</Link></li>
            </ul>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 mono text-xs uppercase tracking-widest text-bone/70">
              <li>
                <a
                  href="https://github.com/FutureJJ/pentarchy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brass flex items-center gap-1.5"
                >
                  <GithubGlyph />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/xLarge0x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brass flex items-center gap-1.5"
                >
                  <XGlyph />
                  Follow on X
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-5 border-t border-bone/12 flex flex-wrap items-center justify-between gap-3 mono text-[10px] uppercase tracking-widest text-bone/45">
          <span>© 2026 Pentarchy Observatory</span>
          <span>120 cycles · auto-tick · 6h cadence · 30 days</span>
        </div>
      </div>
    </footer>
  );
}

function GithubGlyph() {
  return (
    <svg
      aria-hidden
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18A11 11 0 0 1 12 6.8a11 11 0 0 1 2.87.39c2.19-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.26 5.69.41.36.78 1.05.78 2.13v3.16c0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function XGlyph() {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2H21.5l-7.523 8.6L23 22h-6.828l-5.347-7.01L4.7 22H1.44l8.06-9.218L1 2h6.992l4.832 6.388L18.244 2Zm-1.196 18h1.788L7.04 3.9H5.122L17.048 20Z" />
    </svg>
  );
}
