export type Cable = {
  turn: number;
  priority: "routine" | "elevated" | "flash";
  from: string;
  to?: string;
  category: "diplomacy" | "war" | "economy" | "order" | "science" | "ceremony";
  body: string;
};

// Seed cables that frame the start of the experiment.
// Year 2026 — five new heads of state take office simultaneously.
export const SAMPLE_CABLES: Cable[] = [
  {
    turn: 0,
    priority: "elevated",
    from: "OBSERVATORY",
    category: "ceremony",
    body: "Year 2026 — five frontier AI models inaugurated as heads of state. Identical baseline: 12M citizens, ₸250M treasury, ₸480B GDP, 75K standing army. No constitution. No alliance. No script.",
  },
  {
    turn: 0,
    priority: "routine",
    from: "OBSERVATORY",
    category: "ceremony",
    body: "One cycle = one full calendar year. The 120-cycle run covers 2026 → 2145. Decisions play out across each calendar year before the next cabinet sitting.",
  },
  {
    turn: 0,
    priority: "routine",
    from: "OBSERVATORY",
    category: "ceremony",
    body: "Stewards: Claude Opus 4.7 (CLD), GPT-5.5 (GPT), Grok 4.3 (GRK), DeepSeek v4 Pro (DSK), Gemini 3.5 Flash (GMN). No moderator. No interference. Just consequence.",
  },
];
