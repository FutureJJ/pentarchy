import { decideAll } from "./agent";
import { buildAllBundles } from "./bundle";
import { resolveArms } from "./resolve/arms";
import { resolveClimate } from "./resolve/climate";
import { resolveDiplomacy } from "./resolve/diplomacy";
import { resolveEconomy } from "./resolve/economy";
import { initialState, seasonForTurn } from "./state";
import {
  acquireLock,
  appendCables,
  getState,
  releaseLock,
  saveDecision,
  setState,
  snapshotState,
} from "./storage";
import type { Cable, NationCode, WorldState } from "./types";

export type TickResult = {
  ok: boolean;
  message: string;
  turn?: number;
  cycle?: number;
  errors?: Partial<Record<NationCode, string>>;
  cableCount?: number;
};

const MAX_TURNS = Number(process.env.PENTARCHY_MAX_TURNS ?? 120);
const CYCLE = Number(process.env.PENTARCHY_CYCLE ?? 0);

export async function runTick(): Promise<TickResult> {
  const cycle = CYCLE;
  const locked = await acquireLock(cycle);
  if (!locked) {
    return { ok: false, message: "Another tick is in progress (lock held)." };
  }

  try {
    let state = await getState(cycle);
    if (!state) {
      state = initialState(cycle);
      await setState(state);
      await snapshotState(state);
      return {
        ok: true,
        message: "Cycle initialised at turn 0 (no decisions yet).",
        turn: 0,
        cycle,
        cableCount: state.recentCables.length,
      };
    }

    if (state.turn >= MAX_TURNS) {
      return {
        ok: true,
        message: `Cycle ${cycle} already concluded at turn ${state.turn}.`,
        turn: state.turn,
        cycle,
      };
    }

    state.turn += 1;
    state.season = seasonForTurn(state.turn);
    state.lastTickAt = new Date().toISOString();

    const bundles = buildAllBundles(state, MAX_TURNS);
    const { results, errors } = await decideAll(bundles);

    const decisionMap: Partial<Parameters<typeof resolveEconomy>[1]> = {};
    for (const code of Object.keys(results) as NationCode[]) {
      const r = results[code];
      if (!r) continue;
      decisionMap[code] = r.decision;
      await saveDecision(cycle, state.turn, code, r.decision, r.raw);
    }

    const econCables = resolveEconomy(state, decisionMap);
    const dipCables = resolveDiplomacy(state, decisionMap);
    const armsCables = resolveArms(state, decisionMap);
    const climateCables = resolveClimate(state);

    const allTurnCables: Cable[] = [
      ...econCables,
      ...dipCables,
      ...armsCables,
      ...climateCables,
    ];

    state.recentCables = [...allTurnCables.slice(-30), ...state.recentCables].slice(0, 80);
    await appendCables(cycle, allTurnCables);
    await setState(state);
    await snapshotState(state);

    const errorEntries = Object.entries(errors);
    const message = errorEntries.length
      ? `Turn ${state.turn} resolved with ${errorEntries.length} model error(s).`
      : `Turn ${state.turn} resolved.`;

    return {
      ok: true,
      message,
      turn: state.turn,
      cycle,
      errors: errorEntries.length ? errors : undefined,
      cableCount: allTurnCables.length,
    };
  } finally {
    await releaseLock(cycle);
  }
}
