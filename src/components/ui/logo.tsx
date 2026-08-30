import { cn } from "@/lib/utils";

export function CouncilMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={cn("h-9 w-9 filter drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]", className)} fill="none" aria-hidden="true">
      <path
        d="M20 1 L37 7 V21 C37 32 30 40 20 43 C10 40 3 32 3 21 V7 Z"
        fill="url(#gold-shield)"
        stroke="#E5C158"
        strokeWidth="1.2"
      />
      <path d="M20 5 L33 9.5 V21 C33 30 27.5 36.5 20 39 C12.5 36.5 7 30 7 21 V9.5 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      <path d="M13 17 h14 M13 21 h14 M13 25 h9" stroke="#0D0E12" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20" cy="12.5" r="2.2" fill="#0D0E12" />
      <defs>
        <linearGradient id="gold-shield" x1="3" y1="1" x2="37" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5D77F" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
      </defs>
    </svg>
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
