"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";

interface DraggableAnnouncementsIconProps {
  count?: number;
}

export function DraggableAnnouncementsIcon({ count = 1 }: DraggableAnnouncementsIconProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [constraints, setConstraints] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  }>({ left: -12, right: 600, top: -150, bottom: 400 });

  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    const updateConstraints = () => {
      const initialLeft = 24; // 24px from viewport left edge
      const initialTop = window.innerHeight * 0.35; // 35vh from viewport top
      const iconSize = 56;
      const margin = 12;

      setConstraints({
        left: -(initialLeft - margin),
        right: Math.max(0, window.innerWidth - initialLeft - iconSize - margin),
        top: -(initialTop - margin),
        bottom: Math.max(0, window.innerHeight - initialTop - iconSize - margin),
      });
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleDragStart = () => {
    isDraggingRef.current = true;
    hasMovedRef.current = true;
  };

  const handleDragEnd = () => {
    // Keep isDraggingRef momentarily true so mouseup/click on laptop doesn't trigger navigation
    setTimeout(() => {
      isDraggingRef.current = false;
      hasMovedRef.current = false;
    }, 120);
  };

  const handleNavigate = (e?: React.MouseEvent) => {
    if (isDraggingRef.current || hasMovedRef.current) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }
    if (e && (e.ctrlKey || e.metaKey)) {
      window.open("/announcements", "_blank");
      return;
    }
    router.push("/announcements");
  };

  if (!mounted) {
    // Static fallback during SSR to avoid hydration mismatch
    return (
      <aside
        className="fixed left-6 top-[35%] z-50 select-none"
        aria-label="Announcements quick access"
      >
        <Link
          href="/announcements"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] text-white shadow-[0_10px_25px_-4px_rgba(234,88,12,0.55)] ring-2 ring-white/70"
          aria-label="View Announcements"
        >
          <Megaphone className="h-6 w-6 text-white drop-shadow-sm" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#ea580c] shadow-md ring-2 ring-[#ea580c]">
            {count}
          </span>
        </Link>
      </aside>
    );
  }

  return (
    <aside
      className="fixed left-6 top-[35%] z-50 select-none"
      aria-label="Announcements quick access"
    >
      {/* Hidden link for crawler & screen-reader SEO */}
      <Link href="/announcements" className="sr-only">
        View Announcements
      </Link>

      <div className="relative flex items-center justify-center">
        {/* Draggable button with native HTML5 drag prevention for desktop/laptop mouse drag */}
        <motion.button
          type="button"
          drag
          dragConstraints={constraints}
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTap={() => handleNavigate()}
          onClick={(e) => handleNavigate(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNavigate();
            }
          }}
          draggable={false}
          onDragStartCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          whileDrag={{ scale: 1.12, cursor: "grabbing" }}
          aria-label="View Announcements"
          title="Announcements"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#fb923c] text-white shadow-[0_10px_25px_-4px_rgba(234,88,12,0.55)] transition-shadow duration-200 hover:shadow-[0_16px_35px_-4px_rgba(234,88,12,0.7)] ring-2 ring-white/70 ring-offset-2 ring-offset-transparent focus:outline-none focus:ring-4 focus:ring-orange-400/50 cursor-grab active:cursor-grabbing select-none touch-none"
          style={
            {
              userSelect: "none",
              WebkitUserDrag: "none",
              touchAction: "none",
            } as React.CSSProperties
          }
        >
          {/* Subtle icon rotation on hover */}
          <Megaphone className="h-6 w-6 text-white drop-shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 pointer-events-none" />

          {/* Unread badge with subtle ping animation */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70 opacity-75" />
            <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#ea580c] shadow-md ring-2 ring-[#ea580c]">
              {count}
            </span>
          </span>

          {/* Tiny subtle grab affordance dot indicator at bottom */}
          <span className="absolute bottom-1.5 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="h-1 w-3 rounded-full bg-white/80" />
          </span>
        </motion.button>
      </div>
    </aside>
  );
}
