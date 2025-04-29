"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Power, Timer, Battery, Moon, Sun } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WakeLockSentinel {
  released: boolean;
  type: "screen";
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
  release: () => Promise<void>;
}
const ScreenWakeExamle = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [autoRelease, setAutoRelease] = useState(false);
  const [releaseTime, setReleaseTime] = useState(5); // minutes

  useEffect(() => {
    // Check if Wake Lock API is supported
    if ("wakeLock" in navigator) {
      setIsSupported(true);
    }

    // Get battery information if available
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level * 100);
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(battery.level * 100);
        });
      });
    }

    // Cleanup
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const requestWakeLock = async () => {
    try {
      const sentinel = await navigator.wakeLock.request("screen");
      setWakeLock(sentinel);
      setIsActive(true);

      // Handle wake lock release
      sentinel.addEventListener("release", () => {
        setIsActive(false);
        setElapsedTime(0);
      });

      // Auto release after specified time
      if (autoRelease) {
        setTimeout(async () => {
          if (sentinel && !sentinel.released) {
            await sentinel.release();
          }
        }, releaseTime * 60 * 1000);
      }
    } catch (error) {
      console.error("Wake Lock error:", error);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock && !wakeLock.released) {
      await wakeLock.release();
      setIsActive(false);
      setElapsedTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <>
      {!isSupported && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Supported</AlertTitle>
          <AlertDescription>
            The Screen Wake Lock API is not supported in your browser. Please
            try Chrome, Edge, or other modern browsers.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wake Lock Control</CardTitle>
            <CardDescription>Manage screen wake lock state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Power className="h-5 w-5" />
                <span className="font-medium">Status</span>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </div>
            </div>

            {batteryLevel !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Battery className="h-5 w-5" />
                    <span className="font-medium">Battery Level</span>
                  </div>
                  <span className="text-sm">{batteryLevel.toFixed(1)}%</span>
                </div>
                <Progress value={batteryLevel} className="h-2" />
              </div>
            )}

            {isActive && (
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5" />
                <span className="font-medium">Elapsed Time:</span>
                <span className="font-mono">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={isActive ? releaseWakeLock : requestWakeLock}
              disabled={!isSupported}
              className="w-full"
            >
              {isActive ? (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Release Wake Lock
                </>
              ) : (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Request Wake Lock
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auto Release Settings</CardTitle>
            <CardDescription>
              Configure automatic wake lock release
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-release">Enable Auto Release</Label>
              <Switch
                id="auto-release"
                checked={autoRelease}
                onCheckedChange={setAutoRelease}
              />
            </div>

            {autoRelease && (
              <div className="space-y-2">
                <Label htmlFor="release-time">Release After (minutes)</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    id="release-time"
                    min="1"
                    max="60"
                    value={releaseTime}
                    onChange={(e) => setReleaseTime(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded-md"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ScreenWakeExamle;
