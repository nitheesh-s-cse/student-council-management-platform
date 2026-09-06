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
    <header className="sticky top-0 z-50 border-b border-[#ffe7d2] bg-white/85 shadow-[0_1px_10px_rgba(24,36,58,0.04)] backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex min-w-0 items-center rounded-xl p-1">
          <CouncilWordmark className="min-w-0" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[#ffe7d2] bg-white p-1.5 shadow-sm lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200",
                pathname === item.href
                  ? "bg-brand-gradient text-white shadow-[0_6px_16px_rgba(255,122,0,0.3)]"
                  : "text-[#18243a] hover:bg-[#fff7ed] hover:text-[#f97316]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LinkButton href="/login" variant="outline" size="sm" className="shrink-0">
            Member Login
          </LinkButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ffd6b0] bg-white text-[#f97316] lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#ffe7d2] bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "focus-ring rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-brand-gradient text-white" : "text-[#18243a] hover:bg-[#fff7ed] hover:text-[#f97316]",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2 border-t border-[#ffe7d2] pt-4">
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
