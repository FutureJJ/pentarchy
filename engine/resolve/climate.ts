import type { Cable, NationCode, WorldState } from "../types";

function seeded(t: number, key: number): number {
  const x = Math.sin(t * 91.7 + key * 17.3) * 43758.5453;
  return x - Math.floor(x);
}

export function resolveClimate(state: WorldState): Cable[] {
  const cables: Cable[] = [];
  let cableSeq = 0;
  const mkId = (code: string) => `cli-${state.turn}-${code}-${cableSeq++}`;

  const codes = Object.keys(state.nations) as NationCode[];
  const seasonModifier = state.season === "winter" ? -0.4 : state.season === "summer" ? 0.2 : 0;

  for (const code of codes) {
    const nation = state.nations[code];
    const roll = seeded(state.turn, code.charCodeAt(0));
    const harvestRoll = seeded(state.turn, code.charCodeAt(1) + 7);

    if (harvestRoll > 0.78 - seasonModifier * 0.05) {
      nation.metrics.gdp *= 1.005;
      nation.metrics.morale = Math.min(0.98, nation.metrics.morale + 0.01);
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "routine",
        from: code,
        category: "ceremony",
        body: `${nation.name} reports a bountiful ${state.season} harvest — markets receive surplus.`,
      });
    } else if (harvestRoll < 0.12 + (state.season === "winter" ? 0.08 : 0)) {
      nation.metrics.gdp *= 0.99;
      nation.metrics.morale = Math.max(0.1, nation.metrics.morale - 0.012);
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "elevated",
        from: code,
        category: "order",
        body: `Drought reported in ${nation.cities[Math.floor(roll * nation.cities.length)].name} — relief committee convened.`,
      });
    }

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

  let unrest = 0;
  for (const code of codes) unrest += 1 - state.nations[code].metrics.morale;
  state.globalUnrest = Math.min(1, unrest / codes.length);

  return cables;
}
