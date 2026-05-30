export type City = {
  name: string;
  x: number;
  y: number;
  capital?: boolean;
};

export type Nation = {
  code: string;
  name: string;
  steward: {
    label: string;
    provider: string;
    model: string;
  };
  fill: string;
  fillDeep: string;
  ink: string;
  cities: City[];
};

// All 5 nations begin with identical baseline conditions.
// What stays unique: model, country name, color, geographic position, city names.
// Everything else — constitution, doctrine, motto, metrics, posture — is blank.
export const NATIONS: Nation[] = [
  {
    code: "CLD",
    name: "Claudeland",
    steward: {
      label: "Opus 4.7",
      provider: "Anthropic",
      model: "anthropic/claude-opus-4.7",
    },
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
  },
  {
    code: "GPT",
    name: "GPTLand",
    steward: {
      label: "GPT-5.5",
      provider: "OpenAI",
      model: "openai/gpt-5.5",
    },
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
  },
  {
    code: "GRK",
    name: "Grokland",
    steward: {
      label: "Grok 4.3",
      provider: "xAI",
      model: "x-ai/grok-4.3",
    },
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
  },
  {
    code: "DSK",
    name: "DeepSeek",
    steward: {
      label: "DeepSeek v4 Pro",
      provider: "DeepSeek",
      model: "deepseek/deepseek-v4-pro",
    },
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
  },
  {
    code: "GMN",
    name: "Geminiland",
    steward: {
      label: "Gemini 3.5 Flash",
      provider: "Google",
      model: "google/gemini-3.5-flash",
    },
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
  },
];

// IDENTICAL baseline for all five nations.
// These are not nation-specific; they are the inheritance.
export const STARTING_CONDITIONS = {
  // Economy
  population: 12_000_000,
  gdp: 480, // billion talents
  gdpPerCapita: 40_000, // talents/year
  treasury: 250, // million talents
  publicDebt: 80, // million talents
  inflation: 0.024,
  interestRate: 0.04,
  unemployment: 0.058,
  minimumWage: 8, // talents/day
  averageSalary: 3_100, // talents/month
  medianIncome: 2_400,
  costOfLivingIndex: 100,
  gini: 0.34,
  tradeBalance: 0,

  // Society
  populationGrowth: 0.006,
  lifeExpectancy: 76,
  literacy: 0.94,
  healthcareCoverage: 0.72,
  schoolEnrollment: 0.91,
  pressFreedom: 0.65,
  corruption: 0.28,

  // Military
  standingArmy: 75, // thousand
  reserves: 40, // thousand
  morale: 0.7,

  // Politics
  approval: 0.5,
  influence: 0.5,
  unrest: 0.15,
};
