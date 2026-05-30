import type { Cable, NationCode, WorldState } from "../types";

function seeded(t: number, key: number): number {
  const x = Math.sin(t * 91.7 + key * 17.3) * 43758.5453;
  return x - Math.floor(x);
}

export function resolveClimate(state: WorldState): Cable[] {
  const cables: Cable[] = [];
  let seq = 0;
  const mkId = (code: string) => `cli-${state.turn}-${code}-${seq++}`;

  const codes = Object.keys(state.nations) as NationCode[];

  for (const code of codes) {
    const nation = state.nations[code];
    const roll = seeded(state.turn, code.charCodeAt(0));
    const harvestRoll = seeded(state.turn, code.charCodeAt(1) + 7);

    // Society drift from declared policy
    const healthcareSpend = nation.budget.healthcare;
    const educationSpend = nation.budget.education;
    const welfareSpend = nation.budget.welfare;

    // Annual life expectancy drift — slow but compounding over a century
    nation.society.lifeExpectancy = Math.max(
      55,
      Math.min(
        92,
        nation.society.lifeExpectancy +
          (healthcareSpend - 0.12) * 0.6 +
          (nation.society.healthcareModel === "universal" ? 0.15 : 0),
      ),
    );
    nation.society.literacy = Math.max(
      0.4,
      Math.min(
        0.99,
        nation.society.literacy + (educationSpend - 0.12) * 0.05,
      ),
    );
    nation.society.healthcareCoverage = Math.max(
      0.2,
      Math.min(
        1,
        nation.society.healthcareCoverage +
          (healthcareSpend - 0.12) * 0.3 +
          (nation.society.healthcareModel === "universal" ? 0.04 : 0),
      ),
    );
    nation.society.schoolEnrollment = Math.max(
      0.4,
      Math.min(
        1,
        nation.society.schoolEnrollment + (educationSpend - 0.12) * 0.18,
      ),
    );

    // Annual population growth
    nation.society.population = nation.society.population * (1 + nation.society.populationGrowth);

    // Welfare moderates unrest
    nation.unrest = Math.max(
      0,
      Math.min(
        1,
        nation.unrest -
          welfareSpend * 0.02 -
          healthcareSpend * 0.012 +
          (nation.economy.unemployment - 0.06) * 0.1 +
          Math.max(0, nation.economy.inflation - 0.04) * 0.4,
      ),
    );

    // Annual harvest / disaster events
    if (harvestRoll > 0.78) {
      nation.economy.gdp *= 1.012;
      nation.approval = Math.min(0.98, nation.approval + 0.02);
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "routine",
        from: code,
        category: "ceremony",
        body: `${nation.name} closes year ${state.year} with strong harvest and trade surplus.`,
      });
    } else if (harvestRoll < 0.12) {
      nation.economy.gdp *= 0.97;
      nation.approval = Math.max(0.05, nation.approval - 0.03);
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "elevated",
        from: code,
        category: "order",
        body: `Drought year reported in ${nation.cities[Math.floor(roll * nation.cities.length)].name} — relief committee convened.`,
      });
    }

    // Civil unrest spikes
    if (roll < 0.06 && nation.posture.diplomatic !== "war") {
      const city = nation.cities[Math.floor((roll * 100) % nation.cities.length)];
      city.crime.total = Math.min(1, city.crime.total + 0.04);
      city.publicTrust = Math.max(0.1, city.publicTrust - 0.03);
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "elevated",
        from: code,
        category: "order",
        body: `Unrest spike in ${city.name} — provincial council demands cabinet response.`,
      });
    }
  }

  let unrestSum = 0;
  for (const code of codes) unrestSum += state.nations[code].unrest;
  state.globalUnrest = Math.min(1, unrestSum / codes.length);

  return cables;
}
