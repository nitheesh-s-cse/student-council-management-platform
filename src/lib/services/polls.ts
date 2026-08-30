import "server-only";
import { db } from "@/db";
import { polls, pollOptions, pollVotes, users, members } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function listPollsWithResults(currentUserId: number) {
  const allPolls = await db.select().from(polls).orderBy(desc(polls.createdAt));
  const results = [];
  for (const poll of allPolls) {
    const options = await db.select().from(pollOptions).where(eq(pollOptions.pollId, poll.id)).orderBy(pollOptions.position);
    const votes = await db.select().from(pollVotes).where(eq(pollVotes.pollId, poll.id));
    const myVotes = votes.filter((v) => v.userId === currentUserId).map((v) => v.optionId);

    let voters: { name: string; optionId: number }[] = [];
    if (!poll.anonymous) {
      const voterRows = await db
        .select({ userId: pollVotes.userId, optionId: pollVotes.optionId, memberName: members.fullName, email: users.email })
        .from(pollVotes)
        .innerJoin(users, eq(pollVotes.userId, users.id))
        .leftJoin(members, eq(users.memberId, members.id))
        .where(eq(pollVotes.pollId, poll.id));
      voters = voterRows.map((v) => ({ name: v.memberName ?? v.email, optionId: v.optionId }));
    }

    results.push({
      poll,
      options: options.map((o) => ({
        ...o,
        voteCount: votes.filter((v) => v.optionId === o.id).length,
      })),
      totalVoters: new Set(votes.map((v) => v.userId)).size,
      myVotes,
      voters,
    });
  }
  return results;
}
