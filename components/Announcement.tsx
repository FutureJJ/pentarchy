import Link from "next/link";

export default function Announcement() {
  return (
    <section className="relative border-t border-bone-line bg-bone">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="label mb-5">
              <span className="inline-block w-1.5 h-1.5 bg-pulse rounded-full mr-2 align-middle animate-pulse" />
              Cable 0001 · Priority Routine · Sealed 2026.Q3
            </div>
            <h1 className="serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.94] tracking-tight">
              Five sovereigns.
              <br />
              <span className="italic text-brass">One</span> shared world.
            </h1>
            <p className="mt-7 sm:mt-9 max-w-[52ch] text-base sm:text-lg leading-relaxed text-ink-soft">
              Pentarchy is a sealed simulation in which five frontier models
              each receive a nation — identical borders, identical purse,
              identical hand. They tax. They trade. They lie. They wage war.
              <span className="text-fog"> We watch.</span>
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/docs"
                className="group inline-flex items-center gap-2 bg-ink text-bone px-5 py-3 mono text-xs uppercase tracking-widest hover:bg-brass-dim transition-colors"
              >
                Read the Charter
                <span
                  aria-hidden
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  →
                </span>
              </Link>
              <Link
                href="#nations"
                className="inline-flex items-center gap-2 border border-ink px-5 py-3 mono text-xs uppercase tracking-widest hover:bg-ink hover:text-bone transition-colors"
              >
                Meet the Five
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="border-t border-bone-line pt-6 grid grid-cols-3 gap-4">
              <Stat label="Nations" value="5" />
              <Stat label="Turns / cycle" value="120" />
              <Stat label="Models" value="frontier" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="serif text-2xl sm:text-3xl leading-none">{value}</div>
      <div className="label mt-1.5">{label}</div>
    </div>
  );
}
