"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { InfoIcon, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Types
type UpdateMessage = {
  message: string;
  url: string;
  timestamp: string;
  headers: Record<string, string>;
  areResponsesSame: boolean;
};

type ResponseData = {
  data: any;
  headers: Record<string, string>;
};

// Info Alert Component
const InfoAlertComponent = () => (
  <Alert>
    <InfoIcon className="h-4 w-4" />
    <AlertDescription>
      This example demonstrates how Serwist compares cached and fresh responses
      using the <code>responsesAreSame</code> function. The service worker will
      check default headers (content-length, etag, last-modified) to determine
      if a cached response is different from a fresh one.
    </AlertDescription>
  </Alert>
);

// Action Buttons Component
const ActionButtons = ({
  handleTriggerCheck,
  loading,
}: {
  handleTriggerCheck: (params?: string) => Promise<void>;
  loading: boolean;
}) => (
  <div className="flex space-x-3">
    <Button
      onClick={() => handleTriggerCheck()}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? "Checking..." : "Check Identical Responses"}
      {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
    </Button>

    <Button
      onClick={() => handleTriggerCheck("?change=true&changeType=headers")}
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      Trigger Header Change
    </Button>

    <Button
      onClick={() => handleTriggerCheck("?change=true&changeType=body")}
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      Trigger Body Change
    </Button>
  </div>
);

// Update Message Component
const UpdateMessageComponent = ({
  updateMessage,
}: {
  updateMessage: UpdateMessage;
}) => (
  <div className="p-4 bg-secondary rounded-lg space-y-2">
    <div className="flex items-center gap-2">
      <p className="font-medium">Service Worker Update:</p>
      {updateMessage.areResponsesSame !== undefined &&
        (updateMessage.areResponsesSame ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        ))}
    </div>
    <p className="text-sm">{updateMessage.message}</p>
    <p className="text-sm">URL: {updateMessage.url}</p>
    <p className="text-sm">Time: {updateMessage.timestamp}</p>
    {updateMessage.areResponsesSame !== undefined && (
      <p className="text-sm font-medium">
        Responses are{" "}
        {updateMessage.areResponsesSame ? "the same" : "different"}
      </p>
    )}
  </div>
);

// Response Display Component
const ResponseDisplay = ({ response }: { response: ResponseData }) => (
  <>
    <h3 className="font-medium text-sm">Headers:</h3>
    <pre className="text-xs bg-background p-2 rounded max-h-40 overflow-auto">
      {JSON.stringify(response.headers, null, 2)}
    </pre>
    <h3 className="font-medium text-sm">Body:</h3>
    <pre className="text-xs bg-background p-2 rounded max-h-40 overflow-auto">
      {JSON.stringify(response.data, null, 2)}
    </pre>
  </>
);

// Comparison Component
const ComparisonComponent = ({
  cachedResponse,
  freshResponse,
}: {
  cachedResponse: ResponseData;
  freshResponse: ResponseData;
}) => (
  <div className="space-y-2">
    <p className="text-sm font-medium">
      Key Headers Comparison (used by responsesAreSame):
    </p>
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div className="font-medium">Header</div>
      <div className="font-medium">Cached Value</div>
      <div className="font-medium">Fresh Value</div>

      {["etag", "content-length", "last-modified"].map((header) => (
        <>
          <div>
            {header === "content-length"
              ? "Content-Length"
              : header === "last-modified"
              ? "Last-Modified"
              : "ETag"}
          </div>
          <div>{cachedResponse.headers[header] || "N/A"}</div>
          <div
            className={
              freshResponse.headers[header] !== cachedResponse.headers[header]
                ? "bg-yellow-100 dark:bg-yellow-900"
                : ""
            }
          >
            {freshResponse.headers[header] || "N/A"}
          </div>
        </>
      ))}
    </div>
  </div>
);

// Response Tabs Component
const ResponseTabs = ({
  cachedResponse,
  freshResponse,
}: {
  cachedResponse: ResponseData | null;
  freshResponse: ResponseData | null;
}) => (
  <Tabs defaultValue="fresh" className="w-full">
    <TabsList>
      <TabsTrigger value="fresh">Fresh Response</TabsTrigger>
      <TabsTrigger value="cached" disabled={!cachedResponse}>
        Cached Response
      </TabsTrigger>
      <TabsTrigger value="comparison" disabled={!cachedResponse}>
        Comparison
      </TabsTrigger>
    </TabsList>

    <TabsContent value="fresh" className="space-y-2 mt-2">
      {freshResponse && <ResponseDisplay response={freshResponse} />}
    </TabsContent>

    <TabsContent value="cached" className="space-y-2 mt-2">
      {cachedResponse ? (
        <ResponseDisplay response={cachedResponse} />
      ) : (
        <p className="text-sm italic">No cached response available yet.</p>
      )}
    </TabsContent>

    <TabsContent value="comparison" className="space-y-2 mt-2">
      {cachedResponse ? (
        <ComparisonComponent
          cachedResponse={cachedResponse}
          freshResponse={freshResponse!}
        />
      ) : (
        <p className="text-sm italic">
          No cached response available for comparison.
        </p>
      )}
    </TabsContent>
  </Tabs>
);

const ResponsesAreSameExample = () => {
  const [updateMessage, setUpdateMessage] = useState<UpdateMessage | null>(
    null
  );
  const [cachedResponse, setCachedResponse] = useState<ResponseData | null>(
    null
  );
  const [freshResponse, setFreshResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);

  console.log(updateMessage);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "CACHE_UPDATED") {
        setUpdateMessage({
          message: event.data.message,
          url: event.data.url || "/api/test-copy",
          timestamp: event.data.timestamp || new Date().toISOString(),
          headers: event.data.headers || {},
          areResponsesSame: event.data.areResponsesSame,
        });
      }
    };

    navigator.serviceWorker?.addEventListener("message", handleMessage);
    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleTriggerCheck = async (changeParams: string = "") => {
    setLoading(true);

    try {
      const cacheName = "test-copy-cache";
      const request = new Request(`/api/test-copy${changeParams}`);
      const cache = await caches.open(cacheName);
      const cachedResp = await cache.match(request);
      const freshResp = await fetch(request, { cache: "no-store" });
      const freshData = await freshResp.clone().json();

      await cache.put(request, freshResp.clone());

      if (cachedResp) {
        const cachedData = await cachedResp.clone().json();
        setCachedResponse({
          data: cachedData,
          headers: Object.fromEntries(cachedResp.headers.entries()),
        });
        setFreshResponse({
          data: freshData,
          headers: Object.fromEntries(freshResp.headers.entries()),
        });
      } else {
        setCachedResponse(null);
        setFreshResponse({
          data: freshData,
          headers: Object.fromEntries(freshResp.headers.entries()),
        });
      }
    } catch (error) {
      console.error("Error during cache check:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>responsesAreSame Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InfoAlertComponent />
          <ActionButtons
            handleTriggerCheck={handleTriggerCheck}
            loading={loading}
          />
          {updateMessage && (
            <UpdateMessageComponent updateMessage={updateMessage} />
          )}
          {(cachedResponse || freshResponse) && (
            <ResponseTabs
              cachedResponse={cachedResponse}
              freshResponse={freshResponse}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsesAreSameExample;
