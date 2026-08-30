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
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
