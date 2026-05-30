import type { Decision, NationCode, WorldState, Cable } from "../types";

export function resolveEconomy(
  state: WorldState,
  decisions: Partial<Record<NationCode, Decision>>,
): Cable[] {
  const cables: Cable[] = [];
  let seq = 0;
  const mkId = (code: string) => `eco-${state.turn}-${code}-${seq++}`;

  for (const code of Object.keys(state.nations) as NationCode[]) {
    const nation = state.nations[code];
    const decision = decisions[code];

    if (decision) {
      // Normalise budget
      const sum =
        decision.budget.defense +
        decision.budget.treasury +
        decision.budget.foreign +
        decision.budget.interior +
        decision.budget.intelligence +
        decision.budget.publicWorks +
        decision.budget.education +
        decision.budget.healthcare +
        decision.budget.welfare;
      const n = sum > 0 ? sum : 1;
      nation.budget = {
        defense: decision.budget.defense / n,
        treasury: decision.budget.treasury / n,
        foreign: decision.budget.foreign / n,
        interior: decision.budget.interior / n,
        intelligence: decision.budget.intelligence / n,
        publicWorks: decision.budget.publicWorks / n,
        education: decision.budget.education / n,
        healthcare: decision.budget.healthcare / n,
        welfare: decision.budget.welfare / n,
      };
      nation.taxation = { ...decision.taxation };
      nation.research = decision.research;
      nation.edicts = decision.edicts.slice(0, 5);

      if (decision.economy) {
        const e = decision.economy;
        if (typeof e.minimumWage === "number") nation.economy.minimumWage = e.minimumWage;
        if (typeof e.interestRate === "number") nation.economy.interestRate = e.interestRate;
        if (typeof e.debtIssuance === "number" && e.debtIssuance > 0) {
          nation.economy.publicDebt += e.debtIssuance;
          nation.economy.treasury += e.debtIssuance;
          cables.push({
            id: mkId(code),
            turn: state.turn,
            priority: "elevated",
            from: code,
            category: "economy",
            body: `${nation.name} treasury issues ${e.debtIssuance}M talents in new sovereign debt.`,
          });
        }
      }
    }

    const e = nation.economy;
    const t = nation.taxation;

    // Effective tax burden across sectors
    const taxBurden =
      t.income * 0.45 + t.corporate * 0.25 + t.land * 0.10 + t.harbor * 0.08 +
      t.excise * 0.07 + t.wealth * 0.05;

    // Annual tax revenue
    const revenue = e.gdp * 1000 * taxBurden * 0.32; // million talents per year
    e.treasury += revenue;

    // Annual debt service
    const debtService = e.publicDebt * e.interestRate;
    e.treasury -= debtService;
    if (e.treasury < 0) {
      e.publicDebt += -e.treasury;
      e.treasury = 0;
    }

    // Annual GDP growth model (real-world plausible 0-6%)
    const minWageStress = Math.max(0, (e.minimumWage - 12) * 0.005); // hurts above 12 t/day
    const taxDrag = Math.max(0, taxBurden - 0.22) * 0.22;
    const investBoost = nation.budget.publicWorks * 0.05 + nation.budget.education * 0.03;
    const baseGrowth = 0.022; // 2.2% baseline annual
    const growth = baseGrowth + investBoost - taxDrag - minWageStress;
    e.gdp = Math.max(60, e.gdp * (1 + growth));
    e.gdpPerCapita = (e.gdp * 1000) / nation.society.population;

    // Annual inflation drift
    const debtInflation = Math.max(0, (e.publicDebt - 200) * 0.0002);
    const rateAnchor = (e.interestRate - 0.04) * -1.2; // higher rate cools inflation
    const stochastic = (Math.random() - 0.5) * 0.012;
    e.inflation = Math.max(-0.02, Math.min(0.5, e.inflation + debtInflation + rateAnchor + stochastic));

    // Unemployment annual drift
    const employmentDrift = minWageStress * 1.0 + taxDrag * 0.5 - investBoost * 1.2;
    e.unemployment = Math.max(0.02, Math.min(0.4, e.unemployment + employmentDrift));

    // Wages move with inflation - drag from unemployment
    e.averageSalary = Math.max(800, e.averageSalary * (1 + e.inflation - e.unemployment * 0.05));
    e.medianIncome = Math.max(600, e.medianIncome * (1 + e.inflation * 0.9 - e.unemployment * 0.06));
    e.costOfLivingIndex = Math.max(50, e.costOfLivingIndex * (1 + e.inflation * 0.7));

    // Approval drift
    const approvalDelta =
      -e.unemployment * 0.04 +
      -Math.max(0, e.inflation - 0.04) * 0.5 +
      nation.budget.welfare * 0.04 +
      nation.budget.healthcare * 0.03;
    nation.approval = Math.max(0.05, Math.min(0.98, nation.approval + approvalDelta));

    // Cables for noteworthy events
    if (e.inflation > 0.08) {
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "elevated",
        from: code,
        category: "economy",
        body: `${nation.name} inflation prints ${(e.inflation * 100).toFixed(1)}% — purchasing power under pressure.`,
      });
    }
    if (e.unemployment > 0.12) {
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "elevated",
        from: code,
        category: "economy",
        body: `${nation.name} unemployment climbs to ${(e.unemployment * 100).toFixed(1)}% — protests reported in ${nation.cities[1].name}.`,
      });
    }
    if (growth > 0.012) {
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "routine",
        from: code,
        category: "economy",
        body: `${nation.name} GDP expands by ${(growth * 100).toFixed(2)}% this cycle.`,
      });
    }
  }

  return cables;
}
