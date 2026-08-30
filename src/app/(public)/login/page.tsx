"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, Mail } from "lucide-react";
import { CouncilWordmark } from "@/components/ui/logo";
import { Button } from "@/components/ui/primitives";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to sign in.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <CouncilWordmark />
        </div>
        <div className="surface rounded-2xl p-8 shadow-[var(--shadow-card-lg)]">
          <h1 className="text-xl font-semibold text-[var(--text)]">Member sign in</h1>
          <p className="mt-1.5 text-sm text-muted">Access your council dashboard, tasks and chat.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-medium text-muted">Email</label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@council.ppgit.edu.in"
                  className="focus-ring h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-medium text-muted">Password</label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="focus-ring h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            <Link href="/forgot-password" className="text-brand-600 hover:underline">Forgot password?</Link>
            <Link href="/" className="text-muted hover:text-[var(--text)]">Back to site</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
