import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks, taskAssignees } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { notifyMany } from "@/lib/services/notifications";
import { getTaskDetail } from "@/lib/services/tasks";
import { TASK_STATUSES, TASK_PRIORITIES, roleAtLeast } from "@/lib/constants";

async function canManage(userId: number, role: string, taskId: number, memberId: number | null) {
  if (roleAtLeast(role, "board")) return true;
  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!task) return false;
  if (task.createdByUserId === userId) return true;
  if (memberId) {
    const [assignee] = await db
      .select()
      .from(taskAssignees)
      .where(eq(taskAssignees.taskId, taskId))
      .limit(1);
    if (assignee && assignee.memberId === memberId) return true;
  }
  return false;
}

const updateSchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  progress: z.number().min(0).max(100).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  deadline: z.string().nullable().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const { id } = await params;
    const detail = await getTaskDetail(Number(id));
    if (!detail) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const taskId = Number(id);

    const allowed = await canManage(user.id, user.role, taskId, user.memberId);
    if (!allowed) return NextResponse.json({ error: "You cannot modify this task." }, { status: 403 });

    const body = updateSchema.parse(await request.json());
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status) updates.status = body.status;
    if (body.progress !== undefined) updates.progress = body.progress;
    if (body.priority && roleAtLeast(user.role, "team_lead")) updates.priority = body.priority;
    if (body.title && roleAtLeast(user.role, "team_lead")) updates.title = body.title;
    if (body.description !== undefined && roleAtLeast(user.role, "team_lead")) updates.description = body.description;
    if (body.deadline !== undefined && roleAtLeast(user.role, "team_lead")) {
      updates.deadline = body.deadline ? new Date(body.deadline) : null;
    }

    const [task] = await db.update(tasks).set(updates).where(eq(tasks.id, taskId)).returning();

    if (body.status === "completed") {
      const creatorIds = task.createdByUserId ? [task.createdByUserId] : [];
      await notifyMany(creatorIds, {
        type: "task_completed",
        title: "A task was marked completed",
        body: task.title,
        link: `/tasks/${task.id}`,
      });
    }

    await logAudit({ userId: user.id, action: "task_updated", objectType: "task", objectId: taskId, metadata: updates, request });

    return NextResponse.json({ task });
  } catch (error) {
    return handleApiError(error);
  }
}
