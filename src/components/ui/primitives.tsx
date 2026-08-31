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
    primary: "gold-gradient-btn font-semibold tracking-wide border border-amber-300/30 shadow-lg shadow-amber-950/40",
    secondary: "bg-[#161824]/90 text-amber-100/90 hover:text-amber-100 hover:bg-[#1d2030] border border-amber-500/20 backdrop-blur",
    outline: "border border-amber-500/30 text-amber-100/90 hover:text-white hover:bg-amber-500/10 hover:border-amber-500/60 backdrop-blur",
    ghost: "text-amber-200/80 hover:text-amber-200 hover:bg-amber-500/10",
    danger: "bg-rose-900/40 text-rose-200 border border-rose-700/40 hover:bg-rose-800/60",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3.5 text-xs gap-1.5 rounded-xl",
    md: "h-11 px-5 text-sm gap-2 rounded-xl",
    lg: "h-13 px-7 text-[15px] gap-2.5 rounded-2xl",
    icon: "h-10 w-10 justify-center rounded-xl",
  };
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
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
    primary: "gold-gradient-btn font-semibold tracking-wide border border-amber-300/30 shadow-lg shadow-amber-950/40",
    secondary: "bg-[#161824]/90 text-amber-100/90 hover:text-amber-100 hover:bg-[#1d2030] border border-amber-500/20 backdrop-blur",
    outline: "border border-amber-500/30 text-amber-100/90 hover:text-white hover:bg-amber-500/10 hover:border-amber-500/60 backdrop-blur",
    ghost: "text-amber-200/80 hover:text-amber-200 hover:bg-amber-500/10",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3.5 text-xs gap-1.5 rounded-xl",
    md: "h-11 px-5 text-sm gap-2 rounded-xl",
    lg: "h-13 px-7 text-[15px] gap-2.5 rounded-2xl",
  };
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex items-center justify-center font-medium transition-all duration-200",
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
  return <div className={cn("gold-glass-card premium-border max-w-full", className)} {...props} />;
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
    neutral: "bg-zinc-900/80 text-zinc-300 border-zinc-700/50",
    brand: "bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(212,175,55,0.2)]",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    info: "bg-sky-500/15 text-sky-300 border-sky-500/30",
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
        className={cn("rounded-full object-cover border border-amber-500/30 ring-1 ring-amber-500/25 shadow-[0_0_14px_rgba(212,175,55,0.18)]", className)}
      />
    );
  }
  const palette = [
    "bg-gradient-to-br from-amber-500 via-amber-700 to-amber-950",
    "bg-gradient-to-br from-yellow-500 via-amber-800 to-amber-950",
    "bg-gradient-to-br from-zinc-500 via-zinc-700 to-zinc-950",
    "bg-gradient-to-br from-amber-600 via-yellow-800 to-amber-950",
  ];
  const idx = name.charCodeAt(0) % palette.length;
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-serif font-bold text-amber-100 border border-amber-500/30 ring-1 ring-amber-500/25 shadow-[0_0_14px_rgba(212,175,55,0.18)]",
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
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
          <span className="h-px w-10 bg-gradient-to-r from-amber-500/90 to-transparent" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-serif gold-gradient-text text-[clamp(1.75rem,3.5vw,2.5rem)] font-normal tracking-tight leading-snug">
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
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-500/20 bg-[#141622]/40 backdrop-blur-xl px-6 py-16 text-center">
      {icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">{icon}</div>}
      <p className="text-base font-serif text-amber-100">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}
