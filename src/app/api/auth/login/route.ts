import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword, getClientIp } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`login:${ip}`, 10, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });
    }

    const body = schema.parse(await request.json());
    const email = body.email.toLowerCase().trim();

    // Case-insensitive lookup — the DB is normalized to lowercase, but this
    // stays safe even if a mixed-case email ever sneaks in again.
    const [user] = await db
      .select()
      .from(users)
      .where(sql`lower(${users.email}) = ${email}`)
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return NextResponse.json(
        { error: "Account temporarily locked due to repeated failed attempts. Try again later." },
        { status: 423 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "This account has been disabled. Contact a council admin." }, { status: 403 });
    }

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil = attempts >= 6 ? new Date(Date.now() + 15 * 60_000) : null;
      await db.update(users).set({ failedLoginAttempts: attempts, lockedUntil }).where(eq(users.id, user.id));
      await logAudit({ userId: user.id, action: "login_failed", objectType: "user", objectId: user.id, request });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await db
      .update(users)
      .set({ failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    await createSession(user.id);
    await logAudit({ userId: user.id, action: "login_success", objectType: "user", objectId: user.id, request });

    return NextResponse.json({ ok: true, role: user.role });
  } catch (error) {
    return handleApiError(error);
  }
}
