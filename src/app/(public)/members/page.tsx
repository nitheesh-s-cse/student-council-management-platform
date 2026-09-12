import Link from "next/link";
import { Search, Users2, ArrowRight, ShieldCheck, Crown, Award, Sparkles } from "lucide-react";
import { listPublicMembers } from "@/lib/services/members";
import { Card, Badge, EmptyState } from "@/components/ui/primitives";
import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cn } from "@/lib/utils";
import {
  ScrollProgressBar,
  ScrollReveal,
  ScrollCard,
  AnimationScope,
} from "@/components/ui/animated-container";

import { BOARD_ORDER, sortBoardMembers } from "@/lib/constants";

export const dynamic = "force-dynamic";

const COMMITTEE_ORDER = [
  "Web Ops",
  "Culturals",
  "Sports",
  "Literary Club",
  "Public Relations & Social Media",
  "Social Service",
  "Student Welfare",
  "Finance & Sponsorship",
  "Event Management",
];

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; department?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category ?? "";
  const activeDept = params.department ?? "";
  const query = params.q?.trim() ?? "";

  // Fetch filtered list and all active members for accurate counts
  const [list, allMembers] = await Promise.all([
    listPublicMembers({ q: query, category: activeCategory, department: activeDept }),
    db.select().from(members).where(eq(members.isActive, true)).orderBy(members.id),
  ]);

  // Compute department counts
  const deptCountMap = new Map<string, number>();
  for (const m of allMembers) {
    if (m.department) {
      deptCountMap.set(m.department, (deptCountMap.get(m.department) ?? 0) + 1);
    }
  }
  const departments = Array.from(deptCountMap.keys()).sort();

  // Tier groupings
  const boardMembers = sortBoardMembers(allMembers.filter((m) => m.category === "board"));

  const executiveMembers = allMembers.filter((m) => m.category === "executive");
  const committeeMembers = allMembers.filter((m) => m.category === "committee");

  // Group committee members by committee name
  const committeeGroups: { name: string; members: typeof committeeMembers }[] = COMMITTEE_ORDER.map((cName) => ({
    name: cName,
    members: committeeMembers.filter((m) => m.committeeName?.toLowerCase() === cName.toLowerCase()),
  })).filter((g) => g.members.length > 0);

  const isHierarchicalView = !query && !activeDept && (!activeCategory || activeCategory === "all");

  return (
    <AnimationScope>
      <div className="relative overflow-x-clip">
        {/* Scroll Progress Bar at top */}
        <ScrollProgressBar />

        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-2xl sm:rounded-[32px] border border-[#ffd6b0] bg-white/95 p-4 sm:p-10 lg:p-12 shadow-[0_15px_45px_rgba(24,36,58,0.06)] backdrop-blur-xl">
            {/* Pill Badge */}
            <ScrollReveal direction="up" distance={16}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd6b0] bg-[#fff7ed] px-4 py-1 text-xs font-black tracking-widest text-[#c2410c] uppercase shadow-xs">
                <span>🏛️</span> STUDENT COUNCIL 2026–27
              </div>
            </ScrollReveal>

            {/* Heading */}
            <ScrollReveal direction="up" distance={20} delay={0.06}>
              <h1 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#18243a]">
                Student Council Directory
              </h1>
              <p className="mt-2.5 max-w-3xl text-sm sm:text-base text-[#4b5563]">
                The official roster of student leaders, executive members, and committee delegates representing PPG Institute of Technology.
              </p>
            </ScrollReveal>

            {/* Category Filter Tabs */}
            <div className="mt-6 flex flex-wrap gap-2 border-b border-[#ffe7d2] pb-5">
              {[
                { id: "", label: "All Council", count: allMembers.length },
                { id: "board", label: "Board Members", count: boardMembers.length },
                { id: "executive", label: "Executive Members", count: executiveMembers.length },
                { id: "committee", label: "Committee Members", count: committeeMembers.length },
              ].map((tab) => {
                const isActive = activeCategory === tab.id;
                const search = new URLSearchParams();
                if (tab.id) search.set("category", tab.id);
                if (activeDept) search.set("department", activeDept);
                if (query) search.set("q", query);
                const href = search.toString() ? `/members?${search.toString()}` : "/members";

                return (
                  <Link
                    key={tab.id}
                    href={href}
                    className={cn(
                      "focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200",
                      isActive
                        ? "bg-[#ea580c] text-white shadow-[0_4px_14px_rgba(234,88,12,0.35)]"
                        : "border border-[#fed7aa] bg-white text-[#18243a] hover:border-[#ea580c] hover:bg-[#fff7ed] hover:text-[#ea580c]",
                    )}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-extrabold",
                        isActive ? "bg-white/25 text-white" : "bg-[#fff1e6] text-[#c2410c]",
                      )}
                    >
                      {tab.count}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Department Filter Chips */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted mr-1">Department:</span>
              <Link
                href={
                  activeCategory
                    ? `/members?category=${encodeURIComponent(activeCategory)}`
                    : "/members"
                }
                className={cn(
                  "focus-ring inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
                  !activeDept
                    ? "bg-[#18243a] text-white shadow-xs"
                    : "border border-[#fed7aa] bg-white text-[#18243a] hover:bg-[#fff7ed]",
                )}
              >
                All ({allMembers.length})
              </Link>
              {departments.map((d) => {
                const count = deptCountMap.get(d) ?? 0;
                const isActive = activeDept === d;
                const search = new URLSearchParams();
                if (activeCategory) search.set("category", activeCategory);
                if (!isActive) search.set("department", d);
                if (query) search.set("q", query);
                const href = search.toString() ? `/members?${search.toString()}` : "/members";

                return (
                  <Link
                    key={d}
                    href={href}
                    className={cn(
                      "focus-ring inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
                      isActive
                        ? "bg-[#18243a] text-white shadow-xs"
                        : "border border-[#fed7aa] bg-white text-[#18243a] hover:bg-[#fff7ed] hover:border-[#ea580c]",
                    )}
                  >
                    {d} ({count})
                  </Link>
                );
              })}
            </div>

            {/* Search Form */}
            <form className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-2xl border border-[#fed7aa] bg-[#fffcf8] p-3 shadow-xs">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search member name, department or role…"
                  className="focus-ring h-10 w-full rounded-xl border border-[#fed7aa] bg-white pl-9 pr-3 text-sm text-[#18243a]"
                />
              </div>

              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              {activeDept && <input type="hidden" name="department" value={activeDept} />}

              <button
                type="submit"
                className="focus-ring h-10 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ef4444] px-5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all hover:brightness-105"
              >
                Search
              </button>
            </form>

            {/* ========================================================
                MAIN CONTENT: HIERARCHICAL OR FILTERED VIEW
                ======================================================== */}
            {isHierarchicalView ? (
              <div className="mt-12 space-y-16">
                {/* 1. BOARD MEMBERS (6) */}
                <section>
                  <ScrollReveal direction="up" distance={20}>
                    <div className="flex items-center justify-between border-b-2 border-[#ffd6b0] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-[#ea580c]" />
                          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#18243a]">
                            BOARD MEMBERS
                          </h2>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          Executive student leadership presiding over the PPGIT student council
                        </p>
                      </div>
                      <Badge tone="brand" className="font-bold">
                        6 Members
                      </Badge>
                    </div>
                  </ScrollReveal>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {boardMembers.map((m, idx) => (
                      <ScrollCard key={m.id} delay={(idx % 3) * 0.08} yOffset={22}>
                        <Link href={`/members/${m.slug}`} className="group block h-full">
                          <div className="flex h-full flex-col justify-between rounded-2xl border-2 border-[#ffd6b0] bg-gradient-to-br from-white to-[#fff9f2] p-5 shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#ea580c] group-hover:shadow-[0_12px_28px_rgba(234,88,12,0.14)]">
                            <div className="flex items-start gap-3.5">
                              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] text-base font-black text-white shadow-xs ring-2 ring-[#ffedd5]">
                                {m.fullName
                                  .split(" ")
                                  .filter(Boolean)
                                  .slice(0, 2)
                                  .map((n) => n[0].toUpperCase())
                                  .join("")}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="inline-block rounded-lg bg-[#fff1e6] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-[#c2410c] border border-[#ffd6b0]">
                                  {m.position}
                                </span>
                                <p className="mt-1.5 truncate text-base font-extrabold text-[#18243a] transition-colors group-hover:text-[#ea580c]">
                                  {m.fullName}
                                </p>
                                <p className="mt-0.5 text-xs font-bold text-[#64748b]">
                                  {m.department} – {m.year}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-[#ffe7d2] pt-3 text-xs font-bold text-[#ea580c]">
                              <span>View Profile</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      </ScrollCard>
                    ))}
                  </div>
                </section>

                {/* 2. EXECUTIVE MEMBERS (25) */}
                <section>
                  <ScrollReveal direction="up" distance={20}>
                    <div className="flex items-center justify-between border-b-2 border-[#ffd6b0] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-[#ea580c]" />
                          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#18243a]">
                            EXECUTIVE MEMBERS
                          </h2>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          Elected council delegates representing departments across campus
                        </p>
                      </div>
                      <Badge tone="warning" className="font-bold">
                        25 Members
                      </Badge>
                    </div>
                  </ScrollReveal>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {executiveMembers.map((m, idx) => (
                      <ScrollCard key={m.id} delay={(idx % 3) * 0.05} yOffset={20}>
                        <Link href={`/members/${m.slug}`} className="group block h-full">
                          <div className="flex h-full items-center justify-between gap-3 rounded-2xl border border-[#fed7aa] bg-white p-4 shadow-xs transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ea580c] group-hover:shadow-[0_8px_20px_rgba(24,36,58,0.06)]">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fed7aa] to-[#ffd6b0] text-sm font-bold text-[#c2410c]">
                                {m.fullName
                                  .split(" ")
                                  .filter(Boolean)
                                  .slice(0, 2)
                                  .map((n) => n[0].toUpperCase())
                                  .join("")}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-[#18243a] transition-colors group-hover:text-[#ea580c]">
                                  {m.fullName}
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-[#64748b]">
                                  {m.department} – {m.year}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-[#ea580c]" />
                          </div>
                        </Link>
                      </ScrollCard>
                    ))}
                  </div>
                </section>

                {/* 3. COMMITTEE MEMBERS (70, Grouped into 9 Committees) */}
                <section>
                  <ScrollReveal direction="up" distance={20}>
                    <div className="flex items-center justify-between border-b-2 border-[#ffd6b0] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Users2 className="h-5 w-5 text-[#ea580c]" />
                          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#18243a]">
                            COMMITTEE MEMBERS
                          </h2>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          Organized across nine specialized operational committees
                        </p>
                      </div>
                      <Badge tone="neutral" className="font-bold">
                        70 Members
                      </Badge>
                    </div>
                  </ScrollReveal>

                  <div className="mt-8 space-y-10">
                    {committeeGroups.map((group) => (
                      <div key={group.name} className="rounded-2xl border border-[#fed7aa] bg-[#fffcf8] p-5 sm:p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#fed7aa] pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff7ed] text-xs font-bold text-[#ea580c] border border-[#ffd6b0]">
                              ✦
                            </span>
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#18243a] uppercase">
                              {group.name}
                            </h3>
                          </div>
                          <span className="rounded-full bg-[#fff1e6] px-2.5 py-0.5 text-xs font-bold text-[#c2410c]">
                            {group.members.length} {group.members.length === 1 ? "member" : "members"}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {group.members.map((m, idx) => (
                            <ScrollCard key={m.id} delay={(idx % 3) * 0.05} yOffset={16}>
                              <Link href={`/members/${m.slug}`} className="group block">
                                <div className="flex items-center justify-between gap-3 rounded-xl border border-[#ffe7d2] bg-white p-3.5 shadow-2xs transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#ea580c] group-hover:shadow-xs">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-xs font-bold text-[#ea580c]">
                                      {m.fullName
                                        .split(" ")
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((n) => n[0].toUpperCase())
                                        .join("")}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-bold text-[#18243a] transition-colors group-hover:text-[#ea580c]">
                                        {m.fullName}
                                      </p>
                                      <p className="text-[11px] font-semibold text-[#64748b]">
                                        {m.department} – {m.year}
                                      </p>
                                    </div>
                                  </div>
                                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-[#ea580c]" />
                                </div>
                              </Link>
                            </ScrollCard>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              /* ========================================================
                  FILTERED / SEARCH VIEW
                  ======================================================== */
              <div className="mt-10">
                <div className="flex items-center justify-between border-b border-[#ffe7d2] pb-3 mb-6">
                  <p className="text-sm font-bold text-[#18243a]">
                    Showing <span className="text-[#ea580c]">{list.length}</span> {list.length === 1 ? "member" : "members"}
                    {activeCategory && (
                      <span> in <span className="capitalize text-[#ea580c]">{activeCategory}</span></span>
                    )}
                    {activeDept && (
                      <span> · Department: <span className="text-[#ea580c]">{activeDept}</span></span>
                    )}
                    {query && (
                      <span> matching &quot;{query}&quot;</span>
                    )}
                  </p>
                  {(activeCategory || activeDept || query) && (
                    <Link
                      href="/members"
                      className="text-xs font-bold text-[#ea580c] hover:underline"
                    >
                      Clear Filters
                    </Link>
                  )}
                </div>

                {list.length === 0 ? (
                  <EmptyState
                    icon={<Users2 className="h-6 w-6" />}
                    title="No members found"
                    description="Try clearing your search query or department filter."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(activeCategory === "board" ? sortBoardMembers(list) : list).map((m, idx) => (
                      <ScrollCard key={m.id} delay={(idx % 3) * 0.05} yOffset={20}>
                        <Link href={`/members/${m.slug}`} className="group block h-full">
                          <div className="flex h-full flex-col justify-between rounded-2xl border border-[#fed7aa] bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#ea580c] group-hover:shadow-[0_10px_24px_rgba(24,36,58,0.08)]">
                            <div className="flex items-start gap-3.5">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] text-sm font-black text-white shadow-xs">
                                {m.fullName
                                  .split(" ")
                                  .filter(Boolean)
                                  .slice(0, 2)
                                  .map((n) => n[0].toUpperCase())
                                  .join("")}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="rounded-md bg-[#fff1e6] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#c2410c]">
                                    {m.position ?? m.category}
                                  </span>
                                  {m.committeeName && (
                                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                                      {m.committeeName}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1.5 truncate text-base font-extrabold text-[#18243a] transition-colors group-hover:text-[#ea580c]">
                                  {m.fullName}
                                </p>
                                <p className="mt-0.5 text-xs font-bold text-[#64748b]">
                                  {m.department} – {m.year}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-[#ffe7d2] pt-2 text-xs font-bold text-[#ea580c]">
                              <span>View Profile</span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      </ScrollCard>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimationScope>
  );
}
