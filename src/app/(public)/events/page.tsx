import { CalendarDays } from "lucide-react";
import { db } from "@/db";
import { events, teams } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { Card, Badge, EmptyState, SectionHeading } from "@/components/ui/primitives";
import { formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "neutral" | "brand" | "success" | "warning" | "danger" | "info"> = {
  planned: "info",
  confirmed: "brand",
  ongoing: "warning",
  completed: "success",
  cancelled: "danger",
};

export default async function PublicEventsPage() {
  const rows = await db
    .select({ event: events, team: teams })
    .from(events)
    .leftJoin(teams, eq(events.teamId, teams.id))
    .where(eq(events.isPublic, true))
    .orderBy(asc(events.date));

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Council calendar"
        title="Events"
        description="Public council events — festivals, orientation programs and campus-wide activities."
      />
      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="No public events yet" description="New council events will appear here as soon as they're published." />
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {rows.map(({ event, team }) => (
            <Card key={event.id} className="flex flex-col gap-4 p-4.5 sm:p-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
                <span className="text-[11px] font-semibold uppercase">{new Date(event.date).toLocaleString("en-IN", { month: "short" })}</span>
                <span className="text-xl font-bold leading-none">{new Date(event.date).getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-base sm:text-[16px] font-semibold text-[var(--text)] min-w-0 flex-1">{event.title}</p>
                  <Badge tone={STATUS_TONE[event.status]} className="shrink-0 self-start sm:self-auto">{event.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{event.description}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span>{formatDate(event.date)} · {formatTime(event.date)}</span>
                  {event.venue && <span>{event.venue}</span>}
                  {team && <span>Organized by {team.name}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
