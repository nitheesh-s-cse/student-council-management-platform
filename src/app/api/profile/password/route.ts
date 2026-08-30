import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser, verifyPassword, hashPassword } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

const schema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) });

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { currentPassword, newPassword } = schema.parse(await request.json());
    const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!row || !(await verifyPassword(currentPassword, row.passwordHash))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    const passwordHash = await hashPassword(newPassword);
    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
    await logAudit({ userId: user.id, action: "password_changed", objectType: "user", objectId: user.id, request });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
