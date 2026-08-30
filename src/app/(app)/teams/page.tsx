import Link from "next/link";
import { Users2 } from "lucide-react";
import { listTeamsWithCounts } from "@/lib/services/teams";
import { Card, EmptyState } from "@/components/ui/primitives";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const teams = await listTeamsWithCounts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Council Teams</h1>
      <p className="mt-1 text-sm text-muted">Nine standing committees that run the council's day-to-day operations.</p>

      {teams.length === 0 ? (
        <div className="mt-8"><EmptyState icon={<Users2 className="h-6 w-6" />} title="No teams yet" /></div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => (
            <Link key={t.id} href={`/teams/${t.slug}`}>
              <Card className="p-6 transition-shadow hover:shadow-[var(--shadow-card-lg)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                  <Users2 className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-[var(--text)]">{t.name}</p>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted">{t.description}</p>
                <p className="mt-4 text-xs font-medium text-muted">{t.memberCount} members</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
