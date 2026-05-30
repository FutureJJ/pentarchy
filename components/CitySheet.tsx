"use client";

import { useState } from "react";
import { NATIONS } from "@/lib/nations";
import { CITY_DATA } from "@/lib/cityData";
import ScrollHint from "./ScrollHint";

const TABS = ["Brief", "Order", "Garrison", "Industry", "Public", "Events"] as const;
type Tab = (typeof TABS)[number];

export default function CitySheet({
  cityKey,
  onClose,
}: {
  cityKey: string;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("Brief");
  const [code, cityName] = cityKey.split(":");
  const nation = NATIONS.find((n) => n.code === code);
  const city = nation?.cities.find((c) => c.name === cityName);
  const data = CITY_DATA[cityKey];
  if (!nation || !city || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end pointer-events-none"
      role="dialog"
      aria-label={`${city.name} dossier`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] pointer-events-auto"
      />
      <aside
        className="relative pointer-events-auto bg-bone w-full sm:max-w-[460px] sm:w-[460px] sm:h-full max-h-[88svh] sm:max-h-full overflow-y-auto border-t sm:border-t-0 sm:border-l border-bone-line shadow-[0_-20px_60px_-20px_rgba(13,13,12,0.4)] sm:shadow-[-20px_0_60px_-20px_rgba(13,13,12,0.4)]"
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
                {city.capital ? "Capital · " : "Province · "}
                {nation.name} · {nation.code}
              </div>
              <h2
                className="serif text-4xl sm:text-5xl leading-none tracking-tight mt-2"
                style={{ color: nation.ink }}
              >
                {city.name}
              </h2>
              <div className="mt-3 mono text-xs text-ink-soft">
                {data.character.toUpperCase()} · {data.industry}
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close dossier"
              className="mono text-xs uppercase tracking-widest text-ash hover:text-ink transition-colors px-2 py-1"
            >
              ✕
            </button>
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
          {tab === "Brief" && <Brief nation={nation} city={city} data={data} />}
          {tab === "Order" && <Order nation={nation} data={data} />}
          {tab === "Garrison" && <Garrison nation={nation} data={data} />}
          {tab === "Industry" && <Industry nation={nation} data={data} />}
          {tab === "Public" && <Public nation={nation} data={data} />}
          {tab === "Events" && <Events nation={nation} data={data} />}
        </div>
      </aside>
    </div>
  );
}

type N = (typeof NATIONS)[number];
type C = N["cities"][number];
type D = (typeof CITY_DATA)[string];

function Stat({ k, v, n }: { k: string; v: string; n: N }) {
  return (
    <div className="border border-bone-line p-3.5 bg-bone-soft/40">
      <div className="mono text-[10px] uppercase tracking-widest text-ash">{k}</div>
      <div className="serif text-2xl leading-none mt-1.5" style={{ color: n.ink }}>
        {v}
      </div>
    </div>
  );
}

function Bar({ value, color, n }: { value: number; color?: string; n: N }) {
  return (
    <div className="relative h-1.5 bg-bone-line">
      <div
        className="absolute top-0 left-0 h-full"
        style={{
          width: `${Math.min(100, Math.max(0, value * 100))}%`,
          background: color ?? n.ink,
        }}
      />
    </div>
  );
}

function Brief({ nation, city, data }: { nation: N; city: C; data: D }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Population" v={`${data.population.toFixed(1)}M`} n={nation} />
        <Stat k="Development" v={`${data.development}/100`} n={nation} />
        <Stat k="Loyalty" v={`${Math.round(data.loyalty * 100)}%`} n={nation} />
        <Stat k="Public Trust" v={`${Math.round(data.publicTrust * 100)}%`} n={nation} />
      </div>
      <div className="border border-bone-line p-4 bg-bone-soft/40">
        <div className="label mb-2">Standing</div>
        <p className="text-sm leading-relaxed text-ink-soft">
          {city.name} is a {data.character} seat of {nation.name}. Its primary
          industry is {data.industry.toLowerCase()}.
        </p>
      </div>
      <div>
        <div className="label mb-2">Latest</div>
        <p className="text-sm italic text-ink leading-relaxed">
          &ldquo;{data.recentEvent}.&rdquo;
        </p>
      </div>
    </>
  );
}

function Order({ nation, data }: { nation: N; data: D }) {
  const heatColor =
    data.crime.total > 0.45 ? "#c14a3a" : data.crime.total > 0.30 ? "#a8763a" : nation.ink;
  return (
    <div className="space-y-4">
      <div className="border border-bone-line p-4 bg-bone-soft/40">
        <div className="flex items-baseline justify-between mb-2">
          <span className="label">Crime index</span>
          <span className="serif text-2xl" style={{ color: heatColor }}>
            {(data.crime.total * 100).toFixed(0)}
          </span>
        </div>
        <Bar value={data.crime.total} color={heatColor} n={nation} />
      </div>
      <div className="space-y-2.5">
        {[
          ["Violent", data.crime.violent],
          ["Property", data.crime.property],
          ["Drug", data.crime.drug],
          ["Organized", data.crime.organized],
        ].map(([k, v]) => (
          <div key={k as string}>
            <div className="flex justify-between mono text-[11px] mb-1">
              <span className="text-ash uppercase tracking-widest">{k}</span>
              <span className="text-ink">{((v as number) * 100).toFixed(0)}</span>
            </div>
            <Bar value={v as number} n={nation} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Stat k="Police force" v={`${data.police}K`} n={nation} />
        <Stat k="Prison pop." v={`${data.prisonPop}K`} n={nation} />
      </div>
      <div className="border border-bone-line p-3.5 mono text-xs">
        <div className="label mb-1.5">Response posture</div>
        <div className="text-ink-soft leading-relaxed">
          {data.crime.total > 0.45
            ? "Patrol density elevated · curfew under cabinet review."
            : data.crime.total > 0.30
              ? "Standard patrol with monthly precinct review."
              : "Routine policing, no special directives in effect."}
        </div>
      </div>
    </div>
  );
}

function Garrison({ nation, data }: { nation: N; data: D }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Standing garrison" v={`${data.garrison}K`} n={nation} />
        <Stat k="Loyalty" v={`${Math.round(data.loyalty * 100)}%`} n={nation} />
      </div>
      <div className="border border-bone-line p-4 bg-bone-soft/40">
        <div className="label mb-2">Defensive posture</div>
        <p className="text-sm leading-relaxed text-ink-soft">
          Local command answers to {nation.name}&apos;s general staff at{" "}
          {nation.cities.find((c) => c.capital)?.name}. Fortifications follow
          the steward&apos;s declared military doctrine.
        </p>
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label mb-2">Readiness</div>
        <div className="mono text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-ash">Reserves</span><span className="text-ink">{Math.round(data.garrison * 0.6)}K</span></div>
          <div className="flex justify-between"><span className="text-ash">Drill freq.</span><span className="text-ink">monthly</span></div>
          <div className="flex justify-between"><span className="text-ash">Equipment</span><span className="text-ink">standard</span></div>
        </div>
      </div>
    </div>
  );
}

function Industry({ nation, data }: { nation: N; data: D }) {
  return (
    <div className="space-y-4">
      <div className="border border-bone-line p-4 bg-bone-soft/40">
        <div className="label mb-1.5">Primary industry</div>
        <div className="serif text-2xl leading-none" style={{ color: nation.ink }}>
          {data.industry}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Development" v={`${data.development}/100`} n={nation} />
        <Stat k="Population" v={`${data.population.toFixed(1)}M`} n={nation} />
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label mb-2">Output mix</div>
        <div className="mono text-xs space-y-2.5">
          {[
            ["Goods", 0.4 + Math.random() * 0.2],
            ["Services", 0.3 + Math.random() * 0.2],
            ["Resources", 0.15 + Math.random() * 0.15],
            ["Agriculture", 0.05 + Math.random() * 0.15],
          ].map(([k, v]) => (
            <div key={k as string}>
              <div className="flex justify-between mb-1">
                <span className="text-ash uppercase tracking-widest">{k}</span>
                <span className="text-ink">{Math.round((v as number) * 100)}%</span>
              </div>
              <Bar value={v as number} n={nation} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Public({ nation, data }: { nation: N; data: D }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Public trust" v={`${Math.round(data.publicTrust * 100)}%`} n={nation} />
        <Stat k="Loyalty" v={`${Math.round(data.loyalty * 100)}%`} n={nation} />
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label mb-2">Services</div>
        <div className="mono text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-ash">Schools</span><span className="text-ink">{Math.round(data.development * 1.2)}</span></div>
          <div className="flex justify-between"><span className="text-ash">Hospitals</span><span className="text-ink">{Math.round(data.development * 0.45)}</span></div>
          <div className="flex justify-between"><span className="text-ash">Public works</span><span className="text-ink">{data.development > 80 ? "extensive" : data.development > 60 ? "moderate" : "minimal"}</span></div>
          <div className="flex justify-between"><span className="text-ash">Literacy</span><span className="text-ink">{Math.round(82 + data.development * 0.15)}%</span></div>
        </div>
      </div>
      <div className="border border-bone-line p-3.5">
        <div className="label mb-2">Welfare</div>
        <div className="mono text-xs text-ink-soft leading-relaxed">
          Cabinet-mandated minimum coverage. Pension scheme active for civic
          servants and veterans of the {nation.code} crown.
        </div>
      </div>
    </div>
  );
}

function Events({ nation, data }: { nation: N; data: D }) {
  return (
    <div className="space-y-3">
      <div
        className="border-l-2 pl-4 py-1"
        style={{ borderColor: nation.ink }}
      >
        <div className="mono text-[10px] text-ash uppercase tracking-widest">
          C-14 · latest
        </div>
        <p className="text-sm text-ink mt-1 leading-relaxed italic">
          &ldquo;{data.recentEvent}.&rdquo;
        </p>
      </div>
      {[
        ["C-11", "Census officials sealed quarterly ledger"],
        ["C-08", "Cabinet inspector tour concluded"],
        ["C-05", "Provincial magistrate sworn in"],
        ["C-02", "Ceremonial guard rotation"],
      ].map(([t, b]) => (
        <div
          key={t as string}
          className="border-l-2 pl-4 py-1 border-bone-line"
        >
          <div className="mono text-[10px] text-ash uppercase tracking-widest">
            {t as string}
          </div>
          <p className="text-sm text-ink-soft mt-1 leading-relaxed">{b}</p>
        </div>
      ))}
    </div>
  );
}
