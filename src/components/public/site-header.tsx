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
    <header className="sticky top-0 z-50 transition-all pt-3 px-4 sm:px-6 lg:px-8">
      {/* Main Navbar with rounded border */}
      <div className="mx-auto max-w-7xl rounded-2xl sm:rounded-3xl border border-[#ffe7d2] bg-white/95 px-4 sm:px-6 lg:px-8 shadow-[0_4px_20px_rgba(24,36,58,0.06)] backdrop-blur-xl">
        <div className="flex h-20 items-center justify-between gap-3">
          <Link href="/" className="focus-ring flex min-w-0 items-center rounded-xl p-1">
            <CouncilWordmark className="min-w-0" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 rounded-full border border-[#ffe7d2] bg-white/95 p-1.5 shadow-xs lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200",
                  pathname === item.href
                    ? "bg-brand-gradient text-white shadow-[0_6px_16px_rgba(255,122,0,0.28)]"
                    : "text-[#18243a] hover:bg-[#fff7ed] hover:text-[#f97316]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden items-center gap-3 lg:flex">
            <LinkButton href="/login" variant="outline" size="sm" className="shrink-0 font-bold">
              Member Login
            </LinkButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ffd6b0] bg-white text-[#f97316] lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="mx-auto mt-2 w-full max-w-full box-border rounded-2xl border border-[#ffe7d2] bg-white/95 px-4 py-4 shadow-xl backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "focus-ring rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                  pathname === item.href
                    ? "bg-brand-gradient text-white"
                    : "text-[#18243a] hover:bg-[#fff7ed] hover:text-[#f97316]",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-[#ffe7d2] pt-4">
              <LinkButton href="/login" variant="outline" size="sm" className="w-full text-center">
                Member Login
              </LinkButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

