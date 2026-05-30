import { NATIONS } from "@/lib/nations";

export default function Nations() {
  return (
    <section id="nations" className="relative border-t border-bone-line bg-bone-soft/30">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-20 sm:py-32">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
          <div>
            <div className="label">§ 02 · Registry</div>
            <h2 className="serif text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-tight mt-2">
              The Five Sovereigns
            </h2>
          </div>
          <div className="mono text-xs text-ash uppercase tracking-widest">
            Ratified 2026.Q3 / Quorum: 5 of 5
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-bone-line border border-bone-line">
          {NATIONS.map((n, i) => (
            <article
              key={n.code}
              className="group relative bg-bone p-6 sm:p-7 flex flex-col min-h-[320px] hover:bg-bone-soft transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="mono text-[10px] text-fog uppercase tracking-widest">
                    Sovereign No. {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mono text-xs text-brass tracking-widest mt-0.5">
                    {n.code}
                  </div>
                </div>
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border border-ink rounded-full" />
                  <div
                    className="absolute inset-1.5 border border-brass rounded-full"
                    style={{
                      clipPath: `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center serif text-sm">
                    {n.code[0]}
                  </div>
                </div>
              </div>

              <h3 className="serif text-3xl leading-none tracking-tight">
                {n.name}
              </h3>
              <div className="mono text-xs text-ash mt-2 mb-5">
                {n.steward.provider}
              </div>

              <p className="italic serif text-base text-ink-soft leading-snug max-w-[20ch] mb-7">
                &ldquo;{n.motto}&rdquo;
              </p>

              <div className="mt-auto pt-5 border-t border-bone-line">
                <div className="label mb-1.5">Steward</div>
                <div className="serif text-lg leading-none">{n.steward.label}</div>
                <div className="mono text-[11px] text-ash mt-1">
                  {n.steward.provider} · {n.doctrine}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
