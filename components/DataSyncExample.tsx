"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Check, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Type for our post data
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export function DataSyncExample() {
  const [post, setPost] = useState<Post | null>(null);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "unsynced" | "syncing" | "error"
  >("synced");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial post data
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts/1",
        );
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
        setEditedPost(data);
        setSyncStatus("synced");
      } catch (err) {
        setError("Failed to load post data. Please try again.");
        setSyncStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!editedPost) return;

    const { name, value } = e.target;
    setEditedPost({
      ...editedPost,
      [name]: value,
    });
    setSyncStatus("unsynced");
  };

  const saveChanges = async () => {
    if (!editedPost) return;

    setSaving(true);

    try {
      // First, save to "local storage" (simulated)
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);

      // Then trigger background sync
      syncInBackground();
    } catch (err) {
      setError("Failed to save changes locally.");
      setSyncStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const syncInBackground = async () => {
    if (!editedPost) return;

    setSyncStatus("syncing");

    try {
      // Simulate background API call to update the post
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${editedPost.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: editedPost.id,
            title: editedPost.title,
            body: editedPost.body,
            userId: editedPost.userId,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to sync changes");

      const updatedPost = await response.json();
      setPost(updatedPost);
      setSyncStatus("synced");
    } catch (err) {
      setSyncStatus("error");
      setError(
        "Failed to sync changes with the server. Will retry automatically.",
      );

      // In a real app, we would queue this for retry when online
      setTimeout(() => {
        syncInBackground();
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !post) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!post || !editedPost) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">JSONPlaceholder API Integration</h3>
          <p className="text-sm text-muted-foreground">
            Edit this post and see background synchronization in action
          </p>
        </div>
        <div className="flex items-center gap-2">
          {syncStatus === "synced" ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <Check className="mr-1 h-3 w-3" />
              Synced with API
            </Badge>
          ) : syncStatus === "syncing" ? (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Syncing with API...
            </Badge>
          ) : syncStatus === "error" ? (
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200"
            >
              Sync Error
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Not Synced
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Post #{post.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={editedPost.title}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="body"
              name="body"
              rows={5}
              value={editedPost.body}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {lastSaved && `Last saved locally at ${lastSaved}`}
          </div>
          <Button
            onClick={saveChanges}
            disabled={saving || syncStatus === "syncing"}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md bg-muted p-4">
        <h4 className="text-sm font-medium mb-2">How it works:</h4>
        <p className="text-sm text-muted-foreground">
          This example demonstrates background synchronization with a real API
          (JSONPlaceholder). When you edit the post and click "Save Changes",
          the data is first saved locally, then synchronized with the server in
          the background. This pattern allows users to continue working even if
          the network connection is slow or intermittent.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          In a production app, you would use IndexedDB or localStorage for local
          storage, and the Background Sync API to ensure changes are
          synchronized even if the user closes the browser.
        </p>
      </div>
    </div>
  );
}
