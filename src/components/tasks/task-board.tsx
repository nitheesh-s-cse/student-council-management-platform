"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, List as ListIcon, X, Loader2 } from "lucide-react";
import { Button, Badge, Card, EmptyState } from "@/components/ui/primitives";
import { useToast } from "@/components/providers/toast-provider";
import { cn, formatDate } from "@/lib/utils";
import { KANBAN_COLUMNS, TASK_STATUS_LABELS, PRIORITY_LABELS, TASK_PRIORITIES } from "@/lib/constants";
import type { tasks as tasksTable } from "@/db/schema";

type Task = typeof tasksTable.$inferSelect;

const PRIORITY_TONE: Record<string, "neutral" | "danger" | "warning"> = {
  low: "neutral",
  medium: "neutral",
  high: "warning",
  urgent: "danger",
};

export function TaskBoard({
  initialTasks,
  canCreate,
  teams,
  members,
}: {
  initialTasks: Task[];
  canCreate: boolean;
  teams: { id: number; name: string }[];
  members: { id: number; fullName: string; department: string }[];
  currentUserId: number;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { push } = useToast();

  const grouped = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const col of KANBAN_COLUMNS) map[col] = [];
    for (const t of tasks) {
      if (map[t.status]) map[t.status].push(t);
    }
    return map;
  }, [tasks]);

  async function moveTask(taskId: number, status: string) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: status as Task["status"] } : t)));
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      push({ kind: "error", title: "Could not update task", description: "Please try again." });
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Tasks</h1>
          <p className="mt-1 text-sm text-muted">Track everything the council is working on right now.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[var(--border)] p-0.5">
            <button
              onClick={() => setView("kanban")}
              className={cn("focus-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium", view === "kanban" ? "bg-brand-600 text-white" : "text-muted")}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Board
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("focus-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium", view === "list" ? "bg-brand-600 text-white" : "text-muted")}
            >
              <ListIcon className="h-3.5 w-3.5" /> List
            </button>
          </div>
          {canCreate && (
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> New Task
            </Button>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No tasks yet" description={canCreate ? "Create the first task to get your team moving." : "You have no tasks assigned right now."} />
        </div>
      ) : view === "kanban" ? (
        <div className="mt-8 grid grid-cols-1 gap-4 overflow-x-auto pb-4 sm:grid-cols-2 lg:grid-cols-5">
          {KANBAN_COLUMNS.map((col) => (
            <div
              key={col}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = Number(e.dataTransfer.getData("text/task-id"));
                if (id) moveTask(id, col);
              }}
              className="min-w-[240px] rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{TASK_STATUS_LABELS[col]}</p>
                <span className="text-xs text-muted">{grouped[col]?.length ?? 0}</span>
              </div>
              <div className="space-y-2.5">
                {(grouped[col] ?? []).map((t) => (
                  <div
                    key={t.id}
                    draggable={canCreate}
                    onDragStart={(e) => e.dataTransfer.setData("text/task-id", String(t.id))}
                  >
                    <Link href={`/tasks/${t.id}`}>
                      <Card className="cursor-pointer p-3.5 transition-shadow hover:shadow-[var(--shadow-card-lg)]">
                        <p className="text-xs font-medium text-muted">{t.code}</p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-[var(--text)]">{t.title}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <Badge tone={PRIORITY_TONE[t.priority]}>{PRIORITY_LABELS[t.priority]}</Badge>
                          {t.deadline && <span className="text-[11px] text-muted">{formatDate(t.deadline)}</span>}
                        </div>
                        {t.progress > 0 && (
                          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                            <div className="h-full rounded-full bg-brand-500" style={{ width: `${t.progress}%` }} />
                          </div>
                        )}
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-2.5">
          {tasks.map((t) => (
            <Link key={t.id} href={`/tasks/${t.id}`}>
              <Card className="flex flex-wrap items-center justify-between gap-3 p-4 transition-shadow hover:shadow-[var(--shadow-card-lg)]">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted">{t.code}</p>
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{t.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">{TASK_STATUS_LABELS[t.status]}</Badge>
                  <Badge tone={PRIORITY_TONE[t.priority]}>{PRIORITY_LABELS[t.priority]}</Badge>
                  {t.deadline && <span className="text-xs text-muted">Due {formatDate(t.deadline)}</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {modalOpen && (
        <CreateTaskModal
          teams={teams}
          members={members}
          onClose={() => setModalOpen(false)}
          onCreated={(task) => {
            setTasks((prev) => [task, ...prev]);
            setModalOpen(false);
            push({ kind: "success", title: "Task created", description: task.title });
          }}
        />
      )}
    </div>
  );
}

function CreateTaskModal({
  teams,
  members,
  onClose,
  onCreated,
}: {
  teams: { id: number; name: string }[];
  members: { id: number; fullName: string; department: string }[];
  onClose: () => void;
  onCreated: (task: Task) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState<string>("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          teamId: teamId ? Number(teamId) : null,
          memberIds: selectedMembers,
          priority,
          deadline: deadline || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create task.");
        return;
      }
      onCreated(data.task);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text)]">Create task</h2>
          <button onClick={onClose} className="focus-ring rounded-lg p-1 text-muted hover:bg-[var(--surface-muted)]" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Prepare Tech Fest poster"
              className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="focus-ring mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted">Team</label>
              <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-sm">
                <option value="">No team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-sm">
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Assign to members</label>
            <div className="mt-1.5 max-h-36 space-y-1 overflow-y-auto rounded-lg border border-[var(--border)] p-2">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[var(--surface-muted)]">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(m.id)}
                    onChange={(e) => {
                      setSelectedMembers((prev) => (e.target.checked ? [...prev, m.id] : prev.filter((id) => id !== m.id)));
                    }}
                  />
                  {m.fullName} <span className="text-xs text-muted">· {m.department}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create task
          </Button>
        </form>
      </Card>
    </div>
  );
}
