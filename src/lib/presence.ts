// In-memory presence + typing indicator tracking for a single-instance
// deployment. Clients poll these endpoints every few seconds, which keeps
// the architecture simple while remaining a drop-in replacement target for
// a Socket.IO/WebSocket gateway (see /api/chat/*) when scaling out.
type TypingEntry = { userId: number; name: string; expiresAt: number };

const typingByConversation = new Map<number, Map<number, TypingEntry>>();
const presenceByUser = new Map<number, number>(); // userId -> last seen ms

export function pingPresence(userId: number) {
  presenceByUser.set(userId, Date.now());
}

export function isOnline(userId: number) {
  const last = presenceByUser.get(userId);
  return Boolean(last && Date.now() - last < 20_000);
}

export function setTyping(conversationId: number, userId: number, name: string) {
  const bucket = typingByConversation.get(conversationId) ?? new Map();
  bucket.set(userId, { userId, name, expiresAt: Date.now() + 4000 });
  typingByConversation.set(conversationId, bucket);
}

export function getTypingUsers(conversationId: number, excludeUserId: number) {
  const bucket = typingByConversation.get(conversationId);
  if (!bucket) return [];
  const now = Date.now();
  return [...bucket.values()].filter((e) => e.expiresAt > now && e.userId !== excludeUserId);
}
