import "server-only";
import { randomBytes } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Files are persisted to a private Supabase Storage bucket (project-level
// object storage) instead of the local filesystem, so uploads survive
// serverless cold starts, redeploys and horizontal scaling. Metadata is kept
// in the `files` table in PostgreSQL; only the binary content lives here.
// This module is the single storage adapter — call sites only use
// saveUploadedFile / readStoredFile / deleteStoredFile, so swapping to
// S3-compatible object storage later does not touch any API route.

const BUCKET = process.env.STORAGE_BUCKET ?? "documents";

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

// The Supabase client is created lazily so that importing this module (and
// building the app) never fails when the env vars are not yet configured.
let client: SupabaseClient | null = null;
let bucketReady: Promise<void> | null = null;

function getClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars are required for file storage");
  }
  client ??= createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  return client;
}

function ensureBucket(): Promise<void> {
  const supabase = getClient();
  bucketReady ??= (async () => {
    const { error } = await supabase.storage.getBucket(BUCKET);
    if (error && String(error.statusCode) === "404") {
      // The service-role key can create buckets; keep it private so files
      // are only ever served through the authenticated API route.
      const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: false });
      if (createErr) throw new Error(`Could not create storage bucket "${BUCKET}": ${createErr.message}`);
    } else if (error) {
      throw new Error(`Could not access storage bucket "${BUCKET}": ${error.message}`);
    }
  })();
  return bucketReady;
}

export async function saveUploadedFile(file: File) {
  const key = `${Date.now()}-${randomBytes(8).toString("hex")}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await ensureBucket();
  const { error } = await getClient()
    .storage.from(BUCKET)
    .upload(key, buffer, { contentType: file.type || "application/octet-stream", upsert: false });
  if (error) throw new Error(`Upload to Supabase Storage failed: ${error.message}`);
  return { bucket: BUCKET, storageKey: key, size: buffer.length };
}

export async function readStoredFile(storageKey: string) {
  await ensureBucket();
  const { data, error } = await getClient().storage.from(BUCKET).download(storageKey);
  if (error) throw new Error(`Download from Supabase Storage failed: ${error.message}`);
  return Buffer.from(await data.arrayBuffer());
}

export async function deleteStoredFile(storageKey: string) {
  try {
    await ensureBucket();
    const { error } = await getClient().storage.from(BUCKET).remove([storageKey]);
    if (error) throw error;
  } catch {
    // Best-effort cleanup — ignore if the file is already gone.
  }
}
