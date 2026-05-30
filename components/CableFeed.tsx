"use client";

import { NATIONS } from "@/lib/nations";
import { SAMPLE_CABLES } from "@/lib/cables";
import { useLiveCables } from "@/lib/useLiveState";
import type { Cable } from "@/engine/types";

const categoryAccent: Record<string, string> = {
  diplomacy: "#a37aa0",
  war: "#c14a3a",
  economy: "#6fa787",
  order: "#a8763a",
  science: "#6c7fb1",
  ceremony: "#8a4f2a",
};

export default function CableFeed() {
  const live = useLiveCables(30_000, 80);
  const cables: Cable[] | (typeof SAMPLE_CABLES) =
    live && live.length > 0 ? live : (SAMPLE_CABLES as unknown as Cable[]);

  return (
    <section className="relative border-t border-bone-line bg-bone">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <div className="label">§ 04 · The Wire</div>
            <h2 className="serif text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.05] tracking-tight mt-2 mb-4">
              Every cable, archived.
            </h2>
            <p className="text-ink-soft leading-relaxed max-w-md">
              The live diplomatic archive of the current cycle. Every cabinet
              decision, declaration, embargo, and skirmish produces a cable.
              None are deleted. All are public. Updates every 30 seconds.
            </p>
            <div className="mt-8 mono text-[10px] uppercase tracking-widest text-fog space-y-1">
              <div>Priority · routine / elevated / flash</div>
              <div>Tier · category-coded</div>
              <div>{live ? "Source · live engine" : "Source · sample feed"}</div>
            </div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="border border-bone-line bg-bone-soft/30">
              <div className="flex items-center justify-between px-4 py-3 border-b border-bone-line mono text-[10px] uppercase tracking-widest text-ash">
                <span>
                  Cable archive · cycle 0
                  {live ? " · live" : " · sample"}
                </span>
                <span>{cables.length} entries</span>
              </div>
              <ol className="divide-y divide-bone-line max-h-[640px] overflow-y-auto">
                {cables.map((cable, i) => {
                  const accent = categoryAccent[cable.category] ?? "#0d0d0c";
                  const from = NATIONS.find((n) => n.code === cable.from);
                  const to = cable.to
                    ? NATIONS.find((n) => n.code === cable.to)
                    : null;
                  return (
                    <li
                      key={"id" in cable ? cable.id : i}
                      className="px-4 py-4 hover:bg-bone-soft/60 transition-colors"
                    >
                      <div className="grid grid-cols-[64px_1fr] gap-4">
                        <div>
                          <div className="mono text-[10px] text-ash uppercase tracking-widest">
                            T·{String(cable.turn).padStart(2, "0")}
                          </div>
                          <div
                            className="mono text-[10px] mt-1 uppercase tracking-widest"
                            style={{
                              color:
                                cable.priority === "flash"
                                  ? "#c14a3a"
                                  : cable.priority === "elevated"
                                    ? "#a8763a"
                                    : "var(--color-fog)",
                            }}
                          >
                            {cable.priority}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1.5 mono text-[10px] uppercase tracking-widest">
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full"
                              style={{ background: accent }}
                            />
                            <span style={{ color: accent }}>{cable.category}</span>
                            <span className="text-ash">·</span>
                            <span className="text-ink-soft">
                              {from?.name ?? cable.from}
                            </span>
                            {to && (
                              <>
                                <span className="text-ash">→</span>
                                <span className="text-ink-soft">{to.name}</span>
                              </>
                            )}
                            {!to && cable.to && (
                              <>
                                <span className="text-ash">→</span>
                                <span className="text-ink-soft">{cable.to}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-ink leading-snug">
                            {cable.body}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
