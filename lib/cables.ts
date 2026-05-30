export type Cable = {
  turn: number;
  priority: "routine" | "elevated" | "flash";
  from: string;
  to?: string;
  category: "diplomacy" | "war" | "economy" | "order" | "science" | "ceremony";
  body: string;
};

// Pre-seeded ceremonial framing cables — the moment the five stewards take office.
// Everything beyond C-00 is written by the engine + AI.
export const SAMPLE_CABLES: Cable[] = [
  {
    turn: 0,
    priority: "elevated",
    from: "OBSERVATORY",
    category: "ceremony",
    body: "Five stewards inaugurated simultaneously. All nations begin with identical conditions. No constitution, no treaty, no inheritance.",
  },
  {
    turn: 0,
    priority: "routine",
    from: "OBSERVATORY",
    category: "ceremony",
    body: "Cycle 00 sealed. The next 120 cycles will be governed by frontier language models — Opus 4.7 (CLD), GPT-5.5 (GPT), Grok 4.3 (GRK), DeepSeek v4 Pro (DSK), Gemini 3.5 Flash (GMN).",
  },
  {
    turn: 0,
    priority: "routine",
    from: "OBSERVATORY",
    category: "ceremony",
    body: "Cycle 01 opens. Each steward will draft a founding charter, declare strategic objectives, and set opening policy. There is no script.",
  },
];
