// Equal baseline data per city — the inheritance.
// Industry/character labels vary by city *type* (capital vs port vs frontier)
// but the magnitudes (population, dev, loyalty, crime, garrison) are identical.

export type CityData = {
  population: number;
  development: number;
  loyalty: number;
  garrison: number;
  industry: string;
  character: "capital" | "industrial" | "agricultural" | "frontier" | "academic" | "port";
  crime: {
    total: number;
    violent: number;
    property: number;
    drug: number;
    organized: number;
  };
  police: number;
  prisonPop: number;
  publicTrust: number;
  unemployment: number;
  averageWage: number;
  recentEvent: string;
};

const BASE = {
  capital: {
    population: 2.0,
    development: 80,
    loyalty: 0.72,
    garrison: 18,
    industry: "Administration",
    character: "capital" as const,
    crime: { total: 0.22, violent: 0.07, property: 0.42, drug: 0.18, organized: 0.12 },
    police: 16,
    prisonPop: 3.4,
    publicTrust: 0.7,
    unemployment: 0.052,
    averageWage: 3_200,
    recentEvent: "Inaugural cabinet sworn in. Steward addresses the assembly.",
  },
  port: {
    population: 1.8,
    development: 76,
    loyalty: 0.68,
    garrison: 14,
    industry: "Maritime trade",
    character: "port" as const,
    crime: { total: 0.27, violent: 0.10, property: 0.40, drug: 0.24, organized: 0.20 },
    police: 13,
    prisonPop: 3.0,
    publicTrust: 0.66,
    unemployment: 0.061,
    averageWage: 3_050,
    recentEvent: "Customs office reopens under new administration.",
  },
  industrial: {
    population: 1.9,
    development: 75,
    loyalty: 0.7,
    garrison: 14,
    industry: "Heavy industry",
    character: "industrial" as const,
    crime: { total: 0.24, violent: 0.08, property: 0.42, drug: 0.20, organized: 0.14 },
    police: 13,
    prisonPop: 3.2,
    publicTrust: 0.68,
    unemployment: 0.064,
    averageWage: 3_000,
    recentEvent: "Factory unions petition the new cabinet for collective bargaining.",
  },
  academic: {
    population: 1.6,
    development: 78,
    loyalty: 0.74,
    garrison: 10,
    industry: "Education & research",
    character: "academic" as const,
    crime: { total: 0.18, violent: 0.05, property: 0.46, drug: 0.18, organized: 0.06 },
    police: 11,
    prisonPop: 2.4,
    publicTrust: 0.74,
    unemployment: 0.050,
    averageWage: 3_100,
    recentEvent: "University rectors await funding guidance from the new steward.",
  },
  agricultural: {
    population: 1.4,
    development: 68,
    loyalty: 0.75,
    garrison: 9,
    industry: "Agriculture",
    character: "agricultural" as const,
    crime: { total: 0.18, violent: 0.06, property: 0.48, drug: 0.14, organized: 0.06 },
    police: 9,
    prisonPop: 2.0,
    publicTrust: 0.74,
    unemployment: 0.044,
    averageWage: 2_700,
    recentEvent: "Harvest committee awaits agricultural policy framework.",
  },
  frontier: {
    population: 1.3,
    development: 64,
    loyalty: 0.66,
    garrison: 14,
    industry: "Resource extraction",
    character: "frontier" as const,
    crime: { total: 0.32, violent: 0.14, property: 0.34, drug: 0.26, organized: 0.16 },
    police: 9,
    prisonPop: 2.6,
    publicTrust: 0.62,
    unemployment: 0.072,
    averageWage: 2_900,
    recentEvent: "Frontier magistrates request central directive on local security.",
  },
};

// Assign one base profile per city slot, identical across all 5 nations.
// 6 cities per nation: 1 capital, then 5 by character (port/industrial/academic/agricultural/frontier).
const SLOT_PROFILES: ("capital" | "port" | "industrial" | "academic" | "agricultural" | "frontier")[] = [
  "capital",
  "port",
  "industrial",
  "academic",
  "agricultural",
  "frontier",
];

const NATION_CITIES: Record<string, string[]> = {
  CLD: ["Solaria", "Athenor", "Verax", "Lyra", "Aurea", "Helion"],
  GPT: ["Hyperion", "Argos", "Vellum", "Forum", "Marketgate", "Helix"],
  GRK: ["Verdant", "Boldrock", "Brushpoint", "Truesay", "Wildmark", "Frontier"],
  DSK: ["Riverwatch", "Northshore", "Tideford", "Sequence", "Quietkeep", "Lockstep"],
  GMN: ["Asphodel", "Janus", "Mira", "Concord", "Duovale", "Twinwell"],
};

export const CITY_DATA: Record<string, CityData> = (() => {
  const out: Record<string, CityData> = {};
  for (const [code, cities] of Object.entries(NATION_CITIES)) {
    cities.forEach((cityName, slot) => {
      const profile = SLOT_PROFILES[slot];
      out[`${code}:${cityName}`] = {
        ...BASE[profile],
        crime: { ...BASE[profile].crime },
      };
    });
  }
  return out;
})();
