import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { PostHogProvider } from "~/components/PostHogProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Parallel",
  description:
    "Unlock a custom facial analysis and glow-up roadmap powered by insights from 1,000+ peer-reviewed studies.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <PostHogProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </PostHogProvider>
      </body>
    </html>
  );
}
