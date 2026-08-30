import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";

const schema = z.object({ theme: z.enum(["light", "dark", "system"]) });

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { theme } = schema.parse(await request.json());
    await db.update(users).set({ theme }).where(eq(users.id, user.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
