import { notFound } from "next/navigation";
import Link from "next/link";
import { getTeamBySlug } from "@/lib/services/teams";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui/primitives";
import { TASK_STATUS_LABELS } from "@/lib/constants";
import { ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getTeamBySlug(slug);
  if (!data) notFound();
  const { team, members, tasks } = data;

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{team.name}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">{team.description}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text)]">Team progress</p>
              <span className="text-xs text-muted">{completed}/{tasks.length} tasks completed</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
            </div>
          </Card>

          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><ListChecks className="h-4 w-4" /> Team Tasks</p>
            {tasks.length === 0 ? (
              <EmptyState title="No tasks yet" description="Tasks assigned to this team will show up here." />
            ) : (
              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <Link key={t.id} href={`/tasks/${t.id}`}>
                    <Card className="flex items-center justify-between p-4 hover:shadow-[var(--shadow-card-lg)]">
                      <div>
                        <p className="text-xs text-muted">{t.code}</p>
                        <p className="text-sm font-medium text-[var(--text)]">{t.title}</p>
                      </div>
                      <Badge tone="neutral">{TASK_STATUS_LABELS[t.status]}</Badge>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <Card className="h-fit p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Team Members</p>
          <div className="mt-3 space-y-2">
            {members.map(({ member, roleInTeam }) => (
              <Link key={member.id} href={`/members/${member.slug}`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--surface-muted)]">
                <Avatar name={member.fullName} src={member.photoUrl} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text)]">{member.fullName}</p>
                  <p className="text-xs text-muted">{member.department}</p>
                </div>
                {roleInTeam === "lead" && <Badge tone="brand">Lead</Badge>}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
