import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listConversationsForUser, isConversationMember, getConversationMessages } from "@/lib/services/chat";
import { ChatList } from "@/components/chat/chat-list";
import { ConversationView } from "@/components/chat/conversation-view";

export const dynamic = "force-dynamic";

export default async function ChatConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversationId = Number(id);
  const user = await getCurrentUser();
  if (!user) return null;

  const allowed = await isConversationMember(conversationId, user.id);
  if (!allowed) notFound();

  const [conversations, messages] = await Promise.all([
    listConversationsForUser(user.id),
    getConversationMessages(conversationId),
  ]);

  const active = conversations.find((c) => c.conversation.id === conversationId);

  return (
    <div className="mx-auto flex h-[calc(100dvh-10rem)] max-w-7xl md:h-[calc(100dvh-5rem)]">
      <ChatList conversations={conversations} currentUserId={user.id} activeId={conversationId} className="hidden md:flex" />
      <ConversationView
        conversationId={conversationId}
        conversationMeta={active?.conversation ?? null}
        initialMessages={messages}
        currentUserId={user.id}
      />
    </div>
  );
}
