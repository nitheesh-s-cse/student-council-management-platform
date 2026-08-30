"use client";

import { cn } from "@/lib/utils";

// Ambient luxury background: drifting aurora orbs, rising gold particles and
// a filmic grain. Rendered behind page content (z-index below content) on
// hero-styled pages. Purely decorative and pointer-transparent.
export function PremiumAmbience({ className }: { className?: string }) {
  const particles = [
    { left: "6%", size: 6, delay: 0, dur: 14 },
    { left: "16%", size: 4, delay: 3, dur: 18 },
    { left: "27%", size: 7, delay: 6, dur: 16 },
    { left: "38%", size: 3, delay: 1, dur: 20 },
    { left: "48%", size: 5, delay: 8, dur: 15 },
    { left: "59%", size: 4, delay: 4, dur: 19 },
    { left: "68%", size: 6, delay: 10, dur: 17 },
    { left: "78%", size: 3, delay: 2, dur: 21 },
    { left: "87%", size: 5, delay: 7, dur: 16 },
    { left: "94%", size: 4, delay: 12, dur: 18 },
  ];

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {/* Drifting aurora orbs */}
      <div
        className="aurora-orb"
        style={{
          width: 520,
          height: 520,
          left: "-12%",
          top: "-18%",
          background: "radial-gradient(circle, rgba(212,175,55,0.24), rgba(212,175,55,0.06) 55%, transparent 72%)",
          animation: "aurora-a 18s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-orb"
        style={{
          width: 430,
          height: 430,
          right: "-10%",
          top: "2%",
          background: "radial-gradient(circle, rgba(140,110,50,0.2), rgba(140,110,50,0.05) 55%, transparent 72%)",
          animation: "aurora-b 22s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-orb"
        style={{
          width: 360,
          height: 360,
          left: "16%",
          top: "52%",
          background: "radial-gradient(circle, rgba(212,175,55,0.14), transparent 70%)",
          animation: "aurora-c 26s ease-in-out infinite",
        }}
      />

      {/* Rising gold particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}

      {/* Filmic grain */}
      <div className="premium-grain" />
    </div>
  );
}