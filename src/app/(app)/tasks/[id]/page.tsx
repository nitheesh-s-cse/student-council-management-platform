import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTaskDetail } from "@/lib/services/tasks";
import { TaskWorkspace } from "@/components/tasks/task-workspace";
import { roleAtLeast } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const detail = await getTaskDetail(Number(id));
  if (!detail) notFound();

  const canManage = roleAtLeast(user.role, "team_lead") || detail.task.createdByUserId === user.id;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <TaskWorkspace detail={detail} canManage={canManage} currentUserId={user.id} />
    </div>
  );
}
