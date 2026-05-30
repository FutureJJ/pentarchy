import { NATIONS, STARTING_CONDITIONS } from "@/lib/nations";
import { CITY_DATA } from "@/lib/cityData";
import { BILATERAL } from "@/lib/relations";
import { SAMPLE_CABLES } from "@/lib/cables";
import type {
  Bilateral,
  Cable,
  NationCode,
  NationState,
  WorldState,
} from "./types";
import { yearOf } from "./types";

export const NATION_CODES: NationCode[] = ["CLD", "GPT", "GRK", "DSK", "GMN"];

export function initialState(cycle = 0): WorldState {
  const startedAt = new Date().toISOString();
  const nations: Record<string, NationState> = {};
  const SC = STARTING_CONDITIONS;

  for (const n of NATIONS) {
    nations[n.code] = {
      code: n.code as NationCode,
      name: n.name,

      // Blank slate — set by AI on C-01
      declaredDoctrine: "undeclared",
      declaredMotto: "",
      strategicObjectives: [],
      constitution: null,

      economy: {
        gdp: SC.gdp,
        gdpPerCapita: SC.gdpPerCapita,
        treasury: SC.treasury,
        publicDebt: SC.publicDebt,
        inflation: SC.inflation,
        interestRate: SC.interestRate,
        unemployment: SC.unemployment,
        minimumWage: SC.minimumWage,
        averageSalary: SC.averageSalary,
        medianIncome: SC.medianIncome,
        costOfLivingIndex: SC.costOfLivingIndex,
        gini: SC.gini,
        tradeBalance: SC.tradeBalance,
      },
      society: {
        population: SC.population / 1_000_000,
        populationGrowth: SC.populationGrowth,
        lifeExpectancy: SC.lifeExpectancy,
        literacy: SC.literacy,
        healthcareCoverage: SC.healthcareCoverage,
        schoolEnrollment: SC.schoolEnrollment,
        pressFreedom: SC.pressFreedom,
        corruption: SC.corruption,
        healthcareModel: "undeclared",
        educationPriority: "undeclared",
        immigrationPolicy: "undeclared",
        welfareCoverage: 0.5,
      },
      military: {
        standingArmy: SC.standingArmy,
        reserves: SC.reserves,
        morale: SC.morale,
        conscription: false,
        doctrine: "undeclared",
      },
      posture: { diplomatic: "peace", intelKnown: 0.5 },
      approval: SC.approval,
      unrest: SC.unrest,
      influence: SC.influence,

      cities: n.cities.map((c) => {
        const cd = CITY_DATA[`${n.code}:${c.name}`];
        return {
          name: c.name,
          capital: c.capital,
          x: c.x,
          y: c.y,
          population: cd?.population ?? 1.0,
          development: cd?.development ?? 70,
          loyalty: cd?.loyalty ?? 0.7,
          garrison: cd?.garrison ?? 12,
          industry: cd?.industry ?? "general",
          character: cd?.character ?? "industrial",
          crime: { ...(cd?.crime ?? { total: 0.22, violent: 0.08, property: 0.42, drug: 0.18, organized: 0.12 }) },
          police: cd?.police ?? 12,
          prisonPop: cd?.prisonPop ?? 3,
          publicTrust: cd?.publicTrust ?? 0.68,
          unemployment: cd?.unemployment ?? 0.06,
          averageWage: cd?.averageWage ?? 3_000,
          recentEvent: cd?.recentEvent ?? "Awaiting steward directive.",
        };
      }),

      budget: {
        defense: 0.15,
        treasury: 0.15,
        foreign: 0.05,
        interior: 0.15,
        intelligence: 0.05,
        publicWorks: 0.15,
        education: 0.12,
        healthcare: 0.12,
        welfare: 0.06,
      },
      taxation: {
        land: 0.04,
        harbor: 0.03,
        excise: 0.02,
        income: 0.10,
        corporate: 0.15,
        wealth: 0.005,
      },
      research: "",
      edicts: [],
      inbox: [],
    };
  }

  const bilateral: Record<string, Record<string, Bilateral>> = {};
  for (const a of NATION_CODES) {
    bilateral[a] = {} as Record<string, Bilateral>;
    for (const b of NATION_CODES) {
      if (a === b) continue;
      const rel = BILATERAL[a]?.[b];
      bilateral[a][b] = {
        score: rel?.score ?? 0,
        status: rel?.status ?? "neutral",
        treaties: [...(rel?.treaties ?? [])],
        lastCable: rel?.lastCable ?? "—",
        tradeVolume: rel?.tradeVolume ?? 20,
        tariff: 0,
      };
    }
  }

  const recentCables: Cable[] = SAMPLE_CABLES.map((c, i) => ({
    id: `seed-${i}`,
    turn: 0,
    priority: c.priority,
    from: c.from,
    to: c.to,
    category: c.category,
    body: c.body,
  }));

  return {
    cycle,
    turn: 0,
    year: yearOf(0),
    startedAt,
    globalUnrest: 0.15,
    nations,
    bilateral,
    recentCables,
  };
}
