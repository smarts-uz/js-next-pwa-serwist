import type React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
const PWANavigation = dynamic(() => import("@/components/PWANavigation"), {
  ssr: false,
  loading: () => (
    <div className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex md:justify-between px-4 h-14 items-center">
        {/* Mobile Menu Button */}
        <Skeleton className="h-10 w-10 rounded-md md:hidden" />

        {/* Logo/Brand */}
        <Skeleton className="h-6 w-28" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center  gap-2">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-8 w-20" />
          ))}
        </div>
      </div>
    </div>
  ),
});

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <PWANavigation />
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>
          Next.js PWA Example created by{" "}
          <Link
            className="text-red-400 underline"
            href="https://github.com/Ramz001"
          >
            Ramz
          </Link>{" "}
          &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
