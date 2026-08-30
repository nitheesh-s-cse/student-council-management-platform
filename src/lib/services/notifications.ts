import "server-only";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function notify(params: {
  userId: number;
  type: string;
  title: string;
  body?: string;
  link?: string;
}) {
  await db.insert(notifications).values(params);
}

export async function notifyMany(userIds: number[], params: Omit<Parameters<typeof notify>[0], "userId">) {
  if (userIds.length === 0) return;
  await db.insert(notifications).values(userIds.map((userId) => ({ userId, ...params })));
}

export async function listNotifications(userId: number, limit = 30) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function unreadCount(userId: number) {
  return db.$count(notifications, and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}
