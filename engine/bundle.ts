import type { Bundle, NationCode, WorldState } from "./types";
import { yearOf } from "./types";

const PEER_NOISE = 0.12;

function jitter(n: number, factor: number, seed: number): number {
  const r = Math.sin(seed * 12.9898) * 43758.5453;
  const f = r - Math.floor(r);
  return n * (1 + (f - 0.5) * 2 * factor);
}

export function buildBundle(
  code: NationCode,
  state: WorldState,
  maxTurns: number,
): Bundle {
  const you = state.nations[code];

  const publicRegister: Bundle["publicRegister"] = {} as Bundle["publicRegister"];
  for (const peerCode of Object.keys(state.nations) as NationCode[]) {
    if (peerCode === code) continue;
    const peer = state.nations[peerCode];
    const seed = state.turn * 17 + peerCode.charCodeAt(0);
    const rel = state.bilateral[code][peerCode];
    publicRegister[peerCode] = {
      name: peer.name,
      gdpEstimate: Math.round(jitter(peer.economy.gdp, PEER_NOISE, seed)),
      population: Math.round(peer.society.population * 10) / 10,
      armyEstimate: Math.round(jitter(peer.military.standingArmy, PEER_NOISE * 1.5, seed + 1)),
      declaredDoctrine: peer.declaredDoctrine || "undeclared",
      posture: { ...peer.posture },
      relationToYou: { ...rel },
      constitutionRatified: !!peer.constitution,
    };
  }

  const intelReports: Bundle["intelReports"] = [];
  for (const peerCode of Object.keys(state.nations) as NationCode[]) {
    if (peerCode === code) continue;
    const peer = state.nations[peerCode];
    const rel = state.bilateral[code][peerCode];
    const confidence = Math.max(0.2, Math.min(0.95, 0.5 + rel.score / 100));
    intelReports.push({
      topic: `${peerCode} disposition`,
      summary: `${peer.name} — morale ${(peer.military.morale * 100).toFixed(0)}%, unrest ${(peer.unrest * 100).toFixed(0)}%, posture ${peer.posture.diplomatic}. Recent cable: "${rel.lastCable}".`,
      confidence,
    });
  }

  const inbox = [...you.inbox];

  return {
    you: {
      code,
      name: you.name,
      state: you,
    },
    world: {
      cycle: state.cycle,
      turn: state.turn,
      year: yearOf(state.turn),
      maxTurns,
      finalYear: yearOf(maxTurns),
      globalUnrest: state.globalUnrest,
      isInauguralCycle: state.turn === 1,
    },
    publicRegister,
    intelReports,
    inbox,
    recentWorldCables: state.recentCables.slice(-12),
  };
}

export function buildAllBundles(
  state: WorldState,
  maxTurns: number,
): Record<NationCode, Bundle> {
  const out = {} as Record<NationCode, Bundle>;
  for (const code of Object.keys(state.nations) as NationCode[]) {
    out[code] = buildBundle(code, state, maxTurns);
  }
  return out;
}
