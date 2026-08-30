import Link from "next/link";
import { ArrowRight, Users, ListChecks, MessagesSquare, CalendarDays, ShieldCheck, Vote, Sparkles } from "lucide-react";
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
    <div className="relative overflow-hidden">
      {/* Background Ambient Spotlights */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-[40%] right-0 -z-10 h-[500px] w-[500px] rounded-full bg-yellow-600/5 blur-[140px]" />

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <Badge tone="brand" className="mb-6 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Academic Term {ACADEMIC_YEAR}
            </Badge>

            <h1 className="max-w-4xl font-serif text-[clamp(2.5rem,6vw,4.75rem)] font-normal leading-[1.08] tracking-tight">
              PPG Institute of Technology <br />
              <span className="gold-gradient-text font-serif italic">Student Council</span>
            </h1>

            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted font-normal">
              The premier executive student body representing PPGIT — orchestrating campus innovation, 
              task delivery, inter-departmental governance, and student leadership in one unified digital platform.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <LinkButton href="/about" size="lg">
                Explore Council <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/members" variant="outline" size="lg">
                Member Directory
              </LinkButton>
            </div>

            {/* Stats bar */}
            <div className="mt-20 grid w-full max-w-4xl grid-cols-3 gap-6 rounded-3xl border border-amber-500/20 bg-[#12141e]/80 backdrop-blur-2xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              <div className="border-r border-amber-500/15 pr-4 text-center">
                <p className="font-serif gold-gradient-text text-3xl sm:text-4xl font-normal">{memberCount}+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">Elected Members</p>
              </div>
              <div className="border-r border-amber-500/15 pr-4 text-center">
                <p className="font-serif gold-gradient-text text-3xl sm:text-4xl font-normal">{teamCount}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">Active Committees</p>
              </div>
              <div className="text-center">
                <p className="font-serif gold-gradient-text text-3xl sm:text-4xl font-normal">10</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">Departments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Integrated Governance"
          title="Designed for Executive Efficiency"
          description="From task execution to real-time committee communications and campus decisions — engineered for maximum precision."
          className="text-center mx-auto"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ListChecks, title: "Task & Project Hub", desc: "Assign deliverables to committee members, track Kanban milestones and review sign-offs." },
            { icon: MessagesSquare, title: "Real-Time Council Chat", desc: "Encrypted direct messaging, standing team rooms and dedicated discussion threads for every initiative." },
            { icon: Users, title: "Committee Governance", desc: "Nine specialized committees with clear team leads and role-based operational permissions." },
            { icon: CalendarDays, title: "Events & Agenda Planner", desc: "Plan flagship campus fests and board meetings end-to-end with verified documentation." },
            { icon: Vote, title: "Polling & Voting Engine", desc: "Execute single-choice, multiple-choice, or anonymous voting for official council resolutions." },
            { icon: ShieldCheck, title: "Enterprise Grade Security", desc: "Multi-level authorization, audit logging and secure record keeping for council operations." },
          ].map((f) => (
            <Card key={f.title} className="group p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </div>
              <p className="mt-6 font-serif text-lg text-amber-100">{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Board Leadership */}
      <section className="border-y border-amber-500/15 bg-[#0e1017]/70 py-24 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Council Executive Board" title="Distinguished Leadership" />
            <LinkButton href="/members" variant="outline" size="sm">View Full Directory</LinkButton>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((m) => (
              <Link key={m.id} href={`/members/${m.slug}`}>
                <Card className="group flex items-center gap-5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_15px_35px_rgba(212,175,55,0.12)]">
                  <Avatar name={m.fullName} src={m.photoUrl} size={60} />
                  <div className="min-w-0">
                    <p className="truncate font-serif text-base text-amber-100 group-hover:text-amber-300 transition-colors">{m.fullName}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider gold-gradient-text mt-0.5">{m.position}</p>
                    <p className="mt-1 text-xs text-muted">{m.department} · Year {m.year}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements + Events */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Announcements */}
          <div>
            <SectionHeading eyebrow="Official Bulletins" title="Latest Announcements" />
            <div className="mt-8 space-y-4">
              {latestAnnouncements.length === 0 && (
                <p className="text-sm text-muted">No public announcements posted yet.</p>
              )}
              {latestAnnouncements.map((a) => (
                <Card key={a.id} className="p-6 transition-all hover:border-amber-500/30">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif text-base text-amber-100">{a.title}</p>
                    {a.priority !== "normal" && (
                      <Badge tone={a.priority === "urgent" ? "danger" : "warning"}>{a.priority}</Badge>
                    )}
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-sm text-muted leading-relaxed">{a.content}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-amber-400/80">{formatDate(a.publishAt)}</p>
                </Card>
              ))}
            </div>
            <LinkButton href="/announcements" variant="ghost" size="sm" className="mt-6">
              View All Bulletins <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>

          {/* Events */}
          <div>
            <SectionHeading eyebrow="Upcoming Agenda" title="Council Events & Fests" />
            <div className="mt-8 space-y-4">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted">No public events scheduled currently.</p>
              )}
              {upcomingEvents.map((e) => (
                <Card key={e.id} className="flex gap-5 p-6 transition-all hover:border-amber-500/30">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(e.date).toLocaleString("en-IN", { month: "short" })}</span>
                    <span className="font-serif text-lg font-bold leading-none mt-0.5">{new Date(e.date).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-serif text-base text-amber-100">{e.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{e.description}</p>
                    {e.venue && <p className="mt-2 text-xs font-semibold text-amber-400/80">📍 {e.venue}</p>}
                  </div>
                </Card>
              ))}
            </div>
            <LinkButton href="/events" variant="ghost" size="sm" className="mt-6">
              Full Event Calendar <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Luxury CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden p-12 text-center sm:text-left sm:flex sm:items-center sm:justify-between border border-amber-500/30 bg-gradient-to-r from-[#141624] via-[#1a1d2e] to-[#121420]">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-amber-500/5 blur-[100px]" />
          <div className="relative z-10">
            <h3 className="font-serif text-2xl text-amber-100 font-normal">Council Member Portal Access</h3>
            <p className="mt-2 text-sm text-muted max-w-lg">
              Authorized council delegates and committee leads can sign in to manage tasks, team discussions, and executive voting.
            </p>
          </div>
          <div className="relative z-10 mt-8 sm:mt-0 shrink-0">
            <LinkButton href="/login" size="lg">
              Member Sign In <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Card>
      </section>
    </div>
  );
}
