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

const SIDEBAR_EXTRA = [
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

const navLinkClass = (active: boolean) =>
  cn(
    "focus-ring flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
    active
      ? "bg-brand-gradient text-white font-semibold shadow-[0_6px_16px_rgba(255,122,0,0.25)]"
      : "text-[#4b5563] hover:bg-[#fff7ed] hover:text-[#f97316]",
  );

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

  const isNavActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="relative flex min-h-screen bg-[#fffcf8] text-[#18243a]">
      {/* Ambient background layer */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden">
        <div className="bg-glow bg-glow-orange bg-glow-lg" style={{ left: "-8%", top: "-12%" }} />
        <div className="bg-glow bg-glow-red bg-glow-md" style={{ right: "-5%", top: "6%" }} />
        <div className="bg-glow bg-glow-warm bg-glow-sm" style={{ left: "6%", bottom: "10%", opacity: 0.5 }} />
      </div>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[#ffe7d2] bg-white md:flex">
        <div className="flex h-20 items-center border-b border-[#ffe7d2] px-6">
          <Link href="/dashboard">
            <CouncilWordmark />
          </Link>
        </div>
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {NAV.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link key={item.href} href={item.href} className={navLinkClass(active)}>
                <item.icon className={cn("h-4.5 w-4.5", active ? "text-white" : "text-[#ff7a00]")} />
                {item.label}
              </Link>
            );
          })}
          <div className="my-4 border-t border-[#ffe7d2]" />
          {SIDEBAR_EXTRA.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link key={item.href} href={item.href} className={navLinkClass(active)}>
                <item.icon className={cn("h-4.5 w-4.5", active ? "text-white" : "text-[#ff7a00]")} />
                {item.label}
              </Link>
            );
          })}
          {roleAtLeast(user.role, "admin") && (
            <Link
              href="/secure-control/dashboard"
              className="focus-ring mt-3 flex items-center gap-3.5 rounded-xl gold-gradient-btn px-4 py-3 text-sm font-bold tracking-wide"
            >
              <ShieldCheck className="h-4.5 w-4.5" /> Secure Control
            </Link>
          )}
        </nav>
        <div className="border-t border-[#ffe7d2] bg-[#fff9f2] p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#ffd6b0] bg-white p-2 shadow-sm">
            <Avatar name={user.memberName ?? user.email} src={user.photoUrl} size={38} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#18243a]">{user.memberName ?? "Council Admin"}</p>
              <p className="truncate text-[11px] font-bold uppercase tracking-wider text-[#f97316]">{ROLE_LABELS[user.role]}</p>
            </div>
            <button
              onClick={logout}
              className="focus-ring rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile + desktop content column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-[#ffe7d2] bg-white/90 px-4 backdrop-blur-xl md:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffd6b0] bg-white text-[#f97316] md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <CouncilMark className="h-10 w-10" />
          </div>
          <form action="/dashboard/search" className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
              <input
                name="q"
                placeholder="Search members, tasks, events…"
                className="focus-ring h-11 w-full rounded-xl border border-[#ffd6b0] bg-[#fffcf8] pl-10 pr-4 text-sm text-[#18243a]"
              />
            </div>
          </form>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen((v) => !v)}
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffd6b0] bg-white text-[#f97316] hover:bg-[#fff7ed]"
                aria-label="Change theme"
              >
                <Sun className="h-4.5 w-4.5 dark:hidden" />
                <Moon className="hidden h-4.5 w-4.5 dark:block" />
              </button>
              {themeMenuOpen && (
                <div className="dropdown-pop absolute right-0 top-12 z-50 w-40 rounded-2xl border border-[#ffd6b0] bg-white p-1.5 shadow-[var(--shadow-card-lg)]">
                  {[
                    { key: "light", label: "Light", icon: Sun },
                    { key: "dark", label: "Dark", icon: Moon },
                    { key: "system", label: "System", icon: Laptop },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTheme(t.key as "light" | "dark" | "system")}
                      className="focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#18243a] hover:bg-[#fff7ed] hover:text-[#f97316]"
                    >
                      <t.icon className="h-4 w-4" /> {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/notifications"
              className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffd6b0] bg-white text-[#f97316] hover:bg-[#fff7ed]"
            >
              <Bell className="h-4.5 w-4.5" />
            </Link>
            <Link href="/profile" className="focus-ring hidden md:inline-flex">
              <Avatar name={user.memberName ?? user.email} src={user.photoUrl} size={38} />
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[#ffe7d2] bg-white/95 py-2 backdrop-blur-2xl md:hidden">
          {MOBILE_NAV.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all",
                  active ? "text-[#f97316]" : "text-[#6b7280]",
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
          <div className="absolute inset-0 bg-[#0c1220]/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 border-r border-[#ffe7d2] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <CouncilWordmark />
              <button
                onClick={() => setMobileOpen(false)}
                className="focus-ring rounded-xl border border-[#ffd6b0] p-2 text-[#f97316]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-8 space-y-2">
              {[...NAV, ...SIDEBAR_EXTRA].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-[#33415c] hover:bg-[#fff7ed] hover:text-[#f97316]"
                >
                  <item.icon className="h-4.5 w-4.5 text-[#ff7a00]" /> {item.label}
                </Link>
              ))}
              {roleAtLeast(user.role, "admin") && (
                <Link
                  href="/secure-control/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring mt-4 flex items-center gap-3.5 rounded-xl gold-gradient-btn px-4 py-3 text-sm font-bold tracking-wide"
                >
                  <ShieldCheck className="h-4.5 w-4.5" /> Secure Control
                </Link>
              )}
              <button
                onClick={logout}
                className="focus-ring mt-4 flex w-full items-center gap-3.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
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