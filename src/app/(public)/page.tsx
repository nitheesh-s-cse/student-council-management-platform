import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, ListChecks, MessagesSquare, CalendarDays, ShieldCheck, Vote } from "lucide-react";
import { db } from "@/db";
import { members, teams, announcements, events } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { LinkButton, Card, Badge, SectionHeading, Avatar } from "@/components/ui/primitives";
import { ACADEMIC_YEAR } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [memberCount, teamCount, board, latestAnnouncements, upcomingEvents] = await Promise.all([
    db.$count(members, eq(members.isActive, true)),
    db.$count(teams),
    db.select().from(members).where(eq(members.category, "board")).orderBy(members.id),
    db
      .select()
      .from(announcements)
      .where(eq(announcements.audience, "everyone"))
      .orderBy(desc(announcements.publishAt))
      .limit(3),
    db
      .select()
      .from(events)
      .where(and(eq(events.isPublic, true), gte(events.date, new Date())))
      .orderBy(events.date)
      .limit(3),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/hero-pattern.jpg" alt="" fill priority className="object-cover opacity-[0.14] dark:opacity-[0.22]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg)]/60 to-[var(--bg)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <Badge tone="brand" className="mb-6">Academic Year {ACADEMIC_YEAR}</Badge>
          <h1 className="max-w-3xl text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.05] tracking-tight text-[var(--text)]">
            PPG Institute of Technology
            <span className="mt-2 block text-brand-600">Student Council</span>
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
            The elected student body that represents every department at PPGIT — running events, resolving
            student concerns and coordinating campus life. This is our operating system: one place to manage
            council teams, tasks, communication and records.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/about" size="lg">
              Explore Council <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/members" variant="outline" size="lg">
              Member Directory
            </LinkButton>
          </div>

          <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-[var(--border)] pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Members</dt>
              <dd className="mt-1 text-2xl font-semibold text-[var(--text)]">{memberCount}+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Council Teams</dt>
              <dd className="mt-1 text-2xl font-semibold text-[var(--text)]">{teamCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Departments</dt>
              <dd className="mt-1 text-2xl font-semibold text-[var(--text)]">10</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* What the platform does */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="One council, one platform"
          title="Everything the council runs on, in a single workspace"
          description="From task assignment to team chat, event planning to internal polls — the platform mirrors exactly how the council already works, just faster and more organized."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ListChecks, title: "Task Management", desc: "Assign work to teams or individuals, track progress and review submissions before sign-off." },
            { icon: MessagesSquare, title: "Council Chat", desc: "Direct messages, team channels and a dedicated thread for every task and event." },
            { icon: Users, title: "Teams & Roles", desc: "Nine standing committees, clear leads and role-based access for every member." },
            { icon: CalendarDays, title: "Events & Meetings", desc: "Plan council events end-to-end with agendas, attendance and shared documents." },
            { icon: Vote, title: "Polls & Decisions", desc: "Run quick single-choice, multi-choice or anonymous polls for council decisions." },
            { icon: ShieldCheck, title: "Secure by Design", desc: "Role-based permissions, audit trails and admin-only visibility for sensitive records." },
          ].map((f) => (
            <Card key={f.title} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[15px] font-semibold text-[var(--text)]">{f.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Leadership preview */}
      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Council leadership" title="Meet the board" />
            <LinkButton href="/members" variant="outline" size="sm">View all members</LinkButton>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((m) => (
              <Link key={m.id} href={`/members/${m.slug}`}>
                <Card className="flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-lg)]">
                  <Avatar name={m.fullName} src={m.photoUrl} size={52} />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-[var(--text)]">{m.fullName}</p>
                    <p className="text-sm text-brand-600">{m.position}</p>
                    <p className="text-xs text-muted">{m.department} · Year {m.year}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements + events */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Stay informed" title="Latest announcements" />
            <div className="mt-6 space-y-4">
              {latestAnnouncements.length === 0 && (
                <p className="text-sm text-muted">No public announcements yet. Check back soon.</p>
              )}
              {latestAnnouncements.map((a) => (
                <Card key={a.id} className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[15px] font-semibold text-[var(--text)]">{a.title}</p>
                    {a.priority !== "normal" && (
                      <Badge tone={a.priority === "urgent" ? "danger" : "warning"}>{a.priority}</Badge>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">{a.content}</p>
                  <p className="mt-3 text-xs text-muted">{formatDate(a.publishAt)}</p>
                </Card>
              ))}
            </div>
            <LinkButton href="/announcements" variant="ghost" size="sm" className="mt-4">
              View all announcements <ArrowRight className="h-3.5 w-3.5" />
            </LinkButton>
          </div>
          <div>
            <SectionHeading eyebrow="What's coming up" title="Upcoming events" />
            <div className="mt-6 space-y-4">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted">No upcoming public events scheduled right now.</p>
              )}
              {upcomingEvents.map((e) => (
                <Card key={e.id} className="flex gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
                    <span className="text-[10px] font-semibold uppercase">{new Date(e.date).toLocaleString("en-IN", { month: "short" })}</span>
                    <span className="text-base font-bold leading-none">{new Date(e.date).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-[var(--text)]">{e.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted">{e.description}</p>
                    {e.venue && <p className="mt-1 text-xs text-muted">{e.venue}</p>}
                  </div>
                </Card>
              ))}
            </div>
            <LinkButton href="/events" variant="ghost" size="sm" className="mt-4">
              View full calendar <ArrowRight className="h-3.5 w-3.5" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Card className="flex flex-col items-start gap-6 overflow-hidden p-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-[var(--text)]">Already a council member?</p>
            <p className="mt-1 text-sm text-muted">Sign in to see your tasks, chats and team dashboard.</p>
          </div>
          <LinkButton href="/login" size="lg">Member Sign In</LinkButton>
        </Card>
      </section>
    </div>
  );
}
