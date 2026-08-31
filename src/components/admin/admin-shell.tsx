"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  Shapes,
  ListChecks,
  CalendarDays,
  Vote,
  Megaphone,
  FolderClosed,
  Users,
  ScrollText,
  Settings,
  Menu,
  X,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { CouncilMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/secure-control/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/secure-control/members", label: "Members", icon: Users2 },
  { href: "/secure-control/teams", label: "Teams", icon: Shapes },
  { href: "/secure-control/tasks", label: "Tasks", icon: ListChecks },
  { href: "/secure-control/events", label: "Events", icon: CalendarDays },
  { href: "/secure-control/polls", label: "Polls", icon: Vote },
  { href: "/secure-control/announcements", label: "Announcements", icon: Megaphone },
  { href: "/secure-control/documents", label: "Documents", icon: FolderClosed },
  { href: "/secure-control/meetings", label: "Meetings", icon: Users },
  { href: "/secure-control/audit", label: "Audit Log", icon: ScrollText },
  { href: "/secure-control/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-ink-950 text-ink-100">
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 shrink-0 flex-col border-r border-white/10 bg-ink-900 md:static md:flex", open ? "flex" : "hidden")}>
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <CouncilMark />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white">Secure Control</p>
            <p className="text-[10px] text-ink-300">PPGIT Student Council</p>
          </div>
          <button onClick={() => setOpen(false)} className="ml-auto rounded-lg p-1 text-ink-300 md:hidden"><X className="h-4 w-4" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-brand-600 text-white" : "text-ink-200 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-200 hover:bg-white/5 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to member app
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-300 hover:bg-white/5">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-white/10 bg-ink-900/60 px-4 backdrop-blur md:px-8">
          <button onClick={() => setOpen(true)} className="shrink-0 rounded-lg border border-white/10 p-2 text-ink-200 md:hidden"><Menu className="h-4 w-4" /></button>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink-200">Signed in as <span className="text-white">{user.memberName ?? user.email}</span> · {ROLE_LABELS[user.role]}</p>
        </header>
        <main className="flex-1 bg-[var(--bg)] text-[var(--text)]">{children}</main>
      </div>
    </div>
  );
}
