import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { setTyping, getTypingUsers, pingPresence } from "@/lib/presence";
import { isConversationMember } from "@/lib/services/chat";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    pingPresence(user.id);
    const { id } = await params;
    const conversationId = Number(id);
    const allowed = await isConversationMember(conversationId, user.id);
    if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    setTyping(conversationId, user.id, user.memberName ?? user.email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const typing = getTypingUsers(Number(id), user.id);
    return NextResponse.json({ typing });
  } catch (error) {
    return handleApiError(error);
  }
}
