"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkStatusProps {
  className?: string;
}

export default function NetworkStatus({ className }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Card
      className={cn(
        "border-l-4",
        isOnline ? "border-l-green-500" : "border-l-amber-500",
        className,
      )}
    >
      <CardContent className="p-4 flex items-center">
        {isOnline ? (
          <>
            <Wifi className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="font-medium">You're online</p>
              <p className="text-sm text-muted-foreground">
                All features are available
              </p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="h-5 w-5 text-amber-500 mr-3" />
            <div>
              <p className="font-medium">You're offline</p>
              <p className="text-sm text-muted-foreground">
                Some features may be limited
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
