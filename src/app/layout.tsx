import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { ToastProvider } from "@/components/providers/toast-provider";
import { AmbientBackground } from "@/components/public/ambient-background";
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
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased font-sans min-h-screen relative bg-white text-[#18243a] selection:bg-[#ff7a00]/20 selection:text-[#18243a]"
        suppressHydrationWarning
      >
        <AmbientBackground />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
