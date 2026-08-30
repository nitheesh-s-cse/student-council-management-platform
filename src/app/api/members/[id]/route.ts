import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members, users } from "@/db/schema";
import { requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  position: z.string().nullable().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  category: z.enum(["board", "executive", "committee"]).optional(),
  committeeName: z.string().nullable().optional(),
  registerNumber: z.string().nullable().optional(),
  registerNumberVisible: z.boolean().optional(),
  bio: z.string().nullable().optional(),
  responsibilities: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  role: z.enum(["super_admin", "admin", "board", "team_lead", "member"]).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole("admin");
    const { id } = await params;
    const memberId = Number(id);
    const body = updateSchema.parse(await request.json());
    const { role, ...memberFields } = body;

    const [member] = await db.update(members).set({ ...memberFields, updatedAt: new Date() }).where(eq(members.id, memberId)).returning();

    if (role) {
      await db.update(users).set({ role }).where(eq(users.memberId, memberId));
    }

    await logAudit({ userId: user.id, action: "member_updated", objectType: "member", objectId: memberId, metadata: body, request });

    return NextResponse.json({ member });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole("admin");
    const { id } = await params;
    const memberId = Number(id);
    await db.update(members).set({ isActive: false, updatedAt: new Date() }).where(eq(members.id, memberId));
    await db.update(users).set({ isActive: false }).where(eq(users.memberId, memberId));
    await logAudit({ userId: user.id, action: "member_disabled", objectType: "member", objectId: memberId, request });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
