import { getAdminOverview } from "@/lib/services/admin-stats";
import { Card, Badge } from "@/components/ui/primitives";
import { TASK_STATUS_LABELS } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";
import { Users2, ListChecks, CheckCircle2, AlertTriangle, CalendarDays, Vote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminOverview();
  const completionPct = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  const cards = [
    { label: "Total Members", value: stats.totalMembers, icon: Users2 },
    { label: "Active Members", value: stats.activeMembers, icon: Users2 },
    { label: "Council Teams", value: stats.teamCount, icon: Users2 },
    { label: "Active Tasks", value: stats.totalTasks - stats.completedTasks, icon: ListChecks },
    { label: "Completed Tasks", value: stats.completedTasks, icon: CheckCircle2 },
    { label: "Overdue Tasks", value: stats.overdueTasks, icon: AlertTriangle },
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: CalendarDays },
    { label: "Total Polls", value: stats.totalPolls, icon: Vote },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Council Overview</h1>
      <p className="mt-1 text-sm text-muted">Real-time snapshot of council operations.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center gap-2 text-muted">
              <c.icon className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">{c.label}</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{c.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm font-semibold text-[var(--text)]">Task Completion</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--surface-muted)" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="16" fill="none" stroke="var(--color-brand-500)" strokeWidth="4"
                  strokeDasharray={`${completionPct} 100`} strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-[var(--text)]">{completionPct}%</span>
            </div>
            <div className="flex-1 space-y-2">
              {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
                stats.statusCounts[key] ? (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-muted">{label}</span>
                    <span className="font-medium text-[var(--text)]">{stats.statusCounts[key]}</span>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-[var(--text)]">Team Performance</p>
          <div className="mt-4 space-y-3.5">
            {stats.teamPerformance.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--text)]">{t.name}</span>
                  <span className="text-muted">{t.completed}/{t.total} · {t.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <p className="text-sm font-semibold text-[var(--text)]">Recent Activity</p>
        <div className="mt-4 space-y-2">
          {stats.recentAudit.length === 0 && <p className="text-sm text-muted">No administrative activity recorded yet.</p>}
          {stats.recentAudit.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge tone="neutral">{a.action.replace(/_/g, " ")}</Badge>
                <span className="text-muted">{a.objectType} #{a.objectId}</span>
              </div>
              <span className="text-xs text-muted">{relativeTime(a.createdAt)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
