import "server-only";
import { db } from "@/db";
import { members, teams, tasks, events, polls, pollVotes, users, auditLogs } from "@/db/schema";
import { and, desc, eq, gte, lt, ne, isNotNull } from "drizzle-orm";

export async function getAdminOverview() {
  const [totalMembers, activeMembers, teamCount, totalTasks, completedTasks, overdueTasks, upcomingEvents, totalPolls, auditRecent] =
    await Promise.all([
      db.$count(members),
      db.$count(members, eq(members.isActive, true)),
      db.$count(teams),
      db.$count(tasks),
      db.$count(tasks, eq(tasks.status, "completed")),
      db.$count(tasks, and(isNotNull(tasks.deadline), lt(tasks.deadline, new Date()), ne(tasks.status, "completed"))),
      db.$count(events, gte(events.date, new Date())),
      db.$count(polls),
      db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(8),
    ]);

  const allTasks = await db.select().from(tasks);
  const statusCounts: Record<string, number> = {};
  for (const t of allTasks) statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1;

  const allTeams = await db.select().from(teams);
  const teamPerformance = allTeams.map((t) => {
    const teamTasks = allTasks.filter((task) => task.teamId === t.id);
    const done = teamTasks.filter((task) => task.status === "completed").length;
    return { name: t.name, total: teamTasks.length, completed: done, pct: teamTasks.length ? Math.round((done / teamTasks.length) * 100) : 0 };
  });

  return {
    totalMembers,
    activeMembers,
    teamCount,
    totalTasks,
    completedTasks,
    overdueTasks,
    upcomingEvents,
    totalPolls,
    statusCounts,
    teamPerformance,
    recentAudit: auditRecent,
  };
}
