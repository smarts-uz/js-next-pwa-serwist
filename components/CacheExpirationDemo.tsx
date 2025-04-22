"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Clock, Key, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CacheStatus {
  timestamp: number;
  expiresAt: number;
  isExpired: boolean;
}

interface ApiKeyData {
  key: string;
  lastRefresh: Date;
  status: "valid" | "expired";
}

export function CacheExpirationDemo() {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData | null>(null);

  // console.log(cacheStatus);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test-response?status=200");
      const data = await response.json();

      setApiKeyData({
        key: data.apiKey,
        lastRefresh: new Date(),
        status: "valid",
      });

      setCacheStatus({
        timestamp: data.timestamp,
        expiresAt: data.expiresAt,
        isExpired: false,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!cacheStatus) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const isExpired = now >= cacheStatus.expiresAt;

      if (isExpired && !cacheStatus.isExpired) {
        setApiKeyData((prev) =>
          prev
            ? {
                ...prev,
                status: "expired",
              }
            : null
        );
      }

      setCacheStatus((prev) =>
        prev
          ? {
              ...prev,
              isExpired,
            }
          : null
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [cacheStatus]);

  const getTimeRemaining = () => {
    if (!cacheStatus) return 0;
    const now = Date.now();
    const remaining = cacheStatus.expiresAt - now;
    return Math.max(0, remaining);
  };

  const getProgressValue = () => {
    if (!cacheStatus) return 0;
    const total = 60 * 1000; // 1 minute in milliseconds
    const remaining = getTimeRemaining();
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">API Key Status</h3>
          <p className="text-sm text-muted-foreground">
            API key expires after 1 minute (using CacheExpiration)
          </p>
        </div>
        <Button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Key
        </Button>
      </div>

      {cacheStatus && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Time remaining: {formatTime(getTimeRemaining())}
            </span>
          </div>
          <Progress value={getProgressValue()} />
          <div className="flex items-center gap-2">
            <Badge variant={cacheStatus.isExpired ? "destructive" : "default"}>
              {cacheStatus.isExpired ? "Expired" : "Valid"}
            </Badge>
          </div>
        </div>
      )}

      {apiKeyData && (
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <h4 className="text-sm font-medium">API Key:</h4>
              </div>
              <span className="text-xs text-muted-foreground">
                Last refreshed: {apiKeyData.lastRefresh.toLocaleTimeString()}
              </span>
            </div>
            <code className="text-xs block bg-background p-2 rounded">
              {apiKeyData.key}
            </code>
          </div>

          {apiKeyData.status === "expired" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                API key has expired. Please refresh to get a new key.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
