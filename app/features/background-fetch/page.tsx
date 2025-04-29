import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, RefreshCw, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataSyncExample } from "./components/DataSyncExample";
import { ResourcePrefetchExample } from "./components/ResourcePrefetchExample";

export const metadata: Metadata = {
  title: "Background Fetch | Modern Web Features",
  description:
    "Learn how to implement background fetch for improved performance and user experience",
};

export default function BackgroundFetchPage() {
  return (
    <>
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Background Fetch
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Improve user experience by performing data operations in the
            background without blocking the main thread.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link
              href="https://developer.mozilla.org/en-US/docs/Web/API/Background_Fetch_API"
              target="_blank"
            >
              API Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid gap-8">
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              What is Background Fetch?
            </h2>
            <p className="text-muted-foreground">
              Background fetch allows web applications to download and process
              data in the background, even if the user navigates away from the
              page or closes the browser. This enables powerful capabilities
              like offline downloads, data synchronization, and improved
              performance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <CardTitle>Continuous Operation</CardTitle>
                </div>
                <CardDescription>
                  Operations continue in the background even when users navigate
                  away
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Performance</CardTitle>
                </div>
                <CardDescription>
                  Improve perceived performance by pre-fetching resources in the
                  background
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Implementation Examples
            </h2>
            <p className="text-muted-foreground">
              Explore these practical examples of background fetch in action
              using real public APIs.
            </p>
          </div>

          <Tabs defaultValue="data-sync" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="data-sync">Data Synchronization</TabsTrigger>
              <TabsTrigger value="pre-fetch">Resource Pre-fetching</TabsTrigger>
            </TabsList>
            <TabsContent value="data-sync" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Data Synchronization with JSONPlaceholder API
                  </CardTitle>
                  <CardDescription>
                    Keep data in sync between client and server without blocking
                    the UI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataSyncExample />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pre-fetch" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Pre-fetching with Unsplash API</CardTitle>
                  <CardDescription>
                    Improve performance by pre-fetching resources before they're
                    needed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResourcePrefetchExample />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Best Practices
            </h2>
            <p className="text-muted-foreground">
              Follow these guidelines to implement background fetch effectively
              in your applications.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Experience Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Always provide progress indicators for background operations
                  </li>
                  <li>Notify users when background operations complete</li>
                  <li>Allow users to cancel background operations</li>
                  <li>Handle errors gracefully and provide retry options</li>
                  <li>Respect user preferences for data usage</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Technical Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use service workers for persistent background operations
                  </li>
                  <li>Implement proper error handling and retry mechanisms</li>
                  <li>Consider battery and data usage implications</li>
                  <li>Test across different network conditions</li>
                  <li>Implement proper caching strategies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Browser Support
            </h2>
            <p className="text-muted-foreground">
              Background fetch is supported in modern browsers, but
              implementation details may vary.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Supported Browsers
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Chrome 74+</li>
                    <li>Edge 79+</li>
                    <li>Opera 62+</li>
                    <li>Chrome for Android 74+</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Fallback Strategies
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use feature detection to check for support</li>
                    <li>Implement progressive enhancement</li>
                    <li>Provide alternative synchronous methods</li>
                    <li>Consider using Web Workers as an alternative</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
