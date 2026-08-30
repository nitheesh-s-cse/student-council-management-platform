import { NextResponse } from "next/server";
import { db } from "@/db";
import { files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { readStoredFile, deleteStoredFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Any signed-in member can download a stored file; the bytes are streamed
// out of the private Supabase Storage bucket through an authenticated route
// so files are never exposed as public URLs.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const [row] = await db.select().from(files).where(eq(files.id, Number(id))).limit(1);
    if (!row) return NextResponse.json({ error: "File not found" }, { status: 404 });

    const buffer = await readStoredFile(row.storageKey);
    const safeName = row.originalName.replace(/[^\w.\- ]/g, "_");

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": row.mimeType,
        "Content-Length": String(buffer.length),
        "Content-Disposition": `inline; filename="${safeName}"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Owners and admins/super-admins may delete a file (object + metadata row).
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const [row] = await db.select().from(files).where(eq(files.id, Number(id))).limit(1);
    if (!row) return NextResponse.json({ error: "File not found" }, { status: 404 });

    const canDelete =
      row.ownerUserId === user.id || ["super_admin", "admin"].includes(user.role);
    if (!canDelete) {
      return NextResponse.json({ error: "You can only delete files you uploaded." }, { status: 403 });
    }

    await deleteStoredFile(row.storageKey);
    await db.delete(files).where(eq(files.id, Number(id)));

    await logAudit({
      userId: user.id,
      action: "file_deleted",
      objectType: "file",
      objectId: row.id,
      metadata: { name: row.originalName, storageKey: row.storageKey },
      request,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}