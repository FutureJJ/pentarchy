import type { Cable, Decision, NationCode, WorldState } from "../types";

export function resolveArms(
  state: WorldState,
  decisions: Partial<Record<NationCode, Decision>>,
): Cable[] {
  const cables: Cable[] = [];
  let seq = 0;
  const mkId = (code: string) => `arm-${state.turn}-${code}-${seq++}`;

  for (const code of Object.keys(state.nations) as NationCode[]) {
    const nation = state.nations[code];
    const decision = decisions[code];

    const baseGrowth = nation.budget.defense * 4 - 1;
    nation.military.standingArmy = Math.max(20, nation.military.standingArmy + baseGrowth);

    if (nation.military.conscription) {
      nation.military.reserves = Math.min(200, nation.military.reserves + 1.5);
      nation.approval = Math.max(0.05, nation.approval - 0.005);
    }

    if (!decision) continue;

    let produced = 0;
    for (const order of decision.armyOrders.production) {
      const city = nation.cities.find((c) => c.name === order.city);
      if (!city) continue;
      const qty = Math.max(0, Math.min(20, order.qty));
      city.garrison += qty;
      produced += qty;
    }
    if (produced > 0) {
      nation.military.standingArmy += produced;
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "routine",
        from: code,
        category: "war",
        body: `${nation.name} levies ${produced}K new troops across its provinces.`,
      });
    }

    for (const fortCity of decision.armyOrders.fortify) {
      const city = nation.cities.find((c) => c.name === fortCity);
      if (!city) continue;
      city.development = Math.min(100, city.development + 1);
    }

    for (const move of decision.armyOrders.movement) {
      const from = nation.cities.find((c) => c.name === move.from);
      const force = Math.max(0, Math.min(40, move.force));
      if (!from || force <= 0) continue;
      const moved = Math.min(force, Math.max(0, from.garrison - 2));
      if (moved <= 0) continue;
      from.garrison -= moved;

      const ownDest = nation.cities.find((c) => c.name === move.to);
      if (ownDest) {
        ownDest.garrison += moved;
        continue;
      }

      const targetEntry = Object.entries(state.nations).find(([peerCode, peer]) => {
        if (peerCode === code) return false;
        return peer.cities.some((c) => c.name === move.to);
      });
      if (!targetEntry) {
        from.garrison += moved;
        continue;
      }
      const [targetCode, target] = targetEntry as [NationCode, typeof nation];
      const targetCity = target.cities.find((c) => c.name === move.to)!;
      const rel = state.bilateral[code][targetCode];
      if (rel.status !== "war") {
        from.garrison += moved;
        cables.push({
          id: mkId(code),
          turn: state.turn,
          priority: "elevated",
          from: code,
          to: targetCode,
          category: "war",
          body: `${nation.name} mobilization toward ${move.to} aborted — ${target.name} not at war.`,
        });
        continue;
      }

      const attacker = moved * (1 + nation.military.morale * 0.3);
      const defender = targetCity.garrison * (1.15 + target.military.morale * 0.3);
      const ratio = attacker / Math.max(1, attacker + defender);
      const attackerCasualties = Math.round(moved * (1 - ratio) * 0.6);
      const defenderCasualties = Math.round(targetCity.garrison * ratio * 0.7);

      targetCity.garrison = Math.max(0, targetCity.garrison - defenderCasualties);
      const survivors = Math.max(0, moved - attackerCasualties);

      const outcome: "victory" | "stalemate" | "repulsed" =
        ratio > 0.62 ? "victory" : ratio > 0.45 ? "stalemate" : "repulsed";

      if (outcome === "victory") {
        targetCity.loyalty = Math.max(0.1, targetCity.loyalty - 0.18);
        targetCity.development = Math.max(20, targetCity.development - 4);
        from.garrison += Math.round(survivors * 0.3);
      } else {
        from.garrison += survivors;
      }

      nation.military.morale = Math.max(0.1, nation.military.morale - attackerCasualties * 0.0008);
      target.military.morale = Math.max(0.1, target.military.morale - defenderCasualties * 0.001);

      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "flash",
        from: code,
        to: targetCode,
        category: "war",
        body: `Battle at ${targetCity.name}: ${nation.name} ${outcome} (att −${attackerCasualties}K, def −${defenderCasualties}K).`,
      });
    }
  }

  return cables;
}
