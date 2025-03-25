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
  Info,
  ArrowRightLeft,
  Camera,
  Lock,
  Share,
  Vibrate,
  AudioLines
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isAppInstalled } from "@/lib/pwa-utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

// Navigation items based on the PWA project structure with additional links
const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "File Handling",
    href: "/features/file-handling",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Geolocation",
    href: "/features/geolocation",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    title: "Local Storage",
    href: "/features/local-storage",
    icon: <Database className="h-4 w-4" />,
  },
  {
    title: "Network Info",
    href: "/features/network-info",
    icon: <Wifi className="h-4 w-4" />,
  },
  {
    title: "Protocol Handler",
    href: "/features/protocol-handler",
    icon: <LinkIcon className="h-4 w-4" />,
  },
  {
    title: "Media Capture",
    href: "/features/media-capture",
    icon: <Camera className="h-4 w-4" />,
  },
  {
    title: "View Transitions",
    href: "/features/transitions",
    icon: <ArrowRightLeft className="h-4 w-4" />,
  },
  {
    title: "Web Auth",
    href: "/features/web-authentication",
    icon: <Lock className="h-4 w-4" />,
  },
  {
    title: "Web Share API",
    href: "/features/web-share",
    icon: <Share className="h-4 w-4" />,
  },
  {
    title: "Vibration",
    href: "/features/vibration",
    icon: <Vibrate className="h-4 w-4" />,
  },
  {
    title: "Audio Player",
    href: "/features/audio",
    icon: <AudioLines className="size-4" />,
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

  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open main menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] sm:w-[350px] overflow-y-auto"
      >
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
                "flex items-center px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
              {item.badge && (
                <Badge
                  variant="outline"
                  className="ml-auto bg-primary/20 text-primary border-primary/30 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-border">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
              More
            </div>
            <Link
              href="/offline"
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                pathname === "/offline"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsOpen(false)}
            >
              <Info className="h-4 w-4" />
              <span className="ml-2">Offline Page</span>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex  justify-between h-20 items-center">
        <MobileNav />

        <Link
          href="/"
          className="font-bold inline-block bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 text-transparent bg-clip-text"
        >
          Smarts PWA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-wrap md:gap-1 justify-start">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center p-2 gap-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              <span className=" max-w-24 truncate">{item.title}</span>
              {item.badge && (
                <Badge
                  variant="outline"
                  className="ml-0.5 bg-primary/20 text-primary border-primary/30 text-[10px] px-1 py-0"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
