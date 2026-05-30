import { Redis } from "@upstash/redis";
import type { Cable, NationCode, WorldState } from "./types";

let _redis: Redis | null = null;
function getRedis(): Redis {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Upstash env missing — set KV_REST_API_URL and KV_REST_API_TOKEN",
    );
  }
  _redis = new Redis({ url, token });
  return _redis;
}
const redis = new Proxy({} as Redis, {
  get(_t, prop) {
    const r = getRedis() as unknown as Record<string | symbol, unknown>;
    return r[prop];
  },
});

const K = {
  current: (cycle: number) => `pntr:cycle:${cycle}:current`,
  snapshot: (cycle: number, turn: number) => `pntr:cycle:${cycle}:turn:${turn}`,
  cables: (cycle: number) => `pntr:cycle:${cycle}:cables`,
  decision: (cycle: number, turn: number, code: NationCode) =>
    `pntr:cycle:${cycle}:turn:${turn}:decision:${code}`,
  decisionRaw: (cycle: number, turn: number, code: NationCode) =>
    `pntr:cycle:${cycle}:turn:${turn}:raw:${code}`,
  lock: (cycle: number) => `pntr:cycle:${cycle}:lock`,
  cycleMeta: () => `pntr:meta`,
};

export async function getState(cycle: number): Promise<WorldState | null> {
  const data = await redis.get<WorldState>(K.current(cycle));
  return data ?? null;
}

export async function setState(state: WorldState): Promise<void> {
  await redis.set(K.current(state.cycle), state);
}

export async function snapshotState(state: WorldState): Promise<void> {
  await redis.set(K.snapshot(state.cycle, state.turn), state);
}

export async function getSnapshot(cycle: number, turn: number): Promise<WorldState | null> {
  return (await redis.get<WorldState>(K.snapshot(cycle, turn))) ?? null;
}

export async function appendCables(cycle: number, cables: Cable[]): Promise<void> {
  if (cables.length === 0) return;
  await redis.lpush(K.cables(cycle), ...cables.map((c) => JSON.stringify(c)));
  await redis.ltrim(K.cables(cycle), 0, 4999);
}

export async function getCables(cycle: number, limit = 60): Promise<Cable[]> {
  const raw = await redis.lrange<string>(K.cables(cycle), 0, limit - 1);
  return raw.map((r) => {
    if (typeof r === "string") {
      try {
        return JSON.parse(r) as Cable;
      } catch {
        return null;
      }
    }
    return r as unknown as Cable;
  }).filter(Boolean) as Cable[];
}

export async function saveDecision(
  cycle: number,
  turn: number,
  code: NationCode,
  decision: unknown,
  raw: string,
): Promise<void> {
  await redis.set(K.decision(cycle, turn, code), decision);
  await redis.set(K.decisionRaw(cycle, turn, code), raw);
}

export async function getDecision(
  cycle: number,
  turn: number,
  code: NationCode,
): Promise<unknown> {
  return await redis.get(K.decision(cycle, turn, code));
}

/**
 * Best-effort cycle lock. Returns true if we acquired the lock.
 * Auto-expires after 6 minutes so a stuck tick can't deadlock the next run.
 */
export async function acquireLock(cycle: number): Promise<boolean> {
  const result = await redis.set(K.lock(cycle), Date.now(), {
    nx: true,
    ex: 360,
  });
  return result === "OK";
}

export async function releaseLock(cycle: number): Promise<void> {
  await redis.del(K.lock(cycle));
}

export async function wipeCycle(cycle: number): Promise<void> {
  const keys: string[] = [
    K.current(cycle),
    K.cables(cycle),
    K.lock(cycle),
  ];
  for (let t = 0; t <= 130; t++) {
    keys.push(K.snapshot(cycle, t));
    for (const code of ["CLD", "GPT", "GRK", "DSK", "GMN"] as NationCode[]) {
      keys.push(K.decision(cycle, t, code));
      keys.push(K.decisionRaw(cycle, t, code));
    }
  }
  await redis.del(...keys);
}
