import Image from "next/image";
import { ShieldCheck, Handshake, Megaphone, GraduationCap } from "lucide-react";
import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, SectionHeading, Avatar } from "@/components/ui/primitives";
import Link from "next/link";
import { ACADEMIC_YEAR } from "@/lib/constants";
import { CampusBackground } from "@/components/public/campus-background";
import { PremiumAmbience } from "@/components/public/premium-ambience";

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
    title: "Peer Support",
    desc: "Student welfare, discipline coordination and mentoring — the council supports peers through every semester.",
  },
  {
    icon: ShieldCheck,
    title: "Accountable Governance",
    desc: "Transparent elections, documented decisions and a clear chain of responsibility across nine committees.",
  },
];

export default async function AboutPage() {
  const board = await db.select().from(members).where(eq(members.category, "board")).orderBy(members.id);

  return (
    <div className="relative overflow-hidden">
      {/* Campus background — fades out on scroll */}
      <CampusBackground />
      {/* Ultra premium ambience — aurora orbs, particles, grain */}
      <PremiumAmbience />

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/about-pattern.jpg" alt="" fill className="object-cover opacity-[0.12] dark:opacity-[0.2]" />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">About the Council</p>
          <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-[var(--text)]">
            Who we are, and what we stand for
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
            The PPG Institute of Technology Student Council is the elected representative body of the student
            community for the {ACADEMIC_YEAR} academic year. We work alongside the administration to shape a
            campus that is engaging, inclusive and well organized — across academics, culture, sports and
            student welfare.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our mission" title="Why the council exists" description="Four responsibilities guide everything we do." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <Card key={p.title} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <p.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[15px] font-semibold text-[var(--text)]">{p.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Structure" title="How the council is organized" description="A six-member board oversees the council, supported by 25 executive members and nine standing committees that run day-to-day operations." />
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
    </div>
  );
}
