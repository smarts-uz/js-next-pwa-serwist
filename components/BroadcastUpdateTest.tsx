"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

export function BroadcastUpdateTest() {
  const [lastUpdate, setLastUpdate] = useState<{ time: string; timestamp: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(lastUpdate)

  useEffect(() => {
    // Listen for cache updates from BroadcastChannel
    const channel = new BroadcastChannel('cache-updates');
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CACHE_UPDATED') {
        const now = new Date();
        setLastUpdate({
          time: now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
          }),
          timestamp: now.getTime()
        });
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.close();
    };
  }, []);

  const triggerUpdate = async () => {
    setIsLoading(true);
    try {
      // Make a request to trigger cache update
      const response = await fetch('/api/test-broadcast');
      const data = await response.json();
      
      // Broadcast the update to all tabs
      const channel = new BroadcastChannel('cache-updates');
      channel.postMessage({
        type: 'CACHE_UPDATED',
        timestamp: Date.now()
      });
      channel.close();
    } catch (error) {
      console.error('Error triggering update:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          onClick={triggerUpdate} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Trigger Update
        </Button>
        {lastUpdate && (
          <Badge variant="outline">
            Last Update: {lastUpdate.toString()}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Open this page in multiple tabs to see the broadcast update in action.
        When you click the button, all tabs will receive the update notification.
      </p>
    </div>
  );
} 