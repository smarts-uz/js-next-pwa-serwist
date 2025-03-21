"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, Send } from "lucide-react";
import {
  initializeFirebase,
  requestNotificationPermission,
  getFirebaseToken,
  sendPushNotification,
  sendNotificationToTopic,
} from "@/lib/firebase";
import { NotificationTopicManager } from "./NotificationTopicManager";

export default function PushNotificationManager() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await initializeFirebase();
        const currentPermission = await requestNotificationPermission();
        setPermission(currentPermission);

        if (currentPermission === "granted") {
          const fcmToken = await getFirebaseToken();
          setToken(fcmToken);
        }
      } catch (error) {
        console.log(error)
        console.error("Error initializing notifications:", error);
        setError("Failed to initialize notifications. Please try again.");
      }
    };

    initializeNotifications();
  }, []);

  const handleRequestPermission = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);

      if (newPermission === "granted") {
        const fcmToken = await getFirebaseToken();
        setToken(fcmToken);
        setSuccess("Notification permission granted!");
      } else {
        setError(
          "Permission denied. Please enable notifications in your browser settings.",
        );
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setError("Failed to request notification permission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (topic) {
        await sendNotificationToTopic(topic, title, body);
        setSuccess(`Notification sent to topic: ${topic}`);
      } else if (token) {
        await sendPushNotification(token, title, body);
        setSuccess("Notification sent successfully!");
      } else {
        throw new Error("No token or topic specified");
      }
      setTitle("");
      setBody("");
      setTopic("");
    } catch (error) {
      console.error("Error sending notification:", error);
      setError("Failed to send notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {permission !== "granted" && (
          <Button onClick={handleRequestPermission} disabled={loading}>
            <Bell className="mr-2 h-4 w-4" />
            Request Notification Permission
          </Button>
        )}

        {permission === "granted" && token && (
          <>
            <NotificationTopicManager token={token} />
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Notification Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Notification Body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Topic (optional)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSendNotification}
                disabled={loading || !title || !body}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
