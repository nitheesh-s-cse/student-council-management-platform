import { cn } from "@/lib/utils";

// Original crest mark for the PPGIT Student Council — inspired by the
// institute's heraldic shield (book, signal dish, molecule, gear) but
// redrawn as a simplified geometric monogram for a digital product.
export function CouncilMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={cn("h-8 w-8", className)} fill="none" aria-hidden="true">
      <path
        d="M20 1 L37 7 V21 C37 32 30 40 20 43 C10 40 3 32 3 21 V7 Z"
        fill="url(#ppgc-shield)"
        stroke="var(--color-brand-700)"
        strokeWidth="1"
      />
      <path d="M20 5 L33 9.5 V21 C33 30 27.5 36.5 20 39 C12.5 36.5 7 30 7 21 V9.5 Z" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
      <path d="M13 17 h14 M13 21 h14 M13 25 h9" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.92" />
      <circle cx="20" cy="12.5" r="2.1" fill="white" opacity="0.92" />
      <defs>
        <linearGradient id="ppgc-shield" x1="3" y1="1" x2="37" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-brand-500)" />
          <stop offset="1" stopColor="var(--color-brand-700)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CouncilWordmark({ className, subtitleClassName }: { className?: string; subtitleClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <CouncilMark />
      <div className="leading-tight">
        <p className="text-[13px] font-bold tracking-tight text-[var(--text)]">PPG Institute of Technology</p>
        <p className={cn("text-[11px] font-medium uppercase tracking-[0.14em] text-muted", subtitleClassName)}>
          Student Council
        </p>
      </div>
    </div>
  );
}
