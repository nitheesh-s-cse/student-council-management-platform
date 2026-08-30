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
    <header className="sticky top-0 z-50 border-b border-amber-500/10 bg-[#0d0e14]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring rounded-xl p-1">
          <CouncilWordmark />
        </Link>

        <nav className="hidden items-center gap-1.5 rounded-full border border-amber-500/15 bg-[#141622]/60 p-1.5 backdrop-blur-md md:flex shadow-inner">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                pathname === item.href
                  ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  : "text-amber-100/70 hover:text-amber-200 hover:bg-amber-500/10",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LinkButton href="/login" variant="outline" size="sm">
            Member Login
          </LinkButton>
          <LinkButton href="/members" variant="primary" size="sm">
            Directory
          </LinkButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-[#161824] text-amber-300 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-amber-500/15 bg-[#0d0e14]/95 px-4 py-4 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-1.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-xl px-4 py-3 text-sm font-medium text-amber-100 hover:bg-amber-500/10 hover:text-amber-300"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2 border-t border-amber-500/15 pt-4">
              <LinkButton href="/login" variant="outline" size="sm" className="flex-1">
                Member Login
              </LinkButton>
              <LinkButton href="/members" variant="primary" size="sm" className="flex-1">
                Directory
              </LinkButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
