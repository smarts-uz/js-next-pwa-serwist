"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Download } from "lucide-react";

export default function Page() {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCacheContent = async () => {
    setIsLoading(true);
    try {
      const res = await window.serwist.messageSW({ action: "cache-on-demand" });
      setIsComplete(res);
    } catch (error) {
      console.error("Failed to cache content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cache Content On Demand</CardTitle>
          <CardDescription>
            Cache specific content for offline access using the Service Worker
            API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This demo shows how to cache specific content on demand using the
            Service Worker API. The content will be available offline after
            caching.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">How it works:</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
              <li>Click the button to cache an image</li>
              <li>The image will be stored in the browser's cache</li>
              <li>Try accessing the image page while offline</li>
              <li>The cached content will be served from the Service Worker</li>
            </ul>
          </div>

          <Button
            onClick={handleCacheContent}
            disabled={isLoading || isComplete}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Caching..." : "Cache Image"}
          </Button>

          {isComplete && (
            <Alert className="bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="space-y-4">
                <p>Image cached successfully!</p>
                <img
                  src="/images/cache-me-outside.jpg"
                  alt="Cached image"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Cache On Demand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Cache on demand is a powerful feature of Progressive Web Apps that
            allows you to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Cache specific content when needed</li>
            <li>Optimize storage usage by caching only required resources</li>
            <li>Provide offline access to important content</li>
            <li>Improve performance by serving cached content instantly</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
