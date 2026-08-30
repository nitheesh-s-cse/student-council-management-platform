"use client";

import { useState } from "react";
import { Loader2, Sun, Moon, Laptop } from "lucide-react";
import { Card, Button } from "@/components/ui/primitives";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

export function SettingsForm({ notifyEmail, notifyPush, email }: { notifyEmail: boolean; notifyPush: boolean; email: string }) {
  const { push } = useToast();
  const [emailPref, setEmailPref] = useState(notifyEmail);
  const [pushPref, setPushPref] = useState(notifyPush);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(
    (typeof window !== "undefined" && (localStorage.getItem("ppgc-theme") as "light" | "dark" | "system")) || "system",
  );

  function setTheme(value: "light" | "dark" | "system") {
    setThemeState(value);
    localStorage.setItem("ppgc-theme", value);
    const isDark = value === "dark" || (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    fetch("/api/settings/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme: value }) });
  }

  async function saveNotifications() {
    await fetch("/api/profile/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifyEmail: emailPref, notifyPush: pushPref }),
    });
    push({ kind: "success", title: "Notification preferences saved" });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      push({ kind: "success", title: "Password updated" });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-sm font-semibold text-[var(--text)]">Appearance</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { key: "light", label: "Light", icon: Sun },
            { key: "dark", label: "Dark", icon: Moon },
            { key: "system", label: "System", icon: Laptop },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key as "light" | "dark" | "system")}
              className={cn(
                "focus-ring flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium",
                theme === t.key ? "border-brand-500 text-brand-600" : "border-[var(--border)] text-muted",
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-semibold text-[var(--text)]">Notification preferences</p>
        <div className="mt-3 space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-[var(--text)]">Email notifications</span>
            <input type="checkbox" checked={emailPref} onChange={(e) => setEmailPref(e.target.checked)} />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-[var(--text)]">Push / browser notifications</span>
            <input type="checkbox" checked={pushPref} onChange={(e) => setPushPref(e.target.checked)} />
          </label>
        </div>
        <Button size="sm" className="mt-4" onClick={saveNotifications}>Save preferences</Button>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-semibold text-[var(--text)]">Change password</p>
        <p className="mt-1 text-xs text-muted">Signed in as {email}</p>
        <form onSubmit={changePassword} className="mt-4 space-y-3">
          <input
            type="password"
            required
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="New password (min. 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          />
          {passwordError && <p className="text-xs font-medium text-rose-600">{passwordError}</p>}
          <Button type="submit" size="sm" disabled={passwordLoading}>
            {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />} Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}
