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
import {
  AlertCircle,
  Smartphone,
  Compass,
  Gauge,
  Lock,
  Unlock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DeviceOrientationEvent {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
}

type PermissionStatus = "granted" | "denied" | "prompt";

const DeviceOrientationPage = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [orientation, setOrientation] = useState<DeviceOrientationEvent>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
  });
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus | null>(null);

  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    if (typeof DeviceOrientationEvent !== "undefined") {
      setIsSupported(true);
    }

    // Request permission if needed
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      checkPermission();
    }
    return () => {
      if (isActive) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, [isActive]);

  const checkPermission = async () => {
    try {
      const status = (await (
        DeviceOrientationEvent as any
      ).requestPermission()) as PermissionStatus;
      setPermissionStatus(status);
    } catch (error) {
      console.error("Permission error:", error);
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      absolute: event.absolute,
    });
  };

  const startTracking = () => {
    window.addEventListener("deviceorientation", handleOrientation);
    setIsActive(true);
  };

  const stopTracking = () => {
    window.removeEventListener("deviceorientation", handleOrientation);
    setIsActive(false);
  };

  const formatAngle = (angle: number | null) => {
    if (angle === null) return "N/A";
    return `${Math.round(angle)}°`;
  };

  return (
    <>
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Device Orientation API
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Access device orientation and motion data
        </p>
      </div>

      {!isSupported && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Supported</AlertTitle>
          <AlertDescription>
            The Device Orientation API is not supported in your browser or
            device.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Orientation Data</CardTitle>
            <CardDescription>
              Real-time device orientation values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Compass className="h-5 w-5" />
                  <span className="font-medium">Alpha (Z-axis)</span>
                </div>
                <span className="font-mono">
                  {formatAngle(orientation.alpha)}
                </span>
              </div>
              <Progress
                value={
                  orientation.alpha
                    ? ((orientation.alpha + 180) / 360) * 100
                    : 0
                }
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span className="font-medium">Beta (X-axis)</span>
                </div>
                <span className="font-mono">
                  {formatAngle(orientation.beta)}
                </span>
              </div>
              <Progress
                value={
                  orientation.beta ? ((orientation.beta + 90) / 180) * 100 : 0
                }
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5" />
                  <span className="font-medium">Gamma (Y-axis)</span>
                </div>
                <span className="font-mono">
                  {formatAngle(orientation.gamma)}
                </span>
              </div>
              <Progress
                value={
                  orientation.gamma ? ((orientation.gamma + 90) / 180) * 100 : 0
                }
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
            <CardDescription>
              Current device state and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Absolute Orientation</span>
                <span className="text-sm text-muted-foreground">
                  {orientation.absolute ? "Yes" : "No"}
                </span>
              </div>

              {permissionStatus && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Permission Status</span>
                  <span className="text-sm text-muted-foreground">
                    {permissionStatus}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <h3 className="font-semibold mb-2">Axis Information</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Alpha: Rotation around Z-axis (0° to 360°)</li>
                <li>• Beta: Rotation around X-axis (-180° to 180°)</li>
                <li>• Gamma: Rotation around Y-axis (-90° to 90°)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>
            Understanding the Device Orientation API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                What is the Device Orientation API?
              </h3>
              <p className="text-sm text-muted-foreground">
                The Device Orientation API provides access to the device's
                physical orientation and motion data. It allows web applications
                to respond to changes in device orientation and movement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>Access device orientation angles (alpha, beta, gamma)</li>
                <li>Support for absolute and relative orientation</li>
                <li>Permission-based access control</li>
                <li>Real-time orientation updates</li>
                <li>Cross-browser compatibility</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Browser Support</h3>
              <p className="text-sm text-muted-foreground">
                The Device Orientation API is supported in most modern browsers
                on mobile devices. Some browsers may require HTTPS and explicit
                user permission.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Best Practices</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>Always check for API support</li>
                <li>Request permissions when needed</li>
                <li>Handle null values gracefully</li>
                <li>Clean up event listeners</li>
                <li>Consider device compatibility</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Example Use Cases</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                <li>Virtual reality experiences</li>
                <li>Interactive games</li>
                <li>Augmented reality applications</li>
                <li>Device motion tracking</li>
                <li>Orientation-based UI adjustments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DeviceOrientationPage;

