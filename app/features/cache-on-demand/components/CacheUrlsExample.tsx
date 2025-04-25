"use client";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function CacheUrlsExample() {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCacheUrls = async () => {
    setIsLoading(true);
    try {
      const res = await window.serwist.messageSW({
        type: "CACHE_URLS",
        payload: {
          urlsToCache: [
            "/",
            "/offline",
            "/manifest.json",
            "/favicon.ico",
            "/images/logo.png",
          ],
        },
      });
      setIsComplete(res);
    } catch (error) {
      console.error("Failed to cache urls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache URLs</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleCacheUrls} disabled={isLoading || isComplete}>
          <Download className="mr-2 h-4 w-4" />
          {isLoading ? "Caching..." : "Cache URLs"}
        </Button>
      </CardContent>
    </Card>
  );
}
