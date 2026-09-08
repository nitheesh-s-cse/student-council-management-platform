import Image from "next/image";
import { cn } from "@/lib/utils";

// Council logo mark rendered from the official shield logo image (public/images/council-logo.png).
// The intrinsic width/height match the source asset (640x605); object-contain preserves natural aspect ratio.
export function CouncilMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/council-logo.png"
      alt="PPG Institute of Technology"
      width={640}
      height={605}
      priority
      className={cn("h-12 w-12 shrink-0 object-contain", className)}
    />
  );
}

export function CouncilWordmark({
  className,
  subtitleClassName,
  tone = "default",
}: {
  className?: string;
  subtitleClassName?: string;
  tone?: "default" | "inverse";
}) {
  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <CouncilMark className="h-10 w-10 sm:h-11 sm:w-11" />
      <div className="min-w-0 leading-tight">
        <p
          className={cn(
            "truncate text-[14px] sm:text-[15px] font-extrabold tracking-tight",
            tone === "inverse" ? "text-white" : "text-[#18243a]",
          )}
        >
          PPG Institute of Technology
        </p>
        <p
          className={cn(
            "max-w-full text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] leading-[1.25] sm:leading-normal sm:truncate",
            tone === "inverse" ? "text-white/70" : "text-[#64748b]",
            subtitleClassName,
          )}
        >
          <span className="block sm:inline truncate">An Autonomous Institution</span>
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline truncate">Affiliated to Anna University</span>
        </p>
      </div>
    </div>
  );
}

