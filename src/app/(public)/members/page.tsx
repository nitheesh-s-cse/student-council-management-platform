import Link from "next/link";
import { Search, Users2, ArrowRight } from "lucide-react";
import { listPublicMembers } from "@/lib/services/members";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui/primitives";
import { db } from "@/db";
import { teams, members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  board: "Board",
  executive: "Executive",
  committee: "Committee",
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; department?: string }>;
}) {
  const params = await searchParams;
  const [list, allTeams, allMembers] = await Promise.all([
    listPublicMembers({ q: params.q, category: params.category, department: params.department }),
    db.select().from(teams).orderBy(teams.name),
    db.select().from(members).where(eq(members.isActive, true)),
  ]);

  // Compute department counts across all active members
  const deptCountMap = new Map<string, number>();
  for (const m of allMembers) {
    if (m.department) {
      deptCountMap.set(m.department, (deptCountMap.get(m.department) ?? 0) + 1);
    }
  }

  const departments = Array.from(deptCountMap.keys()).sort();
  const activeDept = params.department ?? "";

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient treatment */}
      <div
        aria-hidden="true"
        className="background-glow background-glow-orange bg-glow-lg"
        style={{ left: "-5%", top: "-8%" }}
      />
      <div
        aria-hidden="true"
        className="background-glow background-glow-red bg-glow-md"
        style={{ right: "-4%", top: "6%" }}
      />

      {/* Main Container Card — matches reference screenshot 1 */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[#ffd6b0] bg-white/90 p-6 sm:p-10 lg:p-12 shadow-[0_15px_45px_rgba(24,36,58,0.06)] backdrop-blur-xl">
          {/* Badge: BY DEPARTMENT — matches Screenshot 1 */}
          <div className="inline-flex items-center rounded-full border border-[#fed7aa] bg-[#fff1e6] px-4 py-1 text-xs font-black tracking-widest text-[#c2410c] uppercase">
            BY DEPARTMENT
          </div>

          {/* Heading — matches Screenshot 1 */}
          <h1 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-tight text-[#18243a]">
            Department-wise Council Listing
          </h1>
          <p className="mt-2.5 max-w-3xl text-base text-[#4b5563]">
            Explore student council representatives and committee delegates across every department at PPG Institute of Technology.
          </p>

          {/* Department Filter Chips Bar — matches Screenshot 1 */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <Link
              href="/members"
              className={cn(
                "focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200",
                !activeDept
                  ? "bg-[#ea580c] text-white shadow-[0_4px_14px_rgba(234,88,12,0.35)]"
                  : "border border-[#fed7aa] bg-white text-[#18243a] hover:border-[#ea580c] hover:bg-[#fff7ed] hover:text-[#ea580c]",
              )}
            >
              All Departments ({allMembers.length})
            </Link>

            {departments.map((d) => {
              const count = deptCountMap.get(d) ?? 0;
              const isActive = activeDept === d;
              return (
                <Link
                  key={d}
                  href={isActive ? "/members" : `/members?department=${encodeURIComponent(d)}`}
                  className={cn(
                    "focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-[#ea580c] text-white shadow-[0_4px_14px_rgba(234,88,12,0.35)]"
                      : "border border-[#fed7aa] bg-white text-[#18243a] hover:border-[#ea580c] hover:bg-[#fff7ed] hover:text-[#ea580c]",
                  )}
                >
                  {d} ({count})
                </Link>
              );
            })}
          </div>

          {/* Search & Category Filter Row */}
          <form className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#fed7aa] bg-[#fffcf8] p-3 shadow-xs">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Search member name or keyword…"
                className="focus-ring h-10 w-full rounded-xl border border-[#fed7aa] bg-white pl-9 pr-3 text-sm text-[#18243a]"
              />
            </div>

            <select
              name="category"
              defaultValue={params.category ?? ""}
              className="focus-ring h-10 rounded-xl border border-[#fed7aa] bg-white px-3 text-sm text-[#18243a]"
            >
              <option value="">All Tiers</option>
              <option value="board">Executive Board</option>
              <option value="executive">Executive</option>
              <option value="committee">Standing Committee</option>
            </select>

            {activeDept && (
              <input type="hidden" name="department" value={activeDept} />
            )}

            <button
              type="submit"
              className="focus-ring h-10 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ef4444] px-5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all hover:brightness-105"
            >
              Filter
            </button>
          </form>

          {/* Member Listing Cards — 2 columns to match Screenshot 1 faculty layout */}
          {list.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                icon={<Users2 className="h-6 w-6" />}
                title="No members found"
                description="Try clearing your department filter or search query."
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {list.map((m) => (
                <Link key={m.id} href={`/members/${m.slug}`} className="group block">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#fed7aa] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#f97316] hover:shadow-[0_10px_26px_rgba(24,36,58,0.08)]">
                    {/* Left: Round Avatar initials circle in solid vibrant orange */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] text-xl font-black text-white shadow-sm ring-2 ring-[#ffedd5]">
                        {m.fullName
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((n) => n[0].toUpperCase())
                          .join("")}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-extrabold text-[#18243a] transition-colors group-hover:text-[#ea580c]">
                          {m.fullName}
                        </p>
                        <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                          {m.position || CATEGORY_LABEL[m.category] || "Council Member"}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#6b7280]">
                          {m.department} · Year {m.year}
                        </p>
                      </div>
                    </div>

                    {/* Right: View Profile Button in solid vibrant orange — matches Screenshot 1 */}
                    <div className="shrink-0 self-start sm:self-auto">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#ea580c] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all group-hover:bg-[#c2410c] group-hover:shadow-md">
                        View More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
