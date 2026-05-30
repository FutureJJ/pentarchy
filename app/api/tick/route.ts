import { NextResponse } from "next/server";
import { runTick } from "@/engine/tick";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

async function handle(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await runTick();
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
