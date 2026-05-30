"use client";

import { useState } from "react";
import { NATIONS } from "@/lib/nations";
import { CITY_DATA } from "@/lib/cityData";
import { BILATERAL } from "@/lib/relations";
import { CONSTITUTIONS } from "@/lib/constitutions";
import ScrollHint from "./ScrollHint";

const TABS = [
  "Overview",
  "Charter",
  "Cabinet",
  "Cities",
  "Treasury",
  "Order",
  "Society",
  "Science",
  "Treaties",
  "Intel",
  "War",
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
  if (!nation) return null;

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
        className="relative pointer-events-auto bg-bone w-full sm:max-w-[460px] sm:w-[460px] sm:h-full max-h-[88svh] sm:max-h-full overflow-y-auto border-t sm:border-t-0 sm:border-l border-bone-line shadow-[0_-20px_60px_-20px_rgba(13,13,12,0.4)] sm:shadow-[-20px_0_60px_-20px_rgba(13,13,12,0.4)]"
        style={{
          borderTopColor: nation.ink,
        }}
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
              <div className="mono text-[10px] uppercase tracking-widest" style={{ color: nation.ink, opacity: 0.65 }}>
                Sovereign · {nation.code} · {nation.doctrine}
              </div>
              <h2 className="serif text-4xl sm:text-5xl leading-none tracking-tight mt-2" style={{ color: nation.ink }}>
                {nation.name}
              </h2>
              <p className="mt-3 italic serif text-base text-ink-soft max-w-[34ch]">
                &ldquo;{nation.motto}&rdquo;
              </p>
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
                    style={{
                      color: isActive ? nation.ink : "var(--color-ash)",
                    }}
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
          {tab === "Overview" && <Overview nation={nation} />}
          {tab === "Charter" && <Constitution nation={nation} />}
          {tab === "Cabinet" && <Cabinet nation={nation} />}
          {tab === "Cities" && <Cities nation={nation} />}
          {tab === "Treasury" && <Treasury nation={nation} />}
          {tab === "Order" && <OrderTab nation={nation} />}
          {tab === "Society" && <SocietyTab nation={nation} />}
          {tab === "Science" && <ScienceTab nation={nation} />}
          {tab === "Treaties" && <Treaties nation={nation} />}
          {tab === "Intel" && <Intel nation={nation} />}
          {tab === "War" && <War nation={nation} />}
        </div>
      </aside>
    </div>
  );
}

type N = (typeof NATIONS)[number];

function Stat({ k, v, n }: { k: string; v: string; n?: N }) {
  return (
    <div className="border border-bone-line p-3.5 bg-bone-soft/40">
      <div className="mono text-[10px] uppercase tracking-widest text-ash">{k}</div>
      <div className="serif text-2xl leading-none mt-1.5" style={{ color: n?.ink ?? "var(--color-ink)" }}>
        {v}
      </div>
    </div>
  );
}

function Overview({ nation }: { nation: N }) {
  const m = nation.metrics;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Stat k="GDP (B ₸)" v={String(m.gdp)} n={nation} />
        <Stat k="Population" v={`${m.population}M`} n={nation} />
        <Stat k="Treasury" v={`₸${m.treasury}M`} n={nation} />
        <Stat k="Standing Army" v={`${m.army}K`} n={nation} />
        <Stat k="Morale" v={`${Math.round(m.morale * 100)}%`} n={nation} />
        <Stat k="Influence" v={`${Math.round(m.influence * 100)}%`} n={nation} />
      </div>
      <div>
        <div className="label mb-2">Posture</div>
        <div className="flex items-center gap-2 mono text-xs uppercase tracking-widest">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background:
                nation.posture.diplomatic === "war"
                  ? "#c14a3a"
                  : nation.posture.diplomatic === "tense"
                    ? "#a8763a"
                    : "#6fa787",
            }}
          />
          <span className="text-ink">{nation.posture.diplomatic}</span>
          <span className="text-ash">·</span>
          <span className="text-ash">intel known {Math.round(nation.posture.intelKnown * 100)}%</span>
        </div>
      </div>
    </>
  );
}

function Constitution({ nation }: { nation: N }) {
  const con = CONSTITUTIONS[nation.code];
  if (!con) return null;
  return (
    <div className="-mx-5 sm:-mx-7 -my-6 px-0">
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
              style={{ color: nation.ink, opacity: 0.72 }}
            >
              ✦ Charter of the realm ✦
            </div>
            <h3
              className="serif text-[clamp(1.9rem,5vw,2.8rem)] leading-[1.05] italic"
              style={{ color: nation.ink }}
            >
              The Constitution
              <br />
              of {nation.name}
            </h3>
            <div className="flex items-center justify-center gap-3 mt-5 mono text-[10px] uppercase tracking-widest" style={{ color: nation.ink, opacity: 0.6 }}>
              <span className="h-px w-8" style={{ background: nation.ink, opacity: 0.4 }} />
              <span>Ratified · {con.ratifiedDate}</span>
              <span className="h-px w-8" style={{ background: nation.ink, opacity: 0.4 }} />
            </div>
          </div>

          <div
            className="border-y py-7 mb-9"
            style={{ borderColor: nation.ink, borderTopWidth: 0.5, borderBottomWidth: 0.5, opacity: 1 }}
          >
            <p
              className="serif italic text-[15px] sm:text-base leading-[1.75] text-center max-w-[42ch] mx-auto"
              style={{ color: nation.ink }}
            >
              &ldquo;{con.preamble}&rdquo;
            </p>
          </div>

          <ol className="space-y-9">
            {con.articles.map((art) => (
              <li key={art.numeral} className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6">
                <div
                  className="serif italic text-3xl sm:text-4xl leading-none pt-1 select-none"
                  style={{ color: nation.ink, opacity: 0.55 }}
                >
                  {art.numeral}
                </div>
                <div>
                  <h4
                    className="mono text-[10px] uppercase tracking-[0.28em] mb-2.5"
                    style={{ color: nation.ink }}
                  >
                    {art.title}
                  </h4>
                  <div className="space-y-3">
                    {art.body.map((p, i) => (
                      <p
                        key={i}
                        className="serif text-[14.5px] sm:text-[15px] leading-[1.72]"
                        style={{ color: nation.ink, opacity: 0.92 }}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 pt-8 border-t" style={{ borderColor: nation.ink, opacity: 1, borderTopWidth: 0.5 }}>
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <div
                  className="mono text-[10px] uppercase tracking-widest mb-1"
                  style={{ color: nation.ink, opacity: 0.65 }}
                >
                  Sealed at {con.ratifiedDate}
                </div>
                <div
                  className="serif text-base italic"
                  style={{ color: nation.ink }}
                >
                  By the hand of {nation.steward.label}
                </div>
                <div
                  className="mono text-[10px] uppercase tracking-widest mt-1"
                  style={{ color: nation.ink, opacity: 0.55 }}
                >
                  Authority · {nation.steward.provider}
                </div>
              </div>
              <WaxSeal code={nation.code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WaxSeal({ code }: { code: string }) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
      style={{
        filter: "drop-shadow(0 4px 6px rgba(13,13,12,0.25))",
        transform: "rotate(-6deg)",
      }}
    >
      <defs>
        <radialGradient id={`wax-${code}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#b04532" />
          <stop offset="60%" stopColor="#8a2a1f" />
          <stop offset="100%" stopColor="#5a1a14" />
        </radialGradient>
      </defs>
      <path
        d="M -42 0 Q -38 -32 0 -42 Q 38 -32 42 0 Q 38 32 0 42 Q -38 32 -42 0 Z"
        fill={`url(#wax-${code})`}
      />
      <circle
        r="32"
        fill="none"
        stroke="#f4efe6"
        strokeWidth="0.8"
        opacity="0.65"
      />
      <circle
        r="26"
        fill="none"
        stroke="#f4efe6"
        strokeWidth="0.35"
        opacity="0.45"
      />
      <g stroke="#f4efe6" strokeWidth="0.4" opacity="0.5">
        <line x1="0" y1="-26" x2="0" y2="-32" />
        <line x1="0" y1="32" x2="0" y2="26" />
        <line x1="-32" y1="0" x2="-26" y2="0" />
        <line x1="32" y1="0" x2="26" y2="0" />
      </g>
      <text
        x="0"
        y="6"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="18"
        fill="#f4efe6"
        opacity="0.95"
        fontStyle="italic"
      >
        {code}
      </text>
    </svg>
  );
}

function Cabinet({ nation }: { nation: N }) {
  return (
    <div className="space-y-3 mono text-xs">
      {[
        ["Defense", `${nation.metrics.army}K standing`, "0.28"],
        ["Treasury", `₸${nation.metrics.treasury}M reserves`, "0.18"],
        ["Foreign", `${nation.posture.diplomatic}`, "0.16"],
        ["Interior", `morale ${Math.round(nation.metrics.morale * 100)}%`, "0.14"],
        ["Intelligence", `${Math.round(nation.posture.intelKnown * 100)}% known`, "0.12"],
        ["Public Works", "infra +2.4%", "0.12"],
      ].map(([k, v, share]) => (
        <div key={k} className="flex items-center justify-between border-b border-bone-line pb-2">
          <span className="text-ash uppercase tracking-widest">{k}</span>
          <span className="text-ink">{v}</span>
          <span className="text-fog">{share}</span>
        </div>
      ))}
      <div className="text-[10px] text-fog uppercase tracking-widest pt-2">
        Latest decision · awaiting first cabinet sitting
      </div>
    </div>
  );
}

function Cities({ nation }: { nation: N }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {nation.cities.map((c) => (
        <div key={c.name} className="border border-bone-line p-3.5 bg-bone-soft/40">
          <div className="mono text-[10px] uppercase tracking-widest text-ash">
            {c.capital ? "Capital" : "Province"}
          </div>
          <div className="serif text-xl leading-none mt-1.5" style={{ color: nation.ink }}>
            {c.name}
          </div>
          <div className="mt-3 mono text-[10px] text-fog uppercase tracking-widest">
            pop · garrison · loyalty pending
          </div>
        </div>
      ))}
    </div>
  );
}

function Treasury({ nation }: { nation: N }) {
  const m = nation.metrics;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Treasury" v={`₸${m.treasury}M`} n={nation} />
        <Stat k="GDP" v={`₸${m.gdp}B`} n={nation} />
      </div>
      <div className="border border-bone-line bg-bone-soft/40">
        <div className="px-3.5 py-2 border-b border-bone-line label">Tax doctrine</div>
        <div className="mono text-xs p-3.5 space-y-1.5">
          <div className="flex justify-between"><span className="text-ash">Land</span><span>5.0%</span></div>
          <div className="flex justify-between"><span className="text-ash">Harbour</span><span>4.0%</span></div>
          <div className="flex justify-between"><span className="text-ash">Excise</span><span>2.5%</span></div>
        </div>
      </div>
    </div>
  );
}

function Treaties({ nation }: { nation: N }) {
  const relations = BILATERAL[nation.code] ?? {};
  const peers = Object.entries(relations);
  return (
    <div className="space-y-3">
      <div className="label">Bilateral standing</div>
      {peers.map(([peer, rel]) => {
        const target = NATIONS.find((n) => n.code === peer);
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
                  : nation.ink;
        return (
          <div key={peer} className="border border-bone-line bg-bone-soft/40">
            <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-bone-line">
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-ash">
                  vs {peer}
                </div>
                <div className="serif text-lg leading-none mt-1" style={{ color: target.ink }}>
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
                  {rel.score}
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
              <div className="italic text-ink">&ldquo;{rel.lastCable}.&rdquo;</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderTab({ nation }: { nation: N }) {
  const cityScores = nation.cities.map((c) => {
    const d = CITY_DATA[`${nation.code}:${c.name}`];
    return { name: c.name, crime: d?.crime.total ?? 0, police: d?.police ?? 0, capital: c.capital };
  });
  const avg = cityScores.reduce((s, c) => s + c.crime, 0) / cityScores.length;
  const totalPolice = cityScores.reduce((s, c) => s + c.police, 0);
  const heat = avg > 0.4 ? "#c14a3a" : avg > 0.28 ? "#a8763a" : nation.ink;
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
        <Stat k="Total police" v={`${totalPolice}K`} n={nation} />
        <Stat
          k="Hot precincts"
          v={String(cityScores.filter((c) => c.crime > 0.4).length)}
          n={nation}
        />
      </div>
      <div>
        <div className="label mb-2">By city</div>
        <div className="space-y-2.5">
          {cityScores
            .slice()
            .sort((a, b) => b.crime - a.crime)
            .map((c) => {
              const color =
                c.crime > 0.45 ? "#c14a3a" : c.crime > 0.3 ? "#a8763a" : nation.ink;
              return (
                <div key={c.name}>
                  <div className="flex justify-between mono text-[11px] mb-1">
                    <span className="text-ash uppercase tracking-widest">
                      {c.capital ? "◼ " : ""}
                      {c.name}
                    </span>
                    <span style={{ color }}>{(c.crime * 100).toFixed(0)}</span>
                  </div>
                  <div className="relative h-1 bg-bone-line">
                    <div
                      className="absolute top-0 left-0 h-full"
                      style={{
                        width: `${Math.round(c.crime * 100)}%`,
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

function SocietyTab({ nation }: { nation: N }) {
  const totalPop = nation.cities.reduce(
    (s, c) => s + (CITY_DATA[`${nation.code}:${c.name}`]?.population ?? 0),
    0,
  );
  const avgDev =
    nation.cities.reduce(
      (s, c) => s + (CITY_DATA[`${nation.code}:${c.name}`]?.development ?? 0),
      0,
    ) / nation.cities.length;
  const avgLoyalty =
    nation.cities.reduce(
      (s, c) => s + (CITY_DATA[`${nation.code}:${c.name}`]?.loyalty ?? 0),
      0,
    ) / nation.cities.length;
  const literacy = Math.round(82 + avgDev * 0.15);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Population" v={`${totalPop.toFixed(1)}M`} n={nation} />
        <Stat k="Avg. development" v={`${Math.round(avgDev)}/100`} n={nation} />
        <Stat k="Literacy" v={`${literacy}%`} n={nation} />
        <Stat k="Loyalty" v={`${Math.round(avgLoyalty * 100)}%`} n={nation} />
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label mb-2">Demographics</div>
        <div className="mono text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-ash">Urban</span><span className="text-ink">{Math.round(avgDev * 0.85)}%</span></div>
          <div className="flex justify-between"><span className="text-ash">Rural</span><span className="text-ink">{100 - Math.round(avgDev * 0.85)}%</span></div>
          <div className="flex justify-between"><span className="text-ash">Growth</span><span className="text-ink">+0.6% / yr</span></div>
          <div className="flex justify-between"><span className="text-ash">Life expectancy</span><span className="text-ink">{Math.round(64 + avgDev * 0.18)} yrs</span></div>
        </div>
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label mb-2">Welfare & services</div>
        <div className="mono text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-ash">Schools</span><span className="text-ink">{Math.round(totalPop * 18)}</span></div>
          <div className="flex justify-between"><span className="text-ash">Hospitals</span><span className="text-ink">{Math.round(totalPop * 4.5)}</span></div>
          <div className="flex justify-between"><span className="text-ash">Pension cover</span><span className="text-ink">{Math.round(60 + avgDev * 0.32)}%</span></div>
          <div className="flex justify-between"><span className="text-ash">Media freedom</span><span className="text-ink">{nation.doctrine === "Federalist" || nation.doctrine === "Constitutional" ? "open" : "regulated"}</span></div>
        </div>
      </div>
    </div>
  );
}

function ScienceTab({ nation }: { nation: N }) {
  const techLevels: [string, number][] = [
    ["Civil engineering", 0.62 + nation.metrics.influence * 0.18],
    ["Naval & flight", 0.48 + (nation.code === "DSK" ? 0.2 : 0.05)],
    ["Information theory", 0.55 + (nation.code === "GMN" || nation.code === "GPT" ? 0.2 : 0)],
    ["Medical", 0.52 + nation.metrics.morale * 0.15],
    ["Agricultural", 0.58 + (nation.code === "CLD" || nation.code === "GMN" ? 0.12 : 0)],
    ["Materials", 0.5 + (nation.code === "GRK" || nation.code === "GPT" ? 0.15 : 0)],
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat k="R&D spend" v={`${Math.round(nation.metrics.gdp * 0.038)}B`} n={nation} />
        <Stat k="Patents / yr" v={`${Math.round(nation.metrics.gdp * 0.42)}`} n={nation} />
      </div>
      <div>
        <div className="label mb-2">Tech levels</div>
        <div className="space-y-2.5">
          {techLevels.map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between mono text-[11px] mb-1">
                <span className="text-ash uppercase tracking-widest">{k}</span>
                <span className="text-ink">{Math.round(v * 100)}/100</span>
              </div>
              <div className="relative h-1 bg-bone-line">
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{ width: `${Math.round(v * 100)}%`, background: nation.ink }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label mb-2">Active projects</div>
        <ul className="mono text-xs space-y-1.5 text-ink-soft">
          <li>· Cipher reform commission (C-08)</li>
          <li>· Aqueduct extension survey</li>
          <li>· Standing army logistics audit</li>
        </ul>
      </div>
    </div>
  );
}

function Intel({ nation }: { nation: N }) {
  return (
    <div className="space-y-3 mono text-xs">
      <div className="border border-bone-line p-3.5 bg-bone-soft/40">
        <div className="label">Known about peers</div>
        <div className="serif text-2xl mt-1.5" style={{ color: nation.ink }}>
          {Math.round(nation.posture.intelKnown * 100)}%
        </div>
        <div className="text-ash mt-2">
          Network confidence based on {nation.posture.intelKnown > 0.7 ? "high" : nation.posture.intelKnown > 0.5 ? "moderate" : "limited"} agent placement.
        </div>
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label">Latest report</div>
        <div className="text-ink mt-2">
          Awaiting first dispatch from field stations.
        </div>
      </div>
    </div>
  );
}

function War({ nation }: { nation: N }) {
  if (nation.posture.diplomatic === "peace") {
    return (
      <div className="border border-bone-line bg-bone-soft/40 p-5 text-center">
        <div className="serif text-2xl" style={{ color: nation.ink }}>
          At peace.
        </div>
        <div className="mono text-xs text-ash mt-2 uppercase tracking-widest">
          No active fronts. No declarations.
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3 mono text-xs">
      <div className="border border-bone-line p-3.5" style={{ borderColor: "#c14a3a" }}>
        <div className="label" style={{ color: "#c14a3a" }}>Posture</div>
        <div className="serif text-2xl uppercase mt-1.5" style={{ color: "#c14a3a" }}>
          {nation.posture.diplomatic}
        </div>
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label">Standing army</div>
        <div className="text-ink mt-2">{nation.metrics.army}K personnel · morale {Math.round(nation.metrics.morale * 100)}%</div>
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label">Fronts</div>
        <div className="text-ink mt-2">Awaiting engagement data.</div>
      </div>
    </div>
  );
}
