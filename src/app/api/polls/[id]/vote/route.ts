import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { polls, pollOptions, pollVotes } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

const schema = z.object({ optionIds: z.array(z.number().int()).min(1) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const pollId = Number(id);
    const { optionIds } = schema.parse(await request.json());

    const [poll] = await db.select().from(polls).where(eq(polls.id, pollId)).limit(1);
    if (!poll) return NextResponse.json({ error: "Poll not found." }, { status: 404 });
    if (poll.closesAt && new Date(poll.closesAt) < new Date()) {
      return NextResponse.json({ error: "This poll has closed." }, { status: 400 });
    }

    const existing = await db.select().from(pollVotes).where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.userId, user.id)));
    if (existing.length > 0) {
      return NextResponse.json({ error: "You have already voted in this poll." }, { status: 409 });
    }

    const validOptions = await db.select().from(pollOptions).where(eq(pollOptions.pollId, pollId));
    const validIds = new Set(validOptions.map((o) => o.id));
    const chosen = poll.type === "multiple" ? optionIds : [optionIds[0]];
    for (const optionId of chosen) {
      if (!validIds.has(optionId)) return NextResponse.json({ error: "Invalid option." }, { status: 422 });
    }

    await db.insert(pollVotes).values(chosen.map((optionId) => ({ pollId, optionId, userId: user.id })));
    await logAudit({ userId: user.id, action: "poll_voted", objectType: "poll", objectId: pollId, request });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
