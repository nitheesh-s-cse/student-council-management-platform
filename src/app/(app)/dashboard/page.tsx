import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { tasks, teamMembers, teams, events, announcements, notifications, taskAssignees, members } from "@/db/schema";
import { and, desc, eq, gte, inArray, ne } from "drizzle-orm";
import { Card, Badge, EmptyState, LinkButton } from "@/components/ui/primitives";
import { formatDate, relativeTime } from "@/lib/utils";
import { PRIORITY_LABELS, TASK_STATUS_LABELS, roleAtLeast } from "@/lib/constants";
import { ListChecks, CalendarDays, MessagesSquare, Megaphone, ArrowRight, Users2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let myTasks: (typeof tasks.$inferSelect)[] = [];
  let myTeams: { id: number; name: string; slug: string }[] = [];

  if (user.memberId) {
    const taskIdRows = await db.select({ taskId: taskAssignees.taskId }).from(taskAssignees).where(eq(taskAssignees.memberId, user.memberId));
    const ids = taskIdRows.map((r) => r.taskId);
    if (ids.length > 0) {
      myTasks = await db.select().from(tasks).where(and(inArray(tasks.id, ids), ne(tasks.status, "completed"))).orderBy(tasks.deadline);
    }
    const teamRows = await db
      .select({ id: teams.id, name: teams.name, slug: teams.slug })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.memberId, user.memberId));
    myTeams = teamRows;
  }

  const [upcomingEvents, recentAnnouncements, recentNotifications] = await Promise.all([
    db.select().from(events).where(gte(events.date, new Date())).orderBy(events.date).limit(4),
    db.select().from(announcements).orderBy(desc(announcements.publishAt)).limit(3),
    db.select().from(notifications).where(eq(notifications.userId, user.id)).orderBy(desc(notifications.createdAt)).limit(5),
  ]);

  const isBoardOrAbove = roleAtLeast(user.role, "board");

  let teamOverview: { teamId: number; name: string; total: number; completed: number }[] = [];
  if (isBoardOrAbove) {
    const allTeams = await db.select().from(teams);
    const allTasks = await db.select().from(tasks);
    teamOverview = allTeams.map((t) => {
      const teamTasks = allTasks.filter((task) => task.teamId === t.id);
      return {
        teamId: t.id,
        name: t.name,
        total: teamTasks.length,
        completed: teamTasks.filter((task) => task.status === "completed").length,
      };
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">
            Welcome back{user.memberName ? `, ${user.memberName.split(" ")[0]}` : ""}
          </h1>
        </div>
        <div className="flex gap-2">
          <LinkButton href="/tasks" variant="outline" size="sm">My Tasks</LinkButton>
          <LinkButton href="/chat" size="sm">Open Chat</LinkButton>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-4.5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] min-w-0 flex-1">
                <ListChecks className="h-4 w-4 shrink-0 text-brand-600" /> My Active Tasks
              </p>
              <Link href="/tasks" className="shrink-0 text-xs font-medium text-brand-600 hover:underline">View all</Link>
            </div>
            {myTasks.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No active tasks" description="Your team has completed everything. Great work!" />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {myTasks.slice(0, 5).map((t) => (
                  <Link key={t.id} href={`/tasks/${t.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-[var(--border)] p-3 transition-colors hover:border-brand-300">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--text)]">{t.title}</p>
                      <p className="text-xs text-muted">{t.code} · {TASK_STATUS_LABELS[t.status]}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge tone={t.priority === "urgent" || t.priority === "high" ? "danger" : "neutral"}>{PRIORITY_LABELS[t.priority]}</Badge>
                      {t.deadline && <span className="text-xs text-muted">Due {formatDate(t.deadline)}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {isBoardOrAbove && (
            <Card className="p-4.5 sm:p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <Users2 className="h-4 w-4 shrink-0 text-brand-600" /> Team Performance
              </p>
              <div className="mt-4 space-y-4">
                {teamOverview.map((t) => {
                  const pct = t.total === 0 ? 0 : Math.round((t.completed / t.total) * 100);
                  return (
                    <div key={t.teamId}>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-[var(--text)] truncate">{t.name}</span>
                        <span className="shrink-0 text-muted">{t.completed}/{t.total} tasks · {pct}%</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="p-4.5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] min-w-0 flex-1">
                <Megaphone className="h-4 w-4 shrink-0 text-brand-600" /> Recent Announcements
              </p>
              <Link href="/announcements" className="shrink-0 text-xs font-medium text-brand-600 hover:underline">View all</Link>
            </div>
            {recentAnnouncements.length === 0 ? (
              <div className="mt-4"><EmptyState title="No announcements" description="Council updates will appear here." /></div>
            ) : (
              <div className="mt-4 space-y-3">
                {recentAnnouncements.map((a) => (
                  <div key={a.id} className="rounded-lg border border-[var(--border)] p-3">
                    <p className="text-sm font-medium text-[var(--text)]">{a.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{a.content}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
              <Users2 className="h-4 w-4 text-brand-600" /> My Teams
            </p>
            <div className="mt-3 space-y-2">
              {myTeams.length === 0 && <p className="text-sm text-muted">Not assigned to a committee yet.</p>}
              {myTeams.map((t) => (
                <Link key={t.id} href={`/teams/${t.slug}`} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:border-brand-300">
                  {t.name} <ArrowRight className="h-3.5 w-3.5 text-muted" />
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
              <CalendarDays className="h-4 w-4 text-brand-600" /> Upcoming Events
            </p>
            <div className="mt-3 space-y-2">
              {upcomingEvents.length === 0 && <p className="text-sm text-muted">No upcoming events scheduled.</p>}
              {upcomingEvents.map((e) => (
                <div key={e.id} className="rounded-lg border border-[var(--border)] px-3 py-2">
                  <p className="text-sm font-medium text-[var(--text)]">{e.title}</p>
                  <p className="text-xs text-muted">{formatDate(e.date)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <MessagesSquare className="h-4 w-4 text-brand-600" /> Notifications
              </p>
              <Link href="/notifications" className="text-xs font-medium text-brand-600 hover:underline">View all</Link>
            </div>
            <div className="mt-3 space-y-2">
              {recentNotifications.length === 0 && <p className="text-sm text-muted">You're all caught up.</p>}
              {recentNotifications.map((n) => (
                <div key={n.id} className="rounded-lg border border-[var(--border)] px-3 py-2">
                  <p className="text-sm font-medium text-[var(--text)]">{n.title}</p>
                  <p className="text-xs text-muted">{relativeTime(n.createdAt)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
