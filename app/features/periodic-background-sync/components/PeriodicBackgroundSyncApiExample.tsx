"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PeriodicBackgroundSyncApiExample = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [lastSync, setLastSync] = useState<string>("");

  useEffect(() => {
    const checkSupport = () => {
      if ("serviceWorker" in navigator && "periodicSync" in navigator.serviceWorker) {
        setIsSupported(true);
      } else {
        setSyncStatus("Periodic Background Sync not supported");
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  const handleRegisterSync = async () => {
    try {
      if (isSupported) {
        const registration = await navigator.serviceWorker.ready;
        // @ts-ignore
        const tags = await registration.periodicSync.getTags();
        
        if (!tags.includes("content-sync")) {
          // @ts-ignore
          await registration.periodicSync.register("content-sync", {
            minInterval: 24 * 60 * 60 * 1000, // 24 hours
          });
          setSyncStatus("Periodic sync registered successfully");
          setLastSync(new Date().toLocaleString());
        }
      }
    } catch (error) {
      setSyncStatus("Failed to register periodic sync");
    }
  };

  const handleUnregisterSync = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      // @ts-ignore
      await registration.periodicSync.unregister("content-sync");
      setSyncStatus("Periodic sync unregistered");
    } catch (error) {
      setSyncStatus("Failed to unregister periodic sync");
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Periodic Background Sync API
          <Badge variant="outline" className="ml-2">
            {isSupported ? "Supported" : "Not Supported"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleRegisterSync}
            disabled={!isSupported}
          >
            Register Periodic Sync
          </Button>
          <Button 
            onClick={handleUnregisterSync}
            variant="outline"
            disabled={!isSupported}
          >
            Unregister Periodic Sync
          </Button>
        </div>
        
        {syncStatus && (
          <div className="text-sm text-muted-foreground">
            Status: {syncStatus}
          </div>
        )}
        
        {lastSync && (
          <div className="text-sm text-muted-foreground">
            Last Sync: {lastSync}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeriodicBackgroundSyncApiExample;
