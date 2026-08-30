import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { polls, pollOptions, users, members } from "@/db/schema";
import { requireRole, requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { notifyMany } from "@/lib/services/notifications";
import { ne } from "drizzle-orm";

const createSchema = z.object({
  question: z.string().min(3).max(260),
  description: z.string().optional(),
  type: z.enum(["single", "multiple", "yes_no"]).default("single"),
  anonymous: z.boolean().default(false),
  options: z.array(z.string().min(1)).min(2).max(10).optional(),
  closesAt: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const user = await requireRole(["board", "admin", "super_admin", "team_lead"]);
    const body = createSchema.parse(await request.json());

    const options = body.type === "yes_no" ? ["Yes", "No"] : body.options ?? [];
    if (options.length < 2) {
      return NextResponse.json({ error: "A poll needs at least two options." }, { status: 422 });
    }

    const [poll] = await db
      .insert(polls)
      .values({
        question: body.question,
        description: body.description,
        type: body.type,
        anonymous: body.anonymous,
        createdByUserId: user.id,
        closesAt: body.closesAt ? new Date(body.closesAt) : null,
      })
      .returning();

    await db.insert(pollOptions).values(options.map((label, i) => ({ pollId: poll.id, label, position: i })));

    const allUsers = await db.select({ id: users.id }).from(users).where(ne(users.id, user.id));
    await notifyMany(allUsers.map((u) => u.id), { type: "poll_created", title: "New poll available", body: poll.question, link: "/polls" });

    await logAudit({ userId: user.id, action: "poll_created", objectType: "poll", objectId: poll.id, request });

    return NextResponse.json({ poll });
  } catch (error) {
    return handleApiError(error);
  }
}
