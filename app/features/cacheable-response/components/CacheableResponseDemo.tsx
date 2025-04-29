"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, XCircle, Key } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResponseData {
  status: number;
  message: string;
  timestamp: string;
  cached: boolean;
  apiKey: string | null;
  expiresIn: string | null;
}

export function CacheableResponseDemo() {
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (status: number) => {
    setIsLoading(true);
    try {
      const apiResponse = await fetch(`/api/test-response?status=${status}`);
      const data = await apiResponse.json();
      const isCached = apiResponse.headers.get("x-cache") === "HIT";

      setResponseData({
        ...data,
        cached: isCached,
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "secondary";
    if (status >= 400 && status < 500) return "destructive";
    return "default";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Cacheable Response Demo</h3>
        <p className="text-sm text-muted-foreground">
          Test different response status codes and see which ones are cached
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => fetchData(200)}
          disabled={isLoading}
          variant="outline"
        >
          Test 200 (Success)
        </Button>
        <Button
          onClick={() => fetchData(404)}
          disabled={isLoading}
          variant="outline"
        >
          Test 404 (Not Found)
        </Button>
        <Button
          onClick={() => fetchData(500)}
          disabled={isLoading}
          variant="outline"
        >
          Test 500 (Error)
        </Button>
      </div>

      {responseData && (
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(responseData.status)}>
                  Status: {responseData.status}
                </Badge>
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

            {responseData.status === 200 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4" />
                  <span className="text-sm font-medium">API Key:</span>
                </div>
                <code className="text-xs block bg-background p-2 rounded">
                  {responseData.apiKey}
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Expires in: {responseData.expiresIn}
                </p>
              </div>
            )}
          </div>

          {!responseData.cached && responseData.status >= 400 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This response was not cached because it has a{" "}
                {responseData.status} status code. Only successful responses
                (2xx) are cached.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
