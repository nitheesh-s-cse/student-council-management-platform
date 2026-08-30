"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { CouncilWordmark } from "@/components/ui/logo";
import { Button } from "@/components/ui/primitives";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
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
          {sent ? (
            <div className="text-center">
              <h1 className="text-lg font-semibold text-[var(--text)]">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted">
                If an account exists for <span className="font-medium text-[var(--text)]">{email}</span>, we've sent
                a password reset link. It expires in 60 minutes.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-[var(--text)]">Reset your password</h1>
              <p className="mt-1.5 text-sm text-muted">We'll email you a secure link to choose a new password.</p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-muted">Email</label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@council.ppgit.edu.in"
                      className="focus-ring h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send reset link
                </Button>
              </form>
            </>
          )}
          <Link href="/login" className="mt-5 inline-flex items-center gap-1.5 text-xs text-brand-600 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
