'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Share2, AlertCircle, Link, Type } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const WebShareExample = () => {
  const [shareData, setShareData] = useState({
    title: 'Web Share API Example',
    text: 'Check out this example of the Web Share API!',
    url: window.location.href,
  });
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setIsSupported(!!navigator.share);
  }, []);

  const handleShare = async () => {
    if (!navigator.share) {
      setError('Web Share API is not supported in your browser.');
      return;
    }

    try {
      await navigator.share(shareData);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while sharing.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Alert variant={isSupported ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Browser Support</AlertTitle>
          <AlertDescription>
            {isSupported 
              ? 'Web Share API is supported in your browser.'
              : 'Web Share API is not supported in your browser.'}
          </AlertDescription>
        </Alert>
      </div>

      <Card className="p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Title
            </Label>
            <Input
              value={shareData.title}
              onChange={(e) => setShareData({ ...shareData, title: e.target.value })}
              placeholder="Enter share title"
              className="h-10"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Description
            </Label>
            <Textarea
              value={shareData.text}
              onChange={(e) => setShareData({ ...shareData, text: e.target.value })}
              placeholder="Enter share description"
              className="min-h-[100px] resize-y"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL
            </Label>
            <Input
              value={shareData.url}
              onChange={(e) => setShareData({ ...shareData, url: e.target.value })}
              placeholder="https://example.com"
              className="h-10"
            />
          </div>

          <Button 
            onClick={handleShare} 
            className="w-full h-11"
            disabled={!isSupported}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Content
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WebShareExample;
