import { NextResponse } from "next/server";
import { getState } from "@/engine/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const CYCLE = Number(process.env.PENTARCHY_CYCLE ?? 0);
const MAX_TURNS = Number(process.env.PENTARCHY_MAX_TURNS ?? 120);

export async function GET() {
  const state = await getState(CYCLE);
  if (!state) {
    return NextResponse.json(
      { ok: false, message: "Cycle not initialised yet.", cycle: CYCLE, maxTurns: MAX_TURNS },
      { status: 200 },
    );
  }
  return NextResponse.json(
    { ok: true, maxTurns: MAX_TURNS, state },
    { status: 200 },
  );
}
