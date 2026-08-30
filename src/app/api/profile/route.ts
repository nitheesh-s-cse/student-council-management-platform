import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  bio: z.string().max(2000).optional(),
  skills: z.string().max(400).optional(),
  photoUrl: z.string().url().optional().nullable(),
});

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    if (!user.memberId) {
      return NextResponse.json({ error: "This account is not linked to a member profile." }, { status: 400 });
    }
    const body = schema.parse(await request.json());
    await db.update(members).set({ ...body, updatedAt: new Date() }).where(eq(members.id, user.memberId));
    await logAudit({ userId: user.id, action: "profile_updated", objectType: "member", objectId: user.memberId, request });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
