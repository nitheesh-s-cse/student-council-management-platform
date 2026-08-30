"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  ListChecks,
  Users2,
  CalendarDays,
  Vote,
  Bell,
  UserCircle,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { CouncilWordmark, CouncilMark } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, roleAtLeast } from "@/lib/constants";
import { useToast } from "@/components/providers/toast-provider";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/chat", label: "Chats", icon: MessagesSquare },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/teams", label: "Teams", icon: Users2 },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/polls", label: "Polls", icon: Vote },
];

const MOBILE_NAV = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/chat", label: "Chats", icon: MessagesSquare },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { push } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    push({ kind: "info", title: "Signed out", description: "See you again soon." });
    router.push("/");
    router.refresh();
  }

  function setTheme(theme: "light" | "dark" | "system") {
    localStorage.setItem("ppgc-theme", theme);
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    setThemeMenuOpen(false);
    fetch("/api/settings/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    }).catch(() => {});
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:flex">
        <div className="flex h-16 items-center border-b border-[var(--border)] px-5">
          <Link href="/dashboard"><CouncilWordmark /></Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200" : "text-muted hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="my-3 border-t border-[var(--border)]" />
          <Link
            href="/notifications"
            className={cn(
              "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/notifications") ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200" : "text-muted hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
            )}
          >
            <Bell className="h-4 w-4" /> Notifications
          </Link>
          <Link
            href="/profile"
            className={cn(
              "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/profile") ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200" : "text-muted hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
            )}
          >
            <UserCircle className="h-4 w-4" /> Profile
          </Link>
          <Link
            href="/settings"
            className={cn(
              "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/settings") ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200" : "text-muted hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
            )}
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          {roleAtLeast(user.role, "admin") && (
            <Link
              href="/secure-control/dashboard"
              className="focus-ring mt-1 flex items-center gap-3 rounded-lg bg-ink-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
            >
              <ShieldCheck className="h-4 w-4" /> Secure Control
            </Link>
          )}
        </nav>
        <div className="border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar name={user.memberName ?? user.email} src={user.photoUrl} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text)]">{user.memberName ?? "Council Admin"}</p>
              <p className="truncate text-xs text-muted">{ROLE_LABELS[user.role]}</p>
            </div>
            <button onClick={logout} className="focus-ring rounded-lg p-1.5 text-muted hover:bg-[var(--surface-muted)] hover:text-rose-600" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 backdrop-blur md:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <CouncilMark className="h-6 w-6" />
          </div>
          <form action="/dashboard/search" className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                name="q"
                placeholder="Search members, tasks, events…"
                className="focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] pl-9 pr-3 text-sm"
              />
            </div>
          </form>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen((v) => !v)}
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-[var(--surface-muted)]"
                aria-label="Change theme"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="hidden h-4 w-4 dark:block" />
              </button>
              {themeMenuOpen && (
                <div className="absolute right-0 top-11 z-50 w-36 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow-card-lg)]">
                  {[
                    { key: "light", label: "Light", icon: Sun },
                    { key: "dark", label: "Dark", icon: Moon },
                    { key: "system", label: "System", icon: Laptop },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTheme(t.key as "light" | "dark" | "system")}
                      className="focus-ring flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-muted)]"
                    >
                      <t.icon className="h-3.5 w-3.5" /> {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href="/notifications" className="focus-ring relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-[var(--surface-muted)]">
              <Bell className="h-4 w-4" />
            </Link>
            <Link href="/profile" className="focus-ring hidden md:inline-flex">
              <Avatar name={user.memberName ?? user.email} src={user.photoUrl} size={32} />
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[var(--border)] bg-[var(--surface)]/95 py-1.5 backdrop-blur md:hidden">
          {MOBILE_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium",
                  active ? "text-brand-600" : "text-muted",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-[var(--surface)] p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <CouncilWordmark />
              <button onClick={() => setMobileOpen(false)} className="focus-ring rounded-lg p-1.5" aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="mt-6 space-y-1">
              {[...NAV, { href: "/notifications", label: "Notifications", icon: Bell }, { href: "/profile", label: "Profile", icon: UserCircle }, { href: "/settings", label: "Settings", icon: Settings }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)]"
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              ))}
              {roleAtLeast(user.role, "admin") && (
                <Link
                  href="/secure-control/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring mt-2 flex items-center gap-3 rounded-lg bg-ink-900 px-3 py-2.5 text-sm font-medium text-white"
                >
                  <ShieldCheck className="h-4 w-4" /> Secure Control
                </Link>
              )}
              <button
                onClick={logout}
                className="focus-ring mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
