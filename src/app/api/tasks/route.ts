import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { tasks, taskAssignees, taskChecklistItems, conversations, conversationMembers, members, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { requireRole, requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { notifyMany } from "@/lib/services/notifications";
import { nextTaskCode, listAllTasks, listTasksForMember } from "@/lib/services/tasks";
import { TASK_PRIORITIES } from "@/lib/constants";

const createSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(4000).optional(),
  teamId: z.number().int().optional().nullable(),
  memberIds: z.array(z.number().int()).default([]),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  deadline: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  checklist: z.array(z.string().min(1)).default([]),
});

export async function GET() {
  try {
    const user = await requireUser();
    const isPrivileged = ["super_admin", "admin", "board"].includes(user.role);
    const all = isPrivileged ? await listAllTasks() : user.memberId ? await listTasksForMember(user.memberId) : [];
    return NextResponse.json({ tasks: all });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(["team_lead", "board", "admin", "super_admin"]);
    const body = createSchema.parse(await request.json());

    const code = await nextTaskCode();
    const [task] = await db
      .insert(tasks)
      .values({
        code,
        title: body.title,
        description: body.description,
        createdByUserId: user.id,
        teamId: body.teamId ?? null,
        priority: body.priority,
        status: body.memberIds.length > 0 ? "assigned" : "backlog",
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        deadline: body.deadline ? new Date(body.deadline) : null,
      })
      .returning();

    if (body.memberIds.length > 0) {
      await db.insert(taskAssignees).values(body.memberIds.map((memberId) => ({ taskId: task.id, memberId })));
    }

    if (body.checklist.length > 0) {
      await db.insert(taskChecklistItems).values(
        body.checklist.map((label, i) => ({ taskId: task.id, label, position: i })),
      );
    }

    const [taskConv] = await db
      .insert(conversations)
      .values({ type: "task", name: `${task.code} discussion`, taskId: task.id })
      .returning();

    const assigneeUsers = body.memberIds.length
      ? await db.select({ userId: users.id }).from(users).where(inArray(users.memberId, body.memberIds))
      : [];
    const participantIds = new Set([user.id, ...assigneeUsers.map((a) => a.userId)]);
    for (const uid of participantIds) {
      await db.insert(conversationMembers).values({ conversationId: taskConv.id, userId: uid });
    }

    await notifyMany(
      assigneeUsers.map((a) => a.userId),
      { type: "task_assigned", title: "You were assigned a new task", body: task.title, link: `/tasks/${task.id}` },
    );

    await logAudit({ userId: user.id, action: "task_created", objectType: "task", objectId: task.id, metadata: { title: task.title }, request });

    return NextResponse.json({ task });
  } catch (error) {
    return handleApiError(error);
  }
}
