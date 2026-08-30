import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { members, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole, hashPassword } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";
import { DEMO_PASSWORD } from "@/lib/constants";

// Verified import endpoint: the client parses the uploaded CSV/PDF-derived
// roster into rows and shows an admin a confirmation screen first. Only the
// rows the admin explicitly confirms are sent here, so existing member
// records are never silently overwritten.
const rowSchema = z.object({
  fullName: z.string().min(2),
  department: z.string().min(1),
  year: z.string().min(1),
  position: z.string().optional(),
  category: z.enum(["board", "executive", "committee"]).default("committee"),
  committeeName: z.string().optional(),
});

const schema = z.object({ rows: z.array(rowSchema).min(1).max(500) });

export async function POST(request: Request) {
  try {
    const user = await requireRole("admin");
    const { rows } = schema.parse(await request.json());

    const existingSlugs = await db.select({ slug: members.slug }).from(members);
    const slugSet = new Set(existingSlugs.map((s) => s.slug));

    let created = 0;
    for (const row of rows) {
      let slug = slugify(row.fullName);
      let counter = 1;
      while (slugSet.has(slug)) {
        counter += 1;
        slug = `${slugify(row.fullName)}-${counter}`;
      }
      slugSet.add(slug);

      const [member] = await db
        .insert(members)
        .values({
          slug,
          fullName: row.fullName,
          department: row.department,
          year: row.year,
          position: row.position,
          category: row.category,
          committeeName: row.committeeName,
          isDemo: false,
        })
        .returning();

      const email = `${slug}@council.ppgit.edu.in`;
      const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!existingUser) {
        const passwordHash = await hashPassword(DEMO_PASSWORD);
        await db.insert(users).values({ email, passwordHash, role: "member", memberId: member.id });
      }
      created += 1;
    }

    await logAudit({ userId: user.id, action: "members_imported", objectType: "member", metadata: { count: created }, request });

    return NextResponse.json({ ok: true, created });
  } catch (error) {
    return handleApiError(error);
  }
}
