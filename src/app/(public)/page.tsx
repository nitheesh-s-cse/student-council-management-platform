import Link from "next/link";
import { ArrowRight, Users, ListChecks, MessagesSquare, CalendarDays, ShieldCheck, Vote, Sparkles } from "lucide-react";
import { db } from "@/db";
import { members, teams, announcements, events } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { LinkButton, Card, Badge, SectionHeading, Avatar } from "@/components/ui/primitives";
import { MotionDiv, StaggerGrid, StaggerItem, AnimatedStatCard, TiltCard } from "@/components/ui/animated-container";
import { ACADEMIC_YEAR } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TICKER = [
  "Integrated Governance",
  "Committee Operations",
  "Real-Time Chat",
  "Task Execution",
  "Campus Events",
  "Polling & Voting",
  "Executive Leadership",
];

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
      {/* Section 1: Hero — Clean white/warm-white base with subtle orange & red ambient glows */}
      <section className="section-hero px-4 pt-24 pb-28 sm:px-6 sm:pt-32 lg:px-8">
        <div aria-hidden="true" className="background-glow background-glow-orange bg-glow-lg" style={{ left: "-6%", top: "-10%" }} />
        <div aria-hidden="true" className="background-glow background-glow-red bg-glow-md" style={{ right: "-6%", top: "10%" }} />
        <div aria-hidden="true" className="background-glow background-glow-warm bg-glow-sm" style={{ left: "20%", top: "60%" }} />
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <MotionDiv delay={0.1}>
              <Badge tone="brand" className="mb-6 px-4 py-1.5 shadow-[0_2px_10px_rgba(255,122,0,0.12)]">
                <Sparkles className="h-3.5 w-3.5 text-[#f97316] animate-spin" style={{ animationDuration: '8s' }} />
                Academic Term {ACADEMIC_YEAR}
              </Badge>
            </MotionDiv>

            <MotionDiv delay={0.2}>
              <h1 className="max-w-4xl text-[clamp(2.25rem,7vw,5rem)] font-extrabold leading-[1.06] tracking-tight text-[#18243a] break-words">
                PPG Institute of Technology <br />
                <span className="text-brand-gradient">Student Council</span>
              </h1>
            </MotionDiv>

            <MotionDiv delay={0.35}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted font-normal sm:text-[17px]">
                The premier executive student body representing PPGIT — orchestrating campus innovation, 
                task delivery, inter-departmental governance, and student leadership in one unified digital platform.
              </p>
            </MotionDiv>

            <MotionDiv delay={0.5} className="mt-10 flex flex-wrap justify-center gap-4">
              <LinkButton href="/about" size="lg">
                Explore Council <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </LinkButton>
            </MotionDiv>

            {/* Stats Bar */}
            <MotionDiv delay={0.65} className="mt-20 w-full max-w-4xl">
              <div className="grid grid-cols-1 gap-3 rounded-3xl border border-[#ffd6b0] bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(24,36,58,0.08)] min-[400px]:grid-cols-3">
                <AnimatedStatCard value={`${memberCount}+`} label="Elected Members" delay={0.7} />
                <AnimatedStatCard value={teamCount} label="Active Committees" delay={0.8} />
                <AnimatedStatCard value="10" label="Departments" delay={0.9} />
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Premium marquee ticker */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="marquee-mask overflow-hidden rounded-full border border-[#ffe7d2] bg-white py-3.5 shadow-sm">
          <div className="marquee-track">
            {[...TICKER, ...TICKER].map((k, i) => (
              <span
                key={i}
                className="mx-6 inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.32em] text-[#18243a]/60"
              >
                {k}
                <span aria-hidden="true" className="text-[#ff7a00]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Platform Features Grid — warm off-white #FFF9F2 */}
      <section className="section-warm border-y border-[#ffe7d2]">
        <div aria-hidden="true" className="background-glow background-glow-orange bg-glow-md" style={{ left: "-5%", top: "6%" }} />
        <div aria-hidden="true" className="background-glow background-glow-red bg-glow-sm" style={{ right: "-3%", bottom: "0%", opacity: 0.7 }} />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <MotionDiv>
          <SectionHeading
            eyebrow="Integrated Governance"
            title="Designed for Executive Efficiency"
            description="From task execution to real-time committee communications and campus decisions — engineered for maximum precision."
            className="text-center mx-auto"
          />
        </MotionDiv>

        <StaggerGrid className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: ListChecks, title: "Task & Project Hub", desc: "Assign deliverables to committee members, track Kanban milestones and review sign-offs." },
            { icon: MessagesSquare, title: "Real-Time Council Chat", desc: "Encrypted direct messaging, standing team rooms and dedicated discussion threads for every initiative." },
            { icon: Users, title: "Committee Governance", desc: "Nine specialized committees with clear team leads and role-based operational permissions." },
            { icon: CalendarDays, title: "Events & Agenda Planner", desc: "Plan flagship campus fests and board meetings end-to-end with verified documentation." },
            { icon: Vote, title: "Polling & Voting Engine", desc: "Execute single-choice, multiple-choice, or anonymous voting for official council resolutions." },
            { icon: ShieldCheck, title: "Enterprise Grade Security", desc: "Multi-level authorization, audit logging and secure record keeping for council operations." },
          ].map((f) => (
            <StaggerItem key={f.title} className="h-full">
              <TiltCard className="h-full rounded-3xl">
                <Card className="h-full p-8 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#f97316] border border-[#ffd6b0]">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-xl font-bold text-[#18243a]">{f.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
        </div>
      </section>

      {/* Section 3: Board Leadership — white with subtle red/orange radial gradient */}
      <section className="section-gradient border-b border-[#ffe7d2] py-24">
        <div aria-hidden="true" className="background-glow background-glow-orange bg-glow-lg" style={{ right: "-6%", top: "-14%" }} />
        <div aria-hidden="true" className="background-glow background-glow-red bg-glow-sm" style={{ left: "4%", bottom: "-8%", opacity: 0.6 }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <MotionDiv>
              <SectionHeading eyebrow="Council Executive Board" title="Distinguished Leadership" />
            </MotionDiv>
          </div>

          <StaggerGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((m) => (
              <StaggerItem key={m.id} className="h-full">
                <TiltCard className="h-full rounded-3xl">
                  <Link href={`/members/${m.slug}`} className="block h-full">
                    <Card className="flex h-full items-center gap-5 p-6 transition-all">
                      <Avatar name={m.fullName} src={m.photoUrl} size={62} />
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold text-[#18243a] transition-colors group-hover:text-[#f97316]">{m.fullName}</p>
                        <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-[#f97316]">{m.position}</p>
                        <p className="mt-1 text-xs text-muted">{m.department} · Year {m.year}</p>
                      </div>
                    </Card>
                  </Link>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Section 4: Announcements & Events — very light warm background #FFFCF8 */}
      <section className="section-soft">
        <div aria-hidden="true" className="background-glow background-glow-warm bg-glow-md" style={{ left: "-4%", top: "10%" }} />
        <div aria-hidden="true" className="background-glow background-glow-orange bg-glow-sm" style={{ right: "-2%", bottom: "4%", opacity: 0.5 }} />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Bulletins */}
          <MotionDiv delay={0.1}>
            <SectionHeading eyebrow="Official Bulletins" title="Latest Announcements" />
            <div className="mt-8 space-y-4">
              {latestAnnouncements.length === 0 && (
                <p className="text-sm text-muted">No public announcements posted yet.</p>
              )}
              {latestAnnouncements.map((a) => (
                <Card key={a.id} className="p-4.5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <p className="text-base sm:text-lg font-bold text-[#18243a] min-w-0 flex-1">{a.title}</p>
                    {a.priority !== "normal" && (
                      <Badge tone={a.priority === "urgent" ? "danger" : "warning"} className="shrink-0 self-start sm:self-auto">{a.priority}</Badge>
                    )}
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-sm text-muted leading-relaxed">{a.content}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#f97316]/90">{formatDate(a.publishAt)}</p>
                </Card>
              ))}
            </div>
            <LinkButton href="/announcements" variant="ghost" size="sm" className="mt-6">
              View All Bulletins <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </MotionDiv>

          {/* Events */}
          <MotionDiv delay={0.25}>
            <SectionHeading eyebrow="Upcoming Agenda" title="Council Events & Fests" />
            <div className="mt-8 space-y-4">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted">No public events scheduled currently.</p>
              )}
              {upcomingEvents.map((e) => (
                <Card key={e.id} className="flex gap-4 sm:gap-5 p-4.5 sm:p-6">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-gradient text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(e.date).toLocaleString("en-IN", { month: "short" })}</span>
                    <span className="text-lg font-bold leading-none mt-0.5">{new Date(e.date).getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base sm:text-lg font-bold text-[#18243a]">{e.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{e.description}</p>
                    {e.venue && <p className="mt-2 text-xs font-semibold text-[#f97316]">📍 {e.venue}</p>}
                  </div>
                </Card>
              ))}
            </div>
            <LinkButton href="/events" variant="ghost" size="sm" className="mt-6">
              Full Event Calendar <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </MotionDiv>
        </div>
        </div>
      </section>

      {/* Section 5: White transition base with CTA section: orange → red gradient */}
      <section className="section-white">
        <div className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="background-glow background-glow-warm bg-glow-md" style={{ right: "8%", top: "-40%", opacity: 0.6 }} />
        <MotionDiv delay={0.2} className="relative">
          <Card className="relative overflow-hidden p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-[#ffd6b0] bg-brand-gradient sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-white/15 blur-[100px] animate-pulse-glow" />
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/20 blur-[80px] animate-pulse-glow" />
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold text-white">Council Member Portal Access</h3>
              <p className="mt-2 text-sm text-white/85 max-w-lg">
                Authorized council delegates and committee leads can sign in to manage tasks, team discussions, and executive voting.
              </p>
            </div>
            <div className="relative z-10 mt-8 sm:mt-0 shrink-0">
              <LinkButton href="/login" size="lg" variant="secondary" className="shadow-[0_10px_28px_rgba(24,36,58,0.18)]">
                Member Sign In <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </Card>
        </MotionDiv>
        </div>
      </section>
    </div>
  );
}
