"use client";

import { useState } from "react";
import { NATIONS } from "@/lib/nations";
import { CITY_DATA } from "@/lib/cityData";
import { useLiveState } from "@/lib/useLiveState";
import type { NationState } from "@/engine/types";
import ScrollHint from "./ScrollHint";

const TABS = [
  "Overview",
  "Charter",
  "Objectives",
  "Cabinet",
  "Cities",
  "Economy",
  "Society",
  "Military",
  "Diplomacy",
  "Order",
  "Intel",
] as const;
type Tab = (typeof TABS)[number];

export default function CountrySheet({
  code,
  onClose,
}: {
  code: string;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const nation = NATIONS.find((n) => n.code === code);
  const { data } = useLiveState(20_000);
  const live = data?.state?.nations[code as keyof typeof data.state.nations] as NationState | undefined;
  if (!nation) return null;

  const declaredMotto = live?.declaredMotto || "";
  const declaredDoctrine =
    live?.declaredDoctrine && live.declaredDoctrine !== "undeclared"
      ? live.declaredDoctrine
      : "doctrine pending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end pointer-events-none"
      role="dialog"
      aria-label={`${nation.name} dossier`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] pointer-events-auto"
      />
      <aside
        className="relative pointer-events-auto bg-bone w-full sm:max-w-[480px] sm:w-[480px] sm:h-full max-h-[88svh] sm:max-h-full overflow-y-auto border-t sm:border-t-0 sm:border-l border-bone-line shadow-[0_-20px_60px_-20px_rgba(13,13,12,0.4)] sm:shadow-[-20px_0_60px_-20px_rgba(13,13,12,0.4)]"
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: nation.ink, opacity: 0.85 }}
        />
        <div className="sm:hidden flex justify-center pt-2.5">
          <div className="w-10 h-1 rounded-full bg-bone-line" />
        </div>

        <div className="px-5 sm:px-7 pt-5 sm:pt-8 pb-5 border-b border-bone-line">
          <div className="flex items-start justify-between">
            <div>
              <div
                className="mono text-[10px] uppercase tracking-widest"
                style={{ color: nation.ink, opacity: 0.65 }}
              >
                Sovereign · {nation.code} · {declaredDoctrine}
              </div>
              <h2
                className="serif text-4xl sm:text-5xl leading-none tracking-tight mt-2"
                style={{ color: nation.ink }}
              >
                {nation.name}
              </h2>
              {declaredMotto && (
                <p className="mt-3 italic serif text-base text-ink-soft max-w-[34ch]">
                  &ldquo;{declaredMotto}&rdquo;
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dossier"
              className="mono text-xs uppercase tracking-widest text-ash hover:text-ink transition-colors px-2 py-1"
            >
              ✕
            </button>
          </div>
          <div className="mt-5 mono text-xs text-ash uppercase tracking-widest">
            Steward · {nation.steward.label} · {nation.steward.provider}
          </div>
        </div>

        <div className="px-5 sm:px-7 pt-4 sticky top-0 bg-bone z-10 border-b border-bone-line">
          <ScrollHint>
            <div className="inline-flex gap-1 min-w-full">
              {TABS.map((t) => {
                const isActive = t === tab;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="relative flex-shrink-0 mono text-[10px] sm:text-xs uppercase tracking-widest px-2.5 py-2 transition-colors"
                    style={{ color: isActive ? nation.ink : "var(--color-ash)" }}
                  >
                    {t}
                    {isActive && (
                      <span
                        className="absolute -bottom-px left-2 right-2 h-px"
                        style={{ background: nation.ink }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollHint>
        </div>

        <div className="px-5 sm:px-7 py-6 space-y-6">
          {tab === "Overview" && <Overview ink={nation.ink} live={live} />}
          {tab === "Charter" && <Charter ink={nation.ink} live={live} />}
          {tab === "Objectives" && <Objectives ink={nation.ink} live={live} />}
          {tab === "Cabinet" && <Cabinet ink={nation.ink} live={live} />}
          {tab === "Cities" && <Cities ink={nation.ink} code={code} live={live} />}
          {tab === "Economy" && <Economy ink={nation.ink} live={live} />}
          {tab === "Society" && <Society ink={nation.ink} live={live} />}
          {tab === "Military" && <Military ink={nation.ink} live={live} />}
          {tab === "Diplomacy" && <Diplomacy ink={nation.ink} code={code} world={data?.state} />}
          {tab === "Order" && <Order ink={nation.ink} live={live} />}
          {tab === "Intel" && <Intel ink={nation.ink} live={live} />}
        </div>
      </aside>
    </div>
  );
}

function Stat({ k, v, ink }: { k: string; v: string; ink: string }) {
  return (
    <div className="border border-bone-line p-3.5 bg-bone-soft/40">
      <div className="mono text-[10px] uppercase tracking-widest text-ash">{k}</div>
      <div className="serif text-2xl leading-none mt-1.5" style={{ color: ink }}>
        {v}
      </div>
    </div>
  );
}

function MiniRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between mono text-xs">
      <span className="text-ash uppercase tracking-widest">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}

function Overview({ ink, live }: { ink: string; live?: NationState }) {
  if (!live) return <Pending ink={ink} text="Awaiting first cabinet sitting." />;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Stat k="GDP" v={`₸${Math.round(live.economy.gdp)}B`} ink={ink} />
        <Stat k="GDP / capita" v={`₸${Math.round(live.economy.gdpPerCapita).toLocaleString()}`} ink={ink} />
        <Stat k="Treasury" v={`₸${Math.round(live.economy.treasury)}M`} ink={ink} />
        <Stat k="Public debt" v={`₸${Math.round(live.economy.publicDebt)}M`} ink={ink} />
        <Stat k="Inflation" v={`${(live.economy.inflation * 100).toFixed(1)}%`} ink={ink} />
        <Stat k="Unemployment" v={`${(live.economy.unemployment * 100).toFixed(1)}%`} ink={ink} />
        <Stat k="Standing army" v={`${Math.round(live.military.standingArmy)}K`} ink={ink} />
        <Stat k="Approval" v={`${Math.round(live.approval * 100)}%`} ink={ink} />
      </div>
      <div>
        <div className="label mb-2">Posture</div>
        <div className="flex items-center gap-2 mono text-xs uppercase tracking-widest">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background:
                live.posture.diplomatic === "war"
                  ? "#c14a3a"
                  : live.posture.diplomatic === "tense"
                    ? "#a8763a"
                    : live.posture.diplomatic === "alliance"
                      ? "#6fa787"
                      : "#8a857c",
            }}
          />
          <span className="text-ink">{live.posture.diplomatic}</span>
          <span className="text-ash">·</span>
          <span className="text-ash">unrest {Math.round(live.unrest * 100)}%</span>
          <span className="text-ash">·</span>
          <span className="text-ash">influence {Math.round(live.influence * 100)}%</span>
        </div>
      </div>
    </>
  );
}

function Charter({ ink, live }: { ink: string; live?: NationState }) {
  const con = live?.constitution;
  if (!con) {
    return (
      <Pending
        ink={ink}
        text="No founding charter ratified yet. The steward is drafting it this cycle."
      />
    );
  }
  return (
    <div className="-mx-5 sm:-mx-7 -my-6">
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, #ede0c2 0%, #ebdcb8 50%, #ede0c2 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 30%, rgba(107,62,22,0.08) 0%, transparent 60%), radial-gradient(circle at 75% 70%, rgba(107,62,22,0.06) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(107,62,22,0.025) 2px, rgba(107,62,22,0.025) 3px)",
          }}
        />
        <div className="relative px-6 sm:px-9 py-10 sm:py-12">
          <div className="text-center mb-9">
            <div
              className="mono text-[10px] uppercase tracking-[0.32em] mb-3"
              style={{ color: ink, opacity: 0.72 }}
            >
              ✦ Founding Charter ✦
            </div>
            <h3
              className="serif text-[clamp(1.7rem,4.2vw,2.4rem)] leading-[1.05] italic"
              style={{ color: ink }}
            >
              Ratified Cycle {String(con.ratifiedCycle).padStart(2, "0")}
            </h3>
            {con.amendments.length > 0 && (
              <div
                className="mt-2 mono text-[10px] uppercase tracking-widest"
                style={{ color: ink, opacity: 0.55 }}
              >
                Amendments · {con.amendments.length}
              </div>
            )}
          </div>

          <div
            className="border-y py-7 mb-9"
            style={{ borderColor: ink, borderTopWidth: 0.5, borderBottomWidth: 0.5 }}
          >
            <p
              className="serif italic text-[15px] sm:text-base leading-[1.75] text-center max-w-[44ch] mx-auto"
              style={{ color: ink }}
            >
              &ldquo;{con.preamble}&rdquo;
            </p>
          </div>

          <ol className="space-y-8">
            {con.articles.map((art, i) => (
              <li key={i} className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6">
                <div
                  className="serif italic text-3xl sm:text-4xl leading-none pt-1 select-none"
                  style={{ color: ink, opacity: 0.55 }}
                >
                  {art.numeral}
                </div>
                <div>
                  <h4
                    className="mono text-[10px] uppercase tracking-[0.28em] mb-2.5"
                    style={{ color: ink }}
                  >
                    {art.title}
                  </h4>
                  <p
                    className="serif text-[14.5px] sm:text-[15px] leading-[1.72]"
                    style={{ color: ink, opacity: 0.92 }}
                  >
                    {art.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Objectives({ ink, live }: { ink: string; live?: NationState }) {
  if (!live || live.strategicObjectives.length === 0) {
    return <Pending ink={ink} text="No strategic objectives declared yet." />;
  }
  return (
    <div className="space-y-3">
      <div className="label">Long-term goals · self-declared</div>
      <ol className="space-y-3">
        {live.strategicObjectives.map((o, i) => (
          <li key={i} className="border-l-2 pl-4 py-1" style={{ borderColor: ink }}>
            <div className="mono text-[10px] uppercase tracking-widest" style={{ color: ink, opacity: 0.65 }}>
              Objective {String(i + 1).padStart(2, "0")}
            </div>
            <p className="text-sm text-ink leading-relaxed mt-1">{o}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Cabinet({ ink, live }: { ink: string; live?: NationState }) {
  if (!live) return <Pending ink={ink} text="Cabinet not yet seated." />;
  return (
    <div className="space-y-4">
      <div>
        <div className="label mb-2">Budget allocation</div>
        <div className="space-y-1.5">
          {Object.entries(live.budget).map(([k, v]) => (
            <div key={k} className="space-y-1">
              <div className="flex justify-between mono text-[11px]">
                <span className="text-ash uppercase tracking-widest">{k.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-ink">{(v * 100).toFixed(0)}%</span>
              </div>
              <div className="relative h-1 bg-bone-line">
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{ width: `${Math.round(v * 100)}%`, background: ink }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="label mb-2">Edicts this cycle</div>
        {live.edicts.length === 0 ? (
          <p className="text-fog italic text-sm">No edicts issued.</p>
        ) : (
          <ul className="space-y-2 text-sm text-ink leading-snug">
            {live.edicts.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: ink }}>·</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <div className="label mb-1">Research priority</div>
        <p className="text-sm text-ink">{live.research || "—"}</p>
      </div>
    </div>
  );
}

function Cities({ ink, code, live }: { ink: string; code: string; live?: NationState }) {
  const cities = live?.cities ?? [];
  return (
    <div className="grid grid-cols-2 gap-2">
      {cities.map((c) => {
        const cd = CITY_DATA[`${code}:${c.name}`];
        return (
          <div key={c.name} className="border border-bone-line p-3.5 bg-bone-soft/40">
            <div className="mono text-[10px] uppercase tracking-widest text-ash">
              {c.capital ? "Capital" : "Province"} · {cd?.character ?? c.character}
            </div>
            <div className="serif text-xl leading-none mt-1.5" style={{ color: ink }}>
              {c.name}
            </div>
            <div className="mt-2 mono text-[10px] text-ash leading-relaxed">
              pop {c.population.toFixed(1)}M · dev {Math.round(c.development)} · loyalty {Math.round(c.loyalty * 100)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Economy({ ink, live }: { ink: string; live?: NationState }) {
  if (!live) return <Pending ink={ink} text="Treasury awaiting opening budget." />;
  const e = live.economy;
  const t = live.taxation;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat k="GDP" v={`₸${Math.round(e.gdp)}B`} ink={ink} />
        <Stat k="GDP / capita" v={`₸${Math.round(e.gdpPerCapita).toLocaleString()}`} ink={ink} />
        <Stat k="Treasury" v={`₸${Math.round(e.treasury)}M`} ink={ink} />
        <Stat k="Public debt" v={`₸${Math.round(e.publicDebt)}M`} ink={ink} />
        <Stat k="Inflation" v={`${(e.inflation * 100).toFixed(2)}%`} ink={ink} />
        <Stat k="Interest rate" v={`${(e.interestRate * 100).toFixed(2)}%`} ink={ink} />
      </div>
      <div className="border border-bone-line bg-bone-soft/40">
        <div className="px-3.5 py-2 border-b border-bone-line label">Wages & cost of living</div>
        <div className="p-3.5 space-y-1.5">
          <MiniRow k="Minimum wage" v={`₸${e.minimumWage.toFixed(1)} / day`} />
          <MiniRow k="Average salary" v={`₸${Math.round(e.averageSalary).toLocaleString()} / month`} />
          <MiniRow k="Median income" v={`₸${Math.round(e.medianIncome).toLocaleString()} / month`} />
          <MiniRow k="Cost of living idx" v={`${Math.round(e.costOfLivingIndex)}`} />
          <MiniRow k="Inequality (Gini)" v={`${e.gini.toFixed(2)}`} />
          <MiniRow k="Trade balance" v={`${e.tradeBalance >= 0 ? "+" : ""}₸${Math.round(e.tradeBalance)}M`} />
        </div>
      </div>
      <div className="border border-bone-line bg-bone-soft/40">
        <div className="px-3.5 py-2 border-b border-bone-line label">Tax doctrine</div>
        <div className="p-3.5 space-y-1.5">
          {Object.entries(t).map(([k, v]) => (
            <MiniRow key={k} k={k} v={`${((v as number) * 100).toFixed(1)}%`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Society({ ink, live }: { ink: string; live?: NationState }) {
  if (!live) return <Pending ink={ink} text="Society indicators publishing soon." />;
  const s = live.society;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Population" v={`${s.population.toFixed(1)}M`} ink={ink} />
        <Stat k="Growth (yr)" v={`${(s.populationGrowth * 100).toFixed(2)}%`} ink={ink} />
        <Stat k="Life expectancy" v={`${s.lifeExpectancy.toFixed(1)} yrs`} ink={ink} />
        <Stat k="Literacy" v={`${(s.literacy * 100).toFixed(0)}%`} ink={ink} />
      </div>
      <div className="border border-bone-line bg-bone-soft/40">
        <div className="px-3.5 py-2 border-b border-bone-line label">Policy frame</div>
        <div className="p-3.5 space-y-1.5">
          <MiniRow k="Healthcare model" v={s.healthcareModel} />
          <MiniRow k="Healthcare cover" v={`${Math.round(s.healthcareCoverage * 100)}%`} />
          <MiniRow k="Education priority" v={s.educationPriority} />
          <MiniRow k="School enrolment" v={`${Math.round(s.schoolEnrollment * 100)}%`} />
          <MiniRow k="Welfare cover" v={`${Math.round(s.welfareCoverage * 100)}%`} />
          <MiniRow k="Immigration" v={s.immigrationPolicy} />
          <MiniRow k="Press freedom" v={`${Math.round(s.pressFreedom * 100)}%`} />
          <MiniRow k="Corruption" v={`${Math.round(s.corruption * 100)}%`} />
        </div>
      </div>
    </div>
  );
}

function Military({ ink, live }: { ink: string; live?: NationState }) {
  if (!live) return <Pending ink={ink} text="Defense council not seated." />;
  const m = live.military;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Standing army" v={`${Math.round(m.standingArmy)}K`} ink={ink} />
        <Stat k="Reserves" v={`${Math.round(m.reserves)}K`} ink={ink} />
        <Stat k="Morale" v={`${Math.round(m.morale * 100)}%`} ink={ink} />
        <Stat k="Conscription" v={m.conscription ? "active" : "off"} ink={ink} />
      </div>
      <div className="border border-bone-line bg-bone-soft/40 p-3.5">
        <div className="label mb-1">Declared doctrine</div>
        <p className="text-sm text-ink">{m.doctrine === "undeclared" ? "—" : m.doctrine}</p>
      </div>
    </div>
  );
}

function Diplomacy({ ink, code, world }: { ink: string; code: string; world?: { bilateral: NationState extends infer _ ? Record<string, Record<string, { score: number; status: string; treaties: string[]; lastCable: string; tradeVolume: number }>> : never; nations: Record<string, NationState> } }) {
  const rels = world?.bilateral[code];
  if (!rels) return <Pending ink={ink} text="No bilateral records yet." />;
  return (
    <div className="space-y-3">
      {Object.entries(rels).map(([peer, rel]) => {
        const target = world!.nations[peer];
        if (!target) return null;
        const color =
          rel.status === "war"
            ? "#c14a3a"
            : rel.status === "embargo"
              ? "#8a4f2a"
              : rel.status === "tense"
                ? "#a8763a"
                : rel.status === "alliance"
                  ? "#6fa787"
                  : ink;
        return (
          <div key={peer} className="border border-bone-line bg-bone-soft/40">
            <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-bone-line">
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-ash">
                  vs {peer}
                </div>
                <div className="serif text-lg leading-none mt-1" style={{ color: ink }}>
                  {target.name}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="mono text-[10px] uppercase tracking-widest"
                  style={{ color }}
                >
                  {rel.status}
                </div>
                <div className="serif text-xl leading-none mt-1" style={{ color }}>
                  {rel.score > 0 ? "+" : ""}
                  {rel.score.toFixed(0)}
                </div>
              </div>
            </div>
            <div className="px-3.5 py-2.5 mono text-[11px] text-ink-soft">
              {rel.treaties.length > 0 ? (
                <div className="mb-1.5">
                  <span className="text-ash uppercase tracking-widest">Treaties:</span>{" "}
                  {rel.treaties.join(" · ")}
                </div>
              ) : (
                <div className="mb-1.5 text-fog uppercase tracking-widest">
                  No active treaties
                </div>
              )}
              <div className="mb-1 text-ash">Trade volume: ₸{Math.round(rel.tradeVolume)}M / cycle</div>
              <div className="italic text-ink">&ldquo;{rel.lastCable}&rdquo;</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Order({ ink, live }: { ink: string; live?: NationState }) {
  if (!live) return <Pending ink={ink} text="Interior ministry awaiting first census." />;
  const cities = live.cities;
  const avg = cities.reduce((s, c) => s + c.crime.total, 0) / cities.length;
  const totalPolice = cities.reduce((s, c) => s + c.police, 0);
  const heat = avg > 0.4 ? "#c14a3a" : avg > 0.28 ? "#a8763a" : ink;
  return (
    <div className="space-y-4">
      <div className="border border-bone-line p-4 bg-bone-soft/40">
        <div className="flex items-baseline justify-between mb-2">
          <span className="label">National crime index</span>
          <span className="serif text-3xl leading-none" style={{ color: heat }}>
            {(avg * 100).toFixed(0)}
          </span>
        </div>
        <div className="relative h-1.5 bg-bone-line">
          <div
            className="absolute top-0 left-0 h-full"
            style={{ width: `${Math.round(avg * 100)}%`, background: heat }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Total police" v={`${totalPolice.toFixed(0)}K`} ink={ink} />
        <Stat
          k="Hot precincts"
          v={String(cities.filter((c) => c.crime.total > 0.4).length)}
          ink={ink}
        />
      </div>
      <div>
        <div className="label mb-2">By city</div>
        <div className="space-y-2.5">
          {cities
            .slice()
            .sort((a, b) => b.crime.total - a.crime.total)
            .map((c) => {
              const color =
                c.crime.total > 0.45
                  ? "#c14a3a"
                  : c.crime.total > 0.3
                    ? "#a8763a"
                    : ink;
              return (
                <div key={c.name}>
                  <div className="flex justify-between mono text-[11px] mb-1">
                    <span className="text-ash uppercase tracking-widest">
                      {c.capital ? "◼ " : ""}
                      {c.name}
                    </span>
                    <span style={{ color }}>{(c.crime.total * 100).toFixed(0)}</span>
                  </div>
                  <div className="relative h-1 bg-bone-line">
                    <div
                      className="absolute top-0 left-0 h-full"
                      style={{
                        width: `${Math.round(c.crime.total * 100)}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function Intel({ ink, live }: { ink: string; live?: NationState }) {
  if (!live) return <Pending ink={ink} text="No intel network deployed." />;
  return (
    <div className="space-y-3 mono text-xs">
      <div className="border border-bone-line p-3.5 bg-bone-soft/40">
        <div className="label">Known about peers</div>
        <div className="serif text-2xl mt-1.5" style={{ color: ink }}>
          {Math.round(live.posture.intelKnown * 100)}%
        </div>
        <div className="text-ash mt-2">
          Network confidence based on{" "}
          {live.posture.intelKnown > 0.7
            ? "high"
            : live.posture.intelKnown > 0.5
              ? "moderate"
              : "limited"}{" "}
          agent placement.
        </div>
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label">Latest report</div>
        <div className="text-ink mt-2">Awaiting first dispatch from field stations.</div>
      </div>
    </div>
  );
}

function Pending({ ink, text }: { ink: string; text: string }) {
  return (
    <div
      className="border border-dashed p-6 text-center"
      style={{ borderColor: ink, color: ink }}
    >
      <div className="serif text-xl italic">Pending</div>
      <p className="mt-2 text-sm opacity-80">{text}</p>
    </div>
  );
}
