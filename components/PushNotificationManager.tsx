"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Bell, BellOff, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  initializeFirebase,
  requestNotificationPermission,
  subscribeToTopic,
  sendTestNotification,
} from "@/lib/firebase";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testTitle, setTestTitle] = useState("Test Notification");
  const [testBody, setTestBody] = useState(
    "This is a test notification from the PWA",
  );
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const isPushSupported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setIsSupported(isPushSupported);

    if (isPushSupported) {
      // Get current permission state
      setPermission(Notification.permission);

      // Initialize Firebase
      initializeFirebase()
        .then(() => {
          setFirebaseInitialized(true);
          console.log("Firebase initialized successfully");
        })
        .catch((err) => {
          console.error("Failed to initialize Firebase:", err);
          setError(
            "Failed to initialize Firebase. Push notifications may not work properly.",
          );
        });
    }
  }, []);

  const handleRequestPermission = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const permissionResult = await requestNotificationPermission();
      setPermission(permissionResult);

      if (permissionResult === "granted") {
        setSuccess("Notification permission granted!");
      } else {
        setError(
          `Permission ${permissionResult}. Please enable notifications in your browser settings.`,
        );
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to request notification permission",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (permission !== "granted") {
        const permissionResult = await requestNotificationPermission();
        setPermission(permissionResult);

        if (permissionResult !== "granted") {
          throw new Error("Notification permission denied");
        }
      }

      await subscribeToTopic("general");
      setIsSubscribed(true);
      setSuccess("Successfully subscribed to push notifications!");
    } catch (err) {
      console.error("Error subscribing to push notifications:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to subscribe to push notifications",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestNotification = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!isSubscribed) {
        throw new Error("You must subscribe to notifications first");
      }

      await sendTestNotification(testTitle, testBody);
      setSuccess("Test notification sent!");
    } catch (err) {
      console.error("Error sending test notification:", err);
      setError(
        err instanceof Error ? err.message : "Failed to send test notification",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Supported</AlertTitle>
        <AlertDescription>
          Push notifications are not supported in your browser.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          className="bg-green-50 text-green-800 border-green-200"
        >
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {!firebaseInitialized && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Firebase Initializing</AlertTitle>
          <AlertDescription>
            Firebase is being initialized. Some features may not be available
            yet.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Notification Permission</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Current status:{" "}
              <span className="font-medium capitalize">{permission}</span>
            </p>

            {permission !== "granted" && (
              <Button
                onClick={handleRequestPermission}
                disabled={loading || !firebaseInitialized}
              >
                <Bell className="mr-2 h-4 w-4" />
                Request Permission
              </Button>
            )}
          </div>

          {permission === "granted" && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">
                Push Notification Subscription
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isSubscribed
                  ? "You are subscribed to push notifications."
                  : "Subscribe to receive push notifications even when the app is closed."}
              </p>

              {!isSubscribed ? (
                <Button
                  onClick={handleSubscribe}
                  disabled={loading || !firebaseInitialized}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Subscribe to Notifications
                </Button>
              ) : (
                <Button variant="outline" disabled={true}>
                  <BellOff className="mr-2 h-4 w-4" />
                  Subscribed
                </Button>
              )}
            </div>
          )}

          {isSubscribed && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Send Test Notification</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send a test notification to verify everything is working.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testTitle">Notification Title</Label>
                  <Input
                    id="testTitle"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="Enter notification title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testBody">Notification Body</Label>
                  <Textarea
                    id="testBody"
                    value={testBody}
                    onChange={(e) => setTestBody(e.target.value)}
                    placeholder="Enter notification body"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleSendTestNotification}
                  disabled={loading || !firebaseInitialized}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Notification
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
