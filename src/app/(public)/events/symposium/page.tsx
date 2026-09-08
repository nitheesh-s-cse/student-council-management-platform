import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  HelpCircle,
  Trophy,
  Users,
  CheckCircle2,
  Download,
  PhoneCall,
  Mail,
  ChevronRight,
  Flame,
  Award,
} from "lucide-react";
import { Card, Badge, LinkButton } from "@/components/ui/primitives";
import { SymposiumPopup } from "@/components/public/symposium-popup";

export const metadata: Metadata = {
  title: "PPGIT College Symposium 2026 | PPG Institute of Technology",
  description:
    "Official event page for the PPGIT College Symposium on 25th September 2026. Inter-collegiate innovation, hackathons, paper presentations, and tech competitions.",
};

const TRACKS = [
  {
    icon: FileText,
    title: "Paper & Poster Presentation",
    tag: "Research & Innovation",
    desc: "Present your research papers and emerging ideas in Artificial Intelligence, IoT, Renewable Systems, and Modern Computing to an expert panel.",
    perks: "Max 3 per team · 10 min presentation · Certificates for all",
  },
  {
    icon: Code2,
    title: "Code Odyssey & Hackathon",
    tag: "Speed Coding & Dev",
    desc: "Test algorithmic problem solving, rapid web application building, and competitive debugging under high-intensity sprint rounds.",
    perks: "Solo or Duo · Live coding environment · Attractive prizes",
  },
  {
    icon: HelpCircle,
    title: "Tech Quiz & UI/UX Sprint",
    tag: "Intellect & Creativity",
    desc: "Buzzer rounds testing deep tech trivia, systems architecture, logic riddles, followed by a fast-paced responsive interface design sprint.",
    perks: "Teams of 2 · Rapid fire rounds · Figma / Web tools permitted",
  },
  {
    icon: Trophy,
    title: "Project Expo & Hardware Showcase",
    tag: "Working Prototypes",
    desc: "Demonstrate working hardware prototypes, embedded robotics, autonomous devices, or full-stack software solutions before industry adjudicators.",
    perks: "Teams of 2 to 4 · Working prototype required · Cash awards",
  },
];

const SCHEDULE = [
  { time: "09:00 AM – 09:30 AM", title: "Delegate Registration & Welcome Kit", venue: "Auditorium Lobby" },
  { time: "09:30 AM – 10:30 AM", title: "Grand Inaugural Ceremony & Keynote Address", venue: "Main Auditorium" },
  { time: "10:30 AM – 01:00 PM", title: "Track Round 1: Paper Presentations & Hackathon Sprints", venue: "CSE & IT Labs" },
  { time: "01:00 PM – 02:00 PM", title: "Networking Lunch & Campus Tour", venue: "College Cafeteria" },
  { time: "02:00 PM – 03:30 PM", title: "Project Expo Demonstrations & Quiz Finals", venue: "Tech Expo Hall" },
  { time: "03:30 PM – 04:30 PM", title: "Valedictory Function, Merit Citations & Prize Distribution", venue: "Main Auditorium" },
];

export default function CollegeSymposiumPage() {
  return (
    <div className="section-gradient relative min-h-screen">
      {/* Center-screen Automatic Symposium Popup */}
      <SymposiumPopup />

      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="background-glow background-glow-orange bg-glow-md"
        style={{ left: "-5%", top: "-4%" }}
      />
      <div
        aria-hidden="true"
        className="background-glow background-glow-red bg-glow-sm"
        style={{ right: "-4%", bottom: "10%", opacity: 0.5 }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-muted">
          <Link href="/" className="hover:text-[#f97316] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted/60" />
          <Link href="/events" className="hover:text-[#f97316] transition-colors">
            Events
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted/60" />
          <span className="text-[#ea580c] font-bold">College Symposium</span>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-[#ffd6b0] bg-gradient-to-br from-[#0c1220] via-[#151f33] to-[#1e293b] p-6 sm:p-12 text-white shadow-[0_25px_60px_rgba(15,23,42,0.2)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-[#f97316]/30 via-[#ea580c]/15 to-transparent blur-3xl"
          />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#fed7aa] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#f97316] animate-pulse" />
              PPGIT Flagship Event 2026
            </div>

            <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              PPGIT College <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff9a47] via-[#ea580c] to-[#f59e0b]">
                Symposium 2026
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-lg text-white/85 leading-relaxed">
              Join visionary student innovators, coders, researchers, and creators from across the region.
              Showcase your technical knowledge, solve challenging real-world problems, and gain campus-wide
              recognition.
            </p>

            {/* Quick Details Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs sm:text-sm font-bold text-white backdrop-blur-md">
                <CalendarDays className="h-4 w-4 text-[#ff9a47]" />
                <span>Date: 25th September 2026</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white/90 backdrop-blur-md">
                <Clock className="h-4 w-4 text-[#ff9a47]" />
                <span>09:30 AM – 04:30 PM IST</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white/90 backdrop-blur-md">
                <MapPin className="h-4 w-4 text-[#ff9a47]" />
                <span>PPGIT Auditoriums & Labs</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#register-section"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-950/40 transition-all hover:brightness-110 active:scale-95 text-center"
              >
                Register Now <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#event-details"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 text-center"
              >
                View Track Details
              </a>
            </div>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Date", value: "25 Sep 2026", icon: CalendarDays },
            { label: "Flagship Tracks", value: "4 Major Arenas", icon: Flame },
            { label: "Eligibility", value: "All College Depts", icon: Users },
            { label: "Rewards", value: "Cash & Accolades", icon: Award },
          ].map((item) => (
            <Card key={item.label} className="p-4 sm:p-5 flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#ea580c] border border-[#ffd6b0]">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{item.label}</p>
                <p className="text-sm sm:text-base font-black text-[#18243a] truncate">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Section: Event Tracks & Highlights */}
        <div id="event-details" className="mt-14 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
              <span className="h-px w-8 bg-[#ffd6b0]" />
              Competitive Arenas
              <span className="h-px w-8 bg-[#ffd6b0]" />
            </p>
            <h2 className="mt-2.5 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#18243a]">
              Key Event Highlights & Tracks
            </h2>
            <p className="mt-3 text-sm text-muted">
              Explore diverse engineering, software, and hardware competitions crafted to highlight your
              skills, teamwork, and innovative thinking.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {TRACKS.map((t) => (
              <Card
                key={t.title}
                className="p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#ff9a47] hover:shadow-[0_12px_30px_rgba(24,36,58,0.08)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#ea580c] border border-[#ffd6b0]">
                      <t.icon className="h-6 w-6" />
                    </div>
                    <Badge tone="brand" className="text-xs font-bold">
                      {t.tag}
                    </Badge>
                  </div>
                  <h3 className="mt-5 text-lg sm:text-xl font-bold text-[#18243a]">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t.desc}</p>
                </div>
                <div className="mt-5 border-t border-[#ffe7d2] pt-3 text-xs font-semibold text-[#ea580c] flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{t.perks}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Section: Timeline / Schedule */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
              <span className="h-px w-8 bg-[#ffd6b0]" />
              Event Schedule
              <span className="h-px w-8 bg-[#ffd6b0]" />
            </p>
            <h2 className="mt-2.5 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#18243a]">
              Program Itinerary – 25th September
            </h2>
            <p className="mt-3 text-sm text-muted">
              Structured itinerary ensuring seamless track execution, timely presentations, and fair judging.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#ffd6b0] bg-white shadow-sm">
            <div className="divide-y divide-[#ffeedb]">
              {SCHEDULE.map((s, idx) => (
                <div
                  key={s.time}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-[#fffbf6] transition-colors gap-2 sm:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-xs font-black text-[#ea580c] border border-[#ffd6b0]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm sm:text-[15px] font-bold text-[#18243a]">{s.title}</p>
                      <p className="text-xs text-muted flex items-center gap-1 mt-0.5 sm:hidden">
                        <MapPin className="h-3 w-3 text-[#ea580c]" /> {s.venue}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <span className="hidden sm:inline-flex text-xs font-semibold text-muted items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#ea580c]" /> {s.venue}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#fff7ed] px-3 py-1 text-xs font-bold text-[#ea580c] border border-[#fed7aa]">
                      <Clock className="h-3.5 w-3.5" />
                      {s.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Registration Box */}
        <div id="register-section" className="mt-16 scroll-mt-24">
          <div className="rounded-[28px] sm:rounded-[32px] border border-[#ffd6b0] bg-gradient-to-br from-[#fff7ed] via-white to-[#fffaf5] p-6 sm:p-10 shadow-md">
            <div className="grid gap-8 lg:grid-cols-3 items-center">
              <div className="lg:col-span-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fed7aa]/50 border border-[#fed7aa] px-3 py-1 text-xs font-bold text-[#ea580c]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Official Registration
                </span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-black text-[#18243a]">
                  Ready to Showcase Your Talent?
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#4b5563]">
                  Registration is open for students across all engineering and technical colleges.
                  Form your team, select your competition tracks, and get ready for an unforgettable day
                  of innovation on <strong>25th September 2026</strong>.
                </p>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-[#18243a]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#ea580c]" /> No Registration Fee for PPGIT Students
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#ea580c]" /> Participation Certificate for All
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#ea580c]" /> Refreshments & Lunch Provided
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="mailto:studentcouncil@ppg.edu.in?subject=Registration%20for%20PPGIT%20College%20Symposium%202026"
                  className="focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f97316] to-[#ea580c] px-6 text-sm font-extrabold text-white shadow-lg shadow-orange-950/20 transition-all hover:brightness-105 active:scale-95 text-center"
                >
                  Register via Email / Portal <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="tel:+919047777277"
                  className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#ffd6b0] bg-white px-6 text-xs font-bold text-[#ea580c] shadow-xs transition-all hover:bg-[#fff7ed] active:scale-95 text-center"
                >
                  <PhoneCall className="h-3.5 w-3.5" /> Call Council Helpdesk
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Coordinators & Helpdesk */}
        <div className="mt-14 mb-8">
          <Card className="p-6 sm:p-8">
            <h4 className="text-base sm:text-lg font-bold text-[#18243a]">
              Student Council Organizing Committee
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              For event queries, rule books, or team registrations, contact our council representatives:
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-[#ffe7d2] bg-[#fffaf5] p-3.5">
                <p className="text-xs font-bold text-[#18243a]">Tameema Naazmi M.R.</p>
                <p className="text-[11px] text-[#ea580c] font-semibold">Council President</p>
                <p className="mt-1 text-xs text-muted">BME – IV</p>
              </div>
              <div className="rounded-xl border border-[#ffe7d2] bg-[#fffaf5] p-3.5">
                <p className="text-xs font-bold text-[#18243a]">Mohammed Jubair A</p>
                <p className="text-[11px] text-[#ea580c] font-semibold">Council Secretary</p>
                <p className="mt-1 text-xs text-muted">CSE – III</p>
              </div>
              <div className="rounded-xl border border-[#ffe7d2] bg-[#fffaf5] p-3.5">
                <p className="text-xs font-bold text-[#18243a]">Council Helpdesk</p>
                <p className="text-[11px] text-[#ea580c] font-semibold">studentcouncil@ppg.edu.in</p>
                <p className="mt-1 text-xs text-muted">PPG Institute of Technology</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
