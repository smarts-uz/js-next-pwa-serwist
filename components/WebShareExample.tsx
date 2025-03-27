"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Share2, AlertCircle } from "lucide-react";

export default function WebShareExample() {
  const [title, setTitle] = useState("Check out this awesome website!");
  const [text, setText] = useState("I found this interesting website that you might like.");
  const [url, setUrl] = useState("https://example.com");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window !== "undefined") {
      return "share" in navigator;
    }
    return false;
  });

  const handleShare = async () => {
    setError(null);
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to share");
      }
    }
  };

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Supported</AlertTitle>
        <AlertDescription>
          The Web Share API is not supported in your browser. Please use a
          supported browser or device.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Share Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter share title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Share Text</Label>
        <Input
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter share text"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Share URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to share"
        />
      </div>

      <Button onClick={handleShare} className="w-full">
        <Share2 className="mr-2 h-4 w-4" />
        Share Content
      </Button>
    </div>
  );
}
