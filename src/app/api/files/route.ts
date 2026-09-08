import { NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { saveUploadedFile, MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Upload a file. The binary content goes to the private Supabase Storage
// bucket; only metadata is written to the `files` table. Board members and
// above can upload.
export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const form = await request.formData();
    const uploaded = form.get("file");
    if (!(uploaded instanceof File)) {
      return NextResponse.json({ error: "No file provided. Send it in a form field named 'file'." }, { status: 400 });
    }
    if (uploaded.size === 0) {
      return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
    }
    if (uploaded.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File is too large. Max size is ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} MB.` }, { status: 413 });
    }
    if (!ALLOWED_MIME_TYPES.has(uploaded.type)) {
      return NextResponse.json({ error: `Unsupported file type "${uploaded.type}".` }, { status: 415 });
    }

    const { bucket, storageKey, size } = await saveUploadedFile(uploaded);

    const [row] = await db
      .insert(files)
      .values({
        ownerUserId: user.id,
        originalName: uploaded.name,
        storageKey,
        mimeType: uploaded.type || "application/octet-stream",
        size,
      })
      .returning({ id: files.id });

    await logAudit({
      userId: user.id,
      action: "file_uploaded",
      objectType: "file",
      objectId: row.id,
      metadata: { bucket, name: uploaded.name, mimeType: uploaded.type, size },
      request,
    });

    return NextResponse.json({ ok: true, id: row.id, name: uploaded.name, size });
  } catch (error) {
    return handleApiError(error);
  }
}

// List files the current user may see. Board members and above see every
// file in the council library; anyone else only sees their own uploads.
export async function GET() {
  try {
    const user = await requireUser();
    const isPrivileged = ["super_admin", "admin", "board"].includes(user.role);

    if (isPrivileged) {
      const rows = await db.select().from(files).orderBy(files.createdAt);
      return NextResponse.json({ files: rows });
    }

    const rows = await db.select().from(files).where(eq(files.ownerUserId, user.id)).orderBy(files.createdAt);
    return NextResponse.json({ files: rows });
  } catch (error) {
    return handleApiError(error);
  }
}