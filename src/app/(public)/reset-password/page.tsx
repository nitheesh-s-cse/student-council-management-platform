"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { CouncilWordmark } from "@/components/ui/logo";
import { Button } from "@/components/ui/primitives";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to reset password.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface rounded-2xl p-8 shadow-[var(--shadow-card-lg)]">
      {done ? (
        <p className="text-sm text-emerald-600">Password updated. Redirecting you to sign in…</p>
      ) : !token ? (
        <p className="text-sm text-rose-600">Missing or invalid reset token. Please request a new link.</p>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-[var(--text)]">Choose a new password</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              required
              minLength={8}
              placeholder="New password (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
            />
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </form>
        </>
      )}
      <Link href="/login" className="mt-5 inline-block text-xs text-brand-600 hover:underline">Back to sign in</Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><CouncilWordmark /></div>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
