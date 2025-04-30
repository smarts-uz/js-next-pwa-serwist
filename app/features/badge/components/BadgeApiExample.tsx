"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const BadgeApiExample = () => {
  const [badgeCount, setBadgeCount] = useState(0);

  const handleSetAppBadge = () => {
    if ("setAppBadge" in navigator) {
      try {
        navigator.setAppBadge(badgeCount);
      } catch (error) {
        console.error("Failed to set app badge:", error);
      }
    } else {
      console.warn("App Badge API is not supported in this browser");
    }
  };

  const handleClearAppBadge = () => {
    if ("clearAppBadge" in navigator) {
      try {
        navigator.clearAppBadge();
        setBadgeCount(0);
      } catch (error) {
        console.error("Failed to clear app badge:", error);
      }
    } else {
      console.warn("App Badge API is not supported in this browser");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">App Badge API</h3>
        <p className="text-sm text-muted-foreground">
          Demonstrate setting and clearing app badges
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center space-x-2">
          <span>Badge Count:</span>
          <input
            type="number"
            value={badgeCount}
            onChange={(e) => setBadgeCount(Number(e.target.value))}
            className="w-24 px-2 py-1 border rounded"
            min="0"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={handleSetAppBadge}>Set App Badge</Button>
          <Button variant="destructive" onClick={handleClearAppBadge}>
            Clear App Badge
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BadgeApiExample;
