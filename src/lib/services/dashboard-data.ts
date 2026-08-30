import "server-only";
import { db } from "@/db";
import { teams, members } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function listTeamsForSelect() {
  return db.select({ id: teams.id, name: teams.name }).from(teams).orderBy(teams.name);
}

export async function listMembersForSelect() {
  return db
    .select({ id: members.id, fullName: members.fullName, department: members.department })
    .from(members)
    .where(eq(members.isActive, true))
    .orderBy(members.fullName);
}
