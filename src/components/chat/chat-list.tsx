"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Users, Hash, ShieldCheck, MessagesSquare, X } from "lucide-react";
import { Avatar, Badge } from "@/components/ui/primitives";
import { cn, relativeTime } from "@/lib/utils";
import type { listConversationsForUser } from "@/lib/services/chat";

type ConversationItem = Awaited<ReturnType<typeof listConversationsForUser>>[number];

const TYPE_ICON: Record<string, typeof Hash> = {
  direct: MessagesSquare,
  team: Users,
  council: Hash,
  board: ShieldCheck,
  task: Hash,
};

export function ChatList({
  conversations,
  activeId,
  className,
}: {
  conversations: ConversationItem[];
  currentUserId: number;
  activeId?: number;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [showDirectory, setShowDirectory] = useState(false);
  const [directory, setDirectory] = useState<{ id: number; email: string; memberName: string | null; department: string | null }[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!showDirectory) return;
    fetch("/api/chat/directory")
      .then((r) => r.json())
      .then((d) => setDirectory(d.users ?? []));
  }, [showDirectory]);

  async function startDirect(userId: number) {
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowDirectory(false);
      router.push(`/chat/${data.conversation.id}`);
    }
  }

  const filtered = conversations.filter((c) =>
    (c.conversation.name ?? "Direct message").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className={cn("flex w-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:w-80", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] p-4">
        <h1 className="text-lg font-semibold text-[var(--text)]">Chats</h1>
        <button onClick={() => setShowDirectory(true)} className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700" aria-label="New conversation">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="focus-ring h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] pl-9 pr-3 text-sm"
          />
        </div>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-4">
        {filtered.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted">No conversations yet.</p>}
        {filtered.map(({ conversation, lastMessage, lastFileName, lastSenderName, unread }) => {
          const Icon = TYPE_ICON[conversation.type];
          return (
            <Link
              key={conversation.id}
              href={`/chat/${conversation.id}`}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-xl p-2.5 transition-colors",
                activeId === conversation.id ? "bg-brand-50 dark:bg-brand-900/30" : "hover:bg-[var(--surface-muted)]",
              )}
            >
              {conversation.type === "direct" ? (
                <Avatar name={conversation.name ?? "Direct message"} size={44} />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-800 text-white">
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{conversation.name ?? "Direct message"}</p>
                  {lastMessage && <span className="shrink-0 text-[11px] text-muted">{relativeTime(lastMessage.createdAt)}</span>}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-muted">
                    {lastMessage
                      ? `${lastSenderName ? `${lastSenderName}: ` : ""}${lastMessage.content ?? (lastFileName ? `📎 ${lastFileName}` : "Attachment")}`
                      : "No messages yet"}
                  </p>
                  {unread > 0 && <Badge tone="brand" className="shrink-0">{unread}</Badge>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showDirectory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="surface w-full max-w-sm rounded-2xl p-5 shadow-[var(--shadow-card-lg)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text)]">Start a conversation</p>
              <button onClick={() => setShowDirectory(false)} className="focus-ring rounded-lg p-1 text-muted hover:bg-[var(--surface-muted)]"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 max-h-80 space-y-1 overflow-y-auto">
              {directory.map((u) => (
                <button key={u.id} onClick={() => startDirect(u.id)} className="focus-ring flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-[var(--surface-muted)]">
                  <Avatar name={u.memberName ?? u.email} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text)]">{u.memberName ?? u.email}</p>
                    <p className="truncate text-xs text-muted">{u.department ?? u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
