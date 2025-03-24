"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Home,
  FileText,
  MapPin,
  Database,
  Wifi,
  LinkIcon,
  Bell,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isAppInstalled } from "@/lib/pwa-utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

// Navigation items based on the PWA project structure
const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "File Handling",
    href: "/features/file-handling",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Geolocation",
    href: "/features/geolocation",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Local Storage",
    href: "/features/local-storage",
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: "Network Info",
    href: "/features/network-info",
    icon: <Wifi className="h-5 w-5" />,
  },
  {
    title: "Protocol Handler",
    href: "/features/protocol-handler",
    icon: <LinkIcon className="h-5 w-5" />,
  },
];

export function PWANavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    setInstalled(isAppInstalled());
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const DesktopNav = () => (
    <div className="hidden md:flex items-center space-x-1 px-0">
      {navItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary/10 text-primary"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {item.icon}
          <span className="ml-2">{item.title}</span>
          {item.badge && (
            <Badge
              variant="outline"
              className="ml-2 bg-primary/20 text-primary border-primary/30"
            >
              {item.badge}
            </Badge>
          )}
        </Link>
      ))}
    </div>
  );

  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          // aria-label="Open main menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle className="text-left flex items-center">
            <span className="font-bold inline-block bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 text-transparent bg-clip-text">
              Smarts PWA
            </span>
            {installed && (
              <Badge
                variant="outline"
                className="ml-2 bg-green-100 text-green-800 border-green-200"
              >
                Installed
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {!isOnline && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm flex items-center">
            <Wifi className="h-4 w-4 mr-2 text-amber-500" />
            You're currently offline
          </div>
        )}

        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-3 rounded-md text-base transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
              {item.badge && (
                <Badge
                  variant="outline"
                  className="ml-auto bg-primary/20 text-primary border-primary/30"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-border">
            <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
              More
            </div>
            <Link
              href="/offline"
              className={cn(
                "flex items-center px-3 py-3 rounded-md text-base transition-colors",
                pathname === "/offline"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              <Info className="h-5 w-5" />
              <span className="ml-3">Offline Page</span>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MobileNav />

        <div className="mx-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 text-transparent bg-clip-text">
              Smarts PWA
            </span>
            {installed && (
              <Badge
                variant="outline"
                className="hidden md:inline-flex bg-green-100 text-green-800 border-green-200"
              >
                Installed
              </Badge>
            )}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <DesktopNav />

          <div className="w-full flex-1 md:w-auto md:flex-none">
            {!isOnline && (
              <div className="hidden md:flex items-center mr-2">
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 border-amber-200"
                >
                  Offline
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
