"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { InfoIcon } from "lucide-react";

const ResponsesAreSameExample = () => {
  const [updateMessage, setUpdateMessage] = useState<any>(null);

  useEffect(() => {
    // Handle service worker messages
    const handleMessage = (event: MessageEvent) => {
      console.log(event);
      if (event.data.type === "CACHE_UPDATED") {
        setUpdateMessage({
          message: event.data.message,
          url: event.data.url,
          timestamp: event.data.timestamp,
          headers: event.data.headers,
        });
      }
    };

    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "CACHE_UPDATED") {
        alert(event.data.message); // Replace with your preferred notification method
      }
    };

    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Response Headers Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              This example shows how the service worker automatically compares
              cached and fresh responses using the default broadcast update
              headers (content-length, etag, last-modified). When differences
              are detected, the service worker sends an update message.
            </AlertDescription>
          </Alert>

          {updateMessage && (
            <div className="mt-4 p-4 bg-secondary rounded-lg space-y-2">
              <p className="font-medium">Service Worker Update:</p>
              <p className="text-sm">{updateMessage.message}</p>
              <p className="text-sm">URL: {updateMessage.url}</p>
              <p className="text-sm">Time: {updateMessage.timestamp}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Headers Compared:</p>
                <pre className="text-xs bg-background p-2 rounded">
                  {JSON.stringify(updateMessage.headers, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsesAreSameExample;
