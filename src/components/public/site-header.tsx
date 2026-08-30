"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CouncilWordmark } from "@/components/ui/logo";
import { LinkButton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/members", label: "Members" },
  { href: "/events", label: "Events" },
  { href: "/announcements", label: "Announcements" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring rounded">
          <CouncilWordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href ? "text-brand-600" : "text-muted hover:text-[var(--text)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LinkButton href="/login" variant="outline" size="sm">
            Member Login
          </LinkButton>
          <LinkButton href="/members" variant="primary" size="sm">
            Member Directory
          </LinkButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md px-3 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-[var(--border)] pt-3">
              <LinkButton href="/login" variant="outline" size="sm" className="flex-1">
                Member Login
              </LinkButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
