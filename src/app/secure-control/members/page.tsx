import { db } from "@/db";
import { members } from "@/db/schema";
import { desc } from "drizzle-orm";
import { MembersManager } from "@/components/admin/members-manager";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const rows = await db.select().from(members).orderBy(desc(members.createdAt));

  return (
    <div className="section-soft relative">
      <div aria-hidden="true" className="bg-glow bg-glow-warm bg-glow-md" style={{ left: "-5%", top: "-10%" }} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <MembersManager initialMembers={rows} />
      </div>
    </div>
  );
}
