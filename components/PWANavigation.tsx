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
import { Menu, Wifi, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isAppInstalled } from "@/lib/pwa-utils";
import { navItems } from "@/lib/navLinks-utils";

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
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex md:justify-between h-14 items-center">
        <MobileNav />

        <Link
          href="/"
          className="font-bold inline-block min-w-28 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 text-transparent bg-clip-text"
        >
          Smarts PWA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center xl:gap-2">
          {navItems
            .filter((item) => !item.category)
            .map((item) => (
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
                <span className="max-w-28 truncate">{item.title}</span>
              </Link>
            ))}

          {Array.from(
            new Set(navItems.map((item) => item.category).filter(Boolean))
          ).map((category) => (
            <div key={category} className="relative group">
              <button
                className={cn(
                  "flex items-center p-2 gap-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="max-w-28 truncate">{category}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-background border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  {navItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-2 text-xs font-medium transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {item.icon}
                        <span className="ml-2 truncate">{item.title}</span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
