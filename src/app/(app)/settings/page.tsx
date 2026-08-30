import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "@/components/app/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const [row] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your account security, theme and notification preferences.</p>
      <div className="mt-8">
        <SettingsForm notifyEmail={row.notifyEmail} notifyPush={row.notifyPush} email={row.email} />
      </div>
    </div>
  );
}
