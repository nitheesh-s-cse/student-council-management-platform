"use client";

import { useEffect, useRef } from "react";

// Fixed full-viewport campus background used ONLY on the landing page.
// It fades out as the user scrolls (0 → 420px of scroll) so once you scroll
// down the page returns to the solid dark body background.
export function CampusBackground() {
  const blendRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const p = Math.min(window.scrollY / 420, 1);
        const opacity = String(Math.max(0, 1 - p));
        if (blendRef.current) blendRef.current.style.opacity = opacity;
        if (overlayRef.current) overlayRef.current.style.opacity = opacity;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={blendRef} aria-hidden="true" className="campus-bg-blend" />
      <div ref={overlayRef} aria-hidden="true" className="campus-bg-overlay" />
    </>
  );
}