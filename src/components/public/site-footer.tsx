import Link from "next/link";
import { CouncilWordmark } from "@/components/ui/logo";
import { INSTITUTE_ADDRESS, ACADEMIC_YEAR } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#202c44] bg-[#0c1220] text-[#97a2b8]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <CouncilWordmark tone="inverse" />
          <p className="mt-2.5 max-w-sm text-xs leading-relaxed text-[#97a2b8]">
            The official Student Council operating platform of PPG Institute of Technology — representing student voice,
            coordinating campus events and fostering excellence across every department.
          </p>
          <p className="mt-2 text-[11px] text-[#667089]">{INSTITUTE_ADDRESS}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:max-w-md sm:grid-cols-2 md:col-span-2 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9a47]">Navigation</p>
            <ul className="mt-2.5 space-y-1.5 text-xs">
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/about">About Us</Link></li>
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/members">Member Directory</Link></li>
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/events">Council Events</Link></li>
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/announcements">Announcements</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9a47]">Council Access</p>
            <ul className="mt-2.5 space-y-1.5 text-xs">
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/login">Member Login</Link></li>
              <li><Link className="text-[#97a2b8] hover:text-[#ff9a47] transition-colors" href="/forgot-password">Reset Password</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[#16203a] py-3.5 text-center text-[11px] text-[#667089]">
        © {new Date().getFullYear()} PPG Institute of Technology Student Council · Term {ACADEMIC_YEAR}
      </div>
    </footer>
  );
}
