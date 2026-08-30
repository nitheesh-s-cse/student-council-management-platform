import Image from "next/image";
import { cn } from "@/lib/utils";

// Council logo mark rendered from the official logo image. The intrinsic
// width/height match the source image (1353x1163); the displayed size is
// controlled by the caller via className (defaults to 36px square) and
// object-contain keeps the aspect ratio without distortion.
export function CouncilMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/council-logo.png"
      alt="PPGIT Student Council"
      width={1353}
      height={1163}
      className={cn("h-9 w-9 shrink-0 object-contain", className)}
    />
  );
}

export function CouncilWordmark({ className, subtitleClassName }: { className?: string; subtitleClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <CouncilMark />
      <div className="leading-tight">
        <p className="font-serif text-[14px] font-semibold tracking-wide text-amber-100">PPG Institute of Technology</p>
        <p className={cn("text-[10px] font-semibold uppercase tracking-[0.2em] gold-gradient-text", subtitleClassName)}>
          Student Council
        </p>
      </div>
    </div>
  );
}
