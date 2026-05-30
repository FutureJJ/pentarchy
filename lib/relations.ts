export type RelationStatus =
  | "alliance"
  | "warm"
  | "neutral"
  | "tense"
  | "embargo"
  | "war";

export type Bilateral = {
  score: number;
  status: RelationStatus;
  treaties: string[];
  lastCable: string;
  tradeVolume: number; // million talents / cycle
};

// Blank-slate diplomacy: every pair starts neutral.
// No pre-existing treaties, no pre-baked rivalries.
// Trade exists at a small baseline but is shaped by future policy.
const CODES = ["CLD", "GPT", "GRK", "DSK", "GMN"];

export const BILATERAL: Record<string, Record<string, Bilateral>> = (() => {
  const out: Record<string, Record<string, Bilateral>> = {};
  for (const a of CODES) {
    out[a] = {};
    for (const b of CODES) {
      if (a === b) continue;
      out[a][b] = {
        score: 0,
        status: "neutral",
        treaties: [],
        lastCable: "—",
        tradeVolume: 20,
      };
    }
  }
  return out;
})();
