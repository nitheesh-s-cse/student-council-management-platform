import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const variants: Record<string, string> = {
    primary: "gold-gradient-btn font-bold tracking-wide",
    secondary:
      "bg-white text-[#f97316] border border-[#ffd6b0] hover:bg-[#fff7ed] hover:border-[#ff9a47] hover:-translate-y-0.5 shadow-sm hover:shadow-md",
    outline:
      "bg-white/60 text-[#f97316] border border-[#ffd6b0] hover:bg-[#fff7ed] hover:border-[#ff9a47] hover:-translate-y-0.5",
    ghost: "text-[#667089] hover:text-[#f97316] hover:bg-[#fff7ed]",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3.5 text-xs gap-1.5 rounded-xl",
    md: "h-11 px-5 text-sm gap-2 rounded-2xl",
    lg: "h-13 px-7 text-[15px] gap-2.5 rounded-2xl",
    icon: "h-10 w-10 justify-center rounded-xl",
  };
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
}: {
  href: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}) {
  const variants: Record<string, string> = {
    primary: "gold-gradient-btn font-bold tracking-wide",
    secondary:
      "bg-white text-[#f97316] border border-[#ffd6b0] hover:bg-[#fff7ed] hover:border-[#ff9a47] hover:-translate-y-0.5 shadow-sm hover:shadow-md",
    outline:
      "bg-white/60 text-[#f97316] border border-[#ffd6b0] hover:bg-[#fff7ed] hover:border-[#ff9a47] hover:-translate-y-0.5",
    ghost: "text-[#667089] hover:text-[#f97316] hover:bg-[#fff7ed]",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3.5 text-xs gap-1.5 rounded-xl",
    md: "h-11 px-5 text-sm gap-2 rounded-2xl",
    lg: "h-13 px-7 text-[15px] gap-2.5 rounded-2xl",
  };
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex items-center justify-center font-semibold transition-all duration-200",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("gold-glass-card premium-border w-full max-w-full box-border", className)} {...props} />;
}

export function Badge({
  className,
  tone = "neutral",
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "brand" | "success" | "warning" | "danger" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[#f2f4f8] text-[#33415c] border-[#e2e7f0]",
    brand: "bg-[#fff7ed] text-[#f97316] border-[#ffd6b0]",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-600 border-red-200",
    info: "bg-[#f2f4f8] text-[#18243a] border-[#e2e7f0]",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur",
        tones[tone],
        className,
      )}
      {...props}
    >
      {(tone === "brand" || tone === "success") && <span className="badge-dot shrink-0" aria-hidden="true" />}
      <span className="truncate">{children}</span>
    </span>
  );
}

export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className={cn("rounded-full object-cover border border-[#ffd6b0] ring-1 ring-[#ffe7d2] shadow-sm", className)}
      />
    );
  }
  const palette = [
    "bg-gradient-to-br from-[#ff7a00] via-[#f97316] to-[#c2410c]",
    "bg-gradient-to-br from-[#ef4444] via-[#dc2626] to-[#7f1d1d]",
    "bg-gradient-to-br from-[#33415c] via-[#232c40] to-[#121b2e]",
    "bg-gradient-to-br from-[#ff9a47] via-[#ff7a00] to-[#ef4444]",
  ];
  const idx = name.charCodeAt(0) % palette.length;
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white border border-[#ffd6b0] ring-1 ring-[#ffe7d2] shadow-sm",
        palette[idx],
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
          <span className="h-px w-10 bg-gradient-to-r from-[#ff7a00] to-transparent" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold tracking-tight leading-snug text-[#18243a]">
        {title}
      </h2>
      {description && <p className="mt-3.5 text-[15px] leading-relaxed text-muted">{description}</p>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#ffd6b0] bg-[#fffcf8] px-6 py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#f97316] border border-[#ffd6b0]">{icon}</div>
      )}
      <p className="text-base font-semibold text-[#18243a]">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}
