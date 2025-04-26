import type React from "react";
import { PWANavigation } from "@/components/PWANavigation";
import Link from "next/link";

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
