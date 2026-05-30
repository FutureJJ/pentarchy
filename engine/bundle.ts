import type { Bundle, NationCode, WorldState } from "./types";
import { NATIONS } from "@/lib/nations";

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
  const youMeta = NATIONS.find((n) => n.code === code)!;

  const publicRegister: Bundle["publicRegister"] = {} as Bundle["publicRegister"];
  for (const peerCode of Object.keys(state.nations) as NationCode[]) {
    if (peerCode === code) continue;
    const peer = state.nations[peerCode];
    const seed = state.turn * 17 + peerCode.charCodeAt(0);
    const rel = state.bilateral[code][peerCode];
    publicRegister[peerCode] = {
      name: peer.name,
      gdpEstimate: Math.round(jitter(peer.metrics.gdp, PEER_NOISE, seed)),
      population: Math.round(peer.metrics.population * 10) / 10,
      armyEstimate: Math.round(jitter(peer.metrics.army, PEER_NOISE * 1.5, seed + 1)),
      posture: { ...peer.posture },
      relationToYou: { ...rel },
    };
  }

  // Cheap "intel reports": one per peer, with confidence proportional to relation score.
  const intelReports: Bundle["intelReports"] = [];
  for (const peerCode of Object.keys(state.nations) as NationCode[]) {
    if (peerCode === code) continue;
    const peer = state.nations[peerCode];
    const rel = state.bilateral[code][peerCode];
    const confidence = Math.max(0.2, Math.min(0.95, 0.5 + rel.score / 100));
    intelReports.push({
      topic: `${peerCode} disposition`,
      summary: `${peer.name} morale ${(peer.metrics.morale * 100).toFixed(0)}%, posture ${peer.posture.diplomatic}. Recent: "${rel.lastCable}".`,
      confidence,
    });
  }

  const inbox = [...you.inbox];

  return {
    you: {
      code,
      name: you.name,
      doctrine: youMeta.doctrine,
      state: you,
    },
    world: {
      cycle: state.cycle,
      turn: state.turn,
      maxTurns,
      season: state.season,
      globalUnrest: state.globalUnrest,
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
