import { NextResponse } from "next/server";
import { getCables } from "@/engine/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CYCLE = Number(process.env.PENTARCHY_CYCLE ?? 0);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit") ?? 60)));
  const cables = await getCables(CYCLE, limit);
  return NextResponse.json({ ok: true, cycle: CYCLE, cables }, { status: 200 });
}
