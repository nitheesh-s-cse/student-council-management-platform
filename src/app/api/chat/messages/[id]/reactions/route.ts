import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { messageReactions } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({ emoji: z.string().min(1).max(8) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const { emoji } = schema.parse(await request.json());
    const messageId = Number(id);

    const [existing] = await db
      .select()
      .from(messageReactions)
      .where(and(eq(messageReactions.messageId, messageId), eq(messageReactions.userId, user.id), eq(messageReactions.emoji, emoji)))
      .limit(1);

    if (existing) {
      await db.delete(messageReactions).where(eq(messageReactions.id, existing.id));
      return NextResponse.json({ removed: true });
    }

    const [reaction] = await db.insert(messageReactions).values({ messageId, userId: user.id, emoji }).returning();
    return NextResponse.json({ reaction });
  } catch (error) {
    return handleApiError(error);
  }
}
