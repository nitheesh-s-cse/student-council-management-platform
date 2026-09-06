import Image from "next/image";
import { cn } from "@/lib/utils";

// Council logo mark rendered from the official logo image. The intrinsic
// width/height match the source image (1353x1163); the displayed size is
// controlled by the caller via className (defaults to 48px square) and
// object-contain keeps the aspect ratio without distortion.
export function CouncilMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/council-logo.png"
      alt="PPGIT Student Council"
      width={1353}
      height={1163}
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
    <div className={cn("flex items-center gap-3", className)}>
      <CouncilMark />
      <div className="min-w-0 leading-tight">
        <p
          className={cn(
            "truncate text-[14px] font-extrabold tracking-tight",
            tone === "inverse" ? "text-white" : "text-[#18243a]",
          )}
        >
          PPG Institute of Technology
        </p>
        <p className={cn("max-w-full truncate text-[10px] font-bold uppercase tracking-[0.22em] text-[#f97316]", subtitleClassName)}>
          Student Council
        </p>
      </div>
    </div>
  );
}
