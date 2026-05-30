import { z } from "zod";

export const CITY_CODES = z.string().min(1);
export const NATION_CODE = z.enum(["CLD", "GPT", "GRK", "DSK", "GMN"]);
export type NationCode = z.infer<typeof NATION_CODE>;

export const Posture = z.object({
  diplomatic: z.enum(["peace", "tense", "war", "embargo", "alliance"]),
  intelKnown: z.number().min(0).max(1),
});

export const Metrics = z.object({
  gdp: z.number(),
  population: z.number(),
  treasury: z.number(),
  army: z.number(),
  morale: z.number().min(0).max(1),
  influence: z.number().min(0).max(1),
});

export const CityState = z.object({
  name: z.string(),
  capital: z.boolean().optional(),
  x: z.number(),
  y: z.number(),
  population: z.number(),
  development: z.number(),
  loyalty: z.number().min(0).max(1),
  garrison: z.number(),
  industry: z.string(),
  character: z.string(),
  crime: z.object({
    total: z.number().min(0).max(1),
    violent: z.number().min(0).max(1),
    property: z.number().min(0).max(1),
    drug: z.number().min(0).max(1),
    organized: z.number().min(0).max(1),
  }),
  police: z.number(),
  prisonPop: z.number(),
  publicTrust: z.number().min(0).max(1),
  recentEvent: z.string(),
});
export type CityState = z.infer<typeof CityState>;

export const NationState = z.object({
  code: NATION_CODE,
  name: z.string(),
  metrics: Metrics,
  posture: Posture,
  cities: z.array(CityState),
  budget: z.object({
    defense: z.number(),
    treasury: z.number(),
    foreign: z.number(),
    interior: z.number(),
    intelligence: z.number(),
    publicWorks: z.number(),
  }),
  taxation: z.object({
    land: z.number(),
    harbor: z.number(),
    excise: z.number(),
    income: z.number(),
  }),
  research: z.string().optional(),
  edicts: z.array(z.string()),
  inbox: z.array(z.object({ from: NATION_CODE, body: z.string(), turn: z.number() })),
  lastDecisionRaw: z.string().optional(),
});
export type NationState = z.infer<typeof NationState>;

export const Bilateral = z.object({
  score: z.number(),
  status: z.enum(["alliance", "warm", "neutral", "tense", "embargo", "war"]),
  treaties: z.array(z.string()),
  lastCable: z.string(),
});
export type Bilateral = z.infer<typeof Bilateral>;

export const Cable = z.object({
  id: z.string(),
  turn: z.number(),
  priority: z.enum(["routine", "elevated", "flash"]),
  from: z.string(),
  to: z.string().optional(),
  category: z.enum(["diplomacy", "war", "economy", "order", "science", "ceremony"]),
  body: z.string(),
});
export type Cable = z.infer<typeof Cable>;

export const WorldState = z.object({
  cycle: z.number(),
  turn: z.number(),
  season: z.enum(["spring", "summer", "autumn", "winter"]),
  startedAt: z.string(),
  lastTickAt: z.string().optional(),
  globalUnrest: z.number().min(0).max(1),
  nations: z.record(NATION_CODE, NationState),
  bilateral: z.record(NATION_CODE, z.record(NATION_CODE, Bilateral)),
  recentCables: z.array(Cable),
});
export type WorldState = z.infer<typeof WorldState>;

// What the AI returns each turn.
export const Decision = z.object({
  thinking: z.string().optional(),
  edicts: z.array(z.string()).max(3),
  budget: z.object({
    defense: z.number().min(0).max(1),
    treasury: z.number().min(0).max(1),
    foreign: z.number().min(0).max(1),
    interior: z.number().min(0).max(1),
    intelligence: z.number().min(0).max(1),
    publicWorks: z.number().min(0).max(1),
  }),
  taxation: z.object({
    land: z.number().min(0).max(0.5),
    harbor: z.number().min(0).max(0.5),
    excise: z.number().min(0).max(0.5),
    income: z.number().min(0).max(0.5),
  }),
  research: z.string(),
  armyOrders: z.object({
    production: z.array(z.object({ city: z.string(), qty: z.number() })).default([]),
    movement: z.array(z.object({ from: z.string(), to: z.string(), force: z.number() })).default([]),
    fortify: z.array(z.string()).default([]),
  }),
  diplomacy: z.object({
    cables: z.array(z.object({ to: NATION_CODE, body: z.string() })).default([]),
    treaties: z.array(z.object({
      type: z.enum(["alliance", "trade", "peace", "non_aggression", "embargo"]),
      target: NATION_CODE,
      terms: z.string(),
    })).default([]),
    declarations: z.array(z.object({
      type: z.enum(["war", "peace", "embargo", "alliance"]),
      target: NATION_CODE,
      casus: z.string(),
    })).default([]),
  }),
  intelPriorities: z.array(NATION_CODE).default([]),
});
export type Decision = z.infer<typeof Decision>;

// What we send to the AI each turn.
export const Bundle = z.object({
  you: z.object({
    code: NATION_CODE,
    name: z.string(),
    doctrine: z.string(),
    state: NationState,
  }),
  world: z.object({
    cycle: z.number(),
    turn: z.number(),
    maxTurns: z.number(),
    season: z.string(),
    globalUnrest: z.number(),
  }),
  publicRegister: z.record(NATION_CODE, z.object({
    name: z.string(),
    gdpEstimate: z.number(),
    population: z.number(),
    armyEstimate: z.number(),
    posture: Posture,
    relationToYou: Bilateral,
  })),
  intelReports: z.array(z.object({
    topic: z.string(),
    summary: z.string(),
    confidence: z.number().min(0).max(1),
  })),
  inbox: z.array(z.object({ from: NATION_CODE, body: z.string(), turn: z.number() })),
  recentWorldCables: z.array(Cable),
});
export type Bundle = z.infer<typeof Bundle>;
