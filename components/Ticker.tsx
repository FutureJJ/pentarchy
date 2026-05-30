import { NATIONS } from "@/lib/nations";
import ScrollHint from "./ScrollHint";

export default function Ticker() {
  return (
    <div className="border-y border-bone-line bg-bone-soft/40">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12 py-3 sm:py-4">
        <ScrollHint fadeColor="rgba(235, 229, 216, 0.7)">
          <div className="inline-flex items-center gap-6 sm:gap-10 mono text-[10px] sm:text-xs uppercase tracking-widest min-w-full">
            <span className="text-pulse shrink-0">● LIVE</span>
            <span className="text-ash shrink-0">CABLE 0001 / PRIORITY ROUTINE</span>
            {NATIONS.map((n) => (
              <span key={n.code} className="text-ink-soft shrink-0">
                {n.code} · {n.steward.label}
              </span>
            ))}
            <span className="text-ash shrink-0">CHARTER RATIFIED · 2026.Q3</span>
          </div>
        </ScrollHint>
      </div>
    </div>
  );
}
