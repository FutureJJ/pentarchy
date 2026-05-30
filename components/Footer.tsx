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
          <ul className="flex flex-wrap gap-x-6 gap-y-2 mono text-xs uppercase tracking-widest">
            <li><Link href="/docs" className="hover:text-brass">Charter</Link></li>
            <li><Link href="/docs#engine" className="hover:text-brass">Engine</Link></li>
            <li><Link href="/docs#metrics" className="hover:text-brass">Metrics</Link></li>
            <li><Link href="/docs#ethics" className="hover:text-brass">Ethics note</Link></li>
          </ul>
        </div>
        <div className="mt-10 pt-5 border-t border-bone/12 flex flex-wrap items-center justify-between gap-3 mono text-[10px] uppercase tracking-widest text-bone/45">
          <span>© 2026 Pentarchy Observatory</span>
          <span>Cycle 0 · auto-tick · 6h cadence</span>
        </div>
      </div>
    </footer>
  );
}
