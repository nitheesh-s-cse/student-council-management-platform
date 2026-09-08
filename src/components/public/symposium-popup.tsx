"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  HelpCircle,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface SymposiumPopupProps {
  initialOpen?: boolean;
  onCloseCallback?: () => void;
}

const STORAGE_KEY = "ppgit_symposium_popup_dismissed_session";

export function SymposiumPopup({ initialOpen = true, onCloseCallback }: SymposiumPopupProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    // If the page was refreshed (reloaded), reset the session dismissal flag so the user sees it
    let isReload = false;
    try {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (navEntry && navEntry.type === "reload") {
        isReload = true;
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Fallback for environments without navigation timing
    }

    if (!isReload) {
      try {
        const isDismissed = sessionStorage.getItem(STORAGE_KEY) === "true";
        if (isDismissed) {
          setIsOpen(false);
        }
      } catch {
        // Ignore sessionStorage restrictions
      }
    }

    const handleCustomOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-symposium-popup", handleCustomOpen);
    return () => window.removeEventListener("open-symposium-popup", handleCustomOpen);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore sessionStorage restrictions
    }
    if (onCloseCallback) {
      onCloseCallback();
    }
  }, [onCloseCallback]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  const handleScrollToDetails = () => {
    handleClose();
    const detailsSection = document.getElementById("event-details");
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToRegister = () => {
    handleClose();
    const regSection = document.getElementById("register-section");
    if (regSection) {
      regSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="symposium-popup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop overlay with blur */}
      <div
        className="fixed inset-0 bg-[#0c1220]/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Center-screen Modal Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[26px] sm:rounded-[32px] border border-[#ffd6b0] bg-white p-5 sm:p-7 shadow-[0_25px_65px_rgba(24,36,58,0.28)] animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Subtle decorative background gradient circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#ffedd5] via-[#fed7aa]/50 to-transparent blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#fed7aa]/40 to-transparent blur-2xl"
        />

        {/* Close (×) Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close symposium popup"
          className="focus-ring absolute right-3.5 top-3.5 sm:right-5 sm:top-5 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] shadow-sm transition-all hover:bg-[#ef4444] hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
        </button>

        {/* Scrollable Content inside modal */}
        <div className="relative z-10 overflow-y-auto pr-1">
          {/* Top Eyebrow Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7ed] border border-[#fed7aa] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#ea580c]">
              <Sparkles className="h-3 w-3 text-[#ea580c] animate-pulse" />
              PPGIT Flagship Event
            </span>
          </div>

          {/* Title */}
          <h2
            id="symposium-popup-title"
            className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#18243a] leading-snug"
          >
            College Symposium
          </h2>

          {/* Date & Quick Meta Pill */}
          <div className="mt-3 rounded-2xl border border-[#fed7aa] bg-gradient-to-r from-[#fff7ed] to-[#fffaf5] p-3.5 sm:p-4">
            <div className="flex items-center gap-2 text-[#ea580c] font-black text-base sm:text-lg">
              <CalendarDays className="h-5 w-5 shrink-0" />
              <span>Date: 25th September 2026</span>
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-[#475569]">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#ea580c]" />
                <span>09:30 AM – 04:30 PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#ea580c]" />
                <span>PPGIT Auditoriums & Labs</span>
              </div>
            </div>
          </div>

          {/* Short Description */}
          <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-[#4b5563]">
            The premier inter-collegiate symposium uniting students to showcase innovation,
            technical prowess, and creative talent. Compete against top engineering teams, present
            your vision, and earn honors and awards.
          </p>

          {/* Key Event Highlights */}
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#18243a] flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#ea580c]" />
              Key Event Highlights
            </p>

            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-start gap-2.5 rounded-xl border border-[#ffe7d2] bg-white p-2.5 shadow-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#18243a]">Paper Presentation</p>
                  <p className="text-[10px] text-muted leading-tight mt-0.5">AI, IoT & Core Engineering</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-[#ffe7d2] bg-white p-2.5 shadow-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
                  <Code2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#18243a]">Code Odyssey</p>
                  <p className="text-[10px] text-muted leading-tight mt-0.5">Speed Coding & Bug Hunt</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-[#ffe7d2] bg-white p-2.5 shadow-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#18243a]">Tech Quiz & Web Design</p>
                  <p className="text-[10px] text-muted leading-tight mt-0.5">Algorithmic & UI Sprint</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-[#ffe7d2] bg-white p-2.5 shadow-xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
                  <Trophy className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#18243a]">Project Expo & Prizes</p>
                  <p className="text-[10px] text-muted leading-tight mt-0.5">Cash Prizes & Merit Medals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleScrollToRegister}
              className="focus-ring flex-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#c2410c] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(234,88,12,0.35)] transition-all hover:brightness-105 hover:shadow-lg active:scale-98 cursor-pointer text-center"
            >
              Register Now <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleScrollToDetails}
              className="focus-ring flex-1 flex h-11 items-center justify-center gap-2 rounded-xl border border-[#fed7aa] bg-white px-5 text-xs font-bold text-[#ea580c] shadow-xs transition-all hover:bg-[#fff7ed] active:scale-98 cursor-pointer text-center"
            >
              View Details
            </button>
          </div>

          {/* Notice note */}
          <p className="mt-3 text-center text-[10px] text-muted font-medium">
            Open to all college & university departments · Certificates for all participants
          </p>
        </div>
      </div>
    </div>
  );
}
