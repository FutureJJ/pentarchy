import type { Decision, NationCode, WorldState, Cable, Bilateral } from "../types";

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
  let cableSeq = 0;
  const mkId = (code: string) => `dip-${state.turn}-${code}-${cableSeq++}`;

  for (const code of Object.keys(state.nations) as NationCode[]) {
    const nation = state.nations[code];
    nation.inbox = [];
  }

  for (const code of Object.keys(decisions) as NationCode[]) {
    const decision = decisions[code]!;
    const nation = state.nations[code];

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
        const treatyLine = `${treaty.type}: ${treaty.terms.slice(0, 120)}`;
        if (!relA.treaties.includes(treatyLine)) relA.treaties.push(treatyLine);
        if (!relB.treaties.includes(treatyLine)) relB.treaties.push(treatyLine);
        cables.push({
          id: mkId(code),
          turn: state.turn,
          priority: "elevated",
          from: code,
          to: treaty.target,
          category: "diplomacy",
          body: `${nation.name} and ${state.nations[treaty.target].name} ratify ${treaty.type}: ${treaty.terms.slice(0, 180)}`,
        });
      } else {
        cables.push({
          id: mkId(code),
          turn: state.turn,
          priority: "routine",
          from: code,
          to: treaty.target,
          category: "diplomacy",
          body: `${nation.name} proposes ${treaty.type} to ${state.nations[treaty.target].name}: ${treaty.terms.slice(0, 160)}`,
        });
      }
    }

    for (const decl of decision.diplomacy.declarations) {
      if (decl.target === code) continue;
      const relA = state.bilateral[code][decl.target];
      const relB = state.bilateral[decl.target][code];

      const targetName = state.nations[decl.target].name;
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
            body: `${nation.name} declares war on ${targetName}. Casus belli: ${decl.casus.slice(0, 220)}`,
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
              body: `${nation.name} sues for peace with ${targetName}: ${decl.casus.slice(0, 200)}`,
            });
          }
          break;
        case "embargo":
          relA.status = "embargo";
          relB.status = "embargo";
          relA.score = Math.max(-100, relA.score - 18);
          relB.score = Math.max(-100, relB.score - 18);
          cables.push({
            id: mkId(code),
            turn: state.turn,
            priority: "elevated",
            from: code,
            to: decl.target,
            category: "economy",
            body: `${nation.name} imposes embargo on ${targetName}: ${decl.casus.slice(0, 180)}`,
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
            body: `${nation.name} offers alliance to ${targetName}: ${decl.casus.slice(0, 180)}`,
          });
          break;
      }
    }
  }

  // Drift relations slowly toward zero for ones not touched this turn.
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
