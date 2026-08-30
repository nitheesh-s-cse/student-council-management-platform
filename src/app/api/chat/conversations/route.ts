import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { listConversationsForUser, getOrCreateDirectConversation } from "@/lib/services/chat";

export async function GET() {
  try {
    const user = await requireUser();
    const conversations = await listConversationsForUser(user.id);
    return NextResponse.json({ conversations });
  } catch (error) {
    return handleApiError(error);
  }
}

const schema = z.object({ userId: z.number().int() });

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { userId } = schema.parse(await request.json());
    if (userId === user.id) {
      return NextResponse.json({ error: "You cannot message yourself." }, { status: 400 });
    }
    const conv = await getOrCreateDirectConversation(user.id, userId);
    return NextResponse.json({ conversation: conv });
  } catch (error) {
    return handleApiError(error);
  }
}
