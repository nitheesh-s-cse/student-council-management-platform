import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "@/components/app/profile-form";
import { Card, Badge, Avatar } from "@/components/ui/primitives";
import { ROLE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!user.memberId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-8 text-center">
          <p className="text-sm font-semibold text-[var(--text)]">System administrator account</p>
          <p className="mt-1 text-sm text-muted">This account manages the platform and is not linked to a public council member profile.</p>
        </Card>
      </div>
    );
  }

  const [member] = await db.select().from(members).where(eq(members.id, user.memberId)).limit(1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Avatar name={member.fullName} src={member.photoUrl} size={72} />
        <div>
          <h1 className="text-xl font-semibold text-[var(--text)]">{member.fullName}</h1>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge tone="brand">{ROLE_LABELS[user.role]}</Badge>
            <Badge tone="neutral">{member.department} · Year {member.year}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProfileForm member={member} />
      </div>
    </div>
  );
}
