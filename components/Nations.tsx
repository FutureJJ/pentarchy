"use client";

import { NATIONS } from "@/lib/nations";
import { useLiveState } from "@/lib/useLiveState";
import type { Cable, NationCode } from "@/engine/types";

export default function Nations() {
  const { data } = useLiveState(30_000);
  const state = data?.state;

  return (
    <section id="nations" className="relative border-t border-bone-line bg-bone">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="label">§ 02 · Cabinet · live</div>
            <h2 className="serif text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-tight mt-2">
              What each sovereign just decided
            </h2>
          </div>
          <div className="mono text-xs text-ash uppercase tracking-widest">
            {state
              ? `Cycle ${String(state.turn).padStart(2, "0")} / 120 · ${state.season}`
              : "awaiting first cabinet"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-bone-line border border-bone-line">
          {NATIONS.map((n, i) => {
            const live = state?.nations[n.code as NationCode];
            const lastSent = state?.recentCables.find(
              (c: Cable) => c.from === n.code,
            );
            return (
              <article
                key={n.code}
                className="group relative bg-bone p-6 flex flex-col min-h-[340px]"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="mono text-[10px] text-fog uppercase tracking-widest">
                      No. {String(i + 1).padStart(2, "0")} · {n.code}
                    </div>
                    <div
                      className="mono text-[10px] tracking-widest mt-0.5"
                      style={{ color: n.ink }}
                    >
                      {n.steward.label}
                    </div>
                  </div>
                  <div
                    className="w-7 h-7 border rounded-full flex items-center justify-center serif text-sm"
                    style={{ borderColor: n.ink, color: n.ink }}
                  >
                    {n.code[0]}
                  </div>
                </div>

                <h3 className="serif text-2xl leading-none tracking-tight" style={{ color: n.ink }}>
                  {n.name}
                </h3>
                <div className="mono text-[10px] text-ash mt-1 uppercase tracking-widest">
                  {n.doctrine} · {n.steward.provider}
                </div>

                <div className="mt-5 space-y-3 text-xs flex-1">
                  <div>
                    <div className="label mb-1.5">Research</div>
                    <div className="text-ink leading-snug">
                      {live?.research ?? "—"}
                    </div>
                  </div>

                  <div>
                    <div className="label mb-1.5">Edicts this cycle</div>
                    {live?.edicts && live.edicts.length > 0 ? (
                      <ul className="space-y-1.5 text-ink-soft leading-snug">
                        {live.edicts.slice(0, 3).map((e: string, j: number) => (
                          <li key={j} className="flex gap-1.5">
                            <span style={{ color: n.ink }}>·</span>
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-fog italic">No edicts issued.</div>
                    )}
                  </div>

                  {lastSent && (
                    <div>
                      <div className="label mb-1.5">
                        Last cable {lastSent.to ? `→ ${lastSent.to}` : ""}
                      </div>
                      <p className="text-ink-soft italic leading-snug line-clamp-3">
                        &ldquo;{lastSent.body}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {live && (
                  <div className="mt-4 pt-3 border-t border-bone-line grid grid-cols-3 gap-2 mono text-[10px] text-ash">
                    <div>
                      <div className="text-fog uppercase tracking-widest">GDP</div>
                      <div className="text-ink mt-0.5">{Math.round(live.metrics.gdp)}B</div>
                    </div>
                    <div>
                      <div className="text-fog uppercase tracking-widest">Army</div>
                      <div className="text-ink mt-0.5">{Math.round(live.metrics.army)}K</div>
                    </div>
                    <div>
                      <div className="text-fog uppercase tracking-widest">Posture</div>
                      <div className="text-ink mt-0.5 truncate">{live.posture.diplomatic}</div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
