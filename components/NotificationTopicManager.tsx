"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MinusCircle, AlertCircle } from "lucide-react";
import { subscribeToTopic, unsubscribeFromTopic } from "@/lib/firebase";

interface NotificationTopicManagerProps {
  token: string;
}

export function NotificationTopicManager({
  token,
}: NotificationTopicManagerProps) {
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the user's subscribed topics here
    // For this example, we'll use local storage to persist topics
    const storedTopics = localStorage.getItem("subscribedTopics");
    if (storedTopics) {
      setTopics(JSON.parse(storedTopics));
    }
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await subscribeToTopic(token, newTopic);
      setTopics([...topics, newTopic]);
      localStorage.setItem(
        "subscribedTopics",
        JSON.stringify([...topics, newTopic]),
      );
      setSuccess(`Subscribed to topic: ${newTopic}`);
      setNewTopic("");
    } catch (error) {
      console.error("Error subscribing to topic:", error);
      setError("Failed to subscribe to topic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (topicToRemove: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await unsubscribeFromTopic(token, topicToRemove);
      const updatedTopics = topics.filter((topic) => topic !== topicToRemove);
      setTopics(updatedTopics);
      localStorage.setItem("subscribedTopics", JSON.stringify(updatedTopics));
      setSuccess(`Unsubscribed from topic: ${topicToRemove}`);
    } catch (error) {
      console.error("Error unsubscribing from topic:", error);
      setError("Failed to unsubscribe from topic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Topics</CardTitle>
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

        <div className="flex space-x-2">
          <Input
            placeholder="Enter topic name"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <Button onClick={handleSubscribe} disabled={loading || !newTopic}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </div>

        {topics.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Subscribed Topics:</h3>
            {topics.map((topic) => (
              <div
                key={topic}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <span>{topic}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnsubscribe(topic)}
                  disabled={loading}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
