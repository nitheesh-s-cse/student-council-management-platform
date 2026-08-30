import { getCurrentUser } from "@/lib/auth";
import { listNotifications } from "@/lib/services/notifications";
import { NotificationsList } from "@/components/notifications/notifications-list";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const notifications = await listNotifications(user.id, 50);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <NotificationsList initialNotifications={notifications} />
    </div>
  );
}
