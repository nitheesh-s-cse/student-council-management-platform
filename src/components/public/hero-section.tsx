"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DraggableAnnouncementsIcon } from "./draggable-announcements-icon";

export function HeroSection({ announcementsCount }: { announcementsCount?: number }) {
  // Scroll-driven parallax and opacity transforms for hero section
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const bgScale = useTransform(scrollY, [0, 400], [1, 1.08]);
  const bgY = useTransform(scrollY, [0, 400], [0, 70]);

  const contentY = useTransform(scrollY, [0, 350], [0, -35]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0.2]);

  return (
    <>
      {/* Round Moveable Floating Announcement Icon */}
      <DraggableAnnouncementsIcon count={announcementsCount ?? 1} />

      {/* Hero Section */}
      <section className="relative px-4 pt-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative min-h-[520px] sm:min-h-[600px] lg:min-h-[640px] flex items-center overflow-hidden rounded-[28px] sm:rounded-[36px] bg-[#0c1322] shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
            {/* Scroll-faded & Parallax Campus Background Image */}
            <motion.div
              style={{ opacity: bgOpacity, scale: bgScale, y: bgY }}
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-transform"
            >
              <Image
                src="/infra4.avif"
                alt="PPG Institute of Technology Campus"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-[center_35%]"
              />
              {/* Cinematic overlays to match reference styling and guarantee contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
            </motion.div>

            {/* Hero Content with Scroll-driven Parallax and Entrance Animations */}
            <motion.div
              style={{ y: contentY, opacity: contentOpacity }}
              className="relative z-10 max-w-3xl px-4 py-12 sm:px-12 sm:py-24 lg:px-16 w-full box-border will-change-transform"
            >
              <motion.h1
                initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-[64px] font-black tracking-tight text-white leading-[1.08] break-words"
              >
                PPG IT 2026–27<br />
                Student Council<br />
                <span className="text-[#fed7aa]">Empowering Leadership</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-lg font-normal leading-relaxed text-white/90"
              >
                The premier executive student body of PPG Institute of Technology — orchestrating campus innovation, transparent governance, student welfare, and future-ready leadership.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
              >
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition-all hover:bg-[#c2410c] hover:shadow-xl active:scale-95 text-center"
                >
                  Explore Council <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/members"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/15 px-6 py-3 sm:px-7 sm:py-3.5 text-sm font-bold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 text-center"
                >
                  Meet the Board
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
