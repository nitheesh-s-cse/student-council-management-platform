import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { eq, and, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({ token: z.string().min(10), password: z.string().min(8) });

export async function POST(request: Request) {
  try {
    const { token, password } = schema.parse(await request.json());
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const [record] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          gt(passwordResetTokens.expiresAt, new Date()),
          isNull(passwordResetTokens.usedAt),
        ),
      )
      .limit(1);

    if (!record) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await db.update(users).set({ passwordHash }).where(eq(users.id, record.userId));
    await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, record.id));
    await logAudit({ userId: record.userId, action: "password_reset", objectType: "user", objectId: record.userId, request });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
