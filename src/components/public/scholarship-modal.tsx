"use client";

import { useState } from "react";
import { X, GraduationCap, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

interface ScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCHOLARSHIP_TIERS = [
  { cutOff: "180 & Above", benefit: "100% Fee Waiver", highlight: true },
  { cutOff: "170 to 179", benefit: "75% Fee Waiver", highlight: false },
  { cutOff: "165 to 169", benefit: "50% Fee Waiver", highlight: false },
  { cutOff: "160 to 164", benefit: "25% Fee Waiver", highlight: false },
];

export function ScholarshipModal({ isOpen, onClose }: ScholarshipModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scholarship-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop with soft blur */}
      <div
        className="fixed inset-0 bg-[#0c1220]/60 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Floating Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#ffd6b0] bg-white p-6 sm:p-8 shadow-[0_25px_60px_rgba(24,36,58,0.22)] animate-in zoom-in-95 duration-200">
        {/* Floating circular red close button — matches reference screenshot */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="focus-ring absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-[0_4px_12px_rgba(239,68,68,0.4)] transition-transform hover:scale-105 hover:bg-[#dc2626] active:scale-95 sm:right-5 sm:top-5"
        >
          <X className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Header content */}
        <div className="text-center pt-2">
          <h2
            id="scholarship-title"
            className="text-2xl sm:text-[26px] font-black tracking-tight text-[#0f172a]"
          >
            Scholarship Details
          </h2>

          {/* Academic Term with horizontal flanking lines */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#ffd6b0]" />
            <span className="text-2xl sm:text-[28px] font-black tracking-tight text-[#ea580c]">
              2026–2027
            </span>
            <span className="h-px w-10 bg-[#ffd6b0]" />
          </div>

          <p className="mt-2 text-sm font-medium text-[#4b5563]">
            Join <span className="font-extrabold text-[#ea580c]">PPG</span> Institute of Technology
          </p>

          {/* Counselling Code Box */}
          <div className="mx-auto mt-4 max-w-[240px] rounded-2xl border border-[#fed7aa] bg-[#fff7ed] px-4 py-2.5 shadow-sm">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e293b]">
              Counselling Code
            </p>
            <p className="mt-0.5 text-3xl font-black tracking-tight text-[#ea580c]">
              2753
            </p>
          </div>
        </div>

        {/* Scholarship Benefits Table Container */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#fed7aa] shadow-sm">
          {/* Ribbon Header */}
          <div className="bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#ef4444] px-4 py-2.5 text-center text-xs font-black tracking-widest uppercase text-white shadow-inner">
            Scholarship Benefits
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-2 bg-[#ea580c] px-4 py-2 text-[11px] font-extrabold tracking-wider uppercase text-white">
            <div>Cut Off Range</div>
            <div className="text-right">Benefit</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#ffedd5] bg-white">
            {SCHOLARSHIP_TIERS.map((tier) => (
              <div
                key={tier.cutOff}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#fff9f2] transition-colors"
              >
                <span className="text-sm font-bold text-[#0f172a]">
                  {tier.cutOff}
                </span>
                {tier.highlight ? (
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] px-3.5 py-1 text-xs font-black text-white shadow-[0_2px_8px_rgba(249,115,22,0.35)]">
                    {tier.benefit}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-3 py-1 text-xs font-bold text-[#ea580c]">
                    {tier.benefit}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Link
            href="tel:+919047777277"
            onClick={onClose}
            className="focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f97316] to-[#ef4444] px-6 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(249,115,22,0.38)] transition-all hover:brightness-105 hover:shadow-[0_10px_26px_rgba(249,115,22,0.48)] active:scale-[0.98]"
          >
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/about"
            onClick={onClose}
            className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#fed7aa] bg-white px-6 text-xs font-bold text-[#ea580c] transition-all hover:bg-[#fff7ed] active:scale-[0.98]"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#ea580c]" /> View Courses & Details
          </Link>
        </div>
      </div>
    </div>
  );
}
