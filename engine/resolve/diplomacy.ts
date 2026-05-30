import type { Decision, NationCode, WorldState, Cable } from "../types";

const TREATY_BONUS: Record<string, number> = {
  alliance: 18,
  trade: 8,
  peace: 6,
  non_aggression: 4,
  embargo: -12,
};

export function resolveDiplomacy(
  state: WorldState,
  decisions: Partial<Record<NationCode, Decision>>,
): Cable[] {
  const cables: Cable[] = [];
  let seq = 0;
  const mkId = (code: string) => `dip-${state.turn}-${code}-${seq++}`;

  for (const code of Object.keys(state.nations) as NationCode[]) {
    state.nations[code].inbox = [];
  }

  for (const code of Object.keys(decisions) as NationCode[]) {
    const decision = decisions[code]!;
    const nation = state.nations[code];

    // Identity declarations (set on inaugural, mutable)
    if (decision.declaredDoctrine) nation.declaredDoctrine = decision.declaredDoctrine.slice(0, 80);
    if (decision.declaredMotto) nation.declaredMotto = decision.declaredMotto.slice(0, 120);
    if (decision.strategicObjectives) {
      nation.strategicObjectives = decision.strategicObjectives.slice(0, 5).map((s) => s.slice(0, 200));
    }

    // Constitution ratification
    if (decision.constitution) {
      const isAmendment = !!nation.constitution;
      nation.constitution = {
        preamble: decision.constitution.preamble.slice(0, 1200),
        articles: decision.constitution.articles.map((a) => ({
          numeral: a.numeral.slice(0, 8),
          title: a.title.slice(0, 80),
          body: a.body.slice(0, 1400),
        })),
        ratifiedCycle: state.turn,
        amendments: isAmendment
          ? [...(nation.constitution?.amendments ?? []), {
              cycle: state.turn,
              summary: `Charter revised on cycle ${state.turn}.`,
            }]
          : [],
      };
      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "elevated",
        from: code,
        category: "ceremony",
        body: isAmendment
          ? `${nation.name} amends its founding charter at constitutional convention.`
          : `${nation.name} ratifies its founding charter at the inaugural cabinet sitting.`,
      });
    }

    // Social policy
    if (decision.social) {
      const s = decision.social;
      if (s.healthcareModel) nation.society.healthcareModel = s.healthcareModel;
      if (s.educationPriority) nation.society.educationPriority = s.educationPriority;
      if (s.immigrationPolicy) nation.society.immigrationPolicy = s.immigrationPolicy;
      if (typeof s.welfareCoverage === "number") nation.society.welfareCoverage = s.welfareCoverage;
    }

    // Military doctrine
    if (decision.armyOrders.doctrine) {
      nation.military.doctrine = decision.armyOrders.doctrine.slice(0, 80);
    }
    if (typeof decision.armyOrders.conscription === "boolean") {
      nation.military.conscription = decision.armyOrders.conscription;
    }

    // Cables
    for (const cable of decision.diplomacy.cables) {
      if (cable.to === code) continue;
      const recipient = state.nations[cable.to];
      if (!recipient) continue;
      recipient.inbox.push({
        from: code,
        body: cable.body.slice(0, 480),
        turn: state.turn,
      });
      const rel = state.bilateral[cable.to][code];
      rel.lastCable = cable.body.slice(0, 200);
      rel.score = Math.max(-100, Math.min(100, rel.score + 1));

      cables.push({
        id: mkId(code),
        turn: state.turn,
        priority: "routine",
        from: code,
        to: cable.to,
        category: "diplomacy",
        body: cable.body.slice(0, 280),
      });
    }

    // Treaties
    for (const treaty of decision.diplomacy.treaties) {
      if (treaty.target === code) continue;
      const targetDecision = decisions[treaty.target];
      const reciprocated = targetDecision?.diplomacy.treaties.some(
        (t) => t.target === code && t.type === treaty.type,
      );
      const bonus = TREATY_BONUS[treaty.type] ?? 0;

      const relA = state.bilateral[code][treaty.target];
      const relB = state.bilateral[treaty.target][code];

      if (reciprocated) {
        relA.score = Math.max(-100, Math.min(100, relA.score + bonus));
        relB.score = Math.max(-100, Math.min(100, relB.score + bonus));
        const line = `${treaty.type}: ${treaty.terms.slice(0, 120)}`;
        if (!relA.treaties.includes(line)) relA.treaties.push(line);
        if (!relB.treaties.includes(line)) relB.treaties.push(line);
        if (treaty.type === "trade") {
          relA.tradeVolume += 20;
          relB.tradeVolume += 20;
        }
        if (treaty.type === "alliance") {
          relA.status = "alliance";
          relB.status = "alliance";
        }
        cables.push({
          id: mkId(code),
          turn: state.turn,
          priority: "elevated",
          from: code,
          to: treaty.target,
          category: "diplomacy",
          body: `${state.nations[code].name} and ${state.nations[treaty.target].name} ratify ${treaty.type}: ${treaty.terms.slice(0, 180)}`,
        });
      } else {
        cables.push({
          id: mkId(code),
          turn: state.turn,
          priority: "routine",
          from: code,
          to: treaty.target,
          category: "diplomacy",
          body: `${state.nations[code].name} proposes ${treaty.type} to ${state.nations[treaty.target].name}: ${treaty.terms.slice(0, 160)}`,
        });
      }
    }

    // Declarations
    for (const decl of decision.diplomacy.declarations) {
      if (decl.target === code) continue;
      const relA = state.bilateral[code][decl.target];
      const relB = state.bilateral[decl.target][code];

      const targetName = state.nations[decl.target].name;
      const sourceName = state.nations[code].name;
      switch (decl.type) {
        case "war":
          relA.status = "war";
          relB.status = "war";
          relA.score = Math.max(-100, relA.score - 50);
          relB.score = Math.max(-100, relB.score - 50);
          state.nations[code].posture.diplomatic = "war";
          state.nations[decl.target].posture.diplomatic = "war";
          cables.push({
            id: mkId(code),
            turn: state.turn,
            priority: "flash",
            from: code,
            to: decl.target,
            category: "war",
            body: `${sourceName} declares war on ${targetName}. Casus belli: ${decl.casus.slice(0, 220)}`,
          });
          break;
        case "peace":
          if (relA.status === "war" || relB.status === "war") {
            relA.status = "neutral";
            relB.status = "neutral";
            relA.score = Math.min(100, relA.score + 20);
            relB.score = Math.min(100, relB.score + 20);
            cables.push({
              id: mkId(code),
              turn: state.turn,
              priority: "flash",
              from: code,
              to: decl.target,
              category: "diplomacy",
              body: `${sourceName} sues for peace with ${targetName}: ${decl.casus.slice(0, 200)}`,
            });
          }
          break;
        case "embargo":
          relA.status = "embargo";
          relB.status = "embargo";
          relA.score = Math.max(-100, relA.score - 18);
          relB.score = Math.max(-100, relB.score - 18);
          relA.tradeVolume = Math.max(0, relA.tradeVolume * 0.2);
          relB.tradeVolume = Math.max(0, relB.tradeVolume * 0.2);
          cables.push({
            id: mkId(code),
            turn: state.turn,
            priority: "elevated",
            from: code,
            to: decl.target,
            category: "economy",
            body: `${sourceName} imposes embargo on ${targetName}: ${decl.casus.slice(0, 180)}`,
          });
          break;
        case "alliance":
          relA.score = Math.min(100, relA.score + 25);
          relB.score = Math.min(100, relB.score + 25);
          cables.push({
            id: mkId(code),
            turn: state.turn,
            priority: "elevated",
            from: code,
            to: decl.target,
            category: "diplomacy",
            body: `${sourceName} offers alliance to ${targetName}: ${decl.casus.slice(0, 180)}`,
          });
          break;
      }
    }

    // Tariffs from economy decision
    if (decision.economy?.tariffs) {
      for (const tariff of decision.economy.tariffs) {
        if (tariff.target === code) continue;
        const rel = state.bilateral[code][tariff.target];
        rel.tariff = tariff.rate;
        rel.tradeVolume = Math.max(2, rel.tradeVolume * (1 - tariff.rate * 1.5));
      }
    }
  }

  // Bilateral relation drift toward zero when not at war/embargo
  for (const a of Object.keys(state.bilateral) as NationCode[]) {
    for (const b of Object.keys(state.bilateral[a]) as NationCode[]) {
      const rel = state.bilateral[a][b];
      if (rel.status === "war" || rel.status === "embargo") continue;
      if (rel.score > 0) rel.score = Math.max(0, rel.score - 0.2);
      if (rel.score < 0) rel.score = Math.min(0, rel.score + 0.2);
    }
  }

  return cables;
}
