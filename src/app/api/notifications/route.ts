import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { listNotifications } from "@/lib/services/notifications";

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await listNotifications(user.id, 50);
    return NextResponse.json({ notifications: rows });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH() {
  try {
    const user = await requireUser();
    await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.userId, user.id), eq(notifications.isRead, false)));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
