"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Send, Users2, CalendarDays } from "lucide-react";
import { Card, Badge, Avatar } from "@/components/ui/primitives";
import { useToast } from "@/components/providers/toast-provider";
import { cn, formatDate, formatDateTime, relativeTime } from "@/lib/utils";
import { TASK_STATUS_LABELS, PRIORITY_LABELS, TASK_STATUSES } from "@/lib/constants";
import type { getTaskDetail } from "@/lib/services/tasks";

type TaskDetail = NonNullable<Awaited<ReturnType<typeof getTaskDetail>>>;

export function TaskWorkspace({
  detail,
  canManage,
}: {
  detail: TaskDetail;
  canManage: boolean;
  currentUserId: number;
}) {
  const [task, setTask] = useState(detail.task);
  const [checklist, setChecklist] = useState(detail.checklist);
  const [comments, setComments] = useState(detail.comments);
  const [updates, setUpdates] = useState(detail.updates);
  const [comment, setComment] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [updateProgress, setUpdateProgress] = useState(task.progress);
  const [posting, setPosting] = useState(false);
  const { push } = useToast();

  async function toggleItem(itemId: number, done: boolean) {
    setChecklist((prev) => prev.map((i) => (i.id === itemId ? { ...i, done } : i)));
    const res = await fetch(`/api/tasks/${task.id}/checklist`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, done }),
    });
    const data = await res.json();
    if (res.ok) setTask((prev) => ({ ...prev, progress: data.progress }));
  }

  async function changeStatus(status: string) {
    setTask((prev) => ({ ...prev, status: status as TaskDetail["task"]["status"] }));
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) push({ kind: "error", title: "Could not update status" });
  }

  async function postComment() {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, { comment: data.comment, authorEmail: null, authorRole: null, memberName: "You", memberPhoto: null }]);
        setComment("");
      }
    } finally {
      setPosting(false);
    }
  }

  async function postUpdate() {
    if (!updateText.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updateText, progress: updateProgress }),
      });
      const data = await res.json();
      if (res.ok) {
        setUpdates((prev) => [{ update: data.update, memberName: "You", memberPhoto: null }, ...prev]);
        setTask((prev) => ({ ...prev, progress: updateProgress }));
        setUpdateText("");
      }
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <Link href="/tasks" className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-600">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to tasks
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted">{task.code}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">{task.title}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone="brand">{PRIORITY_LABELS[task.priority]} priority</Badge>
            {task.deadline && <Badge tone="neutral">Due {formatDate(task.deadline)}</Badge>}
          </div>
        </div>
        {canManage ? (
          <select
            value={task.status}
            onChange={(e) => changeStatus(e.target.value)}
            className="focus-ring h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
            ))}
          </select>
        ) : (
          <Badge tone="neutral">{TASK_STATUS_LABELS[task.status]}</Badge>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <p className="text-sm font-semibold text-[var(--text)]">Overview</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{task.description || "No description provided."}</p>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--text)]">Progress</span>
                <span className="text-muted">{task.progress}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${task.progress}%` }} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-[var(--text)]">Checklist</p>
            <div className="mt-3 space-y-1.5">
              {checklist.length === 0 && <p className="text-sm text-muted">No checklist items yet.</p>}
              {checklist.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--surface-muted)]">
                  <span
                    onClick={(e) => { e.preventDefault(); toggleItem(item.id, !item.done); }}
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                      item.done ? "border-brand-600 bg-brand-600 text-white" : "border-[var(--border)]",
                    )}
                  >
                    {item.done && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className={cn("text-sm", item.done ? "text-muted line-through" : "text-[var(--text)]")}>{item.label}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-[var(--text)]">Post a progress update</p>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="e.g. Poster first draft completed."
              rows={3}
              className="focus-ring mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
            />
            <div className="mt-3 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={updateProgress}
                onChange={(e) => setUpdateProgress(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-10 text-right text-sm font-medium text-[var(--text)]">{updateProgress}%</span>
              <button onClick={postUpdate} disabled={posting} className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Post
              </button>
            </div>

            <div className="mt-5 space-y-3 border-t border-[var(--border)] pt-4">
              {updates.length === 0 && <p className="text-sm text-muted">No updates posted yet.</p>}
              {updates.map((u) => (
                <div key={u.update.id} className="flex gap-3">
                  <Avatar name={u.memberName ?? "Member"} src={u.memberPhoto} size={32} />
                  <div className="min-w-0 flex-1 rounded-lg bg-[var(--surface-muted)] p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[var(--text)]">{u.memberName ?? "Council Member"}</p>
                      <p className="text-[11px] text-muted">{relativeTime(u.update.createdAt)}</p>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text)]">{u.update.content}</p>
                    {u.update.progress !== null && <p className="mt-1 text-xs text-brand-600">Progress set to {u.update.progress}%</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-[var(--text)]">Comments</p>
            <div className="mt-3 space-y-3">
              {comments.length === 0 && <p className="text-sm text-muted">Be the first to comment on this task.</p>}
              {comments.map((c) => (
                <div key={c.comment.id} className="flex gap-3">
                  <Avatar name={c.memberName ?? c.authorEmail ?? "Member"} src={c.memberPhoto} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[var(--text)]">{c.memberName ?? c.authorEmail}</p>
                      <p className="text-[11px] text-muted">{relativeTime(c.comment.createdAt)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-[var(--text)]">{c.comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && postComment()}
                placeholder="Write a comment…"
                className="focus-ring h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
              />
              <button onClick={postComment} disabled={posting} className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              <Users2 className="h-4 w-4" /> Team
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--text)]">{detail.team?.name ?? "Unassigned"}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Members</p>
            <div className="mt-3 space-y-2">
              {detail.assignees.length === 0 && <p className="text-sm text-muted">No members assigned.</p>}
              {detail.assignees.map((m) => (
                <Link key={m.id} href={`/members/${m.slug}`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--surface-muted)]">
                  <Avatar name={m.fullName} src={m.photoUrl} size={30} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text)]">{m.fullName}</p>
                    <p className="text-xs text-muted">{m.department}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              <CalendarDays className="h-4 w-4" /> Timeline
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Created by</dt><dd className="font-medium text-[var(--text)]">{detail.creatorName}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Start</dt><dd>{formatDate(task.startDate)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Deadline</dt><dd>{formatDate(task.deadline)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Updated</dt><dd>{formatDateTime(task.updatedAt)}</dd></div>
            </dl>
          </Card>
          {detail.conversationId && (
            <Link href={`/chat/${detail.conversationId}`} className="focus-ring block rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-sm font-medium text-brand-600 hover:bg-[var(--surface-muted)]">
              Open task discussion →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
