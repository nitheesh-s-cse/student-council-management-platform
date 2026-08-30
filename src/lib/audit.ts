import "server-only";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export async function logAudit(params: {
  userId?: number | null;
  action: string;
  objectType?: string;
  objectId?: string | number;
  metadata?: Record<string, unknown>;
  request?: Request;
}) {
  const { userId, action, objectType, objectId, metadata, request } = params;
  await db.insert(auditLogs).values({
    userId: userId ?? null,
    action,
    objectType,
    objectId: objectId !== undefined ? String(objectId) : undefined,
    metadata: metadata ?? {},
    ipAddress: request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: request?.headers.get("user-agent") ?? undefined,
  });
}
