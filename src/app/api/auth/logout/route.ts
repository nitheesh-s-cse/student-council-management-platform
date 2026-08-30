import { NextResponse } from "next/server";
import { destroySession, getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  await destroySession();
  if (user) {
    await logAudit({ userId: user.id, action: "logout", objectType: "user", objectId: user.id, request });
  }
  return NextResponse.json({ ok: true });
}
