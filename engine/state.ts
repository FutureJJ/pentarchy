import { NATIONS } from "@/lib/nations";
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

export const NATION_CODES: NationCode[] = ["CLD", "GPT", "GRK", "DSK", "GMN"];

export function initialState(cycle = 0): WorldState {
  const startedAt = new Date().toISOString();
  const nations: Record<string, NationState> = {};

  for (const n of NATIONS) {
    nations[n.code] = {
      code: n.code as NationCode,
      name: n.name,
      metrics: { ...n.metrics },
      posture: { ...n.posture },
      cities: n.cities.map((c) => {
        const cd = CITY_DATA[`${n.code}:${c.name}`];
        return {
          name: c.name,
          capital: c.capital,
          x: c.x,
          y: c.y,
          population: cd?.population ?? 1.0,
          development: cd?.development ?? 60,
          loyalty: cd?.loyalty ?? 0.7,
          garrison: cd?.garrison ?? 10,
          industry: cd?.industry ?? "general",
          character: cd?.character ?? "industrial",
          crime: { ...(cd?.crime ?? { total: 0.2, violent: 0.05, property: 0.4, drug: 0.15, organized: 0.1 }) },
          police: cd?.police ?? 10,
          prisonPop: cd?.prisonPop ?? 2,
          publicTrust: cd?.publicTrust ?? 0.7,
          recentEvent: cd?.recentEvent ?? "Quiet turn.",
        };
      }),
      budget: {
        defense: 0.20,
        treasury: 0.15,
        foreign: 0.10,
        interior: 0.20,
        intelligence: 0.10,
        publicWorks: 0.25,
      },
      taxation: { land: 0.05, harbor: 0.04, excise: 0.025, income: 0.08 },
      research: "Civil engineering",
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
      bilateral[a][b] = rel
        ? {
            score: rel.score,
            status: rel.status,
            treaties: [...rel.treaties],
            lastCable: rel.lastCable,
          }
        : { score: 0, status: "neutral", treaties: [], lastCable: "—" };
    }
  }

  const recentCables: Cable[] = SAMPLE_CABLES.slice(-6).map((c, i) => ({
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
    season: "spring",
    startedAt,
    globalUnrest: 0.18,
    nations,
    bilateral,
    recentCables,
  };
}

export function seasonForTurn(turn: number): WorldState["season"] {
  const seasons: WorldState["season"][] = ["spring", "summer", "autumn", "winter"];
  return seasons[Math.floor(turn / 3) % 4];
}
