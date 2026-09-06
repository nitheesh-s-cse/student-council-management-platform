import { ShieldCheck, Handshake, Megaphone, GraduationCap, ArrowRight } from "lucide-react";
import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, SectionHeading, Avatar, LinkButton } from "@/components/ui/primitives";
import Link from "next/link";
import { ACADEMIC_YEAR } from "@/lib/constants";

export const dynamic = "force-dynamic";

const PILLARS = [
  {
    icon: Handshake,
    title: "Student Representation",
    desc: "We carry student feedback to the administration and ensure every department has a voice in campus decisions.",
  },
  {
    icon: Megaphone,
    title: "Campus Life & Events",
    desc: "From Tech Fest to Freshers' Day, the council plans and runs the events that define the PPGIT experience.",
  },
  {
    icon: GraduationCap,
    title: "Peer Support & Mentorship",
    desc: "Student welfare, discipline coordination and academic mentoring — supporting peers through every semester.",
  },
  {
    icon: ShieldCheck,
    title: "Accountable Governance",
    desc: "Transparent elections, documented decisions and a clear chain of operational responsibility.",
  },
];

export default async function AboutPage() {
  const board = await db.select().from(members).where(eq(members.category, "board")).orderBy(members.id);

  return (
    <div className="relative overflow-hidden">
      {/* Section 1: Hero — Replicating Screenshot 2 with soft top glow, pill badge, and dual-tone heading */}
      <section className="section-hero border-b border-[#ffe7d2] px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-28 lg:px-8">
        <div
          aria-hidden="true"
          className="background-glow background-glow-orange bg-glow-lg"
          style={{ left: "-6%", top: "-10%" }}
        />
        <div
          aria-hidden="true"
          className="background-glow background-glow-red bg-glow-md"
          style={{ right: "-4%", top: "4%" }}
        />

        <div className="mx-auto max-w-4xl text-left sm:text-center">
          {/* Pill Badge — exact match for Screenshot 2 badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd6b0] bg-[#fff7ed] px-4 py-1.5 text-xs font-black tracking-widest text-[#c2410c] uppercase shadow-xs">
            <span role="img" aria-label="college">🏛️</span> ABOUT THE COLLEGE & COUNCIL
          </div>

          {/* Heading — dual-tone split matching Screenshot 2 */}
          <h1 className="mt-5 text-[clamp(2.25rem,5.5vw,4.25rem)] font-black tracking-tight leading-[1.08] text-[#0f172a]">
            PPG <span className="text-[#ea580c]">Institute of Technology</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#4b5563] max-w-2xl sm:mx-auto font-normal">
            Empowering students in <strong className="font-bold text-[#0f172a]">Coimbatore, Tamil Nadu</strong> with world-class technical
            education, real-world skills, and an executive culture of continuous growth, integrity, and student leadership.
          </p>
        </div>
      </section>

      {/* Section 2: Mission Pillars — warm off-white #FFF9F2 */}
      <section className="section-warm border-b border-[#ffe7d2]">
        <div
          aria-hidden="true"
          className="background-glow background-glow-orange bg-glow-md"
          style={{ left: "-4%", top: "10%" }}
        />
        <div
          aria-hidden="true"
          className="background-glow background-glow-red bg-glow-sm"
          style={{ right: "-3%", bottom: "-6%", opacity: 0.7 }}
        />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Mission & Purpose"
            title="Why the Council Exists"
            description="Four fundamental responsibilities guide every committee, operation, and resolution."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <Card key={p.title} className="p-6 transition-all duration-200 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#ea580c] border border-[#ffd6b0] shadow-xs">
                  <p.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-lg font-bold text-[#18243a]">{p.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Leadership Structure — white with subtle red/orange radial gradient */}
      <section className="section-gradient border-b border-[#ffe7d2]">
        <div
          aria-hidden="true"
          className="background-glow background-glow-warm bg-glow-md"
          style={{ right: "-5%", top: "-16%" }}
        />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Executive Governance"
              title="Council Executive Board"
              description={`The six elected student leaders presiding over the PPGIT student body for the ${ACADEMIC_YEAR} academic term.`}
            />
            <LinkButton href="/members" variant="secondary" size="md">
              View All Members <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((m) => (
              <Link key={m.id} href={`/members/${m.slug}`} className="group block">
                <div className="flex items-center gap-4 rounded-3xl border border-[#fed7aa] bg-white p-5 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#ea580c] group-hover:shadow-[0_10px_26px_rgba(24,36,58,0.08)]">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] text-lg font-black text-white ring-2 ring-[#ffedd5]">
                    {m.fullName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n[0].toUpperCase())
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-[#18243a] transition-colors group-hover:text-[#ea580c]">
                      {m.fullName}
                    </p>
                    <p className="mt-0.5 truncate text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                      {m.position}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#6b7280]">
                      {m.department} · Year {m.year}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Institution Snapshot — very light warm background #FFFCF8 */}
      <section className="section-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-[#ffd6b0] bg-white/90 p-8 sm:p-12 shadow-sm backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#ea580c]">Campus Heritage</span>
                <h3 className="mt-2 text-2xl font-black text-[#0f172a]">PPG Institute of Technology</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
                  An autonomous engineering institution recognized for academic excellence, state-of-the-art laboratories, and an active student council body driving campus culture.
                </p>
              </div>
              <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ea580c]">Counselling Code</p>
                <p className="mt-2 text-4xl font-black text-[#ea580c]">2753</p>
                <p className="mt-2 text-xs text-[#4b5563]">Anna University Autonomous Admissions</p>
              </div>
              <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ea580c]">Campus Location</p>
                <p className="mt-2 text-xl font-bold text-[#0f172a]">Saravanampatti, Coimbatore</p>
                <p className="mt-2 text-xs text-[#4b5563]">Tamil Nadu 641035, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
