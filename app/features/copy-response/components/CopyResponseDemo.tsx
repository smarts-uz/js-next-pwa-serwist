"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, XCircle } from "lucide-react";

interface ResponseData {
  status: number;
  message: string;
  timestamp: string;
  cached: boolean;
  originalHeaders: Record<string, string>;
  modifiedHeaders: Record<string, string>;
}

export function CopyResponseDemo() {
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await fetch("/api/test-copy");
      const data = await apiResponse.json();

      // Check if response came from cache
      const isCached = apiResponse.headers.get("x-cache") === "HIT";

      // Get original headers
      const originalHeaders: Record<string, string> = {};
      apiResponse.headers.forEach((value, key) => {
        originalHeaders[key] = value;
      });

      // Get modified headers (after service worker copy)
      const modifiedHeaders: Record<string, string> = {};
      const modifiedResponse = await fetch("/api/test-copy-modified");
      modifiedResponse.headers.forEach((value, key) => {
        modifiedHeaders[key] = value;
      });

      setResponseData({
        ...data,
        cached: isCached,
        originalHeaders,
        modifiedHeaders,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Copy Response Demo</h3>
        <p className="text-sm text-muted-foreground">
          Test how responses are copied and modified by the service worker
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={fetchData} disabled={isLoading} variant="outline">
          Test Response Copy
        </Button>
      </div>

      {responseData && (
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Status: {responseData.status}</Badge>
                {responseData.cached ? (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Cached
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Not Cached
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {responseData.timestamp}
              </span>
            </div>
            <p className="text-sm mb-4">{responseData.message}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Original Headers:</h4>
                <pre className="text-xs bg-background p-2 rounded overflow-auto">
                  {JSON.stringify(responseData.originalHeaders, null, 2)}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Modified Headers:</h4>
                <pre className="text-xs bg-background p-2 rounded overflow-auto">
                  {JSON.stringify(responseData.modifiedHeaders, null, 2)}
                </pre>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Copy className="h-3 w-3" />
                <span>
                  Notice how the service worker copies and modifies the response
                  headers
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
