import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { TourProvider } from "@/components/tour/tour-provider";
import { TourWrapper } from "@/components/tour/tour-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexaLine Communications Platform",
  description: "Enterprise-grade virtual number services",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { CurrencyProvider } from "@/providers/currency-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextAuthProvider>
          <CurrencyProvider>
            <TourProvider>
              {children}
              <TourWrapper />
              <Toaster />
            </TourProvider>
          </CurrencyProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
