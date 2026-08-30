import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { roleAtLeast } from "@/lib/constants";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const messageId = Number(id);
    const [message] = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
    if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });

    const canDelete = message.senderUserId === user.id || roleAtLeast(user.role, "admin");
    if (!canDelete) return NextResponse.json({ error: "You can only delete your own messages." }, { status: 403 });

    await db.update(messages).set({ deletedAt: new Date(), content: null }).where(eq(messages.id, messageId));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const messageId = Number(id);
    const body = await request.json();
    const [message] = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
    if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    if (!roleAtLeast(user.role, "team_lead") && message.senderUserId !== user.id) {
      return NextResponse.json({ error: "Not allowed to pin this message." }, { status: 403 });
    }
    await db.update(messages).set({ pinned: Boolean(body.pinned) }).where(eq(messages.id, messageId));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
