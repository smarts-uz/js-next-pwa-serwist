"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProtocolHandler from "./components/ProtocolHandler";
import { Suspense } from "react";

export default function ProtocolHandlerPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Protocol Handler</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Custom Protocol Registration</CardTitle>
          <CardDescription>
            Register this PWA as a handler for custom URL protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <ProtocolHandler />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Protocol Handlers in PWAs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Web App Protocol Handler API allows web applications to register
            themselves as handlers for specific URL protocols. This enables deep
            linking and integration with other applications.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Register as a handler for custom URL schemes</li>
              <li>Launch the PWA when a registered protocol URL is clicked</li>
              <li>Receive and process data from protocol links</li>
              <li>
                Enable deep linking into specific parts of your application
              </li>
              <li>Integrate with other applications and services</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Note: Protocol handlers require the PWA to be installed and may have
            different registration processes across browsers. The feature
            requires a secure context (HTTPS).
          </p>
        </CardContent>
      </Card>
    </>
  );
}
