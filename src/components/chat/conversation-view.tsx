"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCheck, ArrowLeft, SmilePlus, Paperclip, Trash2, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/primitives";
import { cn, relativeTime } from "@/lib/utils";
import type { getConversationMessages } from "@/lib/services/chat";
import type { conversations as conversationsTable } from "@/db/schema";

type MessageRow = Awaited<ReturnType<typeof getConversationMessages>>[number];
type Conversation = typeof conversationsTable.$inferSelect;

const QUICK_EMOJI = ["👍", "❤️", "😂", "🎉", "👏"];

export function ConversationView({
  conversationId,
  conversationMeta,
  initialMessages,
  currentUserId,
}: {
  conversationId: number;
  conversationMeta: Conversation | null;
  initialMessages: MessageRow[];
  currentUserId: number;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState<{ userId: number; name: string }[]>([]);
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastTypingSent = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [conversationId, initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    fetch(`/api/chat/conversations/${conversationId}/read`, { method: "POST" });
  }, [conversationId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [msgRes, typingRes] = await Promise.all([
          fetch(`/api/chat/conversations/${conversationId}/messages`),
          fetch(`/api/chat/conversations/${conversationId}/typing`),
        ]);
        if (msgRes.ok) {
          const data = await msgRes.json();
          setMessages(data.messages);
        }
        if (typingRes.ok) {
          const data = await typingRes.json();
          setTypingUsers(data.typing);
        }
      } catch {
        // Polling is best-effort; ignore transient network errors.
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  function notifyTyping() {
    const now = Date.now();
    if (now - lastTypingSent.current < 2000) return;
    lastTypingSent.current = now;
    fetch(`/api/chat/conversations/${conversationId}/typing`, { method: "POST" });
  }

  async function refreshMessages() {
    const msgRes = await fetch(`/api/chat/conversations/${conversationId}/messages`);
    if (msgRes.ok) {
      const data = await msgRes.json();
      setMessages(data.messages);
    }
  }

  async function send() {
    const content = text.trim();
    if (!content) return;
    setText("");
    const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) await refreshMessages();
  }

  async function sendWithFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/files", { method: "POST", body: fd });
      const upData = await up.json();
      if (!up.ok) {
        alert(upData.error ?? "File upload failed.");
        return;
      }
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: upData.id }),
      });
      if (res.ok) await refreshMessages();
    } catch {
      alert("Could not upload the file. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function deleteForEveryone(messageId: number) {
    if (!window.confirm("Delete this message for everyone? This cannot be undone.")) return;
    const res = await fetch(`/api/chat/messages/${messageId}`, { method: "DELETE" });
    if (res.ok) await refreshMessages();
  }

  async function react(messageId: number, emoji: string) {
    await fetch(`/api/chat/messages/${messageId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    await refreshMessages();
    setPickerFor(null);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[var(--bg)]">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4">
        <Link href="/chat" className="focus-ring md:hidden"><ArrowLeft className="h-4 w-4 text-muted" /></Link>
        <Avatar name={conversationMeta?.name ?? "Chat"} size={36} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text)]">{conversationMeta?.name ?? "Direct message"}</p>
          <p className="text-xs text-muted">
            {typingUsers.length > 0 ? `${typingUsers.map((t) => t.name).join(", ")} typing…` : "Council workspace"}
          </p>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted">No messages yet. Say hello to get the conversation going.</p>
        )}
        {messages.map((m) => {
          const mine = m.message.senderUserId === currentUserId;
          const senderName = m.senderMemberName ?? m.senderEmail ?? "Council Member";
          return (
            <motion.div
              key={m.message.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={cn("group flex items-end gap-2", mine ? "justify-end" : "justify-start")}
            >
              {!mine && <Avatar name={senderName} src={m.senderPhoto} size={28} />}
              <div className="max-w-[75%] sm:max-w-[60%]">
                {!mine && <p className="mb-0.5 ml-1 text-[11px] font-medium text-muted">{senderName}</p>}
                <div className="relative">
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                      mine ? "rounded-br-md bg-brand-600 text-white" : "rounded-bl-md surface text-[var(--text)]",
                    )}
                  >
                    {m.message.deletedAt ? (
                      <span className="italic opacity-70">Message deleted</span>
                    ) : (
                      <div className="break-words">
                        {m.file && (
                          <a
                            href={`/api/files/${m.file.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              "mb-1.5 flex max-w-[240px] items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors",
                              mine
                                ? "border-white/30 bg-white/10 hover:bg-white/20"
                                : "border-[var(--border)] bg-[var(--surface-muted)] hover:bg-brand-500/10",
                            )}
                          >
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="min-w-0">
                              <span className="block truncate font-medium">{m.file.originalName}</span>
                              <span className="block opacity-70">
                                {m.file.size > 1024 * 1024
                                  ? `${(m.file.size / 1024 / 1024).toFixed(1)} MB`
                                  : `${Math.max(1, Math.round(m.file.size / 1024))} KB`}
                              </span>
                            </span>
                          </a>
                        )}
                        {m.message.content}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setPickerFor(pickerFor === m.message.id ? null : m.message.id)}
                    className={cn(
                      "focus-ring absolute -top-3 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100",
                      mine ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
                    )}
                    aria-label="Add reaction"
                  >
                    <SmilePlus className="h-3 w-3 text-muted" />
                  </button>
                  {mine && (
                    <button
                      onClick={() => deleteForEveryone(m.message.id)}
                      className="focus-ring absolute -top-3 right-0 translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                      aria-label="Delete for everyone"
                      title="Delete for everyone"
                    >
                      <Trash2 className="h-3 w-3 text-rose-400" />
                    </button>
                  )}
                  {pickerFor === m.message.id && (
                    <div className="absolute -top-10 z-10 flex gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow-card-lg)]">
                      {QUICK_EMOJI.map((e) => (
                        <button key={e} onClick={() => react(m.message.id, e)} className="focus-ring rounded-full p-1 text-sm hover:bg-[var(--surface-muted)]">{e}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div className={cn("mt-1 flex items-center gap-1 text-[10px] text-muted", mine ? "justify-end" : "justify-start")}>
                  <span>{relativeTime(m.message.createdAt)}</span>
                  {mine && <CheckCheck className="h-3 w-3 text-brand-400" />}
                </div>
                {m.reactions.length > 0 && (
                  <div className={cn("mt-1 flex flex-wrap gap-1", mine ? "justify-end" : "justify-start")}>
                    {Object.entries(
                      m.reactions.reduce<Record<string, number>>((acc, r) => {
                        acc[r.emoji] = (acc[r.emoji] ?? 0) + 1;
                        return acc;
                      }, {}),
                    ).map(([emoji, count]) => (
                      <span key={emoji} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[11px]">
                        {emoji} {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-[var(--surface-muted)] disabled:opacity-50"
            aria-label="Attach a file"
            title="Upload a PDF, image or document"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) sendWithFile(f);
              e.target.value = "";
            }}
          />
          <input
            value={text}
            onChange={(e) => { setText(e.target.value); notifyTyping(); }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="Type a message…"
            className="focus-ring h-11 flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm"
          />
          <button onClick={send} className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700" aria-label="Send message">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
