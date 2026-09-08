"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Card, Badge, EmptyState, Button } from "@/components/ui/primitives";
import { relativeTime } from "@/lib/utils";
import type { notifications as notificationsTable } from "@/db/schema";

type Notification = typeof notificationsTable.$inferSelect;

export function NotificationsList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [items, setItems] = useState(initialNotifications);

  async function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await fetch("/api/notifications", { method: "PATCH" });
  }

  async function markRead(id: number) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
  }

  const unreadCount = items.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Notifications</h1>
          <p className="mt-1 text-sm text-muted">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="shrink-0 self-start sm:self-auto"><CheckCheck className="h-4 w-4" /> Mark all read</Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8"><EmptyState icon={<Bell className="h-6 w-6" />} title="No notifications yet" description="We'll let you know when something needs your attention." /></div>
      ) : (
        <div className="mt-8 space-y-2">
          {items.map((n) => {
            const content = (
              <Card className={`flex flex-col sm:flex-row sm:items-start gap-3 p-3.5 sm:p-4 transition-colors ${!n.isRead ? "border-brand-200 bg-brand-50/40 dark:bg-brand-900/10" : ""}`}>
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text)]">{n.title}</p>
                    {n.body && <p className="mt-0.5 text-sm text-muted">{n.body}</p>}
                    <p className="mt-1 text-xs text-muted">{relativeTime(n.createdAt)}</p>
                  </div>
                </div>
                <Badge tone="neutral" className="shrink-0 self-start sm:self-auto">{n.type.replace(/_/g, " ")}</Badge>
              </Card>
            );
            return n.link ? (
              <Link key={n.id} href={n.link} onClick={() => markRead(n.id)}>{content}</Link>
            ) : (
              <div key={n.id} onClick={() => markRead(n.id)}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
