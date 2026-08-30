import { NextResponse } from "next/server";
import { eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { users, members } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await db
      .select({ id: users.id, email: users.email, memberName: members.fullName, photoUrl: members.photoUrl, department: members.department, role: users.role })
      .from(users)
      .leftJoin(members, eq(users.memberId, members.id))
      .where(ne(users.id, user.id));
    return NextResponse.json({ users: rows });
  } catch (error) {
    return handleApiError(error);
  }
}
