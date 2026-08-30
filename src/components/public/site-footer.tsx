import Link from "next/link";
import { CouncilWordmark } from "@/components/ui/logo";
import { INSTITUTE_ADDRESS, ACADEMIC_YEAR } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-amber-500/15 bg-[#0a0b10] text-amber-100/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <CouncilWordmark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            The official Student Council operating platform of PPG Institute of Technology — representing student voice,
            coordinating campus events and fostering excellence across every department.
          </p>
          <p className="mt-4 text-xs text-muted/70">{INSTITUTE_ADDRESS}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Navigation</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="text-muted hover:text-amber-300 transition-colors" href="/about">About Us</Link></li>
            <li><Link className="text-muted hover:text-amber-300 transition-colors" href="/members">Member Directory</Link></li>
            <li><Link className="text-muted hover:text-amber-300 transition-colors" href="/events">Council Events</Link></li>
            <li><Link className="text-muted hover:text-amber-300 transition-colors" href="/announcements">Announcements</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Council Access</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="text-muted hover:text-amber-300 transition-colors" href="/login">Member Login</Link></li>
            <li><Link className="text-muted hover:text-amber-300 transition-colors" href="/forgot-password">Reset Password</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-amber-500/10 py-6 text-center text-xs text-muted/60">
        © {new Date().getFullYear()} PPG Institute of Technology Student Council · Term {ACADEMIC_YEAR}
      </div>
    </footer>
  );
}
