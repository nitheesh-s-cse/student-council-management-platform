import { db } from "@/db";
import { members } from "@/db/schema";
import { desc } from "drizzle-orm";
import { MembersManager } from "@/components/admin/members-manager";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const rows = await db.select().from(members).orderBy(desc(members.createdAt));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <MembersManager initialMembers={rows} />
    </div>
  );
}
