import Link from "next/link";
import { CouncilWordmark } from "@/components/ui/logo";
import { INSTITUTE_ADDRESS, ACADEMIC_YEAR } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#202c44] bg-[#0c1220] text-[#97a2b8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <CouncilWordmark tone="inverse" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#97a2b8]">
            The official Student Council operating platform of PPG Institute of Technology — representing student voice,
            coordinating campus events and fostering excellence across every department.
          </p>
          <p className="mt-4 text-xs text-[#667089]">{INSTITUTE_ADDRESS}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:max-w-md sm:grid-cols-2 md:col-span-2 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a47]">Navigation</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/about">About Us</Link></li>
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/members">Member Directory</Link></li>
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/events">Council Events</Link></li>
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/announcements">Announcements</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a47]">Council Access</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/login">Member Login</Link></li>
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/forgot-password">Reset Password</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[#16203a] py-6 text-center text-xs text-[#667089]">
        © {new Date().getFullYear()} PPG Institute of Technology Student Council · Term {ACADEMIC_YEAR}
      </div>
    </footer>
  );
}
