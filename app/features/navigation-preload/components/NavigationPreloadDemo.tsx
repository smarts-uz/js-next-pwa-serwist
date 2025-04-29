"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Debug logging
const debug = (...args: any[]) => {
  console.log("[NavigationPreloadDemo]", ...args);
};

export const NavigationPreloadDemo = () => {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastToggleTime, setLastToggleTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [swStatus, setSwStatus] = useState<string>("checking");

  const checkServiceWorker = useCallback(async () => {
    try {
      if ("serviceWorker" in navigator) {
        debug("Service Worker is supported");
        const registration = await navigator.serviceWorker.ready;
        debug("Service Worker ready:", registration);

        if (registration.active) {
          setSwStatus("active");
          debug("Service Worker is active");
          await checkNavigationPreloadState();
        } else {
          setSwStatus("waiting");
          debug("Service Worker is waiting");
        }

        // Listen for service worker updates
        registration.addEventListener("updatefound", () => {
          debug("Service Worker update found");
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              debug("New Service Worker state:", newWorker.state);
              if (newWorker.state === "activated") {
                setSwStatus("active");
                checkNavigationPreloadState();
              }
            });
          }
        });
      } else {
        setError("Service Worker is not supported in this browser");
      }
    } catch (err) {
      debug("Error checking service worker:", err);
      setError("Failed to check service worker status");
    }
  }, []);

  const checkNavigationPreloadState = async () => {
    try {
      if ("serviceWorker" in navigator) {
        debug("Checking navigation preload state");
        const registration = await navigator.serviceWorker.ready;
        debug("Service worker ready");
        const state = await registration.navigationPreload.getState();
        debug("Current state:", state);
        setIsEnabled(state.enabled ?? false);
        setError(null);
      }
    } catch (err) {
      debug("Error checking state:", err);
      setError("Failed to check navigation preload state");
    }
  };

  const toggleNavigationPreload = async () => {
    setLoading(true);
    setError(null);
    try {
      if ("serviceWorker" in navigator) {
        debug("Toggling navigation preload");
        const registration = await navigator.serviceWorker.ready;
        if (!registration.active) {
          throw new Error("Service worker is not active");
        }
        debug("Sending TOGGLE_NAV_PRELOAD message");
        await registration.active.postMessage({ type: "TOGGLE_NAV_PRELOAD" });
      } else {
        setError("Service Worker is not supported in this browser");
      }
    } catch (err) {
      debug("Toggle error:", err);
      setError("Failed to toggle navigation preload");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debug("Component mounted");
    checkServiceWorker();
  }, [checkServiceWorker]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Preload</CardTitle>
          <CardDescription>
            Control the navigation preload feature of your service worker. When
            enabled, the browser will preload resources during navigation,
            improving page load performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isEnabled ?? false}
              onCheckedChange={toggleNavigationPreload}
              disabled={loading || isEnabled === null}
            />
            <Label>Enable Navigation Preload</Label>
          </div>
          <div className="text-sm text-muted-foreground">
            Current state:{" "}
            {isEnabled === null
              ? "Checking..."
              : isEnabled
              ? "Enabled"
              : "Disabled"}
          </div>
          {lastToggleTime && (
            <div className="text-sm text-muted-foreground">
              Last toggled: {lastToggleTime.toLocaleTimeString()}
            </div>
          )}
          <Button
            onClick={toggleNavigationPreload}
            disabled={loading || isEnabled === null}
            variant="outline"
          >
            {loading ? "Toggling..." : "Toggle Navigation Preload"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
