import "server-only";
import { db } from "@/db";
import { tasks, taskAssignees, members, teams, taskChecklistItems, taskComments, taskUpdates, users, conversations } from "@/db/schema";
import { eq, desc, inArray, sql } from "drizzle-orm";

export async function nextTaskCode() {
  const [row] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(tasks);
  return `PPG-${100 + (row?.count ?? 0) + 1}`;
}

export async function listTasksForMember(memberId: number) {
  const assignedTaskIds = await db
    .select({ taskId: taskAssignees.taskId })
    .from(taskAssignees)
    .where(eq(taskAssignees.memberId, memberId));
  const ids = assignedTaskIds.map((r) => r.taskId);
  if (ids.length === 0) return [];
  return db.select().from(tasks).where(inArray(tasks.id, ids)).orderBy(desc(tasks.updatedAt));
}

export async function listAllTasks() {
  return db.select().from(tasks).orderBy(desc(tasks.updatedAt));
}

export async function getTaskDetail(taskId: number) {
  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!task) return null;

  const [team] = task.teamId ? await db.select().from(teams).where(eq(teams.id, task.teamId)).limit(1) : [null];

  const assignees = await db
    .select({ member: members })
    .from(taskAssignees)
    .innerJoin(members, eq(taskAssignees.memberId, members.id))
    .where(eq(taskAssignees.taskId, taskId));

  const checklist = await db
    .select()
    .from(taskChecklistItems)
    .where(eq(taskChecklistItems.taskId, taskId))
    .orderBy(taskChecklistItems.position);

  const comments = await db
    .select({ comment: taskComments, authorEmail: users.email, authorRole: users.role, memberName: members.fullName, memberPhoto: members.photoUrl })
    .from(taskComments)
    .leftJoin(users, eq(taskComments.authorUserId, users.id))
    .leftJoin(members, eq(users.memberId, members.id))
    .where(eq(taskComments.taskId, taskId))
    .orderBy(taskComments.createdAt);

  const updates = await db
    .select({ update: taskUpdates, memberName: members.fullName, memberPhoto: members.photoUrl })
    .from(taskUpdates)
    .leftJoin(users, eq(taskUpdates.authorUserId, users.id))
    .leftJoin(members, eq(users.memberId, members.id))
    .where(eq(taskUpdates.taskId, taskId))
    .orderBy(desc(taskUpdates.createdAt));

  const creator = task.createdByUserId
    ? await db
        .select({ email: users.email, memberName: members.fullName })
        .from(users)
        .leftJoin(members, eq(users.memberId, members.id))
        .where(eq(users.id, task.createdByUserId))
        .limit(1)
    : [];

  const [taskConversation] = await db.select({ id: conversations.id }).from(conversations).where(eq(conversations.taskId, taskId)).limit(1);

  return {
    task,
    team,
    assignees: assignees.map((a) => a.member),
    checklist,
    comments,
    updates,
    creatorName: creator[0]?.memberName ?? creator[0]?.email ?? "Council Admin",
    conversationId: taskConversation?.id ?? null,
  };
}
