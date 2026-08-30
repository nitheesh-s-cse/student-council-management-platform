import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { members, users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";
import { DEMO_PASSWORD } from "@/lib/constants";
import { eq } from "drizzle-orm";

const createSchema = z.object({
  fullName: z.string().min(2).max(160),
  position: z.string().optional(),
  department: z.string().min(1).max(40),
  year: z.string().min(1).max(10),
  category: z.enum(["board", "executive", "committee"]).default("committee"),
  committeeName: z.string().optional(),
  registerNumber: z.string().optional(),
  registerNumberVisible: z.boolean().default(false),
  bio: z.string().optional(),
  createLogin: z.boolean().default(true),
  email: z.string().email().optional(),
});

export async function GET() {
  try {
    await requireRole("admin");
    const rows = await db.select().from(members).orderBy(desc(members.createdAt));
    return NextResponse.json({ members: rows });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole("admin");
    const body = createSchema.parse(await request.json());

    const existingSlugs = await db.select({ slug: members.slug }).from(members);
    let slug = slugify(body.fullName);
    let counter = 1;
    const slugSet = new Set(existingSlugs.map((s) => s.slug));
    while (slugSet.has(slug)) {
      counter += 1;
      slug = `${slugify(body.fullName)}-${counter}`;
    }

    const [member] = await db
      .insert(members)
      .values({
        slug,
        fullName: body.fullName,
        position: body.position,
        department: body.department,
        year: body.year,
        category: body.category,
        committeeName: body.committeeName,
        registerNumber: body.registerNumber,
        registerNumberVisible: body.registerNumberVisible,
        bio: body.bio,
      })
      .returning();

    if (body.createLogin) {
      const email = body.email?.toLowerCase() ?? `${slug}@council.ppgit.edu.in`;
      const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!existingUser) {
        const passwordHash = await hashPassword(DEMO_PASSWORD);
        await db.insert(users).values({ email, passwordHash, role: "member", memberId: member.id });
      }
    }

    await logAudit({ userId: user.id, action: "member_created", objectType: "member", objectId: member.id, metadata: { fullName: member.fullName }, request });

    return NextResponse.json({ member });
  } catch (error) {
    return handleApiError(error);
  }
}
