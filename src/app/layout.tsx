import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { ToastProvider } from "@/components/providers/toast-provider";
import { COUNCIL_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: COUNCIL_NAME,
    template: `%s · ${COUNCIL_NAME}`,
  },
  description:
    "The official operating system for the PPG Institute of Technology Student Council — members, teams, tasks, chat, events and more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Cinzel:wght@400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans selection:bg-amber-500/30 selection:text-amber-200 min-h-screen relative" suppressHydrationWarning>
        <div className="campus-bg-blend" aria-hidden="true" />
        <div className="campus-bg-overlay" aria-hidden="true" />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
