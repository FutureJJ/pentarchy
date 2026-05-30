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
  const seasonModifier = state.season === "winter" ? -0.4 : state.season === "summer" ? 0.2 : 0;

  for (const code of codes) {
    const nation = state.nations[code];
    const roll = seeded(state.turn, code.charCodeAt(0));
    const harvestRoll = seeded(state.turn, code.charCodeAt(1) + 7);

    // Society drift from declared policy
    const healthcareSpend = nation.budget.healthcare;
    const educationSpend = nation.budget.education;
    const welfareSpend = nation.budget.welfare;

    nation.society.lifeExpectancy = Math.max(
      55,
      Math.min(
        90,
        nation.society.lifeExpectancy +
          (healthcareSpend - 0.12) * 0.18 +
          (nation.society.healthcareModel === "universal" ? 0.025 : 0),
      ),
    );
    nation.society.literacy = Math.max(
      0.4,
      Math.min(
        0.99,
        nation.society.literacy + (educationSpend - 0.12) * 0.012,
      ),
    );
    nation.society.healthcareCoverage = Math.max(
      0.2,
      Math.min(
        1,
        nation.society.healthcareCoverage +
          (healthcareSpend - 0.12) * 0.08 +
          (nation.society.healthcareModel === "universal" ? 0.02 : 0),
      ),
    );
    nation.society.schoolEnrollment = Math.max(
      0.4,
      Math.min(
        1,
        nation.society.schoolEnrollment + (educationSpend - 0.12) * 0.05,
      ),
    );

    // Population growth applied each cycle
    nation.society.population = nation.society.population * (1 + nation.society.populationGrowth / 12);

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

    // Harvest events
    if (harvestRoll > 0.78 - seasonModifier * 0.05) {
      nation.economy.gdp *= 1.004;
      nation.approval = Math.min(0.98, nation.approval + 0.008);
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "routine",
        from: code,
        category: "ceremony",
        body: `${nation.name} reports a bountiful ${state.season} season — exchequer receives surplus.`,
      });
    } else if (harvestRoll < 0.12 + (state.season === "winter" ? 0.08 : 0)) {
      nation.economy.gdp *= 0.992;
      nation.approval = Math.max(0.05, nation.approval - 0.012);
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "elevated",
        from: code,
        category: "order",
        body: `Drought reported in ${nation.cities[Math.floor(roll * nation.cities.length)].name} — relief committee convened.`,
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
