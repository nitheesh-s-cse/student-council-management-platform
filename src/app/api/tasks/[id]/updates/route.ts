import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { taskUpdates, tasks } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

const schema = z.object({ content: z.string().min(1).max(2000), progress: z.number().min(0).max(100).optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const taskId = Number(id);
    const { content, progress } = schema.parse(await request.json());

    const [update] = await db.insert(taskUpdates).values({ taskId, authorUserId: user.id, content, progress }).returning();

    if (progress !== undefined) {
      await db.update(tasks).set({ progress, updatedAt: new Date() }).where(eq(tasks.id, taskId));
    }

    await logAudit({ userId: user.id, action: "task_progress_update", objectType: "task", objectId: taskId, metadata: { progress }, request });

    return NextResponse.json({ update });
  } catch (error) {
    return handleApiError(error);
  }
}
