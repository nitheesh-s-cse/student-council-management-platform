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
    info.errorMessage = err instanceof Error ? err.message : String(err);
    if (err instanceof Error && err.stack) {
      info.errorStackTop = err.stack.split("\n").slice(0, 6);
    }
    const cause = err instanceof Error ? err.cause : undefined;
    info.cause = extractError(cause);
  }

  return Response.json(info);
}

// Recursively pull the useful fields out of a wrapped error chain so the
// real Postgres error (code, detail, hint) surfaces instead of drizzle's
// "Failed query:" wrapper. Never includes credentials.
function extractError(err: unknown, depth = 0): unknown {
  if (!err || depth > 5) return null;
  if (err instanceof Error && !/^Failed query/.test(err.message)) return err.message;

  const e = err as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of ["name", "code", "detail", "hint", "severity", "routine"]) {
    if (e[key] !== undefined) out[key] = e[key];
  }
  if (e.message !== undefined) out.message = String(e.message);
  if (e.cause) out.cause = extractError(e.cause, depth + 1);
  return Object.keys(out).length ? out : String(err);
}