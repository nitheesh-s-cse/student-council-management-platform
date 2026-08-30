import Link from "next/link";
import { Search, Users2 } from "lucide-react";
import { listPublicMembers } from "@/lib/services/members";
import { Card, Badge, Avatar, EmptyState, SectionHeading } from "@/components/ui/primitives";
import { db } from "@/db";
import { teams } from "@/db/schema";

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
  const [list, allTeams] = await Promise.all([
    listPublicMembers({ q: params.q, category: params.category, department: params.department }),
    db.select().from(teams).orderBy(teams.name),
  ]);

  const departments = Array.from(new Set(list.map((m) => m.department))).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Council roster"
        title="Member Directory"
        description="Every elected board member, executive member and committee member of the PPGIT Student Council."
      />

      <form className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Search by name or department…"
            className="focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm"
          />
        </div>
        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="focus-ring h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="">All categories</option>
          <option value="board">Board</option>
          <option value="executive">Executive</option>
          <option value="committee">Committee</option>
        </select>
        <select
          name="department"
          defaultValue={params.department ?? ""}
          className="focus-ring h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button type="submit" className="focus-ring h-10 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700">
          Filter
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        {allTeams.map((t) => (
          <Badge key={t.id} tone="neutral">{t.name}</Badge>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={<Users2 className="h-6 w-6" />} title="No members found" description="Try adjusting your search or filters." />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((m) => (
            <Link key={m.id} href={`/members/${m.slug}`}>
              <Card className="p-5 transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-lg)]">
                <div className="flex items-center gap-3">
                  <Avatar name={m.fullName} src={m.photoUrl} size={48} />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-[var(--text)]">{m.fullName}</p>
                    <p className="truncate text-xs text-muted">{m.department} · Year {m.year}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <Badge tone="brand">{CATEGORY_LABEL[m.category]}</Badge>
                  {m.position && <Badge tone="neutral">{m.position}</Badge>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
