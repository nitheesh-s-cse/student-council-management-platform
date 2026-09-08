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
      <div className="relative z-10 w-full max-w-[420px] mx-auto">
        <div className="mb-8 flex justify-center">
          <CouncilWordmark />
        </div>
        <div className="gold-glass-card rounded-3xl p-7 sm:p-8 shadow-[0_10px_30px_rgba(24,36,58,0.08)] border border-[#ffd6b0] w-full max-w-[420px] mx-auto">
          {sent ? (
            <div className="text-center">
              <h1 className="text-lg font-bold text-[#18243a]">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted">
                If an account exists for <span className="font-semibold text-[#f97316]">{email}</span>, we&apos;ve sent
                a password reset link. It expires in 60 minutes.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-[#18243a]">Reset your password</h1>
              <p className="mt-1.5 text-sm text-muted">We&apos;ll email you a secure link to choose a new password.</p>
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
                      className="focus-ring h-11 w-full rounded-xl border border-[var(--border)] bg-white pl-9 pr-3 text-sm"
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
