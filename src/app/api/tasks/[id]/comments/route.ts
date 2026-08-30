import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { taskComments, tasks, taskAssignees, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { notifyMany } from "@/lib/services/notifications";
import { inArray } from "drizzle-orm";

const schema = z.object({ content: z.string().min(1).max(2000) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const { content } = schema.parse(await request.json());
    const taskId = Number(id);

    const [comment] = await db.insert(taskComments).values({ taskId, authorUserId: user.id, content }).returning();

    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
    const assignees = await db.select({ memberId: taskAssignees.memberId }).from(taskAssignees).where(eq(taskAssignees.taskId, taskId));
    const memberIds = assignees.map((a) => a.memberId);
    const notifyUserIds = memberIds.length ? await db.select({ id: users.id }).from(users).where(inArray(users.memberId, memberIds)) : [];
    const recipientIds = new Set(notifyUserIds.map((u) => u.id));
    if (task?.createdByUserId) recipientIds.add(task.createdByUserId);
    recipientIds.delete(user.id);

    await notifyMany([...recipientIds], {
      type: "task_comment",
      title: "New comment on a task",
      body: content.slice(0, 140),
      link: `/tasks/${taskId}`,
    });

    return NextResponse.json({ comment });
  } catch (error) {
    return handleApiError(error);
  }
}
