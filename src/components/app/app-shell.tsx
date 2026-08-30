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
    <div className="flex min-h-screen bg-[#0b0c10] text-[#f5f6fa]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-amber-500/15 bg-[#0e1017] md:flex">
        <div className="flex h-20 items-center border-b border-amber-500/15 px-6">
          <Link href="/dashboard"><CouncilWordmark /></Link>
        </div>
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.12)] font-semibold"
                    : "text-amber-100/70 hover:bg-amber-500/10 hover:text-amber-200",
                )}
              >
                <item.icon className={cn("h-4.5 w-4.5", active ? "text-amber-300" : "text-amber-400/60")} />
                {item.label}
              </Link>
            );
          })}
          <div className="my-4 border-t border-amber-500/10" />
          <Link
            href="/notifications"
            className={cn(
              "focus-ring flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all",
              pathname.startsWith("/notifications")
                ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30"
                : "text-amber-100/70 hover:bg-amber-500/10 hover:text-amber-200",
            )}
          >
            <Bell className="h-4.5 w-4.5 text-amber-400/60" /> Notifications
          </Link>
          <Link
            href="/profile"
            className={cn(
              "focus-ring flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all",
              pathname.startsWith("/profile")
                ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30"
                : "text-amber-100/70 hover:bg-amber-500/10 hover:text-amber-200",
            )}
          >
            <UserCircle className="h-4.5 w-4.5 text-amber-400/60" /> Profile
          </Link>
          <Link
            href="/settings"
            className={cn(
              "focus-ring flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all",
              pathname.startsWith("/settings")
                ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30"
                : "text-amber-100/70 hover:bg-amber-500/10 hover:text-amber-200",
            )}
          >
            <Settings className="h-4.5 w-4.5 text-amber-400/60" /> Settings
          </Link>
          {roleAtLeast(user.role, "admin") && (
            <Link
              href="/secure-control/dashboard"
              className="focus-ring mt-3 flex items-center gap-3.5 rounded-xl gold-gradient-btn px-4 py-3 text-sm font-semibold tracking-wide"
            >
              <ShieldCheck className="h-4.5 w-4.5" /> Secure Control
            </Link>
          )}
        </nav>
        <div className="border-t border-amber-500/15 p-4 bg-[#090a0f]">
          <div className="flex items-center gap-3 rounded-xl p-2 bg-[#12141e]/60 border border-amber-500/10">
            <Avatar name={user.memberName ?? user.email} src={user.photoUrl} size={38} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-sm text-amber-100">{user.memberName ?? "Council Admin"}</p>
              <p className="truncate text-[11px] font-semibold uppercase tracking-wider gold-gradient-text">{ROLE_LABELS[user.role]}</p>
            </div>
            <button onClick={logout} className="focus-ring rounded-lg p-2 text-amber-200/60 hover:bg-rose-500/20 hover:text-rose-300 transition-colors" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-amber-500/15 bg-[#0d0e14]/90 px-4 backdrop-blur-xl md:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-[#161824] text-amber-300 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <CouncilMark className="h-10 w-10" />
          </div>
          <form action="/dashboard/search" className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400/50" />
              <input
                name="q"
                placeholder="Search members, tasks, events…"
                className="focus-ring h-11 w-full rounded-xl border border-amber-500/20 bg-[#141622]/80 pl-10 pr-4 text-sm text-amber-100 placeholder:text-muted/60 backdrop-blur"
              />
            </div>
          </form>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen((v) => !v)}
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/15 bg-[#141622] text-amber-300 hover:bg-[#1a1d2d]"
                aria-label="Change theme"
              >
                <Sun className="h-4.5 w-4.5 dark:hidden" />
                <Moon className="hidden h-4.5 w-4.5 dark:block" />
              </button>
              {themeMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-40 rounded-xl border border-amber-500/30 bg-[#12141e] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                  {[
                    { key: "light", label: "Light", icon: Sun },
                    { key: "dark", label: "Dark", icon: Moon },
                    { key: "system", label: "System", icon: Laptop },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTheme(t.key as "light" | "dark" | "system")}
                      className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-amber-100 hover:bg-amber-500/10 hover:text-amber-300"
                    >
                      <t.icon className="h-4 w-4" /> {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href="/notifications" className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/15 bg-[#141622] text-amber-300 hover:bg-[#1a1d2d]">
              <Bell className="h-4.5 w-4.5" />
            </Link>
            <Link href="/profile" className="focus-ring hidden md:inline-flex">
              <Avatar name={user.memberName ?? user.email} src={user.photoUrl} size={38} />
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-amber-500/15 bg-[#0d0e14]/95 py-2 backdrop-blur-2xl md:hidden">
          {MOBILE_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase transition-all",
                  active ? "text-amber-300" : "text-amber-100/60",
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 border-r border-amber-500/20 bg-[#0e1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <CouncilWordmark />
              <button onClick={() => setMobileOpen(false)} className="focus-ring rounded-xl p-2 text-amber-300 border border-amber-500/20" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 space-y-2">
              {[...NAV, { href: "/notifications", label: "Notifications", icon: Bell }, { href: "/profile", label: "Profile", icon: UserCircle }, { href: "/settings", label: "Settings", icon: Settings }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-amber-100 hover:bg-amber-500/10 hover:text-amber-300"
                >
                  <item.icon className="h-4.5 w-4.5 text-amber-400" /> {item.label}
                </Link>
              ))}
              {roleAtLeast(user.role, "admin") && (
                <Link
                  href="/secure-control/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring mt-4 flex items-center gap-3.5 rounded-xl gold-gradient-btn px-4 py-3 text-sm font-semibold tracking-wide"
                >
                  <ShieldCheck className="h-4.5 w-4.5" /> Secure Control
                </Link>
              )}
              <button
                onClick={logout}
                className="focus-ring mt-4 flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-rose-300 border border-rose-900/40 bg-rose-950/20"
              >
                <LogOut className="h-4.5 w-4.5" /> Sign out
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
