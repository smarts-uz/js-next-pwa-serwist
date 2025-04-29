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
import { AlertCircle, Gauge, Lock, Unlock, Activity, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DeviceMotionEvent {
  acceleration: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  accelerationIncludingGravity: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  rotationRate: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  };
  interval: number | null;
  timeStamp: number;
}

type PermissionStatus = "granted" | "denied" | "prompt";

export const DeviceMotionTracker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [motion, setMotion] = useState<DeviceMotionEvent>({
    acceleration: { x: null, y: null, z: null },
    accelerationIncludingGravity: { x: null, y: null, z: null },
    rotationRate: { alpha: null, beta: null, gamma: null },
    interval: null,
    timeStamp: 0,
  });
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus | null>(null);
  const [showGravity, setShowGravity] = useState(false);

  React.useEffect(() => {
    if (typeof DeviceMotionEvent !== "undefined") {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (typeof DeviceMotionEvent !== "undefined") {
      setIsSupported(true);
    }

    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      checkPermission();
    }

    return () => {
      if (isActive) {
        window.removeEventListener("devicemotion", handleMotion);
      }
    };
  }, [isActive]);

  const checkPermission = async () => {
    try {
      const status = (await (
        DeviceMotionEvent as any
      ).requestPermission()) as PermissionStatus;
      setPermissionStatus(status);
    } catch (error) {
      console.error("Permission error:", error);
    }
  };

  const handleMotion = (event: globalThis.DeviceMotionEvent) => {
    setMotion({
      acceleration: {
        x: event.acceleration?.x ?? null,
        y: event.acceleration?.y ?? null,
        z: event.acceleration?.z ?? null,
      },
      accelerationIncludingGravity: {
        x: event.accelerationIncludingGravity?.x ?? null,
        y: event.accelerationIncludingGravity?.y ?? null,
        z: event.accelerationIncludingGravity?.z ?? null,
      },
      rotationRate: {
        alpha: event.rotationRate?.alpha ?? null,
        beta: event.rotationRate?.beta ?? null,
        gamma: event.rotationRate?.gamma ?? null,
      },
      interval: event.interval,
      timeStamp: event.timeStamp,
    });
  };

  const startTracking = () => {
    window.addEventListener("devicemotion", handleMotion);
    setIsActive(true);
  };

  const stopTracking = () => {
    window.removeEventListener("devicemotion", handleMotion);
    setIsActive(false);
  };

  const formatValue = (value: number | null) => {
    if (value === null) return "N/A";
    return `${value.toFixed(2)}`;
  };

  const getProgressValue = (value: number | null, max: number) => {
    if (value === null) return 0;
    return ((value + max) / (max * 2)) * 100;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {!isSupported && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Supported</AlertTitle>
          <AlertDescription>
            The Device Motion API is not supported in your browser or device.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Motion Data</CardTitle>
          <CardDescription>Real-time device motion values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span className="font-medium">Acceleration</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  X: {formatValue(motion.acceleration.x)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Y: {formatValue(motion.acceleration.y)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Z: {formatValue(motion.acceleration.z)}
                </span>
              </div>
            </div>
            <Progress
              value={getProgressValue(motion.acceleration.x, 10)}
              className="h-2"
            />

            {showGravity && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span className="font-medium">With Gravity</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      X: {formatValue(motion.accelerationIncludingGravity.x)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Y: {formatValue(motion.accelerationIncludingGravity.y)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Z: {formatValue(motion.accelerationIncludingGravity.z)}
                    </span>
                  </div>
                </div>
                <Progress
                  value={getProgressValue(
                    motion.accelerationIncludingGravity.x,
                    10
                  )}
                  className="h-2"
                />
              </>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gauge className="h-5 w-5" />
                <span className="font-medium">Rotation Rate</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  α: {formatValue(motion.rotationRate.alpha)}
                </span>
                <span className="text-sm text-muted-foreground">
                  β: {formatValue(motion.rotationRate.beta)}
                </span>
                <span className="text-sm text-muted-foreground">
                  γ: {formatValue(motion.rotationRate.gamma)}
                </span>
              </div>
            </div>
            <Progress
              value={getProgressValue(motion.rotationRate.alpha, 180)}
              className="h-2"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={isActive ? stopTracking : startTracking}
            disabled={!isSupported}
            className="w-full"
          >
            {isActive ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Stop Tracking
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Start Tracking
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
          <CardDescription>Current device state and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-gravity">Show Gravity Data</Label>
              <Switch
                id="show-gravity"
                checked={showGravity}
                onCheckedChange={setShowGravity}
              />
            </div>

            {permissionStatus && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Permission Status</span>
                <span className="text-sm text-muted-foreground">
                  {permissionStatus}
                </span>
              </div>
            )}

            {motion.interval && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Update Interval</span>
                <span className="text-sm text-muted-foreground">
                  {motion.interval}ms
                </span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <h3 className="font-semibold mb-2">Data Ranges</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Acceleration: ±10 m/s²</li>
              <li>• Rotation Rate: ±180°/s</li>
              <li>• Update Rate: Device dependent</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
