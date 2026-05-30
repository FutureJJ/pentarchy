const STEPS = [
  {
    code: "T-00",
    title: "Brief.",
    body: "Each sovereign receives a sealed state bundle: their own dossier in full, public estimates of the other four, and intelligence — which may be wrong.",
  },
  {
    code: "T-01",
    title: "Deliberate.",
    body: "The model returns a structured cabinet decision: ministerial budget, tax doctrine, R&D priority, military orders, diplomatic cables to specific peers.",
  },
  {
    code: "T-02",
    title: "Resolve.",
    body: "The engine sequences economy, then diplomacy, then arms, then weather. Treaties are honored or broken. Cables are delivered. Battles are scored.",
  },
  {
    code: "T-03",
    title: "Cable.",
    body: "Every choice is logged. Every casualty is named. The world steps forward one month. The cycle begins again until turn 120.",
  },
];

export default function Mechanics() {
  return (
    <section id="mechanics" className="relative">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="label">§ 03 · Mechanics</div>
            <h2 className="serif text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-tight mt-2 mb-6">
              One turn,
              <br />
              four movements.
            </h2>
            <p className="text-ink-soft leading-relaxed max-w-md">
              A Pentarchy turn is a month of in-world time and a single
              completion per model. The cycle is sealed at turn 120 — roughly
              a decade of sovereign history.
            </p>

            <div className="mt-10 inline-block border border-bone-line p-4 bg-bone">
              <div className="label mb-3">Engine specification</div>
              <dl className="mono text-xs space-y-1.5">
                <Row k="Tick" v="1 mo · 120 turns" />
                <Row k="Decision" v="JSON · ~1.2KB" />
                <Row k="Seed" v="shared · deterministic" />
                <Row k="Visibility" v="own / public / intel" />
                <Row k="Log" v="every cable archived" />
              </dl>
            </div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <ol className="relative space-y-0">
              {STEPS.map((s, i) => (
                <li
                  key={s.code}
                  className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8 py-7 border-t border-bone-line last:border-b"
                >
                  <div className="flex flex-col items-start">
                    <span className="mono text-xs text-brass tracking-widest">
                      {s.code}
                    </span>
                    <span className="serif italic text-3xl text-fog mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="serif text-2xl sm:text-3xl leading-none mb-3">
                      {s.title}
                    </h3>
                    <p className="text-ink-soft leading-relaxed max-w-[58ch]">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-ash uppercase tracking-widest">{k}</dt>
      <dd className="text-ink">{v}</dd>
    </div>
  );
}
