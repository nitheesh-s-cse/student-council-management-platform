import { getCurrentUser } from "@/lib/auth";
import { listAllTasks, listTasksForMember } from "@/lib/services/tasks";
import { listTeamsForSelect, listMembersForSelect } from "@/lib/services/dashboard-data";
import { roleAtLeast } from "@/lib/constants";
import { TaskBoard } from "@/components/tasks/task-board";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const canCreate = roleAtLeast(user.role, "team_lead");
  const isPrivileged = roleAtLeast(user.role, "board");

  const [tasks, teams, membersList] = await Promise.all([
    isPrivileged ? listAllTasks() : user.memberId ? listTasksForMember(user.memberId) : Promise.resolve([]),
    canCreate ? listTeamsForSelect() : Promise.resolve([]),
    canCreate ? listMembersForSelect() : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <TaskBoard initialTasks={tasks} canCreate={canCreate} teams={teams} members={membersList} currentUserId={user.id} />
    </div>
  );
}
