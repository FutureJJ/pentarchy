import type { Decision, NationCode, WorldState, Cable } from "../types";

export function resolveEconomy(
  state: WorldState,
  decisions: Partial<Record<NationCode, Decision>>,
): Cable[] {
  const cables: Cable[] = [];
  let cableSeq = 0;
  const mkId = (code: string) => `eco-${state.turn}-${code}-${cableSeq++}`;

  for (const code of Object.keys(state.nations) as NationCode[]) {
    const nation = state.nations[code];
    const decision = decisions[code];

    if (decision) {
      const sum =
        decision.budget.defense +
        decision.budget.treasury +
        decision.budget.foreign +
        decision.budget.interior +
        decision.budget.intelligence +
        decision.budget.publicWorks;
      const n = sum > 0 ? sum : 1;
      nation.budget = {
        defense: decision.budget.defense / n,
        treasury: decision.budget.treasury / n,
        foreign: decision.budget.foreign / n,
        interior: decision.budget.interior / n,
        intelligence: decision.budget.intelligence / n,
        publicWorks: decision.budget.publicWorks / n,
      };
      nation.taxation = { ...decision.taxation };
      nation.research = decision.research;
      nation.edicts = decision.edicts.slice(0, 3);
    }

    const taxRate =
      nation.taxation.land * 0.4 +
      nation.taxation.harbor * 0.2 +
      nation.taxation.excise * 0.15 +
      nation.taxation.income * 0.45;

    const collected = nation.metrics.gdp * taxRate * 0.083;
    const spending = collected * (1 - nation.budget.treasury);

    nation.metrics.treasury = Math.max(0, nation.metrics.treasury + collected - spending);

    const growth = 0.005 - Math.max(0, taxRate - 0.18) * 0.05 + nation.budget.publicWorks * 0.012;
    nation.metrics.gdp = Math.max(50, nation.metrics.gdp * (1 + growth));

    const moraleDrift =
      (nation.budget.interior - 0.18) * 0.06 -
      Math.max(0, taxRate - 0.2) * 0.08 +
      (nation.posture.diplomatic === "war" ? -0.012 : 0.002);
    nation.metrics.morale = Math.max(
      0.15,
      Math.min(0.98, nation.metrics.morale + moraleDrift),
    );

    if (taxRate > 0.28) {
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "elevated",
        from: code,
        category: "economy",
        body: `${nation.name} treasury reports tax burden of ${(taxRate * 100).toFixed(1)}% — unrest at the markets.`,
      });
    }
    if (growth > 0.012) {
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "routine",
        from: code,
        category: "economy",
        body: `${nation.name} GDP expands by ${(growth * 100).toFixed(2)}% this turn.`,
      });
    }
  }

  return cables;
}
