import "server-only";
import { mkdir, writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

// Files are persisted to a local "storage" directory outside of `public/`
// so that downloads must go through an authenticated API route
// (`/api/files/[id]`). In production this adapter can be swapped for an
// S3-compatible object storage client without changing call sites.
const STORAGE_ROOT = path.join(process.cwd(), "storage", "uploads");

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "video/mp4",
  "video/webm",
  "text/plain",
]);

export async function saveUploadedFile(file: File) {
  await mkdir(STORAGE_ROOT, { recursive: true });
  const key = `${Date.now()}-${randomBytes(8).toString("hex")}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(STORAGE_ROOT, key), buffer);
  return { storageKey: key, size: buffer.length };
}

export async function readStoredFile(storageKey: string) {
  return readFile(path.join(STORAGE_ROOT, storageKey));
}

export async function deleteStoredFile(storageKey: string) {
  try {
    await unlink(path.join(STORAGE_ROOT, storageKey));
  } catch {
    // Best-effort cleanup — ignore if the file is already gone.
  }
}
