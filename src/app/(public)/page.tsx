import Link from "next/link";
import { ArrowRight, Users, ListChecks, MessagesSquare, CalendarDays, ShieldCheck } from "lucide-react";
import { db } from "@/db";
import { members, announcements, events } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { LinkButton, Card, Badge, SectionHeading, Avatar } from "@/components/ui/primitives";
import {
  ScrollProgressBar,
  ScrollReveal,
  ScrollCard,
  TiltCard,
  AnimationScope,
} from "@/components/ui/animated-container";
import { HeroSection } from "@/components/public/hero-section";
import { formatDate, cn } from "@/lib/utils";
import { sortBoardMembers } from "@/lib/constants";

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
  const [boardRaw, latestAnnouncements, upcomingEvents] = await Promise.all([
    db.select().from(members).where(eq(members.category, "board")),
    db
      .select()
      .from(announcements)
      .where(eq(announcements.audience, "everyone"))
      .orderBy(desc(announcements.publishAt))
      .limit(4),
    db
      .select()
      .from(events)
      .where(and(eq(events.isPublic, true), gte(events.date, new Date())))
      .orderBy(events.date)
      .limit(4),
  ]);

  const board = sortBoardMembers(boardRaw);

  return (
    <AnimationScope>
      <div className="relative overflow-x-clip">
        {/* Scroll Progress Bar at top of viewport */}
        <ScrollProgressBar />

        {/* Section 1: Hero with Campus Background & Scroll Parallax Animation */}
        <HeroSection announcementsCount={latestAnnouncements.length || 1} />

        {/* Premium marquee ticker with scroll reveal */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" distance={20} duration={0.5}>
            <div className="marquee-mask overflow-hidden rounded-full border border-[#ffe7d2] bg-white py-3.5 shadow-sm">
              <div className="marquee-track">
                {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((k, i) => (
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
          </ScrollReveal>
        </section>

        {/* Section 2: Board Leadership with independent scroll cards */}
        <section className="section-gradient border-b border-[#ffe7d2] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <ScrollReveal direction="up" distance={24}>
                <SectionHeading eyebrow="Council Executive Board" title="Distinguished Leadership" />
              </ScrollReveal>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {board.map((m, idx) => (
                <ScrollCard key={m.id} delay={(idx % 3) * 0.08} className="h-full">
                  <TiltCard className="h-full rounded-3xl">
                    <Link href={`/members/${m.slug}`} className="block h-full">
                      <Card className="flex h-full items-center gap-5 p-6 transition-all duration-300 hover:border-[#ff9a47] hover:shadow-[0_12px_28px_rgba(255,122,0,0.12)]">
                        <Avatar name={m.fullName} src={m.photoUrl} size={62} />
                        <div className="min-w-0">
                          <p className="truncate text-lg font-bold text-[#18243a] transition-colors group-hover:text-[#f97316]">{m.fullName}</p>
                          <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-[#f97316]">{m.position}</p>
                          <p className="mt-1 text-xs text-muted">{m.department} – {m.year}</p>
                        </div>
                      </Card>
                    </Link>
                  </TiltCard>
                </ScrollCard>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Announcements & Events — individual cards trigger as scrolled on mobile */}
        <section className="section-soft border-b border-[#ffe7d2]">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Bulletins */}
              <div>
                <ScrollReveal direction="up" distance={22}>
                  <SectionHeading eyebrow="Official Bulletins" title="Latest Announcements" />
                </ScrollReveal>

                <div className="mt-8 space-y-4">
                  {latestAnnouncements.length === 0 && (
                    <p className="text-sm text-muted">No public announcements posted yet.</p>
                  )}
                  {latestAnnouncements.map((a, idx) => (
                    <ScrollCard key={a.id} delay={idx * 0.08} yOffset={20}>
                      <Card className="p-4.5 sm:p-6 transition-all duration-300 hover:border-[#ff9a47] hover:shadow-[0_10px_24px_rgba(24,36,58,0.08)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                          <p className="text-base sm:text-lg font-bold text-[#18243a] min-w-0 flex-1">{a.title}</p>
                          {a.priority !== "normal" && (
                            <Badge tone={a.priority === "urgent" ? "danger" : "warning"} className="shrink-0 self-start sm:self-auto">{a.priority}</Badge>
                          )}
                        </div>
                        <p className="mt-2.5 line-clamp-2 text-sm text-muted leading-relaxed">{a.content}</p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#f97316]/90">{formatDate(a.publishAt)}</p>
                      </Card>
                    </ScrollCard>
                  ))}
                </div>

                <ScrollReveal direction="up" distance={16} delay={0.15}>
                  <LinkButton href="/announcements" variant="ghost" size="sm" className="mt-6">
                    View All Bulletins <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                </ScrollReveal>
              </div>

              {/* Events */}
              <div>
                <ScrollReveal direction="up" distance={22}>
                  <SectionHeading eyebrow="Upcoming Agenda" title="Council Events & Fests" />
                </ScrollReveal>

                <div className="mt-8 space-y-4">
                  {upcomingEvents.length === 0 && (
                    <p className="text-sm text-muted">No public events scheduled currently.</p>
                  )}
                  {upcomingEvents.map((e, idx) => {
                    const isSymposium = e.title.toLowerCase().includes("symposium");
                    const cardContent = (
                      <Card
                        className={cn(
                          "flex gap-4 sm:gap-5 p-4.5 sm:p-6 transition-all duration-300 hover:border-[#ff9a47] hover:shadow-[0_10px_24px_rgba(24,36,58,0.08)]",
                          isSymposium && "border-[#fed7aa] bg-gradient-to-r from-white via-[#fffaf5] to-white",
                        )}
                      >
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-sm">
                          <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(e.date).toLocaleString("en-IN", { month: "short" })}</span>
                          <span className="text-lg font-bold leading-none mt-0.5">{new Date(e.date).getDate()}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-base sm:text-lg font-bold text-[#18243a]">{e.title}</p>
                            {isSymposium && (
                              <span className="shrink-0 rounded-full border border-[#fed7aa] bg-[#fff7ed] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ea580c]">
                                Flagship
                              </span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-muted">{e.description}</p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            {e.venue && <p className="text-xs font-semibold text-[#f97316]">📍 {e.venue}</p>}
                            {isSymposium && (
                              <span className="text-xs font-bold text-[#ea580c] flex items-center gap-1 hover:underline ml-auto">
                                Details & Notice <ArrowRight className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    );

                    return (
                      <ScrollCard key={e.id} delay={idx * 0.08} yOffset={20}>
                        {isSymposium ? (
                          <Link href="/events/symposium" className="block focus-ring rounded-3xl">
                            {cardContent}
                          </Link>
                        ) : (
                          cardContent
                        )}
                      </ScrollCard>
                    );
                  })}
                </div>

                <ScrollReveal direction="up" distance={16} delay={0.15}>
                  <LinkButton href="/events" variant="ghost" size="sm" className="mt-6">
                    Full Event Calendar <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Platform Features Grid */}
        <section className="section-warm">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <ScrollReveal direction="up" distance={26}>
              <SectionHeading
                eyebrow="Integrated Governance"
                title="Designed for Executive Efficiency"
                description="From task execution to real-time committee communications and campus decisions — engineered for maximum precision."
                className="text-center mx-auto"
              />
            </ScrollReveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: ListChecks, title: "Task & Project Hub", desc: "Assign deliverables to committee members, track Kanban milestones and review sign-offs." },
                { icon: MessagesSquare, title: "Real-Time Council Chat", desc: "Encrypted direct messaging, standing team rooms and dedicated discussion threads for every initiative." },
                { icon: Users, title: "Committee Governance", desc: "Nine specialized committees with clear team leads and role-based operational permissions." },
                { icon: CalendarDays, title: "Events & Agenda Planner", desc: "Plan flagship campus fests and board meetings end-to-end with verified documentation." },
                { icon: ShieldCheck, title: "Enterprise Grade Security", desc: "Multi-level authorization, audit logging and secure record keeping for council operations." },
              ].map((f, idx) => (
                <ScrollCard key={f.title} delay={(idx % 3) * 0.08} className="h-full">
                  <TiltCard className="h-full rounded-3xl">
                    <Card className="h-full p-8 transition-all duration-300 hover:border-[#ff9a47] hover:shadow-[0_14px_30px_rgba(255,122,0,0.12)]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#f97316] border border-[#ffd6b0] transition-transform duration-300 group-hover:scale-110">
                        <f.icon className="h-6 w-6" />
                      </div>
                      <p className="mt-6 text-xl font-bold text-[#18243a] transition-colors group-hover:text-[#f97316]">{f.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
                    </Card>
                  </TiltCard>
                </ScrollCard>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AnimationScope>
  );
}
