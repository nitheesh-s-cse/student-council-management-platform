import { getCurrentUser } from "@/lib/auth";
import { listConversationsForUser } from "@/lib/services/chat";
import { ChatList } from "@/components/chat/chat-list";

export const dynamic = "force-dynamic";

export default async function ChatIndexPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const conversations = await listConversationsForUser(user.id);

  return (
    <div className="mx-auto flex h-[calc(100dvh-10rem)] max-w-7xl md:h-[calc(100dvh-5rem)]">
      <ChatList conversations={conversations} currentUserId={user.id} />
      <div className="hidden flex-1 items-center justify-center text-sm text-muted md:flex">
        Select a conversation to start chatting.
      </div>
    </div>
  );
}
