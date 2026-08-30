import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, ListChecks, Users2, ArrowLeft } from "lucide-react";
import { getMemberBySlug } from "@/lib/services/members";
import { Card, Badge, Avatar, SectionHeading } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { TASK_STATUS_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function MemberProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMemberBySlug(slug);
  if (!data) notFound();
  const { member, teams, tasks, events } = data;

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const activeTasks = tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled" && t.status !== "rejected");

  return (
    <div>
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Link href="/members" className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-600">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to directory
          </Link>
          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <Avatar name={member.fullName} src={member.photoUrl} size={96} className="text-2xl" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{member.fullName}</h1>
              <p className="mt-1 text-brand-600">{member.position ?? "Council Member"}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="brand">{member.department}</Badge>
                <Badge tone="neutral">Year {member.year}</Badge>
                {member.committeeName && <Badge tone="neutral">{member.committeeName}</Badge>}
                {member.registerNumberVisible && member.registerNumber && (
                  <Badge tone="neutral">Reg. No: {member.registerNumber}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <SectionHeading title="About" className="mb-3" />
            <p className="text-sm leading-relaxed text-muted">{member.bio ?? "No bio has been added yet."}</p>
          </div>
          <div>
            <SectionHeading title="Responsibilities" className="mb-3" />
            <p className="text-sm leading-relaxed text-muted">
              {member.responsibilities ?? "Responsibilities have not been published for this member."}
            </p>
          </div>
          {member.skills && (
            <div>
              <SectionHeading title="Skills & Interests" className="mb-3" />
              <div className="flex flex-wrap gap-1.5">
                {member.skills.split(",").map((s) => (
                  <Badge key={s} tone="neutral">{s.trim()}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <SectionHeading title="Council Contributions" className="mb-3" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted">
                  <ListChecks className="h-4 w-4" />
                  <p className="text-xs font-medium uppercase tracking-wide">Active tasks</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{activeTasks.length}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted">
                  <ListChecks className="h-4 w-4" />
                  <p className="text-xs font-medium uppercase tracking-wide">Completed tasks</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{completedTasks.length}</p>
              </Card>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              <Users2 className="h-4 w-4" /> Council Team
            </p>
            <div className="mt-3 space-y-2">
              {teams.length === 0 && <p className="text-sm text-muted">Not assigned to a committee.</p>}
              {teams.map((t) => (
                <Link key={t.id} href={`/members?department=`} className="block rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:border-brand-300">
                  {t.name}
                </Link>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              <CalendarDays className="h-4 w-4" /> Events Participated
            </p>
            <div className="mt-3 space-y-2">
              {events.length === 0 && <p className="text-sm text-muted">No recorded event participation yet.</p>}
              {events.map((e) => (
                <div key={e.id} className="rounded-lg border border-[var(--border)] px-3 py-2">
                  <p className="text-sm font-medium text-[var(--text)]">{e.title}</p>
                  <p className="text-xs text-muted">{formatDate(e.date)}</p>
                </div>
              ))}
            </div>
          </Card>
          {activeTasks.length > 0 && (
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Currently working on</p>
              <div className="mt-3 space-y-2">
                {activeTasks.slice(0, 4).map((t) => (
                  <div key={t.id} className="rounded-lg border border-[var(--border)] px-3 py-2">
                    <p className="text-sm font-medium text-[var(--text)]">{t.title}</p>
                    <p className="text-xs text-muted">{TASK_STATUS_LABELS[t.status]}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
