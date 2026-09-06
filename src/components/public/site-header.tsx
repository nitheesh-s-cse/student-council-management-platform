"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, GraduationCap, Sparkles } from "lucide-react";
import { CouncilWordmark } from "@/components/ui/logo";
import { LinkButton } from "@/components/ui/primitives";
import { ScholarshipModal } from "@/components/public/scholarship-modal";
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
  const [scholarshipOpen, setScholarshipOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 transition-all">
        {/* Institutional Top Utility Bar — matches reference screenshot 1 */}
        <div className="border-b border-[#fed7aa]/60 bg-[#fffcf8]/95 px-3 py-1.5 text-[11px] backdrop-blur-md sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            {/* Left: Accreditation & Status */}
            <div className="hidden items-center gap-4 text-[#4b5563] sm:flex">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f97316]" />
                Autonomous Institution Affiliated to Anna University
              </span>
              <span className="text-[#ffd6b0]">|</span>
              <span className="text-[#6b7280]">Coimbatore, Tamil Nadu</span>
            </div>

            {/* Right: Quick admission badges & scholarship modal trigger */}
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
              <div className="flex items-center gap-2">
                {/* TNEA Code Badge */}
                <span className="inline-flex items-center rounded-full bg-[#c2410c] px-2.5 py-0.5 font-bold tracking-wider text-white shadow-xs text-[10px] uppercase">
                  TNEA Code: 2753
                </span>

                {/* Admission Helpline */}
                <a
                  href="tel:+919047777277"
                  className="hidden items-center gap-1 rounded-full bg-[#ea580c] px-2.5 py-0.5 font-semibold text-white transition-all hover:bg-[#c2410c] text-[10px] md:inline-flex"
                >
                  <Phone className="h-2.5 w-2.5" /> +91 9047777277
                </a>
              </div>

              {/* Scholarship Modal trigger button */}
              <button
                type="button"
                onClick={() => setScholarshipOpen(true)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[#fed7aa] bg-[#fff7ed] px-3 py-0.5 text-[11px] font-bold text-[#ea580c] shadow-xs transition-all hover:bg-[#ffedd5] active:scale-95"
              >
                <GraduationCap className="h-3.5 w-3.5 text-[#ea580c]" />
                <span>Scholarship 2026–27</span>
                <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-[#ea580c]" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="border-b border-[#ffe7d2] bg-white/90 shadow-[0_2px_12px_rgba(24,36,58,0.04)] backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
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
          <div className="border-t border-[#ffe7d2] bg-white/95 px-4 py-4 backdrop-blur-xl lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1.5">
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
                <button
                  onClick={() => {
                    setOpen(false);
                    setScholarshipOpen(true);
                  }}
                  className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-[#fed7aa] bg-[#fff7ed] py-2.5 text-xs font-bold text-[#ea580c]"
                >
                  <GraduationCap className="h-4 w-4" /> View Scholarship Details (TNEA 2753)
                </button>
                <LinkButton href="/login" variant="outline" size="sm" className="w-full text-center">
                  Member Login
                </LinkButton>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Scholarship Modal Component */}
      <ScholarshipModal isOpen={scholarshipOpen} onClose={() => setScholarshipOpen(false)} />
    </>
  );
}
