import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { messages, conversationMembers, users, members } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { isConversationMember, getConversationMessages } from "@/lib/services/chat";
import { notifyMany } from "@/lib/services/notifications";
import { pingPresence } from "@/lib/presence";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    pingPresence(user.id);
    const { id } = await params;
    const conversationId = Number(id);
    const allowed = await isConversationMember(conversationId, user.id);
    if (!allowed) return NextResponse.json({ error: "Not a member of this conversation." }, { status: 403 });

    const rows = await getConversationMessages(conversationId);
    return NextResponse.json({ messages: rows });
  } catch (error) {
    return handleApiError(error);
  }
}

const schema = z.object({
  content: z.string().max(4000).optional().nullable(),
  replyToId: z.number().int().optional().nullable(),
  fileId: z.number().int().optional().nullable(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const conversationId = Number(id);
    const allowed = await isConversationMember(conversationId, user.id);
    if (!allowed) return NextResponse.json({ error: "Not a member of this conversation." }, { status: 403 });

    const { content, replyToId, fileId } = schema.parse(await request.json());
    if (!content && !fileId) {
      return NextResponse.json({ error: "Message content or an attachment is required." }, { status: 422 });
    }

    const [message] = await db
      .insert(messages)
      .values({ conversationId, senderUserId: user.id, content: content ?? null, replyToId, fileId: fileId ?? null })
      .returning();

    const [sender] = await db
      .select({ memberName: members.fullName, email: users.email })
      .from(users)
      .leftJoin(members, eq(users.memberId, members.id))
      .where(eq(users.id, user.id))
      .limit(1);

    const recipients = await db
      .select({ userId: conversationMembers.userId })
      .from(conversationMembers)
      .where(eq(conversationMembers.conversationId, conversationId));

    await notifyMany(
      recipients.map((r) => r.userId).filter((id) => id !== user.id),
      { type: "message", title: `New message from ${sender?.memberName ?? sender?.email ?? "a council member"}`, body: (content ?? "📎 Attachment").slice(0, 120), link: `/chat/${conversationId}` },
    );

    return NextResponse.json({ message, senderMemberName: sender?.memberName ?? null, senderEmail: sender?.email ?? null });
  } catch (error) {
    return handleApiError(error);
  }
}
