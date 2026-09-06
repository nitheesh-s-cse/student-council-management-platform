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
    <div className="gold-glass-card rounded-3xl p-8 shadow-[0_10px_30px_rgba(24,36,58,0.08)] border border-[#ffd6b0]">
      {done ? (
        <p className="text-sm text-emerald-600">Password updated. Redirecting you to sign in…</p>
      ) : !token ? (
        <p className="text-sm text-rose-600">Missing or invalid reset token. Please request a new link.</p>
      ) : (
        <>
          <h1 className="text-xl font-bold text-[#18243a]">Choose a new password</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              required
              minLength={8}
              placeholder="New password (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring h-11 w-full rounded-xl border border-[#ffe7d2] bg-white px-3 text-sm text-[#18243a]"
            />
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </form>
        </>
      )}
      <Link href="/login" className="mt-5 inline-block text-xs font-semibold text-[#f97316] hover:underline">Back to sign in</Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-140px)] items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="background-glow background-glow-orange bg-glow-lg"
        style={{ left: "-6%", top: "-10%" }}
      />
      <div
        aria-hidden="true"
        className="background-glow background-glow-red bg-glow-md"
        style={{ right: "-4%", bottom: "4%" }}
      />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex justify-center"><CouncilWordmark /></div>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
