"use client";

import { useLiveState } from "@/lib/useLiveState";

export default function TurnIndicator() {
  const { data } = useLiveState(30_000);
  const state = data?.state;
  const maxTurns = data?.maxTurns ?? 120;
  if (!state) {
    return (
      <span className="mono text-[10px] sm:text-xs uppercase tracking-widest text-ash flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-fog" />
        Year 2026 · awaiting first cabinet
      </span>
    );
  }
  const pct = Math.round((state.turn / maxTurns) * 100);
  const lastTick = state.lastTickAt
    ? new Date(state.lastTickAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "—";
  const year = state.year ?? 2025 + state.turn;
  return (
    <span className="mono text-[10px] sm:text-xs uppercase tracking-widest text-ash flex items-center gap-2 flex-wrap">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-pulse animate-pulse" />
      <span className="text-ink">
        Year <span style={{ color: "#a8763a" }}>{year}</span>
      </span>
      <span className="text-ash">·</span>
      <span className="text-ink-soft">
        Cycle {String(state.turn).padStart(2, "0")} / {maxTurns}
      </span>
      <span className="hidden md:inline">· {pct}% complete</span>
      <span className="hidden lg:inline">· last cycle {lastTick}Z</span>
    </span>
  );
}
