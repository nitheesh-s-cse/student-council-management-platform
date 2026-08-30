import "server-only";
import { cookies, headers } from "next/headers";
import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { sessions, users, members } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

import { DEMO_PASSWORD, SESSION_COOKIE } from "@/lib/constants";
export { SESSION_COOKIE };
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  id: number;
  email: string;
  role: "super_admin" | "admin" | "board" | "team_lead" | "member";
  memberId: number | null;
  memberName: string | null;
  memberSlug: string | null;
  photoUrl: string | null;
  theme: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const h = await headers();

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
    userAgent: h.get("user-agent") ?? undefined,
    ipAddress: h.get("x-forwarded-for") ?? undefined,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      memberId: users.memberId,
      theme: users.theme,
      memberName: members.fullName,
      memberSlug: members.slug,
      photoUrl: members.photoUrl,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .leftJoin(members, eq(users.memberId, members.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  if (!row || !row.isActive) return null;

  return {
    id: row.id,
    email: row.email,
    role: row.role,
    memberId: row.memberId,
    memberName: row.memberName,
    memberSlug: row.memberSlug,
    photoUrl: row.photoUrl,
    theme: row.theme,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Authentication required", 401);
  }
  return user;
}

export async function requireRole(minRole: SessionUser["role"] | SessionUser["role"][]) {
  const user = await requireUser();
  const allowed = Array.isArray(minRole) ? minRole : [minRole];
  const { ROLE_RANK } = await import("@/lib/constants");
  const minRank = Math.min(...allowed.map((r) => ROLE_RANK[r] ?? 99));
  if ((ROLE_RANK[user.role] ?? 0) < minRank) {
    throw new AuthError("Insufficient permissions", 403);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export function getClientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
