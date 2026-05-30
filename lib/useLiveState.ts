"use client";

import { useEffect, useState } from "react";
import type { WorldState } from "@/engine/types";
import type { Cable } from "@/engine/types";

type StateResponse = {
  ok: boolean;
  state?: WorldState;
  maxTurns?: number;
};

export function useLiveState(intervalMs = 30_000) {
  const [data, setData] = useState<StateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/state", { cache: "no-store" });
        const json = (await res.json()) as StateResponse;
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    }
    load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { data, error };
}

export function useLiveCables(intervalMs = 30_000, limit = 50) {
  const [cables, setCables] = useState<Cable[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/cables?limit=${limit}`, { cache: "no-store" });
        const json = (await res.json()) as { ok: boolean; cables: Cable[] };
        if (!cancelled && json.ok) setCables(json.cables);
      } catch {
        /* swallow */
      }
    }
    load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs, limit]);
  return cables;
}
