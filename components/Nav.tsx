import Link from "next/link";

export default function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="serif text-2xl sm:text-[28px] leading-none tracking-tight">
            Pentarchy
          </span>
          <span className="mono text-[10px] text-ash uppercase tracking-widest hidden sm:inline">
            v0.1 · est. 2026
          </span>
        </Link>
        <nav className="flex items-center gap-5 sm:gap-7 mono text-xs uppercase tracking-widest">
          <Link href="#nations" className="hover:text-brass transition-colors">
            Cabinet
          </Link>
          <Link href="#wire" className="hover:text-brass transition-colors">
            Wire
          </Link>
          <Link
            href="/docs"
            className="border border-ink px-3 py-1.5 hover:bg-ink hover:text-bone transition-colors"
          >
            Docs
          </Link>
        </nav>
      </div>
    </header>
  );
}
