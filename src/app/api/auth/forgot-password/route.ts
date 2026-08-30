import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes, createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({ email: z.string().email() });

// In production this would dispatch a transactional email containing the
// reset link. For this environment we log the link server-side so the
// flow can be exercised end-to-end without a mail provider configured.
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`forgot:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const { email } = schema.parse(await request.json());
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (user) {
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");
      await db.insert(passwordResetTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60_000),
      });
      console.info(`[password-reset] Reset link for ${email}: /reset-password?token=${token}`);
    }

    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email, a reset link has been generated.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
