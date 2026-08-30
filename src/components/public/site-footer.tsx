import Link from "next/link";
import { CouncilWordmark } from "@/components/ui/logo";
import { INSTITUTE_ADDRESS, ACADEMIC_YEAR } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <CouncilWordmark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            The official Student Council of PPG Institute of Technology — representing student voice,
            organizing campus life and building an operating system for how the council works, term after term.
          </p>
          <p className="mt-4 text-xs text-muted">{INSTITUTE_ADDRESS}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Council</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-muted hover:text-brand-600" href="/about">About us</Link></li>
            <li><Link className="text-muted hover:text-brand-600" href="/members">Member directory</Link></li>
            <li><Link className="text-muted hover:text-brand-600" href="/events">Events</Link></li>
            <li><Link className="text-muted hover:text-brand-600" href="/announcements">Announcements</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Council Access</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-muted hover:text-brand-600" href="/login">Member sign in</Link></li>
            <li><Link className="text-muted hover:text-brand-600" href="/forgot-password">Forgot password</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} PPG Institute of Technology Student Council · Academic Year {ACADEMIC_YEAR}
      </div>
    </footer>
  );
}
