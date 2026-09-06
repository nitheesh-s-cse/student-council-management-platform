import type { ReactNode } from "react";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { AmbientBackground } from "@/components/public/ambient-background";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AmbientBackground />
      <SiteHeader />
      <main className="relative z-[1] flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
