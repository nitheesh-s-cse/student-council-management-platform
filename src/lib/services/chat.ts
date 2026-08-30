import "server-only";
import { db } from "@/db";
import {
  conversations,
  conversationMembers,
  messages,
  users,
  members,
  messageReactions,
} from "@/db/schema";
import { eq, desc, and, asc, sql } from "drizzle-orm";

export async function listConversationsForUser(userId: number) {
  const rows = await db
    .select({
      conversation: conversations,
      lastReadAt: conversationMembers.lastReadAt,
    })
    .from(conversationMembers)
    .innerJoin(conversations, eq(conversationMembers.conversationId, conversations.id))
    .where(eq(conversationMembers.userId, userId));

  const results = [];
  for (const row of rows) {
    const [lastMessage] = await db
      .select({ message: messages, senderMemberName: members.fullName, senderEmail: users.email })
      .from(messages)
      .leftJoin(users, eq(messages.senderUserId, users.id))
      .leftJoin(members, eq(users.memberId, members.id))
      .where(eq(messages.conversationId, row.conversation.id))
      .orderBy(desc(messages.createdAt))
      .limit(1);

    const unread = await db.$count(
      messages,
      and(
        eq(messages.conversationId, row.conversation.id),
        row.lastReadAt ? sql`${messages.createdAt} > ${row.lastReadAt}` : sql`true`,
      ),
    );

    results.push({
      conversation: row.conversation,
      lastMessage: lastMessage?.message ?? null,
      lastSenderName: lastMessage?.senderMemberName ?? lastMessage?.senderEmail ?? null,
      unread,
    });
  }

  results.sort((a, b) => {
    const at = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const bt = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return bt - at;
  });

  return results;
}

export async function isConversationMember(conversationId: number, userId: number) {
  const [row] = await db
    .select()
    .from(conversationMembers)
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)))
    .limit(1);
  return Boolean(row);
}

export async function getConversationMessages(conversationId: number, limit = 50) {
  const rows = await db
    .select({
      message: messages,
      senderMemberName: members.fullName,
      senderPhoto: members.photoUrl,
      senderEmail: users.email,
    })
    .from(messages)
    .leftJoin(users, eq(messages.senderUserId, users.id))
    .leftJoin(members, eq(users.memberId, members.id))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
    .limit(limit);

  const messageIds = rows.map((r) => r.message.id);
  const reactions = messageIds.length
    ? await db.select().from(messageReactions).where(sql`${messageReactions.messageId} in (${sql.join(messageIds, sql`, `)})`)
    : [];

  return rows.map((r) => ({
    ...r,
    reactions: reactions.filter((re) => re.messageId === r.message.id),
  }));
}

export async function getOrCreateDirectConversation(userA: number, userB: number) {
  const rowsA = await db.select({ conversationId: conversationMembers.conversationId }).from(conversationMembers).where(eq(conversationMembers.userId, userA));
  const rowsB = await db.select({ conversationId: conversationMembers.conversationId }).from(conversationMembers).where(eq(conversationMembers.userId, userB));
  const setB = new Set(rowsB.map((r) => r.conversationId));

  for (const row of rowsA) {
    if (setB.has(row.conversationId)) {
      const [conv] = await db.select().from(conversations).where(and(eq(conversations.id, row.conversationId), eq(conversations.type, "direct"))).limit(1);
      if (conv) {
        const memberCount = await db.$count(conversationMembers, eq(conversationMembers.conversationId, conv.id));
        if (memberCount === 2) return conv;
      }
    }
  }

  const [conv] = await db.insert(conversations).values({ type: "direct" }).returning();
  await db.insert(conversationMembers).values([
    { conversationId: conv.id, userId: userA },
    { conversationId: conv.id, userId: userB },
  ]);
  return conv;
}
