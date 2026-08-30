import { getCurrentUser } from "@/lib/auth";
import { listPollsWithResults } from "@/lib/services/polls";
import { roleAtLeast } from "@/lib/constants";
import { PollsBoard } from "@/components/polls/polls-board";

export const dynamic = "force-dynamic";

export default async function PollsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const polls = await listPollsWithResults(user.id);
  const canCreate = roleAtLeast(user.role, "team_lead");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PollsBoard initialPolls={polls} canCreate={canCreate} />
    </div>
  );
}
