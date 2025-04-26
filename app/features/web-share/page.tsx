import React from "react";
import WebShareExample from "@/components/WebShareExample";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WebSharePage() {
  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Web Share API</h1>
          <p className="text-muted-foreground">
            Share content with other apps installed on the user's device.
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Browser Support</AlertTitle>
        <AlertDescription>
          The Web Share API is supported in most modern browsers, particularly
          on mobile devices. It requires HTTPS and is most commonly used on
          mobile platforms.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>
            Try sharing content with different options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebShareExample />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>
            Comprehensive documentation of the Web Share API features and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="methods" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="methods">Methods</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="methods" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">navigator.share()</h4>
                <p className="text-sm text-muted-foreground">
                  Initiates sharing of content with other apps.
                </p>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  <code>{`try {
  await navigator.share({
    title: 'Share Title',
    text: 'Share Description',
    url: 'https://example.com'
  });
} catch (error) {
  console.error('Error sharing:', error);
}`}</code>
                </pre>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">navigator.canShare()</h4>
                <p className="text-sm text-muted-foreground">
                  Checks if the specified data can be shared.
                </p>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  <code>{`if (navigator.canShare({
  title: 'Share Title',
  text: 'Share Description'
})) {
  // Proceed with sharing
}`}</code>
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="parameters" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Share Parameters</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>title: Title of the shared content</li>
                  <li>text: Description or text to share</li>
                  <li>url: URL to share</li>
                  <li>files: Array of files to share (optional)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">File Sharing</h4>
                <p className="text-sm text-muted-foreground">
                  File sharing requires the file-handling permission and is only
                  supported in secure contexts.
                </p>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  <code>{`const file = new File(['content'], 'file.txt', { type: 'text/plain' });
await navigator.share({
  title: 'Share File',
  files: [file]
});`}</code>
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Security Requirements</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>HTTPS connection required</li>
                  <li>User interaction required (click, tap)</li>
                  <li>File sharing requires file-handling permission</li>
                  <li>Cross-origin sharing restrictions apply</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Error Handling</h4>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  <code>{`try {
  await navigator.share(data);
} catch (error) {
  if (error.name === 'AbortError') {
    // User cancelled the share
  } else if (error.name === 'NotAllowedError') {
    // Permission denied
  } else {
    // Other errors
  }
}`}</code>
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">About Web Share API</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">What is it?</h3>
              <p className="text-muted-foreground">
                The Web Share API allows web apps to share content with other
                apps installed on the user's device, providing a native sharing
                experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Native sharing experience</li>
                <li>File sharing support</li>
                <li>Cross-platform compatibility</li>
                <li>Fallback support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Use Cases</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Social media sharing</li>
                <li>File sharing</li>
                <li>Content distribution</li>
                <li>App-to-app communication</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Browser Support</h3>
              <p className="text-muted-foreground">
                Widely supported on mobile browsers and some desktop browsers.
                File sharing support varies by platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
