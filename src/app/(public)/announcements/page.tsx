import { Megaphone } from "lucide-react";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, Badge, EmptyState, SectionHeading } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { ANNOUNCEMENT_PRIORITY_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PublicAnnouncementsPage() {
  const rows = await db
    .select()
    .from(announcements)
    .where(eq(announcements.audience, "everyone"))
    .orderBy(desc(announcements.publishAt));

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Council notices"
        title="Announcements"
        description="Public updates published by the council board for the entire student community."
      />
      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={<Megaphone className="h-6 w-6" />} title="No announcements yet" description="Check back soon for council updates." />
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {rows.map((a) => (
            <Card key={a.id} className="p-4.5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <p className="text-base sm:text-[16px] font-semibold text-[var(--text)] min-w-0 flex-1">{a.title}</p>
                {a.priority !== "normal" && (
                  <Badge tone={a.priority === "urgent" ? "danger" : "warning"} className="shrink-0 self-start sm:self-auto">{ANNOUNCEMENT_PRIORITY_LABELS[a.priority]}</Badge>
                )}
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{a.content}</p>
              <p className="mt-4 text-xs text-muted">Published {formatDate(a.publishAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
