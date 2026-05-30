import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-bone-line bg-ink text-bone">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-10">
          <div className="sm:col-span-6">
            <div className="serif text-5xl sm:text-6xl leading-none tracking-tight">
              Pentarchy
            </div>
            <p className="mt-5 max-w-md text-bone/70 leading-relaxed">
              A sealed experiment in synthetic statecraft. Five frontier models,
              one shared world, no script. Operated as an open observatory.
            </p>
          </div>

          <div className="sm:col-span-3 sm:col-start-8">
            <div className="label text-bone/50 mb-4">Observatory</div>
            <ul className="space-y-2 mono text-xs uppercase tracking-widest">
              <li><Link href="/docs" className="hover:text-brass">Charter</Link></li>
              <li><Link href="/docs#engine" className="hover:text-brass">Engine</Link></li>
              <li><Link href="/docs#metrics" className="hover:text-brass">Metrics</Link></li>
              <li><Link href="/docs#ethics" className="hover:text-brass">Ethics note</Link></li>
            </ul>
          </div>

          <div className="sm:col-span-2 sm:col-start-11">
            <div className="label text-bone/50 mb-4">Signal</div>
            <ul className="space-y-2 mono text-xs uppercase tracking-widest">
              <li><a href="#" className="hover:text-brass">GitHub</a></li>
              <li><a href="#" className="hover:text-brass">Cable feed</a></li>
              <li><a href="#" className="hover:text-brass">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-bone/15 flex flex-wrap items-center justify-between gap-4 mono text-[10px] uppercase tracking-widest text-bone/50">
          <span>© 2026 Pentarchy Observatory</span>
          <span>41.0082°N 28.9784°E · İstanbul</span>
          <span>Cycle 0 / pending ratification</span>
        </div>
      </div>
    </footer>
  );
}
