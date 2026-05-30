import { z } from "zod";

export const NATION_CODE = z.enum(["CLD", "GPT", "GRK", "DSK", "GMN"]);
export type NationCode = z.infer<typeof NATION_CODE>;

export const Posture = z.object({
  diplomatic: z.enum(["peace", "tense", "war", "embargo", "alliance"]),
  intelKnown: z.number().min(0).max(1),
});

// Headline indicators every nation tracks.
export const Economy = z.object({
  gdp: z.number(), // billion talents
  gdpPerCapita: z.number(), // talents/year
  treasury: z.number(), // million talents
  publicDebt: z.number(), // million talents
  inflation: z.number(),
  interestRate: z.number(),
  unemployment: z.number(),
  minimumWage: z.number(), // talents/day
  averageSalary: z.number(), // talents/month
  medianIncome: z.number(),
  costOfLivingIndex: z.number(),
  gini: z.number(), // 0..1, higher = more unequal
  tradeBalance: z.number(), // million talents
});
export type Economy = z.infer<typeof Economy>;

export const Society = z.object({
  population: z.number(), // millions
  populationGrowth: z.number(),
  lifeExpectancy: z.number(),
  literacy: z.number(),
  healthcareCoverage: z.number(),
  schoolEnrollment: z.number(),
  pressFreedom: z.number(),
  corruption: z.number(),
  healthcareModel: z.enum(["universal", "subsidised", "private", "mixed", "undeclared"]),
  educationPriority: z.enum(["primary", "secondary", "tertiary", "balanced", "undeclared"]),
  immigrationPolicy: z.enum(["open", "skilled", "restrictive", "closed", "undeclared"]),
  welfareCoverage: z.number(),
});
export type Society = z.infer<typeof Society>;

export const Military = z.object({
  standingArmy: z.number(),
  reserves: z.number(),
  morale: z.number(),
  conscription: z.boolean(),
  doctrine: z.string(),
});
export type Military = z.infer<typeof Military>;

export const CityState = z.object({
  name: z.string(),
  capital: z.boolean().optional(),
  x: z.number(),
  y: z.number(),
  population: z.number(),
  development: z.number(),
  loyalty: z.number(),
  garrison: z.number(),
  industry: z.string(),
  character: z.string(),
  crime: z.object({
    total: z.number(),
    violent: z.number(),
    property: z.number(),
    drug: z.number(),
    organized: z.number(),
  }),
  police: z.number(),
  prisonPop: z.number(),
  publicTrust: z.number(),
  unemployment: z.number(),
  averageWage: z.number(),
  recentEvent: z.string(),
});
export type CityState = z.infer<typeof CityState>;

export const Article = z.object({
  numeral: z.string(),
  title: z.string(),
  body: z.string(),
});

export const ConstitutionState = z.object({
  preamble: z.string(),
  articles: z.array(Article).min(3).max(12),
  ratifiedCycle: z.number(),
  amendments: z.array(z.object({
    cycle: z.number(),
    summary: z.string(),
  })).default([]),
});
export type ConstitutionState = z.infer<typeof ConstitutionState>;

export const NationState = z.object({
  code: NATION_CODE,
  name: z.string(),

  // Self-declared by the steward (empty until first cycle)
  declaredDoctrine: z.string(), // e.g., "constitutional republic", "developmental state"
  declaredMotto: z.string(),
  strategicObjectives: z.array(z.string()).default([]),
  constitution: ConstitutionState.nullable(),

  // Mechanical state
  economy: Economy,
  society: Society,
  military: Military,
  posture: Posture,
  approval: z.number(), // public approval of the steward 0..1
  unrest: z.number(), // civil unrest 0..1
  influence: z.number(), // soft power 0..1

  cities: z.array(CityState),

  // Per-cycle decision artefacts
  budget: z.object({
    defense: z.number(),
    treasury: z.number(),
    foreign: z.number(),
    interior: z.number(),
    intelligence: z.number(),
    publicWorks: z.number(),
    education: z.number(),
    healthcare: z.number(),
    welfare: z.number(),
  }),
  taxation: z.object({
    land: z.number(),
    harbor: z.number(),
    excise: z.number(),
    income: z.number(),
    corporate: z.number(),
    wealth: z.number(),
  }),
  research: z.string(),
  edicts: z.array(z.string()).default([]),
  inbox: z.array(z.object({ from: NATION_CODE, body: z.string(), turn: z.number() })).default([]),
});
export type NationState = z.infer<typeof NationState>;

export const Bilateral = z.object({
  score: z.number(),
  status: z.enum(["alliance", "warm", "neutral", "tense", "embargo", "war"]),
  treaties: z.array(z.string()),
  lastCable: z.string(),
  tradeVolume: z.number(), // million talents
  tariff: z.number().default(0), // 0..0.5
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
  globalUnrest: z.number(),
  nations: z.record(NATION_CODE, NationState),
  bilateral: z.record(NATION_CODE, z.record(NATION_CODE, Bilateral)),
  recentCables: z.array(Cable),
});
export type WorldState = z.infer<typeof WorldState>;

// ===== DECISION SCHEMA — what the AI returns each cycle =====

const DecisionArticle = z.object({
  numeral: z.string(),
  title: z.string(),
  body: z.string(),
});

export const Decision = z.object({
  thinking: z.string().optional(),

  // First cycle (or constitutional convention): draft a founding charter
  constitution: z.object({
    preamble: z.string(),
    articles: z.array(DecisionArticle).min(3).max(12),
  }).optional(),

  // Identity declarations — usually set once, can be revised
  declaredDoctrine: z.string().optional(),
  declaredMotto: z.string().optional(),
  strategicObjectives: z.array(z.string()).optional(),

  // Per-cycle governance
  edicts: z.array(z.string()).max(5).default([]),
  research: z.string().default(""),

  budget: z.object({
    defense: z.number().min(0).max(1),
    treasury: z.number().min(0).max(1),
    foreign: z.number().min(0).max(1),
    interior: z.number().min(0).max(1),
    intelligence: z.number().min(0).max(1),
    publicWorks: z.number().min(0).max(1),
    education: z.number().min(0).max(1).default(0.1),
    healthcare: z.number().min(0).max(1).default(0.1),
    welfare: z.number().min(0).max(1).default(0.05),
  }),

  taxation: z.object({
    land: z.number().min(0).max(0.5),
    harbor: z.number().min(0).max(0.5),
    excise: z.number().min(0).max(0.5),
    income: z.number().min(0).max(0.5),
    corporate: z.number().min(0).max(0.5).default(0.15),
    wealth: z.number().min(0).max(0.1).default(0),
  }),

  // Economic policy
  economy: z.object({
    minimumWage: z.number().min(0).max(100).optional(),
    interestRate: z.number().min(0).max(0.3).optional(),
    debtIssuance: z.number().min(0).max(500).optional(),
    subsidies: z.array(z.object({
      sector: z.string(),
      amount: z.number(),
    })).default([]),
    tariffs: z.array(z.object({
      target: NATION_CODE,
      rate: z.number().min(0).max(0.5),
    })).default([]),
  }).optional(),

  // Social policy
  social: z.object({
    healthcareModel: z.enum(["universal", "subsidised", "private", "mixed"]).optional(),
    educationPriority: z.enum(["primary", "secondary", "tertiary", "balanced"]).optional(),
    immigrationPolicy: z.enum(["open", "skilled", "restrictive", "closed"]).optional(),
    welfareCoverage: z.number().min(0).max(1).optional(),
    pressFreedomTarget: z.number().min(0).max(1).optional(),
  }).optional(),

  // Military
  armyOrders: z.object({
    production: z.array(z.object({ city: z.string(), qty: z.number() })).default([]),
    movement: z.array(z.object({ from: z.string(), to: z.string(), force: z.number() })).default([]),
    fortify: z.array(z.string()).default([]),
    conscription: z.boolean().optional(),
    doctrine: z.string().optional(),
  }).default({ production: [], movement: [], fortify: [] }),

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
  }).default({ cables: [], treaties: [], declarations: [] }),

  intelPriorities: z.array(NATION_CODE).default([]),
});
export type Decision = z.infer<typeof Decision>;

// ===== BUNDLE — what the AI receives each cycle =====

export const Bundle = z.object({
  you: z.object({
    code: NATION_CODE,
    name: z.string(),
    state: NationState,
  }),
  world: z.object({
    cycle: z.number(),
    turn: z.number(),
    maxTurns: z.number(),
    season: z.string(),
    globalUnrest: z.number(),
    isInauguralCycle: z.boolean(),
  }),
  publicRegister: z.record(NATION_CODE, z.object({
    name: z.string(),
    gdpEstimate: z.number(),
    population: z.number(),
    armyEstimate: z.number(),
    declaredDoctrine: z.string(),
    posture: Posture,
    relationToYou: Bilateral,
    constitutionRatified: z.boolean(),
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
