"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Card, Button } from "@/components/ui/primitives";
import { useToast } from "@/components/providers/toast-provider";
import type { members } from "@/db/schema";

export function ProfileForm({ member }: { member: typeof members.$inferSelect }) {
  const [bio, setBio] = useState(member.bio ?? "");
  const [skills, setSkills] = useState(member.skills ?? "");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, skills }),
      });
      if (res.ok) push({ kind: "success", title: "Profile updated" });
      else push({ kind: "error", title: "Could not update profile" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <p className="text-sm font-semibold text-[var(--text)]">About you</p>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="focus-ring mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Skills & interests (comma separated)</label>
          <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Design, Public speaking, Photography" className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes</Button>
      </form>
    </Card>
  );
}
