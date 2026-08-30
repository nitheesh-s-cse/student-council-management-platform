import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Temporary diagnostic endpoint — always returns 200 so the response body
// (including the underlying database error) is visible in the browser and
// the Vercel function logs. Safe to expose: never includes the password.
export async function GET() {
  const info: Record<string, unknown> = {
    ok: false,
    time: new Date().toISOString(),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseUrlLength: process.env.DATABASE_URL?.length ?? 0,
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    await db.execute(sql`select 1`);
    info.ok = true;
  } catch (err) {
    info.error = err instanceof Error ? err.message : String(err);
    if (err && typeof err === "object" && "code" in err) {
      info.errorCode = (err as { code?: string }).code;
    }
  }

  return Response.json(info);
}