import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import { LayoutWrapper } from "./layout-wrapper";
import { GoogleAnalytics } from "@next/third-parties/google";
import YandexMetrika from "@/lib/analytics/YandexMetrika";
import { Suspense } from "react";

const PWASetup = dynamic(() => import("@/components/PWASetup"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smarts Next.js Serwist PWA",
  description: "A comprehensive PWA built with Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smarts PWA",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={inter.className + " dark"} suppressHydrationWarning>
        <Suspense fallback={<></>}>
          <YandexMetrika />
        </Suspense>
        <Suspense fallback={<></>}>
          <PWASetup />
        </Suspense>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""}
      />
    </html>
  );
}
