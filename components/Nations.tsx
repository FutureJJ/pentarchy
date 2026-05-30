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
              What each steward just decided
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
            const ratified = !!live?.constitution;
            return (
              <article
                key={n.code}
                className="group relative bg-bone p-6 flex flex-col min-h-[380px]"
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
                      {n.steward.label} · {n.steward.provider}
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
                <div className="mono text-[10px] text-ash mt-1 uppercase tracking-widest line-clamp-1">
                  {live?.declaredDoctrine && live.declaredDoctrine !== "undeclared"
                    ? live.declaredDoctrine
                    : "doctrine undeclared"}
                </div>
                {live?.declaredMotto && (
                  <p className="italic serif text-sm text-ink-soft leading-snug mt-3 line-clamp-2">
                    &ldquo;{live.declaredMotto}&rdquo;
                  </p>
                )}

                <div className="mt-4 space-y-3 text-xs flex-1">
                  {live?.strategicObjectives && live.strategicObjectives.length > 0 && (
                    <div>
                      <div className="label mb-1.5">Strategic objectives</div>
                      <ul className="space-y-1 text-ink-soft leading-snug">
                        {live.strategicObjectives.slice(0, 3).map((o, j) => (
                          <li key={j} className="flex gap-1.5">
                            <span style={{ color: n.ink }}>·</span>
                            <span className="line-clamp-1">{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <div className="label mb-1.5">Research this cycle</div>
                    <div className="text-ink leading-snug line-clamp-2">
                      {live?.research || "—"}
                    </div>
                  </div>

                  <div>
                    <div className="label mb-1.5">Edicts this cycle</div>
                    {live?.edicts && live.edicts.length > 0 ? (
                      <ul className="space-y-1.5 text-ink-soft leading-snug">
                        {live.edicts.slice(0, 2).map((e, j) => (
                          <li key={j} className="flex gap-1.5">
                            <span style={{ color: n.ink }}>·</span>
                            <span className="line-clamp-2">{e}</span>
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
                      <p className="text-ink-soft italic leading-snug line-clamp-2">
                        &ldquo;{lastSent.body}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {live && (
                  <div className="mt-4 pt-3 border-t border-bone-line grid grid-cols-4 gap-2 mono text-[10px] text-ash">
                    <div>
                      <div className="text-fog uppercase tracking-widest">GDP</div>
                      <div className="text-ink mt-0.5">{Math.round(live.economy.gdp)}B</div>
                    </div>
                    <div>
                      <div className="text-fog uppercase tracking-widest">Army</div>
                      <div className="text-ink mt-0.5">{Math.round(live.military.standingArmy)}K</div>
                    </div>
                    <div>
                      <div className="text-fog uppercase tracking-widest">Unemp</div>
                      <div className="text-ink mt-0.5">{(live.economy.unemployment * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-fog uppercase tracking-widest">Chrtr</div>
                      <div className="text-ink mt-0.5">{ratified ? "✓" : "—"}</div>
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
