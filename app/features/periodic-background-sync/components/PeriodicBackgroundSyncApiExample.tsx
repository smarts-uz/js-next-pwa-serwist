"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PeriodicBackgroundSyncApiExample = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [lastSync, setLastSync] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const checkSupport = async () => {
      const status = await navigator.permissions.query({
        name: "periodic-background-sync" as PermissionName,
      });
      if (status.state === "granted") {
        // Periodic background sync can be used.
        setIsSupported(true);
      } else {
        // Periodic background sync cannot be used.
        setIsSupported(false);
      }
    };
    checkSupport();
  }, []);

  const handleRegisterSync = async () => {
    if (!isSupported) return;

    const registration = await navigator.serviceWorker.ready;
    if ("periodicSync" in registration) {
      try {
        // @ts-ignore
        await registration.periodicSync.register("content-sync", {
          // An interval of one minute.
          minInterval: 60 * 1000,
        });
        // @ts-ignore
        const tags = await registration.periodicSync.getTags();
        // Only update content if sync isn't set up.
        if (!tags.includes("content-sync")) {
          updateContentOnPageLoad();
        }

        setSyncStatus("Periodic sync registered successfully");
        setLastSync(new Date().toLocaleString());
      } catch (error) {
        // Periodic background sync cannot be used.
        setSyncStatus("Failed to register periodic sync");
        console.error(error);
      }
    }
  };

  const handleUnregisterSync = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      if ("periodicSync" in registration) {
        // @ts-ignore
        await registration.periodicSync.unregister("content-sync");
        setSyncStatus("Periodic sync unregistered");
      }
    } catch (error) {
      setSyncStatus("Failed to unregister periodic sync");
      console.error(error);
    }
  };

  useEffect(() => {
    updateContentOnPageLoad();
  }, []);

  const updateContentOnPageLoad = async () => {
    try {
      const res = await fetch("/api/test-response?status=200");
      if (!res.ok) throw new Error("Failed to fetch content");

      const data = await res.json();
      setContent(JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Content update error:", error);
      setContent("Failed to update content");
      return null;
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
          <Button onClick={handleRegisterSync} disabled={!isSupported}>
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

        {content && (
          <div className="text-sm text-muted-foreground overflow-x-scroll">
            Content: {content}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeriodicBackgroundSyncApiExample;
