import { cn } from "@/lib/utils";

export function CouncilMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/ppgit-logo.png"
      alt="PPG Institute of Technology Logo"
      className={cn("h-10 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-transform hover:scale-105", className)}
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
