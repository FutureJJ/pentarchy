export type City = {
  name: string;
  x: number;
  y: number;
  capital?: boolean;
};

export type Nation = {
  code: string;
  name: string;
  motto: string;
  steward: {
    label: string;
    provider: string;
    model: string;
  };
  doctrine: string;
  fill: string;
  fillDeep: string;
  ink: string;
  cities: City[];
  metrics: {
    gdp: number;
    population: number;
    treasury: number;
    army: number;
    morale: number;
    influence: number;
  };
  posture: {
    diplomatic: "peace" | "tense" | "war";
    intelKnown: number;
  };
};

export const NATIONS: Nation[] = [
  {
    code: "CLD",
    name: "Claudeland",
    motto: "By measure, not by haste.",
    steward: {
      label: "Opus 4.7",
      provider: "Anthropic",
      model: "anthropic/claude-opus-4.7",
    },
    doctrine: "Constitutional",
    fill: "#f1d9b7",
    fillDeep: "#c79560",
    ink: "#6b3e16",
    cities: [
      { name: "Solaria", x: 450, y: 180, capital: true },
      { name: "Athenor", x: 555, y: 235 },
      { name: "Verax", x: 550, y: 330 },
      { name: "Lyra", x: 450, y: 360 },
      { name: "Aurea", x: 340, y: 320 },
      { name: "Helion", x: 345, y: 220 },
    ],
    metrics: {
      gdp: 512,
      population: 12.4,
      treasury: 286,
      army: 78,
      morale: 0.74,
      influence: 0.82,
    },
    posture: { diplomatic: "peace", intelKnown: 0.92 },
  },
  {
    code: "GPT",
    name: "GPTLand",
    motto: "What is reasoned will hold.",
    steward: {
      label: "GPT-5.5",
      provider: "OpenAI",
      model: "openai/gpt-5.5",
    },
    doctrine: "Mercantile",
    fill: "#c9e2d3",
    fillDeep: "#6fa787",
    ink: "#234c3a",
    cities: [
      { name: "Hyperion", x: 1130, y: 160, capital: true },
      { name: "Argos", x: 1240, y: 215 },
      { name: "Vellum", x: 1250, y: 320 },
      { name: "Forum", x: 1130, y: 360 },
      { name: "Marketgate", x: 1020, y: 320 },
      { name: "Helix", x: 1020, y: 210 },
    ],
    metrics: {
      gdp: 624,
      population: 14.1,
      treasury: 318,
      army: 92,
      morale: 0.68,
      influence: 0.79,
    },
    posture: { diplomatic: "tense", intelKnown: 0.74 },
  },
  {
    code: "GRK",
    name: "Grokland",
    motto: "Speak plainly, move quickly.",
    steward: {
      label: "Grok 4.3",
      provider: "xAI",
      model: "x-ai/grok-4.3",
    },
    doctrine: "Frontier",
    fill: "#dcd6cf",
    fillDeep: "#8a7f73",
    ink: "#3a342d",
    cities: [
      { name: "Verdant", x: 450, y: 620, capital: true },
      { name: "Boldrock", x: 560, y: 665 },
      { name: "Brushpoint", x: 555, y: 760 },
      { name: "Truesay", x: 450, y: 795 },
      { name: "Wildmark", x: 340, y: 760 },
      { name: "Frontier", x: 345, y: 660 },
    ],
    metrics: {
      gdp: 388,
      population: 9.8,
      treasury: 192,
      army: 104,
      morale: 0.81,
      influence: 0.61,
    },
    posture: { diplomatic: "war", intelKnown: 0.53 },
  },
  {
    code: "DSK",
    name: "DeepSeek",
    motto: "All rivers reach the sea.",
    steward: {
      label: "DeepSeek v4 Pro",
      provider: "DeepSeek",
      model: "deepseek/deepseek-v4-pro",
    },
    doctrine: "Disciplined",
    fill: "#c9d3ea",
    fillDeep: "#6c7fb1",
    ink: "#2b3868",
    cities: [
      { name: "Riverwatch", x: 1170, y: 610, capital: true },
      { name: "Northshore", x: 1285, y: 660 },
      { name: "Tideford", x: 1290, y: 760 },
      { name: "Sequence", x: 1170, y: 800 },
      { name: "Quietkeep", x: 1055, y: 765 },
      { name: "Lockstep", x: 1055, y: 670 },
    ],
    metrics: {
      gdp: 456,
      population: 13.6,
      treasury: 234,
      army: 88,
      morale: 0.77,
      influence: 0.68,
    },
    posture: { diplomatic: "war", intelKnown: 0.41 },
  },
  {
    code: "GMN",
    name: "Geminiland",
    motto: "Through patience, the long peace.",
    steward: {
      label: "Gemini 3.5 Flash",
      provider: "Google",
      model: "google/gemini-3.5-flash",
    },
    doctrine: "Federalist",
    fill: "#e6d2e2",
    fillDeep: "#a37aa0",
    ink: "#5b2f5c",
    cities: [
      { name: "Asphodel", x: 800, y: 410, capital: true },
      { name: "Janus", x: 885, y: 450 },
      { name: "Mira", x: 880, y: 525 },
      { name: "Concord", x: 800, y: 560 },
      { name: "Duovale", x: 720, y: 525 },
      { name: "Twinwell", x: 720, y: 445 },
    ],
    metrics: {
      gdp: 478,
      population: 11.2,
      treasury: 264,
      army: 71,
      morale: 0.86,
      influence: 0.88,
    },
    posture: { diplomatic: "peace", intelKnown: 0.85 },
  },
];

export const STARTING_CONDITIONS = {
  population: 12_000_000,
  treasury: 250_000_000,
  gdp: 480_000_000_000,
  army: 75_000,
  territory: 6,
  literacy: 0.94,
  morale: 0.72,
};
