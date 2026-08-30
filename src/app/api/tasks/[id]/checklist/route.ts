import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { taskChecklistItems, tasks } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";

const toggleSchema = z.object({ itemId: z.number().int(), done: z.boolean() });
const addSchema = z.object({ label: z.string().min(1).max(240) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const { id } = await params;
    const { itemId, done } = toggleSchema.parse(await request.json());
    await db.update(taskChecklistItems).set({ done }).where(and(eq(taskChecklistItems.id, itemId), eq(taskChecklistItems.taskId, Number(id))));

    const items = await db.select().from(taskChecklistItems).where(eq(taskChecklistItems.taskId, Number(id)));
    const progress = items.length ? Math.round((items.filter((i) => i.done).length / items.length) * 100) : 0;
    await db.update(tasks).set({ progress, updatedAt: new Date() }).where(eq(tasks.id, Number(id)));

    return NextResponse.json({ ok: true, progress });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const { id } = await params;
    const { label } = addSchema.parse(await request.json());
    const existing = await db.select().from(taskChecklistItems).where(eq(taskChecklistItems.taskId, Number(id)));
    const [item] = await db
      .insert(taskChecklistItems)
      .values({ taskId: Number(id), label, position: existing.length })
      .returning();
    return NextResponse.json({ item });
  } catch (error) {
    return handleApiError(error);
  }
}
