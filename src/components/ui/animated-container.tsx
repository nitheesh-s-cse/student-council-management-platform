"use client";

import { motion, useScroll, useSpring, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Pinned top-edge scroll progress indicator with spring physics.
 */
export function ScrollProgressBar({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className={cn(
        "fixed top-0 left-0 right-0 h-[3.5px] z-[60] origin-left bg-gradient-to-r from-[#ff7a00] via-[#f97316] to-[#ef4444] shadow-[0_1px_10px_rgba(255,122,0,0.5)] pointer-events-none will-change-transform",
        className
      )}
    />
  );
}

export function MotionDiv({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -25px 0px" }}
      transition={{ duration, delay, ease: PREMIUM_EASE }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Directional scroll reveal with mobile-safe viewport margins and no heavy filter blurs.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
  direction = "up",
  distance = 24,
  scale = 0.98,
  viewportMargin = "0px 0px -25px 0px",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  scale?: number;
  viewportMargin?: string;
  once?: boolean;
}) {
  const xOffset = direction === "left" ? -distance : direction === "right" ? distance : 0;
  const yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: xOffset,
        y: yOffset,
        scale,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once, amount: 0.08, margin: viewportMargin as any }}
      transition={{
        duration,
        delay,
        ease: PREMIUM_EASE,
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual scroll-animated card that triggers independently on mobile and desktop.
 * As the user scrolls down, each card smoothly glides into view.
 */
export function ScrollCard({
  children,
  className,
  delay = 0,
  yOffset = 26,
  scale = 0.97,
  duration = 0.55,
  whileHover = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  scale?: number;
  duration?: number;
  whileHover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -25px 0px" }}
      transition={{ duration, delay, ease: PREMIUM_EASE }}
      whileHover={
        whileHover
          ? {
              y: -5,
              transition: { duration: 0.22, ease: "easeOut" },
            }
          : undefined
      }
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

// Wrapper ensuring Framer Motion always executes animations, even in mobile battery saver modes
export function AnimationScope({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}

export function StaggerCard({
  children,
  className,
  whileHover = true,
  yOffset = 28,
}: {
  children: ReactNode;
  className?: string;
  whileHover?: boolean;
  yOffset?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset, scale: 0.96, filter: "blur(4px)" },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.55, ease: PREMIUM_EASE },
        },
      }}
      whileHover={
        whileHover
          ? {
              y: -5,
              transition: { duration: 0.22, ease: "easeOut" },
            }
          : undefined
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25, scale: 0.96, filter: "blur(4px)" },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: PREMIUM_EASE },
        },
      }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStatCard({
  value,
  label,
  delay = 0,
}: {
  value: string | number;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5, delay, ease: PREMIUM_EASE }}
      className="border-b border-[#ffd6b0] px-4 py-5 text-center last:border-b-0 min-[400px]:border-b-0 min-[400px]:border-r min-[400px]:py-0 min-[400px]:last:border-r-0"
    >
      <p className="text-3xl font-extrabold tracking-tight text-brand-gradient sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
    </motion.div>
  );
}

// Simple card wrapper — the previous 3D tilt and cursor glare were removed
// for a restrained, flat card treatment.
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("group relative h-full", className)}>{children}</div>;
}

