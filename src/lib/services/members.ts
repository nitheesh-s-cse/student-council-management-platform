import "server-only";
import { db } from "@/db";
import { members, teamMembers, teams, taskAssignees, tasks, eventParticipants, events } from "@/db/schema";
import { and, eq, ilike, or, desc } from "drizzle-orm";

export async function listPublicMembers(params: { q?: string; category?: string; department?: string } = {}) {
  const conditions = [eq(members.isActive, true)];
  if (params.q) {
    conditions.push(
      or(ilike(members.fullName, `%${params.q}%`), ilike(members.department, `%${params.q}%`))!,
    );
  }
  if (params.category) conditions.push(eq(members.category, params.category as "board" | "executive" | "committee"));
  if (params.department) conditions.push(eq(members.department, params.department));

  return db
    .select()
    .from(members)
    .where(and(...conditions))
    .orderBy(members.fullName);
}

export async function getMemberBySlug(slug: string) {
  const rows = await db.select().from(members).where(eq(members.slug, slug)).limit(1);
  const member = rows[0];
  if (!member) return null;

  const teamRows = await db
    .select({ team: teams })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teamMembers.memberId, member.id));

  const assignedTasks = await db
    .select({ task: tasks })
    .from(taskAssignees)
    .innerJoin(tasks, eq(taskAssignees.taskId, tasks.id))
    .where(eq(taskAssignees.memberId, member.id))
    .orderBy(desc(tasks.updatedAt));

  const participatedEvents = await db
    .select({ event: events })
    .from(eventParticipants)
    .innerJoin(events, eq(eventParticipants.eventId, events.id))
    .where(eq(eventParticipants.memberId, member.id))
    .orderBy(desc(events.date));

  return {
    member,
    teams: teamRows.map((t) => t.team),
    tasks: assignedTasks.map((t) => t.task),
    events: participatedEvents.map((e) => e.event),
  };
}
