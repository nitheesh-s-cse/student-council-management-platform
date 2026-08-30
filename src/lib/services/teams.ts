import "server-only";
import { db } from "@/db";
import { teams, teamMembers, members, tasks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function listTeamsWithCounts() {
  const rows = await db
    .select({
      id: teams.id,
      name: teams.name,
      slug: teams.slug,
      description: teams.description,
      color: teams.color,
      leadMemberId: teams.leadMemberId,
      memberCount: sql<number>`count(distinct ${teamMembers.id})`.mapWith(Number),
    })
    .from(teams)
    .leftJoin(teamMembers, eq(teamMembers.teamId, teams.id))
    .groupBy(teams.id)
    .orderBy(teams.name);
  return rows;
}

export async function getTeamBySlug(slug: string) {
  const [team] = await db.select().from(teams).where(eq(teams.slug, slug)).limit(1);
  if (!team) return null;

  const memberRows = await db
    .select({ member: members, roleInTeam: teamMembers.roleInTeam })
    .from(teamMembers)
    .innerJoin(members, eq(teamMembers.memberId, members.id))
    .where(eq(teamMembers.teamId, team.id));

  const teamTasks = await db.select().from(tasks).where(eq(tasks.teamId, team.id)).orderBy(tasks.createdAt);

  return { team, members: memberRows, tasks: teamTasks };
}

export async function getMemberTeamIds(memberId: number) {
  const rows = await db.select({ teamId: teamMembers.teamId }).from(teamMembers).where(eq(teamMembers.memberId, memberId));
  return rows.map((r) => r.teamId);
}
